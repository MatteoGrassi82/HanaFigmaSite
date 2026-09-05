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
  { src: "/avatars/archie.jpg", alt: "Archie Defillo, MD", pos: "50% 25%" },
  { src: "/avatars/fakhrudin.png", alt: "Fakhrudin Mohamed, MD", pos: "50% 20%" },
  { src: "/avatars/matteo.jpg", alt: "Matteo Grassi", pos: "50% 25%" },
];

/* Two grounds over one layout, token-only, so a palette change carries through
   untouched. No dark ground here: a statement this large mid-page separates on
   bg-band with a rule, never by reversing out a navy block. */
const TONE = {
  light: {
    section: "bg-paper",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-brand",
    body: "text-ink-soft",
  },
  band: {
    section: "bg-band border-y border-rule",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-brand",
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
          <span className="flex items-center justify-center gap-[0.35em] whitespace-nowrap">
            <motion.span style={{ x: xLeft }} className="inline-block">
              {lead}
            </motion.span>

            {/* The faces: the claim and its proof on the same line. Round crops,
                tight overlap, sized to the cap height so the line still reads as
                type. aria-hidden so the heading announces "Built by clinicians"
                and not a list of names. */}
            {faces.length > 0 ? (
              <motion.span
                aria-hidden
                style={{ scale: faceScale, opacity: faceOpacity }}
                className="relative inline-flex items-center shrink-0 h-[1.06em]"
              >
                {faces.map((f, i) => (
                  <span
                    key={`${f.src}-${i}`}
                    title={f.alt}
                    className="relative inline-block w-[1.06em] h-[1.06em] rounded-full overflow-hidden ring-[0.045em] ring-paper bg-brand-tint"
                    style={{
                      marginLeft: i === 0 ? 0 : "-0.38em",
                      zIndex: faces.length - i,
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
            className="block text-center md:-translate-x-[0.3em] mt-[0.02em]"
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
