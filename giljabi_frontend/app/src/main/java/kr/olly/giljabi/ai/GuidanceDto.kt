package kr.olly.giljabi.ai

import kotlinx.serialization.Serializable

/**
 * 백엔드 /decide 계약용 DTO. 좌표(bounds)는 보내지 않는다 —
 * AI 는 text 로만 대상을 고르고, 앱이 좌표를 확정한다(개인정보·페이로드 최소화).
 */

@Serializable
data class ElementDto(
    val text: String,
    val type: String = "",
    val clickable: Boolean = false,
)

@Serializable
data class DecideRequestDto(
    val goal: String,
    val elements: List<ElementDto>,
    val progress: List<String> = emptyList(),
)

@Serializable
data class DecisionDto(
    val targetText: String,
    val guidanceText: String,
    val isGoalReached: Boolean,
)
