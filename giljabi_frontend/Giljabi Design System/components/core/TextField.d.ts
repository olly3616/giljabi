import * as React from "react";

/** Large-type text input. 24sp value text, 64dp tall, 3px focus border plus a 4px halo. */
export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  /** Always label a field. 20sp semibold, above the box — never a placeholder-only label. */
  label?: string;
  /** Plain-language help under the field. */
  hint?: string;
  /** Error text. Replaces the hint and adds an alert icon (never colour alone). */
  error?: string;
  /** Leading Lucide icon name. */
  icon?: string;
  style?: React.CSSProperties;
}
export function TextField(props: TextFieldProps): React.JSX.Element;
