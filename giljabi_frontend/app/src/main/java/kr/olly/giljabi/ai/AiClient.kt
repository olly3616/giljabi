package kr.olly.giljabi.ai

import kr.olly.giljabi.model.AiDecision
import kr.olly.giljabi.model.ScreenElement

/**
 * F3(다음 단계 판단)의 추상화 경계.
 *
 * 구현체(Gemini / Claude / 백엔드 프록시 등)를 자유롭게 갈아끼울 수 있도록
 * 인터페이스로 분리한다. 코어 루프(안내 컨트롤러)는 이 인터페이스에만 의존한다.
 *
 * 실제 구현은 M2(feat/ai-decision)에서 추가한다.
 */
interface AiClient {

    /**
     * 목표 + 현재 화면 요소 목록 + 지금까지의 진행 상태를 받아
     * "다음 한 단계"를 결정한다.
     *
     * @param goal     사용자가 선택한 목표 (예: "기차표 예매")
     * @param elements F1 이 수집한 현재 화면의 요소 목록
     * @param progress 지금까지 거친 단계(선택한 target_text)의 기록
     * @return 다음에 눌러야 할 요소 + 안내 문구 + 목표 도달 여부
     */
    suspend fun decideNextStep(
        goal: String,
        elements: List<ScreenElement>,
        progress: List<String>,
    ): AiDecision
}
