package kr.olly.giljabi

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.provider.Settings
import androidx.appcompat.app.AppCompatActivity
import kr.olly.giljabi.databinding.ActivitySettingsBinding
import kr.olly.giljabi.settings.SettingsStore

/**
 * 앱 설정 화면. 모든 값은 [SettingsStore](SharedPreferences)에 저장되어
 * 오버레이·음성이 다음 표시부터 반영한다.
 */
class SettingsActivity : AppCompatActivity() {

    private lateinit var b: ActivitySettingsBinding

    private val amber = Color.parseColor("#F5A524")
    private val blue = Color.parseColor("#1A4FD0")
    private val red = Color.parseColor("#C42B1C")
    private val green = Color.parseColor("#12894A")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        b = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(b.root)

        // ---- 초기값 반영 ----
        b.switchFloating.isChecked = SettingsStore.floating(this)
        b.switchBubble.isChecked = SettingsStore.bubble(this)
        b.switchVoice.isChecked = SettingsStore.voice(this)
        b.sliderMascot.value = SettingsStore.mascotScale(this).coerceIn(0.7f, 1.6f)
        b.sliderBubble.value = SettingsStore.bubbleScale(this).coerceIn(0.8f, 1.7f)
        b.sliderRate.value = SettingsStore.ttsRate(this).coerceIn(0.5f, 1.5f)
        b.toggleColor.check(colorIdFor(SettingsStore.markerColor(this)))
        b.toggleLine.check(if (SettingsStore.markerDashed(this)) b.btnDashed.id else b.btnSolid.id)

        // ---- 변경 저장 ----
        b.switchFloating.setOnCheckedChangeListener { _, v -> SettingsStore.putBool(this, SettingsStore.FLOATING, v) }
        b.switchBubble.setOnCheckedChangeListener { _, v -> SettingsStore.putBool(this, SettingsStore.BUBBLE, v) }
        b.switchVoice.setOnCheckedChangeListener { _, v -> SettingsStore.putBool(this, SettingsStore.VOICE, v) }
        b.sliderMascot.addOnChangeListener { _, v, _ -> SettingsStore.putFloat(this, SettingsStore.MASCOT_SCALE, v) }
        b.sliderBubble.addOnChangeListener { _, v, _ -> SettingsStore.putFloat(this, SettingsStore.BUBBLE_SCALE, v) }
        b.sliderRate.addOnChangeListener { _, v, _ -> SettingsStore.putFloat(this, SettingsStore.TTS_RATE, v) }
        b.toggleColor.addOnButtonCheckedListener { _, id, checked -> if (checked) SettingsStore.putInt(this, SettingsStore.MARKER_COLOR, colorForId(id)) }
        b.toggleLine.addOnButtonCheckedListener { _, id, checked -> if (checked) SettingsStore.putBool(this, SettingsStore.MARKER_DASHED, id == b.btnDashed.id) }

        b.btnTtsSettings.setOnClickListener {
            runCatching { startActivity(Intent("com.android.settings.TTS_SETTINGS")) }
                .onFailure {
                    runCatching { startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)) }
                }
        }
    }

    private fun colorForId(id: Int) = when (id) {
        b.colorBlue.id -> blue
        b.colorRed.id -> red
        b.colorGreen.id -> green
        else -> amber
    }

    private fun colorIdFor(c: Int) = when (c) {
        blue -> b.colorBlue.id
        red -> b.colorRed.id
        green -> b.colorGreen.id
        else -> b.colorAmber.id
    }
}
