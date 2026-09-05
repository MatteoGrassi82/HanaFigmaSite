import { useId, type ReactNode } from "react";
import { Link } from "react-router";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  PROGRAMME_FOOTNOTE,
  type Programme,
} from "../../../content/programmes/index";

/* ─────────────────────────────────────────────────────────────────────────────
 * EligibilityCheck — who qualifies, answered plainly.
 *
 * WHAT IT IS. The static statement of eligibility a programme page needs, so a
 * reader can see in five seconds whether their patients count. Three steps:
 * the patient, the month, and consent. Not a quiz and not a calculator; the
 * interactive version already exists as ProgrammeChooser in lab/interactive.
 *
 * WHERE THE FACTS COME FROM. Every claim on screen is a field of the programme
 * object passed in, rendered as written:
 *   step 1  data.who   the eligibility rule, verbatim
 *   step 2  data.rule  what the month requires, verbatim
 *   aside   data.note  the rule that qualifies the rest, verbatim
 *   footer  PROGRAMME_FOOTNOTE, verbatim
 * Those strings were fact-checked 2026-08-19 against primary CMS documents and
 * are not reworded here, not even for length. This component writes labels and
 * connective prose and nothing else. No code, no dollar figure and no rule is
 * typed into this file. If you find yourself adding one, it belongs in
 * src/content/programmes/index.ts with a source beside it.
 *
 * STEP 3 IS THE HONEST ONE. TODO(consent) and TODO(initiating-visit) in the
 * content module say plainly that we do not hold how consent is obtained and
 * documented, who obtains it, whether it is once or annual, or which programmes
 * need an initiating visit. So step 3 states only whether the programme's own
 * record mentions either, and then says the rest is a conversation. It never
 * implies a rule. When those TODOs are answered, add the fields to Programme
 * and render them here; do not fill the gap from memory.
 *
 * PRERENDER. The build snapshots every route in headless Chrome at 800x600 and
 * never scrolls, so this section is static by design: no state, no effects, no
 * disclosure, no whileInView on the header. Everything is in the DOM on first
 * paint. Motion is CSS only, on hover and focus.
 *
 * PALETTE. Two grounds, paper and band, both light. No dark block mid-page, and
 * the one link is underlined because the accent alone is 2.44:1 against ink.
 *
 * THE IMPORT PATH IS EXPLICIT ON PURPOSE. src/content/programmes.ts (the older
 * marquee card copy) and src/content/programmes/index.ts both exist, and a bare
 * "../../../content/programmes" resolves to the FILE, which exports none of
 * this. Keep the "/index" on the end until one of the two is renamed.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface EligibilityCheckProps {
  /**
   * The programme. Required, like WhoDoesWhat's. It used to default to
   * PROGRAMMES[0]; that meant an APCM page that forgot the prop rendered CCM's
   * eligibility rule and CCM's codes under an APCM heading, silently and with
   * no type error. Wrong billing copy must fail the build, not the reader.
   */
  data: Programme;
  eyebrow?: string;
  /** ReactNode so a page can put an <em> in it. */
  heading?: ReactNode;
  /** The line under the heading. Defaults to the programme's own summary. */
  body?: string;
  /** "light" is paper ground, "band" is the alternating ground with hairlines. */
  tone?: "light" | "band";
  /** Where "Talk to us" goes. */
  contactHref?: string;
  /** The standing programme footnote. Pass null when a page shows it elsewhere. */
  footnote?: ReactNode;
  className?: string;
  id?: string;
}

const TONE = {
  light: {
    section: "bg-paper",
    card: "bg-paper-bright border-rule",
    aside: "bg-brand-tint border-rule",
    rule: "border-rule",
  },
  band: {
    section: "bg-band border-y border-rule",
    card: "bg-paper-bright border-rule",
    aside: "bg-paper-bright border-rule",
    rule: "border-rule",
  },
} as const;

/* Does the programme's own record mention consent, or an initiating visit?
 * Read across every verbatim field rather than one of them, so a fact moving
 * from `rule` to `lands` does not silently change what step 3 says. Today:
 * CCM names consent in `rule`, APCM names both in `lands`, BHI and RTM name
 * neither, which is exactly the state the copy has to survive. */
function mentions(data: Programme, pattern: RegExp): boolean {
  const fields = [
    data.who,
    data.rule,
    data.team,
    data.note ?? "",
    ...data.hana,
    ...data.lands,
  ];
  return fields.some((field) => pattern.test(field));
}

interface Step {
  /** The numeral in the rail. Order, not a score. */
  n: string;
  title: string;
  /** The sentence that carries the fact. Verbatim from the data in steps 1 and 2. */
  lead: string;
  /** The qualifier under it. This component's own words, no facts in them. */
  tail: string;
}

