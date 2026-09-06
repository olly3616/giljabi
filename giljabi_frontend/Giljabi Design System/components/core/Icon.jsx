import React from "react";

/**
 * Icon — thin wrapper over the Lucide icon set (CDN).
 * Lucide is the substituted icon system for Giljabi: bold, single-weight,
 * geometric strokes that stay legible at 48px+. No brand icon set was provided.
 * The host page must load: https://unpkg.com/lucide@latest/dist/umd/lucide.js
 */
export function Icon({ name, size = "md", color = "currentColor", strokeWidth, label, style, ...rest }) {
  const ref = React.useRef(null);
  const px = typeof size === "number" ? size : { sm: 24, md: 32, lg: 48, hero: 64 }[size] || 32;
  const sw = strokeWidth || (px >= 48 ? 2.25 : 2.5);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '<i data-lucide="' + name + '"></i>';
    const draw = () => window.lucide && window.lucide.createIcons({
      attrs: { width: px, height: px, "stroke-width": sw, stroke: color, "stroke-linecap": "round", "stroke-linejoin": "round" },
      nameAttr: "data-lucide", root: el
    });
    draw();
    if (!window.lucide) { const t = setInterval(() => { if (window.lucide) { draw(); clearInterval(t); } }, 120); return () => clearInterval(t); }
  }, [name, px, sw, color]);

  return (
    <span ref={ref} role={label ? "img" : "presentation"} aria-label={label} aria-hidden={label ? undefined : true}
      style={{ display: "inline-flex", width: px, height: px, flex: "0 0 auto", color, ...style }} {...rest} />
  );
}
