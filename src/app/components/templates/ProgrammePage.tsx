import type { ReactNode } from "react";
import { ProgrammeHero } from "../sections/ProgrammeHero";
import type { HeroCardRow } from "../sections/PhotoHero";
import { EligibilityCheck } from "../sections/EligibilityCheck";
import { PayVisual } from "../sections/PayVisual";
import { WhoDoesWhat } from "../sections/WhoDoesWhat";
import { WhyHana } from "../sections/WhyHana";
import { HowItWorksLoop } from "../sections/HowItWorksLoop";
import { MonthWrittenUp, type LogEntry } from "../sections/MonthWrittenUp";
import { RevenueEstimator } from "../sections/RevenueEstimator";
import { SonicDemoSection } from "../sections/SonicDemoSection";
import { FaqSection } from "../sections/FaqSection";
import { CtaBand, DEMO_HREF } from "../sections/CtaBand";
import { Footer } from "../layout/Footer";
import type { Programme, ProgrammeId } from "../../../content/programmes/index";

/**
 * ProgrammePage — the body of a /programs/* page.
 *
 * EXTRACTED FROM TWO REAL PAGES, NOT DESIGNED UP FRONT. CCM and APCM were each
 * written by hand first; this is what turned out to be identical between them.
 * If a programme needs something this does not take, add the prop rather than
 * forking the template.
 *
 * IT IS A BODY, NOT A PAGE. The <SEO> block stays in the page file and must be a
 * LITERAL there. scripts/lib/route-seo.mjs regex-scrapes it and requires `path`
 * to be a plain double-quoted string starting with "/". Put the SEO block in here
 * and the parser finds one unresolvable path, skips the route, and EVERY
 * programme page prerenders with the generic default title and description, with
 * no build error. You would find out from Search Console.
 *
 * ── 7 SEPT 2026: THE SOUL PASS ────────────────────────────────────────────
 * Matteo reviewed /programs/chronic-care-management and named three faults:
 * the hero was "bland, missing the soul" (it opened on a CPT string), the pay
 * table was "too much text" (1,692px: five prose rows + six caveat paragraphs),
 * and the page had no live content. He pointed at the sections on the current
 * site that DO have soul -- the reach bars, the photo cards, the written-up
 * month, the chat with HANA -- and asked for them here. So:
 *
 *   Hero            -> ProgrammeHero   a person in a photo, the month's activity
 *                                      card floated over it. The CPT codes moved
 *                                      down to the pay section where they belong.
 *   CodeTable       -> PayVisual       one number, one 80/20 bar, the family as
 *                                      chips, all six caveats folded behind one
 *                                      disclosure. Nothing cut; folded.
 *   + WhyHana                          the reach-by-channel bars. SEE THE FLAG
 *                                      BELOW before treating them as evidence.
 *   + MonthWrittenUp                   the time log already full when the
 *                                      clinician presses start. Illustrative.
 *   + SonicDemoSection                 "Have a chat with HANA". Live: the real
 *                                      LiveDemoSection form and the Vapi web-call
 *                                      handlers, threaded in from App.tsx as
 *                                      `webCall`. Rendered only when provided.
 *
 * THE ORDER IS STILL THE ARGUMENT. Six questions a practice manager asks, in
 * the order they ask them; the new sections slot into that order rather than
 * reordering it:
 *   0. Is this a real patient and a real month?   ProgrammeHero
 *   1. Is this me?                                EligibilityCheck
 *   2. What does it pay?                          PayVisual
 *   3. What do I have to do?                      WhoDoesWhat  <- closes it
 *      Why does the month actually happen?        WhyHana (reach)
 *   4. How does it run?                           HowItWorksLoop
 *      What does the month produce?               MonthWrittenUp
 *   5. What is it worth?                          RevenueEstimator (locked)
 *      Can I hear it?                             SonicDemoSection
 *   6. What is the catch?                         openQuestions, stated
 *
 * ███ THE WHYHANA FLAG. ███ The four percentages in WhyHana (58 / 30 / 85 / 33,
 * share of patients reached by channel) carry NO citation anywhere in this
 * repo. They are on the homepage today and Matteo asked for them here, so they
 * are here -- but they are the only figures on a programme page that are not a
 * CMS rate or an attributed third-party statistic, and the audience pages were
 * built under a rule that excludes exactly this. Source them or retire them
 * before these routes leave NOINDEX_ROUTES. `reach={false}` turns them off.
 *
 * NO WORKFLOW MARQUEE. It answered the same question as HowItWorksLoop at 609
 * words to its 231. Two sections answering one question is what makes a page
 * feel long. NO PROOFBENTO: generic quotes on a programme page read as borrowed
 * credibility. It comes back per-programme when there is a case study for it.
 */

