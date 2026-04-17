import { useEffect, useState } from "react";
import { ArrowLeft, Phone, PlayCircle } from "lucide-react";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/Footer";

interface CaseStudiesProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

type FilterKey = "all" | "b" | "c" | "s" | "d" | "p";

interface Agent {
  name: string;
  desc: string;
  assistantId: string;
}

interface CaseStudy {
  id: string;
  cat: FilterKey;
  tag: string;
  tagClass: string; // tb | tc | ts | td | tp
  title: string;
  sub: string;
  stats: [string, string][];
  chips: string[];
  featured?: { quote: string; before: string; after: string; label: string };
  situation: string;
  what: string;
  result: string;
  inNumbers: string;
  agents: Agent[];
}

const CASES: CaseStudy[] = [
  {
    id: "behavioral-health-intake",
    cat: "b",
    tag: "Behavioral health",
    tagClass: "tb",
    title: "Behavioral Health Intake",
    sub: "How a practice cut diagnostic time by 85%",
    stats: [
      ["85%", "faster time to diagnosis"],
      ["96%", "patient acceptance rate"],
      ["31:1", "ROI on staff time"],
    ],
    chips: ["PHQ-9 Screening", "High-Risk Assessment", "+3 more"],
    featured: {
      quote: "The coordination that used to take hours now happens in the background.",
      before: "$150",
      after: "<$15",
      label: "cost per intake",
    },
    situation:
      "A high-volume behavioral health practice was losing patients before clinicians ever saw them. Every evaluation required coordinating across multiple people — the patient, a caregiver, a teacher, sometimes a grandparent. Forms sat incomplete. Staff chased paperwork across systems.",
    what:
      "Hana replaced the pre-diagnostic coordination workflow. The system reads what's already in the chart, identifies what's missing, and runs adaptive outreach to every collateral source through the right channel — voice for detailed history, SMS for quick confirmations.",
    result:
      "Diagnostic time dropped 85%. Staff went from chasing paperwork to reading finished reports. 96% of patients accepted the AI-led process. Only 4% opted out entirely.",
    inNumbers:
      "Cost per completed intake drops from $150+ to under $15. If your team spends 4+ hours coordinating each evaluation, Hana brings that under 40 minutes.",
    agents: [
      {
        name: "PHQ-9 Depression Screening",
        desc: "Conversational mental health screening that tracks scores and flags elevated responses.",
        assistantId: "29456291-d3c5-4edf-9a1c-1808a9f9966e",
      },
      {
        name: "High-Risk Assessment",
        desc: "Proactive safety screening with calm clinical escalation for at-risk patients.",
        assistantId: "9942b37b-5c59-48d9-96f1-1b4fbe1b106a",
      },
      {
        name: "New Patient Welcome",
        desc: "Warm onboarding call confirming appointments and collecting missing intake info.",
        assistantId: "b7f0553b-11ba-4d58-a900-7d63ed2c4d52",
      },
      {
        name: "Referral Follow-Up",
        desc: "Checks booking status and removes barriers stopping patients from attending.",
        assistantId: "e1b48b50-a17b-45e3-9420-72e2b9a82bf1",
      },
      {
        name: "Social Needs & Safety",
        desc: "Assessment of social determinants and safety concerns for comprehensive care.",
        assistantId: "e0c9f0d9-5c76-4a3a-a07c-38508863d9fb",
      },
    ],
  },
  {
    id: "chronic-care-management",
    cat: "c",
    tag: "Chronic care",
    tagClass: "tc",
    title: "Chronic Care Management",
    sub: "From 30% medication adherence to 73%",
    stats: [
      ["2.4×", "adherence improvement"],
      ["85%", "weekly engagement"],
      ["12 min", "saved per patient / month"],
    ],
    chips: ["Medication Adherence", "Care Plan Review", "+5 more"],
    situation:
      "A chronic care programme had the data — adherence was at 30%. What they didn't have was the why. Were patients forgetting? Couldn't afford refills? Dealing with side effects? More reminder texts weren't working. Patients had trained themselves to ignore anything automated.",
    what:
      "Hana runs conversational check-ins that ask the questions staff would ask, but at scale. Not \"did you take your medication\" — but open questions about barriers, refill issues, and side effects. The output is a structured barrier report for clinicians.",
    result:
      "Adherence went from 30% to 73%. Engagement held at 85% weekly. Side effects that used to surface at quarterly appointments were flagged within 48 hours.",
    inNumbers:
      "Clinicians see patterns. They intervene where it matters. Data flows back to support the care plan, enrollment status, and reimbursement automatically.",
    agents: [
      {
        name: "Medication Adherence Call",
        desc: "Conversational check-in exploring why patients miss doses, not just whether they do.",
        assistantId: "ca20d9d6-7be2-4b6c-8f23-847a48c43b70",
      },
      {
        name: "Medication Refill Reminder",
        desc: "Proactive outreach before refills run out, catching cost and access barriers early.",
        assistantId: "7e7c066f-9c4b-473c-ad89-11f4146dcfcf",
      },
      {
        name: "Blood Pressure Monitoring",
        desc: "Regular BP check-ins with symptom tracking and escalation for out-of-range readings.",
        assistantId: "e886ab67-ea0f-4e58-9137-a5a237681e74",
      },
      {
        name: "Sleep & Fatigue Check-In",
        desc: "Monitors sleep patterns and energy levels to flag fatigue-related care concerns.",
        assistantId: "a4611af8-932b-42a3-9025-6a03e5d3783e",
      },
      {
        name: "Goal Coaching Call",
        desc: "Motivational check-in that celebrates progress and identifies obstacles to health goals.",
        assistantId: "16206946-a057-41c9-bc37-ce1e9546704d",
      },
      {
        name: "Dormant Patient Reactivation",
        desc: "Re-engages patients who have fallen out of care programmes.",
        assistantId: "cad51e8f-2299-487e-b73f-aa99b7aaa1f4",
      },
    ],
  },
  {
    id: "knee-replacement",
    cat: "s",
    tag: "Surgical",
    tagClass: "ts",
    title: "Knee Replacement Pre-Op & Post-Op",
    sub: "From last-minute cancellations to 97% surgical readiness",
    stats: [
      ["97%", "surgical readiness rate"],
      ["74%", "less manual follow-up"],
      ["4.1×", "faster response cycles"],
    ],
    chips: ["Pre-Appointment Prep", "Post-Op Safety", "+4 more"],
    situation:
      "A surgical centre was losing OR slots to coordination failures — missing clearance letters, incomplete pre-op checklists, patients who didn't follow prep instructions. Staff spent 60% of their time on administrative chase work.",
    what:
      "Hana took over full pre-op and post-op orchestration. Before surgery: identify gaps, run outreach via voice and SMS. After surgery: structured recovery check-ins on pain, exercise, medication, and wound concerns — with escalation for anything outside expected parameters.",
    result:
      "Surgical readiness hit 97%. Manual follow-up dropped 74%. The post-op pathway caught complications earlier. Surgeons received complete pre-op packets 72 hours out.",
    inNumbers:
      "Staff manage by exception. Patients get guidance. Surgeons get visibility. Everything else runs automatically.",
    agents: [
      {
        name: "Pre-Appointment Prep",
        desc: "Confirms pre-op checklist completion — fasting, medication holds, transport, prep shower.",
        assistantId: "b7f0553b-11ba-4d58-a900-7d63ed2c4d52",
      },
      {
        name: "Post-Op 48-Hour Safety",
        desc: "Critical post-surgery safety check covering pain, wound appearance, and red-flag symptoms.",
        assistantId: "cbab4560-bf00-4f31-a265-aee253296e3c",
      },
      {
        name: "Pain Monitoring Call",
        desc: "Tracks pain scores, medication timing, and trajectory to catch uncontrolled pain early.",
        assistantId: "b20b8495-8283-409e-978a-473195f1113d",
      },
      {
        name: "Medication Adherence Call",
        desc: "Ensures post-op medications are taken correctly and on schedule.",
        assistantId: "ca20d9d6-7be2-4b6c-8f23-847a48c43b70",
      },
      {
        name: "Care Plan Review",
        desc: "Regular review of recovery goals and progress tracking to keep patients on track.",
        assistantId: "c2a302b7-cc6a-4c8a-85ba-1ddc40d0d602",
      },
    ],
  },
  {
    id: "mental-health-app",
    cat: "d",
    tag: "Digital health",
    tagClass: "td",
    title: "Mental Health App (White-Label)",
    sub: "From 15% app engagement to 85% with a voice layer patients never see",
    stats: [
      ["15→85%", "weekly engagement"],
      ["White-label", "zero rebuilds"],
      ["Usage", "based pricing"],
    ],
    chips: ["Goal Coaching", "PHQ-9 Screening", "+3 more"],
    situation:
      "A mental health app had everything right on paper — clean UX, good clinical content, solid onboarding. But after the first week, patients stopped opening it. Engagement sat at 10–15%. Push notifications were ignored.",
    what:
      "Hana deployed as a white-label engagement layer. Patients see the app's brand and hear the app's voice. Conversations happen via WhatsApp and phone. Check-ins, symptom collection, and adherence follow-up — all flowing back into the partner's platform.",
    result:
      "Engagement went from 15% to 85% weekly. The clinical team got continuous data instead of sporadic snapshots. The partner didn't have to rebuild anything.",
    inNumbers:
      "The partner's brand stays front and centre. Hana runs in the background. Token-based pricing means they pay for what they use.",
    agents: [
      {
        name: "PHQ-9 Depression Screening",
        desc: "Conversational mental health screening delivered in the app's tone and voice.",
        assistantId: "29456291-d3c5-4edf-9a1c-1808a9f9966e",
      },
      {
        name: "Sleep & Fatigue Check-In",
        desc: "Weekly sleep quality check-in that surfaces patterns needing clinical attention.",
        assistantId: "a4611af8-932b-42a3-9025-6a03e5d3783e",
      },
      {
        name: "Goal Coaching Call",
        desc: "Motivational check-in that keeps patients working toward their health goals.",
        assistantId: "16206946-a057-41c9-bc37-ce1e9546704d",
      },
      {
        name: "Medication Adherence Call",
        desc: "Gentle adherence check-in that explores barriers rather than just confirming compliance.",
        assistantId: "ca20d9d6-7be2-4b6c-8f23-847a48c43b70",
      },
      {
        name: "Care Plan Review",
        desc: "Structured review of care plan goals to maintain engagement between app sessions.",
        assistantId: "c2a302b7-cc6a-4c8a-85ba-1ddc40d0d602",
      },
    ],
  },
  {
    id: "sms-platform-voice-layer",
    cat: "p",
    tag: "Platform",
    tagClass: "tp",
    title: "Voice Layer for a National SMS Platform",
    sub: "Adding voice AI and multilingual support to 10M+ conversations",
    stats: [
      ["10M+", "conversations extended"],
      ["4", "languages supported"],
      ["API", "native, no rebuild"],
    ],
    chips: ["Pre-Appointment Prep", "No-Show Rescue", "+4 more"],
    situation:
      "A large SMS-based patient engagement platform had scale — millions of conversations, hundreds of clinics. But SMS has limits. Multi-department appointment coordination required back-and-forth that text couldn't handle efficiently.",
    what:
      "The platform integrated Hana's voice layer via API. Hana handles the conversations SMS can't: multi-step coordination, clinical intake, and adaptive follow-up workflows — in four languages, routed to the right department.",
    result:
      "The platform added voice capability without building it. Multilingual support opened new markets. Infrastructure scales with usage, not headcount.",
    inNumbers:
      "Token-based pricing. No development overhead. No clinical safety infrastructure to maintain from scratch.",
    agents: [
      {
        name: "Pre-Appointment Prep",
        desc: "Confirms appointment details and preparation steps across multiple departments.",
        assistantId: "b7f0553b-11ba-4d58-a900-7d63ed2c4d52",
      },
      {
        name: "No-Show Rescue Call",
        desc: "Warm outreach to patients who miss appointments — understands why and reschedules.",
        assistantId: "50ac1f91-547e-4bc9-8398-8d091adcedae",
      },
      {
        name: "Referral Follow-Up",
        desc: "Ensures patients follow through on specialist referrals and removes barriers.",
        assistantId: "e1b48b50-a17b-45e3-9420-72e2b9a82bf1",
      },
      {
        name: "Insurance Verification",
        desc: "Proactive outreach to confirm coverage and flag issues before appointments.",
        assistantId: "04947ff4-f66d-42e0-808d-d272d32016b1",
      },
      {
        name: "Lab Work Reminder",
        desc: "Timely reminders for pending lab work with escalation for overdue results.",
        assistantId: "63288099-0dc0-42b7-9f0f-ce8a2b97dbf0",
      },
    ],
  },
];

