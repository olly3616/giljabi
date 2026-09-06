import React from "react";

/**
 * Mascot — "길이", the guide character. PLACEHOLDER GEOMETRY.
 * Built from CSS shapes so the states, outline and shadow rules are specified and testable.
 * Replace with the illustrator's artwork (transparent PNG per state, or Lottie) keeping the same
 * state names and the 3px ink outline + --shadow-mascot rules.
 * States map 1:1 to the export filenames: idle, walk_1, walk_2, point, celebrate.
 */
export function Mascot({ state = "idle", size = 96, facing = "right", frozen = false, style, ...rest }) {
  const s = size / 96;
  const frame = state === "walk_1" ? 1 : state === "walk_2" ? 2 : 0;
  const base = frame ? "walk" : state;
  const anim = frozen || frame ? "none" : {
    idle: "giljabi-breathe var(--duration-breathe) var(--ease-standard) infinite",
    walk: "giljabi-walk 720ms var(--ease-walk) infinite",
    point: "giljabi-lean 2200ms var(--ease-standard) infinite",
    celebrate: "giljabi-celebrate 900ms var(--ease-celebrate) infinite"
  }[state];
  /* Static walk frames match the exported sprite names walk_1 / walk_2. */
  const frameTilt = frame === 1 ? "translateY(-5px) rotate(-5deg)" : frame === 2 ? "translateY(0) rotate(5deg)" : "none";
  const eye = { width: 10 * s, height: 13 * s, borderRadius: "var(--radius-full)", background: "var(--neutral-900)" };
  const brow = { width: 14 * s, height: 3.5 * s, borderRadius: "var(--radius-full)", background: "var(--neutral-900)" };

  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size,
      transform: facing === "left" ? "scaleX(-1)" : "none", ...style }} {...rest}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "var(--radius-full)",
        background: "radial-gradient(circle at 34% 28%, var(--blue-400) 0%, var(--blue-600) 62%, var(--blue-700) 100%)",
        border: Math.max(3, 3 * s) + "px solid var(--border-ink)", boxShadow: "var(--shadow-mascot)",
        animation: anim, transform: frameTilt, transformOrigin: "50% 92%"
      }}>
        {/* face */}
        <span style={{ position: "absolute", left: "50%", top: "30%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4 * s }}>
          <span style={{ display: "flex", gap: 15 * s }}>
            <span style={brow} /><span style={brow} />
          </span>
          <span style={{ display: "flex", gap: 13 * s }}>
            <span style={eye} /><span style={eye} />
          </span>
          <span style={{
            marginTop: 4 * s,
            width: (base === "celebrate" ? 22 : 24) * s,
            height: (base === "celebrate" ? 15 : 11) * s,
            background: "var(--neutral-900)",
            borderRadius: "0 0 " + 24 * s + "px " + 24 * s + "px",
            clipPath: base === "celebrate" ? "none" : "polygon(0 0, 100% 0, 100% 42%, 50% 100%, 0 42%)"
          }} />
        </span>
        {/* cheeks */}
        <span style={{ position: "absolute", left: "10%", top: "58%", width: 13 * s, height: 8 * s,
          borderRadius: "var(--radius-full)", background: "var(--amber-300)", opacity: .9 }} />
        <span style={{ position: "absolute", right: "10%", top: "58%", width: 13 * s, height: 8 * s,
          borderRadius: "var(--radius-full)", background: "var(--amber-300)", opacity: .9 }} />
      </span>
      {/* feet — offset per walk frame so walk_1 / walk_2 read as a step */}
      {[0, 1].map(i => {
        const lead = frame === 1 ? 0 : frame === 2 ? 1 : -1;
        const fwd = i === lead;
        return (
          <span key={i} aria-hidden="true" style={{
            position: "absolute", bottom: -11 * s, left: (i === 0 ? 16 : 56) * s,
            width: 24 * s, height: 14 * s, borderRadius: "var(--radius-full)",
            background: "var(--blue-700)", border: Math.max(2, 2.5 * s) + "px solid var(--border-ink)",
            transform: fwd ? "translate(" + 10 * s + "px," + -5 * s + "px)" : "none"
          }} />
        );
      })}
      {/* pointing arm */}
      {base === "point" ? (
        <span style={{ position: "absolute", left: "100%", marginLeft: -8 * s, top: "46%", width: 36 * s, height: 12 * s,
          borderRadius: "var(--radius-full)", background: "var(--blue-500)",
          border: Math.max(3, 3 * s) + "px solid var(--border-ink)", transformOrigin: "0 50%",
          animation: frozen || frame ? "none" : "giljabi-point 2200ms var(--ease-standard) infinite" }} />
      ) : null}
      {/* celebration sparks */}
      {base === "celebrate" ? [0, 1, 2].map(i => (
        <span key={i} style={{
          position: "absolute", top: -12 * s + i * 6 * s, left: [8, 44, 78][i] * s,
          width: 12 * s, height: 12 * s, background: "var(--amber-400)",
          border: "2px solid var(--border-ink)", borderRadius: 3 * s,
          transform: "rotate(45deg)", animation: frozen ? "none" : "giljabi-spark 1100ms var(--ease-celebrate) " + i * 140 + "ms infinite"
        }} />
      )) : null}
      <style>{
        "@keyframes giljabi-breathe{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.03) translateY(-2px)}}" +
        "@keyframes giljabi-walk{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-6px) rotate(4deg)}}" +
        "@keyframes giljabi-lean{0%,100%{transform:rotate(0)}50%{transform:rotate(6deg)}}" +
        "@keyframes giljabi-celebrate{0%,100%{transform:translateY(0) scale(1)}45%{transform:translateY(-14px) scale(1.05)}}" +
        "@keyframes giljabi-point{0%,100%{transform:rotate(0)}50%{transform:rotate(-10deg)}}" +
        "@keyframes giljabi-spark{0%{opacity:0;transform:rotate(45deg) scale(.4)}40%{opacity:1;transform:rotate(45deg) scale(1)}100%{opacity:0;transform:rotate(45deg) scale(.7) translateY(-10px)}}"
      }</style>
    </span>
  );
}
