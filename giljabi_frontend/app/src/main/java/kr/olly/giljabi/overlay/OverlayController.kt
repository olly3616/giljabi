package kr.olly.giljabi.overlay

import android.content.Context
import android.graphics.PixelFormat
import android.graphics.Rect
import android.provider.Settings
import android.util.TypedValue
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.TextView
import kr.olly.giljabi.R

/**
 * 오버레이('손') 창 관리. 세 가지 표시 모드:
 *  - offer:     화면 우하단 마스코트 + "도움이 필요하세요?" (유휴 제안, M1)
 *  - guide:     대상 하이라이트 링 + 대상 옆으로 이동한 마스코트 + 안내 말풍선 (F4)
 *  - celebrate: 마스코트 + 축하 문구 (목표 도달)
 *
 * 창은 항상 터치 통과(FLAG_NOT_TOUCHABLE) — 사용자가 아래 앱을 그대로 조작.
 */
class OverlayController(private val context: Context) {

    private enum class Kind { OFFER, GUIDE, CELEBRATE }

    private val windowManager =
        context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    private var root: View? = null
    private var kind: Kind? = null

    val canDrawOverlays: Boolean
        get() = Settings.canDrawOverlays(context)

    private fun dp(v: Float) =
        TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, context.resources.displayMetrics)

    // ----- 공개 API -----

    /** 유휴 제안(M1): 우하단 마스코트 + 말풍선. */
    fun showHelpOffer(message: String) {
        val view = ensure(Kind.OFFER, R.layout.overlay_mascot) ?: return
        view.findViewById<TextView>(R.id.bubble)?.text = message
    }

    /** 안내(F4): 대상에 하이라이트 + 마스코트를 대상 옆으로 이동 + 말풍선. */
    fun showGuide(target: Rect, message: String) {
        val view = ensure(Kind.GUIDE, R.layout.overlay_guide) ?: return
        view.findViewById<HighlightRingView>(R.id.ring)?.setTarget(target)
        val bubble = view.findViewById<TextView>(R.id.bubble)
        val mascot = view.findViewById<ImageView>(R.id.mascot)
        bubble?.text = message
        view.post { positionNearTarget(view, mascot, bubble, target) }
    }

    /** 축하(목표 도달): 우하단 마스코트 + 축하 문구. */
    fun showCelebrate(message: String) {
        val view = ensure(Kind.CELEBRATE, R.layout.overlay_mascot) ?: return
        view.findViewById<TextView>(R.id.bubble)?.text = message
    }

    fun hide() {
        root?.let { runCatching { windowManager.removeView(it) } }
        root = null
        kind = null
    }

    // ----- 내부 -----

    /** 요청한 종류의 오버레이를 보장한다. 종류가 다르면 교체. */
    private fun ensure(target: Kind, layoutRes: Int): View? {
        if (!canDrawOverlays) return null
        if (kind == target && root != null) return root

        hide()
        val view = LayoutInflater.from(context).inflate(layoutRes, null)
        windowManager.addView(view, overlayParams())
        root = view
        kind = target
        return view
    }

    private fun overlayParams() = WindowManager.LayoutParams(
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

    /** 마스코트를 대상을 덮지 않게 근처에 두고(F8), 말풍선을 마스코트 위에 둔다. */
    private fun positionNearTarget(root: View, mascot: View?, bubble: View?, target: Rect) {
        mascot ?: return
        bubble ?: return
        val screenW = root.width
        val screenH = root.height
        val gap = dp(8f)

        // 마스코트: 대상 오른쪽 아래에 배치 후 화면 안으로 클램프
        var mx = target.right.toFloat()
        var my = target.bottom.toFloat() + gap
        if (mx + mascot.width > screenW) mx = target.left.toFloat() - mascot.width
        if (mx < 0f) mx = 0f
        if (my + mascot.height > screenH) my = target.top.toFloat() - mascot.height - gap
        if (my < 0f) my = 0f
        mascot.translationX = mx
        mascot.translationY = my

        // 말풍선: 마스코트 위, 오른쪽 정렬. 위 공간 없으면 아래로.
        var by = my - bubble.height - gap
        if (by < 0f) by = my + mascot.height + gap
        var bx = mx + mascot.width - bubble.width
        if (bx < 0f) bx = 0f
        if (bx + bubble.width > screenW) bx = (screenW - bubble.width).toFloat()
        bubble.translationX = bx
        bubble.translationY = by
    }
}
