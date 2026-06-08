import { useState } from "react";
import { ArrowRight, Mic, MicOff, ChevronDown, ChevronUp } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

// ─── Placeholder agent IDs — replace with real ElevenLabs agent IDs ───────────
const AGENTS = [
  {
    id: "access-advisor",
    name: "Ask about ACCESS",
    desc: "Ask anything about OAT mechanics, the 15-day window, WHODAS, pricing, or how Hana fits your track. Hana answers.",
    assistantId: "PLACEHOLDER_ACCESS_ADVISOR",
    color: "#3B82F6",
    tag: "Strategy & Mechanics",
  },
  {
    id: "whodas-demo",
    name: "Try the WHODAS agent",
    desc: "A live demo of the WHODAS 2.0 collection call Hana runs for BH-track patients. 36 items, conversational, ~20 minutes. Try a few questions.",
    assistantId: "PLACEHOLDER_WHODAS_AGENT",
    color: "#10B981",
    tag: "BH Track Demo",
  },
];

const TRACKS = [
  {
    key: "CKM",
    label: "CKM / eCKM",
    color: "#3B82F6",
    subtitle: "Cardiometabolic & kidney health",
    oap: "$35/patient/month",
    measures: [
      { name: "Blood pressure", note: "≤130/80 mmHg target" },
      { name: "Body weight", note: "BMI or % weight loss" },
      { name: "HbA1c", note: "Glycaemic control" },
      { name: "LDL-C", note: "Lipid management" },
      { name: "eGFR / uACR", note: "Kidney function" },
    ],
    hana: "AI voice + SMS reminders timed to the 15-day window. BP and weight check-ins. HbA1c and lab result follow-up. FHIR output ready for the ACCESS Data Reporting API.",
  },
  {
    key: "BH",
    label: "Behavioural Health",
    color: "#10B981",
    subtitle: "Mental health & substance use",
    oap: "$15/patient/month",
    measures: [
      { name: "PHQ-9", note: "Depression symptom score" },
      { name: "GAD-7", note: "Anxiety symptom score" },
      { name: "PGIC", note: "Patient global impression of change" },
      { name: "WHODAS 2.0", note: "36-item functional disability — the hard one" },
    ],
    hana: "Conversational PHQ-9, GAD-7, and PGIC collection. Full WHODAS 2.0 administration via AI voice — 36 items, plain language, domain scoring, FHIR output. Safety escalation built in.",
    whodas: true,
  },
  {
    key: "MSK",
    label: "Musculoskeletal",
    color: "#F59E0B",
    subtitle: "Orthopaedics & pain management",
    oap: "$20/patient/month",
    measures: [
      { name: "PROMIS Pain Interference", note: "Function & daily impact" },
      { name: "NRS Pain Score", note: "Numeric rating scale" },
      { name: "PGIC", note: "Patient global impression of change" },
    ],
    hana: "Weekly pain and function check-ins. PROMIS and NRS collection via voice or SMS. PGIC administered at the end of each measurement period. FHIR-ready output.",
  },
];

