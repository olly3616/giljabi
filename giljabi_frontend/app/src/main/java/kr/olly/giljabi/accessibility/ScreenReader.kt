package kr.olly.giljabi.accessibility

import android.graphics.Rect
import android.view.accessibility.AccessibilityNodeInfo
import kr.olly.giljabi.model.ScreenElement

/**
 * F1(화면 읽기)의 핵심 로직.
 * 접근성 서비스가 준 UI 트리(root)를 순회해 [ScreenElement] 목록으로 변환한다.
 *
 * 순수 함수로 분리해 두어 테스트·재사용이 쉽다. 특정 앱에 하드코딩하지 않는다.
 */
object ScreenReader {

    /** 현재 화면의 요소 목록을 수집한다. root 가 null 이면 빈 목록. */
    fun read(root: AccessibilityNodeInfo?): List<ScreenElement> {
        val out = mutableListOf<ScreenElement>()
        traverse(root, out)
        return out
    }

    private fun traverse(node: AccessibilityNodeInfo?, out: MutableList<ScreenElement>) {
        if (node == null) return

        val text = (node.text ?: node.contentDescription)?.toString()?.trim().orEmpty()
        val bounds = Rect().also { node.getBoundsInScreen(it) }

        // 화면에 실제로 그려지고(면적 > 0), 텍스트가 있거나 클릭 가능한 요소만 수집한다.
        val visible = bounds.width() > 0 && bounds.height() > 0
        if (visible && (text.isNotEmpty() || node.isClickable)) {
            out.add(
                ScreenElement(
                    text = text,
                    type = node.className?.toString()?.substringAfterLast('.').orEmpty(),
                    bounds = bounds,
                    clickable = node.isClickable,
                ),
            )
        }

        for (i in 0 until node.childCount) {
            traverse(node.getChild(i), out)
        }
    }
}
