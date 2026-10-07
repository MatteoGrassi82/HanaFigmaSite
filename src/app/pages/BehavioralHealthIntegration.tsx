import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage, type WebCallProps } from "../components/templates/ProgrammePage";
import { programmeById } from "../../content/programmes/index";

/**
 * /programs/behavioral-health-integration
 *
 * Third programme page, and the first built straight onto ProgrammePage. The
 * page owns its head, its copy and its facts; the template owns the order.
 *
 * THE THING THIS PAGE MUST NOT DO: put a figure on collaborative care. BHI and
 * CoCM are two different builds. General BHI (99484) is twenty minutes of
 * clinical staff time. CoCM (99492 to 99494) needs a behavioral health care
 * manager and a psychiatric consultant, and it has no rate in rates.ts. CoCM
 * amounts are sourced now (MLN909432 and RVU26D: 99492 $160.32, 99493 $144.96,
 * 99494 $61.46), but the page still prints none: it is a different build, and a
 * figure beside 99484's would read as an upsell the page does not argue.
 *
 * PUBLISHED 7 Oct 2026, its open questions answered from primary sources and
 * moved into the FAQ. See ChronicCareManagement.tsx.
 */

const BHI = programmeById("bhi")!;

const COPY = {
  title: "Behavioral health integration, without adding a care manager",
  description:
    "CPT 99484 pays for twenty minutes a month on a behavioral health condition being managed inside primary care. HANA makes the contact between visits. Anything that sounds like risk reaches a person live, not a queue.",
};

const HERO_HEADLINE: ReactNode = (
  <>
    The contact between visits, <em>for the patients hardest to reach.</em>
  </>
);

const BHI_FAQS = [
  {
    q: "Who counts as eligible?",
    a: `${BHI.who} The condition is being treated by the primary care team, not referred away.`,
  },
  {
    q: "What does the month have to show?",
    a: BHI.rule,
  },
  {
    q: "Is this collaborative care?",
    a: "No, and the difference matters. General BHI is 99484: twenty minutes of clinical staff time in a calendar month. Collaborative care is 99492 to 99494 and is a bigger build, needing a behavioral health care manager and a psychiatric consultant. The figure on this page is 99484 only.",
  },
  /* The escalation wording matches the homepage safety section: the protocols
     and thresholds are the practice's, and a crisis goes to emergency services. */
  {
    q: "What happens if a patient says something concerning?",
    a: `${BHI.team} Escalation is live, on the call, to the person your protocol names, against thresholds your clinicians set, and a crisis goes to emergency services.`,
  },
  {
    q: "What does it pay?",
    a: `${BHI.payment.code} is ${BHI.payment.year} $${BHI.payment.rate.toFixed(2)} national non-facility, before geographic adjustment, for one patient in one calendar month. It is not what the practice collects: sequestration and the standard Part B patient coinsurance both come off, and the amount varies by locality. There is no figure on this page for collaborative care.`,
  },
  {
    q: "Is HANA doing therapy?",
    a: "No. HANA makes contact, asks what your clinicians asked it to ask, and writes it up. Diagnosis, medication and treatment stay with your clinicians, and nothing bills until a person on your team approves it.",
  },
  /* MLN909432 (Jan 2026) p.4; CMS BHI FAQ (12/5/2023) Q16-17. */
  {
    q: "How is patient consent obtained?",
    a: "Verbally or in writing, once, and documented in the record. The patient agrees to the practice consulting specialists, including a psychiatric consultant, and is told that cost sharing applies. A new consent is only needed if they change billing practitioner.",
  },
  /* CMS BHI FAQ Q15 and Q18. */
  {
    q: "Does a patient need a visit first?",
    a: "New patients, and anyone not seen in the past year, start at a face-to-face visit where BHI is discussed: a level 2 to 5 office visit, an annual wellness visit or an initial preventive physical exam.",
  },
  /* MLN909432 pp.3-4 and 11-12; 42 CFR 410.26(b)(5). */
  {
    q: "Who in the practice may bill it?",
    a: "Physicians of any specialty, nurse practitioners, physician assistants, clinical nurse specialists and certified nurse midwives. Staff time runs under general supervision. General BHI needs neither a psychiatric consultant nor a dedicated care manager; collaborative care needs both. Only clinical staff time counts toward the twenty minutes, so HANA's call time never does.",
  },
  /* CMS BHI FAQ Q2-3; 89 FR 97897; 90 FR 49470. */
  {
    q: "Can it run alongside chronic care management?",
    a: "Yes, in the same month, if the patient has consented to both, each meets its own rules, and no minute counts toward both. A practice billing advanced primary care management bills general BHI as the add-on G0570 instead, without counting minutes. In a given month, a practitioner bills either general BHI or collaborative care, not both.",
  },
  /* 91 FR 43893 and 43897 (CMS-1848-P, published 16 July 2026). */
  {
    q: "What does the proposed 2027 rule change?",
    a: "As proposed in July 2026, nothing in BHI's requirements. The proposal that would require staff employed by the practice covers remote monitoring only, and the rule proposes higher values for collaborative care. The final rule is expected around November 2026.",
  },
];

export function BehavioralHealthIntegration(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/behavioral-health-integration"
        useExactTitle
        keywords="behavioral health integration, BHI, CPT 99484, collaborative care, primary care behavioral health"
        jsonLd={[
          breadcrumbSchema([
            { name: "Programs", url: "https://www.hana.health/programs" },
            { name: "Behavioral health integration", url: "https://www.hana.health/programs/behavioral-health-integration" },
          ]),
          faqSchema(BHI_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <ProgrammePage
        data={BHI}
        headline={HERO_HEADLINE}
        faqs={BHI_FAQS}
        webCall={webCall}
      />
    </div>
  );
}

export default BehavioralHealthIntegration;
