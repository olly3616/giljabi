package kr.olly.giljabi.ai

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import kr.olly.giljabi.BuildConfig
import kr.olly.giljabi.model.AiDecision
import kr.olly.giljabi.model.ScreenElement
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

/**
 * [AiClient] 의 백엔드 프록시 구현체.
 * 화면 요소 목록을 백엔드 /decide 로 보내고, Gemini 판단(F3)을 돌려받는다.
 * API 키는 백엔드에만 있으므로 앱은 키를 모른다.
 */
class GeminiBackendClient(
    private val baseUrl: String = BuildConfig.BACKEND_URL,
) : AiClient {

    private val json = Json { ignoreUnknownKeys = true }

    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .build()

    override suspend fun decideNextStep(
        goal: String,
        elements: List<ScreenElement>,
        progress: List<String>,
    ): AiDecision = withContext(Dispatchers.IO) {
        val requestDto = DecideRequestDto(
            goal = goal,
            elements = elements
                .filter { it.text.isNotBlank() }
                .map { ElementDto(text = it.text, type = it.type, clickable = it.clickable) },
            progress = progress,
        )

        val body = json.encodeToString(DecideRequestDto.serializer(), requestDto)
            .toRequestBody(JSON_MEDIA)

        val request = Request.Builder()
            .url("$baseUrl/decide")
            .post(body)
            .build()

        client.newCall(request).execute().use { resp ->
            val text = resp.body?.string().orEmpty()
            if (!resp.isSuccessful) {
                error("백엔드 오류 ${resp.code}: $text")
            }
            val dto = json.decodeFromString(DecisionDto.serializer(), text)
            AiDecision(
                targetText = dto.targetText,
                guidanceText = dto.guidanceText,
                isGoalReached = dto.isGoalReached,
            )
        }
    }

    companion object {
        private val JSON_MEDIA = "application/json; charset=utf-8".toMediaType()
    }
}
