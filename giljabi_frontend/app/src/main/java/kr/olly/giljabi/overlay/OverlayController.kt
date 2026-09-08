package kr.olly.giljabi.overlay

import android.animation.Animator
import android.animation.ObjectAnimator
import android.animation.PropertyValuesHolder
import android.animation.ValueAnimator
import android.content.Context
import android.graphics.PixelFormat
import android.graphics.Rect
import android.provider.Settings
import android.util.Log
import android.util.TypedValue
import android.view.animation.AccelerateDecelerateInterpolator
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
    private var breathAnim: Animator? = null

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

    /**
     * 안내(F4): 대상에 하이라이트 + 마스코트를 대상 옆으로 이동 + 말풍선.
     * target 이 null 이면(화면에서 대상을 못 찾은 경우) 링 없이 하단 중앙에 문구만 안내한다.
     */
    fun showGuide(target: Rect?, message: String) {
        val view = ensure(Kind.GUIDE, R.layout.overlay_guide) ?: return
        val ring = view.findViewById<HighlightRingView>(R.id.ring)
        val bubble = view.findViewById<TextView>(R.id.bubble)
        val mascot = view.findViewById<ImageView>(R.id.mascot)
        bubble?.text = message
        view.post {
            if (target == null) {
                ring?.clear()
                positionAtBottom(view, mascot, bubble)
                return@post
            }
            // 접근성 좌표는 화면 절대 좌표. 오버레이 창이 화면 top 과 어긋나면 보정한다.
            val loc = IntArray(2)
            view.getLocationOnScreen(loc)
            val adj = Rect(
                target.left - loc[0], target.top - loc[1],
                target.right - loc[0], target.bottom - loc[1],
            )
            Log.d("Giljabi.Overlay", "window loc=${loc[0]},${loc[1]} target=$target adj=$adj")
            ring?.setTarget(adj)
            positionNearTarget(view, mascot, bubble, adj)
        }
    }

    /** 축하(목표 도달): 우하단 마스코트(축하 포즈) + 축하 문구. */
    fun showCelebrate(message: String) {
        val view = ensure(Kind.CELEBRATE, R.layout.overlay_mascot) ?: return
        view.findViewById<ImageView>(R.id.mascot)?.setImageResource(R.drawable.mascot_celebrate)
        view.findViewById<TextView>(R.id.bubble)?.text = message
    }

    fun hide() {
        breathAnim?.cancel()
        breathAnim = null
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
        view.findViewById<ImageView>(R.id.mascot)?.let { startBreathing(it) }
        return view
    }

    /** 마스코트가 살아있는 느낌: 2.6초 주기로 부드럽게 커졌다 작아지는 숨쉬기(디자인 시스템). */
    private fun startBreathing(mascot: View) {
        breathAnim?.cancel()
        breathAnim = ObjectAnimator.ofPropertyValuesHolder(
            mascot,
            PropertyValuesHolder.ofFloat(View.SCALE_X, 1f, 1.06f),
            PropertyValuesHolder.ofFloat(View.SCALE_Y, 1f, 1.06f),
        ).apply {
            duration = 1300
            repeatCount = ValueAnimator.INFINITE
            repeatMode = ValueAnimator.REVERSE
            interpolator = AccelerateDecelerateInterpolator()
            start()
        }
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
        val mW = mascot.width; val mH = mascot.height
        val bW = bubble.width; val bH = bubble.height

        // 대상 아래에 [마스코트 → 말풍선] 을 세로로 쌓을 공간이 있으면 아래로, 없으면 위로.
        // 말풍선을 마스코트 너머(대상 반대쪽)에 두어 하이라이트 링을 가리지 않게 한다.
        val mascotY: Float
        val bubbleY: Float
        if (screenH - (target.bottom + gap) >= mH + gap + bH) {
            mascotY = target.bottom + gap
            bubbleY = mascotY + mH + gap
        } else {
            mascotY = target.top - gap - mH
            bubbleY = mascotY - gap - bH
        }

        mascot.translationX = (target.centerX() - mW / 2f).coerceIn(0f, (screenW - mW).toFloat())
        mascot.translationY = mascotY.coerceAtLeast(0f)
        bubble.translationX = (target.centerX() - bW / 2f).coerceIn(0f, (screenW - bW).toFloat())
        bubble.translationY = bubbleY.coerceAtLeast(0f)
    }

    /** 대상을 못 찾았을 때: 하단 중앙에 마스코트 + 말풍선(위)만 표시. */
    private fun positionAtBottom(root: View, mascot: View?, bubble: View?) {
        mascot ?: return
        bubble ?: return
        val gap = dp(8f)
        val cx = root.width / 2f
        val mascotY = root.height - dp(200f) - mascot.height
        mascot.translationX = (cx - mascot.width / 2f).coerceIn(0f, (root.width - mascot.width).toFloat())
        mascot.translationY = mascotY.coerceAtLeast(0f)
        bubble.translationX = (cx - bubble.width / 2f).coerceIn(0f, (root.width - bubble.width).toFloat())
        bubble.translationY = (mascotY - gap - bubble.height).coerceAtLeast(0f)
    }
}
