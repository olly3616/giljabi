import React from "react";

/** HighlightRing — the ring drawn around the host-app control the user must tap. */
export function HighlightRing({ children, shape = "rect", pulse = true, label, width, height, style, ...rest }) {
  const radius = shape === "circle" ? "var(--radius-full)" : shape === "pill" ? "var(--radius-full)" : "var(--radius-md)";
  return (
    <span style={{ position: "relative", display: "inline-flex", width, height, ...style }} {...rest}>
      <span aria-hidden="true" style={{
        position: "absolute", inset: -8, borderRadius: radius,
        border: "4px solid var(--overlay-highlight)",
        boxShadow: "0 0 0 3px var(--border-ink), 0 0 0 12px var(--overlay-highlight-glow)",
        animation: pulse ? "giljabi-ring-pulse var(--highlight-pulse) var(--ease-standard) infinite" : "none"
      }} />
      {label ? <span style={{
        position: "absolute", top: -14, left: "50%", transform: "translate(-50%,-100%)",
        padding: "6px 14px", background: "var(--overlay-highlight)", color: "var(--neutral-900)",
        border: "2px solid var(--border-ink)", borderRadius: "var(--radius-full)",
        fontFamily: "var(--font-core)", fontSize: "var(--font-size-caption)", fontWeight: 700, whiteSpace: "nowrap"
      }}>{label}</span> : null}
      {children}
      <style>{"@keyframes giljabi-ring-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.75;transform:scale(1.04)}}"}</style>
    </span>
  );
}
