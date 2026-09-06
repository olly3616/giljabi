import * as React from "react";

/** Amber arrow with a heavy black casing, nudging slowly toward the target. */
export interface PointerArrowProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /** Where the arrow points. */
  direction?: "up" | "down" | "left" | "right";
  /** Box size in px. 72 is the default; never below 48. */
  size?: number;
  /** Slow 1.6s travel nudge along the pointing axis. */
  nudge?: boolean;
  style?: React.CSSProperties;
}
export function PointerArrow(props: PointerArrowProps): React.JSX.Element;
