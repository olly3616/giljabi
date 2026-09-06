import React from "react";
import { Icon } from "./Icon.jsx";

/** TextField — large-type input with an unmistakable focus state. */
export function TextField({
  label, hint, value, onChange, placeholder, error, icon,
  type = "text", id, style, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const borderColor = error ? "var(--red-500)" : focus ? "var(--border-focus)" : "var(--border-default)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", width: "100%", ...style }}>
      {label ? (
        <label htmlFor={fieldId} style={{
          fontFamily: "var(--font-core)", fontSize: "var(--font-size-body-strong)", fontWeight: "var(--font-weight-body-strong)",
          color: "var(--text-primary)", lineHeight: "var(--line-height-body)"
        }}>{label}</label>
      ) : null}
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--gap-in-control)",
        minHeight: "var(--touch-comfortable)", padding: "0 var(--space-4)",
        background: "var(--surface-card)", border: (focus ? "3px" : "2px") + " solid " + borderColor,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? "0 0 0 var(--focus-ring-width) var(--blue-100)" : "none",
        transition: "box-shadow var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)"
      }}>
        {icon ? <Icon name={icon} size="md" color="var(--neutral-500)" /> : null}
        <input id={fieldId} type={type} value={value} placeholder={placeholder}
          onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
            fontFamily: "var(--font-core)", fontSize: "var(--font-size-guide)", fontWeight: 500,
            color: "var(--text-primary)", padding: "var(--space-4) 0"
          }} {...rest} />
      </div>
      {error ? (
        <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-danger)",
          fontFamily: "var(--font-core)", fontSize: "var(--font-size-caption)", fontWeight: 600 }}>
          <Icon name="alert-circle" size="sm" /> {error}
        </p>
      ) : hint ? (
        <p style={{ margin: 0, color: "var(--text-secondary)", fontFamily: "var(--font-core)",
          fontSize: "var(--font-size-caption)", lineHeight: "var(--line-height-caption)" }}>{hint}</p>
      ) : null}
    </div>
  );
}
