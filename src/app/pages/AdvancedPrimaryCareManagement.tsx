import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage, type WebCallProps } from "../components/templates/ProgrammePage";
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
 * PUBLISHED 7 Oct 2026, its open questions answered from primary sources and
 * moved into the FAQ. See the CCM page docblock.
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


/* The data-driven answers trace to src/content/programmes or rates.ts. The rest
   were the page's open questions, answered 7 Oct 2026, source above each. The
   level amounts are CY2026 RVUs x $33.4009 (RVU26A / RVU26D). */
const APCM_FAQS = [
  {
    q: "How is this different from chronic care management?",
    a: "CCM pays for twenty minutes of clinical staff time in a month. APCM has no time threshold at all: it is one bundled payment against thirteen service elements that have to be available to the patient. You are not counting minutes, you are demonstrating availability.",
  },
  /* MLN909188 p.11; 89 FR 97871-75. */
  {
    q: "Who counts as eligible, and at which level?",
    a: `The level is set by how many chronic conditions the patient has, not by time. G0556 is for none or one ($16.37), G0557 for two or more ($${APCM.payment.rate.toFixed(2)}), and G0558 for two or more when the patient is a Qualified Medicare Beneficiary ($117.24). Those are ${APCM.payment.year} national non-facility amounts, before adjustment. This page models the middle level.`,
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
  /* 89 FR 97896-97; 90 FR 49470-71. */
  {
    q: "Can we bill it alongside our other programmes?",
    a: "The practitioner billing APCM cannot also bill CCM, PCM or TCM for that patient in the same month, though a different practitioner can. Behavioral health integration and collaborative care can run alongside it, and since 2026 they have add-on codes for that (G0568 to G0570), billed without counting minutes. Practices billing APCM report the Value in Primary Care MVP from 2026.",
  },
  /* 89 FR 97868-69 and 97889. */
  {
    q: "What has to be documented?",
    a: "Not every element every month. CMS expects the practice to be able to deliver all of them in any month, to record in the chart whatever it actually does for the patient, and treats billing APCM as attesting that those capabilities are in place. HANA's record covers the contacts it makes. The practice-level capabilities, like round-the-clock access and the electronic care plan, are yours.",
  },
  /* 89 FR 97880-81; CMS APCM page. */
  {
    q: "How is patient consent obtained?",
    a: "Verbally or in writing, once, at the start, and documented in the record. The patient is told that the service is available, that only one practitioner can bill it in a month, that they can stop at any time, and that cost sharing may apply. A patient moving over from chronic care management needs a new consent, and so does one who changes practitioner.",
  },
  /* 89 FR 97881-82; CMS APCM FAQ Q2. */
  {
    q: "Does a patient need a visit first?",
    a: "Only a new patient, meaning someone who has had no professional service from the practitioner or anyone in their group in the past three years. For them, APCM starts at a level 2 to 5 office visit, an annual wellness visit, an initial preventive physical exam or a TCM visit where APCM is discussed, by the practitioner who will bill it.",
  },
  /* 89 FR 97866-68; CMS APCM page. */
  {
    q: "Who in the practice may bill it?",
    a: "A physician, nurse practitioner, physician assistant, clinical nurse specialist or certified nurse midwife who is responsible for the patient's primary care, and only one of them per patient per month. Staff work under general supervision, and there are no minutes to count: CMS says APCM is not time based.",
  },
  /* 91 FR 43897-98 and 43938-42 (CMS-1848-P, published 16 July 2026). */
  {
    q: "What does the proposed 2027 rule change?",
    a: "As proposed in July 2026, nothing in APCM's codes or requirements. CMS did say first-year uptake was lower than it expected and asked for comments on how the payment is structured, so this is one to re-check when the final rule lands, expected around November 2026.",
  },
  /* CMS APCM FAQ Q8; 89 FR 98010-12. */
  {
    q: "Can FQHCs and rural health clinics bill it?",
    a: "Yes. FQHCs and RHCs bill G0556 to G0558 at the national non-facility rate, on top of their visit payment and with or without a visit that day.",
  },
];

export function AdvancedPrimaryCareManagement(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/advanced-primary-care-management"
        useExactTitle
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
        webCall={webCall}
      />
    </div>
  );
}

export default AdvancedPrimaryCareManagement;
