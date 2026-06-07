import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Phone, Mic, MicOff } from "lucide-react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/Footer";

/* Case-studies FAQ — answer-first, citation-friendly for AI answer engines. */
const CASE_STUDIES_FAQ = faqSchema([
  {
    question: "What results have healthcare organizations seen with Hana?",
    answer:
      "Across deployments in behavioral health, chronic care, post-discharge, surgical, and digital-health settings, Hana drives roughly 85% weekly patient engagement (versus 15–20% for portals and apps) and has processed more than 2 million patient interactions. It reduces 30-day readmissions through automated post-discharge follow-up and supports CMS-billable chronic care management.",
  },
  {
    question: "What types of practices use Hana?",
    answer:
      "Hana is used by primary care and specialty practices running chronic care management, hospital systems reducing readmissions, behavioral health organizations running ADHD, depression, and substance-use intake, and digital health companies embedding voice AI into their own products via API.",
  },
]);

interface CaseStudiesProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

interface Agent {
  name: string;
  desc: string;
  assistantId: string;
}

interface CaseStudy {
  id: string;
  tag: string;
  color: string; // bg color for accent
  title: string;
  sub: string;
  stats: [string, string][];
  chips: string[];
  situation: string;
  what: string;
  result: string;
  inNumbers: string;
  agents: Agent[];
}

