import React from "react";
import { Icon } from "../core/Icon.jsx";

/** GoalCard — one thing the user wants to do, picked from the home screen. */
export function GoalCard({ icon, label, caption, tone = "brand", selected = false, onClick, style, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  const tones = {
    brand: { chip: "var(--blue-50)", ink: "var(--blue-700)" },
    accent: { chip: "var(--amber-50)", ink: "var(--amber-700)" },
    calm: { chip: "var(--neutral-100)", ink: "var(--neutral-700)" }
  }[tone];

  return (
    <button type="button" onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      aria-pressed={selected}
      style={{
        display: "flex", alignItems: "center", gap: "var(--space-5)", width: "100%", textAlign: "left",
        minHeight: "var(--touch-hero)", padding: "var(--space-5)",
        background: selected ? "var(--blue-50)" : "var(--surface-card)",
        border: (selected ? "3px" : "2px") + " solid " + (selected ? "var(--blue-600)" : "var(--border-subtle)"),
        borderRadius: "var(--radius-lg)", cursor: "pointer",
        boxShadow: pressed ? "var(--shadow-pressed)" : "var(--shadow-card)",
        transform: pressed ? "scale(var(--press-scale))" : "none",
        transition: "transform var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
        fontFamily: "var(--font-core)", ...style
      }} {...rest}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 72, height: 72, flex: "0 0 auto", borderRadius: "var(--radius-md)", background: tones.chip
      }}><Icon name={icon} size="lg" color={tones.ink} /></span>
      <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <span style={{ fontSize: "var(--font-size-heading)", fontWeight: "var(--font-weight-heading)",
          color: "var(--text-primary)", letterSpacing: "var(--letter-spacing-normal)" }}>{label}</span>
        {caption ? <span style={{ fontSize: "var(--font-size-caption)", color: "var(--text-secondary)",
          lineHeight: "var(--line-height-caption)" }}>{caption}</span> : null}
      </span>
      {selected ? <Icon name="check" size="md" color="var(--blue-700)" label="선택됨" style={{ marginLeft: "auto" }} /> : null}
    </button>
  );
}
