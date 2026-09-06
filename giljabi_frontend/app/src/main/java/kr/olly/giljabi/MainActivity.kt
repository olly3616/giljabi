package kr.olly.giljabi

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import kr.olly.giljabi.databinding.ActivityMainBinding

/**
 * 홈 화면 (A-2). M0 에서는 스캐폴딩 확인용 플레이스홀더.
 * M2 에서 목표 선택 UI(GoalCard + 자유 텍스트 입력)로 완성한다.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}