function stepsFor(data: Programme): Step[] {
  const consent = mentions(data, /consent/i);
  const initiating = mentions(data, /initiating[\s-]visit/i);

  /* Three branches, and each one says only what the data holds. Nothing here
   * asserts that a programme does or does not require consent: it reports
   * whether the programme's own record names it, then stops. */
  const lead = initiating
    ? "Consent and the initiating visit are part of what this program leaves in the record."
    : consent
      ? "Consent is inside the requirement above. The month runs against a care plan the patient has consented to."
      : "Our record for this program does not set out how consent is taken, or whether a visit has to come first, so this page states neither. That is a gap in what we hold, not a rule that either one is unnecessary.";

  return [
    {
      n: "1",
      title: "The patient",
      lead: data.who,
      tail: "If that does not describe your patient, nothing below applies.",
    },
    {
      n: "2",
      title: "The month",
      lead: data.rule,
      /* Do NOT name a unit here. The programmes do not share one: CCM, APCM and
       * BHI are stated per month, RTM is sixteen days of data in thirty. Saying
       * "a calendar month is the unit" is a billing rule this file does not
       * hold, so the tail points back at the sourced sentence instead. */
      tail: "Read it one patient at a time, exactly as it is written above.",
    },
    {
      n: "3",
      title: initiating ? "Consent and the initiating visit" : "Consent",
      lead,
      tail: "How consent is taken and recorded, and whether a visit has to come first, are not settled on this page. We will not print a rule we cannot source. Ask us before you enroll anyone.",
    },
  ];
}

export function EligibilityCheck({
  data,
  eyebrow = "Eligibility",
  heading,
  body,
  tone = "light",
  contactHref = "/contact",
  footnote = PROGRAMME_FOOTNOTE,
  className,
  id,
}: EligibilityCheckProps) {
  const uid = useId();
  const headingId = `${uid}-eligibility-heading`;
  const skin = TONE[tone];
  const steps = stepsFor(data);

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        skin.section,
        "font-sans px-6 md:px-16 py-20 md:py-28 scroll-mt-24",
        className,
      )}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Plain <div>. An entrance animation here bakes opacity:0 onto the
            <h2> in the prerendered snapshot, which is a real bug this site
            has already shipped once. Headers render static. */}
        <div className="max-w-[720px] mx-auto text-center">
          {eyebrow ? (
            <p className="text-eyebrow font-bold uppercase text-ink-mute mt-0 mb-4">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "font-serif font-normal m-0 text-[32px]/[1.1] sm:text-[40px]/[1.1] md:text-h2",
              "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
            )}
          >
            {heading ?? (
              <>
                Who qualifies for <em>{data.code}</em>.
              </>
            )}
          </h2>
          <p className="text-lead text-ink-soft mt-5 mb-0 mx-auto max-w-[58ch]">
            {body ?? data.summary}
          </p>
          <p
            className={cn(
              "inline-flex items-center gap-2 mt-6 mb-0 px-3 py-1.5",
              "rounded-pill border text-[13px] text-ink-mute",
              skin.rule,
            )}
          >
            <span className="font-semibold text-ink">{data.name}</span>
            <span aria-hidden="true">·</span>
            <span>{data.codes}</span>
          </p>
        </div>

        <ol className="list-none p-0 mt-12 md:mt-14 mb-0 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.title}
              className={cn(
                "h-full flex flex-col border rounded-card shadow-card p-6 md:p-7",
                skin.card,
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-7 h-7 shrink-0 grid place-items-center rounded-pill bg-paper-2 text-ink-soft text-[13px] font-semibold"
                >
                  {step.n}
                </span>
                <h3 className="m-0 text-[13px] font-bold uppercase tracking-[1.6px] text-ink">
                  {step.title}
                </h3>
              </div>
              <p className="m-0 mt-4 text-[17px] leading-[1.5] text-ink">
                {step.lead}
              </p>
              <p className="m-0 mt-3 text-[14px] leading-[1.65] text-ink-soft">
                {step.tail}
              </p>
            </li>
          ))}
        </ol>

        {/* The rule that qualifies the rest, rendered as an aside rather than
            buried in a footnote. Verbatim, and only when the data carries one. */}
        {data.note ? (
          <div
            className={cn(
              "mt-4 flex items-start gap-3 border rounded-card p-5 md:p-6",
              skin.aside,
            )}
          >
            <Info aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5 text-brand" />
            <div>
              <p className="m-0 text-[13px] font-bold uppercase tracking-[1.6px] text-ink-mute">
                One more rule
              </p>
              <p className="m-0 mt-2 text-[15px] leading-[1.65] text-ink">
                {data.note}
              </p>
            </div>
          </div>
        ) : null}

        <p className="mt-8 mb-0 text-[16px] leading-[1.6] text-ink-soft text-center">
          Not sure whether your patients count?{" "}
          {/* Underlined, always. The accent is 2.44:1 against body ink, so
              colour on its own cannot mark a link here. */}
          <Link
            to={contactHref}
            className="text-brand font-medium underline underline-offset-4 decoration-2 hover:text-navy focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand rounded-tile"
          >
            Talk to us
          </Link>{" "}
          and we will go through your panel with you.
        </p>

        {footnote ? (
          <p
            className={cn(
              "max-w-[80ch] mx-auto mt-10 pt-6 mb-0 border-t",
              "text-[13px] leading-[1.7] text-ink-soft",
              skin.rule,
            )}
          >
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
