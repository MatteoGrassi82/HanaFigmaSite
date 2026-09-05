import { useId, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CtaBand — the closing call to action. Every page ends with this one.
 *
 * WHAT IT REPLACES
 * ReadyToUseSection (navy ground, glow, three pill buttons, zero props, its
 * Calendly URL inline) and the hand-rolled closing section at the end of
 * RemoteV2 (serif heading, concentric rings, a checkmark reassurance row).
 * This takes the better half of each: the navy ground and the pill buttons from
 * the first, the serif display heading, the rings and the reassurance row from
 * the second. Everything that was inline copy is now a prop with a default.
 *
 * PRERENDER
 * The build snapshots every route in headless Chrome and never scrolls, so a
 * closing band is always below the fold when the HTML is captured. That rules
 * out the usual `initial={{ opacity: 0 }}` + `whileInView` entrance: it would
 * bake `opacity: 0` onto the most important copy on the page. So there is no
 * entrance animation here at all. Nothing is conditionally rendered, nothing
 * waits on an effect, and the band is fully painted in the snapshot. Motion is
 * CSS-only, on hover and focus.
 *
 * TOKENS
 * No hex. Colour, radius, shadow and the type scale come from
 * src/styles/tokens.css, so the band reskins with the rest of the site and
 * renders correctly inside the .cobalt scope too.
 * ─────────────────────────────────────────────────────────────────────────── */

export type CtaButtonVariant = "primary" | "ghost";

export interface CtaButton {
  label: string;
  /** "/pricing" routes client side. "https://…" opens in a new tab. "#anchor",
   *  "mailto:" and "tel:" are left alone. */
  href: string;
  variant?: CtaButtonVariant;
}

export interface CtaBandProps {
  eyebrow?: string;
  /** ReactNode so a page can accent part of it: <>Book a demo. <em>Today.</em></> */
  heading?: ReactNode;
  body?: string;
  buttons?: CtaButton[];
  /** The short checkmark row under the buttons. Pass [] to drop it. */
  reassurances?: string[];
  tone?: "navy" | "light";
  /** Tighter vertical rhythm, for when the band is not the page's last word. */
  compact?: boolean;
  className?: string;
  id?: string;
}

/** The discovery call. Exported so pages link to the same place from elsewhere. */
export const DEMO_HREF = "https://calendly.com/matteowastaken/discoverycall";

const DEFAULT_BUTTONS: CtaButton[] = [
  { label: "Book a demo", href: DEMO_HREF },
  { label: "See pricing", href: "/pricing", variant: "ghost" },
];

const DEFAULT_REASSURANCES = [
  "Runs in the EHR you already use",
  "Your team reviews, your provider signs",
  "No app for patients to download",
];

/* Tone is two palettes over one layout. Both are token-only, so the .cobalt
   scope and any future palette change carry through untouched. */
const TONES = {
  navy: {
    section: "bg-navy",
    eyebrow: "text-brand-soft",
    heading: "text-white [&_em]:not-italic [&_em]:text-brand-soft",
    body: "text-white/75",
    ring: "border-white/10",
    glow: "bg-brand/25",
    primary: "bg-white text-navy hover:bg-white/90 shadow-float",
    ghost: "text-white border border-white/25 hover:bg-white/10 hover:border-white/45",
    chip: "border-white/15 bg-white/[0.07] text-white/90",
    check: "text-brand-soft",
    focus: "focus-visible:ring-brand-soft focus-visible:ring-offset-navy",
  },
  light: {
    section: "bg-paper border-t border-rule-soft",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:not-italic [&_em]:text-brand",
    body: "text-ink-soft",
    ring: "border-brand/15",
    glow: "bg-brand/10",
    primary: "bg-navy text-white hover:bg-navy-soft shadow-card",
    ghost: "text-navy border border-rule hover:border-brand hover:bg-brand-tint",
    chip: "border-rule bg-paper-bright text-ink",
    check: "text-brand",
    focus: "focus-visible:ring-brand focus-visible:ring-offset-paper",
  },
} as const;

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill px-7 py-3.5 text-[15px] font-semibold no-underline " +
  "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

function isRoute(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function CtaBand({
  eyebrow = "Ready when you are",
  heading = "Book a demo.",
  body = "Bring one workflow you want to hand off. You see how it runs, what your team reviews, and what it takes to go live.",
  buttons = DEFAULT_BUTTONS,
  reassurances = DEFAULT_REASSURANCES,
  tone = "navy",
  compact = false,
  className,
  id,
}: CtaBandProps = {}) {
  const headingId = useId();
  const c = TONES[tone];

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "relative overflow-hidden px-6 md:px-16",
        compact ? "py-16 md:py-20" : "py-24 md:py-32",
        c.section,
        className
      )}
    >
      {/* Decoration only. Never announced, never clickable. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={cn("absolute left-1/2 -translate-x-1/2 -bottom-[190px] h-[540px] w-[540px] rounded-full border", c.ring)} />
        <div className={cn("absolute left-1/2 -translate-x-1/2 -bottom-[115px] h-[350px] w-[350px] rounded-full border", c.ring)} />
        <div className={cn("absolute -top-[30%] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[110px]", c.glow)} />
      </div>

      <div className="relative mx-auto max-w-[860px] text-center">
        {eyebrow && (
          <p className={cn("text-eyebrow font-bold uppercase m-0 mb-5", c.eyebrow)}>{eyebrow}</p>
        )}

        <h2
          id={headingId}
          className={cn(
            "font-serif font-normal text-[36px] sm:text-[46px] md:text-display leading-[1.04] tracking-[-0.01em] max-w-[18ch] mx-auto mt-0 mb-0",
            c.heading
          )}
        >
          {heading}
        </h2>

        {body && (
          <p className={cn("text-lead max-w-[46ch] mx-auto mt-6 mb-0", c.body)}>{body}</p>
        )}

        {buttons.length > 0 && (
          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            {buttons.map((btn) => {
              const variant = btn.variant ?? "primary";
              const classes = cn(BUTTON_BASE, c.focus, variant === "primary" ? c.primary : c.ghost, "group");
              const label = (
                <>
                  {btn.label}
                  {variant === "primary" && (
                    <ArrowRight
                      aria-hidden="true"
                      className="w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-x-1"
                    />
                  )}
                </>
              );

              if (isRoute(btn.href)) {
                return (
                  <Link key={btn.href + btn.label} to={btn.href} className={classes}>
                    {label}
                  </Link>
                );
              }
              return (
                <a
                  key={btn.href + btn.label}
                  href={btn.href}
                  className={classes}
                  {...(isExternal(btn.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {label}
                </a>
              );
            })}
          </div>
        )}

        {reassurances.length > 0 && (
          <ul role="list" className="mt-9 flex flex-wrap items-center justify-center gap-2.5 p-0 m-0 list-none">
            {reassurances.map((r) => (
              <li
                key={r}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-1.5 text-[13px] font-medium",
                  c.chip
                )}
              >
                <Check aria-hidden="true" strokeWidth={3} className={cn("w-3.5 h-3.5 shrink-0", c.check)} />
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
