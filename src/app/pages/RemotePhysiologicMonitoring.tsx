import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { ProgrammePage } from "../components/templates/ProgrammePage";
import { programmeById } from "../../content/programmes/index";

/**
 * /programs/remote-physiologic-monitoring
 *
 * ███  THE GUARDRAIL ON THIS PAGE IS THE WHOLE POINT: HANA IS NEVER THE DEVICE. ███
 *
 * This is the page the /programs hub used to refuse to link to, and the reason
 * it refused is still true: RPM begins with a piece of hardware recording a
 * physiologic reading, and HANA is not that hardware and never will be. The
 * page exists now because RPM, like RTM, is two separable halves and only one
 * of them is a conversation.
 *
 *   The device half     99453 setup, 99454 supply (16+ days of readings in 30),
 *                       99445 supply (2 to 15 days, new in CY2026).
 *                       Your hardware. Your claim. Nothing to do with HANA.
 *   The conversation    99457 first 20 minutes of treatment management,
 *                       99458 each further 20, 99470 first 10 (new in CY2026).
 *                       Every one of them requires at least one LIVE
 *                       INTERACTIVE COMMUNICATION with the patient in the
 *                       calendar month. That is the half HANA does.
 *
 * THE FIGURE IS 99457 ALONE, and it reads low against what a practice actually
 * collects on an RPM patient. That is deliberate and the page says so out loud
 * rather than adding the device codes to make the number look better. Putting
 * $51.77 + $52.10 on screen as "what HANA is worth" would be claiming credit
 * for a device we do not supply, which is the exact misrepresentation the
 * no-device rule exists to prevent.
 *
 * TWO CY2026 CODES ARE NAMED WITHOUT A FIGURE. 99470 and 99445 are both new in
 * CY2026 and neither has a sourced amount at this file's standard. Secondary
 * write-ups put them near $26 and $47. That is not good enough for this site,
 * so they are described and left unpriced, and it is an open question below.
 *
 * NOINDEX until OPEN_QUESTIONS are answered. See ChronicCareManagement.tsx.
 */

const RPM = programmeById("rpm")!;

const COPY = {
  title: "Remote physiologic monitoring, the call the month requires",
  description:
    "CPT 99457 needs at least one live interactive communication with the patient inside the calendar month. Your device sends the readings. HANA makes the call and writes it up, and never interprets a reading or changes therapy.",
};

const HERO_HEADLINE: ReactNode = (
  <>
    The readings arrive on their own. <em>The conversation does not.</em>
  </>
);

const RPM_FAQS = [
  {
    q: "Who counts as eligible?",
    a: `${RPM.who} The device is already in place and already transmitting; this is about the month around it.`,
  },
  {
    q: "What does the month have to show?",
    a: RPM.rule,
  },
  {
    q: "Is HANA the device?",
    a: "No, and it never will be. RPM has two halves. The setup and supply codes cover hardware recording and transmitting a physiologic reading, and that hardware is yours. HANA does the other half: the live interactive communication 99457 requires. It does not supply devices and it does not generate readings.",
  },
  {
    q: "Does HANA read the readings?",
    a: `${RPM.team}`,
  },
  {
    q: "What does it pay?",
    a: `${RPM.payment.code} is ${RPM.payment.year} $${RPM.payment.rate.toFixed(2)} national non-facility, before geographic adjustment, for one patient in one calendar month. That figure is the treatment-management code ALONE and it reads low on purpose: the setup and device-supply codes are billed separately by you, for your device, and are not added into it. It is also not what the practice collects, since sequestration and the standard Part B patient coinsurance both come off.`,
  },
  {
    q: "What counts as a live interactive communication?",
    a: "A real-time conversation with the patient or their caregiver, not a message and not a log entry. HANA calls, has the conversation your clinicians scoped, and writes it into the record with the time attributed. Your team reviews and attests, and nothing bills until a person on your team approves it.",
  },
  {
    q: "What changed for RPM in CY2026?",
    a: "CMS added two codes rather than replacing any. 99470 pays for a first ten minutes of treatment management, below the twenty-minute threshold 99457 sets, and still requires the live interactive communication. 99445 covers device supply for as few as two days of readings in a period, where 99454 requires sixteen in thirty. 99453, 99454, 99457 and 99458 all remain valid. We have not sourced amounts for the two new codes to the standard this site holds, so they are named here without a figure.",
  },
  {
    q: "How is this different from remote therapeutic monitoring?",
    a: "The data. RPM is a physiologic reading, such as blood pressure or weight. RTM is a therapeutic one, such as adherence to a therapy or response to it. The structure is the same in both, and so is HANA's part in it: the conversation, never the device.",
  },
];

const OPEN_QUESTIONS: { q: string; needs: string }[] = [
  { q: "What do 99470 and 99445 pay?", needs: "Both are new in CY2026 and neither has a sourced national non-facility amount in rates.ts. Source them from CMS primary files, or keep naming them on this page without a figure." },
  { q: "Does 99470 change what we should be selling?", needs: "A ten-minute treatment-management code with the same live-communication requirement may be a better fit for HANA's month than 99457. Decide whether the page should model 99470 instead, and price accordingly." },
  { q: "What counts as a live interactive communication?", needs: "Confirm the documentation CMS expects for 99457, and whether HANA's call record satisfies it on its own or needs a clinician note alongside." },
  { q: "Which devices and conditions are in scope?", needs: "Confirm which device categories the practice already has, since HANA never supplies one and the page must not imply a device-less version exists." },
  { q: "How is patient consent obtained and recorded?", needs: "Confirm how consent is captured, by whom, and whether it is once or annual." },
  { q: "Can it run alongside CCM or RTM in the same month?", needs: "Confirm the concurrency rules, particularly RPM against RTM for the same patient, and how the same minutes are kept from being counted twice." },
  { q: "What changes under the CY2027 proposed rule?", needs: "Wording for the proposed rule, from Matteo and counsel. Always described as proposed, never as settled. RPM sits beside RTM as the most exposed to it." },
];

export function RemotePhysiologicMonitoring() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/remote-physiologic-monitoring"
        useExactTitle
        robots="noindex, nofollow"
        keywords="remote physiologic monitoring, RPM, CPT 99457, 99454, 99470, remote patient monitoring billing"
        jsonLd={[
          breadcrumbSchema([
            { name: "Programs", url: "https://www.hana.health/programs" },
            { name: "Remote physiologic monitoring", url: "https://www.hana.health/programs/remote-physiologic-monitoring" },
          ]),
          faqSchema(RPM_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <ProgrammePage
        data={RPM}
        headline={HERO_HEADLINE}
        faqs={RPM_FAQS}
        openQuestions={OPEN_QUESTIONS}
      />
    </div>
  );
}

export default RemotePhysiologicMonitoring;
