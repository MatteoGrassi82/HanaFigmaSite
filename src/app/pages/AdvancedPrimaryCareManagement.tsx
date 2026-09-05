import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage } from "../components/templates/ProgrammePage";
import { programmeById } from "../../content/programmes/index";

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

      <ProgrammePage
        data={APCM}
        headline={HERO_HEADLINE}
        faqs={APCM_FAQS}
        openQuestions={OPEN_QUESTIONS}
        workflowsHeading="What an APCM month actually looks like"
        workflowsBody="The workflows HANA runs inside advanced primary care management. Each one ends in the record, which is what makes an element documented rather than asserted."
      />
    </div>
  );
}

export default AdvancedPrimaryCareManagement;
