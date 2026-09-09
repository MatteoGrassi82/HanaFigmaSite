import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage, type WebCallProps } from "../components/templates/ProgrammePage";
import { programmeById } from "../../content/programmes/index";

/**
 * /programs/transitional-care-management
 *
 * THE ODD ONE OUT, IN TWO WAYS, AND BOTH ARE LOAD-BEARING.
 *
 * ███ 1. HANA CANNOT SATISFY THIS CLAIM ON ITS OWN. ███
 * TCM needs three things and HANA does exactly one of them:
 *   · interactive contact within 2 BUSINESS DAYS of discharge   <- HANA
 *   · medication reconciliation by the date of the visit        <- your team
 *   · a face-to-face visit inside 14 days (99495) or 7 (99496)  <- your team
 * There is no reading of this page on which HANA supplies the visit, and no
 * sentence may imply it. What makes the page worth having anyway is that the
 * two-business-day contact is the requirement that most often goes missing,
 * and when it goes missing the whole claim goes with it. A Friday discharge
 * with a Monday holiday is the classic way a practice loses a $220 claim it
 * had already earned the hard part of.
 *
 * ███ 2. IT IS NOT BILLED PER CALENDAR MONTH. ███
 * Every other programme on this site is one base code per enrolled patient per
 * month. TCM is once per qualifying DISCHARGE across a thirty-day service
 * period. That is why this page passes showEstimator={false}: RevenueEstimator
 * multiplies a monthly rate by an enrolled panel, and doing that with a
 * per-discharge amount prints a number wrong by however many of those patients
 * were never in hospital. The hero and the note both say "per discharge" in
 * those words so no reader does the multiplication themselves.
 *
 * NOINDEX until OPEN_QUESTIONS are answered. See ChronicCareManagement.tsx.
 */

const TCM = programmeById("tcm")!;

const COPY = {
  title: "Transitional care management, and the call that gets missed",
  description:
    "CPT 99495 needs interactive contact within two business days of discharge, medication reconciliation, and a face-to-face visit inside fourteen days. HANA makes the two-business-day contact, including evenings and weekends. The visit stays yours.",
};

const HERO_HEADLINE: ReactNode = (
  <>
    Two business days. <em>Discharges do not wait for Monday.</em>
  </>
);

const TCM_FAQS = [
  {
    q: "Who counts as eligible?",
    a: `${TCM.who} That includes a discharge after surgery: a post-operative patient going home is a qualifying discharge like any other, and the two-business-day contact is the one most often missed in exactly that week. The clock starts at discharge, not at the next appointment.`,
  },
  {
    q: "What does the claim have to show?",
    a: TCM.rule,
  },
  {
    q: "Does HANA do the face-to-face visit?",
    a: "No, and it cannot. TCM asks for three things: the interactive contact within two business days, medication reconciliation, and a face-to-face visit inside fourteen days for 99495 or seven for 99496. HANA does the first one. The visit and the reconciliation are yours, and so is every clinical decision in them.",
  },
  {
    q: "So why does HANA help here at all?",
    a: "Because the two-business-day contact is the requirement that most often goes missing, and losing it loses the whole claim. A Friday discharge has to be reached by Tuesday, and a public holiday makes it tighter. HANA calls in that window including evenings and weekends, tries again when nobody answers, and documents every attempt, which is what the requirement actually asks for.",
  },
  {
    q: "What does it pay?",
    a: `${TCM.payment.code} is ${TCM.payment.year} $${TCM.payment.rate.toFixed(2)} national non-facility, before geographic adjustment, PER QUALIFYING DISCHARGE rather than per patient per month. 99496 is $298.60 on the same basis, for high-complexity decision making with the visit inside seven days. Neither is what the practice collects: sequestration and the standard Part B patient coinsurance both come off.`,
  },
  {
    q: "Why is there no revenue estimator on this page?",
    a: "Because it would be wrong. Every other programme here is billed per enrolled patient per calendar month, and the estimator multiplies a monthly rate by a panel. TCM is per discharge. Multiplying $220.11 by an enrolled panel would count patients who were never in hospital, and a confident wrong number is worse than no number. What this is worth to you is a question about your discharge volume, and that is a fact about your panel rather than something a dial can guess.",
  },
  {
    q: "What counts as interactive contact?",
    a: "A two-way exchange with the patient or their caregiver, by phone or another interactive method, not a voicemail and not a one-way message. Documented attempts matter: the requirement contemplates that a patient may be hard to reach, and a recorded pattern of timely attempts is part of what supports the claim. Confirm the specifics with your MAC.",
  },
];

const OPEN_QUESTIONS: { q: string; needs: string }[] = [
  { q: "Does a documented unsuccessful attempt satisfy the two-day requirement?", needs: "This is the most important unanswered question on this page, because it decides whether HANA's attempt log supports the claim on its own or only supports the successful contacts. Confirm against CMS guidance and your MAC." },
  { q: "How do the two business days count?", needs: "Confirm the treatment of weekends, public holidays and same-day discharges, and whether the count starts on the discharge day or the next day." },
  { q: "Can TCM and CCM be billed in the same thirty days?", needs: "Confirm the concurrency rule and how the same time is kept from being counted against both. Advanced primary care management already excludes TCM in the same month; the rest is not settled here." },
  { q: "Who may bill TCM, and does the visit have to be the same practitioner?", needs: "Confirm practitioner types, and whether the face-to-face visit must be performed by the billing practitioner or may be someone else in the practice." },
  { q: "What counts as a qualifying discharge?", needs: "Confirm which settings qualify: inpatient, observation, SNF, and what happens on a readmission inside the thirty-day service period." },
  { q: "How is patient consent handled for the post-discharge call?", needs: "Confirm consent and TCPA handling for a call the patient has not scheduled, which is a different posture from the enrolled-programme calls." },
  { q: "What changes under the CY2027 proposed rule?", needs: "Wording for the proposed rule, from Matteo and counsel. Always described as proposed, never as settled." },
];

export function TransitionalCareManagement(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/transitional-care-management"
        useExactTitle
        robots="noindex, nofollow"
        keywords="transitional care management, TCM, CPT 99495, 99496, post-discharge follow-up, two business day contact"
        jsonLd={[
          breadcrumbSchema([
            { name: "Programs", url: "https://www.hana.health/programs" },
            { name: "Transitional care management", url: "https://www.hana.health/programs/transitional-care-management" },
          ]),
          faqSchema(TCM_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <ProgrammePage
        data={TCM}
        headline={HERO_HEADLINE}
        faqs={TCM_FAQS}
        openQuestions={OPEN_QUESTIONS}
        webCall={webCall}
        showEstimator={false}
      />
    </div>
  );
}

export default TransitionalCareManagement;
