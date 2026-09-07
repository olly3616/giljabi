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
        if (pkg == packageName) return // 우리 앱(오버레이 포함) 이벤트 무시

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

    private fun onScreenChanged() {
        if (GuidanceState.isActive && isForeignApp()) {
            // 안내 모드: 유휴 제안 타이머/마스코트 정리 후, 화면 정착 시 판단.
            cancelIdleOffer()
            handler.removeCallbacks(guideRunnable)
            handler.postDelayed(guideRunnable, SETTLE_MS)
        } else {
            // 유휴 제안 모드(M1)
            handler.removeCallbacks(guideRunnable)
            lastSignature = null
            onUserActivity()
        }
    }

    // ----- 안내 모드 (F1 → F3 → F4/F5) -----

    private fun runGuiding() {
        if (deciding || !GuidanceState.isActive) return
        val goal = GuidanceState.activeGoal ?: return

        val elements = ScreenReader.read(rootInActiveWindow)
        val signature = elements.asSequence()
            .map { it.text }.filter { it.isNotBlank() }.joinToString("|")
        if (signature.isEmpty() || signature == lastSignature) return
        lastSignature = signature
        deciding = true

        scope.launch {
            try {
                val decision = aiClient.decideNextStep(goal, elements, GuidanceState.progress)
                if (decision.isGoalReached) {
                    overlay?.showCelebrate(getString(R.string.guide_done))
                    speaker?.speak(getString(R.string.guide_done_tts))
                    GuidanceState.stop()
                    handler.postDelayed({ overlay?.hide() }, DONE_HIDE_MS)
                } else {
                    val target = elements.firstOrNull { it.text == decision.targetText }
                    if (target != null) {
                        overlay?.showGuide(target.bounds, decision.guidanceText)
                        speaker?.speak(decision.guidanceText)
                        GuidanceState.addProgress(decision.targetText)
                    } else {
                        Log.w(TAG, "대상 '${decision.targetText}' 을 화면에서 못 찾음")
                        lastSignature = null // 다음 이벤트에서 재시도 허용
                    }
                }
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
