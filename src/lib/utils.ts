import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * cn — clsx for conditionals, tailwind-merge for last-one-wins conflicts.
 *
 * WHY THIS IS extendTailwindMerge AND NOT PLAIN twMerge.
 * The design system defines its own font sizes as @theme tokens
 * (--text-eyebrow, --text-lead, --text-h3, --text-h2, --text-display), which
 * Tailwind turns into text-h2, text-display and so on. tailwind-merge has no
 * way to know those are SIZES: to its parser `text-h2` looks exactly like
 * `text-ink`, so it files both under text-color, decides they conflict, and
 * keeps whichever came last.
 *
 * The failure is silent and it drops a font size. Measured, before this fix:
 *   twMerge("font-serif text-h2 text-ink m-0")  ->  "font-serif text-ink m-0"
 * A 46px heading renders at the browser default 20px, with no warning, no build
 * error, and a class list that still reads correctly in the source.
 *
 * It only bites BARE tokens. `md:text-h2` survives because a modifier makes its
 * own group, and `text-[52px]` survives because tailwind-merge can parse an
 * arbitrary length. Everything in this repo that predates this comment happened
 * to use one of those two forms, which is why the bug surfaced only when a new
 * component wrote the plain pair. Registering the tokens fixes it for every
 * form and stops the next one being written.
 *
 * ADD ANY NEW --text-* TOKEN TO THIS LIST. It is the price of custom size
 * tokens sharing the `text-` prefix with colours.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["eyebrow", "lead", "h3", "h2", "display"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
