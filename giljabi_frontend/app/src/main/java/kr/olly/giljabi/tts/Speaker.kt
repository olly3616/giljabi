package kr.olly.giljabi.tts

import android.content.Context
import android.speech.tts.TextToSpeech
import kr.olly.giljabi.settings.SettingsStore
import java.util.Locale

/**
 * F5(음성 안내). 안드로이드 기본 TextToSpeech 로 안내 문구를 한국어로 읽는다.
 * 초기화가 비동기이므로, 준비 전에 들어온 요청은 마지막 하나를 보류했다가 재생한다.
 * 음성 켜기/끄기·말하기 속도는 설정(SettingsStore)을 따른다.
 */
class Speaker(context: Context) : TextToSpeech.OnInitListener {

    private val appCtx = context.applicationContext
    private val tts = TextToSpeech(appCtx, this)
    private var ready = false
    private var pending: String? = null

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale.KOREAN
            ready = true
            pending?.let { speak(it) }
            pending = null
        }
    }

    fun speak(text: String) {
        if (!SettingsStore.voice(appCtx)) return // 음성 끔
        if (!ready) {
            pending = text
            return
        }
        tts.setSpeechRate(SettingsStore.ttsRate(appCtx))
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "giljabi")
    }

    fun stop() {
        if (ready) tts.stop()
    }

    fun shutdown() {
        runCatching {
            tts.stop()
            tts.shutdown()
        }
    }
}
