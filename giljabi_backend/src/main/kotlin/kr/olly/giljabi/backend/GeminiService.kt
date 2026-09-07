package kr.olly.giljabi.backend

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.delay
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

/**
 * Gemini 2.5 Flash 에 F3(다음 단계 판단)을 위임한다.
 * JSON 스키마 강제(responseSchema)로 파싱 안정성을 확보한다.
 */
class GeminiService(private val apiKey: String) {

    private val model = System.getenv("GEMINI_MODEL") ?: "gemini-flash-lite-latest"
    private val json = Json { ignoreUnknownKeys = true }

    private val client = HttpClient(CIO) {
        install(ContentNegotiation) { json(json) }
        install(HttpTimeout) {
            requestTimeoutMillis = 60_000
            socketTimeoutMillis = 60_000
            connectTimeoutMillis = 15_000
        }
    }

    /** 사용 가능한 모델 목록 원본 JSON (진단용). */
    suspend fun listModels(): String {
        val resp = client.get("https://generativelanguage.googleapis.com/v1beta/models") {
            header("x-goog-api-key", apiKey)
        }
        return resp.bodyAsText()
    }

    suspend fun decide(req: DecideRequest): Decision {
        require(apiKey.isNotBlank()) { "GEMINI_API_KEY 가 설정되지 않았습니다" }

        // 키는 URL 쿼리 대신 헤더로 — URL/로그/에러 메시지에 키가 노출되지 않도록.
        val url = "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent"

        // lite/flash 는 기본이 빠르고 추론이 없어 thinkingConfig 불필요.
        // (추론형 모델을 쓸 때만 GEMINI_THINKING=off 등으로 확장 예정)
        val thinking: ThinkingConfig? = null
        val body = GeminiRequest(
            systemInstruction = Content(parts = listOf(Part(SYSTEM_PROMPT))),
            contents = listOf(Content(parts = listOf(Part(buildUserPrompt(req))))),
            generationConfig = GenerationConfig(
                responseMimeType = "application/json",
                responseSchema = DECISION_SCHEMA,
                temperature = 0.0,
                thinkingConfig = thinking,
            ),
        )

        // 과부하(503)·레이트리밋(429) 은 일시적이므로 짧은 백오프로 재시도한다.
        var lastError = "알 수 없는 오류"
        repeat(MAX_RETRIES) { attempt ->
            val httpResp = client.post(url) {
                header("x-goog-api-key", apiKey)
                contentType(ContentType.Application.Json)
                setBody(body)
            }
            val raw = httpResp.bodyAsText()

            if (httpResp.status.isSuccess()) {
                val resp = json.decodeFromString(GeminiResponse.serializer(), raw)
                val jsonText = resp.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
                    ?: error("Gemini 응답에 후보/텍스트가 없습니다. 원본=$raw")
                return json.decodeFromString(Decision.serializer(), jsonText)
            }

            // 503(일시 과부하)만 재시도. 429(할당량/레이트리밋)는 초 단위로 안 풀리므로 즉시 실패.
            if (httpResp.status.value == 503) {
                lastError = "Gemini HTTP ${httpResp.status}: $raw"
                delay(RETRY_DELAY_MS * (attempt + 1))
            } else {
                error("Gemini HTTP ${httpResp.status}: $raw")
            }
        }
        error("Gemini 재시도 $MAX_RETRIES 회 모두 실패: $lastError")
    }

    private fun buildUserPrompt(req: DecideRequest): String {
        val elements = req.elements.joinToString("\n") { e ->
            "- \"${e.text}\" (type=${e.type}, clickable=${e.clickable})"
        }
        val progress = if (req.progress.isEmpty()) "(없음)" else req.progress.joinToString(" → ")
        return """
            목표: ${req.goal}
            지금까지 진행: $progress

            현재 화면의 요소 목록:
            $elements
        """.trimIndent()
    }

