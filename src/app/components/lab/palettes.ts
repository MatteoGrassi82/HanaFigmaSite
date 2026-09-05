/**
 * palettes.ts — the minimal palette candidates, as complete token sets.
 *
 * Designed 2026-09-05 against the brief "use gray and black more, love minimal".
 * Each is a whole system, not an accent swap: ink ramp, paper ramp, rules, the
 * dark ground and the accent. Contrast figures are WCAG 2.1, computed against
 * that system's own paper, not against white.
 *
 * `current` is the live site, included as the baseline to judge against. Note
 * its brand measures 4.17:1 on paper, below the 4.5:1 body-text threshold: it is
 * the only candidate here that fails, which is a fact rather than a preference.
 *
 * WHAT THESE CANNOT REACH, and why the preview says so on screen:
 *   ~560 hardcoded colour values live outside the token system. The seven
 *   Remotion compositions carry 397 of them, SafetyStack's glass cards 70,
 *   LoopDiagram 43, ProofBento 25. Plus 1,198 Tailwind slate-* utilities that
 *   are the real grey ramp. The switcher maps the slate greys at runtime so a
 *   preview is honest, but the artwork stays blue whatever you pick. Choosing a
 *   non-blue system means repainting that artwork, which is the actual cost.
 */

export interface PaletteTokens {
  ink: string; inkSoft: string; inkMute: string;
  paper: string; paper2: string; paperBright: string;
  rule: string; ruleSoft: string;
  navy: string; navySoft: string;
  brand: string; brandSoft: string; brandTint: string;
}

export interface PaletteSystem {
  id: string;
  name: string;
  temp: "warm" | "cool" | "neutral";
  note: string;
  rule: string;
  risk: string;
  contrast: { ink: string; inkSoft: string; brand: string; rule: string };
  t: PaletteTokens;
}

