import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage } from "../components/templates/ProgrammePage";
import { programmeById } from "../../content/programmes/index";

/**
 * /programs/remote-therapeutic-monitoring
 *
 * THE GUARDRAIL ON THIS PAGE IS THE WHOLE POINT: HANA IS NEVER THE DEVICE.
 * RTM pays for two different things. The supply codes (98975 to 98978) are about
 * a device recording sixteen days of data in thirty. The treatment-management
 * codes (98980, 98981) are about a real interactive conversation with the patient
 * inside the month. HANA does the second and never the first, and this page must
 * never imply otherwise. There is no device-less RTM claim anywhere on it.
 *
 * The figure shown is 98980 alone, which reads low against what a practice
 * actually bills, and the page says why rather than quietly inflating it.
 *
 * NOINDEX until OPEN_QUESTIONS are answered. See ChronicCareManagement.tsx.
 */

const RTM = programmeById("rtm")!;

const COPY = {
  title: "Remote therapeutic monitoring, the conversation the month requires",
  description:
    "CPT 98980 needs a real interactive conversation with the patient inside the calendar month. Your device records the data. HANA has the conversation and writes it up, and never interprets a reading or changes therapy.",
};

const HERO_HEADLINE: ReactNode = (
  <>
    Your device has the data. <em>Somebody still has to call.</em>
  </>
);

const RTM_FAQS = [
  {
    q: "Who counts as eligible?",
    a: `${RTM.who} The device is already in place; this is about the month around it.`,
  },
  {
    q: "What does the month have to show?",
    a: RTM.rule,
  },
  {
    q: "Is HANA the device?",
    a: "No, and it never will be. RTM has two halves. The supply codes cover a device recording sixteen days of data in thirty, and that device is yours. HANA does the other half: the interactive conversation 98980 requires. It does not supply hardware and it does not generate the data.",
  },
  {
    q: "Does HANA read the readings?",
    a: `${RTM.team}`,
  },
  {
    q: "What does it pay?",
    a: `${RTM.payment.code} is ${RTM.payment.year} $${RTM.payment.rate.toFixed(2)} national non-facility, before geographic adjustment, for one patient in one calendar month. That figure is the treatment-management code ALONE and it reads low on purpose: the device-supply codes 98975 to 98978 are billed separately and are not included here. It is also not what the practice collects, since sequestration and the standard Part B patient coinsurance both come off.`,
  },
  {
    q: "What makes a conversation count?",
    a: "98980 asks for an interactive conversation with the patient, not a message and not a log entry. HANA calls, has the conversation your clinicians scoped, and writes it into the record with the time attributed. Your team reviews and attests, and nothing bills until a person on your team approves it.",
  },
];

const OPEN_QUESTIONS: { q: string; needs: string }[] = [
  { q: "What do the device-supply codes pay?", needs: "98975 to 98978 have no sourced amount in rates.ts, so the figure on this page is 98980 alone and reads low. Source them, or keep saying so beside the number." },
  { q: "What counts as an interactive conversation?", needs: "Confirm the documentation CMS expects for 98980, and whether HANA's call record satisfies it on its own or needs a clinician note alongside." },
  { q: "Which devices and therapies are in scope?", needs: "Confirm which device categories the practice already has, since HANA never supplies one and the page must not imply a device-less version exists." },
  { q: "How is patient consent obtained and recorded?", needs: "Confirm how consent is captured, by whom, and whether it is once or annual." },
  { q: "Can it run alongside CCM in the same month?", needs: "Confirm the concurrency rule, and how the same minutes are kept from being counted against both." },
  { q: "What changes under the CY2027 proposed rule?", needs: "Wording for the proposed rule, from Matteo and counsel. Always described as proposed, never as settled. RTM is the programme most exposed to it." },
];

export function RemoteTherapeuticMonitoring() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/remote-therapeutic-monitoring"
        useExactTitle
        robots="noindex, nofollow"
        keywords="remote therapeutic monitoring, RTM, CPT 98980, 98975, therapy adherence, remote monitoring"
        jsonLd={[
          breadcrumbSchema([
            { name: "Programs", url: "https://www.hana.health/programs" },
            { name: "Remote therapeutic monitoring", url: "https://www.hana.health/programs/remote-therapeutic-monitoring" },
          ]),
          faqSchema(RTM_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <ProgrammePage
        data={RTM}
        headline={HERO_HEADLINE}
        faqs={RTM_FAQS}
        openQuestions={OPEN_QUESTIONS}
      />
    </div>
  );
}

export default RemoteTherapeuticMonitoring;
