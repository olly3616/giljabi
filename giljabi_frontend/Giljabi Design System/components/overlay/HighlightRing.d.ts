import * as React from "react";

/**
 * Amber ring with a black outer stroke, wrapped around the control the user should tap.
 * @startingPoint section="Overlay" subtitle="눌러야 할 곳을 감싸는 하이라이트 링" viewport="700x220"
 */
export interface HighlightRingProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /** The host-app element being highlighted (or a stand-in in a mock). */
  children?: React.ReactNode;
  /** Ring geometry matched to the target's shape. */
  shape?: "rect" | "pill" | "circle";
  /** Slow 1.8s breathing pulse. Turn off only if the target itself animates. */
  pulse?: boolean;
  /** Short caption chip above the ring, e.g. "여기예요". */
  label?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}
export function HighlightRing(props: HighlightRingProps): React.JSX.Element;
