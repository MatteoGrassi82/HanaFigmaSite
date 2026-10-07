import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage, type WebCallProps } from "../components/templates/ProgrammePage";
import { programmeById } from "../../content/programmes/index";

/**
 * /programs/chronic-care-management — THE REFERENCE PROGRAMME PAGE.
 *
 * Six more programme pages get built from this one, so its shape is the decision,
 * not its copy. Read this before adding APCM, BHI, RTM, RPM or ACCESS.
 *
 * THE ORDER IS THE ARGUMENT, and it answers the five questions a practice manager
 * actually asks, in the order they ask them:
 *   1. Is this me?            EligibilityCheck
 *   2. What does it pay?      CodeTable
 *   3. What do I have to do?  WhoDoesWhat      <- the one that closes the deal
 *   4. How does it run?       HowItWorksLoop + the programme's own workflows
 *   5. What is the catch?     the open questions, stated rather than hidden
 * A page that reorders these is answering questions nobody asked yet.
 *
 * WHY THIS IS A PAGE FILE AND NOT A TEMPLATE CALL, YET. There is one programme
 * page. Extracting a ProgrammePage template from a single instance would be
 * guessing at what varies. Build APCM next, diff the two, and extract the
 * template from what actually differs. Until then this file IS the spec.
 *
 * THE <SEO> BLOCK MUST STAY IN THIS FILE, AS A LITERAL.
 * scripts/lib/route-seo.mjs regex-scrapes it out of the page source and needs
 * `path` to be a plain double-quoted string starting with "/". Move it into a
 * shared template and the parser finds one unresolvable path, skips the route,
 * and every programme page prerenders with the generic default title and
 * description. There is no build error when that happens. You find out from
 * Search Console. title/description may read from a const in THIS file, which is
 * what COPY below is for.
 *
 * PUBLISHED 7 Oct 2026. Until then the page rendered its open billing questions
 * as a visible block, on the rule that a guessed billing answer is worse than an
 * admitted gap. They were answered that day from primary sources and moved into
 * the FAQ below, each with its source beside it. Keep that rule for any new
 * answer: a primary CMS document, the Federal Register or eCFR, never a vendor.
 */

const CCM = programmeById("ccm")!;

/* Copy lives here, in the page, so the <SEO> block can read it and the prerender
   parser can still resolve it. Do not move this into the content module. */
const COPY = {
  title: "Chronic care management, run by your own staff",
  description:
    "CPT 99490 pays for the month of work that happens between visits. HANA makes the calls and writes them up. Your team reviews and attests, and nothing bills until a person on your team approves it.",
};

const HERO_HEADLINE: ReactNode = (
  <>
    Bill the month of work that <em>happens between visits.</em>
  </>
);


/* The first five trace to src/content/programmes/index.ts or rates.ts. The rest
   are the questions that used to sit in an "open" block, answered 7 Oct 2026;
   the source for each is in the comment above it. */
const CCM_FAQS = [
  {
    q: "Who counts as eligible?",
    a: `${CCM.who} Against a care plan they have agreed to.`,
  },
  {
    q: "What does the month have to show?",
    a: CCM.rule,
  },
  {
    q: "What does my team still do?",
    a: `${CCM.team} HANA makes the calls and writes them up.`,
  },
  {
    q: "What does it pay?",
    a: `${CCM.payment.code} is $${CCM.payment.rate.toFixed(2)}, ${CCM.payment.year} national, before adjustment. Sequestration and the patient coinsurance both come off, so it is not what you collect.`,
  },
  {
    q: "Is this HANA billing on our behalf?",
    a: "No. Your patients, your claim. HANA supplies the reach and the documentation. Your team supplies the judgement.",
  },
  /* MLN909188 (June 2025) p.6; CMS CCM FAQ (8/16/2022) p.5. */
  {
    q: "How is patient consent obtained?",
    a: "Verbally or in writing, once, before CCM starts, and documented in the patient's record. The patient has to be told that the service is available, that cost sharing applies, that only one practitioner can bill CCM in a month, and that they can stop at any time. A new consent is only needed if they move to a different billing practitioner.",
  },
  /* CMS CCM FAQ p.5. */
  {
    q: "Does a patient need a visit first?",
    a: "Only new patients, or patients the billing practitioner has not seen in the past year. For them, CCM starts at a face-to-face visit where it is discussed: a level 2 to 5 office visit, an annual wellness visit, an initial preventive physical exam, or the visit inside transitional care management. The billing practitioner does that visit, and it is billed on its own.",
  },
  /* MLN909188 p.4; 42 CFR 410.26(b)(5); CMS CCM FAQ p.1. */
  {
    q: "Who in the practice may bill it?",
    a: "Physicians, nurse practitioners, physician assistants, clinical nurse specialists and certified nurse midwives. The clinical staff time on 99490 runs under general supervision, so the practitioner does not have to be in the room. CMS counts only time spent by clinical staff toward the twenty minutes, which is why HANA's call time never counts. The time your staff spend reviewing and acting on what HANA hands them does.",
  },
  /* CMS CCM FAQ p.7; BHI FAQ (12/5/2023) Q2; 89 FR 97896. */
  {
    q: "Can it run alongside our other programmes?",
    a: "Behavioral health integration, yes, in the same month, with consent for both. Principal care management, not by the same practitioner: a specialist can bill PCM for a different condition while your practice bills CCM. Advanced primary care management, not by the practitioner billing APCM that month. In every case a minute counts toward one code only.",
  },
  /* 91 FR 43893 and 43938-39 (CMS-1848-P, published 16 July 2026). */
  {
    q: "What does the proposed 2027 rule change?",
    a: "As proposed in July 2026, nothing for CCM. The proposal that would require staff employed by the practice covers remote physiologic and therapeutic monitoring only. CMS also asked for comments on supervision across care management, so the final rule, expected around November 2026, could still move. This page will say so when it does.",
  },
  /* MLN Connects 2025-06-05; 89 FR 98009-12. */
  {
    q: "Can FQHCs and rural health clinics bill it?",
    a: "Yes. G0511 stopped being billable on 30 September 2025, and FQHCs and RHCs now bill the same CCM codes as everyone else, paid at the national non-facility rate on top of the visit payment.",
  },
];

export function ChronicCareManagement(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/chronic-care-management"
        useExactTitle
        keywords="chronic care management, CPT 99490, CCM billing, Medicare chronic care management, care coordination"
        jsonLd={[
          breadcrumbSchema([
            { name: "Programs", url: "https://www.hana.health/programs" },
            { name: "Chronic care management", url: "https://www.hana.health/programs/chronic-care-management" },
          ]),
          faqSchema(CCM_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <ProgrammePage
        data={CCM}
        headline={HERO_HEADLINE}
        faqs={CCM_FAQS}
        webCall={webCall}
      />
    </div>
  );
}

export default ChronicCareManagement;
