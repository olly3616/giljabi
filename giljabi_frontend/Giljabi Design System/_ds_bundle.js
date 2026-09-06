/* @ds-bundle: {"format":4,"namespace":"GiljabiDesignSystem_48e9df","components":[{"name":"GoalCard","sourcePath":"components/cards/GoalCard.jsx"},{"name":"PermissionCard","sourcePath":"components/cards/PermissionCard.jsx"},{"name":"BigButton","sourcePath":"components/core/BigButton.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"TextField","sourcePath":"components/core/TextField.jsx"},{"name":"CompletionBadge","sourcePath":"components/feedback/CompletionBadge.jsx"},{"name":"HighlightRing","sourcePath":"components/overlay/HighlightRing.jsx"},{"name":"Mascot","sourcePath":"components/overlay/Mascot.jsx"},{"name":"PointerArrow","sourcePath":"components/overlay/PointerArrow.jsx"},{"name":"SpeechBubble","sourcePath":"components/overlay/SpeechBubble.jsx"}],"sourceHashes":{"components/cards/GoalCard.jsx":"c54d8bca1334","components/cards/PermissionCard.jsx":"099a7315dca1","components/core/BigButton.jsx":"30490fc394a2","components/core/Icon.jsx":"a88b598a408d","components/core/TextField.jsx":"78ef4cdb7132","components/feedback/CompletionBadge.jsx":"8e9b80a47c02","components/overlay/HighlightRing.jsx":"06d2e2e036c4","components/overlay/Mascot.jsx":"aa85f74f820a","components/overlay/PointerArrow.jsx":"6e17cfded9aa","components/overlay/SpeechBubble.jsx":"3de7420448d6","ui_kits/android_app/Phone.jsx":"cdc838f0bbe9","ui_kits/android_app/Screens.jsx":"cc1431a7e75c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GiljabiDesignSystem_48e9df = window.GiljabiDesignSystem_48e9df || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — thin wrapper over the Lucide icon set (CDN).
 * Lucide is the substituted icon system for Giljabi: bold, single-weight,
 * geometric strokes that stay legible at 48px+. No brand icon set was provided.
 * The host page must load: https://unpkg.com/lucide@latest/dist/umd/lucide.js
 */
