package kr.olly.giljabi.backend

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
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

    private val model = System.getenv("GEMINI_MODEL") ?: "gemini-3.6-flash"
    private val json = Json { ignoreUnknownKeys = true }

    private val client = HttpClient(CIO) {
        install(ContentNegotiation) { json(json) }
        install(HttpTimeout) {
            requestTimeoutMillis = 60_000
            socketTimeoutMillis = 60_000
            connectTimeoutMillis = 15_000
        }
    }

    suspend fun decide(req: DecideRequest): Decision {
        require(apiKey.isNotBlank()) { "GEMINI_API_KEY 가 설정되지 않았습니다" }

        // 키는 URL 쿼리 대신 헤더로 — URL/로그/에러 메시지에 키가 노출되지 않도록.
        val url = "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent"

        val body = GeminiRequest(
            systemInstruction = Content(parts = listOf(Part(SYSTEM_PROMPT))),
            contents = listOf(Content(parts = listOf(Part(buildUserPrompt(req))))),
            generationConfig = GenerationConfig(
                responseMimeType = "application/json",
                responseSchema = DECISION_SCHEMA,
                temperature = 0.0,
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

            val code = httpResp.status.value
            if (code == 503 || code == 429) {
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
)

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