const FAQS = [
  {
    q: "Is this RPM?",
    a: "No. Hana is engagement infrastructure, not a remote monitoring device. You don't need to order devices or bill RPM codes. Hana handles the patient outreach, PROM collection, and data output — that's it.",
  },
  {
    q: "Do we need to change our EHR?",
    a: "No. Hana connects via FHIR or direct integration. If you're on Athena, Charm, or using Redox/Catagon, we're already compatible. If you have a custom stack, we build the connector.",
  },
  {
    q: "What if we miss OAT?",
    a: "The base fee ($3/patient/month) still applies — you've paid for a systematic engagement programme. The success fee doesn't trigger. We both have skin in the game, which is why we're incentivised to help you hit the threshold.",
  },
  {
    q: "Is your FHIR output compliant with the ACCESS Implementation Guide?",
    a: "Yes. We map all PROM outputs to the ACCESS IG FHIR profiles. BP, weight, HbA1c, PHQ-9, GAD-7, WHODAS 2.0 — all structured and ready for the CMS Data Reporting API.",
  },
  {
    q: "Can you handle multiple tracks?",
    a: "Yes. If your organisation enrolled across CKM and BH, Hana handles both tracks with the correct measure sets, timing logic, and FHIR mappings per patient.",
  },
  {
    q: "What's the WHODAS 2.0 completion rate you expect?",
    a: "We're targeting 70–80% completion on the first attempt, with multi-attempt logic for non-responders. The conversational format significantly outperforms portal-based self-completion — especially for Medicare patients.",
  },
];

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
  const [calcTrack, setCalcTrack] = useState<"CKM" | "BH" | "MSK">("CKM");
  const [calcOAR, setCalcOAR] = useState(55);

  const OAP_RATES: Record<string, number> = { CKM: 35, BH: 15, MSK: 20 };
  const BASE_FEES: Record<string, number> = { CKM: 3, BH: 4, MSK: 3 };
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
        title="CMS ACCESS Model — Patient Engagement Infrastructure"
        description="50% of your ACCESS OAP revenue is withheld by CMS. Getting it back depends on whether your patients responded. Hana makes that happen. $3/patient/month."
        path="/access"
      />

      <div className="min-h-screen bg-white">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="bg-[#00122F] text-white pt-32 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-xs font-semibold tracking-[3px] uppercase">CMS ACCESS Model · July 5 Launch</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.05] mb-6 max-w-3xl">
              50% of your ACCESS revenue is withheld.{" "}
              <span className="text-blue-400">Getting it back depends on whether your patients responded.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
              Hana is the engagement infrastructure ACCESS participants use to hit the Outcome Attainment Threshold — AI voice + SMS outreach, PROM collection within the 15-day window, FHIR-ready output. $3/patient/month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://calendly.com/matteowastaken/discoverycall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-full font-semibold text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] group"
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

        {/* ── OAT Mechanics ─────────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-[#010f26] px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-400 mb-4">The withheld pool</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-4">
                How the OAT penalty actually works
              </h2>
              <p className="text-slate-400 text-[16px] max-w-2xl mx-auto leading-relaxed">
                CMS holds back 50% of every Outcome-Aligned Payment for 12 months. At reconciliation, one test determines how much you get back.
              </p>
            </div>

            {/* Three-column OAT diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden mb-12">
              {/* ≥50% — full release */}
              <div className="bg-[#00122F] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-emerald-400">OAR ≥ 50%</span>
                </div>
                <div className="font-serif text-4xl text-white leading-none">100%</div>
                <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Full release</div>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  ≥50% of your patients completed all required measures. CMS releases the full withheld pool.
                </p>
                <div className="mt-auto pt-4 border-t border-white/[0.07]">
                  <span className="text-[11px] text-slate-500">1,000 CKM patients → $210K released</span>
                </div>
              </div>

              {/* 40% — proportional cut */}
              <div className="bg-[#00122F] p-8 flex flex-col gap-4 border-x border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-amber-400">OAR = 40%</span>
                </div>
                <div className="font-serif text-4xl text-white leading-none">80%</div>
                <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">Proportional cut</div>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  OAR ÷ OAT × withheld pool. 40 ÷ 50 = 80% released. You lose 20% of the withheld amount.
                </p>
                <div className="mt-auto pt-4 border-t border-white/[0.07]">
                  <span className="text-[11px] text-slate-500">1,000 CKM patients → $168K released</span>
                </div>
              </div>

              {/* 20% — floor cap */}
              <div className="bg-[#00122F] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-red-400">OAR = 20%</span>
                </div>
                <div className="font-serif text-4xl text-white leading-none">50%</div>
                <div className="text-[11px] text-red-400 font-semibold uppercase tracking-wider">Floor cap</div>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  CMS caps the maximum reduction at 50% — you always keep at least half of gross OAP regardless of performance.
                </p>
                <div className="mt-auto pt-4 border-t border-white/[0.07]">
                  <span className="text-[11px] text-slate-500">1,000 CKM patients → $105K released</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-8 py-6 text-center">
              <p className="text-[15px] text-slate-300 leading-relaxed max-w-2xl mx-auto">
                <span className="text-white font-semibold">Crossing 50% OAR isn't just better — it's the difference between full release and a haircut.</span>{" "}
                Every patient who doesn't complete their measures is a patient who doesn't count toward your OAR.
              </p>
            </div>
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
                  title: "AI voice + SMS outreach",
                  body: "Calls every patient at the right time in the 15-day validity window. Adapts channel, time, and tone per patient. Multi-attempt logic for non-responders.",
                },
                {
                  title: "PROM collection",
                  body: "PHQ-9, GAD-7, PGIC, WHODAS 2.0, PROMIS Pain Interference, NRS — all administered conversationally, not as forms.",
                },
                {
                  title: "Clinical escalation",
                  body: "Flags safety disclosures, worsening scores, and patients outside expected ranges immediately. Staff see exceptions, not the full call list.",
                },
                {
                  title: "FHIR-compliant output",
                  body: "All measure results mapped to the ACCESS Implementation Guide profiles, ready for the CMS Data Reporting API. You don't build the FHIR layer.",
                },
                {
                  title: "15-day window compliance",
                  body: "Scheduling logic built around the measurement period deadlines — not generic reminder timing. Every outreach is timed to count.",
                },
                {
                  title: "EHR integration",
                  body: "Direct integrations with Athena, Charm, and major EHRs. Or connect via Redox/Catagon to 95+ systems. Reads the chart before every call.",
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

        {/* ── Pricing ───────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-600 mb-4">Pricing</p>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
                We win when you win.
              </h2>
              <p className="text-slate-500 text-[16px] max-w-xl mx-auto leading-relaxed">
                The success fee hits at the exact moment CMS releases a pool you've been waiting 12 months for. It's the easiest cheque you write all year.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Base fee */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400 mb-4">Base fee</p>
                <div className="font-serif text-5xl text-slate-900 mb-2">$3</div>
                <div className="text-slate-500 text-sm mb-6">per patient / per month</div>
                <ul className="space-y-2">
                  {["All voice + SMS outreach", "PROM collection (all tracks)", "15-day window compliance logic", "FHIR-ready output", "Clinical escalation"].map(item => (
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
                <div className="text-slate-400 text-sm mb-6">of the withheld OAP pool released at OAT reconciliation</div>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  Only triggered when OAT is hit and CMS releases the withheld funds. If you don't get it back, we don't charge it.
                </p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <span className="text-[12px] text-blue-400 font-semibold">We both have skin in the game.</span>
                </div>
              </div>
            </div>

            {/* ROI calc */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10">
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-blue-600 mb-6">The math — CKM track, 1,000 patients</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {[
                    ["OAP revenue", "$35/mo × 1,000 = $35,000/mo"],
                    ["Annual OAP", "$420,000"],
                    ["CMS withheld (50%)", "~$210,000"],
                    ["OAT hit → released", "$210,000"],
                    ["Hana success fee", "$21,000 (10%)"],
                    ["Hana base cost", "$3 × 1,000 × 12 = $36,000"],
                    ["Total Hana cost", "$57,000"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 text-[14px]">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-900 font-medium tabular-nums">{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between gap-4">
                    <span className="text-slate-900 font-semibold text-[14px]">Revenue protected</span>
                    <span className="text-slate-900 font-semibold text-[14px]">$210,000</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-8 text-center">
                  <div className="font-serif text-[72px] text-blue-600 leading-none mb-2">3.7×</div>
                  <div className="text-[11px] font-bold tracking-[2px] uppercase text-blue-600 mb-3">ROI</div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    Missing OAT at 40% OAR → only $168K released instead of $210K. The $42K difference covers Hana's full annual cost.
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
              <p className="text-slate-500 text-[15px]">
                Adjust your patient count, track, and expected OAR. See exactly what's at stake.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Inputs */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-8">

                {/* Patient count */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400">Patients enrolled</label>
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
                  <div className="flex justify-between text-[11px] text-slate-600 mt-1.5">
                    <span>100</span><span>5,000</span>
                  </div>
                </div>

                {/* Track */}
                <div>
                  <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400 block mb-3">Track</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["CKM", "BH", "MSK"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setCalcTrack(t)}
                        className="py-2.5 rounded-xl text-[13px] font-semibold transition-all border"
                        style={calcTrack === t
                          ? { backgroundColor: "#3B82F6", color: "#fff", borderColor: "#3B82F6" }
                          : { backgroundColor: "transparent", color: "#94a3b8", borderColor: "rgba(255,255,255,0.08)" }
                        }
                      >
                        {t === "CKM" ? "CKM / eCKM" : t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2">
                    OAP rate: ${OAP_RATES[calcTrack]}/pt/mo · Base fee: ${BASE_FEES[calcTrack]}/pt/mo{calcTrack === "BH" ? " (WHODAS)" : ""}
                  </p>
                </div>

                {/* OAR slider — the key one */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-bold tracking-[2px] uppercase text-slate-400">
                      Expected OAR
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
                        {hitOAT ? "✓ OAT hit" : "✗ Below OAT"}
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
                    <span className="text-slate-600">10%</span>
                    <span className="text-blue-400 font-semibold">← OAT threshold: 50% →</span>
                    <span className="text-slate-600">90%</span>
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
                    {hitOAT ? "Full withheld pool released" : "Proportional reduction applies"}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: hitOAT ? "#6ee7b7" : "#fcd34d" }}>
                    {hitOAT
                      ? `OAR ${calcOAR}% ≥ 50% threshold — CMS releases 100% of your withheld pool.`
                      : `OAR ${calcOAR}% ÷ 50% OAT = ${Math.round(releaseFraction * 100)}% released. Drag to 50% to see the difference.`
                    }
                  </p>
                </div>

                {/* Key numbers */}
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 flex-1">
                  {[
                    ["Annual OAP revenue", `$${annualOAP.toLocaleString()}`],
                    ["CMS withheld (50%)", `$${withheld.toLocaleString()}`],
                    ["Released at reconciliation", `$${Math.round(released).toLocaleString()}`, hitOAT ? "#10B981" : "#F59E0B"],
                    ["Hana base cost", `$${hanaBase.toLocaleString()}`],
                    ["Hana success fee (10%)", `$${Math.round(hanaSuccess).toLocaleString()}`],
                    ["Total Hana cost", `$${Math.round(hanaTotal).toLocaleString()}`],
                  ].map(([label, value, color]) => (
                    <div key={String(label)} className="flex items-baseline justify-between gap-4">
                      <span className="text-[13px] text-slate-500">{label}</span>
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
                  className="px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all"
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
                      <span className="text-[11px] font-bold tracking-[2px] uppercase text-emerald-600">WHODAS 2.0</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      36 items. 6 domains. ~20 minutes. For a Medicare patient, completing WHODAS via a portal form has low completion rates. Hana administers it conversationally — plain language, patient pacing, domain grouping — and outputs FHIR-structured results. Try the demo agent below.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Live Agents ───────────────────────────────────────────────────── */}
        <section className="bg-[#010f26] px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-blue-400 mb-4">Try it now</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-3">
                Talk to Hana. Right now.
              </h2>
              <p className="text-slate-500 text-[15px]">No app. No login. Just click to call.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {AGENTS.map(agent => {
                const agentKey = `access-${agent.id}`;
                const isActive = activeAgentId === agentKey;
                const status = isActive ? webCallStatus : "idle";
                const isConnecting = status === "connecting";
                const isLive = status === "active";
                const isOtherActive = activeAgentId !== null && !isActive;

                return (
                  <div key={agent.id} className="rounded-2xl p-7 flex flex-col gap-5 border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.07] transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
                          <span className="text-[10px] font-bold tracking-[2px] uppercase" style={{ color: agent.color }}>{agent.tag}</span>
                        </div>
                        <h3 className="text-[16px] font-semibold text-white leading-tight">{agent.name}</h3>
                      </div>
                      {isLive && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full shrink-0" style={{ color: agent.color, backgroundColor: `${agent.color}20` }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-slate-400 leading-relaxed flex-1">{agent.desc}</p>
                    {isLive ? (
                      <button
                        onClick={handleEndWebCall}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[13px] font-semibold hover:bg-red-500/20 transition-colors"
                      >
                        <MicOff className="w-4 h-4" /> End call
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartWebCall(agentKey, agent.assistantId)}
                        disabled={isOtherActive || isConnecting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
                        style={
                          isOtherActive || isConnecting
                            ? { color: "#475569", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "transparent" }
                            : { color: agent.color, border: `1px solid ${agent.color}50`, backgroundColor: `${agent.color}12` }
                        }
                      >
                        <Mic className="w-4 h-4" />
                        {isConnecting ? "Connecting..." : "Start Web Call"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
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
                Get your OAT infrastructure<br />in place before launch.
              </h2>
              <p className="text-slate-400 text-[16px] max-w-xl mx-auto leading-relaxed mb-10">
                20 minutes. We'll show you exactly what the outreach looks like for your track, your patient population, and your timeline.
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
              <p className="text-slate-500 text-[13px] mb-6">The OAT math for CKM, BH, and MSK — with your patient count filled in.</p>
              {submitted ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-[14px] font-semibold py-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  Got it — we'll send it over shortly.
                </div>
              ) : (
                <form
                  onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }}
                  className="flex gap-2"
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
                    className="px-6 py-3 bg-white text-[#00122F] rounded-xl font-semibold text-[14px] hover:bg-slate-100 transition-colors shrink-0"
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
