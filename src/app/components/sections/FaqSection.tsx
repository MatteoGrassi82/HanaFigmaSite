import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";

/**
 * FaqSection — the one FAQ accordion.
 *
 * Replaces eight copy-pasted rows (RemoteV2, HanaRemote, Pricing, the three
 * Sleep pages, Contact, and the inline one on Access), each of which carried
 * its own local question array and its own slightly different chevron.
 *
 * THE PRERENDER RULE, WHICH IS WHY THIS COMPONENT EXISTS AT ALL
 * The build snapshots every route in headless Chrome and that HTML is what
 * Google and the answer engines read. Every one of the originals rendered its
 * answer as {open && <p>}, so in the snapshot the answers did not exist: eight
 * pages shipped FAQ markup with no answers in it. Here the answer is always
 * mounted and the row collapses visually, by animating a CSS grid row from 0fr
 * to 1fr over overflow-hidden content. Nothing is conditionally rendered. Read
 * the JSX below before changing it: an {open && …} anywhere in this file
 * silently un-indexes every FAQ on the site.
 *
 * Two corollaries of the same rule, both easy to undo by accident:
 *  · The collapsed row must not carry `opacity: 0`. Zero-opacity body text is
 *    a hidden-text signal, and the 0fr grid row already hides it. Collapse with
 *    height alone.
 *  · No `whileInView` entrance on the header. The prerender never scrolls and
 *    the viewport is 800x600, so a FAQ this far down the page never intersects
 *    and Motion would bake `opacity: 0` onto the <h2> in the snapshot. Same
 *    reasoning as CtaBand: no entrance animation here at all. Motion is
 *    CSS-only, on hover, focus and the disclosure itself.
 *
 * The JSON-LD is deliberately NOT here. faqSchema() lives in SEO.tsx and the
 * page passes it to <SEO jsonLd={[faqSchema(faqJsonLd(FAQS))]} />, because the
 * prerender parser regex-scrapes the <SEO> block out of the page file.
 * faqSchema() wants {question, answer}, not this file's {q, a}; faqJsonLd()
 * below is that mapping, so nobody hands it the wrong shape and ships a
 * FAQPage full of nulls.
 */

export interface FaqItem {
  q: string;
  a: string;
}

/** Maps these items into the shape SEO.tsx's faqSchema() expects. */
export function faqJsonLd(items: FaqItem[]): { question: string; answer: string }[] {
  return items.map(({ q, a }) => ({ question: q, answer: a }));
}

export interface FaqSectionProps {
  /** The questions. Defaults to a generic, safe set so <FaqSection /> renders. */
  items?: FaqItem[];
  eyebrow?: string;
  /** ReactNode so a page can put an <em> in it. */
  heading?: ReactNode;
  body?: string;
  /** "light" is paper ground and ink type; "navy" is the dark ground. */
  tone?: "light" | "navy";
  /** Tighter vertical rhythm, for a FAQ that sits under a denser section. */
  compact?: boolean;
  /** One row open at a time. Default: rows open and close independently. */
  exclusive?: boolean;
  /** Index of the row open on first paint. Default: all closed. */
  defaultOpen?: number;
  className?: string;
  id?: string;
}

/** Safe, generic defaults. No statistics, no codes, no product names. */
const DEFAULT_ITEMS: FaqItem[] = [
  {
    q: "What does HANA actually do?",
    a: "HANA runs the patient conversations your day has no room for. It calls, it listens, it asks the follow-up question, and it writes back a structured note. Your team reviews, your provider signs.",
  },
  {
    q: "Does this replace our clinical staff?",
    a: "No. HANA does the reaching out and the writing up. The clinical judgment stays with your people, who review every note before anything is signed.",
  },
  {
    q: "Which languages does HANA speak?",
    a: "30+ languages. Your patient answers in the language they think in, and your team reads the note in yours.",
  },
  {
    q: "What happens to what HANA hears?",
    a: "Every conversation leaves a transcript and a structured note, attached to the right patient and to the person who reviews it. You can read any call back, so the record is built while the work happens instead of afterwards.",
  },
  {
    q: "How do we start?",
    a: "Book a call. We look at the workflow you want covered, run it with one small group of patients first, and go wider once you have read the notes yourself.",
  },
];

/* Tone is two palettes over one layout, token-only, so the .cobalt scope and
   any future palette change carry through untouched. The [&_em] rules mean a
   page can accent part of its own heading without knowing the ground it lands
   on, same contract as CtaBand. */
