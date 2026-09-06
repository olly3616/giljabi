import React from "react";
import { Icon } from "../core/Icon.jsx";

/** CompletionBadge — the "you did it" marker on the completion screen. */
export function CompletionBadge({ title, subtitle, icon = "check", tone = "success", size = 140, illustration, style, ...rest }) {
  const tones = {
    success: { ring: "var(--green-500)", fill: "var(--green-50)", ink: "var(--green-700)" },
    accent: { ring: "var(--amber-400)", fill: "var(--amber-50)", ink: "var(--amber-700)" }
  }[tone];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-5)",
      textAlign: "center", fontFamily: "var(--font-core)", ...style }} {...rest}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size,
        borderRadius: "var(--radius-full)", background: tones.fill, border: "4px solid " + tones.ring,
        boxShadow: "var(--shadow-raised)", animation: "giljabi-badge-in var(--duration-slow) var(--ease-celebrate) both"
      }}>
        {illustration || <Icon name={icon} size={Math.round(size * 0.46)} color={tones.ink} label="완료" />}
      </div>
      <h2 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: "var(--font-weight-title)",
        letterSpacing: "var(--letter-spacing-tight)", color: "var(--text-primary)" }}>{title}</h2>
      {subtitle ? <p style={{ margin: 0, maxWidth: "var(--text-measure)", fontSize: "var(--font-size-guide)",
        fontWeight: "var(--font-weight-guide)", lineHeight: "var(--line-height-guide)", color: "var(--text-secondary)" }}>{subtitle}</p> : null}
      <style>{"@keyframes giljabi-badge-in{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}"}</style>
    </div>
  );
}
