import * as React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon name, kebab-case (e.g. "train-front", "check", "arrow-right"). */
  name: string;
  /** Rendered box size. Named steps map to the --icon-* tokens. */
  size?: "sm" | "md" | "lg" | "hero" | number;
  /** Stroke colour. Defaults to currentColor. */
  color?: string;
  /** Stroke width override. Defaults to 2.5px (2.25px at >=48px). */
  strokeWidth?: number;
  /** Accessible name. Omit for purely decorative icons — never omit when the icon carries the meaning. */
  label?: string;
}
export function Icon(props: IconProps): React.JSX.Element;