const TAG_COLORS: Record<string, string> = {
  tb: "bg-emerald-50 text-emerald-800",
  tc: "bg-blue-50 text-blue-800",
  ts: "bg-amber-50 text-amber-800",
  td: "bg-indigo-50 text-indigo-800",
  tp: "bg-orange-50 text-orange-800",
};

export function CaseStudies({
  activeAgentId,
  webCallStatus,
  handleStartWebCall,
  handleEndWebCall,
}: CaseStudiesProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedIdx]);

  const selected = selectedIdx !== null ? CASES[selectedIdx] : null;

  return (
    <>
      <SEO
        title="Case Studies"
        description="Real Hana deployments across behavioral health, chronic care, surgical, digital health, and platform integrations. Try live voice agents from each workflow."
        path="/case-studies"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://hanavoice.ai/" },
          { name: "Case Studies", url: "https://hanavoice.ai/case-studies" },
        ])}
      />
      <div className="min-h-screen bg-white font-sans pb-16">
        {selected ? (
          <DetailView
            c={selected}
            onBack={() => setSelectedIdx(null)}
            activeAgentId={activeAgentId}
            webCallStatus={webCallStatus}
            onStartCall={handleStartWebCall}
            onEndCall={handleEndWebCall}
          />
        ) : (
          <IndexView onOpen={(idx) => setSelectedIdx(idx)} />
        )}
      </div>
      <Footer />
    </>
  );
}

