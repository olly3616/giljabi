package kr.olly.giljabi.backend

import kotlinx.serialization.Serializable

/**
 * 앱 ↔ 백엔드 계약.
 * 좌표(bounds)는 보내지 않는다 — AI 는 text 로만 대상을 고르고,
 * 앱이 그 text 를 화면 요소와 대조해 좌표를 확정한다(개인정보·페이로드 최소화).
 */

@Serializable
data class ElementDto(
    val text: String,
    val type: String = "",
    val clickable: Boolean = false,
)

@Serializable
data class DecideRequest(
    val goal: String,
    val elements: List<ElementDto>,
    val progress: List<String> = emptyList(),
)

/** F3 출력 — 앱의 AiDecision 과 1:1 대응. */
@Serializable
data class Decision(
    val targetText: String,
    val guidanceText: String,
    val isGoalReached: Boolean,
)

@Serializable
data class ErrorResponse(val error: String)