    companion object {
        private const val MAX_RETRIES = 3
        private const val RETRY_DELAY_MS = 1000L

        private val SYSTEM_PROMPT = """
            당신은 스마트폰이 서툰 사용자를 돕는 화면 안내원입니다.
            사용자의 '목표', '현재 화면 요소 목록', '지금까지 진행'을 보고
            목표 달성을 위해 사용자가 '지금 눌러야 할 딱 하나의 요소'를 고릅니다.

            규칙:
            - targetText 는 반드시 요소 목록의 text 중 하나와 정확히 일치해야 합니다.
            - 한 번에 하나의 행동만 안내합니다. 여러 단계를 몰아서 설명하지 않습니다.
            - guidanceText 는 해요체의 짧고 쉬운 한 문장입니다. 전문용어 금지, 격려를 곁들입니다.
              예: "화면 아래 승차권 예매를 눌러주세요." (22자 내외)
            - 목표와 무관한 광고·홍보 팝업(이벤트 배너, '오늘 하루 보지 않기' 등)이 화면을 덮고 있으면
              먼저 닫도록 안내합니다. 단, 사용자가 값을 고르려고 연 선택 화면(역 선택, 날짜 선택,
              좌석 선택 등 목록이나 검색창이 있는 화면)은 광고가 아니므로 절대 닫으라고 하지 않습니다.
            - 역·날짜·좌석처럼 여러 항목 중 고르는 화면에서는, 특정 항목을 대신 고르지 말고
              사용자가 검색창에 입력하거나 원하는 항목을 직접 누르도록 안내합니다.
              (예: 검색창을 가리키며 "원하는 역 이름을 입력해주세요")
            - 사용자가 특정 이벤트를 콕 집어 요청하지 않았다면 일반적인 예매 경로를 고릅니다.
              계절 프로모션(명절 예매, 이벤트 예매 등)으로 몰지 않습니다.
            - guidanceText 는 화면에 실제로 보이는 그 버튼의 이름을 그대로 부릅니다.
              존재하지 않는 메뉴나 위치를 지어내지 않습니다.
            - 판단은 항상 '지금 화면에 실제로 보이는 상태'를 최우선으로 합니다. 진행 기록은 참고만 합니다.
            - 사용자가 방금 어떤 항목(예: 출발역)을 눌러 설정 화면이나 목록이 열렸다면,
              다른 항목으로 넘어가지 말고 그 화면에서 값을 고르거나 입력하도록 도와줍니다.
            - 검색·예매 화면에서는 출발역·도착역·날짜가 사용자가 원하는 값인지 확인하도록 안내합니다.
              한 항목을 방금 눌렀는데 곧바로 다음 항목이나 조회로 건너뛰지 않습니다.
              값이 모두 사용자가 원하는 대로 맞춰졌을 때 비로소 조회/검색을 안내합니다.
            - 사용자의 선택이 필요한 갈림길(예: 명절 예매 / 일반 예매)에서는 한쪽을 강요하지 않습니다.
              안내 문구에 두 선택지를 모두 알려주어 사용자가 직접 고르게 하고,
              targetText 는 더 일반적인 쪽(일반 예매)을 기본으로 둡니다.
            - 이미 목표 화면에 도달했다면 isGoalReached 를 true 로 하고 축하 문구를 넣습니다.
            - 반드시 JSON 으로만 답합니다.
        """.trimIndent()

        private val DECISION_SCHEMA = Schema(
            type = "OBJECT",
            properties = mapOf(
                "targetText" to Schema(type = "STRING", description = "눌러야 할 요소의 정확한 text"),
                "guidanceText" to Schema(type = "STRING", description = "해요체 한 문장 안내"),
                "isGoalReached" to Schema(type = "BOOLEAN", description = "목표 화면 도달 여부"),
            ),
            required = listOf("targetText", "guidanceText", "isGoalReached"),
        )
    }
}

// ===== Gemini REST DTO =====

@Serializable
data class GeminiRequest(
    val systemInstruction: Content? = null,
    val contents: List<Content>,
    val generationConfig: GenerationConfig? = null,
)

@Serializable
data class Content(
    val parts: List<Part>,
    val role: String? = null,
)

@Serializable
data class Part(val text: String)

@Serializable
data class GenerationConfig(
    val responseMimeType: String? = null,
    val responseSchema: Schema? = null,
    val temperature: Double? = null,
    val thinkingConfig: ThinkingConfig? = null,
)

@Serializable
data class ThinkingConfig(val thinkingBudget: Int)

@Serializable
data class Schema(
    val type: String,
    val properties: Map<String, Schema>? = null,
    val required: List<String>? = null,
    val description: String? = null,
)

@Serializable
data class GeminiResponse(val candidates: List<Candidate>? = null)

@Serializable
data class Candidate(val content: Content? = null)
