package kr.olly.giljabi.guidance

/**
 * 안내 세션의 공유 상태(단일 프로세스).
 * MainActivity(홈)에서 목표를 시작하고, 접근성 서비스가 이를 읽어 안내 루프를 돈다.
 */
object GuidanceState {

    @Volatile
    var activeGoal: String? = null
        private set

    private val _progress = mutableListOf<String>()

    /** 지금까지 안내한 단계(target_text) 기록의 복사본. */
    val progress: List<String>
        @Synchronized get() = _progress.toList()

    val isActive: Boolean
        get() = activeGoal != null

    @Synchronized
    fun start(goal: String) {
        activeGoal = goal
        _progress.clear()
    }

    @Synchronized
    fun addProgress(targetText: String) {
        if (_progress.lastOrNull() != targetText) _progress.add(targetText)
    }

    @Synchronized
    fun stop() {
        activeGoal = null
        _progress.clear()
    }
}
