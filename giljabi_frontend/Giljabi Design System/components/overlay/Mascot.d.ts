import * as React from "react";

/**
 * "길이" — the guide character, in its four required states. Placeholder CSS geometry:
 * the state names, outline and shadow rules are the contract; the artwork will be replaced.
 * @startingPoint section="Overlay" subtitle="안내원 캐릭터 — idle/walk/point/celebrate" viewport="700x240"
 */
export interface MascotProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /**
   * idle = waiting, walk = travelling (auto-animated), point = indicating a control, celebrate = task done.
   * walk_1 / walk_2 are the two static step frames; they map 1:1 to the exported sprite filenames
   * and are what the Android build alternates between at ~350ms.
   */
  state?: "idle" | "walk" | "walk_1" | "walk_2" | "point" | "celebrate";
  /** Box size in px. 96 on overlays, 64 in-app, 140+ on completion screens. */
  size?: number;
  /** Mirrors the character so it always faces its target. */
  facing?: "left" | "right";
  /** Stops all motion — use for asset export, spec sheets and reduced-motion contexts. */
  frozen?: boolean;
  style?: React.CSSProperties;
}
export function Mascot(props: MascotProps): React.JSX.Element;
