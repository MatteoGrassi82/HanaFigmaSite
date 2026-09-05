import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";

/**
 * PalettePreview — pick the accent by looking at it, on real sections.
 *
 * WHY THIS EXISTS
 * The hero flatters every colour. An accent has to survive four other places
 * before it is the brand: small uppercase eyebrow type, a solid fill behind
 * white text, a light tint behind dark text, and a light-on-navy inversion.
 * A swatch grid cannot show you any of that, so this shows all of them at once
 * and lets you switch between candidates live.
 *
 * HOW IT WORKS
 * Since the palette moved off hardcoded hex (commit 8feb67a), every accent on
 * the site reads --color-brand / --color-brand-soft / --color-brand-tint. So a
 * candidate is just three values, and switching is a style write on this
 * section's own element. Nothing here is a mock: the swatches below are the
 * same token utilities the real sections use.
 *
 * CONTRAST IS MEASURED, NOT EYEBALLED. Each candidate carries its real WCAG
 * ratio against white and against the navy ground, computed at module load by
 * the same formula the spec defines. The current periwinkle sits at 4.17:1 on
 * white, which is BELOW the 4.5:1 needed for body text, and that is the one
 * hard fact in an otherwise aesthetic decision.
 *
 * WHEN A CHOICE IS MADE: copy the three values into the @theme block in
 * src/styles/tokens.css and delete this file. Also recolour the four Remotion
 * compositions, which carry their own royal blue and are the one thing tokens
 * cannot reach.
 */

export interface Palette {
  id: string;
  name: string;
  note: string;
  /** The accent on light grounds: eyebrows, links, CTAs, focus rings. */
  brand: string;
  /** The accent on navy grounds, where the light-ground value goes muddy. */
  brandSoft: string;
  /** The accent as a surface wash behind dark text. */
  brandTint: string;
}

export const PALETTES: Palette[] = [
  {
    id: "periwinkle",
    name: "Periwinkle",
    note: "What the site uses today. Violet-leaning, and the only candidate that fails AA for body text.",
    brand: "#5B76D9",
    brandSoft: "#A7BCF5",
    brandTint: "#EEF1FB",
  },
  {
    id: "cobalt",
    name: "Electric blue",
    note: "What /remote-v2 was designed in. Confident and safe, in the most crowded colour in the category.",
    brand: "#2563EB",
    brandSoft: "#93B4F5",
    brandTint: "#EAF0FD",
  },
  {
    id: "teal",
    name: "Teal",
    note: "Clinical without being another blue. Best contrast of the safe options.",
    brand: "#0F766E",
    brandSoft: "#5EEAD4",
    brandTint: "#E6F6F4",
  },
  {
    id: "emerald",
    name: "Emerald",
    note: "Reads as a success state in a product UI, which is a reason to keep green free rather than spend it here.",
    brand: "#047857",
    brandSoft: "#6EE7B7",
    brandTint: "#E7F7F0",
  },
  {
    id: "terracotta",
    name: "Terracotta",
    note: "The bet. Warm where the whole category is cold, and it already agrees with the amber used for flags.",
    brand: "#C2410C",
    brandSoft: "#FDBA74",
    brandTint: "#FDF0E7",
  },
  {
    id: "gold",
    name: "Gold",
    note: "Elegant, and hard to make load-bearing at small sizes. Best as a second accent, not a first.",
    brand: "#A16207",
    brandSoft: "#FCD34D",
    brandTint: "#FBF5E5",
  },
];

/* ── Contrast, per WCAG 2.1 ───────────────────────────────────────────────── */
const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const NAVY = "#00122F";
const WHITE = "#FFFFFF";

function Ratio({ value, need = 4.5 }: { value: number; need?: number }) {
  const pass = value >= need;
  return (
    <span className={pass ? "text-ink-soft" : "text-signal-amber font-semibold"}>
      {value.toFixed(2)}:1 {pass ? "✓" : "✕ below AA"}
    </span>
  );
}

