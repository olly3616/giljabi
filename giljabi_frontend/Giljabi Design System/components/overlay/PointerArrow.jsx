import React from "react";

/** PointerArrow — thick outlined arrow that connects the character to the target. */
export function PointerArrow({ direction = "down", size = 72, nudge = true, style, ...rest }) {
  const rot = { down: 0, up: 180, left: 90, right: -90 }[direction];
  const axis = direction === "left" || direction === "right" ? "X" : "Y";
  const sign = direction === "up" || direction === "left" ? -1 : 1;
  return (
    <span aria-hidden="true" style={{
      display: "inline-block", width: size, height: size,
      animation: nudge ? "giljabi-arrow-nudge 1600ms var(--ease-walk) infinite" : "none", ...style
    }} {...rest}>
      <svg viewBox="0 0 48 48" width={size} height={size} style={{ transform: "rotate(" + rot + "deg)", display: "block",
        filter: "drop-shadow(0 4px 8px rgba(10,15,30,.45))" }}>
        <path d="M24 4 V34 M12 24 L24 36 L36 24" fill="none" stroke="var(--border-ink)" strokeWidth="11"
          strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 4 V34 M12 24 L24 36 L36 24" fill="none" stroke="var(--overlay-arrow)" strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <style>{"@keyframes giljabi-arrow-nudge{0%,100%{transform:translate" + axis + "(0)}50%{transform:translate" + axis + "(" + (sign * 10) + "px)}}"}</style>
    </span>
  );
}