function IndexView({ onOpen }: { onOpen: (idx: number) => void }) {
  const topRow = CASES.slice(0, 2);
  const bottomRow = CASES.slice(2);

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-12 px-4 text-center max-w-3xl mx-auto">
        <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-4">
          Case studies
        </div>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight text-slate-900 leading-[1.05] mb-4">
          What happens when <em className="italic text-blue-500">infrastructure works</em>
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-light max-w-xl mx-auto">
          Real deployments. Real workflows. Real results — with live voice agents you can try right now.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {topRow.map((c, i) => (
            <CaseCard key={c.id} c={c} onOpen={() => onOpen(i)} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bottomRow.map((c, i) => (
            <CaseCard key={c.id} c={c} onOpen={() => onOpen(i + 2)} />
          ))}
        </div>

        <BottomCTA />
      </div>
    </>
  );
}

function CaseCard({ c, onOpen }: { c: CaseStudy; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer bg-white border border-slate-200 hover:border-slate-400 rounded-lg transition-colors p-6 flex flex-col"
    >
      <CardHeader c={c} />
      <ChipsRow c={c} />
      <div className="mt-auto">
        <ReadMore />
      </div>
    </div>
  );
}

function CardHeader({ c }: { c: CaseStudy }) {
  return (
    <>
      <span
        className={`inline-block text-[13px] font-medium tracking-[0.08em] uppercase px-3 py-1 rounded-full mb-3 ${TAG_COLORS[c.tagClass]}`}
      >
        {c.tag}
      </span>
      <div className="font-serif text-[19px] leading-[1.2] mb-1 text-slate-900">{c.title}</div>
      <div className="text-xs text-slate-600 mb-4 leading-[1.4]">{c.sub}</div>
      <div className="h-px bg-slate-200 mb-4" />
      <div className="flex flex-col gap-[6px] mb-4">
        {c.stats.map(([n, l]) => (
          <div key={l} className="flex items-baseline gap-2">
            <span className="text-[17px] font-medium min-w-[52px]">{n}</span>
            <span className="text-xs text-slate-600">{l}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function ChipsRow({ c }: { c: CaseStudy }) {
  return (
    <div className="flex flex-wrap gap-1 mb-4">
      {c.chips.map((ch) => (
        <span
          key={ch}
          className="text-[11px] text-slate-400 px-[7px] py-0.5 border border-slate-200 rounded-[3px]"
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

function ReadMore() {
  return (
    <div className="flex items-center gap-[5px] text-[13px] font-medium text-slate-900">
      Read case study{" "}
      <span className="inline-block transition-transform group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
        →
      </span>
    </div>
  );
}

function BottomCTA() {
  return (
    <div className="mt-12 p-6 border border-slate-200 flex items-center justify-between gap-6 flex-wrap">
      <div>
        <div className="font-serif text-[20px] leading-[1.2] mb-1">
          Every workflow is different.
          <br />
          That's the point.
        </div>
        <div className="text-[13px] text-slate-600">
          Book a demo. We'll show you a workflow built for how you work.
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <a
          href="/use-cases"
          className="text-[13px] font-medium px-[15px] py-2 border border-slate-900 text-slate-900 rounded-[2px] hover:bg-slate-900 hover:text-white transition-colors"
        >
          Explore agent catalogue →
        </a>
        <a
          href="https://calendly.com/matteowastaken/discoverycall"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium px-[15px] py-2 rounded-[2px] bg-[#1B2B4B] text-white border border-[#1B2B4B] hover:opacity-85 transition-opacity"
        >
          Book a demo
        </a>
      </div>
    </div>
  );
}

function DetailView({
  c,
  onBack,
  activeAgentId,
  webCallStatus,
  onStartCall,
  onEndCall,
}: {
  c: CaseStudy;
  onBack: () => void;
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  onStartCall: (agentId: string, assistantId: string) => void;
  onEndCall: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-[5px] text-[13px] text-slate-600 hover:text-slate-900 mb-7 bg-transparent border-none cursor-pointer p-0"
      >
        <ArrowLeft className="w-4 h-4" /> Back to case studies
      </button>

      <div className="grid grid-cols-[3fr_2fr] max-[580px]:grid-cols-1 gap-9 mb-9 pb-8 border-b border-slate-200">
        <div>
          <span
            className={`inline-block text-[11px] font-medium tracking-[0.08em] uppercase px-[9px] py-[3px] rounded-full mb-3 ${TAG_COLORS[c.tagClass]}`}
          >
            {c.tag}
          </span>
          <h1 className="font-serif text-[clamp(22px,3.5vw,34px)] font-normal leading-[1.2] tracking-tight mb-1">
            {c.title}
          </h1>
          <p className="text-sm text-slate-600 leading-[1.6]">{c.sub}</p>
        </div>
        <div className="flex flex-col gap-[0.85rem]">
          {c.stats.map(([n, l]) => (
            <div key={l} className="p-[0.9rem] bg-slate-50 rounded-md">
              <div className="text-2xl font-medium leading-none mb-0.5">{n}</div>
              <div className="text-xs text-slate-600">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 max-[580px]:grid-cols-1 gap-6 mb-7">
        <DetailBlock label="The situation" body={c.situation} />
        <DetailBlock label="What Hana did" body={c.what} />
        <DetailBlock label="The result" body={c.result} />
      </div>

      <div className="pl-[1.1rem] pr-[0.9rem] py-[0.9rem] border-l-2 border-slate-900 mb-8">
        <p className="text-[13px] text-slate-600 leading-[1.6]">
          <strong className="text-slate-900 font-medium">In numbers:</strong> {c.inNumbers}
        </p>
      </div>

      <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-slate-400 mb-[0.45rem]">
        Try the agents from this workflow
      </p>
      <p className="text-[13px] text-slate-600 mb-[1.1rem] leading-[1.5]">
        These are the actual Hana agents used in this deployment. Click any card to start a live voice demo.
      </p>

      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(170px,1fr))] gap-[10px] mb-8">
        {c.agents.map((a) => {
          const agentId = `${c.id}-${a.assistantId}`;
          const isActive = activeAgentId === agentId;
          const status = isActive ? webCallStatus : "idle";
          return (
            <AgentTile
              key={a.name}
              a={a}
              status={status}
              isOtherActive={activeAgentId !== null && !isActive}
              onStart={() => onStartCall(agentId, a.assistantId)}
              onEnd={onEndCall}
            />
          );
        })}
      </div>

      <div className="mt-12 p-6 border border-slate-200 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <div className="font-serif text-[20px] leading-[1.2] mb-1">See this workflow in action.</div>
          <div className="text-[13px] text-slate-600">
            Book a demo. We'll build it around how you work.
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href="/use-cases"
            className="text-[13px] font-medium px-[15px] py-2 border border-slate-900 text-slate-900 rounded-[2px] hover:bg-slate-900 hover:text-white transition-colors"
          >
            Explore agent catalogue →
          </a>
          <a
            href="https://calendly.com/matteowastaken/discoverycall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium px-[15px] py-2 rounded-[2px] bg-[#1B2B4B] text-white border border-[#1B2B4B] hover:opacity-85 transition-opacity"
          >
            Book a demo
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-slate-400 mb-[0.45rem]">
        {label}
      </p>
      <p className="text-[13px] leading-[1.7] text-slate-600">{body}</p>
    </div>
  );
}

function AgentTile({
  a,
  status,
  isOtherActive,
  onStart,
  onEnd,
}: {
  a: Agent;
  status: "idle" | "connecting" | "active";
  isOtherActive: boolean;
  onStart: () => void;
  onEnd: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-[1.1rem] flex flex-col gap-[0.55rem]">
      <div className="w-[30px] h-[30px] rounded-[7px] bg-blue-50 flex items-center justify-center">
        <PlayCircle className="w-[15px] h-[15px] text-blue-800" strokeWidth={1.5} />
      </div>
      <div className="text-[13px] font-medium leading-[1.3] text-slate-900">{a.name}</div>
      <div className="text-[11px] text-slate-600 leading-[1.5] flex-1">{a.desc}</div>
      {status === "active" ? (
        <button
          onClick={onEnd}
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 bg-red-600 text-white rounded-[7px] text-xs font-medium mt-[3px] hover:opacity-85 transition-opacity"
        >
          <Phone className="w-3 h-3" /> End call
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={isOtherActive || status === "connecting"}
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#1B2B4B] text-white rounded-[7px] text-xs font-medium mt-[3px] hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayCircle className="w-3 h-3" />
          {status === "connecting" ? "Connecting..." : "Start Web Call"}
        </button>
      )}
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-medium tracking-[0.08em] uppercase text-slate-400">
          Interactive demo
        </span>
        <span className="text-[9px] text-slate-400">
          Powered by <b className="text-[#1B2B4B]">Hana</b>
        </span>
      </div>
    </div>
  );
}

export default CaseStudies;