/* ── The five places an accent has to work ────────────────────────────────── */
function Specimens() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* 1. Small uppercase eyebrow, the hardest small-type test */}
      <div className="rounded-tile border border-rule bg-paper p-6">
        <p className="text-eyebrow font-bold uppercase text-brand m-0 mb-3">
          AI care coordination that reaches every patient
        </p>
        <h3 className="font-serif text-h3 text-navy m-0">
          More patients. <em className="text-brand">Better outcomes.</em>
        </h3>
        <p className="text-[15px] leading-[1.7] text-ink-soft mt-3 mb-0">
          Body copy sits next to the accent here. If the eyebrow is hard to read at this size, the
          colour is not carrying its job.
        </p>
      </div>

      {/* 2. Solid fill behind white text */}
      <div className="rounded-tile border border-rule bg-paper p-6">
        <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-3">
          Solid fill, white text
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-pill bg-brand px-5 py-3 text-[15px] font-semibold text-white border-0 cursor-pointer">
            Book a demo <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
          </button>
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand-tint px-4 py-2 text-[13px] font-semibold text-navy">
            <Check className="w-3.5 h-3.5 text-brand" strokeWidth={3} /> Tint behind dark text
          </span>
        </div>
        <div className="mt-4 h-2 rounded-pill bg-brand-tint overflow-hidden">
          <div className="h-full w-2/3 rounded-pill bg-brand" />
        </div>
      </div>

      {/* 3. Inverted: the accent on the navy ground */}
      <div className="rounded-tile bg-navy p-6">
        <p className="text-eyebrow font-bold uppercase text-brand-soft m-0 mb-3">On the navy ground</p>
        <h3 className="font-serif text-h3 text-white m-0">
          Your team reviews. <em className="text-brand-soft">Your provider signs.</em>
        </h3>
        <p className="text-[15px] leading-[1.7] text-white/75 mt-3 mb-0">
          This is where a light-ground accent usually fails, which is why there is a second value
          for dark grounds.
        </p>
      </div>

      {/* 4. Data: the accent carrying quantity */}
      <div className="rounded-tile border border-rule bg-paper p-6">
        <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-4">
          Carrying a number
        </p>
        <div className="flex items-end gap-6">
          <div>
            <div className="font-serif text-[44px] leading-none text-navy tabular-nums">
              29 <span className="text-[20px] text-brand">min</span>
            </div>
            <p className="text-[13px] text-ink-soft mt-2 mb-0">per patient, per month</p>
          </div>
          <div className="flex-1 flex items-end gap-1.5 h-16">
            {[38, 52, 44, 68, 84, 100].map((h, i) => (
              <div
                key={i}
                className={i === 5 ? "flex-1 rounded-t-[3px] bg-brand" : "flex-1 rounded-t-[3px] bg-brand-tint"}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PalettePreview() {
  const [active, setActive] = useState<Palette>(PALETTES[0]);
  const [scope, setScope] = useState<HTMLElement | null>(null);

  /* Write the three values onto this section only, so the rest of the lab page
     keeps the live palette and you can see the candidate against it. */
  useEffect(() => {
    if (!scope) return;
    scope.style.setProperty("--color-brand", active.brand);
    scope.style.setProperty("--color-brand-soft", active.brandSoft);
    scope.style.setProperty("--color-brand-tint", active.brandTint);
  }, [scope, active]);

  const onWhite = contrast(active.brand, WHITE);
  const onNavy = contrast(active.brandSoft, NAVY);

  return (
    <section ref={setScope} className="bg-paper-2 py-20 md:py-28 px-6 md:px-16">
      <div className="max-w-[1120px] mx-auto">
        <p className="text-eyebrow font-bold uppercase text-brand text-center m-0 mb-4">
          Palette
        </p>
        <h2 className="font-serif text-h2 text-navy text-center m-0 mx-auto max-w-[20ch]">
          Pick it where it has to <em className="text-brand">work.</em>
        </h2>
        <p className="text-[17px] leading-[1.7] text-ink-soft text-center max-w-[58ch] mx-auto mt-5 mb-0">
          Every candidate looks good in a headline. These are the four places that decide it: small
          uppercase type, a solid fill behind white, a tint behind dark text, and the inversion on
          navy.
        </p>

        {/* the switcher */}
        <div className="mt-10 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {PALETTES.map((p) => {
            const on = p.id === active.id;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                aria-pressed={on}
                className={`flex items-center gap-2.5 rounded-tile border px-3 py-2.5 text-left cursor-pointer transition-colors ${
                  on ? "border-navy bg-paper-bright" : "border-rule bg-paper hover:bg-paper-bright"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-[5px] shrink-0"
                  style={{ backgroundColor: p.brand }}
                  aria-hidden
                />
                <span className={`text-[13.5px] ${on ? "font-semibold text-navy" : "text-ink-soft"}`}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* what the current choice costs you */}
        <div className="mt-4 rounded-tile border border-rule bg-paper-bright px-5 py-4">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="text-[15px] font-semibold text-navy">{active.name}</span>
            <span className="text-[13px] text-ink-mute tabular-nums">
              {active.brand} · {active.brandSoft} · {active.brandTint}
            </span>
            <span className="text-[13px]">
              on white <Ratio value={onWhite} />
            </span>
            <span className="text-[13px]">
              soft on navy <Ratio value={onNavy} need={4.5} />
            </span>
          </div>
          <p className="text-[14px] leading-[1.6] text-ink-soft mt-2 mb-0">{active.note}</p>
        </div>

        <div className="mt-8">
          <Specimens />
        </div>

        <p className="text-[13px] leading-[1.6] text-ink-mute mt-6 mb-0 max-w-[70ch]">
          Contrast is computed here, not judged. Anything under 4.5:1 cannot carry body text, which
          rules the current periwinkle out for anything but large type and UI. When a choice is
          made, the three values go into the @theme block in src/styles/tokens.css and this file
          gets deleted. The four Remotion compositions carry their own colour and have to be
          recoloured by hand.
        </p>
      </div>
    </section>
  );
}