const CASES: CaseStudy[] = [
  {
    id: "behavioral-health-intake",
    tag: "Behavioral Health",
    color: "#10B981",
    title: "The intake that does itself.",
    sub: "85% faster to diagnosis. 96% of patients preferred it to the old way.",
    stats: [
      ["85%", "faster time to diagnosis"],
      ["96%", "patient acceptance rate"],
      ["31×", "ROI on staff time"],
    ],
    chips: ["PHQ-9 Screening", "High-Risk Assessment", "Referral Follow-Up", "Social Needs", "New Patient Welcome"],
    situation: "A high-volume behavioral health practice was losing patients before clinicians ever saw them. A proper evaluation meant coordinating with the patient, a caregiver, a teacher, sometimes a grandparent — each through a different channel, on a different schedule. Forms sat half-complete in the portal. Staff spent the first 20 minutes of every appointment chasing information that should have arrived before the patient walked in. Diagnostic time averaged six weeks from referral to completed assessment. For patients in crisis, that wait was clinically dangerous.",
    what: "Hana took over the entire pre-diagnostic coordination layer. Before each appointment, it reads what's already in the chart — demographics, referral notes, any prior assessments — and identifies exactly what's missing. It then runs adaptive outreach to every collateral source: a voice call to the caregiver for detailed developmental history, SMS to the patient for quick confirmations, a separate voice call to the school contact for behavioural observations. Each conversation adapts based on what it learns. If a caregiver mentions a sibling was also diagnosed, Hana notes it. If a patient discloses safety concerns unprompted, it escalates immediately. The output lands in the clinician's queue as a structured intake report — ready to read, not ready to chase.",
    result: "Diagnostic time dropped 85% — from six weeks to under a week for most cases. Staff stopped coordinating and started reading finished reports. 96% of patients and families accepted the AI-led process without complaint. The 4% who opted out were handled by a human coordinator, same as before. Clinicians reported that the quality of information arriving before appointments was materially better — more specific, more honest, and more complete than paper forms had ever produced.",
    inNumbers: "The cost per completed intake dropped from over $150 to under $15. For a practice running 200 evaluations a month, that's a $27,000 monthly saving in coordination labour alone — before accounting for the revenue recovered from slots that used to sit empty waiting on missing paperwork.",
    agents: [
      { name: "PHQ-9 Depression Screening", desc: "Conversational mental health screening that tracks scores and flags elevated responses.", assistantId: "29456291-d3c5-4edf-9a1c-1808a9f9966e" },
      { name: "High-Risk Assessment", desc: "Proactive safety screening with calm clinical escalation for at-risk patients.", assistantId: "9942b37b-5c59-48d9-96f1-1b4fbe1b106a" },
      { name: "New Patient Welcome", desc: "Warm onboarding call confirming appointments and collecting missing intake info.", assistantId: "b7f0553b-11ba-4d58-a900-7d63ed2c4d52" },
      { name: "Referral Follow-Up", desc: "Checks booking status and removes barriers stopping patients from attending.", assistantId: "e1b48b50-a17b-45e3-9420-72e2b9a82bf1" },
      { name: "Social Needs & Safety", desc: "Assessment of social determinants and safety concerns for comprehensive care.", assistantId: "e0c9f0d9-5c76-4a3a-a07c-38508863d9fb" },
    ],
  },
  {
    id: "chronic-care-management",
    tag: "Chronic Care",
    color: "#3B82F6",
    title: "From 30% to 73%.",
    sub: "They had the data. They didn't have the why. Hana found it.",
    stats: [
      ["2.4×", "adherence improvement"],
      ["85%", "weekly engagement"],
      ["12 min", "saved per patient / month"],
    ],
    chips: ["Medication Adherence", "Care Plan Review", "Blood Pressure Monitoring", "Goal Coaching", "Reactivation"],
    situation: "A chronic care programme managing over 800 patients had the data — adherence was sitting at 30% across the board. What they didn't have was the why. Were patients forgetting? Couldn't afford refills? Managing side effects they hadn't disclosed? Dealing with something at home that made taking medication feel irrelevant? More reminder texts weren't moving the number. The team was calling patients manually, but a full-time coordinator could realistically touch 15 patients a day. The other 785 were on their own between quarterly appointments.",
    what: "Hana took over the weekly check-in layer. Not automated reminders — actual conversations. Before each call, it reads the patient's care plan, medication list, and last interaction notes. The call itself follows motivational interviewing principles: open-ended, curious, non-judgmental. \"How has the week been going with the lisinopril?\" not \"Did you take your medication?\" When a patient mentions cost concerns, Hana explores it and flags the case for a pharmacy review. When they report dizziness, it documents the exact onset, frequency, and severity and flags for clinical review within the hour. Every barrier gets categorised, timestamped, and written back to the EHR as a structured note — ready for the clinician at the next appointment, or sooner if escalation is needed.",
    result: "Adherence moved from 30% to 73% over 90 days. Weekly engagement held at 85% — patients answered the call and stayed in the conversation. Side effects that had previously gone undetected until quarterly appointments were now being flagged within 48 hours. The care team shifted from reactive management to proactive intervention. Three patients who had been silently non-adherent for months were identified as having cost barriers — transferred to generic alternatives, and back on track within two weeks.",
    inNumbers: "The programme enrolled 800 patients. Hana ran weekly check-ins across all of them — the equivalent of 3,200 coordinator calls per month. At $18 per manual outreach call, that's $57,600 in coordination capacity added for a fraction of the cost. More importantly: the adherence gain across 800 patients compounds into measurably better clinical outcomes and significantly reduced emergency utilisation.",
    agents: [
      { name: "Medication Adherence Call", desc: "Conversational check-in exploring why patients miss doses, not just whether they do.", assistantId: "ca20d9d6-7be2-4b6c-8f23-847a48c43b70" },
      { name: "Medication Refill Reminder", desc: "Proactive outreach before refills run out, catching cost and access barriers early.", assistantId: "7e7c066f-9c4b-473c-ad89-11f4146dcfcf" },
      { name: "Blood Pressure Monitoring", desc: "Regular BP check-ins with symptom tracking and escalation for out-of-range readings.", assistantId: "e886ab67-ea0f-4e58-9137-a5a237681e74" },
      { name: "Sleep & Fatigue Check-In", desc: "Monitors sleep patterns and energy levels to flag fatigue-related care concerns.", assistantId: "a4611af8-932b-42a3-9025-6a03e5d3783e" },
      { name: "Goal Coaching Call", desc: "Motivational check-in that celebrates progress and identifies obstacles to health goals.", assistantId: "16206946-a057-41c9-bc37-ce1e9546704d" },
      { name: "Dormant Patient Reactivation", desc: "Re-engages patients who have fallen out of care programmes.", assistantId: "cad51e8f-2299-487e-b73f-aa99b7aaa1f4" },
    ],
  },
  {
    id: "knee-replacement",
    tag: "Surgical",
    color: "#F59E0B",
    title: "The OR slot that stops getting cancelled.",
    sub: "97% surgical readiness. Staff stopped chasing prep. Surgeons stopped waiting.",
    stats: [
      ["97%", "surgical readiness rate"],
      ["74%", "less manual follow-up"],
      ["4.1×", "faster response cycles"],
    ],
    chips: ["Pre-Appointment Prep", "Post-Op Safety", "Pain Monitoring", "Medication Adherence", "Care Plan Review"],
    situation: "A high-volume orthopaedic centre was haemorrhaging OR time. Slots were being cancelled or delayed not because of surgical complications, but because of coordination failures upstream: patients who didn't fast correctly, missing medical clearance letters from GPs, pre-op checklists that were never completed, consent forms returned the morning of surgery. Each cancellation cost the centre between $8,000 and $15,000 in lost revenue and rescheduling overhead. Nursing staff were spending upwards of 60% of their time on pre-op chase work — phone calls that went unanswered, voicemails that didn't get returned, forms that had to be chased across three departments.",
    what: "Hana took over the entire pre-op and post-op coordination pipeline. For every scheduled knee replacement, it reads the chart, identifies every outstanding item — clearance, fasting protocol confirmation, transport arrangement, medication hold acknowledgement, prep shower instructions — and begins systematic outreach across voice and SMS. It doesn't send a generic reminder. It has a specific conversation: \"We have your surgery confirmed for Thursday. I need to go through a few things with you to make sure everything is ready.\" Each item gets confirmed, documented, and flagged if outstanding. If a patient is unreachable, staff are alerted with a specific action item rather than a vague \"call patient\" note. Post-surgery, the same system runs structured recovery check-ins at 48 hours, day 7, and day 14 — covering pain scores, wound appearance, exercise compliance, medication adherence, and red-flag symptoms. Any response outside the expected range triggers an immediate escalation.",
    result: "Surgical readiness — defined as every pre-op requirement confirmed before the 72-hour mark — reached 97%. Manual follow-up workload dropped 74%. Surgeons received complete pre-op dossiers the day before every case instead of scrambling the morning of. The post-op pathway caught two wound complications and one medication interaction in the first month of operation, both of which would likely have presented as emergency department visits under the previous system. Staff reported the most tangible shift was psychological: instead of starting every morning with a stack of unanswered chase work, they started with exceptions only.",
    inNumbers: "At an average cancellation cost of $10,000 and a pre-Hana cancellation rate of roughly 8%, a centre doing 150 knee replacements a month was losing ~$120,000 monthly to coordination failures. At 97% readiness, that exposure drops to under $15,000. The system paid for itself in avoided cancellations within the first week of operation.",
    agents: [
      { name: "Pre-Appointment Prep", desc: "Confirms pre-op checklist completion — fasting, medication holds, transport, prep shower.", assistantId: "b7f0553b-11ba-4d58-a900-7d63ed2c4d52" },
      { name: "Post-Op 48-Hour Safety", desc: "Critical post-surgery safety check covering pain, wound appearance, and red-flag symptoms.", assistantId: "cbab4560-bf00-4f31-a265-aee253296e3c" },
      { name: "Pain Monitoring Call", desc: "Tracks pain scores, medication timing, and trajectory to catch uncontrolled pain early.", assistantId: "b20b8495-8283-409e-978a-473195f1113d" },
      { name: "Medication Adherence Call", desc: "Ensures post-op medications are taken correctly and on schedule.", assistantId: "ca20d9d6-7be2-4b6c-8f23-847a48c43b70" },
      { name: "Care Plan Review", desc: "Regular review of recovery goals and progress tracking to keep patients on track.", assistantId: "c2a302b7-cc6a-4c8a-85ba-1ddc40d0d602" },
    ],
  },
  {
    id: "mental-health-app",
    tag: "Digital Health",
    color: "#8B5CF6",
    title: "The app they stopped opening.",
    sub: "15% engagement. One voice layer later: 85%. Same app, same brand.",
    stats: [
      ["15→85%", "weekly engagement"],
      ["White-label", "zero rebuilds"],
      ["Usage", "based pricing"],
    ],
    chips: ["Goal Coaching", "PHQ-9 Screening", "Sleep Check-In", "Medication Adherence", "Care Plan Review"],
    situation: "The app had done everything right. Two years of product development. A clean, thoughtful interface. Evidence-based content. A clinical advisory board. A proper onboarding flow. Users downloaded it, completed onboarding, and then — nothing. Engagement by week three was sitting at 10 to 15%. Push notifications were being ignored at the same rate as every other wellness app. The clinical team had access to mood logs and symptom journals, but only from the small fraction of users who opened the app consistently. The rest were invisible. The company was raising a Series B on the promise of continuous patient monitoring. Continuous monitoring wasn't happening.",
    what: "Rather than rebuild the app or layer on more push notifications, the team integrated Hana as a white-label engagement layer operating entirely outside the app. Patients receive a call or WhatsApp message from a number branded under the app's name. The voice and tone were calibrated to match the app's clinical style — warm, non-clinical in language, but structured in data collection. Weekly PHQ-9 check-ins happen conversationally, not through forms. Sleep quality, medication adherence, and goal progress are captured through natural conversation and written back to the partner's platform as structured data. The app never appears in the interaction — but everything flows back into it. When a patient shows a worsening PHQ-9 trajectory over three consecutive weeks, the system flags it for clinical review automatically. The app's clinical team sees the data. The patient experiences a relationship, not a product.",
    result: "Weekly engagement moved from 15% to 85% within six weeks of deployment. The clinical team went from receiving data from a fraction of users sporadically to receiving continuous structured data from the vast majority, weekly. Three patients who had been completely inactive in the app for over a month were re-engaged through the voice layer — two of them had experienced significant life events that had caused them to disengage, and the proactive outreach surfaced those situations in time for intervention. The partner's Series B narrative shifted: instead of projecting engagement improvements, they could demonstrate them.",
    inNumbers: "The integration took three weeks — no rebuild, no new infrastructure. Token-based pricing meant the partner paid proportionally to usage, with no fixed overhead during scaling. The data density improvement — from sporadic app opens to weekly structured clinical conversations — gave the clinical team a qualitatively different view of their patient population. They described it as the difference between a photo and a film.",
    agents: [
      { name: "PHQ-9 Depression Screening", desc: "Conversational mental health screening delivered in the app's tone and voice.", assistantId: "29456291-d3c5-4edf-9a1c-1808a9f9966e" },
      { name: "Sleep & Fatigue Check-In", desc: "Weekly sleep quality check-in that surfaces patterns needing clinical attention.", assistantId: "a4611af8-932b-42a3-9025-6a03e5d3783e" },
      { name: "Goal Coaching Call", desc: "Motivational check-in that keeps patients working toward their health goals.", assistantId: "16206946-a057-41c9-bc37-ce1e9546704d" },
      { name: "Medication Adherence Call", desc: "Gentle adherence check-in that explores barriers rather than just confirming compliance.", assistantId: "ca20d9d6-7be2-4b6c-8f23-847a48c43b70" },
      { name: "Care Plan Review", desc: "Structured review of care plan goals to maintain engagement between app sessions.", assistantId: "c2a302b7-cc6a-4c8a-85ba-1ddc40d0d602" },
    ],
  },
  {
    id: "sms-platform-voice-layer",
    tag: "Platform",
    color: "#F97316",
    title: "When SMS isn't enough.",
    sub: "10M+ conversations. Four languages. Zero rebuilds for the platform.",
    stats: [
      ["10M+", "conversations extended"],
      ["4", "languages supported"],
      ["API", "native, no rebuild"],
    ],
    chips: ["Pre-Appointment Prep", "No-Show Rescue", "Referral Follow-Up", "Insurance Verification", "Lab Reminders"],
    situation: "The platform had reach. Over 10 million patient conversations processed, hundreds of clinic clients, a strong reputation in outreach and appointment reminders. SMS was the core product — and SMS worked well for what SMS is good at: simple, one-directional nudges. But clinic clients were increasingly asking for more. Multi-step appointment coordination — where a patient needs to confirm a time, answer pre-screening questions, and provide insurance details before a referral can be accepted — was falling apart over text. Patients dropped out of multi-message threads. Context was lost between messages. Coordinators were manually picking up where the SMS sequence broke down. And the platform had clients in communities where English-only outreach was missing a third of the patient population entirely.",
    what: "The platform integrated Hana's voice layer via API — a three-week technical integration with no changes to their existing SMS infrastructure. Hana now handles the conversations their SMS flows hand off to: when a patient needs to answer more than two questions, or when the interaction requires adaptive follow-up based on what they say, the workflow routes to a Hana voice call. The call happens in the patient's preferred language — English, Spanish, French, or Mandarin — selected automatically based on EHR language preference data. The conversation is structured around the clinic's specific intake or coordination protocol, not a generic script. Responses flow back to the platform as structured data, indistinguishable from a human-completed intake form. The platform's clinic clients see the output — not the mechanism.",
    result: "The platform expanded its product offering without a single new hire or internal clinical AI build. Multilingual capability opened conversations with health systems and federally qualified health centres that had previously been out of reach due to language gaps. Clinic clients running complex referral workflows reported completion rates improving from under 40% on SMS alone to over 80% with the voice handoff. The platform's NPS from clinic clients increased materially — coordinators described the change as \"SMS for the simple stuff, voice for the real conversations.\"",
    inNumbers: "Building voice AI, clinical safety infrastructure, multilingual support, and EHR write-back from scratch would have cost the platform 18 to 24 months and a significant engineering investment. The API integration cost three weeks. Token-based pricing means the platform passes through costs proportional to usage, preserving their margin structure. Every new clinic client they onboard now has access to voice capability on day one.",
    agents: [
      { name: "Pre-Appointment Prep", desc: "Confirms appointment details and preparation steps across multiple departments.", assistantId: "b7f0553b-11ba-4d58-a900-7d63ed2c4d52" },
      { name: "No-Show Rescue Call", desc: "Warm outreach to patients who miss appointments — understands why and reschedules.", assistantId: "50ac1f91-547e-4bc9-8398-8d091adcedae" },
      { name: "Referral Follow-Up", desc: "Ensures patients follow through on specialist referrals and removes barriers.", assistantId: "e1b48b50-a17b-45e3-9420-72e2b9a82bf1" },
      { name: "Insurance Verification", desc: "Proactive outreach to confirm coverage and flag issues before appointments.", assistantId: "04947ff4-f66d-42e0-808d-d272d32016b1" },
      { name: "Lab Work Reminder", desc: "Timely reminders for pending lab work with escalation for overdue results.", assistantId: "63288099-0dc0-42b7-9f0f-ce8a2b97dbf0" },
    ],
  },
];

