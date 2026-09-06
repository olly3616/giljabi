import * as React from "react";

/**
 * One step of the accessibility / overlay permission walkthrough: number, title, picture, 24sp instruction.
 * @startingPoint section="Onboarding" subtitle="권한 안내 단계 카드" viewport="700x400"
 */
export interface PermissionCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "style"> {
  /** Step number, 1-based. Shown in a filled circle. */
  step: number;
  title: string;
  /** The instruction. One action only, 24sp, under 40 Korean characters. */
  description: string;
  /** Lucide icon used when no illustration is supplied. */
  icon?: string;
  /** Real artwork or a screen recording frame. The dashed blue frame is the placeholder state. */
  illustration?: React.ReactNode;
  /** "done" turns the step marker green with a check. */
  status?: "todo" | "done";
  style?: React.CSSProperties;
}
export function PermissionCard(props: PermissionCardProps): React.JSX.Element;
