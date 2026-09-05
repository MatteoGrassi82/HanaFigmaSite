import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { EligibilityCheck } from "../components/sections/EligibilityCheck";
import { CodeTable } from "../components/sections/CodeTable";
import { WhoDoesWhat } from "../components/sections/WhoDoesWhat";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { RecipesMarquee } from "../components/sections/RecipesMarquee";
import { RevenueEstimator } from "../components/sections/RevenueEstimator";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand } from "../components/sections/CtaBand";
import { programmeById } from "../../content/programmes/index";
import { PROGRAM_CARDS } from "../../content/programmes";

/**
 * /programs/advanced-primary-care-management — THE SECOND PROGRAMME PAGE.
 *
 * Built deliberately as a second hand-written page rather than a template call,
 * so the DIFF against ChronicCareManagement.tsx is the evidence for what a
 * ProgrammePage template should actually take. Read the two side by side before
 * extracting it.
 *
 * WHAT DIFFERS FROM CCM, and therefore what the template has to carry:
 *   - The programme object. Everything downstream reads from it.
 *   - COPY: title, description, hero headline. Human-written per page, never
 *     generated from the data, because these are the strings a person signs off.
 *   - The workflow filter tag.
 *   - The FAQ set. Some questions are shared in SHAPE but never in ANSWER, and
 *     APCM has one CCM does not have at all: the bundle has no time threshold,
 *     which is the single most confusing thing about it.
 *   - `note`. CCM has none; APCM carries the same-month exclusion, and it is
 *     load-bearing enough that the page surfaces it rather than leaving it to
 *     CodeTable's footnote.
 *   - OPEN_QUESTIONS: mostly shared, but APCM adds the levels question, because
 *     the page models one level and three exist.
 * Everything else is identical, which is the useful finding: the section ORDER,
 * the props, and the open-questions block are all template, not page.
 *
 * THE <SEO> BLOCK STAYS IN THIS FILE, AS A LITERAL, for the reason written at
 * length in ChronicCareManagement.tsx: route-seo.mjs regex-scrapes it and needs
 * `path` as a plain double-quoted string. A template-held SEO block silently
 * gives every programme page the generic default title. That constraint is the
 * main reason the template will be a BODY component with the page keeping its
 * own head.
 *
 * NOINDEX until the open questions are answered. See the CCM page docblock.
 */

const APCM = programmeById("apcm")!;

const COPY = {
  title: "Advanced primary care management, without the minute count",
  description:
    "APCM pays one bundled amount a month with no time threshold, against thirteen service elements that have to be available. HANA answers the elements that are pure reach. Your team owns the care plan and every clinical judgement.",
};

const HERO_HEADLINE: ReactNode = (
  <>
    A bundle that pays for <em>being available.</em>
  </>
);

const APCM_WORKFLOWS = PROGRAM_CARDS.filter((c) => c.tag === "APCM");

/* Every answer traces to src/content/programmes or rates.ts. Anything needing a
   fact we do not hold is in OPEN_QUESTIONS instead. */
const APCM_FAQS = [
  {
    q: "How is this different from chronic care management?",
    a: "CCM pays for twenty minutes of clinical staff time in a month. APCM has no time threshold at all: it is one bundled payment against thirteen service elements that have to be available to the patient. You are not counting minutes, you are demonstrating availability.",
  },
  {
    q: "Who counts as eligible?",
    a: `${APCM.who} This page models the middle level, ${APCM.payment.code}.`,
  },
  {
    q: "What does the month have to show?",
    a: APCM.rule,
  },
  {
    q: "What does my team still do?",
    a: `${APCM.team} HANA makes the calls and writes them up. Nothing bills until a person on your team approves it.`,
  },
  {
    q: "What does it pay?",
    a: `${APCM.payment.code} is ${APCM.payment.year} $${APCM.payment.rate.toFixed(2)} national non-facility, before geographic adjustment. That is the middle of three levels, for one patient in one calendar month. It is not what the practice collects: sequestration and the standard Part B patient coinsurance both come off, and the amount varies by locality.`,
  },
  {
    q: "Can we bill it alongside our other programmes?",
    a: APCM.note ?? "",
  },
];

