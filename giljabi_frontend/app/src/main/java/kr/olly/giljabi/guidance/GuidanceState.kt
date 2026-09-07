package kr.olly.giljabi.guidance

/**
 * 안내 세션의 공유 상태(단일 프로세스).
 * MainActivity(홈)에서 목표를 시작하고, 접근성 서비스가 이를 읽어 안내 루프를 돈다.
 */
object GuidanceState {

    @Volatile
    var activeGoal: String? = null
        private set

    /** 안내를 수행할 대상 앱 패키지. 이 앱을 보고 있을 때만 안내한다. */
    @Volatile
    var targetPackage: String? = null
        private set

    private val _progress = mutableListOf<String>()

    /** 지금까지 안내한 단계(target_text) 기록의 복사본. */
    val progress: List<String>
        @Synchronized get() = _progress.toList()

    val isActive: Boolean
        get() = activeGoal != null

    @Synchronized
    fun start(goal: String, targetPackage: String) {
        activeGoal = goal
        this.targetPackage = targetPackage
        _progress.clear()
    }

    @Synchronized
    fun addProgress(targetText: String) {
        if (_progress.lastOrNull() != targetText) _progress.add(targetText)
    }

    @Synchronized
    fun stop() {
        activeGoal = null
        targetPackage = null
        _progress.clear()
    }
}
