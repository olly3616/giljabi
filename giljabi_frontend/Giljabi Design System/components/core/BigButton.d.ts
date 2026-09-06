import * as React from "react";

/**
 * The one action a screen asks for. Full width, >=64dp tall, 22sp bold label.
 * @startingPoint section="Controls" subtitle="주 행동 버튼 — 한 화면에 하나" viewport="700x220"
 */
export interface BigButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  children: React.ReactNode;
  /** primary = the screen's single action. secondary = the way back / alternative. accent = character-voiced encouragement. quiet = skip / later. */
  variant?: "primary" | "secondary" | "accent" | "quiet";
  /** hero 80dp (default), comfortable 64dp, small 48dp — 48dp is the absolute floor. */
  size?: "hero" | "comfortable" | "small";
  /** Lucide icon name shown before the label. */
  icon?: string;
  /** Lucide icon name shown after the label (e.g. "arrow-right"). */
  iconEnd?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}
export function BigButton(props: BigButtonProps): React.JSX.Element;