const TONE = {
  light: {
    section: "bg-paper",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-brand",
    body: "text-ink-soft",
    rule: "border-rule",
    question: "text-ink group-hover:text-brand",
    icon: "text-brand",
    answer: "text-ink-soft",
    ring: "focus-visible:ring-brand",
  },
  navy: {
    section: "bg-navy",
    eyebrow: "text-brand-soft",
    heading: "text-white [&_em]:italic [&_em]:font-normal [&_em]:text-brand-soft",
    body: "text-white/75",
    rule: "border-white/15",
    question: "text-white group-hover:text-brand-soft",
    icon: "text-brand-soft",
    answer: "text-white/75",
    ring: "focus-visible:ring-brand-soft",
  },
} as const;

export function FaqSection({
  items = DEFAULT_ITEMS,
  eyebrow = "Questions? Answers.",
  heading = (
    <>
      The things <em>everyone</em> asks.
    </>
  ),
  body,
  tone = "light",
  compact = false,
  exclusive = false,
  defaultOpen,
  className,
  id,
}: FaqSectionProps = {}) {
  const reduce = useReducedMotion();
  const uid = useId();
  const headingId = `${uid}-faq-heading`;
  const [open, setOpen] = useState<number[]>(
    defaultOpen === undefined ? [] : [defaultOpen],
  );
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const skin = TONE[tone];

  const toggle = useCallback(
    (i: number) => {
      setOpen((prev) => {
        if (prev.includes(i)) return prev.filter((n) => n !== i);
        return exclusive ? [i] : [...prev, i];
      });
    },
    [exclusive],
  );

  // Arrow keys walk the questions, Home and End jump to the ends. Enter and
  // Space come free with a real <button>.
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
      const last = items.length - 1;
      let next = -1;
      if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
      else if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next < 0) return;
      e.preventDefault();
      buttons.current[next]?.focus();
    },
    [items.length],
  );

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        skin.section,
        "px-6 md:px-16 scroll-mt-24",
        compact ? "py-16 md:py-20" : "py-24 md:py-32",
        className,
      )}
    >
      <div className="max-w-[820px] mx-auto">
        {/* Plain <div>, not motion.div. See the PRERENDER note at the top: an
            entrance animation here bakes opacity:0 onto the <h2>. */}
        <div className={cn("text-center", compact ? "mb-8" : "mb-10 md:mb-12")}>
          {eyebrow ? (
            <p
              className={cn(
                "text-eyebrow font-bold uppercase mt-0 mb-4",
                skin.eyebrow,
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "font-serif font-normal m-0 text-[32px]/[1.1] sm:text-[40px]/[1.1] md:text-h2",
              skin.heading,
            )}
          >
            {heading}
          </h2>
          {body ? (
            <p
              className={cn(
                "text-lead mt-6 mb-0 mx-auto max-w-[54ch]",
                skin.body,
              )}
            >
              {body}
            </p>
          ) : null}
        </div>

        <div className={cn("border-t", skin.rule, items.length === 0 && "hidden")}>
          {items.map((item, i) => {
            const on = open.includes(i);
            const btnId = `${uid}-faq-q-${i}`;
            const panelId = `${uid}-faq-a-${i}`;
            return (
              <div key={item.q} className={cn("border-b", skin.rule)}>
                <h3 className="m-0">
                  <button
                    type="button"
                    id={btnId}
                    ref={(el) => {
                      buttons.current[i] = el;
                    }}
                    onClick={() => toggle(i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    aria-expanded={on}
                    aria-controls={panelId}
                    className={cn(
                      "group w-full flex items-center justify-between gap-4 text-left",
                      "bg-transparent border-0 cursor-pointer rounded-tile",
                      // outline-hidden, not outline-none: in Tailwind 4
                      // outline-none is outline-style:none, which kills the
                      // focus ring in forced-colors mode where the box-shadow
                      // ring is not painted at all.
                      "focus-visible:outline-hidden focus-visible:ring-2",
                      skin.ring,
                      compact ? "py-4" : "py-5",
                    )}
                  >
                    <span
                      className={cn(
                        "font-medium leading-snug transition-colors duration-200",
                        compact ? "text-[15px]" : "text-[17px]",
                        skin.question,
                      )}
                    >
                      {item.q}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "w-5 h-5 shrink-0",
                        skin.icon,
                        reduce ? "" : "transition-transform duration-300",
                        on ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </button>
                </h3>

                {/* The answer is ALWAYS rendered. Collapsed means a 0fr grid
                    row over overflow-hidden content, so the text is in the
                    prerendered HTML whether the row is open or not. Do not
                    turn this into {on && …}, and do not add opacity:0 to the
                    collapsed state: the row is already zero-height, and
                    zero-opacity body text reads as hidden text. */}
                <div
                  id={panelId}
                  className={cn(
                    "grid motion-reduce:transition-none",
                    reduce ? "" : "transition-[grid-template-rows] duration-300 ease-out",
                  )}
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className={cn(
                        "text-[15px] leading-[1.7] m-0",
                        compact ? "pb-4 pr-6" : "pb-5 pr-8",
                        skin.answer,
                      )}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
