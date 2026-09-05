import { useId, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * Hero — the page hero, two shapes from one component.
 *
 * WHAT IT REPLACES
 * HeroCareJourney in src/app/pages/RemoteV2.tsx: the claim on the left (eyebrow,
 * serif display headline with one line set italic in the brand colour, subhead,
 * CTAs) and a motion graphic on the right. Everything inline there is a prop
 * here, and the Remotion <Player> arrives as `visual`, so this file imports no
 * Remotion, no shader and no one page's artwork.
 *
 * THE TWO SHAPES
 * `visual` decides. With one, the hero is the two-column claim-and-canvas layout
 * the flagship page uses. Without one it centres: single column, wider measure,
 * the copy carrying the page on its own. That second shape is the one most pages
 * use, so it is designed rather than degraded — its own rhythm, its own measures,
 * its own halo, and a hairline that sets the trust line apart.
 *
 * PRERENDER
 * The build snapshots every route in headless Chrome and that HTML is what
 * Google and the answer engines read. A hero is the first thing it must contain,
 * so there is no entrance animation, no state, no effect and nothing rendered
 * conditionally on the client: eyebrow, headline, subhead, both CTAs and the
 * trust line are all in the DOM on first paint. Motion is CSS only, on hover and
 * focus. Do not add `initial={{ opacity: 0 }}` here later — it would bake
 * opacity: 0 onto the most important sentence on the page.
 *
 * TOKENS
 * No hex. Colour, radius, shadow and the type scale come from
 * src/styles/tokens.css, so the hero reskins with the rest of the site and
 * renders correctly inside the .cobalt scope too.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface HeroCta {
  label: string;
  /** "/pricing" routes client side. "https://…" opens in a new tab. "#anchor",
   *  "mailto:" and "tel:" are left alone. */
  href: string;
}

export interface HeroProps {
  /** The small line over the headline. Pass "" to drop it. */
  eyebrow?: string;
  /** ReactNode so a page can break and accent it:
   *  <>More patients.<br />Same team.<br /><em>Better outcomes.</em></>
   *  The <em> is styled here: serif italic, brand colour, same weight. */
  heading?: ReactNode;
  /** Alias for `heading`. The hero's own prop was named `headline`; both work,
   *  `heading` wins, so a page can use whichever name reads better. */
  headline?: ReactNode;
  /** The subhead under the headline. Pass null for a hero with no subhead. */
  body?: ReactNode;
  /** Alias for `body`, for the same reason. `body` wins. */
  sub?: ReactNode;
  /** Pass null for a hero with no button at all. */
  primaryCta?: HeroCta | null;
  secondaryCta?: HeroCta | null;
  /** One quiet line under the buttons. Reassurance, not a claim. */
  trustLine?: ReactNode;
  /** The right-hand slot: a <Player>, an image, a mock UI. Omit it and the hero
   *  centres as a single column, which is the shape most pages want.
   *
   *  The hero renders this node and nothing else: playback gating and reduced
   *  motion belong to the caller. HeroCareJourney used to pause its Remotion
   *  <Player> until the hero was 55% on screen and, under
   *  useReducedMotion(), hold a single frame instead of playing. A page moving
   *  to this component keeps that behaviour by owning the ref and the
   *  useInView/useReducedMotion effect in its own file. */
  visual?: ReactNode;
  tone?: "light" | "navy";
  /** Tighter type and rhythm, for a hero that is an introduction rather than the
   *  page's whole first screen. */
  compact?: boolean;
  className?: string;
  id?: string;
}

/** The discovery call. CtaBand exports the same URL; if a shared constant ever
 *  lands in src/content, both should read it from there. */
const DEMO_HREF = "https://calendly.com/matteowastaken/discoverycall";

const DEFAULT_HEADING = (
  <>
    More patients.
    <br />
    Same team.
    <br />
    <em>Better outcomes.</em>
  </>
);

const DEFAULT_LEDE =
  "Care programs run in house, from enrollment to billing. HANA does the calls and the documentation. Your team reviews, your provider signs.";

/* Tone is two palettes over one layout, both token-only.

   THE "BAND" TONE REPLACED A DARK ONE. Newsprint Ultramarine separates a section
   with a tinted stock and a hairline rule, the way a printed page does, instead
   of reversing out a dark block. --color-band sits 1.30:1 off paper: enough to
   read as a distinct section, nowhere near a hole in the page. --color-navy is
   still genuinely dark and still used, but for the footer, the announcement bar
   and filled buttons, not for a mid-page band. */
const TONES = {
  light: {
    section: "bg-paper border-b border-rule",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-brand",
    body: "text-ink-soft",
    trust: "text-ink-soft",
    rule: "border-rule-soft",
    primary: "bg-navy text-white hover:bg-navy-soft shadow-card",
    ghost: "text-navy border border-rule hover:border-brand hover:bg-brand-tint",
    focus: "focus-visible:ring-brand focus-visible:ring-offset-paper",
    panel: "bg-paper-2",
    glow: "bg-brand/10",
  },
  navy: {
    section: "bg-band border-y border-rule",
    eyebrow: "text-brand",
    heading: "text-ink [&_em]:italic [&_em]:font-normal [&_em]:text-brand",
    body: "text-ink-soft",
    trust: "text-ink-mute",
    rule: "border-rule",
    primary: "bg-brand text-paper-bright hover:bg-navy shadow-card",
    ghost: "text-ink border border-rule hover:bg-paper hover:border-rule-strong",
    focus: "focus-visible:ring-brand focus-visible:ring-offset-band",
    panel: "bg-paper",
    glow: "bg-brand/10",
  },
} as const;

const BUTTON_BASE =
  "group inline-flex items-center justify-center gap-2 rounded-pill px-7 py-3.5 text-[15px] font-semibold no-underline " +
  "transition-colors duration-200 motion-reduce:transition-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

function isRoute(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function CtaLink({
  cta,
  className,
  arrow,
}: {
  cta: HeroCta;
  className: string;
  arrow?: boolean;
}) {
  const content = (
    <>
      {cta.label}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
        />
      )}
    </>
  );

  if (isRoute(cta.href)) {
    return (
      <Link to={cta.href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <a
      href={cta.href}
      className={className}
      {...(isExternal(cta.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}

export function Hero({
  eyebrow = "AI care coordination",
  heading,
  headline,
  body,
  sub,
  primaryCta = { label: "Book a demo", href: DEMO_HREF },
  secondaryCta,
  trustLine,
  visual,
  tone = "light",
  compact = false,
  className,
  id,
}: HeroProps = {}) {
  const headingId = useId();
  const c = TONES[tone];

  /* Explicitly `undefined` means "not passed", so the default stands. `null`
     and "" mean "drop this line". `??` collapsed those two cases and handed a
     page that asked for no subhead the default paragraph instead. */
  const title =
    heading !== undefined ? heading : headline !== undefined ? headline : DEFAULT_HEADING;
  const lede = body !== undefined ? body : sub !== undefined ? sub : DEFAULT_LEDE;

  /* One column, centred, when nothing fills the right-hand slot. */
  const centred = !visual;

  /* The claim. Identical DOM in both shapes; only the alignment and the measures
     change, so a page never gets a different hero depending on the layout. */
  const claim = (
    <div className={cn("relative", centred ? "mx-auto max-w-[820px] text-center" : "w-full max-w-[42rem]")}>
      {eyebrow ? (
        <p className={cn("text-eyebrow font-bold uppercase m-0", compact ? "mb-4" : "mb-6", c.eyebrow)}>
          {eyebrow}
        </p>
      ) : null}

      <h1
        id={headingId}
        className={cn(
          "font-serif font-normal m-0 tracking-[-0.018em]",
          compact
            ? "text-[32px] sm:text-[40px] md:text-h2 leading-[1.06]"
            : "text-[40px] sm:text-[52px] md:text-display xl:text-[72px] leading-[1.02]",
          centred ? "mx-auto max-w-[20ch]" : "max-w-[18ch]",
          c.heading
        )}
      >
        {title}
      </h1>

      {lede ? (
        <p
          className={cn(
            "mb-0",
            compact ? "text-[17px] leading-[1.6] mt-5" : "text-lead mt-6 md:mt-7",
            centred ? "mx-auto max-w-[54ch]" : "max-w-[48ch]",
            c.body
          )}
        >
          {lede}
        </p>
      ) : null}

      {primaryCta || secondaryCta ? (
        <div
          className={cn(
            "flex flex-col sm:flex-row items-stretch sm:items-center gap-3",
            compact ? "mt-7" : "mt-9",
            centred ? "justify-center" : "sm:justify-start"
          )}
        >
          {primaryCta ? (
            <CtaLink cta={primaryCta} arrow className={cn(BUTTON_BASE, c.primary, c.focus)} />
          ) : null}
          {secondaryCta ? (
            <CtaLink cta={secondaryCta} className={cn(BUTTON_BASE, c.ghost, c.focus)} />
          ) : null}
        </div>
      ) : null}

      {trustLine ? (
        <p
          className={cn(
            "m-0 text-[13px] leading-[1.6] font-medium",
            c.trust,
            centred ? cn("mt-10 inline-block border-t pt-5", c.rule) : "mt-8 max-w-[46ch]"
          )}
        >
          {trustLine}
        </p>
      ) : null}
    </div>
  );

  /* ── Single column ──────────────────────────────────────────────────────── */
  if (centred) {
    return (
      <section
        id={id}
        aria-labelledby={headingId}
        className={cn(
          "relative overflow-hidden px-6 md:px-16",
          compact ? "py-16 md:py-24" : "py-24 md:py-32 lg:py-36",
          c.section,
          className
        )}
      >
        {/* Decoration only. Never announced, never clickable. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={cn(
              "absolute -top-[300px] left-1/2 h-[700px] w-[980px] max-w-none -translate-x-1/2 rounded-full blur-[130px]",
              c.glow
            )}
          />
        </div>
        {claim}
      </section>
    );
  }

  /* ── Two columns: the claim, and the canvas ─────────────────────────────── */
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("relative overflow-hidden", c.section, className)}
    >
      {/* The claim gets the larger half. It ran the other way round once, which
          let the artwork dominate a hero whose job is the headline. */}
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]",
          // A floor, not a viewport lock. This was calc(100vh-80px), which
          // hardcoded the height of the site chrome and assumed the announcement
          // bar was present: without it the hero over-reserved and opened with a
          // large empty gap above the headline. A 100vh opener also pushes the
          // rest of the page out of the first frame, which is the one a reader
          // and a link preview both get. Content sets the height now.
          !compact && "lg:min-h-[600px]"
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-center px-6 md:px-12 lg:px-16",
            compact ? "py-14 md:py-20" : "py-20 md:py-24 lg:py-28"
          )}
        >
          {claim}
        </div>

        {/* The canvas. Its ground is a token wash, so a visual with a
            transparent background still sits on something. A caller that brings
            its own full-bleed ground passes it as an absolute first child and
            wraps the artwork in a relative sibling after it, which keeps the
            paint order right:
              visual={<>
                <div className="absolute inset-0"><MyTexture /></div>
                <div className="relative w-full h-full"><Player … /></div>
              </>}
            The inset-0 slot below means the artwork contain-fits and can never
            overflow the panel, however tall it is. */}
        <div
          className={cn(
            "relative overflow-hidden",
            compact
              ? "min-h-[300px] sm:min-h-[400px] lg:min-h-[520px]"
              : "min-h-[360px] sm:min-h-[520px] lg:min-h-[640px]"
          )}
        >
          <div aria-hidden="true" className={cn("absolute inset-0", c.panel)} />
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]",
              c.glow
            )}
          />
          {/* The [&>img] rules are for the plain case only: an <img> handed
              straight in as the visual gets contained instead of cropped. A
              visual wrapped in anything of its own is untouched. */}
          <div className="absolute inset-0 flex items-center justify-center px-4 py-6 md:px-8 md:py-10 [&>img]:max-h-full [&>img]:w-auto [&>img]:object-contain">
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}
