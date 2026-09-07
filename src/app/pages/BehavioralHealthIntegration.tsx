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
 * manager and a psychiatric consultant, and there is no sourced rate for it in
 * rates.ts on purpose. The page says so plainly rather than implying the 99484
 * amount covers both.
 *
 * NOINDEX until OPEN_QUESTIONS are answered. See ChronicCareManagement.tsx.
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
  {
    q: "What happens if a patient says something concerning?",
    a: `${BHI.team} Escalation is live, on the call, against the rules your clinicians set.`,
  },
  {
    q: "What does it pay?",
    a: `${BHI.payment.code} is ${BHI.payment.year} $${BHI.payment.rate.toFixed(2)} national non-facility, before geographic adjustment, for one patient in one calendar month. It is not what the practice collects: sequestration and the standard Part B patient coinsurance both come off, and the amount varies by locality. There is no figure on this page for collaborative care.`,
  },
  {
    q: "Is HANA doing therapy?",
    a: "No. HANA makes contact, asks what your clinicians asked it to ask, and writes it up. Diagnosis, medication and treatment stay with your clinicians, and nothing bills until a person on your team approves it.",
  },
];

const OPEN_QUESTIONS: { q: string; needs: string }[] = [
  { q: "What are the escalation rules, precisely?", needs: "Confirm the thresholds that route a call to a person live, who receives it, and what happens outside clinic hours. This is the most important unanswered question on this page." },
  { q: "Are we addressing collaborative care at all?", needs: "Decide whether CoCM gets its own page. If it does it needs sourced rates for 99492, 99493 and 99494, plus the care-manager and psychiatric-consultant requirements written out." },
  { q: "How is patient consent obtained and recorded?", needs: "Confirm how consent is captured, by whom, and whether it is once or annual." },
  { q: "Who in the practice may bill this?", needs: "Confirm practitioner types and the supervision level the clinical staff time sits under." },
  { q: "Can it run alongside CCM in the same month?", needs: "Confirm the concurrency rule, and how the same minutes are kept from being counted against both." },
  { q: "What changes under the CY2027 proposed rule?", needs: "Wording for the proposed rule, from Matteo and counsel. Always described as proposed, never as settled." },
];

export function BehavioralHealthIntegration(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/behavioral-health-integration"
        useExactTitle
        robots="noindex, nofollow"
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
        openQuestions={OPEN_QUESTIONS}
        webCall={webCall}
      />
    </div>
  );
}

export default BehavioralHealthIntegration;
