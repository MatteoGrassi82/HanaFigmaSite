import { useState } from "react";
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
    title: "Behavioral Health Intake",
    sub: "How a practice cut diagnostic time by 85%",
    stats: [
      ["85%", "faster time to diagnosis"],
      ["96%", "patient acceptance rate"],
      ["31×", "ROI on staff time"],
    ],
    chips: ["PHQ-9 Screening", "High-Risk Assessment", "Referral Follow-Up", "Social Needs", "New Patient Welcome"],
    situation: "A high-volume behavioral health practice was losing patients before clinicians ever saw them. Every evaluation required coordinating across multiple people — the patient, a caregiver, a teacher, sometimes a grandparent. Forms sat incomplete. Staff chased paperwork across systems.",
    what: "Hana replaced the pre-diagnostic coordination workflow. The system reads what's already in the chart, identifies what's missing, and runs adaptive outreach to every collateral source through the right channel — voice for detailed history, SMS for quick confirmations.",
    result: "Diagnostic time dropped 85%. Staff went from chasing paperwork to reading finished reports. 96% of patients accepted the AI-led process. Only 4% opted out entirely.",
    inNumbers: "Cost per completed intake drops from $150+ to under $15. If your team spends 4+ hours coordinating each evaluation, Hana brings that under 40 minutes.",
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
    title: "Chronic Care Management",
    sub: "From 30% medication adherence to 73%",
    stats: [
      ["2.4×", "adherence improvement"],
      ["85%", "weekly engagement"],
      ["12 min", "saved per patient / month"],
    ],
    chips: ["Medication Adherence", "Care Plan Review", "Blood Pressure Monitoring", "Goal Coaching", "Reactivation"],
    situation: "A chronic care programme had the data — adherence was at 30%. What they didn't have was the why. Were patients forgetting? Couldn't afford refills? Dealing with side effects? More reminder texts weren't working.",
    what: "Hana runs conversational check-ins that ask the questions staff would ask, but at scale. Not \"did you take your medication\" — but open questions about barriers, refill issues, and side effects. The output is a structured barrier report for clinicians.",
    result: "Adherence went from 30% to 73%. Engagement held at 85% weekly. Side effects that used to surface at quarterly appointments were flagged within 48 hours.",
    inNumbers: "Clinicians see patterns. They intervene where it matters. Data flows back to support the care plan, enrollment status, and reimbursement automatically.",
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
    title: "Knee Replacement Pre-Op & Post-Op",
    sub: "From last-minute cancellations to 97% surgical readiness",
    stats: [
      ["97%", "surgical readiness rate"],
      ["74%", "less manual follow-up"],
      ["4.1×", "faster response cycles"],
    ],
    chips: ["Pre-Appointment Prep", "Post-Op Safety", "Pain Monitoring", "Medication Adherence", "Care Plan Review"],
    situation: "A surgical centre was losing OR slots to coordination failures — missing clearance letters, incomplete pre-op checklists, patients who didn't follow prep instructions. Staff spent 60% of their time on administrative chase work.",
    what: "Hana took over full pre-op and post-op orchestration. Before surgery: identify gaps, run outreach via voice and SMS. After surgery: structured recovery check-ins on pain, exercise, medication, and wound concerns.",
    result: "Surgical readiness hit 97%. Manual follow-up dropped 74%. The post-op pathway caught complications earlier. Surgeons received complete pre-op packets 72 hours out.",
    inNumbers: "Staff manage by exception. Patients get guidance. Surgeons get visibility. Everything else runs automatically.",
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
    title: "Mental Health App (White-Label)",
    sub: "From 15% app engagement to 85% with a voice layer",
    stats: [
      ["15→85%", "weekly engagement"],
      ["White-label", "zero rebuilds"],
      ["Usage", "based pricing"],
    ],
    chips: ["Goal Coaching", "PHQ-9 Screening", "Sleep Check-In", "Medication Adherence", "Care Plan Review"],
    situation: "A mental health app had everything right on paper — clean UX, good clinical content, solid onboarding. But after the first week, patients stopped opening it. Engagement sat at 10–15%. Push notifications were ignored.",
    what: "Hana deployed as a white-label engagement layer. Patients see the app's brand and hear the app's voice. Conversations happen via WhatsApp and phone. Check-ins, symptom collection, and adherence follow-up — all flowing back into the partner's platform.",
    result: "Engagement went from 15% to 85% weekly. The clinical team got continuous data instead of sporadic snapshots. The partner didn't have to rebuild anything.",
    inNumbers: "The partner's brand stays front and centre. Hana runs in the background. Token-based pricing means they pay for what they use.",
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
    title: "Voice Layer for a National SMS Platform",
    sub: "Adding voice AI and multilingual support to 10M+ conversations",
    stats: [
      ["10M+", "conversations extended"],
      ["4", "languages supported"],
      ["API", "native, no rebuild"],
    ],
    chips: ["Pre-Appointment Prep", "No-Show Rescue", "Referral Follow-Up", "Insurance Verification", "Lab Reminders"],
    situation: "A large SMS-based patient engagement platform had scale — millions of conversations, hundreds of clinics. But SMS has limits. Multi-department appointment coordination required back-and-forth that text couldn't handle efficiently.",
    what: "The platform integrated Hana's voice layer via API. Hana handles the conversations SMS can't: multi-step coordination, clinical intake, and adaptive follow-up workflows — in four languages, routed to the right department.",
    result: "The platform added voice capability without building it. Multilingual support opened new markets. Infrastructure scales with usage, not headcount.",
    inNumbers: "Token-based pricing. No development overhead. No clinical safety infrastructure to maintain from scratch.",
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
            <span className="text-blue-400">infrastructure works</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
            Real deployments. Real workflows. Real results — with live voice agents you can try right now.
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
              <h2 className="font-serif text-3xl text-white leading-tight mb-2">Build your case study</h2>
              <p className="text-sm text-slate-400">Every deployment is different. Book a call and we'll design a workflow around how your team works.</p>
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
      <div className="bg-[#00122F] text-white pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All case studies
          </button>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold tracking-[2px] uppercase" style={{ color: c.color }}>{c.tag}</span>
            <span className="text-slate-600 text-xs">{idx + 1} / {total}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-4 max-w-3xl">{c.title}</h1>
          <p className="text-slate-400 text-lg">{c.sub}</p>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-px bg-white/10 mt-12 rounded-xl overflow-hidden">
            {c.stats.map(([n, l]) => (
              <div key={l} className="bg-white/5 px-6 py-5">
                <div className="text-3xl font-semibold text-white mb-1">{n}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* 3-col narrative */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: "The situation", body: c.situation },
            { label: "What Hana did", body: c.what },
            { label: "The result", body: c.result },
          ].map(({ label, body }) => (
            <div key={label}>
              <div
                className="w-6 h-0.5 mb-4 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              <p className="text-xs font-bold tracking-[2px] uppercase text-slate-400 mb-3">{label}</p>
              <p className="text-[15px] leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </div>

        {/* In numbers callout */}
        <div
          className="rounded-2xl p-8 mb-16"
          style={{ backgroundColor: `${c.color}10`, borderLeft: `3px solid ${c.color}` }}
        >
          <p className="text-xs font-bold tracking-[2px] uppercase mb-2" style={{ color: c.color }}>In numbers</p>
          <p className="text-[15px] leading-relaxed text-slate-700">{c.inNumbers}</p>
        </div>

        {/* Agents */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-[2px] uppercase text-slate-400 mb-1">Try the live agents</p>
          <p className="text-sm text-slate-500">These are the actual Hana agents used in this deployment. Click any card to start a live voice demo.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
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

        {/* Nav between cases */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <button onClick={onPrev} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-900 transition-colors">All case studies</button>
          <button onClick={onNext} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Next <ArrowRight className="w-4 h-4" />
          </button>
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
    <div className="border border-slate-200 rounded-xl p-5 flex flex-col gap-4 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Mic className="w-4 h-4" style={{ color }} />
        </div>
        {isActive && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-[14px] font-semibold text-slate-900 mb-1 leading-tight">{a.name}</p>
        <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
      </div>

      {isActive ? (
        <button
          onClick={onEnd}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
        >
          <MicOff className="w-3.5 h-3.5" /> End call
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={isOtherActive || isConnecting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={isOtherActive || isConnecting ? {} : { backgroundColor: `${color}15`, color }}
        >
          <Mic className="w-3.5 h-3.5" />
          {isConnecting ? "Connecting..." : "Start Web Call"}
        </button>
      )}
    </div>
  );
}

export default CaseStudies;
