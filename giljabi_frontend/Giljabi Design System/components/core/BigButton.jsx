import React from "react";
import { Icon } from "./Icon.jsx";

/** BigButton — the single primary action on a screen. Minimum 64dp tall. */
export function BigButton({
  children, variant = "primary", size = "hero", icon, iconEnd,
  disabled = false, fullWidth = true, onClick, style, ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const h = size === "hero" ? "var(--touch-hero)" : size === "comfortable" ? "var(--touch-comfortable)" : "var(--touch-min)";
  const skins = {
    primary: { background: "var(--blue-600)", color: "var(--neutral-0)", border: "2px solid var(--blue-600)" },
    secondary: { background: "var(--neutral-0)", color: "var(--blue-700)", border: "2px solid var(--blue-600)" },
    accent: { background: "var(--amber-300)", color: "var(--neutral-900)", border: "2px solid var(--amber-500)" },
    quiet: { background: "transparent", color: "var(--neutral-600)", border: "2px solid var(--neutral-300)" }
  };
  const pressedSkin = {
    primary: { background: "var(--blue-800)", borderColor: "var(--blue-800)" },
    secondary: { background: "var(--blue-50)" },
    accent: { background: "var(--amber-400)" },
    quiet: { background: "var(--neutral-100)" }
  };
  const skin = disabled
    ? { background: "var(--surface-disabled)", color: "var(--text-disabled)", border: "2px solid var(--neutral-300)" }
    : { ...skins[variant], ...(pressed ? pressedSkin[variant] : null) };

  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--gap-in-control)",
        width: fullWidth ? "100%" : "auto", minHeight: h, padding: "0 var(--space-6)",
        fontFamily: "var(--font-core)", fontSize: "var(--font-size-button)", fontWeight: "var(--font-weight-button)",
        lineHeight: "var(--line-height-button)", letterSpacing: "var(--letter-spacing-normal)",
        borderRadius: "var(--radius-md)", cursor: disabled ? "not-allowed" : "pointer",
        transform: pressed && !disabled ? "scale(var(--press-scale))" : "none",
        transition: "background-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
        boxShadow: disabled ? "none" : "var(--shadow-card)", ...skin, ...style
      }} {...rest}>
      {icon ? <Icon name={icon} size={size === "small" ? "sm" : "md"} /> : null}
      <span>{children}</span>
      {iconEnd ? <Icon name={iconEnd} size={size === "small" ? "sm" : "md"} /> : null}
    </button>
  );
}
