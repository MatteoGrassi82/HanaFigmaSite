import type { ReactNode } from "react";
import { Hero } from "../sections/Hero";
import { EligibilityCheck } from "../sections/EligibilityCheck";
import { CodeTable } from "../sections/CodeTable";
import { WhoDoesWhat } from "../sections/WhoDoesWhat";
import { HowItWorksLoop } from "../sections/HowItWorksLoop";
import { RevenueEstimator } from "../sections/RevenueEstimator";
import { FaqSection } from "../sections/FaqSection";
import { CtaBand } from "../sections/CtaBand";
import { Footer } from "../layout/Footer";
import type { Programme } from "../../../content/programmes/index";

/**
 * ProgrammePage — the body of a /programs/* page.
 *
 * EXTRACTED FROM TWO REAL PAGES, NOT DESIGNED UP FRONT. CCM and APCM were each
 * written by hand first; this is what turned out to be identical between them.
 * If a third programme needs something this does not take, add the prop rather
 * than forking the template.
 *
 * IT IS A BODY, NOT A PAGE. The <SEO> block stays in the page file and must be a
 * LITERAL there. scripts/lib/route-seo.mjs regex-scrapes it and requires `path`
 * to be a plain double-quoted string starting with "/". Put the SEO block in here
 * and the parser finds one unresolvable path, skips the route, and EVERY
 * programme page prerenders with the generic default title and description, with
 * no build error. You would find out from Search Console. That single constraint
 * is why this component renders from <Hero> down and never owns the head.
 *
 * THE ORDER IS THE ARGUMENT, and it is the reason this is a template at all. It
 * answers the five questions a practice manager asks, in the order they ask them:
 *   1. Is this me?            EligibilityCheck
 *   2. What does it pay?      CodeTable
 *   3. What do I have to do?  WhoDoesWhat        <- the one that closes it
 *   4. How does it run?       HowItWorksLoop + the programme's own workflows
 *   5. What is it worth?      RevenueEstimator, locked to this programme
 *   6. What is the catch?     openQuestions, stated rather than hidden
 * A page that reorders these is answering questions nobody has asked yet. If a
 * programme genuinely needs a different order, that is a signal it is not a
 * programme page, not a signal to add an `order` prop.
 *
 * NO WORKFLOW MARQUEE. It ran at 609 words against HowItWorksLoop's 231 and
 * answered the same question, "how does the month run". Two sections answering
 * one question is what makes a page feel long. The marquee stays on the homepage
 * where breadth is the point; a programme page wants one answer, not two.
 *
 * NO PROOF SECTION. ProofBento carries generic HANA proof and quotes that are not
 * about any particular programme, so on a programme page it reads as borrowed
 * credibility. It comes back per-programme when there is a case study for that
 * programme to put in it.
 */

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


  /** Defaults to `data.rule`, which is what both hand-built pages used. */
  heroBody?: string;
}

export function ProgrammePage({
  data,
  headline,
  faqs,
  openQuestions = [],
  heroBody,
}: ProgrammePageProps) {
  return (
    <>
      <Hero
        eyebrow={`${data.code} · ${data.codes}`}
        headline={headline}
        body={heroBody ?? data.summary}
        primaryCta={{ label: "Talk to HANA", href: "/demo" }}
        secondaryCta={{ label: "See what it pays", href: "#codes" }}
        trustLine="Your team reviews. Your provider signs."
      />

      <EligibilityCheck data={data} id="eligibility" />

      {/* ONE programme, not all four. The hub compares; a programme page does
          not. This was 734 words showing three programmes the reader did not
          ask about. `compact` also collapses the caveats behind a disclosure
          rather than printing all five expanded. */}
      <CodeTable
        id="codes"
        tone="band"
        rows={[data]}
        compact
        heading={<>What <em>{data.code}</em> pays.</>}
        body="One base code, one patient, one month, before adjustment. Not what you collect."
      />

      {/* A programme that cannot run beside another gets its own moment here,
          not a footnote inside the table. A practice already billing something
          else has to see it before it reads anything further. CCM has no note;
          APCM's same-month exclusion is exactly this case. */}
      {data.note && (
        <section id="not-with" className="scroll-mt-24 bg-paper py-14 md:py-16 px-6 md:px-16">
          <div className="max-w-[820px] mx-auto flex gap-4 rounded-tile border border-rule bg-paper-2 p-6">
            <span aria-hidden className="mt-1 h-8 w-1 shrink-0 rounded-pill bg-signal-amber" />
            <div>
              <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-2">
                Before you switch anyone over
              </p>
              <p className="text-[16.5px] leading-[1.65] text-ink m-0">{data.note}</p>
            </div>
          </div>
        </section>
      )}

      <WhoDoesWhat data={data} id="who-does-what" />

      <HowItWorksLoop id="how-it-works" />


      <RevenueEstimator programme={data.id} id="what-it-is-worth" />

      <FaqSection
        items={faqs}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>start.</em></>}
      />

      {openQuestions.length > 0 && (
        <section id="open" className="scroll-mt-24 bg-band border-y border-rule py-16 md:py-20 px-6 md:px-16">
          <div className="max-w-[820px] mx-auto">
            <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">
              Not answered on this page yet
            </p>
            <h2 className="font-serif text-h2 text-ink m-0 mb-4">
              {openQuestions.length === 1
                ? "One thing we will not guess at."
                : `${countWord(openQuestions.length)} things we will not guess at.`}
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
            <p className="text-[14px] leading-[1.6] text-ink-mute m-0 mt-6">
              Medicare rules as they stand in August 2026. Figures are CY2026.
            </p>
          </div>
        </section>
      )}

      <CtaBand
        heading={<>Hear it make the call. <em>Then decide.</em></>}
        body="Drop your number and HANA calls you. The agent works out the right demo as you talk."
        buttons={[
          { label: "Talk to HANA", href: "/demo" },
          { label: "Book a demo", href: "/contact", variant: "ghost" },
        ]}
        reassurances={[
          "Your patients, your claim",
          "Your team reviews and attests",
          "Nothing bills until a person approves",
        ]}
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