/** The web-call handlers App.tsx owns. Same shape RemoteV2 takes. */
export interface WebCallProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

export interface ProgrammePageProps {
  /** The programme. Everything downstream reads from this one object. */
  data: Programme;

  /** The hero headline. Human-written per page: never generate it from `data`,
   *  because this is one of the strings a person signs off. */
  headline: ReactNode;

  /** Questions and answers for this programme. Shared in SHAPE across pages,
   *  never in ANSWER. Every answer must trace to the content module or rates.ts;
   *  anything needing a fact we do not hold belongs in `openQuestions`. */
  faqs: { q: string; a: string }[];

  /** What the page will not guess at. Rendered ON the page, not hidden in a
   *  comment, because these are billing rules and a plausible-sounding answer is
   *  worse than no answer. The block disappears when the array is empty, which is
   *  also the moment the route can move out of NOINDEX_ROUTES. */
  openQuestions?: { q: string; needs: string }[];

  /** Defaults to `data.summary`. */
  heroBody?: string;

  /** Rows for the hero's activity card. Defaults to the loop, which is true for
   *  every programme; pass rows when this programme's month has its own shape. */
  heroRows?: HeroCardRow[];

  /** Entries for the written-up month. Defaults per programme (see LOG_BY_ID),
   *  falling back to a generic month. Illustrative, and labelled so on screen. */
  monthLog?: LogEntry[];

  /** Whether to show RevenueEstimator. Defaults to true.
   *
   *  SET THIS FALSE WHEN THE PROGRAMME IS NOT BILLED PER PATIENT PER MONTH.
   *  RevenueEstimator models a monthly enrolled panel and every string inside
   *  it says so. TCM is billed once per qualifying DISCHARGE, so pointing the
   *  estimator at it multiplies a per-discharge amount by a monthly enrolled
   *  panel and prints a number that is wrong by however many of those patients
   *  were never discharged. A wrong number with a confident serif on it is
   *  worse than no number, so TCM shows none. */
  showEstimator?: boolean;

  /** The reach-by-channel bars. See THE WHYHANA FLAG in the docblock. */
  reach?: boolean;

  /** App.tsx's web-call handlers. When present, "Have a chat with HANA" renders
   *  with the real form and the real Vapi handlers. When absent, no section. */
  webCall?: WebCallProps;
}

/* ── Example months, per programme ──────────────────────────────────────────
 * ILLUSTRATIVE. Not real patients, not real readings, and the card says so.
 * Each is shaped to the programme's actual requirement (CCM: 20 min of staff
 * time across the month on two-plus conditions). Programmes without an entry
 * get GENERIC_LOG, which is the loop and true for all of them. Add a real one
 * here when a programme page is reviewed, the way CCM's was on 7 Sept 2026. */
const CCM_LOG: LogEntry[] = [
  { day: "Aug 3", title: "Monthly check-in", body: "Taking both blood pressure meds. Home reading 138/86.", src: "HANA call · summarised", len: "6 min" },
  { day: "Aug 11", title: "Refill and diet", body: "Metformin refill due Friday. Two skipped breakfasts this week.", src: "HANA call · summarised", len: "5 min" },
  { day: "Aug 18", title: "Threshold crossed", body: "158/94 on two home readings. Escalated to Dr Reyes with the full call.", src: "HANA call · flagged to the threshold you set", len: "7 min" },
  { day: "Aug 26", title: "Care plan review", body: "Dose adjusted 20 Aug. Back to 134/84. Goals reconfirmed with the patient.", src: "HANA call · summarised", len: "4 min" },
];

const GENERIC_LOG: LogEntry[] = [
  { day: "Wk 1", title: "First contact of the month", body: "Reached on the second attempt. Symptoms stable, questions answered.", src: "HANA call · summarised", len: "6 min" },
  { day: "Wk 2", title: "Follow-up", body: "Medication taken as planned. One new concern noted for the clinician.", src: "HANA call · summarised", len: "5 min" },
  { day: "Wk 3", title: "Flag", body: "Reported change against the threshold your clinicians set. Escalated live.", src: "HANA call · flagged to the threshold you set", len: "6 min" },
  { day: "Wk 4", title: "Month closed", body: "Plan reconfirmed. Time attributed, note in the chart, waiting for review.", src: "HANA call · summarised", len: "4 min" },
];

