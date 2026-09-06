const { BigButton, GoalCard, PermissionCard, TextField, Icon, Mascot, SpeechBubble, HighlightRing, PointerArrow, CompletionBadge } = window.GiljabiDesignSystem_48e9df;

const pad = { padding: "var(--screen-padding)", display: "flex", flexDirection: "column", gap: "var(--stack-gap)", height: "100%", boxSizing: "border-box" };

function Onboarding({ step, onNext, onSkip }) {
  const steps = [
    { title: "길잡이가 도와드려요", desc: "화면을 보고, 눌러야 할 곳을 하나씩 알려드려요.", icon: "hand-helping", cta: "시작할게요" },
    { title: "접근성 켜기", desc: "설정에서 길잡이를 찾아 켜주세요.", icon: "settings", cta: "설정 열기" },
    { title: "화면 위에 표시하기", desc: "길잡이가 다른 앱 위에 보이도록 허락해주세요.", icon: "layers", cta: "허락하기" }
  ];
  const s = steps[step];
  return (
    <div style={{ ...pad, justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--stack-gap)" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {steps.map((_, i) => (
            <span key={i} style={{ flex: 1, height: 8, borderRadius: 999,
              background: i <= step ? "var(--blue-600)" : "var(--neutral-200)" }} />
          ))}
        </div>
        {step === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 28 }}>
            <Mascot state="idle" size={150} />
            <h1 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700, textAlign: "center",
              letterSpacing: "var(--letter-spacing-tight)" }}>{s.title}</h1>
            <p style={{ margin: 0, textAlign: "center", maxWidth: "var(--text-measure)",
              fontSize: "var(--font-size-guide)", fontWeight: 600, lineHeight: "var(--line-height-guide)",
              color: "var(--text-secondary)" }}>{s.desc}</p>
          </div>
        ) : (
          <PermissionCard step={step} title={s.title} description={s.desc} icon={s.icon} />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
        <BigButton icon={step === 0 ? "arrow-right" : "check"} onClick={onNext}>{s.cta}</BigButton>
        {step > 0 ? <BigButton variant="quiet" size="comfortable" onClick={onSkip}>나중에 할게요</BigButton> : null}
      </div>
    </div>
  );
}

const GOALS = [
  { icon: "train-front", label: "기차표 예매", caption: "코레일에서 표를 끊어요" },
  { icon: "video", label: "영상 통화", caption: "가족에게 얼굴 보며 전화해요" },
  { icon: "banknote", label: "계좌 송금", caption: "은행 앱에서 돈을 보내요" },
  { icon: "pill", label: "병원 예약", caption: "진료 시간을 잡아요" }
];

function Home({ onPick }) {
  const [q, setQ] = useState("");
  return (
    <div style={{ ...pad, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Mascot state="idle" size={64} />
        <h1 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700,
          letterSpacing: "var(--letter-spacing-tight)" }}>무엇을<br />도와드릴까요?</h1>
      </div>
      <TextField label="" icon="search" placeholder="무엇을 하고 싶으세요?" value={q} onChange={e => setQ(e.target.value)} />
      {GOALS.map(g => <GoalCard key={g.label} {...g} onClick={() => onPick(g)} />)}
    </div>
  );
}

function HostAppScreen() {
  return (
    <div style={{ height: "100%", background: "#0f172a", color: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px", fontSize: 20, fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,.12)" }}>코레일톡</div>
      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        {["최근 조회", "즐겨찾기", "승차권 확인"].map(t => (
          <div key={t} style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,.08)", fontSize: 16 }}>{t}</div>
        ))}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,.12)", padding: "10px 6px 22px" }}>
        {["홈", "승차권 예매", "내 정보"].map((t, i) => (
          <div key={t} style={{ flex: 1, textAlign: "center", fontSize: 13, opacity: i === 1 ? 1 : .6 }}>
            <div style={{ width: 24, height: 24, margin: "0 auto 6px", borderRadius: 6, background: "rgba(255,255,255,.3)" }} />{t}
          </div>
        ))}
      </div>
    </div>
  );
}

function Overlay({ onDone }) {
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <HostAppScreen />
      <div style={{ position: "absolute", left: 16, right: 16, top: 300 }}>
        <SpeechBubble tail="bottom" tailOffset="60px" width={300}>화면 아래 승차권 예매를 눌러주세요.</SpeechBubble>
      </div>
      <div style={{ position: "absolute", left: 20, top: 430 }}><Mascot state="point" size={92} /></div>
      <div style={{ position: "absolute", left: 128, top: 520 }}><PointerArrow direction="down" size={64} /></div>
      <div style={{ position: "absolute", left: 116, bottom: 34 }}>
        <HighlightRing shape="rect" width={110} height={60}>
          <button onClick={onDone} style={{ width: "100%", height: "100%", background: "transparent", border: "none", cursor: "pointer" }} aria-label="승차권 예매 누르기" />
        </HighlightRing>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "center", padding: 10 }}>
        <span style={{ padding: "6px 14px", borderRadius: 999, background: "var(--neutral-900)", color: "#fff",
          fontSize: 14, fontWeight: 700, border: "2px solid #fff" }}>3단계 중 2단계</span>
      </div>
    </div>
  );
}

function Complete({ onRestart }) {
  return (
    <div style={{ ...pad, justifyContent: "space-between", alignItems: "center", textAlign: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 40 }}>
        <Mascot state="celebrate" size={130} />
        <CompletionBadge title="잘하셨어요!" subtitle="기차표 예매를 끝냈어요." size={110} />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
        <BigButton icon="home" onClick={onRestart}>처음으로</BigButton>
        <BigButton variant="secondary" size="comfortable" icon="repeat" onClick={onRestart}>같은 일 다시 하기</BigButton>
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding, Home, Overlay, Complete, GOALS });
