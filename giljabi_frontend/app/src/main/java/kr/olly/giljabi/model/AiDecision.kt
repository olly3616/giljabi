package kr.olly.giljabi.model

/**
 * F3(다음 단계 판단)의 출력.
 * AI 가 화면 요소 목록 중 "지금 눌러야 할 딱 하나"와 안내 문구를 결정한 결과.
 *
 * @param targetText    화면 요소 목록과 대조해 좌표를 확정할 대상 텍스트
 * @param guidanceText  말풍선·TTS 로 전달할 안내 문구 (해요체, 한 문장)
 * @param isGoalReached 목표 화면 도달 여부. true 면 안내 루프 종료.
 */
data class AiDecision(
    val targetText: String,
    val guidanceText: String,
    val isGoalReached: Boolean,
)
