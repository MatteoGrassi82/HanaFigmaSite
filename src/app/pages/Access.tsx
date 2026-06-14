import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, ChevronUp, Globe, Loader2, CheckCircle2, PhoneOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";


const TRACKS = [
  {
    key: "CKM",
    label: "CKM",
    color: "#3B82F6",
    subtitle: "Cardiometabolic & kidney health · $35/mo init, $17.50/mo follow-on",
    oap: "$420 initial / $210 follow-on",
    measures: [
      { name: "Blood pressure", note: "≤130/80, from an approved cuff that sends it in automatically" },
      { name: "Weight / BMI", note: "valid within 15 days of submission" },
      { name: "HbA1c", note: "lab, valid 1–2 years" },
      { name: "LDL-C", note: "lab, valid 1–2 years" },
      { name: "eGFR / uACR", note: "lab, valid 1–2 years" },
    ],
    hana: "Hana calls and texts patients to keep blood pressure, weight, and lab results current, each one timed so it counts with CMS. One note for honesty: the official blood pressure reading has to come from an approved cuff that sends it in automatically, so Hana flags when a patient needs that set up. Everything goes to CMS in the format they require.",
  },
  {
    key: "eCKM",
    label: "eCKM",
    color: "#3B82F6",
    subtitle: "Enhanced cardiometabolic & kidney · $30/mo init, $15/mo follow-on",
    oap: "$360 initial / $180 follow-on",
    measures: [
      { name: "Blood pressure", note: "≤130/80, from an approved cuff that sends it in automatically" },
      { name: "Weight / BMI", note: "valid within 15 days of submission" },
      { name: "HbA1c", note: "lab, valid 1–2 years" },
      { name: "LDL-C", note: "lab, valid 1–2 years" },
      { name: "eGFR / uACR", note: "lab, valid 1–2 years" },
    ],
    hana: "Same check-ins as CKM, paid at the eCKM rate, with an extra $15 for rural patients who need a connected device. Hana keeps every reading on time, and handles the yearly re-consent for you: it calls inside the 60-day window, gets the patient's okay to continue, and takes a fresh reading if needed. Miss that window and you can't bill, so Hana makes sure it gets done.",
  },
  {
    key: "BH",
    label: "Behavioural Health",
    color: "#10B981",
    subtitle: "Mental health & substance use",
    oap: "$15/patient/month",
    measures: [
      { name: "PHQ-9", note: "Depression check-in (required)" },
      { name: "GAD-7", note: "Anxiety check-in (required)" },
      { name: "PGIC", note: "How they feel they're doing (required)" },
      { name: "WHODAS 2.0", note: "Daily function (optional for 2026–27)" },
    ],
    hana: "Hana runs the required mental-health check-ins by phone, in plain conversation instead of a form. It can also handle the optional one if you want it. If a patient says anything concerning, your team is alerted right away.",
    whodas: true,
  },
  {
    key: "MSK",
    label: "Musculoskeletal",
    color: "#F59E0B",
    subtitle: "Orthopaedics & pain management",
    oap: "$15/patient/month",
    measures: [
      { name: "Pain level", note: "How much pain gets in the way" },
      { name: "Pain score", note: "Zero to ten" },
      { name: "PGIC", note: "How they feel they're doing" },
    ],
    hana: "Hana checks in on pain and how patients are getting around, by phone or text. It asks the same questions a nurse would, then sends the answers to CMS for you.",
  },
];

const FAQS = [
  {
    q: "Is this remote patient monitoring?",
    a: "No. There are no devices to order and no monitoring codes to bill. Hana just calls your patients, runs the check-ins, and sends the results to CMS.",
  },
  {
    q: "Do we have to change our EHR?",
    a: "No. Hana connects to Athena, Charm, and most major systems. If you're on something custom, we build the connection for you.",
  },
  {
    q: "What if we miss the threshold?",
    a: "You still pay the $5 base fee, since you got the full outreach program. But the 10% success fee only kicks in when CMS pays you back. If you don't get the money, we don't get ours.",
  },
  {
    q: "Will the data be in the right format for CMS?",
    a: "Yes. Every reading and check-in goes to CMS exactly how they want it. You don't have to set any of that up.",
  },
  {
    q: "Can you handle patients in more than one track?",
    a: "Yes. If a patient is in two programs, Hana runs both and keeps each one straight, so you don't manage it.",
  },
  {
    q: "What response rate can we expect?",
    a: "We aim for 70 to 80% on the first try, and Hana keeps trying if someone doesn't pick up. Studies show phone outreach reaches 75 to 88% of older patients, versus about 45 to 55% for portal reminders alone. We treat our own numbers as goals, not promises.",
  },
];

