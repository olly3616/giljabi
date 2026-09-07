package kr.olly.giljabi.overlay

import android.content.Context
import android.graphics.PixelFormat
import android.provider.Settings
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.TextView
import kr.olly.giljabi.R

/**
 * 오버레이('손')의 창(Window) 수명주기를 관리한다.
 * 화면 우하단에 마스코트 + 말풍선을 띄운다. 터치는 통과시켜 아래 앱을 그대로 쓸 수 있게 한다.
 *
 * M2 에서 마스코트를 목표 좌표로 이동시키고(F4-a) 가리키는 동작을 붙인다.
 */
class OverlayController(private val context: Context) {

    private val windowManager =
        context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    private var root: View? = null

    /** 오버레이 권한(SYSTEM_ALERT_WINDOW) 보유 여부. */
    val canDrawOverlays: Boolean
        get() = Settings.canDrawOverlays(context)

    val isShowing: Boolean
        get() = root != null

    /** 마스코트를 띄우고 말풍선에 [message] 를 표시한다. */
    fun showHelpOffer(message: String) {
        if (!canDrawOverlays) return

        if (root == null) {
            val view = LayoutInflater.from(context).inflate(R.layout.overlay_mascot, null)
            val params = WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                PixelFormat.TRANSLUCENT,
            ).apply {
                gravity = Gravity.TOP or Gravity.START
                x = 0
                y = 0
            }
            windowManager.addView(view, params)
            root = view
        }

        root?.findViewById<TextView>(R.id.bubble)?.text = message
    }

    /** 오버레이를 제거한다. */
    fun hide() {
        root?.let { runCatching { windowManager.removeView(it) } }
        root = null
    }
}
