import { useId, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";

/**
 * TeamSection — the clinician roster.
 *
 * Badge pill, mission statement, CTA on the left; overlapping oval portraits on
 * the right; a stats row underneath. Extracted from RemoteV2.tsx (§15b) so
 * /about can mount the same block with its own roster and figures.
 *
 * PROVENANCE, carried across unchanged: the mission statement, the roster and
 * all three figures came from Matteo directly (2026-08-16). "75 years combined"
 * and "100+ peer reviewed publications" are HIS assertions about his own team,
 * not derived from anything in this repo; "45+ care protocols" matches what the
 * rest of the site claims. The "+20" chip is a headcount claim and should be
 * checked before it ships, which is why `wider` is a prop and can be set to
 * null.
 *
 * Roster is HANA's own people only. Oprandi, Katie Murphy and Lorri Hanes
 * appear elsewhere on the site as CUSTOMERS and must never be listed here.
 *
 * OUTSTANDING: Massimiliano has no surname and no agreed title yet (brand doc:
 * agree titles before a team page). The default below carries the placeholder
 * exactly as RemoteV2 had it. Confirm with him before /about goes indexable.
 *
 * ALL FOUR IN COLOUR as of 8 Sept 2026 (Matteo: "use them all in color").
 * Three new 800x800 colour originals replaced what was there:
 *   archie    was the GREYSCALE cut-out, which made the roster read as two
 *             colour portraits and one black-and-white one. Now colour;
 *             measured channel spread 43.9/255 against the under-6 that
 *             indicated greyscale before.
 *   sthita    was the one member with NO photograph at all, so his monogram
 *             "SP" was the first thing in the row. He now has a face.
 *   priyanshu a NEW person, installed as /avatars/priyanshu.webp but NOT yet
 *             placed in this roster -- see the open question below.
 *
 * ███ ONE THING NOT DONE, BECAUSE GUESSING IT WOULD MISLABEL A REAL PERSON. ███
 * Matteo's instruction was "use the one I'm giving you now, like me:
 * Massimiliano. Actually, use a different one: Sita Prianshu", and that reads
 * two ways: either Priyanshu REPLACES Massimiliano in the fourth slot, or he is
 * a fifth member and Massimiliano stays. Both are one line here. Putting the
 * wrong name under a face on a team page is not a design mistake, so the
 * roster is unchanged on that point and priyanshu.webp sits ready.
 *
 * PHOTOS (installed 8 Sept 2026 from _TEAM-BADGES): the roster now points at
 * the CUT-OUT variants, {name}-cut.png converted to webp WITH ALPHA. Alpha is
 * load-bearing here: the frame is `rounded-pill` over `bg-brand-tint`, so a
 * transparent background lets the tint show around the person. Flatten these to
 * jpg and you get white corners inside a periwinkle pill.
 *
 * The BADGE variants (duotone halftone on a circular field) are the other set
 * in that folder and are NOT used here -- object-cover would crop a 1080 square
 * badge to a 138x202 pill and cut the circular field into a stadium. They are
 * installed as /avatars/badge-*.webp and used by BuiltByClinicians, whose
 * frames are actual circles. If this roster should carry the duotone treatment
 * too, the frames need to become circles first.
 *
 * Any name still without a file: the <img> fails, hides itself, and the
 * monogram tile underneath shows through. That fallback is deliberate, not a
 * broken-image accident.
 *
 * PRERENDER: the build snapshots every route in headless Chrome at 800x600 and
 * never scrolls, so an entrance animation this far down the page never
 * intersects and Motion bakes opacity:0 into the HTML Google reads. The badge,
 * the heading, the CTA and the stats therefore render static, exactly as
 * FaqSection does. The only motion left is the portrait ovals, which carry no
 * indexable prose (the names live in a title attribute, same as the original).
 */

export interface TeamMember {
  name: string;
  /** Credential line. Never invent or edit one of these. */
  role: string;
  /** Path under /public. Falls back to the monogram tile if it fails to load. */
  photo?: string;
  /** object-position for the crop. The four portraits are unrelated
   *  photographs, not a shoot, so where the head sits in frame differs per
   *  person and a single 50% 50% clips somebody. */
  pos?: string;
  /** Oval width in px. The roster is deliberately uneven. */
  width: number;
  /** Oval height in px. */
  height: number;
  /** Top margin in px, so the ovals hang at different heights. */
  offset: number;
  /** Stacking order. The tallest portrait sits on top. */
  z: number;
}

export interface TeamStat {
  /** The figure. */
  value: string;
  /** The pill caption under it. */
  label: string;
}

export interface TeamSectionProps {
  /** The badge pill text. */
  eyebrow?: string;
  /** ReactNode so a page can put an <em> in it; the tone skin colours it. */
  heading?: ReactNode;
  /** Optional lead under the heading. The original had none. */
  body?: string;
  members?: TeamMember[];
  stats?: TeamStat[];
  /** The button under the mission statement. null to drop it. */
  cta?: { label: string; href: string } | null;
  /** The trailing headcount chip. null to drop it. */
  wider?: { label: string; title?: string } | null;
  /** "light" is the paper ground; "band" separates on bg-band with a hairline. */
  tone?: "light" | "band";
  className?: string;
  id?: string;
}

/** Initials for the monogram fallback. Drops a suffix after a comma, plus MD and Dr. */
export function initials(name: string): string {
  return name
    .replace(/,.*$/, "")
    .split(" ")
    .filter((w) => !/^(MD|Dr\.?)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

/* Roster set 2026-08-25 (Matteo): Grassi, Archie, Sthita and Massimo; Fakhrudin
   added 2026-09-08. With real
   photographs to come. Fakhrudin and Priyanka came off with this cut; one line
   each to restore. */
const DEFAULT_MEMBERS: TeamMember[] = [
  { name: "Sthita Pujari", role: "Engineering & applied AI", photo: "/avatars/sthita.webp", width: 98, height: 142, offset: 48, z: 1 },
  { name: "Archie Defillo, MD", role: "Neuroscience, sleep & behavioral health", photo: "/avatars/archie.webp", pos: "50% 32%", width: 112, height: 164, offset: 18, z: 2 },
  { name: "Matteo Grassi", role: "Founder · behavioral psychologist", photo: "/avatars/matteo.webp", width: 138, height: 202, offset: 0, z: 4 },
  { name: "Massimiliano", role: "Clinical psychologist · sleep", photo: "/avatars/massimo.webp", width: 108, height: 156, offset: 26, z: 3 },
  /* Added 8 Sept 2026 (Matteo: "add fahruin as well"). He was already in
     BuiltByClinicians and missing from this roster. Uses the FULL-FRAME studio
     photograph rather than the cut-out variant: at 1722x1598 it is the
     highest-resolution source in the set, and three of the other four are now
     full-frame too, so it matches them rather than the transparent cut-outs.
     Sized to continue the descent outward from the centre -- Matteo is the
     tallest at 202 and each step out gets shorter, so he takes 96/138 and the
     largest offset. */
  { name: "Fakhrudin Mohamed, MD", role: "Clinical medicine & care operations", photo: "/avatars/fakhrudin.webp", pos: "50% 30%", width: 96, height: 138, offset: 54, z: 0 },
];

const DEFAULT_STATS: TeamStat[] = [
  { value: "75", label: "years of combined experience in medicine and clinical AI" },
  { value: "100+", label: "peer reviewed publications" },
  { value: "45+", label: "care protocols deployed" },
];

/* Tone is two palettes over one layout, token-only, so the .cobalt scope and any
   future palette change carry through untouched. */
const TONE = {
  light: {
    section: "bg-paper-bright",
    statPill: "bg-paper-2",
  },
  band: {
    section: "bg-band border-y border-rule",
    statPill: "bg-paper-bright",
  },
} as const;

/* The monogram ground, in tokens rather than the two hexes the original baked
   in. color-mix keeps the accent wash tied to --color-brand, so it follows a
   palette swap instead of drifting away from it.
   The light stop is --color-paper-2 (#f6f7fb), not --color-paper-bright: the
   original baked #F4F7FF there, a faintly blue paper, and paper-bright is pure
   white. paper-2 is the token that actually matches it, so the tile keeps the
   original's tint instead of washing out to white. */
const MONOGRAM_TILE: CSSProperties = {
  background:
    "radial-gradient(120% 90% at 30% 15%, color-mix(in srgb, var(--color-brand) 16%, transparent) 0%, transparent 62%), linear-gradient(160deg, var(--color-paper-2) 0%, var(--color-brand-tint) 100%)",
};

export function TeamSection({
  eyebrow = "Our team",
  heading = (
    <>
      Our team of clinicians, AI researchers and care operators is united by one belief: the care
      that decides outcomes happens between visits, and it is lost for the most ordinary reason.{" "}
      <em>Nobody had the hours to call.</em>
    </>
  ),
  body,
  members = DEFAULT_MEMBERS,
  stats = DEFAULT_STATS,
  cta = { label: "About us", href: "/about" },
  wider = { label: "+20", title: "Plus the wider team" },
  tone = "light",
  className,
  id,
}: TeamSectionProps = {}) {
  const uid = useId();
  const headingId = `${uid}-team-heading`;
  const skin = TONE[tone];

  // The chip trails the last portrait whatever the roster length. Four members
  // put it at 0.42, which is where RemoteV2 had it hardcoded.
  const widerDelay = 0.05 + members.length * 0.07 + 0.09;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(skin.section, "py-24 md:py-32 px-6 md:px-16 scroll-mt-24", className)}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,50%)_minmax(0,1fr)] gap-14 lg:gap-8 items-center">
          {/* left: badge, mission, CTA. Plain elements, not motion: see the
              PRERENDER note at the top of this file. */}
          <div>
            {eyebrow ? (
              <span className="inline-flex items-center gap-2.5 rounded-pill bg-navy pl-3.5 pr-4 py-2">
                <span className="w-2 h-2 rounded-pill bg-brand" />
                <span className="text-[13px] font-medium text-white">{eyebrow}</span>
              </span>
            ) : null}

            <h2
              id={headingId}
              className="font-serif font-normal text-[27px] sm:text-[32px] md:text-[36px] leading-[1.24] tracking-[-0.01em] text-navy mt-7 mb-0 [&_em]:italic [&_em]:font-normal [&_em]:text-ink"
            >
              {heading}
            </h2>

            {body ? <p className="text-lead text-ink-soft mt-6 mb-0 max-w-[54ch]">{body}</p> : null}

            {cta ? (
              <a
                href={cta.href}
                className="group inline-flex items-center gap-2 bg-brand text-white text-[15px] font-semibold pl-6 pr-5 py-3.5 rounded-pill no-underline hover:opacity-90 transition-opacity mt-9"
              >
                {cta.label}
                <ChevronRight
                  aria-hidden="true"
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                />
              </a>
            ) : null}
          </div>

          {/* right: overlapping oval portraits */}
          <div className="flex items-start justify-start lg:justify-end overflow-x-auto lg:overflow-visible pb-2 pt-2">
            {members.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: 0.05 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginTop: m.offset, marginLeft: i === 0 ? 0 : -20, zIndex: m.z }}
                className="relative shrink-0"
                title={`${m.name} · ${m.role}`}
              >
                <div
                  style={{ width: m.width, height: m.height }}
                  className="relative rounded-pill overflow-hidden bg-brand-tint ring-[5px] ring-paper-bright"
                >
                  <span
                    className="absolute inset-0 grid place-items-center font-serif text-brand"
                    style={{ ...MONOGRAM_TILE, fontSize: Math.round(m.width * 0.33) }}
                  >
                    {initials(m.name)}
                  </span>
                  {m.photo && (
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: m.pos ?? "50% 50%" }}
                      /* the roster lists photos that are not in the repo yet;
                         until each lands, the monogram tile shows instead of a
                         broken image */
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </motion.div>
            ))}

            {/* the wider team */}
            {wider ? (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: widerDelay, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginTop: 70, marginLeft: -20, zIndex: 0 }}
                className="relative shrink-0"
                title={wider.title}
              >
                <div className="w-[78px] h-[112px] rounded-pill ring-[5px] ring-paper-bright bg-navy grid place-items-center">
                  <span className="font-serif text-[22px] text-white">{wider.label}</span>
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>

        {/* stats. Static for the same prerender reason: these captions are real
            copy and a whileInView entrance ships them at opacity:0. */}
        {stats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 mt-20 md:mt-24 max-w-[900px]">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-[54px] md:text-[66px] leading-[0.9] text-navy m-0">
                  {s.value}
                </p>
                <span
                  className={cn(
                    "inline-block mt-5 rounded-pill px-4 py-2 text-[13px] leading-snug text-ink-soft",
                    skin.statPill,
                  )}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
