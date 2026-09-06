import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage } from "../components/templates/ProgrammePage";
import { programmeById } from "../../content/programmes/index";

/**
 * /programs/principal-care-management
 *
 * THE ARGUMENT: this is the programme for the patient chronic care management
 * turns away. CCM needs two or more chronic conditions. A practice reading the
 * CCM page and finding half its sickest patients ineligible has not run out of
 * programmes, it has run out of that one. PCM is the single-condition
 * programme, and its eligibility gate is severity rather than count.
 *
 * ███ THE CODE NUMBERING IS THE REVERSE OF CCM'S, AND THIS IS THE MOST COMMON
 * PCM BILLING ERROR THERE IS. ███
 *   CCM   99490 clinical staff · 99491 physician
 *   PCM   99426 clinical staff · 99424 physician        <- flipped
 * The figure on this page is 99426, the CLINICAL STAFF track, because that is
 * the track HANA's model sits in and the direct parallel to CCM's 99490. Get
 * this backwards and the page puts the wrong number on screen and encourages
 * the wrong code on a claim. 99424 and 99426 are mutually exclusive in a month.
 *
 * THREE CODES ARE NAMED WITHOUT A FIGURE. 99427 has no sourced CY2026 amount.
 * 99424 and 99425 are worse than unsourced: two independent chains disagree on
 * 99424's total non-facility RVUs, 2.62 against 2.63, which is $87.51 against
 * $87.84 and is two different source values rather than a rounding difference.
 * Naming a code without pricing it costs nothing. Printing the wrong one of two
 * candidate figures costs the reader their arithmetic.
 *
 * NOINDEX until OPEN_QUESTIONS are answered. See ChronicCareManagement.tsx.
 */

const PCM = programmeById("pcm")!;

const COPY = {
  title: "Principal care management, for the patient CCM turns away",
  description:
    "CPT 99426 pays for thirty minutes of clinical staff time a month directed at ONE complex chronic condition. Chronic care management needs two. HANA makes the monthly contact and writes it up, and your team reviews and signs.",
};

const HERO_HEADLINE: ReactNode = (
  <>
    One condition is enough. <em>It just has to be serious.</em>
  </>
);

const PCM_FAQS = [
  {
    q: "Who counts as eligible?",
    a: `${PCM.who} The count is what separates this from chronic care management: CCM asks for two or more conditions, PCM asks for one that is serious enough to need its own care plan.`,
  },
  {
    q: "What does the month have to show?",
    a: PCM.rule,
  },
  {
    q: "How is this different from chronic care management?",
    a: "The gate and the focus. CCM needs two or more chronic conditions and the care plan covers the whole patient. PCM needs one complex condition and the thirty minutes stay on that condition. A practice that has read the CCM page and found its sickest single-condition patients ineligible is looking at the wrong programme, not the wrong patient.",
  },
  {
    q: "Which code do we actually bill?",
    a: "99426 if clinical staff did the thirty minutes, 99424 if the physician or another qualified professional did. They are mutually exclusive in a month, so it is one or the other, never both. Note that this numbering is the reverse of CCM's, where 99490 is the clinical staff code and 99491 is the physician code. It is the single most common PCM billing mistake.",
  },
  {
    q: "What does it pay?",
    a: `${PCM.payment.code} is ${PCM.payment.year} $${PCM.payment.rate.toFixed(2)} national non-facility, before geographic adjustment, for one patient in one calendar month. It is not what the practice collects: sequestration and the standard Part B patient coinsurance both come off, and the amount varies by locality. The physician track is named on this page without a figure, because two sources disagree on it and we will not pick one for you.`,
  },
  {
    q: "Can it run alongside our other programmes?",
    a: PCM.note!,
  },
  {
    q: "What does HANA actually do here?",
    a: "It makes the monthly contact and keeps it on the one condition rather than drifting across the whole chart, asks what your clinicians scoped, in 30+ languages, and writes it up the same day with the time attributed. Your clinicians own the care plan and every decision on it, and nothing bills until a person on your team approves the note.",
  },
];

const OPEN_QUESTIONS: { q: string; needs: string }[] = [
  { q: "What are 99424, 99425 and 99427 worth?", needs: "99427 has no sourced CY2026 amount. 99424 has two conflicting ones (2.62 RVUs giving $87.51, against 2.63 giving $87.84). Resolve 99424 against CMS Addendum B and source the other two, or keep naming all three without a figure." },
  { q: "Can PCM and CCM run for the same patient in the same month?", needs: "Confirm the rule, including whether it changes when a different practitioner or a different practice bills each one. The page currently states only the APCM exclusion, which is the one we hold." },
  { q: "What makes a condition 'complex' enough?", needs: "Confirm the standard CMS applies, and whether it is a documented clinical judgement or a defined list. This is the eligibility gate for the whole programme and the page should not paraphrase it." },
  { q: "How is patient consent obtained and recorded?", needs: "Confirm how consent is captured, by whom, and whether it is once or annual." },
  { q: "Who in the practice may bill this?", needs: "Confirm practitioner types, and the supervision level the clinical staff time on 99426 sits under." },
  { q: "Is an initiating visit required?", needs: "Confirm whether PCM needs one, and for which patients." },
  { q: "What changes under the CY2027 proposed rule?", needs: "Wording for the proposed rule, from Matteo and counsel. Always described as proposed, never as settled." },
];

export function PrincipalCareManagement() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/principal-care-management"
        useExactTitle
        robots="noindex, nofollow"
        keywords="principal care management, PCM, CPT 99426, 99424, single chronic condition, Medicare care management"
        jsonLd={[
          breadcrumbSchema([
            { name: "Programs", url: "https://www.hana.health/programs" },
            { name: "Principal care management", url: "https://www.hana.health/programs/principal-care-management" },
          ]),
          faqSchema(PCM_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <ProgrammePage
        data={PCM}
        headline={HERO_HEADLINE}
        faqs={PCM_FAQS}
        openQuestions={OPEN_QUESTIONS}
      />
    </div>
  );
}

export default PrincipalCareManagement;
