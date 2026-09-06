import * as React from "react";

/**
 * The character's instruction bubble, drawn on top of another app. Opaque fill, 3px ink outline, deep drop shadow.
 * @startingPoint section="Overlay" subtitle="오버레이 말풍선 — 꼬리 방향 가변" viewport="700x260"
 */
export interface SpeechBubbleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  /** One instruction. 24sp, one action, under 40 Korean characters. */
  children: React.ReactNode;
  /** Which edge the tail sits on — point it at the character, not at the target. */
  tail?: "top" | "bottom" | "left" | "right";
  /** Tail position along that edge, any CSS length or percentage. */
  tailOffset?: string;
  /** "accent" = warm amber fill, used for praise and completion lines. */
  tone?: "default" | "accent";
  /** Max width in px. Keep bubbles under ~22 characters per line. */
  width?: number;
  style?: React.CSSProperties;
}
export function SpeechBubble(props: SpeechBubbleProps): React.JSX.Element;