export function CaseStudies({ activeAgentId, webCallStatus, handleStartWebCall, handleEndWebCall }: CaseStudiesProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [selectedIdx]);

  const selected = selectedIdx !== null ? CASES[selectedIdx] : null;

  return (
    <>
      <SEO
        title="Case Studies"
        description="Real Hana deployments across behavioral health, chronic care, surgical, digital health, and platform integrations."
        path="/case-studies"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", url: "https://www.hana.health/" },
            { name: "Case Studies", url: "https://www.hana.health/case-studies" },
          ]),
          CASE_STUDIES_FAQ,
        ]}
      />
      <div className="min-h-screen bg-white">
        {selected ? (
          <DetailView
            c={selected}
            idx={selectedIdx!}
            total={CASES.length}
            onBack={() => setSelectedIdx(null)}
            onNext={() => setSelectedIdx((selectedIdx! + 1) % CASES.length)}
            onPrev={() => setSelectedIdx((selectedIdx! - 1 + CASES.length) % CASES.length)}
            activeAgentId={activeAgentId}
            webCallStatus={webCallStatus}
            onStartCall={handleStartWebCall}
            onEndCall={handleEndWebCall}
          />
        ) : (
          <IndexView onOpen={setSelectedIdx} />
        )}
      </div>
      <Footer />
    </>
  );
}

