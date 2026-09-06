import * as React from "react";

/**
 * Celebration marker for the completion screen: big ringed badge, 32sp headline, gentle scale-in.
 * @startingPoint section="Completion" subtitle="완료 축하 배지" viewport="700x400"
 */
export interface CompletionBadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  /** The praise line, e.g. "잘하셨어요!". */
  title: string;
  /** What was accomplished, in the user's words. */
  subtitle?: string;
  /** Lucide icon inside the badge. */
  icon?: string;
  tone?: "success" | "accent";
  /** Badge diameter in px. */
  size?: number;
  /** Slot for real artwork instead of the icon. */
  illustration?: React.ReactNode;
  style?: React.CSSProperties;
}
export function CompletionBadge(props: CompletionBadgeProps): React.JSX.Element;
