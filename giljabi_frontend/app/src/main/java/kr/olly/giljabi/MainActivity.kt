package kr.olly.giljabi

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import kr.olly.giljabi.accessibility.GuideAccessibilityService
import kr.olly.giljabi.databinding.ActivityMainBinding
import kr.olly.giljabi.guidance.GuidanceState

/**
 * 온보딩/권한 화면 + 목표 시작(A-1, A-2).
 * 권한을 켜도록 안내하고, "기차표 예매하기" 를 누르면 안내 세션을 시작한 뒤
 * 코레일 앱을 열도록 유도한다. 실제 안내는 접근성 서비스가 코레일 위에서 수행.
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
        binding.btnStartTicket.setOnClickListener { startTicketGuidance() }
    }

    override fun onResume() {
        super.onResume()
        refreshStatus()
    }

    private fun startTicketGuidance() {
        if (!isAccessibilityServiceEnabled() || !Settings.canDrawOverlays(this)) {
            toast(getString(R.string.need_permissions_first))
            return
        }
        GuidanceState.start(getString(R.string.goal_ticket_label))
        toast(getString(R.string.goal_started))
        openKorail()
    }

    /** 코레일 앱을 연다. 없으면 안내만. */
    private fun openKorail() {
        val intent = packageManager.getLaunchIntentForPackage(KORAIL_PACKAGE)
        if (intent != null) {
            startActivity(intent)
        } else {
            toast(getString(R.string.korail_not_found))
        }
    }

    private fun refreshStatus() {
        val a11yOn = isAccessibilityServiceEnabled()
        val overlayOn = Settings.canDrawOverlays(this)

        binding.tvA11yStatus.text = getString(R.string.status_label, statusWord(a11yOn))
        binding.tvOverlayStatus.text = getString(R.string.status_label, statusWord(overlayOn))
        binding.tvAllReady.isVisible = a11yOn && overlayOn
        binding.btnStartTicket.isEnabled = a11yOn && overlayOn
    }

    private fun statusWord(on: Boolean): String =
        getString(if (on) R.string.status_on else R.string.status_off)

    private fun isAccessibilityServiceEnabled(): Boolean {
        val expected = "$packageName/${GuideAccessibilityService::class.java.name}"
        val enabled = Settings.Secure.getString(
            contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
        ) ?: return false
        return enabled.split(':').any { it.equals(expected, ignoreCase = true) }
    }

    private fun toast(msg: String) = Toast.makeText(this, msg, Toast.LENGTH_LONG).show()

    companion object {
        private const val KORAIL_PACKAGE = "com.korail.talk"
    }
}