function IndexView({ onOpen }: { onOpen: (idx: number) => void }) {
  return (
    <>
      {/* Dark hero */}
      <section className="bg-[#00122F] text-white pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold tracking-[3px] uppercase mb-6">Case Studies</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6">
            What happens when<br />
            <span className="text-blue-400">the routine gets handled</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
            Five deployments. Real numbers. And the live agents you can call to hear it yourself.
          </p>
        </div>
      </section>

      {/* Cards grid */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => onOpen(i)}
              className="group bg-white text-left p-8 hover:bg-slate-50 transition-colors flex flex-col gap-6"
            >

              {/* Tag */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-bold tracking-[2px] uppercase"
                  style={{ color: c.color }}
                >
                  {c.tag}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Title */}
              <div>
                <h2 className="font-serif text-3xl text-slate-900 leading-tight mb-2">{c.title}</h2>
                <p className="text-sm text-slate-500">{c.sub}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                {c.stats.map(([n, l]) => (
                  <div key={l}>
                    <div className="text-xl font-semibold text-slate-900 leading-none mb-1">{n}</div>
                    <div className="text-[10px] text-slate-400 leading-tight uppercase tracking-wide">{l}</div>
                  </div>
                ))}
              </div>
            </button>
          ))}

          {/* "Your case study" CTA card */}
          <a
            href="https://calendly.com/matteowastaken/discoverycall"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#00122F] text-left p-8 flex flex-col gap-6 hover:bg-[#001a3d] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-blue-400">Your organisation</span>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-white leading-tight mb-2">Your clinic, next.</h2>
              <p className="text-sm text-slate-400">Every deployment is different. Book a call — we'll show you what this looks like for how your team actually works.</p>
            </div>
            <div className="mt-auto pt-4 border-t border-white/10">
              <span className="text-sm font-semibold text-white group-hover:underline">Book a demo →</span>
            </div>
          </a>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-[#00122F] rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-3xl text-white mb-2">Every workflow is different.<br />That's the point.</h3>
            <p className="text-slate-400 text-sm">Book a demo. We'll show you a workflow built for how you work.</p>
          </div>
          <a
            href="https://calendly.com/matteowastaken/discoverycall"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white text-[#00122F] font-semibold px-8 py-4 rounded-full text-sm hover:bg-slate-100 transition-colors"
          >
            Book a demo →
          </a>
        </div>
      </section>
    </>
  );
}

