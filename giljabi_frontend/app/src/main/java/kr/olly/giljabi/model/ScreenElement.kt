package kr.olly.giljabi.model

import android.graphics.Rect

/**
 * F1(화면 읽기)의 출력 단위.
 * 접근성 서비스가 현재 화면에서 수집한 UI 요소 하나를 표현한다.
 *
 * @param text      요소에 표시된 텍스트 (예: "승차권 예매")
 * @param type      요소 유형 (예: "Button", "TextView") — className 단순화
 * @param bounds    화면상의 좌표 (getBoundsInScreen 결과)
 * @param clickable 클릭 가능 여부
 */
data class ScreenElement(
    val text: String,
    val type: String,
    val bounds: Rect,
    val clickable: Boolean,
) {
    /** 캐릭터가 가리킬 중심 좌표 */
    val centerX: Int get() = bounds.centerX()
    val centerY: Int get() = bounds.centerY()
}
