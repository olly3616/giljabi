package kr.olly.giljabi.accessibility

import android.accessibilityservice.AccessibilityService
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import kr.olly.giljabi.R
import kr.olly.giljabi.overlay.OverlayController
import kr.olly.giljabi.tts.Speaker

/**
 * 접근성 서비스('눈').
 *
 * M1 동작: 다른 앱을 사용하는 동안 화면 변화(사용자 움직임)를 감지한다.
 * 일정 시간(IDLE_MS) 동안 아무 변화가 없으면 = 사용자가 막힌 것으로 보고,
 * 마스코트를 띄워 음성 + 말풍선으로 "도움이 필요하세요?" 하고 먼저 묻는다(F4-a, F5).
 * 사용자가 다시 움직이면 마스코트를 숨긴다.
 *
 * M2 에서 이 자리에 화면 읽기(F1)+AI 판단(F3)을 끼워, 실제로 다음 단계를 안내하도록 확장한다.
 */
class GuideAccessibilityService : AccessibilityService() {

    private var overlay: OverlayController? = null
    private var speaker: Speaker? = null

    private val handler = Handler(Looper.getMainLooper())
    private val idleRunnable = Runnable { onIdle() }

    private var mascotShown = false
    private var currentPackage: String? = null

    override fun onServiceConnected() {
        super.onServiceConnected()
        overlay = OverlayController(this)
        speaker = Speaker(this)
        Log.i(TAG, "접근성 서비스 연결됨")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val pkg = event.packageName?.toString()
        // 우리 앱(오버레이 포함)이 만든 이벤트는 무시 — 마스코트 깜빡임/재귀 방지.
        if (pkg == packageName) return

        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                currentPackage = pkg
                onUserActivity()
            }

            AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED -> onUserActivity()
        }
    }

    /** 사용자가 화면을 움직였을 때: 마스코트를 숨기고 유휴 타이머를 다시 건다. */
    private fun onUserActivity() {
        if (mascotShown) {
            overlay?.hide()
            speaker?.stop()
            mascotShown = false
        }
        handler.removeCallbacks(idleRunnable)
        if (shouldOfferHelp()) {
            handler.postDelayed(idleRunnable, IDLE_MS)
        }
    }

    /** 일정 시간 움직임이 없을 때: 도움을 먼저 제안한다. */
    private fun onIdle() {
        if (mascotShown || !shouldOfferHelp()) return
        overlay?.showHelpOffer(getString(R.string.help_offer_bubble))
        speaker?.speak(getString(R.string.help_offer_tts))
        mascotShown = true
        Log.d(TAG, "유휴 감지 → 마스코트 도움 제안 ($currentPackage)")
    }

    /** 우리 앱이 아닌 다른 앱을 보고 있을 때만 제안한다. */
    private fun shouldOfferHelp(): Boolean =
        currentPackage != null && currentPackage != packageName

    override fun onInterrupt() {
        overlay?.hide()
        mascotShown = false
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(idleRunnable)
        overlay?.hide()
        speaker?.shutdown()
        overlay = null
        speaker = null
    }

    companion object {
        private const val TAG = "Giljabi.A11y"
        private const val IDLE_MS = 5000L
    }
}