function DetailView({
  c, idx, total, onBack, onNext, onPrev,
  activeAgentId, webCallStatus, onStartCall, onEndCall,
}: {
  c: CaseStudy; idx: number; total: number;
  onBack: () => void; onNext: () => void; onPrev: () => void;
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  onStartCall: (agentId: string, assistantId: string) => void;
  onEndCall: () => void;
}) {
  return (
    <div>
      {/* Dark header */}
      <div className="bg-[#00122F] text-white pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All case studies
          </button>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-bold tracking-[2.5px] uppercase" style={{ color: c.color }}>{c.tag}</span>
            <span className="text-slate-700 text-xs">{idx + 1} / {total}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.05] mb-5 max-w-3xl">{c.title}</h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-10">{c.sub}</p>

          {/* Workflow chips */}
          <div className="flex flex-wrap gap-2 mb-14">
            {c.chips.map(chip => (
              <span
                key={chip}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full border"
                style={{ color: c.color, borderColor: `${c.color}35`, backgroundColor: `${c.color}10` }}
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 divide-x divide-white/[0.07] border border-white/[0.07] rounded-2xl overflow-hidden">
            {c.stats.map(([n, l]) => (
              <div key={l} className="px-6 py-6 bg-white/[0.03]">
                <div className="text-[2rem] font-semibold text-white mb-1.5 leading-none">{n}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white">

        {/* Situation */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 pt-16 pb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ backgroundColor: c.color }} />
            <span className="text-[10px] font-bold tracking-[3px] uppercase" style={{ color: c.color }}>The situation</span>
          </div>
          <p className="text-[17px] md:text-[18px] leading-[1.9] text-slate-600">{c.situation}</p>
        </div>

        {/* Pull quote */}
        <div className="border-y border-slate-100 py-14 px-6 md:px-12" style={{ backgroundColor: `${c.color}07` }}>
          <div className="max-w-4xl mx-auto flex gap-6 items-start">
            <div className="w-[3px] self-stretch rounded-full shrink-0" style={{ backgroundColor: c.color }} />
            <p className="font-serif text-2xl md:text-[2rem] text-slate-900 leading-[1.4] italic">
              "{c.sub}"
            </p>
          </div>
        </div>

        {/* What Hana did */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ backgroundColor: c.color }} />
            <span className="text-[10px] font-bold tracking-[3px] uppercase" style={{ color: c.color }}>What Hana did</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-12 items-start">
            <p className="text-[17px] md:text-[18px] leading-[1.9] text-slate-600">{c.what}</p>
            <div className="flex flex-row md:flex-col gap-8 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8" style={{ borderColor: `${c.color}25` }}>
              {c.stats.map(([n, l]) => (
                <div key={l}>
                  <div className="font-serif text-[2rem] leading-none mb-1.5" style={{ color: c.color }}>{n}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest leading-snug">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The result */}
        <div className="border-t border-slate-100 py-16 px-6 md:px-12" style={{ backgroundColor: `${c.color}05` }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px" style={{ backgroundColor: c.color }} />
              <span className="text-[10px] font-bold tracking-[3px] uppercase" style={{ color: c.color }}>The result</span>
            </div>
            <p className="text-[17px] md:text-[18px] leading-[1.9] text-slate-600">{c.result}</p>
          </div>
        </div>

        {/* In numbers — dark */}
        <div className="bg-[#00122F] px-6 md:px-12 py-20">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-bold tracking-[3px] uppercase text-slate-500 mb-10">In numbers</p>
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 items-center">
              <div className="shrink-0">
                <div className="font-serif text-[88px] md:text-[108px] leading-none tracking-tight" style={{ color: c.color }}>
                  {c.stats[0][0]}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-[3px] mt-3">{c.stats[0][1]}</div>
              </div>
              <div className="md:border-l md:border-white/8 md:pl-12">
                <p className="text-[16px] leading-[1.9] text-slate-300">{c.inNumbers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agents */}
        <div className="bg-[#010f26] px-6 md:px-12 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 pb-10 border-b border-white/[0.07]">
              <p className="text-[10px] font-bold tracking-[3px] uppercase mb-5" style={{ color: c.color }}>Try the live agents</p>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight max-w-lg">
                  These are the actual agents from this deployment.
                </h2>
                <p className="text-slate-500 text-sm shrink-0">
                  No app. No login. Just click to call.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.agents.map((a) => {
                const agentId = `${c.id}-${a.assistantId}`;
                const isActive = activeAgentId === agentId;
                const status = isActive ? webCallStatus : "idle";
                return (
                  <AgentCard
                    key={a.name}
                    a={a}
                    color={c.color}
                    status={status}
                    isOtherActive={activeAgentId !== null && !isActive}
                    onStart={() => onStartCall(agentId, a.assistantId)}
                    onEnd={onEndCall}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 flex items-center justify-between">
            <button onClick={onPrev} className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button onClick={onBack} className="text-[13px] text-slate-400 hover:text-slate-900 transition-colors">All case studies</button>
            <button onClick={onNext} className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-slate-900 transition-colors">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ a, color, status, isOtherActive, onStart, onEnd }: {
  a: Agent; color: string;
  status: "idle" | "connecting" | "active";
  isOtherActive: boolean;
  onStart: () => void; onEnd: () => void;
}) {
  const isActive = status === "active";
  const isConnecting = status === "connecting";

  return (
    <div className="rounded-2xl p-6 flex flex-col gap-5 transition-all border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.12]">
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Mic className="w-4 h-4" style={{ color }} />
        </div>
        {isActive && (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color, backgroundColor: `${color}20` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            Live
          </span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-[14px] font-semibold text-white mb-1.5 leading-tight">{a.name}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
      </div>

      {isActive ? (
        <button
          onClick={onEnd}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors"
        >
          <MicOff className="w-3.5 h-3.5" /> End call
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={isOtherActive || isConnecting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
          style={
            isOtherActive || isConnecting
              ? { color: '#475569', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'transparent' }
              : { color: color, border: `1px solid ${color}50`, backgroundColor: `${color}12` }
          }
        >
          <Mic className="w-3.5 h-3.5" />
          {isConnecting ? "Connecting..." : "Start Web Call"}
        </button>
      )}
    </div>
  );
}

export default CaseStudies;
