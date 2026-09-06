import React from "react";
import { Icon } from "../core/Icon.jsx";

/** PermissionCard — one numbered step of the permission walkthrough. */
export function PermissionCard({ step, title, description, icon, illustration, status = "todo", style, ...rest }) {
  const done = status === "done";
  return (
    <section style={{
      display: "flex", flexDirection: "column", gap: "var(--space-4)",
      padding: "var(--space-5)", background: "var(--surface-card)",
      border: "2px solid " + (done ? "var(--green-500)" : "var(--border-subtle)"),
      borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)", fontFamily: "var(--font-core)", ...style
    }} {...rest}>
      <header style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, flex: "0 0 auto",
          borderRadius: "var(--radius-full)", background: done ? "var(--green-500)" : "var(--blue-600)",
          color: "var(--neutral-0)", fontSize: "var(--font-size-heading)", fontWeight: 700
        }}>{done ? <Icon name="check" size="md" label="완료" /> : step}</span>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-heading)", fontWeight: "var(--font-weight-heading)",
          color: "var(--text-primary)", letterSpacing: "var(--letter-spacing-normal)" }}>{title}</h3>
      </header>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: 160, borderRadius: "var(--radius-md)", background: "var(--surface-brand-soft)",
        border: "2px dashed var(--blue-200)", color: "var(--blue-600)", overflow: "hidden"
      }}>
        {illustration || <Icon name={icon || "image"} size="hero" color="var(--blue-500)" />}
      </div>
      <p style={{ margin: 0, fontSize: "var(--font-size-guide)", fontWeight: "var(--font-weight-guide)",
        lineHeight: "var(--line-height-guide)", color: "var(--text-primary)", maxWidth: "var(--text-measure)" }}>{description}</p>
    </section>
  );
}