const LOG_BY_ID: Partial<Record<ProgrammeId, LogEntry[]>> = { ccm: CCM_LOG };

export function ProgrammePage({
  data,
  headline,
  faqs,
  openQuestions = [],
  heroBody,
  heroRows,
  monthLog,
  showEstimator = true,
  /* Off by default since 7 Oct 2026, the day these pages published: the four
     WhyHana percentages still carry no citation anywhere in the repo (see THE
     WHYHANA FLAG above), and a published page does not run unsourced figures. */
  reach = false,
  webCall,
}: ProgrammePageProps) {
  const log = monthLog ?? LOG_BY_ID[data.id] ?? GENERIC_LOG;
  const contacts = log.length;

  return (
    <>
      <ProgrammeHero data={data} headline={headline} body={heroBody} rows={heroRows} />

      <EligibilityCheck data={data} id="eligibility" />

      <PayVisual data={data} id="pays" />

      <WhoDoesWhat data={data} id="who-does-what" />

      {reach && (
        <WhyHana
          eyebrow="Reach"
          heading={<>Why the month <em>actually happens.</em></>}
        />
      )}

      <HowItWorksLoop id="how-it-works" />

      <MonthWrittenUp
        id="written-up"
        entries={log}
        badge={data.code}
        pill={data.name}
        chip={`${data.code} ${data.payment.code}`}
        /* Was "with the minutes attributed against the code", which reads as
           HANA's call time counting toward the billing threshold. It never does:
           CMS counts only clinical staff time (CCM FAQ p.1). The record is
           HANA's; the time on the claim is your staff's. */
        body="Every contact HANA makes is recorded and summarised straight into the patient's record. When your clinician opens the patient, the month is already there, and the time they log is their own: reviewing, acting on what HANA flagged, and attesting. Not typing."
        stats={[
          { value: "0:00", label: "Time your team spends writing the month up" },
          { value: String(contacts), label: "Documented contacts waiting when they open the chart" },
        ]}
      />

      {showEstimator && <RevenueEstimator programme={data.id} id="what-it-is-worth" />}

      {webCall && <SonicDemoSection {...webCall} />}

      <FaqSection
        items={faqs}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>start.</em></>}
      />

      {openQuestions.length > 0 && (
        <section id="open" className="scroll-mt-24 bg-band border-y border-rule py-16 md:py-20 px-6 md:px-16">
          <div className="max-w-[820px] mx-auto">
            <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">Not answered on this page yet</p>
            <h2 className="font-serif text-h2 text-ink m-0 mb-4">
              {openQuestions.length === 1 ? "One thing we will not guess at." : `${countWord(openQuestions.length)} things we will not guess at.`}
            </h2>
            <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-8 max-w-[62ch]">
              Billing rules. We confirm each one before this page publishes.
            </p>
            <ul className="m-0 p-0 list-none grid gap-3">
              {openQuestions.map((o) => (
                <li key={o.q} className="rounded-tile border border-rule bg-paper-bright p-5">
                  <p className="text-[16px] font-semibold text-ink m-0">{o.q}</p>
                  <p className="text-[14.5px] leading-[1.6] text-ink-soft m-0 mt-1.5">{o.needs}</p>
                </li>
              ))}
            </ul>
            <p className="text-[14px] leading-[1.6] text-ink-mute m-0 mt-6">Medicare rules as they stand in September 2026. Figures are CY2026.</p>
          </div>
        </section>
      )}

      <CtaBand
        heading={<>Hear it make the call. <em>Then decide.</em></>}
        body="Bring your panel numbers. We will go through which programmes your patients already qualify for, and what your team would still do."
        buttons={[
          { label: "Book a demo", href: DEMO_HREF },
          { label: "Talk to us", href: "/contact", variant: "ghost" },
        ]}
        reassurances={["Your patients, your claim", "Your team reviews and attests", "Nothing bills until a person approves"]}
      />

      <Footer />
    </>
  );
}

/* Small numbers read better as words in a heading. Above ten, the digit is
   clearer, and a programme page with eleven open questions has a bigger problem
   than its typography. */
function countWord(n: number): string {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  return words[n] ?? String(n);
}