const OPEN_QUESTIONS: { q: string; needs: string }[] = [
  { q: "Which of the three levels does each of our patients fall into?", needs: "This page models G0557, the middle level. G0556 and G0558 need their own sourced amounts before all three can be shown." },
  { q: "What documents an element as available?", needs: "Confirm what evidence CMS expects for each of the thirteen elements, and which of them HANA's record satisfies on its own." },
  { q: "How is patient consent obtained and recorded?", needs: "Confirm how consent is captured, by whom, and whether it is once or annual." },
  { q: "Does a patient need an initiating visit first?", needs: "Confirm which patients require one, and who may perform it. The APCM record promises an initiating-visit trail and the rule behind it is not written down." },
  { q: "Who in the practice may bill this?", needs: "Confirm practitioner types and the supervision level the clinical staff time sits under." },
  { q: "What changes under the CY2027 proposed rule?", needs: "Wording for the proposed rule, from Matteo and counsel. Always described as proposed, never as settled." },
];

export function AdvancedPrimaryCareManagement() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/advanced-primary-care-management"
        useExactTitle
        robots="noindex, nofollow"
        keywords="advanced primary care management, APCM, G0556, G0557, G0558, Medicare bundled payment, care management"
        jsonLd={[
          breadcrumbSchema([
            { name: "Programs", url: "https://www.hana.health/programs" },
            { name: "Advanced primary care management", url: "https://www.hana.health/programs/advanced-primary-care-management" },
          ]),
          faqSchema(APCM_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero
        eyebrow={`${APCM.code} · ${APCM.codes}`}
        headline={HERO_HEADLINE}
        body={APCM.rule}
        primaryCta={{ label: "Talk to HANA", href: "/demo" }}
        secondaryCta={{ label: "See what it pays", href: "#codes" }}
        trustLine="Your team reviews. Your provider signs."
      />

      <EligibilityCheck data={APCM} id="eligibility" />

      <CodeTable id="codes" tone="band" />

      {/* The same-month exclusion. CCM has no `note`; APCM's is load-bearing
          enough that it gets its own moment instead of a table footnote, because
          a practice already billing CCM needs to see it before anything else. */}
      {APCM.note && (
        <section id="not-with" className="scroll-mt-24 bg-paper py-14 md:py-16 px-6 md:px-16">
          <div className="max-w-[820px] mx-auto flex gap-4 rounded-tile border border-rule bg-paper-2 p-6">
            <span aria-hidden className="mt-1 h-8 w-1 shrink-0 rounded-pill bg-signal-amber" />
            <div>
              <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-2">
                Before you switch anyone over
              </p>
              <p className="text-[16.5px] leading-[1.65] text-ink m-0">{APCM.note}</p>
            </div>
          </div>
        </section>
      )}

      <WhoDoesWhat data={APCM} id="who-does-what" />

      <HowItWorksLoop id="how-it-works" />

      <RecipesMarquee
        soft
        tag="APCM"
        items={APCM_WORKFLOWS}
        heading="What an APCM month actually looks like"
        body="The workflows HANA runs inside advanced primary care management. Each one ends in the record, which is what makes an element documented rather than asserted."
      />

      <RevenueEstimator programme="apcm" id="what-it-is-worth" />

      <FaqSection
        items={APCM_FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>start.</em></>}
      />

      <section id="open" className="scroll-mt-24 bg-band border-y border-rule py-16 md:py-20 px-6 md:px-16">
        <div className="max-w-[820px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">
            Not answered on this page yet
          </p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-4">
            Six things we will not guess at.
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-8 max-w-[62ch]">
            These are billing rules, and a plausible-sounding answer is worse than
            no answer. Each one is confirmed before this page is published.
          </p>
          <ul className="m-0 p-0 list-none grid gap-3">
            {OPEN_QUESTIONS.map((o) => (
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
    </div>
  );
}

export default AdvancedPrimaryCareManagement;
