package kr.olly.giljabi

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import kr.olly.giljabi.accessibility.GuideAccessibilityService
import kr.olly.giljabi.databinding.ActivityMainBinding

/**
 * 온보딩/권한 화면 (A-1).
 * 접근성 서비스 + 화면 오버레이 권한은 사용자가 시스템 설정에서 직접 켜야 하므로,
 * 여기서는 상태를 보여주고 해당 설정 화면으로 안내한다.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnA11y.setOnClickListener {
            startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
        }
        binding.btnOverlay.setOnClickListener {
            startActivity(
                Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:$packageName"),
                ),
            )
        }
    }

    override fun onResume() {
        super.onResume()
        refreshStatus()
    }

    private fun refreshStatus() {
        val a11yOn = isAccessibilityServiceEnabled()
        val overlayOn = Settings.canDrawOverlays(this)

        binding.tvA11yStatus.text = getString(R.string.status_label, statusWord(a11yOn))
        binding.tvOverlayStatus.text = getString(R.string.status_label, statusWord(overlayOn))
        binding.tvAllReady.isVisible = a11yOn && overlayOn
    }

    private fun statusWord(on: Boolean): String =
        getString(if (on) R.string.status_on else R.string.status_off)

    /** 우리 접근성 서비스가 켜져 있는지 시스템 설정에서 확인한다. */
    private fun isAccessibilityServiceEnabled(): Boolean {
        val expected = "$packageName/${GuideAccessibilityService::class.java.name}"
        val enabled = Settings.Secure.getString(
            contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
        ) ?: return false
        return enabled.split(':').any { it.equals(expected, ignoreCase = true) }
    }
}
