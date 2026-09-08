package kr.olly.giljabi.accessibility

import android.accessibilityservice.AccessibilityService
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kr.olly.giljabi.R
import kr.olly.giljabi.ai.AiClient
import kr.olly.giljabi.ai.GeminiBackendClient
import kr.olly.giljabi.guidance.GuidanceState
import kr.olly.giljabi.model.ScreenElement
import kr.olly.giljabi.overlay.OverlayController
import kr.olly.giljabi.tts.Speaker

/**
 * 접근성 서비스('눈'). 두 모드로 동작한다.
 *
 *  - 목표 있음: 코어 안내 루프. 화면이 (시그니처 기준) 바뀌면 화면 읽기(F1) → 백엔드 판단(F3)
 *    → 마스코트 이동+말풍선+음성(F4/F5). 같은 화면이면 유지, 목표 도달 시 축하.
 *  - 목표 없음: 유휴 제안(M1).
 *
 * 코레일 같은 앱은 WINDOW_STATE_CHANGED 를 초당 수차례 쏘므로, 이벤트 종류가 아니라
 * '화면 시그니처가 실제로 바뀌었을 때'만 재판단한다(불필요한 취소/깜빡임 방지).
 */
class GuideAccessibilityService : AccessibilityService() {

    private var overlay: OverlayController? = null
    private var speaker: Speaker? = null
    private val aiClient: AiClient = GeminiBackendClient()

    private val handler = Handler(Looper.getMainLooper())
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    private val guideRunnable = Runnable { runGuiding() }
    private val idleRunnable = Runnable { onIdle() }

    private var currentPackage: String? = null

    private val scrollRunnable = Runnable { relocateTarget() }
    private val repromptRunnable = Runnable { onReprompt() }
    private var repromptCount = 0

    // 안내 모드 상태
    private var shownSignature: String? = null      // 현재 안내를 표시 중인 화면
    private var decidingSignature: String? = null   // 지금 판단 중인 화면
    private var shownTargetText: String? = null     // 현재 가리키는 대상 텍스트(스크롤 재배치용)
    private var shownGuidance: String? = null       // 현재 말풍선 문구
    private var lastSpoken: String? = null
    private var deciding = false
    private var generation = 0
    private var decideJob: Job? = null

    // 유휴 제안 모드 상태
    private var mascotShown = false

    override fun onServiceConnected() {
        super.onServiceConnected()
        overlay = OverlayController(this)
        speaker = Speaker(this)
        Log.i(TAG, "접근성 서비스 연결됨")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        val pkg = event.packageName?.toString()
        if (isIgnored(pkg)) return

        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                currentPackage = pkg
                // 실제로 화면이 바뀌었으면 낡은 안내를 '즉시' 감춘다(설정 대기 없이).
                if (guidingThisApp() && shownSignature != null) {
                    val sig = signatureOf(ScreenReader.read(rootInActiveWindow))
                    if (sig.isNotEmpty() && sig != shownSignature) overlay?.hide()
                }
                onScreenChanged()
            }

            AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED -> onScreenChanged()