function Icon({
  name,
  size = "md",
  color = "currentColor",
  strokeWidth,
  label,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const px = typeof size === "number" ? size : {
    sm: 24,
    md: 32,
    lg: 48,
    hero: 64
  }[size] || 32;
  const sw = strokeWidth || (px >= 48 ? 2.25 : 2.5);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '<i data-lucide="' + name + '"></i>';
    const draw = () => window.lucide && window.lucide.createIcons({
      attrs: {
        width: px,
        height: px,
        "stroke-width": sw,
        stroke: color,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      nameAttr: "data-lucide",
      root: el
    });
    draw();
    if (!window.lucide) {
      const t = setInterval(() => {
        if (window.lucide) {
          draw();
          clearInterval(t);
        }
      }, 120);
      return () => clearInterval(t);
    }
  }, [name, px, sw, color]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    role: label ? "img" : "presentation",
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: {
      display: "inline-flex",
      width: px,
      height: px,
      flex: "0 0 auto",
      color,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/cards/GoalCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** GoalCard — one thing the user wants to do, picked from the home screen. */
function GoalCard({
  icon,
  label,
  caption,
  tone = "brand",
  selected = false,
  onClick,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const tones = {
    brand: {
      chip: "var(--blue-50)",
      ink: "var(--blue-700)"
    },
    accent: {
      chip: "var(--amber-50)",
      ink: "var(--amber-700)"
    },
    calm: {
      chip: "var(--neutral-100)",
      ink: "var(--neutral-700)"
    }
  }[tone];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    "aria-pressed": selected,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      width: "100%",
      textAlign: "left",
      minHeight: "var(--touch-hero)",
      padding: "var(--space-5)",
      background: selected ? "var(--blue-50)" : "var(--surface-card)",
      border: (selected ? "3px" : "2px") + " solid " + (selected ? "var(--blue-600)" : "var(--border-subtle)"),
      borderRadius: "var(--radius-lg)",
      cursor: "pointer",
      boxShadow: pressed ? "var(--shadow-pressed)" : "var(--shadow-card)",
      transform: pressed ? "scale(var(--press-scale))" : "none",
      transition: "transform var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
      fontFamily: "var(--font-core)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 72,
      height: 72,
      flex: "0 0 auto",
      borderRadius: "var(--radius-md)",
      background: tones.chip
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "lg",
    color: tones.ink
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--font-size-heading)",
      fontWeight: "var(--font-weight-heading)",
      color: "var(--text-primary)",
      letterSpacing: "var(--letter-spacing-normal)"
    }
  }, label), caption ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--font-size-caption)",
      color: "var(--text-secondary)",
      lineHeight: "var(--line-height-caption)"
    }
  }, caption) : null), selected ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: "md",
    color: "var(--blue-700)",
    label: "\uC120\uD0DD\uB428",
    style: {
      marginLeft: "auto"
    }
  }) : null);
}
Object.assign(__ds_scope, { GoalCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/GoalCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/PermissionCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** PermissionCard — one numbered step of the permission walkthrough. */
function PermissionCard({
  step,
  title,
  description,
  icon,
  illustration,
  status = "todo",
  style,
  ...rest
}) {
  const done = status === "done";
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      padding: "var(--space-5)",
      background: "var(--surface-card)",
      border: "2px solid " + (done ? "var(--green-500)" : "var(--border-subtle)"),
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)",
      fontFamily: "var(--font-core)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 48,
      height: 48,
      flex: "0 0 auto",
      borderRadius: "var(--radius-full)",
      background: done ? "var(--green-500)" : "var(--blue-600)",
      color: "var(--neutral-0)",
      fontSize: "var(--font-size-heading)",
      fontWeight: 700
    }
  }, done ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: "md",
    label: "\uC644\uB8CC"
  }) : step), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--font-size-heading)",
      fontWeight: "var(--font-weight-heading)",
      color: "var(--text-primary)",
      letterSpacing: "var(--letter-spacing-normal)"
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 160,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-brand-soft)",
      border: "2px dashed var(--blue-200)",
      color: "var(--blue-600)",
      overflow: "hidden"
    }
  }, illustration || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || "image",
    size: "hero",
    color: "var(--blue-500)"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--font-size-guide)",
      fontWeight: "var(--font-weight-guide)",
      lineHeight: "var(--line-height-guide)",
      color: "var(--text-primary)",
      maxWidth: "var(--text-measure)"
    }
  }, description));
}
Object.assign(__ds_scope, { PermissionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PermissionCard.jsx", error: String((e && e.message) || e) }); }

// components/core/BigButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** BigButton — the single primary action on a screen. Minimum 64dp tall. */
function BigButton({
  children,
  variant = "primary",
  size = "hero",
  icon,
  iconEnd,
  disabled = false,
  fullWidth = true,
  onClick,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const h = size === "hero" ? "var(--touch-hero)" : size === "comfortable" ? "var(--touch-comfortable)" : "var(--touch-min)";
  const skins = {
    primary: {
      background: "var(--blue-600)",
      color: "var(--neutral-0)",
      border: "2px solid var(--blue-600)"
    },
    secondary: {
      background: "var(--neutral-0)",
      color: "var(--blue-700)",
      border: "2px solid var(--blue-600)"
    },
    accent: {
      background: "var(--amber-300)",
      color: "var(--neutral-900)",
      border: "2px solid var(--amber-500)"
    },
    quiet: {
      background: "transparent",
      color: "var(--neutral-600)",
      border: "2px solid var(--neutral-300)"
    }
  };
  const pressedSkin = {
    primary: {
      background: "var(--blue-800)",
      borderColor: "var(--blue-800)"
    },
    secondary: {
      background: "var(--blue-50)"
    },
    accent: {
      background: "var(--amber-400)"
    },
    quiet: {
      background: "var(--neutral-100)"
    }
  };
  const skin = disabled ? {
    background: "var(--surface-disabled)",
    color: "var(--text-disabled)",
    border: "2px solid var(--neutral-300)"
  } : {
    ...skins[variant],
    ...(pressed ? pressedSkin[variant] : null)
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--gap-in-control)",
      width: fullWidth ? "100%" : "auto",
      minHeight: h,
      padding: "0 var(--space-6)",
      fontFamily: "var(--font-core)",
      fontSize: "var(--font-size-button)",
      fontWeight: "var(--font-weight-button)",
      lineHeight: "var(--line-height-button)",
      letterSpacing: "var(--letter-spacing-normal)",
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      transform: pressed && !disabled ? "scale(var(--press-scale))" : "none",
      transition: "background-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
      boxShadow: disabled ? "none" : "var(--shadow-card)",
      ...skin,
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === "small" ? "sm" : "md"
  }) : null, /*#__PURE__*/React.createElement("span", null, children), iconEnd ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconEnd,
    size: size === "small" ? "sm" : "md"
  }) : null);
}
Object.assign(__ds_scope, { BigButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/BigButton.jsx", error: String((e && e.message) || e) }); }

// components/core/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TextField — large-type input with an unmistakable focus state. */
function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  error,
  icon,
  type = "text",
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const borderColor = error ? "var(--red-500)" : focus ? "var(--border-focus)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      width: "100%",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: "var(--font-core)",
      fontSize: "var(--font-size-body-strong)",
      fontWeight: "var(--font-weight-body-strong)",
      color: "var(--text-primary)",
      lineHeight: "var(--line-height-body)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--gap-in-control)",
      minHeight: "var(--touch-comfortable)",
      padding: "0 var(--space-4)",
      background: "var(--surface-card)",
      border: (focus ? "3px" : "2px") + " solid " + borderColor,
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? "0 0 0 var(--focus-ring-width) var(--blue-100)" : "none",
      transition: "box-shadow var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)"
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "md",
    color: "var(--neutral-500)"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-core)",
      fontSize: "var(--font-size-guide)",
      fontWeight: 500,
      color: "var(--text-primary)",
      padding: "var(--space-4) 0"
    }
  }, rest))), error ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      color: "var(--text-danger)",
      fontFamily: "var(--font-core)",
      fontSize: "var(--font-size-caption)",
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "alert-circle",
    size: "sm"
  }), " ", error) : hint ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-secondary)",
      fontFamily: "var(--font-core)",
      fontSize: "var(--font-size-caption)",
      lineHeight: "var(--line-height-caption)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextField.jsx", error: String((e && e.message) || e) }); }

