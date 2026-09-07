import type { ReactNode } from "react";
import { PhotoHero, KITCHEN_PHOTO, type HeroCardRow } from "./PhotoHero";
import type { Programme } from "../../../content/programmes/index";

/* ─────────────────────────────────────────────────────────────────────────────
 * ProgrammeHero — PhotoHero, wired to a Programme.
 *
 * The layout and the card live in PhotoHero, which was extracted on 7 Sept 2026
 * so pages that are not about one programme could use the same hero. This file
 * is only the mapping: which eyebrow, which photo, where the "what it pays"
 * anchor points. It replaced a text-only centred hero whose eyebrow was a CPT
 * string ("CCM · 99490 · 99439 · …"); codes answer question 2 and live in
 * PayVisual now.
 * ─────────────────────────────────────────────────────────────────────────── */

/* ── The photographs, and where they came from ──────────────────────────────
 * public/products/programme-hero-kitchen.webp and programme-hero-armchair.webp
 * are AI-GENERATED (Sanity image generation, 7 Sept 2026), made because the
 * site owned exactly two product photographs and remote-patient-call.webp was
 * carrying the hero, the written-up month AND the homepage at once. They were
 * prompted to match that photo's style -- warm window light, muted earth tones,
 * candid, shallow focus, an older adult at home on a call -- and cropped to its
 * exact 1200x800 so every hero crop behaves identically.
 *
 * THE PEOPLE IN THEM DO NOT EXIST. That is fine for an illustrative hero and
 * would not be fine for a testimonial, a case study, a team page, or anywhere
 * a reader could take the face as a real patient or a real clinician. The
 * figcaption under the card says "Illustrative"; keep it. If a real, released
 * patient photograph ever exists, it replaces these here and this note goes.
 *
 * The kitchen shot is the default because her face sits in the top 45% of the
 * frame with quiet table space beneath -- exactly where the card floats. The
 * armchair shot is warmer and fuller in frame: better uncovered, on a page or
 * section without an overlay. remote-patient-call.webp stays on the written-up
 * month, so a programme page now shows two different people, one world. */

export interface ProgrammeHeroProps {
  data: Programme;
  headline: ReactNode;
  body?: string;
  rows?: HeroCardRow[];
  image?: { src: string; alt: string; position?: string };
  trustLine?: string;
  id?: string;
}

export function ProgrammeHero({ data, headline, body, rows, image = KITCHEN_PHOTO, trustLine, id }: ProgrammeHeroProps) {
  return (
    <PhotoHero
      id={id}
      eyebrow={data.name}
      headline={headline}
      body={body ?? data.summary}
      rows={rows}
      image={image}
      secondaryCta={{ label: "See what it pays", href: "#pays" }}
      trustLine={trustLine}
    />
  );
}

export default ProgrammeHero;
