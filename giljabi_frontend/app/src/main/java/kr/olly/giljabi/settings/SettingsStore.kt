package kr.olly.giljabi.settings

import android.content.Context
import android.graphics.Color

/**
 * 사용자 설정 저장소(SharedPreferences). 액티비티와 접근성 서비스가 같은 프로세스에서 공유한다.
 * 값이 바뀌면 오버레이/음성이 다음 표시부터 반영한다.
 */
object SettingsStore {

    private const val PREFS = "giljabi_settings"

    const val FLOATING = "floating_enabled"      // 마스코트 상시 표시(현재는 유휴 제안)
    const val BUBBLE = "bubble_enabled"          // 말풍선 표시
    const val BUBBLE_SCALE = "bubble_scale"      // 말풍선 글씨 배율
    const val MASCOT_SCALE = "mascot_scale"      // 마스코트 크기 배율
    const val MARKER_COLOR = "marker_color"      // 하이라이트 링 색
    const val MARKER_DASHED = "marker_dashed"    // 링 선 종류(점선 여부)
    const val VOICE = "voice_enabled"            // 음성 안내
    const val TTS_RATE = "tts_rate"              // 말하기 속도

    val DEFAULT_MARKER: Int = Color.parseColor("#F5A524") // amber-400

    private fun p(c: Context) = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun floating(c: Context) = p(c).getBoolean(FLOATING, true)
    fun bubble(c: Context) = p(c).getBoolean(BUBBLE, true)
    fun bubbleScale(c: Context) = p(c).getFloat(BUBBLE_SCALE, 1.0f)
    fun mascotScale(c: Context) = p(c).getFloat(MASCOT_SCALE, 1.0f)
    fun markerColor(c: Context) = p(c).getInt(MARKER_COLOR, DEFAULT_MARKER)
    fun markerDashed(c: Context) = p(c).getBoolean(MARKER_DASHED, false)
    fun voice(c: Context) = p(c).getBoolean(VOICE, true)
    fun ttsRate(c: Context) = p(c).getFloat(TTS_RATE, 1.0f)

    fun putBool(c: Context, key: String, v: Boolean) = p(c).edit().putBoolean(key, v).apply()
    fun putFloat(c: Context, key: String, v: Float) = p(c).edit().putFloat(key, v).apply()
    fun putInt(c: Context, key: String, v: Int) = p(c).edit().putInt(key, v).apply()
}
