package kr.olly.giljabi.accessibility

import android.accessibilityservice.AccessibilityService
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kr.olly.giljabi.R
import kr.olly.giljabi.ai.AiClient
import kr.olly.giljabi.ai.GeminiBackendClient
import kr.olly.giljabi.guidance.GuidanceState
import kr.olly.giljabi.overlay.OverlayController
import kr.olly.giljabi.tts.Speaker

/**
 * 접근성 서비스('눈'). 두 모드로 동작한다.
 *
 *  - 목표 있음(GuidanceState.isActive): 코어 안내 루프.
 *    화면 정착 시 화면 읽기(F1) → 백엔드 판단(F3) → 마스코트가 대상으로 이동+말풍선+음성(F4/F5),
 *    화면이 바뀌면 반복(F6). 목표 도달 시 축하 후 종료.
 *  - 목표 없음: 유휴 제안(M1). 다른 앱에서 잠시 멈추면 마스코트가 도움을 먼저 묻는다.
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

    // 안내 모드 상태
    private var lastSignature: String? = null
    private var lastSpoken: String? = null   // 마지막으로 읽어준 안내 문구 (중복 음성 방지)
    private var deciding = false

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
        // 우리 앱·키보드·시스템 UI 이벤트는 무시 (안내 대상 아님)
        if (isIgnored(pkg)) return

        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                currentPackage = pkg
                onScreenChanged()
            }

            AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED -> onScreenChanged()
        }
    }

    private fun isForeignApp(): Boolean =
        currentPackage != null && currentPackage != packageName

    /** 우리 앱·입력기(키보드)·시스템 UI 는 안내 대상에서 제외. */
    private fun isIgnored(pkg: String?): Boolean {
        if (pkg.isNullOrBlank() || pkg == packageName) return true
        return pkg.contains("inputmethod") ||
            pkg.contains("honeyboard") ||
            pkg == "com.android.systemui"
    }

    private fun onScreenChanged() {
        when {
            // 안내 모드: 목표 대상 앱(코레일)을 보고 있음 → 화면 정착 시 판단.
            GuidanceState.isActive && currentPackage == GuidanceState.targetPackage -> {
                cancelIdleOffer()
                handler.removeCallbacks(guideRunnable)
                handler.postDelayed(guideRunnable, SETTLE_MS)
            }
            // 목표는 있으나 다른 앱을 봄 → 안내 오버레이 숨기고 대기(대상 앱 복귀 시 재개).
            GuidanceState.isActive -> {
                handler.removeCallbacks(guideRunnable)
                lastSignature = null
                lastSpoken = null
                overlay?.hide()
                speaker?.stop()
            }
            // 목표 없음 → 유휴 제안 모드(M1).
            else -> {
                handler.removeCallbacks(guideRunnable)
                lastSignature = null
                lastSpoken = null
                onUserActivity()
            }
        }
    }

    // ----- 안내 모드 (F1 → F3 → F4/F5) -----

    private fun runGuiding() {
        if (deciding || !GuidanceState.isActive) return
        val goal = GuidanceState.activeGoal ?: return

        val elements = ScreenReader.read(rootInActiveWindow)
        val signature = elements.asSequence()
            .map { it.text }.filter { it.isNotBlank() }.joinToString("|")
        if (signature.isEmpty() || signature == lastSignature) {
            Log.d(TAG, "판단 생략 (요소 ${elements.size}개, 시그니처 동일/빈값)")
            return
        }
        lastSignature = signature
        deciding = true
        Log.d(TAG, "runGuiding 시작: pkg=$currentPackage, 요소 ${elements.size}개, 목표=$goal")

        scope.launch {
            try {
                Log.d(TAG, "AI 호출 시작")
                val decision = aiClient.decideNextStep(goal, elements, GuidanceState.progress)
                Log.d(TAG, "AI 응답: target='${decision.targetText}', 도달=${decision.isGoalReached}, 안내='${decision.guidanceText}'")
                if (decision.isGoalReached) {
                    overlay?.showCelebrate(getString(R.string.guide_done))
                    speaker?.speak(getString(R.string.guide_done_tts))
                    GuidanceState.stop()
                    handler.postDelayed({ overlay?.hide() }, DONE_HIDE_MS)
                } else {
                    val target = elements.firstOrNull { it.text == decision.targetText }
                    if (target != null) {
                        overlay?.showGuide(target.bounds, decision.guidanceText)
                        // 같은 안내면 위치만 갱신하고 음성은 반복하지 않는다.
                        if (decision.guidanceText != lastSpoken) {
                            speaker?.speak(decision.guidanceText)
                            lastSpoken = decision.guidanceText
                            GuidanceState.addProgress(decision.targetText)
                            Log.d(TAG, "안내: '${decision.targetText}' bounds=${target.bounds}")
                        }
                    } else {
                        Log.w(TAG, "대상 '${decision.targetText}' 을 화면에서 못 찾음. 화면 텍스트=${elements.map { it.text }.filter { it.isNotBlank() }}")
                        lastSignature = null
                    }
                }
            } catch (e: kotlinx.coroutines.CancellationException) {
                Log.w(TAG, "판단 취소됨(서비스 재시작 등)")
                lastSignature = null
            } catch (e: Exception) {
                Log.e(TAG, "안내 판단 실패", e)
                lastSignature = null
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
        if (mascotShown) {
            mascotShown = false
        }
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
        private const val SETTLE_MS = 700L
        private const val DONE_HIDE_MS = 5000L
    }
}
