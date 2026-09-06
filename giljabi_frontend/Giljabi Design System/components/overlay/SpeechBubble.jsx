import React from "react";

/** SpeechBubble — the character's voice, floating over any host app screen. */
export function SpeechBubble({ children, tail = "bottom", tailOffset = "50%", tone = "default", width = 300, style, ...rest }) {
  const bg = tone === "accent" ? "var(--amber-100)" : "var(--overlay-bubble-bg)";
  const t = { position: "absolute", width: 26, height: 26, background: bg,
    borderRight: "var(--outline-overlay)", borderBottom: "var(--outline-overlay)" };
  const tails = {
    bottom: { ...t, left: tailOffset, bottom: -14, transform: "translateX(-50%) rotate(45deg)" },
    top: { ...t, left: tailOffset, top: -14, transform: "translateX(-50%) rotate(225deg)" },
    left: { ...t, top: tailOffset, left: -14, transform: "translateY(-50%) rotate(135deg)" },
    right: { ...t, top: tailOffset, right: -14, transform: "translateY(-50%) rotate(-45deg)" }
  };
  return (
    <div style={{ position: "relative", display: "inline-block", maxWidth: width, ...style }} {...rest}>
      <div style={{
        position: "relative", zIndex: 1, padding: "var(--space-5) var(--space-5)",
        background: bg, color: "var(--overlay-bubble-ink)",
        border: "var(--outline-overlay)", borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-overlay)", fontFamily: "var(--font-core)",
        fontSize: "var(--font-size-guide)", fontWeight: "var(--font-weight-guide)",
        lineHeight: "var(--line-height-guide)", letterSpacing: "var(--letter-spacing-normal)",
        textWrap: "pretty"
      }}>{children}</div>
      <span style={tails[tail]} />
    </div>
  );
}