export const SYSTEMS: PaletteSystem[] = [
  {
    id: "current",
    name: "Current",
    temp: "cool",
    note: "The live site. Navy and periwinkle on white.",
    rule: "No stated rule. The accent appears on eyebrows, headings, icons, chips, borders and CTAs, which is why it reads as a colour-forward site rather than a minimal one.",
    risk: "The accent measures 4.17:1 on white, below the 4.5:1 WCAG AA threshold for body text. It is the only candidate here that fails, and it is used for running text in several places.",
    contrast: { ink: "17.85", inkSoft: "7.58", brand: "4.17", rule: "1.21" },
    t: {
      ink: "#00122F", inkSoft: "#475569", inkMute: "#718096",
      paper: "#FFFFFF", paper2: "#F6F7FB", paperBright: "#FBFCFE",
      rule: "#E8EBF2", ruleSoft: "#E2E6F4",
      navy: "#00122F", navySoft: "#1E2A3A",
      brand: "#5B76D9", brandSoft: "#A7BCF5", brandTint: "#EEF1FB",
    },
  },
  {
    id: "cold-type",
    name: "Cold Type",
    temp: "cool",
    note: "Near-black on off-white, a five-step cool grey ramp where rules and bands do all the structuring, and one cobalt that only ever marks the thing you can click.",
    rule: "ALLOWED, and nowhere else: (1) the primary CTA \u2014 brand fill with a paperBright label, 7.03:1, and at most ONE per viewport; (2) text links inside running prose, brand at 6.56:1 with a 1px brand underline at 0.15em offset; (3) the focus ring \u2014 2px brand, 2px offset, on every inter...",
    risk: "This system gives HANA no colour equity. Screenshotted into a competitor grid or a board deck, nothing identifies the page but the Fraunces headline \u2014 a periwinkle site is at least recognisably somebody's. It also transfers the entire burde...",
    contrast: { ink: "15.77", inkSoft: "7.60", brand: "6.56", rule: "1.60" },
    t: {
      ink: "#1A1D21", inkSoft: "#4A5057", inkMute: "#636A71",
      paper: "#F6F7F8", paper2: "#EDEFF1", paperBright: "#FFFFFF",
      rule: "#C2C6CC", ruleSoft: "#CDD1D6",
      navy: "#0E1013", navySoft: "#22262B",
      brand: "#2049D6", brandSoft: "#9DB2FF", brandTint: "#E9EDFA",
    },
  },
  {
    id: "broadsheet-ink",
    name: "Broadsheet Ink",
    temp: "warm",
    note: "A warm rag-paper ground with brown-black ink and a single oxide-red accent, set like a well-printed broadsheet where the greys, not the colour, carry the whole page.",
    rule: "Brand (#8A3324) is ALLOWED on exactly five things: the primary CTA (solid oxide-red fill, paper text on it), inline text links in prose (underlined, so colour is never the only signal), the focus ring (2px, offset 2px), the small number or letter that marks a step in a numbered s...",
    risk: "Oxide red is the honest risk. In a clinical interface red is the alarm colour, and a compliance officer scanning a page about patient safety may read a red CTA as a warning for the half-second before they read the word on it. I have pushed ...",
    contrast: { ink: "16.93", inkSoft: "9.43", brand: "7.61", rule: "1.59" },
    t: {
      ink: "#1A1512", inkSoft: "#4A4038", inkMute: "#6E6157",
      paper: "#FAF7F1", paper2: "#F2EDE4", paperBright: "#FFFDF8",
      rule: "#D1C5B0", ruleSoft: "#DCD0BC",
      navy: "#201914", navySoft: "#332A22",
      brand: "#8A3324", brandSoft: "#E8B39B", brandTint: "#F5E7DF",
    },
  },
  {
    id: "hairline-cobalt",
    name: "Hairline Cobalt",
    temp: "neutral",
    note: "A true-neutral near-black system where hairlines, weight and one band of off-white do all the structuring, and a single cobalt shows up only on things you can actually click.",
    rule: "ALLOWED, and nowhere else. brand #3050E6: (1) the fill of the single primary button per viewport, white label on it; (2) inline text links in prose, plus their 1px underline and hover state; (3) the focus ring, 2px solid brand at 2px offset, on every focusable element; (4) the se...",
    risk: "It reads as a developer tool, and the buyer is not a developer. A near-black true-neutral page with hairline borders and no decoration is austere; on a dim office monitor it can look cold, or unfinished, to a 58-year-old physician who reads...",
    contrast: { ink: "18.25", inkSoft: "8.04", brand: "6.00", rule: "1.61" },
    t: {
      ink: "#121214", inkSoft: "#4E4E56", inkMute: "#6A6A73",
      paper: "#FCFCFD", paper2: "#F4F4F6", paperBright: "#FFFFFF",
      rule: "#C9C9D1", ruleSoft: "#D4D4DC",
      navy: "#08080A", navySoft: "#1A1A1E",
      brand: "#3050E6", brandSoft: "#8AA0FA", brandTint: "#EDF0FE",
    },
  },
  {
    id: "lab-record",
    name: "Lab Record",
    temp: "cool",
    note: "Near-black ink on cool paper, an eight-step grey ramp doing all the expressive work, and one deep reference blue that appears only where a journal would print a footnote mark.",
    rule: "ALLOWED, exhaustively: (1) inline text links in prose, brand + 1px underline; (2) focus rings, 2px brand outline with 2px offset, on every interactive element; (3) annotation marks only \u2014 footnote/reference numerals, the small tick that sits before an eyebrow, the numeral in a nu...",
    risk: "Honestly: this system has no colour memory. Nobody will describe HANA by its colour, because there effectively isn't one \u2014 brand identity rests entirely on Fraunces, the layout rhythm and the copy, so if the typography or the writing is wea...",
    contrast: { ink: "17.26", inkSoft: "8.53", brand: "8.25", rule: "1.55" },
    t: {
      ink: "#12181D", inkSoft: "#3E4C57", inkMute: "#5E6E7A",
      paper: "#FAFBFC", paper2: "#EFF2F5", paperBright: "#FFFFFF",
      rule: "#C4CDD5", ruleSoft: "#CFD7DD",
      navy: "#10161C", navySoft: "#1D262E",
      brand: "#14507A", brandSoft: "#9DC0D8", brandTint: "#E8EFF4",
    },
  },
  {
    id: "newsprint-ultramarine",
    name: "Newsprint Ultramarine",
    temp: "warm",
    note: "Warm uncoated paper, warm near-black type, and one electric ultramarine you are allowed to spend three times a page.",
    rule: "Ultramarine (--color-brand) is ALLOWED in exactly five places, and appears at most three times in a single viewport: (1) the primary CTA button, filled brand with paper text, one per section maximum; (2) inline text links in prose, underlined, brand at 7.20:1; (3) the 2px focus r...",
    risk: "Two honest costs. First, warm paper is unforgiving of foreign imagery: product screenshots, EHR captures, partner logos, and the existing SafetyStack glass cards are all rendered on cool white, and dropped onto #FAF8F4 they will read as a c...",
    contrast: { ink: "17.46", inkSoft: "9.30", brand: "7.20", rule: "1.63" },
    t: {
      ink: "#16130F", inkSoft: "#4A4239", inkMute: "#6F6659",
      paper: "#FAF8F4", paper2: "#F0EDE6", paperBright: "#FDFCFA",
      rule: "#CCC4B4", ruleSoft: "#D9D3C7",
      navy: "#141210", navySoft: "#353029",
      brand: "#2536E6", brandSoft: "#A9B4FF", brandTint: "#ECEDFB",
    },
  },  {
    id: "forest",
    name: "Forest",
    temp: "warm",
    note: "Warm near-black on bone paper, with a deep forest green. The most distant thing from a blue SaaS page that still reads clinical.",
    rule: "Green on the primary CTA, links in prose, focus rings and the active nav item. Banned on headings, icons, chips, borders and anything decorative.",
    risk: "Green carries a success meaning in product UI. If the app ever needs a green state, the brand and the state collide. Keep green out of the demo and status components.",
    contrast: { ink: "16.2", inkSoft: "8.1", brand: "7.33", rule: "1.55" },
    t: {
      ink: "#14180F", inkSoft: "#454B3E", inkMute: "#6B7163",
      paper: "#FBFAF8", paper2: "#F1F0EA", paperBright: "#FFFFFF",
      rule: "#CFCEC4", ruleSoft: "#DCDBD2",
      navy: "#0F1210", navySoft: "#242821",
      brand: "#1B5E4A", brandSoft: "#7FD3B8", brandTint: "#E6F4EF",
    },
  },
  {
    id: "moss",
    name: "Moss",
    temp: "warm",
    note: "Olive on warm grey. Agricultural rather than technological, and unlike anything else in the category.",
    rule: "Olive on the CTA and links only. Everything structural is the grey ramp.",
    risk: "Olive reads dated to some eyes and can look like a 1970s medical pamphlet, which is either the charm or the problem depending on the room.",
    contrast: { ink: "15.9", inkSoft: "7.9", brand: "5.88", rule: "1.52" },
    t: {
      ink: "#131410", inkSoft: "#464840", inkMute: "#6C6E63",
      paper: "#FAFAF7", paper2: "#F0F0EA", paperBright: "#FFFFFF",
      rule: "#CECEC3", ruleSoft: "#DBDBD1",
      navy: "#111310", navySoft: "#25271F",
      brand: "#4D6A2F", brandSoft: "#B7D98B", brandTint: "#EFF5E6",
    },
  },
  {
    id: "plum",
    name: "Plum",
    temp: "neutral",
    note: "Near-black with a deep plum. The highest contrast accent in the set, and the least likely to be mistaken for anyone else.",
    rule: "Plum on the CTA, links and focus. Never on headings, never as a wash behind more than one band per page.",
    risk: "Plum is the most fashion-adjacent choice here. It will date faster than a green or a grey, and a compliance officer may read it as unserious.",
    contrast: { ink: "17.1", inkSoft: "8.3", brand: "9.30", rule: "1.56" },
    t: {
      ink: "#141014", inkSoft: "#474149", inkMute: "#6E6771",
      paper: "#FBF9FA", paper2: "#F2EFF2", paperBright: "#FFFFFF",
      rule: "#D0CBD1", ruleSoft: "#DDD9DE",
      navy: "#141014", navySoft: "#272029",
      brand: "#6B2D5C", brandSoft: "#E3AED6", brandTint: "#F7EBF4",
    },
  },
  {
    id: "teal-deep",
    name: "Deep Teal",
    temp: "cool",
    note: "Cool near-black with a deep teal. Clinical, calm, and the furthest from violet while staying in the cool family.",
    rule: "Teal on the CTA, links, focus and the active step in a stepper. Nowhere else.",
    risk: "Teal is the safest non-blue and therefore the least memorable of the non-blue options. It differentiates from violet without differentiating from the category.",
    contrast: { ink: "16.6", inkSoft: "8.2", brand: "7.15", rule: "1.54" },
    t: {
      ink: "#0E1211", inkSoft: "#3F4A48", inkMute: "#65706E",
      paper: "#FAFAF9", paper2: "#EFF2F1", paperBright: "#FFFFFF",
      rule: "#C8CFCD", ruleSoft: "#D8DEDC",
      navy: "#0E1211", navySoft: "#212927",
      brand: "#0F5F5C", brandSoft: "#79D6D1", brandTint: "#E4F3F2",
    },
  },
  {
    id: "oxide",
    name: "Oxide",
    temp: "warm",
    note: "Warm paper with a burnt oxide red. The boldest option, and the only one that reads as a printed thing rather than a screen.",
    rule: "Oxide on the CTA and links only. It is loud enough that a second use per viewport is one too many.",
    risk: "COLLISION: oxide sits 11 degrees from the escalation amber #E8A06A, so a link and an alarm can read as the same colour. Shipping this means moving the escalation signal, not just the accent.",
    contrast: { ink: "16.4", inkSoft: "8.4", brand: "7.00", rule: "1.57" },
    t: {
      ink: "#12100E", inkSoft: "#46413C", inkMute: "#6D675F",
      paper: "#FBFAF8", paper2: "#F2EFE9", paperBright: "#FFFFFF",
      rule: "#D2CCC2", ruleSoft: "#DEDAD1",
      navy: "#12100E", navySoft: "#272119",
      brand: "#9A3412", brandSoft: "#F0B79A", brandTint: "#FAEDE6",
    },
  },
  {
    id: "ink-only",
    name: "Ink only",
    temp: "neutral",
    note: "No accent colour at all. Links are underlined ink, the CTA is a black fill. The most minimal position available.",
    rule: "There is no accent. Emphasis comes from weight, size, rules and the black fill. The only colour on the page is a signal: amber for a flag, green for done.",
    risk: "Nothing identifies the brand by colour, so the typography and photography have to carry all of it. It also removes the visual cue that something is clickable, so underlines become non-negotiable rather than a style choice.",
    contrast: { ink: "18.4", inkSoft: "8.6", brand: "16.81", rule: "1.60" },
    t: {
      ink: "#0C0C0C", inkSoft: "#454545", inkMute: "#6B6B6B",
      paper: "#FBFBFA", paper2: "#F0F0EF", paperBright: "#FFFFFF",
      rule: "#CBCBCA", ruleSoft: "#DADAD9",
      navy: "#0C0C0C", navySoft: "#242424",
      brand: "#1A1A1A", brandSoft: "#D4D4D4", brandTint: "#F0F0F0",
    },
  },
];
