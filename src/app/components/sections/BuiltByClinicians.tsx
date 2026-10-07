import { useId, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "../../../lib/utils";

/**
 * BuiltByClinicians — the giant serif statement with the team's faces set
 * inline in the headline.
 *
 * Extracted from RemoteV2 (§7) so /about and the audience pages can mount the
 * same statement with their own words and their own roster.
 *
 * THE ANIMATION, unchanged from the original
 * Scroll-linked, not whileInView. `lead` starts pushed out to the left and
 * `trail` out to the right; both converge on centre as the section travels from
 * "start end" to "center 0.45". `tail` rises from below on its own line, and
 * the ring of faces scales up from 0.75. useReducedMotion flattens every range
 * to its resting value, so a reduced-motion visitor gets the statement still.
 *
 * THE PRERENDER FIX, which is the one thing that is not a straight copy
 * The build snapshots every route in headless Chrome at 800x600 and NEVER
 * scrolls, and that HTML is what Google reads. This section sits far below the
 * fold, so at snapshot time scrollYProgress is pinned at 0. The original ran
 * the words through a [0, 0.55, 1] opacity ramp off that same progress value,
 * which baked `opacity: 0` onto all three words of the headline: in the
 * shipped HTML the biggest sentence on the page was invisible text.
 *
 * So the opacity ramp now drives ONLY the ring of faces, which is decorative
 * and aria-hidden. The words animate on transform alone: they still slide and
 * rise exactly as before, they are simply never transparent. A translated word
 * is real, readable, indexable text at any scroll position; a zero-opacity one
 * is a hidden-text signal. Do not put `opacity` back on the word spans.
 *
 * THE FACES
 * Each circle carries a drawn silhouette, and layered over it a photo that
 * appears only when its file lands in /public/avatars. fakhrudin.png exists
 * today; archie.jpg and matteo.jpg are still pending, and `onError` hides the
 * broken <img> so the silhouette shows through instead. Same lazy-photo
 * pattern as the team section. A missing portrait must never leave a broken
 * image in the headline.
 */

export interface BuiltByFace {
  /** Path under /public. A file that is not there yet falls back to the silhouette. */
  src: string;
  /** Who it is. Used as the image alt and as the hover title. */
  alt?: string;
  /** CSS object-position: where to crop the portrait. Default "50% 25%". */
  pos?: string;
}

export interface BuiltByCliniciansProps {
  eyebrow?: string;
  /**
   * The statement, in three parts, because the geometry is the point: `lead`
   * comes in from the left, the faces sit between `lead` and `trail`, `trail`
   * comes in from the right, and `tail` rises from below on its own line.
   * Each is a ReactNode, so a page can pass an <em>.
   */
  lead?: ReactNode;
  trail?: ReactNode;
  tail?: ReactNode;
  /** Optional subline under the statement. Renders static. Off by default. */
  body?: string;
  /** The faces set inline in the first line, left to right. */
  faces?: BuiltByFace[];
  /** "light" is the paper ground; "band" separates on bg-band with a hairline. */
  tone?: "light" | "band";
  className?: string;
  id?: string;
}

/** The three clinicians in the headline, left to right. */
const DEFAULT_FACES: BuiltByFace[] = [
  /* The BADGE variants from _TEAM-BADGES, installed 8 Sept 2026: duotone
     halftone portraits on a circular periwinkle field, transparent outside the
     circle. They are the right set for THIS section and the wrong set for
     TeamSection: these frames are real circles (rounded-full at 1.06em), so the
     badge's own circular field lands exactly inside the mask and its designed
     edge survives. objectPosition is "50% 50%" rather than the old "50% 25%"
     because a badge is already composed and centred -- pulling it up 25% would
     crop the field the design puts around the face. */
  { src: "/avatars/badge-archie.webp", alt: "Archie Defillo, MD", pos: "50% 50%" },
  { src: "/avatars/badge-mohamed.webp", alt: "Fakhrudin Mohamed, MD", pos: "50% 50%" },
  { src: "/avatars/badge-matteo.webp", alt: "Matteo Grassi", pos: "50% 50%" },
];

/* Two grounds over one layout, token-only, so a palette change carries through
   untouched. No dark ground here: a statement this large mid-page separates on
   bg-band with a rule, never by reversing out a navy block. */
const TONE = {
  light: {
    section: "bg-paper",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
    body: "text-ink-soft",
  },
  band: {
    section: "bg-band border-y border-rule",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
    body: "text-ink-soft",
  },
} as const;

export function BuiltByClinicians({
  eyebrow,
  lead = "Built",
  trail = "by",
  tail = "clinicians",
  body,
  faces = DEFAULT_FACES,
  tone = "light",
  className,
  id,
}: BuiltByCliniciansProps = {}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const uid = useId();
  const headingId = `${uid}-built-by-heading`;
  const skin = TONE[tone];

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.45"] });
  const still = [0, 0] as [number, number];
  const xLeft = useTransform(scrollYProgress, [0, 1], reduce ? still : [-170, 0]);
  const xRight = useTransform(scrollYProgress, [0, 1], reduce ? still : [170, 0]);
  const yLine2 = useTransform(scrollYProgress, [0, 1], reduce ? still : [70, 0]);
  const faceScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.75, 1]);
  // Decorative only. See the PRERENDER note above: this never touches the words.
  const faceOpacity = useTransform(scrollYProgress, [0, 0.3, 1], reduce ? [1, 1, 1] : [0, 0.55, 1]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={headingId}
      className={cn(skin.section, "py-24 md:py-36 px-6 overflow-hidden scroll-mt-24", className)}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Plain <p>, not motion.p. Nothing above the fold rule applies to the
            eyebrow too: it is text, so it never fades in. */}
        {eyebrow ? (
          <p className={cn("text-eyebrow font-bold uppercase text-center mt-0 mb-6", skin.eyebrow)}>
            {eyebrow}
          </p>
        ) : null}

        <h2
          id={headingId}
          className={cn(
            "font-serif font-normal leading-[1.04] tracking-[-0.02em] m-0",
            "text-[48px] sm:text-[80px] md:text-[112px]",
            skin.heading,
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center whitespace-nowrap",
              /* 0.35em flanks the face cluster. With no faces (how /remote-v2
                 runs it since 2026-09-26) the two words need a normal word space,
                 and line two below drops the nudge that only balanced the faces. */
              faces.length > 0 ? "gap-[0.35em]" : "gap-[0.26em]",
            )}
          >
            <motion.span style={{ x: xLeft }} className="inline-block">
              {lead}
            </motion.span>

            {/* The faces: the claim and its proof on the same line. aria-hidden
                so the heading announces "Built by clinicians" and not a list of
                names.

                CLUSTERED 2-OVER-1, NOT A ROW OF THREE. Matteo, 8 Sept 2026:
                "dont like the 3 dots could do 2 and one below". Three circles
                in a line read as an ellipsis rather than as people, and they
                cost about 2em of inline width inside a 112px serif headline --
                which is what pushed "by" to the right and broke the line as
                "Built ... by / clinicians". Two up and one below is the same
                three faces in roughly 1.35em, so the headline holds together.

                GEOMETRY. The cluster is a positioned box, not a flex row: two
                circles on the top row overlapping by 0.3em, the third centred
                beneath and pulled up 0.34em so it nests into the notch between
                them. The box is sized to the visual bounds and given a small
                negative vertical margin, so the taller-than-cap-height cluster
                still sits on the type's optical centre instead of pushing the
                line box open. Widths are in `em`, so it all tracks the
                responsive 48/80/112px heading with no breakpoints of its own. */}
            {faces.length > 0 ? (
              <motion.span
                aria-hidden
                style={{ scale: faceScale, opacity: faceOpacity }}
                className="relative inline-block shrink-0 align-middle w-[1.40em] h-[1.44em] -my-[0.19em]"
              >
                {faces.map((f, i) => (
                  <span
                    key={`${f.src}-${i}`}
                    title={f.alt}
                    className="absolute w-[0.86em] h-[0.86em] rounded-full overflow-hidden ring-[0.045em] ring-paper bg-brand-tint"
                    style={{
                      /* 0,1 -> top row; 2 -> centred below, nested up into the
                         notch. A fourth face would need a real layout decision,
                         so the fallback keeps it on the bottom row beside the
                         third rather than inventing a 2x2 the copy never asks
                         for. */
                      left: i === 0 ? 0 : i === 1 ? "0.54em" : "0.27em",
                      top: i < 2 ? 0 : "0.58em",
                      /* THE BOTTOM FACE SITS BEHIND THE TOP TWO, which is the
                         opposite of the obvious choice and the reason all three
                         faces stay readable. Drawn in front, it overlapped the
                         second face by 72% horizontally and buried her -- and
                         she is a real named clinician, so a decorative stack
                         that hides her is not a style question. Behind, the
                         only thing occluded is the top 30% of its own disc,
                         which is hair and field rather than a face, because the
                         badge treatment centres every subject in its circle. */
                      zIndex: i < 2 ? faces.length - i : 0,
                      boxShadow: "0 10px 30px color-mix(in srgb, var(--color-navy) 20%, transparent)",
                    }}
                  >
                    {/* the silhouette, always there */}
                    <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
                      <circle cx="20" cy="15" r="7" fill="var(--color-brand-soft)" />
                      <path d="M6 38c1.8-8.3 7.4-12.5 14-12.5S32.2 29.7 34 38Z" fill="var(--color-brand-soft)" />
                    </svg>
                    {/* the photo, when its file exists */}
                    <img
                      src={f.src}
                      alt={f.alt ?? ""}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: f.pos ?? "50% 25%" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </span>
                ))}
              </motion.span>
            ) : null}

            <motion.span style={{ x: xRight }} className="inline-block">
              {trail}
            </motion.span>
          </span>

          <motion.span
            style={{ y: yLine2 }}
            className={cn("block text-center mt-[0.02em]", faces.length > 0 && "md:-translate-x-[0.3em]")}
          >
            {tail}
          </motion.span>
        </h2>

        {body ? (
          <p className={cn("text-lead text-center mx-auto max-w-[54ch] mt-10 mb-0", skin.body)}>
            {body}
          </p>
        ) : null}
      </div>
    </section>
  );
}