            AccessibilityEvent.TYPE_VIEW_SCROLLED -> {
                // 스크롤로 대상이 이동 → 같은 대상을 다시 찾아 마커만 옮긴다(재판단 X).
                if (guidingThisApp() && shownTargetText != null) {
                    handler.removeCallbacks(scrollRunnable)
                    handler.postDelayed(scrollRunnable, SCROLL_MS)
                }
            }
        }
    }

    /** 스크롤 후: 현재 대상 텍스트를 다시 찾아 마커 위치만 갱신. 화면 밖이면 감춤. */
    private fun relocateTarget() {
        if (!guidingThisApp()) return
        val targetText = shownTargetText ?: return
        val guidance = shownGuidance ?: return
        val elements = ScreenReader.read(rootInActiveWindow)
        val target = elements.firstOrNull { it.text == targetText }
            ?: elements.firstOrNull {
                it.text.isNotBlank() && (it.text.contains(targetText) || targetText.contains(it.text))
            }
        if (target != null) overlay?.showGuide(target.bounds, guidance) else overlay?.hide()
    }

    /** 같은 화면에 머무르면 일정 시간마다 부드럽게 다시 안내(어르신 배려, 최대 MAX_REPROMPT 회). */
    private fun scheduleReprompt() {
        repromptCount = 0
        handler.removeCallbacks(repromptRunnable)
        handler.postDelayed(repromptRunnable, REPROMPT_MS)
    }

    private fun onReprompt() {
        val guidance = shownGuidance ?: return
        if (!guidingThisApp() || repromptCount >= MAX_REPROMPT) return
        repromptCount++
        speaker?.speak("천천히 하셔도 돼요. $guidance")
        handler.postDelayed(repromptRunnable, REPROMPT_MS)
    }

    private fun guidingThisApp(): Boolean =
        GuidanceState.isActive && currentPackage == GuidanceState.targetPackage

    private fun isForeignApp(): Boolean =
        currentPackage != null && currentPackage != packageName

    private fun isIgnored(pkg: String?): Boolean {
        if (pkg.isNullOrBlank() || pkg == packageName) return true
        return pkg.contains("inputmethod") ||
            pkg.contains("honeyboard") ||
            pkg == "com.android.systemui"
    }

    private fun onScreenChanged() {
        when {
            guidingThisApp() -> {
                cancelIdleOffer()
                handler.removeCallbacks(guideRunnable)
                handler.postDelayed(guideRunnable, SETTLE_MS)
            }
            // 목표는 있으나 다른 앱을 봄 → 안내 감추고 대기.
            GuidanceState.isActive -> {
                handler.removeCallbacks(guideRunnable)
                resetGuidance(hideOverlay = true)
            }
            // 목표 없음 → 유휴 제안(M1).
            else -> {
                handler.removeCallbacks(guideRunnable)
                resetGuidance(hideOverlay = false)
                onUserActivity()
            }
        }
    }

    /** 안내 상태 초기화. */
    private fun resetGuidance(hideOverlay: Boolean) {
        generation++
        decideJob?.cancel()
        deciding = false
        shownSignature = null
        decidingSignature = null
        shownTargetText = null
        shownGuidance = null
        lastSpoken = null
        repromptCount = 0
        handler.removeCallbacks(scrollRunnable)
        handler.removeCallbacks(repromptRunnable)
        if (hideOverlay) {
            overlay?.hide()
            speaker?.stop()
        }
    }

    // ----- 안내 모드 (F1 → F3 → F4/F5) -----

    private fun signatureOf(elements: List<ScreenElement>): String =
        elements.asSequence()
            .map { it.text }.filter { it.isNotBlank() }
            .joinToString("|")
            .replace(DIGITS, "") // 시계·가격 등 숫자 변화는 무시

    private fun runGuiding() {
        if (!guidingThisApp()) return
        val goal = GuidanceState.activeGoal ?: return

        val elements = ScreenReader.read(rootInActiveWindow)
        if (elements.size < 2) return // 로딩 등 전환 화면 무시
        val signature = signatureOf(elements)
        if (signature.isEmpty()) return
        if (signature == shownSignature) return                 // 이미 이 화면 안내 유지
        if (deciding && signature == decidingSignature) return  // 이미 이 화면 판단 중

        // 화면이 실제로 바뀜 → 진행 중 판단 폐기 + 낡은 안내 감춤 + 새로 판단.
        decideJob?.cancel()
        overlay?.hide()
        lastSpoken = null
        decidingSignature = signature
        deciding = true
        val gen = ++generation
        Log.d(TAG, "runGuiding: 요소 ${elements.size}개 (gen $gen)")

        decideJob = scope.launch {
            try {
                val decision = aiClient.decideNextStep(goal, elements, GuidanceState.progress)
                // 응답이 오는 사이 화면이 바뀌었으면 폐기.
                if (gen != generation || !guidingThisApp()) {
                    Log.d(TAG, "낡은 판단 폐기 (gen $gen≠$generation)")
                    return@launch
                }
                Log.d(TAG, "AI: target='${decision.targetText}', 도달=${decision.isGoalReached}")

                if (decision.isGoalReached) {
                    overlay?.showCelebrate(getString(R.string.guide_done))
                    speaker?.speak(getString(R.string.guide_done_tts))
                    shownSignature = signature
                    GuidanceState.stop()
                    handler.postDelayed({ overlay?.hide() }, DONE_HIDE_MS)
                    return@launch
                }

                // 빈 targetText = "사용자가 목록에서 직접 고르는 화면" → 하이라이트 없이 문구만.
                val target = if (decision.targetText.isBlank()) null
                else elements.firstOrNull { it.text == decision.targetText }
                    ?: elements.firstOrNull {
                        it.text.isNotBlank() &&
                            (it.text.contains(decision.targetText) || decision.targetText.contains(it.text))
                    }

                overlay?.showGuide(target?.bounds, decision.guidanceText)
                shownSignature = signature
                shownTargetText = decision.targetText.ifBlank { null }
                shownGuidance = decision.guidanceText
                if (decision.guidanceText != lastSpoken) {
                    speaker?.speak(decision.guidanceText)
                    lastSpoken = decision.guidanceText
                    if (decision.targetText.isNotBlank()) GuidanceState.addProgress(decision.targetText)
                }
                if (target == null && decision.targetText.isNotBlank()) {
                    Log.w(TAG, "대상 '${decision.targetText}' 못 찾음 — 문구만 표시")
                }
                scheduleReprompt() // 안 누르고 가만히 있으면 재안내(B-3)
            } catch (e: kotlinx.coroutines.CancellationException) {
                Log.w(TAG, "판단 취소됨")
            } catch (e: Exception) {
                Log.e(TAG, "안내 판단 실패", e)
            } finally {
                deciding = false
            }
        }
    }

    // ----- 유휴 제안 모드 (M1) -----

    private fun onUserActivity() {
        if (mascotShown) {
            overlay?.hide()
            speaker?.stop()
            mascotShown = false
        }
        handler.removeCallbacks(idleRunnable)
        if (isForeignApp()) handler.postDelayed(idleRunnable, IDLE_MS)
    }

    private fun onIdle() {
        if (mascotShown || GuidanceState.isActive || !isForeignApp()) return
        overlay?.showHelpOffer(getString(R.string.help_offer_bubble))
        speaker?.speak(getString(R.string.help_offer_tts))
        mascotShown = true
    }

    private fun cancelIdleOffer() {
        handler.removeCallbacks(idleRunnable)
        mascotShown = false
    }

    override fun onInterrupt() {
        overlay?.hide()
        mascotShown = false
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        scope.cancel()
        overlay?.hide()
        speaker?.shutdown()
        overlay = null
        speaker = null
    }

    companion object {
        private const val TAG = "Giljabi.A11y"
        private const val IDLE_MS = 5000L
        private const val SETTLE_MS = 650L
        private const val SCROLL_MS = 180L
        private const val DONE_HIDE_MS = 6000L
        private const val REPROMPT_MS = 14000L
        private const val MAX_REPROMPT = 3
        private val DIGITS = Regex("[0-9]")
    }
}