// components/feedback/CompletionBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** CompletionBadge — the "you did it" marker on the completion screen. */
function CompletionBadge({
  title,
  subtitle,
  icon = "check",
  tone = "success",
  size = 140,
  illustration,
  style,
  ...rest
}) {
  const tones = {
    success: {
      ring: "var(--green-500)",
      fill: "var(--green-50)",
      ink: "var(--green-700)"
    },
    accent: {
      ring: "var(--amber-400)",
      fill: "var(--amber-50)",
      ink: "var(--amber-700)"
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--space-5)",
      textAlign: "center",
      fontFamily: "var(--font-core)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-full)",
      background: tones.fill,
      border: "4px solid " + tones.ring,
      boxShadow: "var(--shadow-raised)",
      animation: "giljabi-badge-in var(--duration-slow) var(--ease-celebrate) both"
    }
  }, illustration || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.46),
    color: tones.ink,
    label: "\uC644\uB8CC"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--font-size-title)",
      fontWeight: "var(--font-weight-title)",
      letterSpacing: "var(--letter-spacing-tight)",
      color: "var(--text-primary)"
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: "var(--text-measure)",
      fontSize: "var(--font-size-guide)",
      fontWeight: "var(--font-weight-guide)",
      lineHeight: "var(--line-height-guide)",
      color: "var(--text-secondary)"
    }
  }, subtitle) : null, /*#__PURE__*/React.createElement("style", null, "@keyframes giljabi-badge-in{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}"));
}
Object.assign(__ds_scope, { CompletionBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/CompletionBadge.jsx", error: String((e && e.message) || e) }); }

// components/overlay/HighlightRing.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** HighlightRing — the ring drawn around the host-app control the user must tap. */
function HighlightRing({
  children,
  shape = "rect",
  pulse = true,
  label,
  width,
  height,
  style,
  ...rest
}) {
  const radius = shape === "circle" ? "var(--radius-full)" : shape === "pill" ? "var(--radius-full)" : "var(--radius-md)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      position: "relative",
      display: "inline-flex",
      width,
      height,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: -8,
      borderRadius: radius,
      border: "4px solid var(--overlay-highlight)",
      boxShadow: "0 0 0 3px var(--border-ink), 0 0 0 12px var(--overlay-highlight-glow)",
      animation: pulse ? "giljabi-ring-pulse var(--highlight-pulse) var(--ease-standard) infinite" : "none"
    }
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -14,
      left: "50%",
      transform: "translate(-50%,-100%)",
      padding: "6px 14px",
      background: "var(--overlay-highlight)",
      color: "var(--neutral-900)",
      border: "2px solid var(--border-ink)",
      borderRadius: "var(--radius-full)",
      fontFamily: "var(--font-core)",
      fontSize: "var(--font-size-caption)",
      fontWeight: 700,
      whiteSpace: "nowrap"
    }
  }, label) : null, children, /*#__PURE__*/React.createElement("style", null, "@keyframes giljabi-ring-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.75;transform:scale(1.04)}}"));
}
Object.assign(__ds_scope, { HighlightRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/HighlightRing.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Mascot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mascot — "길이", the guide character. PLACEHOLDER GEOMETRY.
 * Built from CSS shapes so the states, outline and shadow rules are specified and testable.
 * Replace with the illustrator's artwork (transparent PNG per state, or Lottie) keeping the same
 * state names and the 3px ink outline + --shadow-mascot rules.
 * States map 1:1 to the export filenames: idle, walk_1, walk_2, point, celebrate.
 */
function Mascot({
  state = "idle",
  size = 96,
  facing = "right",
  frozen = false,
  style,
  ...rest
}) {
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
  const eye = {
    width: 10 * s,
    height: 13 * s,
    borderRadius: "var(--radius-full)",
    background: "var(--neutral-900)"
  };
  const brow = {
    width: 14 * s,
    height: 3.5 * s,
    borderRadius: "var(--radius-full)",
    background: "var(--neutral-900)"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      position: "relative",
      display: "inline-block",
      width: size,
      height: size,
      transform: facing === "left" ? "scaleX(-1)" : "none",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "var(--radius-full)",
      background: "radial-gradient(circle at 34% 28%, var(--blue-400) 0%, var(--blue-600) 62%, var(--blue-700) 100%)",
      border: Math.max(3, 3 * s) + "px solid var(--border-ink)",
      boxShadow: "var(--shadow-mascot)",
      animation: anim,
      transform: frameTilt,
      transformOrigin: "50% 92%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: "30%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4 * s
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 15 * s
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: brow
  }), /*#__PURE__*/React.createElement("span", {
    style: brow
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 13 * s
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: eye
  }), /*#__PURE__*/React.createElement("span", {
    style: eye
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 4 * s,
      width: (base === "celebrate" ? 22 : 24) * s,
      height: (base === "celebrate" ? 15 : 11) * s,
      background: "var(--neutral-900)",
      borderRadius: "0 0 " + 24 * s + "px " + 24 * s + "px",
      clipPath: base === "celebrate" ? "none" : "polygon(0 0, 100% 0, 100% 42%, 50% 100%, 0 42%)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "10%",
      top: "58%",
      width: 13 * s,
      height: 8 * s,
      borderRadius: "var(--radius-full)",
      background: "var(--amber-300)",
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: "10%",
      top: "58%",
      width: 13 * s,
      height: 8 * s,
      borderRadius: "var(--radius-full)",
      background: "var(--amber-300)",
      opacity: .9
    }
  })), [0, 1].map(i => {
    const lead = frame === 1 ? 0 : frame === 2 ? 1 : -1;
    const fwd = i === lead;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      "aria-hidden": "true",
      style: {
        position: "absolute",
        bottom: -11 * s,
        left: (i === 0 ? 16 : 56) * s,
        width: 24 * s,
        height: 14 * s,
        borderRadius: "var(--radius-full)",
        background: "var(--blue-700)",
        border: Math.max(2, 2.5 * s) + "px solid var(--border-ink)",
        transform: fwd ? "translate(" + 10 * s + "px," + -5 * s + "px)" : "none"
      }
    });
  }), base === "point" ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "100%",
      marginLeft: -8 * s,
      top: "46%",
      width: 36 * s,
      height: 12 * s,
      borderRadius: "var(--radius-full)",
      background: "var(--blue-500)",
      border: Math.max(3, 3 * s) + "px solid var(--border-ink)",
      transformOrigin: "0 50%",
      animation: frozen || frame ? "none" : "giljabi-point 2200ms var(--ease-standard) infinite"
    }
  }) : null, base === "celebrate" ? [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      top: -12 * s + i * 6 * s,
      left: [8, 44, 78][i] * s,
      width: 12 * s,
      height: 12 * s,
      background: "var(--amber-400)",
      border: "2px solid var(--border-ink)",
      borderRadius: 3 * s,
      transform: "rotate(45deg)",
      animation: frozen ? "none" : "giljabi-spark 1100ms var(--ease-celebrate) " + i * 140 + "ms infinite"
    }
  })) : null, /*#__PURE__*/React.createElement("style", null, "@keyframes giljabi-breathe{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.03) translateY(-2px)}}" + "@keyframes giljabi-walk{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-6px) rotate(4deg)}}" + "@keyframes giljabi-lean{0%,100%{transform:rotate(0)}50%{transform:rotate(6deg)}}" + "@keyframes giljabi-celebrate{0%,100%{transform:translateY(0) scale(1)}45%{transform:translateY(-14px) scale(1.05)}}" + "@keyframes giljabi-point{0%,100%{transform:rotate(0)}50%{transform:rotate(-10deg)}}" + "@keyframes giljabi-spark{0%{opacity:0;transform:rotate(45deg) scale(.4)}40%{opacity:1;transform:rotate(45deg) scale(1)}100%{opacity:0;transform:rotate(45deg) scale(.7) translateY(-10px)}}"));
}
Object.assign(__ds_scope, { Mascot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Mascot.jsx", error: String((e && e.message) || e) }); }

// components/overlay/PointerArrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** PointerArrow — thick outlined arrow that connects the character to the target. */
function PointerArrow({
  direction = "down",
  size = 72,
  nudge = true,
  style,
  ...rest
}) {
  const rot = {
    down: 0,
    up: 180,
    left: 90,
    right: -90
  }[direction];
  const axis = direction === "left" || direction === "right" ? "X" : "Y";
  const sign = direction === "up" || direction === "left" ? -1 : 1;
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: "inline-block",
      width: size,
      height: size,
      animation: nudge ? "giljabi-arrow-nudge 1600ms var(--ease-walk) infinite" : "none",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 48 48",
    width: size,
    height: size,
    style: {
      transform: "rotate(" + rot + "deg)",
      display: "block",
      filter: "drop-shadow(0 4px 8px rgba(10,15,30,.45))"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M24 4 V34 M12 24 L24 36 L36 24",
    fill: "none",
    stroke: "var(--border-ink)",
    strokeWidth: "11",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 4 V34 M12 24 L24 36 L36 24",
    fill: "none",
    stroke: "var(--overlay-arrow)",
    strokeWidth: "6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), /*#__PURE__*/React.createElement("style", null, "@keyframes giljabi-arrow-nudge{0%,100%{transform:translate" + axis + "(0)}50%{transform:translate" + axis + "(" + sign * 10 + "px)}}"));
}
Object.assign(__ds_scope, { PointerArrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/PointerArrow.jsx", error: String((e && e.message) || e) }); }

// components/overlay/SpeechBubble.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** SpeechBubble — the character's voice, floating over any host app screen. */
function SpeechBubble({
  children,
  tail = "bottom",
  tailOffset = "50%",
  tone = "default",
  width = 300,
  style,
  ...rest
}) {
  const bg = tone === "accent" ? "var(--amber-100)" : "var(--overlay-bubble-bg)";
  const t = {
    position: "absolute",
    width: 26,
    height: 26,
    background: bg,
    borderRight: "var(--outline-overlay)",
    borderBottom: "var(--outline-overlay)"
  };
  const tails = {
    bottom: {
      ...t,
      left: tailOffset,
      bottom: -14,
      transform: "translateX(-50%) rotate(45deg)"
    },
    top: {
      ...t,
      left: tailOffset,
      top: -14,
      transform: "translateX(-50%) rotate(225deg)"
    },
    left: {
      ...t,
      top: tailOffset,
      left: -14,
      transform: "translateY(-50%) rotate(135deg)"
    },
    right: {
      ...t,
      top: tailOffset,
      right: -14,
      transform: "translateY(-50%) rotate(-45deg)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      display: "inline-block",
      maxWidth: width,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      padding: "var(--space-5) var(--space-5)",
      background: bg,
      color: "var(--overlay-bubble-ink)",
      border: "var(--outline-overlay)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-overlay)",
      fontFamily: "var(--font-core)",
      fontSize: "var(--font-size-guide)",
      fontWeight: "var(--font-weight-guide)",
      lineHeight: "var(--line-height-guide)",
      letterSpacing: "var(--letter-spacing-normal)",
      textWrap: "pretty"
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    style: tails[tail]
  }));
}
Object.assign(__ds_scope, { SpeechBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/SpeechBubble.jsx", error: String((e && e.message) || e) }); }

// ui_kits/android_app/Phone.jsx
try { (() => {
const {
  useState
} = React;
function Phone({
  children,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 360,
      height: 740,
      position: "relative",
      borderRadius: 36,
      overflow: "hidden",
      background: dark ? "#101418" : "var(--surface-page)",
      border: "10px solid #16181c",
      boxShadow: "0 24px 60px rgba(20,24,32,.28)",
      fontFamily: "var(--font-core)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 28,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 18px",
      fontSize: 13,
      fontWeight: 600,
      color: dark ? "#fff" : "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", null, "LTE \u25AE")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: "28px 0 0",
      overflow: "hidden"
    }
  }, children));
}
Object.assign(window, {
  Phone
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/android_app/Phone.jsx", error: String((e && e.message) || e) }); }

// ui_kits/android_app/Screens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  BigButton,
  GoalCard,
  PermissionCard,
  TextField,
  Icon,
  Mascot,
  SpeechBubble,
  HighlightRing,
  PointerArrow,
  CompletionBadge
} = window.GiljabiDesignSystem_48e9df;
const pad = {
  padding: "var(--screen-padding)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--stack-gap)",
  height: "100%",
  boxSizing: "border-box"
};
function Onboarding({
  step,
  onNext,
  onSkip
}) {
  const steps = [{
    title: "길잡이가 도와드려요",
    desc: "화면을 보고, 눌러야 할 곳을 하나씩 알려드려요.",
    icon: "hand-helping",
    cta: "시작할게요"
  }, {
    title: "접근성 켜기",
    desc: "설정에서 길잡이를 찾아 켜주세요.",
    icon: "settings",
    cta: "설정 열기"
  }, {
    title: "화면 위에 표시하기",
    desc: "길잡이가 다른 앱 위에 보이도록 허락해주세요.",
    icon: "layers",
    cta: "허락하기"
  }];
  const s = steps[step];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...pad,
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--stack-gap)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, steps.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: 8,
      borderRadius: 999,
      background: i <= step ? "var(--blue-600)" : "var(--neutral-200)"
    }
  }))), step === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      paddingTop: 28
    }
  }, /*#__PURE__*/React.createElement(Mascot, {
    state: "idle",
    size: 150
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "var(--font-size-title)",
      fontWeight: 700,
      textAlign: "center",
      letterSpacing: "var(--letter-spacing-tight)"
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "var(--text-measure)",
      fontSize: "var(--font-size-guide)",
      fontWeight: 600,
      lineHeight: "var(--line-height-guide)",
      color: "var(--text-secondary)"
    }
  }, s.desc)) : /*#__PURE__*/React.createElement(PermissionCard, {
    step: step,
    title: s.title,
    description: s.desc,
    icon: s.icon
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement(BigButton, {
    icon: step === 0 ? "arrow-right" : "check",
    onClick: onNext
  }, s.cta), step > 0 ? /*#__PURE__*/React.createElement(BigButton, {
    variant: "quiet",
    size: "comfortable",
    onClick: onSkip
  }, "\uB098\uC911\uC5D0 \uD560\uAC8C\uC694") : null));
}
const GOALS = [{
  icon: "train-front",
  label: "기차표 예매",
  caption: "코레일에서 표를 끊어요"
}, {
  icon: "video",
  label: "영상 통화",
  caption: "가족에게 얼굴 보며 전화해요"
}, {
  icon: "banknote",
  label: "계좌 송금",
  caption: "은행 앱에서 돈을 보내요"
}, {
  icon: "pill",
  label: "병원 예약",
  caption: "진료 시간을 잡아요"
}];
function Home({
  onPick
}) {
  const [q, setQ] = useState("");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...pad,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Mascot, {
    state: "idle",
    size: 64
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "var(--font-size-title)",
      fontWeight: 700,
      letterSpacing: "var(--letter-spacing-tight)"
    }
  }, "\uBB34\uC5C7\uC744", /*#__PURE__*/React.createElement("br", null), "\uB3C4\uC640\uB4DC\uB9B4\uAE4C\uC694?")), /*#__PURE__*/React.createElement(TextField, {
    label: "",
    icon: "search",
    placeholder: "\uBB34\uC5C7\uC744 \uD558\uACE0 \uC2F6\uC73C\uC138\uC694?",
    value: q,
    onChange: e => setQ(e.target.value)
  }), GOALS.map(g => /*#__PURE__*/React.createElement(GoalCard, _extends({
    key: g.label
  }, g, {
    onClick: () => onPick(g)
  }))));
}
function HostAppScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      background: "#0f172a",
      color: "#fff",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      fontSize: 20,
      fontWeight: 700,
      borderBottom: "1px solid rgba(255,255,255,.12)"
    }
  }, "\uCF54\uB808\uC77C\uD1A1"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, ["최근 조회", "즐겨찾기", "승차권 확인"].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      padding: "16px 18px",
      borderRadius: 12,
      background: "rgba(255,255,255,.08)",
      fontSize: 16
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderTop: "1px solid rgba(255,255,255,.12)",
      padding: "10px 6px 22px"
    }
  }, ["홈", "승차권 예매", "내 정보"].map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      flex: 1,
      textAlign: "center",
      fontSize: 13,
      opacity: i === 1 ? 1 : .6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      margin: "0 auto 6px",
      borderRadius: 6,
      background: "rgba(255,255,255,.3)"
    }
  }), t))));
}
function Overlay({
  onDone
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(HostAppScreen, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      top: 300
    }
  }, /*#__PURE__*/React.createElement(SpeechBubble, {
    tail: "bottom",
    tailOffset: "60px",
    width: 300
  }, "\uD654\uBA74 \uC544\uB798 \uC2B9\uCC28\uAD8C \uC608\uB9E4\uB97C \uB20C\uB7EC\uC8FC\uC138\uC694.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 20,
      top: 430
    }
  }, /*#__PURE__*/React.createElement(Mascot, {
    state: "point",
    size: 92
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 128,
      top: 520
    }
  }, /*#__PURE__*/React.createElement(PointerArrow, {
    direction: "down",
    size: 64
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 116,
      bottom: 34
    }
  }, /*#__PURE__*/React.createElement(HighlightRing, {
    shape: "rect",
    width: 110,
    height: 60
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onDone,
    style: {
      width: "100%",
      height: "100%",
      background: "transparent",
      border: "none",
      cursor: "pointer"
    },
    "aria-label": "\uC2B9\uCC28\uAD8C \uC608\uB9E4 \uB204\uB974\uAE30"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      display: "flex",
      justifyContent: "center",
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "6px 14px",
      borderRadius: 999,
      background: "var(--neutral-900)",
      color: "#fff",
      fontSize: 14,
      fontWeight: 700,
      border: "2px solid #fff"
    }
  }, "3\uB2E8\uACC4 \uC911 2\uB2E8\uACC4")));
}
function Complete({
  onRestart
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...pad,
      justifyContent: "space-between",
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      paddingTop: 40
    }
  }, /*#__PURE__*/React.createElement(Mascot, {
    state: "celebrate",
    size: 130
  }), /*#__PURE__*/React.createElement(CompletionBadge, {
    title: "\uC798\uD558\uC168\uC5B4\uC694!",
    subtitle: "\uAE30\uCC28\uD45C \uC608\uB9E4\uB97C \uB05D\uB0C8\uC5B4\uC694.",
    size: 110
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement(BigButton, {
    icon: "home",
    onClick: onRestart
  }, "\uCC98\uC74C\uC73C\uB85C"), /*#__PURE__*/React.createElement(BigButton, {
    variant: "secondary",
    size: "comfortable",
    icon: "repeat",
    onClick: onRestart
  }, "\uAC19\uC740 \uC77C \uB2E4\uC2DC \uD558\uAE30")));
}
Object.assign(window, {
  Onboarding,
  Home,
  Overlay,
  Complete,
  GOALS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/android_app/Screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.GoalCard = __ds_scope.GoalCard;

__ds_ns.PermissionCard = __ds_scope.PermissionCard;

__ds_ns.BigButton = __ds_scope.BigButton;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.CompletionBadge = __ds_scope.CompletionBadge;

__ds_ns.HighlightRing = __ds_scope.HighlightRing;

__ds_ns.Mascot = __ds_scope.Mascot;

__ds_ns.PointerArrow = __ds_scope.PointerArrow;

__ds_ns.SpeechBubble = __ds_scope.SpeechBubble;

})();