const ACCESS_AGENT_TYPES = ["CKM Outreach", "BH Screening", "MSK Outreach", "ACCESS Advisor"] as const;
type AccessAgentType = typeof ACCESS_AGENT_TYPES[number];

const ACCESS_AGENT_IDS: Record<AccessAgentType, string> = {
  "CKM Outreach":    "agent_9401ktmj1srweajt71rxw4f1h3g8",
  "BH Screening":    "agent_4701ktmj1veae90s9zpfz6jc9d97",
  "MSK Outreach":    "agent_2301ktmj1wd3et4anjq29m2bvtkz",
  "ACCESS Advisor":  "agent_4401ktmj1y4dfnragb1hw9tm8d0z",
};

function AccessDemoSection({
  webCallStatus, handleStartWebCall, handleEndWebCall,
}: {
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}) {
  const [selectedAgent, setSelectedAgent] = useState<AccessAgentType | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ agent?: string; name?: string; email?: string }>({});

  const handleWebCallClick = () => {
    const errors: { agent?: string; name?: string; email?: string } = {};
    if (!selectedAgent)  errors.agent = "Please select a use case";
    if (!name.trim())    errors.name  = "Name is required";
    if (!email.trim())   errors.email = "Email is required";
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    handleStartWebCall(selectedAgent, ACCESS_AGENT_IDS[selectedAgent as AccessAgentType]);
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-5xl md:text-7xl text-slate-900 leading-[1.0] text-center mb-14 tracking-tight">
          Try Our<br />Live Demo
        </h2>

        <div className="flex flex-col lg:flex-row gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Left — video + agent tags */}
          <div className="relative lg:w-[48%] bg-slate-50 flex flex-col justify-between p-8 min-h-[280px] md:min-h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
              <video src="/video1.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-24 sm:pt-48">
              {ACCESS_AGENT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => { setSelectedAgent(type); setFieldErrors(p => ({ ...p, agent: undefined })); }}
                  className={cn(
                    "px-4 py-2 min-h-[44px] md:min-h-0 rounded-full text-sm font-medium border transition-all duration-150",
                    selectedAgent === type
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Right — form / active state */}
          <div className="lg:w-[52%] bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {webCallStatus !== "idle" ? (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center gap-6 text-center py-8"
                >
                  <div className="relative w-24 h-24">
                    {webCallStatus === "connecting" && <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />}
                    {webCallStatus === "active" && <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse" />}
                    <div className={cn(
                      "absolute inset-2 bg-white rounded-full flex items-center justify-center border shadow-sm",
                      webCallStatus === "active" ? "border-green-100" : "border-blue-100"
                    )}>
                      <Globe className={cn("w-8 h-8", webCallStatus === "active" ? "text-green-600" : "text-blue-600")} />
                    </div>
                    <div className={cn(
                      "absolute -right-1 -top-1 text-white p-1.5 rounded-full border-4 border-slate-50",
                      webCallStatus === "active" ? "bg-green-500" : "bg-blue-500"
                    )}>
                      {webCallStatus === "active"
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-medium text-slate-900 mb-1">
                      {webCallStatus === "active" ? `Speaking with ${selectedAgent} Agent` : "Connecting..."}
                    </p>
                    <p className="text-sm text-slate-500">
                      {webCallStatus === "active" ? "Click End Call when you're done." : "Establishing connection..."}
                    </p>
                  </div>
                  <button
                    onClick={handleEndWebCall}
                    className="bg-red-500 text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-red-600 transition-colors"
                  >
                    <PhoneOff className="w-4 h-4" /> End Call
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 w-full">
                  <p className="text-[17px] text-slate-700 leading-relaxed">
                    Receive a live call from our ACCESS agent and hear how Hana handles patient conversations across every track.
                  </p>

                  {selectedAgent ? (
                    <p className="text-[13px] text-slate-500">Use case: <span className="font-semibold text-slate-900">{selectedAgent}</span></p>
                  ) : (
                    <p className="text-[13px] text-slate-400 italic">
                      <span className="lg:hidden">Select a use case above ↑</span>
                      <span className="hidden lg:inline">Select a use case from the left →</span>
                    </p>
                  )}
                  {fieldErrors.agent && <p className="text-xs text-red-500">{fieldErrors.agent}</p>}

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-600 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
                      placeholder="Your Name"
                      className={cn(
                        "w-full bg-transparent border-b-2 py-3 text-slate-900 text-[16px] placeholder:text-slate-300 focus:outline-none transition-colors",
                        fieldErrors.name ? "border-red-400" : "border-slate-200 focus:border-slate-900"
                      )}
                    />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-600 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
                      placeholder="you@company.com"
                      className={cn(
                        "w-full bg-transparent border-b-2 py-3 text-slate-900 text-[16px] placeholder:text-slate-300 focus:outline-none transition-colors",
                        fieldErrors.email ? "border-red-400" : "border-slate-200 focus:border-slate-900"
                      )}
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={handleWebCallClick}
                      disabled={webCallStatus !== "idle"}
                      className="w-full flex flex-col items-start gap-3 bg-white border-2 border-slate-200 hover:border-slate-900 rounded-xl p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-[14px] font-semibold text-slate-900">Web Call</p>
                        <p className="text-[12px] text-slate-500">Talk in your browser</p>
                      </div>
                      <span className="text-[12px] font-medium text-blue-600 flex items-center gap-1">
                        {webCallStatus === "connecting" ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Connecting...</>
                        ) : "Start now →"}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

interface AccessProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

export function Access({ activeAgentId, webCallStatus, handleStartWebCall, handleEndWebCall }: AccessProps) {
  const [activeTrack, setActiveTrack] = useState("CKM");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Calculator state
  const [calcPatients, setCalcPatients] = useState(500);
  const [calcTrack, setCalcTrack] = useState<"eCKM" | "CKM" | "BH" | "MSK">("CKM");
  const [calcOAR, setCalcOAR] = useState(55);

  const OAP_RATES: Record<string, number> = { eCKM: 30, CKM: 35, BH: 15, MSK: 15 };
  const BASE_FEES: Record<string, number> = { eCKM: 5, CKM: 5, BH: 6, MSK: 5 };
  const oap = OAP_RATES[calcTrack];
  const baseFee = BASE_FEES[calcTrack];
  const annualOAP = oap * calcPatients * 12;
  const withheld = annualOAP * 0.5;
  // OAT = 50%; if OAR >= 50 → full release; else proportional, floor 50%
  const oat = 50;
  const releaseFraction = calcOAR >= oat ? 1 : Math.max(0.5, calcOAR / oat);
  const released = withheld * releaseFraction;
  const hanaBase = baseFee * calcPatients * 12;
  const hanaSuccess = released * 0.1;
  const hanaTotal = hanaBase + hanaSuccess;
  const revenueProtected = released - withheld * 0.5; // vs floor scenario
  const roi = hanaTotal > 0 ? (released / hanaTotal) : 0;
  const hitOAT = calcOAR >= oat;

  const track = TRACKS.find(t => t.key === activeTrack)!;

  return (
    <>
      <SEO
        title="CMS ACCESS Model — Patient Outreach That Gets You Paid"
        description="CMS holds back half your ACCESS payments until your patients respond. Hana calls and texts them so you earn it back. Five dollars a patient, a month."
        path="/access"
      />

      <div className="min-h-screen bg-white">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="bg-[#00122F] text-white pt-32 pb-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              <span className="text-slate-400 text-xs font-semibold tracking-[3px] uppercase">CMS ACCESS Model · July 5 Launch</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.05] mb-6 mx-auto max-w-3xl">
              50% of your ACCESS revenue is withheld.{" "}
              <span className="text-slate-300">Getting it back depends on whether your patients responded.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Hana calls and texts your patients, collects the measures CMS needs, and sends the data over in the right format. That's how you hit the threshold and get your money back. Five dollars a patient, a month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/matteowastaken/discoverycall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-[#00122F] rounded-full font-semibold text-[15px] transition-all hover:-translate-y-0.5 group"
              >
                Book a 20-min call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white rounded-full font-semibold text-[15px] transition-all"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* ── What is ACCESS ───────────────────────────────────────────────── */}
        <section className="bg-white border-t border-slate-100 px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-bold tracking-[3px] uppercase text-slate-400 mb-8 text-center">What is ACCESS?</p>
            <p className="text-slate-600 text-[16px] leading-relaxed text-center max-w-2xl mx-auto mb-10">
              ACCESS is a new CMS program that starts July 5. You get paid every month for each patient you enroll. But CMS keeps half of it for up to a year. You earn that half back only if enough of your patients complete their check-ins.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden">
              {[
                { term: "OAP", full: "Outcome-Aligned Payment", def: "What CMS pays you per patient each month. Half now, half held back." },
                { term: "OAT", full: "Outcome Attainment Threshold", def: "The 50% completion rate you have to hit to earn the held-back half." },
                { term: "OAR", full: "Outcome Attainment Rate", def: "Your real completion rate when CMS settles up. This is the number Hana moves." },
              ].map(({ term, full, def }) => (
                <div key={term} className="bg-white p-6 flex flex-col gap-2">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-serif text-[24px] text-slate-900 leading-none">{term}</span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{full}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{def}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The revenue cliff ─────────────────────────────────────────────── */}
        <section className="bg-slate-50 border-t border-slate-100 px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">The revenue cliff</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
                You go from <span className="text-blue-600">~$216</span> a month to <span className="text-blue-600">~$35</span>. And half of that is held back.
              </h2>
              <p className="text-slate-600 text-[16px] max-w-2xl mx-auto leading-relaxed">
                Today, a chronic-care patient on remote monitoring brings in about $216 a month. Under ACCESS, your best-paying track pays about $35. Then CMS holds back half of that for up to a year, and only pays it out once your patients respond.
              </p>
            </div>

            {/* Two stat callouts: the cliff + the withhold */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden mb-12">
              {/* before */}
              <div className="bg-white p-8 flex flex-col gap-2">
                <div className="font-serif text-4xl text-slate-900 leading-none">~$216</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Remote monitoring / patient / month</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  What a chronic-care patient brings in today.
                </p>
              </div>
              {/* after */}
              <div className="bg-white p-8 flex flex-col gap-2">
                <div className="font-serif text-4xl text-blue-600 leading-none">~$35</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ACCESS CKM / patient / month</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  The top ACCESS rate. Most tracks pay $15 to $30 a month.
                </p>
              </div>
              {/* withheld */}
              <div className="bg-white p-8 flex flex-col gap-2">
                <div className="font-serif text-4xl text-slate-900 leading-none">50%</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Held back up to 12 months</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  You only earn it back once your patients complete their check-ins.
                </p>
              </div>
            </div>

            {/* The mandate */}
            <div className="bg-[#00122F] rounded-2xl p-8 md:p-10">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-400 mb-4">Software, not staff</p>
              <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-4">
                CMS set the rates this low on purpose
              </h3>
              <p className="text-slate-300 text-[16px] leading-relaxed mb-4">
                At $15 to $35 a patient, you can't pay a person to chase down follow-ups. The math only works if software does it. That's the whole idea behind the program.
              </p>
              <p className="text-slate-400 text-[15px] leading-relaxed">
                Hana is how you get the held-back half. It runs the outreach for you, gets your completion rate over the line, and the money comes back.
              </p>
            </div>

            {/* How the penalty actually works — at reconciliation */}
            <div id="how-it-works" className="text-center mt-20 mb-14 scroll-mt-24">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">When CMS settles up</p>
              <h3 className="font-serif text-2xl md:text-3xl text-slate-900 leading-tight mb-4">
                One number decides how much you get back
              </h3>
              <p className="text-slate-500 text-[16px] max-w-2xl mx-auto leading-relaxed">
                It's the share of your patients who finished their check-ins. The higher it is, the more of the held-back money you keep.
              </p>
            </div>

            {/* Three-column OAT diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden mb-12">
              {/* ≥50% — full release */}
              <div className="bg-white p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-emerald-600">OAR ≥ 50%</span>
                </div>
                <div className="font-serif text-4xl text-slate-900 leading-none">100%</div>
                <div className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider">You get it all back</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  Half or more of your patients finished their check-ins. CMS pays back the whole held-back amount.
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">1,000 CKM patients → $210K released</span>
                </div>
              </div>

              {/* 40% — proportional cut */}
              <div className="bg-white p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-amber-600">OAR = 40%</span>
                </div>
                <div className="font-serif text-4xl text-slate-900 leading-none">80%</div>
                <div className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider">You lose a slice</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  Fall short of 50% and your payout drops to match. At 40%, you get 80% of the held-back money back.
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">1,000 CKM patients → $168K released</span>
                </div>
              </div>

              {/* 20% — floor cap */}
              <div className="bg-white p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-red-600">OAR = 20%</span>
                </div>
                <div className="font-serif text-4xl text-slate-900 leading-none">50%</div>
                <div className="text-[11px] text-red-600 font-semibold uppercase tracking-wider">As low as it goes</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  Even in a bad year, you keep at least half of the held-back money. That's the floor.
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">1,000 CKM patients → $105K released</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-8 py-6 text-center">
              <p className="text-[15px] text-slate-600 leading-relaxed max-w-2xl mx-auto">
                <span className="text-slate-900 font-semibold">Getting past 50% is the difference between all your money and a cut of it.</span>{" "}
                Every patient who doesn't finish their check-ins counts against you.
              </p>
            </div>
          </div>
        </section>

        {/* ── Equity / Portal-Failure Evidence ──────────────────────────────── */}
        <section className="px-4 py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">Why voice-first</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
                Most Medicare patients won't use the portal
              </h2>
              <p className="text-slate-500 text-[16px] max-w-2xl mx-auto leading-relaxed">
                And if they don't check in, it counts as a miss. So the way you reach them sets a ceiling on your score before you even start. The research is clear on this, and it points to one answer: pick up the phone.
              </p>
            </div>

            {/* The channel evidence — the load-bearing argument */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden mb-12">
              {/* Passive portal alone — below OAT */}
              <div className="bg-white p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-red-600">Portal reminders only</span>
                </div>
                <div className="font-serif text-4xl text-slate-900 leading-none">45–52%</div>
                <div className="text-[11px] text-red-600 font-semibold uppercase tracking-wider">Below the 50% line</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  In a Medicare study, sending portal reminders and waiting got just 45 to 52% of patients to respond. That's not enough to clear the threshold.
                </p>
              </div>

              {/* + Active phone follow-up — clears the gate */}
              <div className="bg-white p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-emerald-600">Add phone calls</span>
                </div>
                <div className="font-serif text-4xl text-slate-900 leading-none">75–85%</div>
                <div className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider">Clears the line</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  Add a phone call on top and response jumps to 75 to 85%. Same patients, same portal. The only thing that changed was someone calling them.
                </p>
              </div>

              {/* The population reality — NPHA */}
              <div className="bg-white p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-amber-600">Older adults with a portal</span>
                </div>
                <div className="font-serif text-4xl text-slate-900 leading-none">~55%</div>
                <div className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider">Opened it last month</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  Even among older adults who have a portal, only about half had logged in that month. Many would rather just talk to someone on the phone.
                </p>
              </div>
            </div>

            {/* Honesty note — kept short */}
            <p className="text-[13px] text-slate-400 leading-relaxed text-center max-w-2xl mx-auto">
              Those numbers come from studies where people made the calls. Our own 85% is a{" "}
              <span className="text-slate-500 font-medium">goal we're working toward</span>, not a promise. We'd rather show you why phone outreach works than throw a number at you.
            </p>
          </div>
        </section>

        {/* ── What Hana Does ────────────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">What Hana does</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight">
                Built specifically for the ACCESS operational problem
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {[
                {
                  title: "Calls and texts your patients",
                  body: "Hana reaches every patient at the right time, in plain conversation. If someone doesn't answer, it tries again.",
                },
                {
                  title: "Runs the check-ins",
                  body: "Depression, anxiety, and pain questionnaires, plus blood pressure and weight. Asked like a real conversation, not a form to fill out.",
                },
                {
                  title: "Flags what matters",
                  body: "If a patient says something concerning or a number looks off, your team hears about it right away. They see the exceptions, not every call.",
                },
                {
                  title: "Sends CMS the data",
                  body: "Every result goes to CMS in the exact format they want. You don't have to build or manage any of that.",
                },
                {
                  title: "Times it to count",
                  body: "CMS only accepts readings inside tight windows. Hana schedules each call so the data lands when it counts, not a day too early or too late.",
                },
                {
                  title: "Works with your EHR",
                  body: "Connects to Athena, Charm, and most major systems. Hana reads the chart before every call so nothing is asked twice.",
                },
              ].map(({ title, body }) => (
                <div key={title} className="bg-white p-8">
                  <h3 className="font-semibold text-slate-900 text-[15px] mb-2">{title}</h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Follow-On Re-Consent ──────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">The easy one to hand off</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
                Every year, you have to get consent again
              </h2>
              <p className="text-slate-500 text-[16px] max-w-2xl mx-auto leading-relaxed">
                For each patient you keep, you have to ask them to re-up every twelve months. Miss the window and you can't bill that patient. It happens again next year, and the year after, for ten years.
              </p>
            </div>

            {/* The recurring obligation */}
            <div className="bg-white border border-slate-200 rounded-2xl px-8 py-7 mb-12">
              <p className="text-[15px] text-slate-600 leading-relaxed">
                You have a <span className="text-slate-900 font-semibold">60-day window</span> to get the patient's consent again, confirm they still need the care, and take a fresh reading if the old one's gone stale.{" "}
                <span className="text-slate-900 font-semibold">Miss it and you can't bill that patient that year.</span>{" "}
                It's easy to forget, and the cost of forgetting is a whole year of payments.
              </p>
            </div>

            {/* Why this is the strongest automation fit — 4 traits */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden mb-12">
              {[
                { label: "Every year", body: "It comes back every twelve months for every patient you keep. Not a one-off." },
                { label: "Hard deadline", body: "You have 60 days. Inside it you can bill. Outside it you can't." },
                { label: "Real money", body: "Miss it and you lose a full year of payments for that patient." },
                { label: "Nothing clinical", body: "It's consent, contact info, and a quick reading. No doctor needed." },
              ].map(({ label, body }) => (
                <div key={label} className="bg-white p-8 flex flex-col gap-3">
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-blue-600">{label}</span>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* What Hana does — one compact block */}
            <div className="bg-[#00122F] rounded-2xl p-8 md:p-10">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-400 mb-4">What Hana does</p>
              <p className="text-white text-[17px] leading-relaxed mb-4">
                Hana handles the whole thing with one call, on time.
              </p>
              <p className="text-slate-300 text-[15px] leading-relaxed">
                It calls inside the window, gets the consent, confirms the details, takes a fresh reading if needed, and writes it all back to the chart with a timestamp. Your team only sees the few patients who didn't pick up, with time to spare.
              </p>
            </div>
          </div>
        </section>

        {/* ── How the timing works ─────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">Timing matters</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
                A reading on the wrong day doesn't count
              </h2>
              <p className="text-slate-600 text-[16px] max-w-2xl mx-auto leading-relaxed">
                CMS only accepts data inside specific windows. A regular reminder app doesn't know that. Hana does, so every call lands when the reading actually counts toward your score.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              <div className="bg-white p-8">
                <div className="font-serif text-5xl text-slate-900 leading-none mb-3">15</div>
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-blue-600 mb-3">Days to submit a reading</p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Blood pressure, weight, and check-ins only count if sent within 15 days. Hana calls so the reading is fresh when it goes in.
                </p>
              </div>

              <div className="bg-white p-8">
                <div className="font-serif text-5xl text-slate-900 leading-none mb-3">60</div>
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-blue-600 mb-3">Days to get the first reading</p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  You have 60 days to get a patient's first reading, or they drop out of the program. Hana makes sure it happens in time.
                </p>
              </div>

              <div className="bg-white p-8">
                <div className="font-serif text-5xl text-slate-900 leading-none mb-3">1–2</div>
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-blue-600 mb-3">Years a lab result lasts</p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  Lab results count for one to two years, so they're on a different clock. Hana tracks each one separately instead of nagging everyone at once.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">Pricing</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
                We win when you win.
              </h2>
              <p className="text-slate-500 text-[16px] max-w-xl mx-auto leading-relaxed">
                You only pay the success fee when CMS pays you back the money they held for a year. It's the easiest check you'll write.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Base fee */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400 mb-4">Base fee</p>
                <div className="font-serif text-5xl text-slate-900 mb-2">$5</div>
                <div className="text-slate-500 text-sm mb-6">per patient / per month</div>
                <ul className="space-y-2">
                  {["All the calls and texts", "Every check-in, all tracks", "Timed to count with CMS", "Data sent to CMS for you", "Alerts when something's off"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Success fee */}
              <div className="bg-[#00122F] border border-white/10 rounded-2xl p-8 text-white">
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-blue-400 mb-4">Success fee</p>
                <div className="font-serif text-5xl text-white mb-2">+10%</div>
                <div className="text-slate-400 text-sm mb-6">of the held-back money CMS pays you back</div>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  You only pay this when CMS pays you back. If the money doesn't come back, neither does our fee.
                </p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <span className="text-[12px] text-blue-400 font-semibold">We both have skin in the game.</span>
                </div>
              </div>
            </div>

            {/* ROI calc */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10">
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-blue-600 mb-6">The math · CKM track, 1,000 patients</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {[
                    ["Monthly payment", "$35/mo × 1,000 = $35,000/mo"],
                    ["Paid over the year", "$420,000"],
                    ["Held back by CMS (50%)", "~$210,000"],
                    ["You hit the line → paid back", "$210,000"],
                    ["Hana success fee", "$21,000 (10%)"],
                    ["Hana base cost", "$5 × 1,000 × 12 = $60,000"],
                    ["Total Hana cost", "$81,000"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 text-[14px]">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-900 font-medium tabular-nums sm:text-right">{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between gap-4">
                    <span className="text-slate-900 font-semibold text-[14px]">Revenue protected</span>
                    <span className="text-slate-900 font-semibold text-[14px]">$210,000</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-8 text-center">
                  <div className="font-serif text-5xl sm:text-6xl md:text-[72px] text-blue-600 leading-none mb-2">2.6×</div>
                  <div className="text-[11px] font-bold tracking-[2px] uppercase text-blue-600 mb-3">Return</div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    Hana brings back $210K for $81K. And if you fall short of the line, say 40%, you'd get just $168K instead, leaving $42K on the table.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Calculator ───────────────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-[#00122F]" id="calculator">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-400 mb-4">ROI Calculator</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-3">
                Run the numbers for your cohort.
              </h2>
              <p className="text-slate-300 text-[15px]">
                Adjust your patient count, track, and response rate. See exactly what's at stake.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Inputs */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-8">

                {/* Patient count */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-300">Patients enrolled</label>
                    <span className="font-serif text-2xl text-white">{calcPatients.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={100} max={5000} step={50}
                    value={calcPatients}
                    onChange={e => setCalcPatients(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 ${((calcPatients - 100) / 4900) * 100}%, rgba(255,255,255,0.1) ${((calcPatients - 100) / 4900) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                    <span>100</span><span>5,000</span>
                  </div>
                </div>

                {/* Track */}
                <div>
                  <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-300 block mb-3">Track</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["eCKM", "CKM", "BH", "MSK"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setCalcTrack(t)}
                        className="py-2.5 rounded-xl text-[13px] font-semibold transition-all border"
                        style={calcTrack === t
                          ? { backgroundColor: "#3B82F6", color: "#fff", borderColor: "#3B82F6" }
                          : { backgroundColor: "transparent", color: "#cbd5e1", borderColor: "rgba(255,255,255,0.08)" }
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-2">
                    CMS pays ${OAP_RATES[calcTrack]}/patient/mo · Hana base fee ${BASE_FEES[calcTrack]}/patient/mo{calcTrack === "BH" ? " (more check-ins)" : ""}
                  </p>
                </div>

                {/* OAR slider — the key one */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-300">
                      Expected response rate
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-2xl text-white">{calcOAR}%</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={hitOAT
                          ? { color: "#10B981", backgroundColor: "rgba(16,185,129,0.15)" }
                          : { color: "#F59E0B", backgroundColor: "rgba(245,158,11,0.15)" }
                        }
                      >
                        {hitOAT ? "✓ Over the line" : "✗ Below the line"}
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={10} max={90} step={1}
                    value={calcOAR}
                    onChange={e => setCalcOAR(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${hitOAT ? "#10B981" : "#F59E0B"} ${((calcOAR - 10) / 80) * 100}%, rgba(255,255,255,0.1) ${((calcOAR - 10) / 80) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-[11px] mt-1.5">
                    <span className="text-slate-400">10%</span>
                    <span className="text-blue-400 font-semibold">← 50% line →</span>
                    <span className="text-slate-400">90%</span>
                  </div>
                </div>
              </div>

              {/* Outputs */}
              <div className="flex flex-col gap-4">

                {/* OAT status banner */}
                <div
                  className="rounded-2xl px-6 py-5 border transition-all"
                  style={hitOAT
                    ? { backgroundColor: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.25)" }
                    : { backgroundColor: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.25)" }
                  }
                >
                  <p className="text-[11px] font-bold tracking-[2px] uppercase mb-1" style={{ color: hitOAT ? "#10B981" : "#F59E0B" }}>
                    {hitOAT ? "You get all of it back" : "You get a cut of it back"}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: hitOAT ? "#6ee7b7" : "#fcd34d" }}>
                    {hitOAT
                      ? `At ${calcOAR}%, you're past the 50% line. CMS pays back the whole held-back amount.`
                      : `At ${calcOAR}%, you get ${Math.round(releaseFraction * 100)}% of it back. Drag to 50% to see the difference.`
                    }
                  </p>
                </div>

                {/* Key numbers */}
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 flex-1">
                  {[
                    ["Paid over the year", `$${annualOAP.toLocaleString()}`],
                    ["Held back by CMS (50%)", `$${withheld.toLocaleString()}`],
                    ["Paid back to you", `$${Math.round(released).toLocaleString()}`, hitOAT ? "#10B981" : "#F59E0B"],
                    ["Hana base cost", `$${hanaBase.toLocaleString()}`],
                    ["Hana success fee (10%)", `$${Math.round(hanaSuccess).toLocaleString()}`],
                    ["Total Hana cost", `$${Math.round(hanaTotal).toLocaleString()}`],
                  ].map(([label, value, color]) => (
                    <div key={String(label)} className="flex items-baseline justify-between gap-4">
                      <span className="text-[13px] text-slate-300">{label}</span>
                      <span className="text-[14px] font-semibold tabular-nums" style={{ color: color as string || "#f1f5f9" }}>{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/[0.07] pt-4 flex items-center justify-between">
                    <span className="text-[13px] text-white font-semibold">Revenue-to-cost ratio</span>
                    <span className="font-serif text-2xl" style={{ color: "#3B82F6" }}>{roi.toFixed(1)}×</span>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="https://calendly.com/matteowastaken/discoverycall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-semibold text-[14px] transition-all hover:-translate-y-0.5 group"
                >
                  Book a call to walk through your numbers
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Track Tabs ────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">By track</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight">
                What Hana handles per track
              </h2>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-10 w-fit mx-auto">
              {TRACKS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTrack(t.key)}
                  className="px-5 py-3 sm:py-2.5 rounded-lg text-[13px] font-semibold transition-all"
                  style={activeTrack === t.key
                    ? { backgroundColor: t.color, color: "#fff" }
                    : { color: "#64748b", backgroundColor: "transparent" }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Track content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-2xl text-slate-900">{track.label}</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">{track.subtitle} · OAP {track.oap}</p>
                <p className="text-[10px] font-bold tracking-[2px] uppercase mb-4" style={{ color: track.color }}>Required measures</p>
                <div className="space-y-3">
                  {track.measures.map(m => (
                    <div key={m.name} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: track.color }} />
                      <div>
                        <span className="text-[14px] font-semibold text-slate-900">{m.name}</span>
                        <span className="text-[13px] text-slate-400 ml-2">{m.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-7">
                <p className="text-[10px] font-bold tracking-[2px] uppercase mb-4" style={{ color: track.color }}>How Hana handles it</p>
                <p className="text-[15px] text-slate-600 leading-relaxed">{track.hana}</p>
                {track.whodas && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-bold tracking-[2px] uppercase text-emerald-600">WHODAS 2.0 · optional</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      A short check-in on daily function. It's optional for now, but CMS has hinted something like it is coming, so it's worth getting ahead of. Most older patients won't fill it out online. Hana just asks them over the phone, in plain language, and sends the results in for you.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Live Demo ────────────────────────────────────────────────────── */}
        <AccessDemoSection
          webCallStatus={webCallStatus}
          handleStartWebCall={handleStartWebCall}
          handleEndWebCall={handleEndWebCall}
        />

        {/* ── Roadmap ───────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">On the roadmap</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
                What we're building next
              </h2>
              <p className="text-slate-500 text-[16px] max-w-xl mx-auto leading-relaxed">
                These aren't live yet, and we won't pretend they are. Here's what's coming, and we're upfront about where it stops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden">
              {[
                {
                  title: "Care update drafts",
                  what: "Hana writes up the care update for you and gets the patient's okay to share it.",
                  not: "Your system still sends it. We write the draft, we don't move the data.",
                },
                {
                  title: "One call, two tracks",
                  what: "If a patient is in two programs, Hana covers both in a single call so they aren't bothered twice.",
                  not: "It makes the call simpler. It doesn't change what CMS pays.",
                },
                {
                  title: "Heads-up on outside care",
                  what: "If a patient mentions getting care elsewhere, Hana flags it early so your team can reach out.",
                  not: "It's a heads-up, not a fix. Patients are always free to go elsewhere.",
                },
              ].map(({ title, what, not }) => (
                <div key={title} className="bg-white p-8">
                  <div className="inline-flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-bold tracking-[2px] uppercase text-amber-600">Coming soon</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-[15px] mb-3">{title}</h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed mb-5">{what}</p>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400 mb-2">Where it stops</p>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{not}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-[13px] text-slate-400 leading-relaxed max-w-2xl mx-auto mt-10">
              None of this is live yet, and none of it changes what CMS pays. If another vendor tells you they can "fix" your numbers here, ask them to show you the rules.
            </p>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">FAQ</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight">
                Questions we get on every call
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-[15px] font-semibold text-slate-900">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 text-[14px] text-slate-500 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <section className="bg-[#00122F] px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-400 mb-4">July 5 is close</p>
              <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-4">
                Get set up before<br />the program starts.
              </h2>
              <p className="text-slate-400 text-[16px] max-w-xl mx-auto leading-relaxed mb-10">
                Twenty minutes. We'll show you what the calls sound like for your patients and walk through your numbers.
              </p>
              <a
                href="https://calendly.com/matteowastaken/discoverycall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-full font-semibold text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] group"
              >
                Book a 20-min call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* PDF lead capture */}
            <div className="border-t border-white/[0.07] pt-12 max-w-xl mx-auto text-center">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-slate-500 mb-3">Free one-pager</p>
              <p className="text-white font-semibold text-[15px] mb-2">ACCESS Pricing & ROI Calculator</p>
              <p className="text-slate-500 text-[13px] mb-6">The numbers for each track, with your patient count filled in.</p>
              {submitted ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-[14px] font-semibold py-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  Got it. We'll send it over shortly.
                </div>
              ) : (
                <form
                  onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-blue-500/60"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-white text-[#00122F] rounded-xl font-semibold text-[14px] hover:bg-slate-100 transition-colors shrink-0"
                  >
                    Send it
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

export default Access;
