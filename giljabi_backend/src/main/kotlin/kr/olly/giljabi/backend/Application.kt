package kr.olly.giljabi.backend

import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.application.log
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import kotlinx.serialization.json.Json

/**
 * 길잡이 백엔드 프록시.
 * Gemini API 키를 서버(환경변수)에만 두고, 앱은 이 서버의 /decide 만 호출한다.
 *
 * 실행: 환경변수 GEMINI_API_KEY 설정 후 `./gradlew run`
 */
fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    val apiKey = System.getenv("GEMINI_API_KEY").orEmpty()
    if (apiKey.isBlank()) {
        System.err.println("[경고] 환경변수 GEMINI_API_KEY 가 없습니다. /decide 는 500 을 반환합니다.")
    }
    embeddedServer(Netty, port = port, host = "0.0.0.0") {
        module(apiKey)
    }.start(wait = true)
}

fun Application.module(apiKey: String) {
    install(ContentNegotiation) {
        json(Json { ignoreUnknownKeys = true })
    }
    install(CallLogging)

    val gemini = GeminiService(apiKey)

    routing {
        get("/health") { call.respondText("ok") }

        post("/decide") {
            val req = call.receive<DecideRequest>()
            runCatching { gemini.decide(req) }
                .onSuccess { call.respond(it) }
                .onFailure {
                    call.application.log.error("decide 실패", it)
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        ErrorResponse(it.message ?: "unknown error"),
                    )
                }
        }
    }
}
