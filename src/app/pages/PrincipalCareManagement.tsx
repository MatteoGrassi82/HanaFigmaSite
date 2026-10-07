import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage, type WebCallProps } from "../components/templates/ProgrammePage";
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
 * ALL FOUR CODES ARE PRICED since 7 Oct 2026. 99424 used to be named without a
 * figure because two chains disagreed on its RVUs (2.62 against 2.63). CMS
 * Addendum B, RVU26A and RVU26D all carry 2.62, so it is $87.51. 99425 and
 * 99427 were sourced the same day. See alsoBillable in the content module.
 *
 * PUBLISHED 7 Oct 2026, its open questions answered from primary sources and
 * moved into the FAQ. See ChronicCareManagement.tsx.
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
    a: "99426 if clinical staff did the thirty minutes, 99424 if the physician or another qualified professional did. They are mutually exclusive in a month, so it is one or the other, never both. Note that this numbering is the reverse of CCM's, where 99490 is the clinical staff code and 99491 is the physician code.",
  },
  {
    q: "What does it pay?",
    a: `${PCM.payment.code} is ${PCM.payment.year} $${PCM.payment.rate.toFixed(2)} national non-facility, before geographic adjustment, for one patient in one calendar month. It is not what the practice collects: sequestration and the standard Part B patient coinsurance both come off, and the amount varies by locality. On the same basis the physician track, 99424, is $87.51, and each further thirty minutes is 99427 ($54.11) for staff time or 99425 ($61.46) for the practitioner's own.`,
  },
  {
    q: "Can it run alongside our other programmes?",
    a: PCM.note!,
  },
  {
    q: "What does HANA actually do here?",
    a: "It makes the monthly contact and keeps it on the one condition rather than drifting across the whole chart, asks what your clinicians scoped, in 30+ languages, and writes it up the same day for your clinician to review. Your clinicians own the care plan and every decision on it, and nothing bills until a person on your team approves the note.",
  },
  /* The CPT descriptor as CMS reprints it, 89 FR 97812. CMS declined to define
     "complex" further when asked (84 FR 62696). */
  {
    q: "What makes a condition complex enough?",
    a: "CMS uses the CPT definition rather than a list. One complex chronic condition expected to last at least three months, that puts the patient at significant risk of hospitalisation, acute exacerbation, functional decline or death, and that needs a disease-specific care plan developed, monitored or revised. It also needs frequent medication adjustments or management made unusually complex by other conditions. It is a clinical judgement your practitioner documents.",
  },
  /* 84 FR 62694 (CY2020 final rule): the CCM scope of service, consent included, applies to PCM. */
  {
    q: "How is patient consent obtained?",
    a: "The same way as for chronic care management: verbally or in writing, before the service starts, documented in the patient's record.",
  },
  /* 84 FR 62694; MLN909188 p.11. */
  {
    q: "Does a patient need a visit first?",
    a: "Yes. PCM starts at an initiating visit with the billing practitioner, and CMS's guidance asks for another one after a year to keep the service going.",
  },
  /* MLN909188 p.4; 42 CFR 410.26(b)(5); CY2026 designated care management list. */
  {
    q: "Who in the practice may bill it?",
    a: "Physicians, nurse practitioners, physician assistants, clinical nurse specialists and certified nurse midwives. On 99426 the thirty minutes are clinical staff time under general supervision; on 99424 they are the practitioner's own. Only clinical staff time counts, so HANA's call time never does.",
  },
  /* 91 FR 43893 and 43938-39 (CMS-1848-P, published 16 July 2026). */
  {
    q: "What does the proposed 2027 rule change?",
    a: "As proposed in July 2026, nothing for PCM. The proposal that would require staff employed by the practice covers remote monitoring only. CMS asked for comments on supervision across care management, so this is one to re-check when the final rule lands, expected around November 2026.",
  },
];

export function PrincipalCareManagement(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/principal-care-management"
        useExactTitle
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
        webCall={webCall}
      />
    </div>
  );
}

export default PrincipalCareManagement;
