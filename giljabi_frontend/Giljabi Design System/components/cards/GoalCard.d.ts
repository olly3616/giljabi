import * as React from "react";

/**
 * A goal the user can pick on the home screen: big icon chip + 26sp label.
 * @startingPoint section="Home" subtitle="목표 선택 카드 — 아이콘 + 큰 라벨" viewport="700x240"
 */
export interface GoalCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  /** Lucide icon name for the goal. */
  icon: string;
  /** The goal in the user's own words, e.g. "기차표 예매하기". */
  label: string;
  /** Optional one-line clarifier. Keep under 20 Korean characters. */
  caption?: string;
  /** Icon chip colour family. */
  tone?: "brand" | "accent" | "calm";
  /** Selected state: blue fill, 3px border AND a check icon. */
  selected?: boolean;
  style?: React.CSSProperties;
}
export function GoalCard(props: GoalCardProps): React.JSX.Element;
