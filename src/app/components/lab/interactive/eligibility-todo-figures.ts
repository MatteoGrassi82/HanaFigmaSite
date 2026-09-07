/* ─────────────────────────────────────────────────────────────────────────────
 * eligibility-todo-figures.ts
 *
 * ███  TODO. PLACEHOLDER FIGURES. NOT FINAL. DO NOT QUOTE THESE ANYWHERE.  ███
 *
 * EligibilityGap needs a panel size and a payer mix to start from, and neither
 * of those exists anywhere in this repo. Rather than invent a market figure and
 * let it harden into a claim, the starting positions live here, on their own,
 * clearly marked, with a visible note in the component that says they are an
 * illustrative example and the visitor should move the dials.
 *
 * WHAT IS NOT IN THIS FILE, ON PURPOSE
 * The two rates the component actually argues from (about 63% of Medicare
 * fee-for-service beneficiaries eligible for chronic care management, and 4.0%
 * OF THOSE ELIGIBLE receiving it) are cleared third-party market figures. Note
 * the figure: 75% is the RETIRED number and rates.ts explains why it must not
 * be published. They live in
 * EligibilityGap.tsx next to the arithmetic that uses them, and they are
 * attributed on screen. They are not placeholders and they do not belong here.
 *
 * WHAT MATTEO STILL OWES THIS FILE
 *   1. A defensible starting panel size for the practices we sell to. Right now
 *      2,000 is a round number chosen because it is round.
 *   2. A defensible starting Medicare fee-for-service share, same problem.
 *   3. The preset notes ("a solo panel", "a small group") are magnitude labels,
 *      not segment definitions. If we have real segment sizes, use those.
 * Until then the component tells the visitor these are illustrative, which is
 * true and costs us nothing, because the arithmetic is the point and it is
 * correct at every position of both dials.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Shaped to match kit.tsx's DialPreset without importing a component module. */
export interface TodoPreset {
  value: number;
  label: string;
  note: string;
}

export interface TodoDialRange {
  min: number;
  max: number;
  step: number;
  /** The dial's starting position. This is what gets prerendered and indexed. */
  start: number;
  presets: TodoPreset[];
}

/** TODO placeholder. Panel size, in patients. */
export const ILLUSTRATIVE_PANEL: TodoDialRange = {
  min: 200,
  max: 8000,
  step: 100,
  start: 2000,
  presets: [
    { value: 800, label: "800", note: "a solo panel" },
    { value: 2000, label: "2,000", note: "a small group" },
    { value: 5000, label: "5,000", note: "a multi-site group" },
  ],
};

/** TODO placeholder. Medicare fee-for-service share of the panel, in percent. */
export const ILLUSTRATIVE_SHARE: TodoDialRange = {
  min: 5,
  max: 100,
  step: 1,
  start: 40,
  presets: [
    { value: 25, label: "25%", note: "mixed payer" },
    { value: 40, label: "40%", note: "Medicare weighted" },
    { value: 70, label: "70%", note: "mostly Medicare" },
  ],
};
