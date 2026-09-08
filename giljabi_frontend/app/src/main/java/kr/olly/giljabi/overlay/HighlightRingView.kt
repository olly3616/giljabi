package kr.olly.giljabi.overlay

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.DashPathEffect
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.util.AttributeSet
import android.util.TypedValue
import android.view.View
import kr.olly.giljabi.settings.SettingsStore

/**
 * 눌러야 할 대상을 감싸는 하이라이트 링(+글로우). 화면 절대 좌표를 그대로 사용.
 * 색상·선 종류(실선/점선)는 사용자 설정(SettingsStore)에서 읽어 적용한다.
 * XML 인플레이트를 위해 (Context, AttributeSet) 생성자를 @JvmOverloads 로 제공한다.
 */
class HighlightRingView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
) : View(context, attrs) {

    private var target: Rect? = null

    private fun dp(v: Float) =
        TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, resources.displayMetrics)

    private val glowPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = dp(10f)
    }
    private val ringPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = dp(3f)
    }

    init {
        importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO
    }

    fun setTarget(rect: Rect) {
        target = Rect(rect)
        applySettings()
        invalidate()
    }

    fun clear() {
        target = null
        invalidate()
    }

    /** 설정에서 마커 색·선 종류를 읽어 페인트에 반영. */
    private fun applySettings() {
        val color = SettingsStore.markerColor(context)
        ringPaint.color = color
        ringPaint.pathEffect =
            if (SettingsStore.markerDashed(context)) DashPathEffect(floatArrayOf(dp(11f), dp(9f)), 0f) else null
        // 글로우는 마커 색의 반투명 버전
        glowPaint.color = Color.argb(115, Color.red(color), Color.green(color), Color.blue(color))
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val r = target ?: return
        val pad = dp(6f)
        val radius = dp(12f)
        val rr = RectF(r.left - pad, r.top - pad, r.right + pad, r.bottom + pad)
        canvas.drawRoundRect(rr, radius, radius, glowPaint)
        canvas.drawRoundRect(rr, radius, radius, ringPaint)
    }
}
