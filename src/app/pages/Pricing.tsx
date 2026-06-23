import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO, faqSchema } from "../components/SEO";
import { cn } from "../../lib/utils";
import { useTranslations } from "../../lib/i18n";

/* Pricing FAQ — answer-first, citation-friendly for AI answer engines. */
const PRICING_FAQ = faqSchema([
  {
    question: "How much does Hana Voice AI cost?",
    answer:
      "Hana uses outcome-based pricing aligned with the savings it generates, rather than a fixed per-seat license. Pricing scales with the workflows you automate; the savings calculator estimates your cost and your savings versus human staffing for your specific practice. Contact Hana for an enterprise quote.",
  },
  {
    question: "Is Hana's pricing cheaper than hiring staff?",
    answer:
      "Hana is designed to cost less than the human staff time it replaces. Because it scales without call-center overhead or per-call staffing cost, practices typically save across every workflow they automate — the savings calculator shows the comparison for your patient volume.",
  },
  {
    question: "Is there a free trial or setup fee?",
    answer:
      "Hana deploys in about 3 weeks and is sold as infrastructure clinics build on. Reach out through the pricing page or book a demo to discuss a pilot, scope, and pricing for your organization.",
  },
]);

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRACTICE_TYPES = [
  { id: "surgical",     name: "Surgical / orthopaedic",      sub: "Hand, spine, orthopaedic, day surgery" },
  { id: "behavioural",  name: "Behavioural health",           sub: "ADHD, psychiatry, therapy, psychology" },
  { id: "primary",      name: "Primary care",                 sub: "GP, family medicine, general practice" },
  { id: "specialist",   name: "Specialist clinic",            sub: "Fertility, dermatology, ENT, pain" },
  { id: "polyclinic",   name: "Polyclinic / multi-specialty", sub: "Multiple departments, mixed population" },
  { id: "healthsystem", name: "Health system / FQHC",         sub: "Hospital network, community health" },
  { id: "palliative",   name: "Palliative / chronic care",    sub: "Long-term conditions, end-of-life" },
];

const MODULES = [
  { id: "comms",      name: "Patient communications", sub: "Inbound calls, scheduling, admin workflows" },
  { id: "outreach",   name: "Outreach",               sub: "Proactive campaigns, reactivation" },
  { id: "intake",     name: "Intake",                 sub: "New patients, assessments, procedures" },
  { id: "monitoring", name: "Monitoring",             sub: "Between-visit, adherence, chronic care" },
];

interface Workflow {
  mod: string;
  name: string;
  sub: string;
  hasVol: boolean;
  unit?: string;
  step?: number;
  min?: number;
  def?: number;
  hana?: number;
  curr?: number;
}

const WORKFLOWS: Record<string, Workflow> = {
  // Patient communications — flat fee per provider
  ci: { mod:"comms", name:"Inbound calls & scheduling",    sub:"Answer, route and book appointments",                    hasVol:false },
  ca: { mod:"comms", name:"After-hours coverage",           sub:"24/7 availability outside office hours",                 hasVol:false },
  cc: { mod:"comms", name:"Appointment confirmation",       sub:"Outbound reminders to reduce no-shows",                  hasVol:false },
  cr: { mod:"comms", name:"Appointment recovery",           sub:"Fill cancelled slots, protect revenue",                  hasVol:false },
  cw: { mod:"comms", name:"Warm transfer",                  sub:"Context-aware handoff to human agent",                   hasVol:false },
  cv: { mod:"comms", name:"Insurance verification",         sub:"Eligibility checks, authorisation calls",                hasVol:false },
  cp: { mod:"comms", name:"Prescription refill requests",   sub:"Process refills 24/7, submit to EHR",                   hasVol:false },
  cm: { mod:"comms", name:"Medical records requests",       sub:"Handle records queries and delivery",                    hasVol:false },
  // Outreach — per completed outcome
  or: { mod:"outreach", name:"Patient reactivation",        sub:"Rebook dormant patients who haven't been seen",          hasVol:true, unit:"patients to contact",  step:25, min:25,  def:100, hana:20,  curr:80  },
  oc: { mod:"outreach", name:"Recall campaigns",            sub:"Annual reviews, condition-specific recalls",             hasVol:true, unit:"patients per campaign", step:25, min:25,  def:75,  hana:15,  curr:45  },
  oe: { mod:"outreach", name:"Education & screening",       sub:"Population health and awareness campaigns",              hasVol:true, unit:"patients per campaign", step:50, min:50,  def:100, hana:6,   curr:18  },
  // Intake — per completed episode
  is: { mod:"intake", name:"Standard new patient intake",   sub:"Demographics, insurance, reason for visit",              hasVol:true, unit:"intakes/month",         step:10, min:10,  def:30,  hana:20,  curr:60  },
  ib: { mod:"intake", name:"Behavioural health intake",     sub:"Mental health history, presenting concerns",             hasVol:true, unit:"intakes/month",         step:5,  min:5,   def:20,  hana:30,  curr:80  },
  ic: { mod:"intake", name:"Clinical assessment",           sub:"ADHD, structured multi-source assessment",               hasVol:true, unit:"assessments/month",     step:5,  min:5,   def:15,  hana:40,  curr:160 },
  ip: { mod:"intake", name:"Psychiatric assessment",        sub:"Full psychiatric evaluation intake",                     hasVol:true, unit:"assessments/month",     step:5,  min:5,   def:10,  hana:50,  curr:180 },
  ix: { mod:"intake", name:"Pre-op preparation call",       sub:"Confirm, instruct, flag concerns before surgery",        hasVol:true, unit:"patients/month",        step:10, min:10,  def:40,  hana:13,  curr:38  },
  iy: { mod:"intake", name:"Post-op follow-up call",        sub:"Protocol-based recovery check-in after procedure",       hasVol:true, unit:"patients/month",        step:10, min:10,  def:40,  hana:13,  curr:38  },
  im: { mod:"intake", name:"Therapist matching",            sub:"Profile-based clinician assignment at intake",           hasVol:true, unit:"patients/month",        step:5,  min:5,   def:15,  hana:25,  curr:75  },
  // Monitoring — per active patient per month
  mv: { mod:"monitoring", name:"Between-visit check-ins",   sub:"Regular scheduled patient contact",                      hasVol:true, unit:"active patients",       step:25, min:25,  def:80,  hana:5,   curr:20  },
  ma: { mod:"monitoring", name:"Medication adherence",      sub:"Tracking whether patients take their medication",         hasVol:true, unit:"active patients",       step:25, min:25,  def:60,  hana:4,   curr:18  },
  mt: { mod:"monitoring", name:"Treatment adherence",       sub:"Are patients following their care plan?",                hasVol:true, unit:"active patients",       step:25, min:25,  def:60,  hana:4,   curr:18  },
  mc: { mod:"monitoring", name:"Chronic disease management",sub:"Diabetes, COPD, hypertension follow-up",                 hasVol:true, unit:"active patients",       step:25, min:25,  def:80,  hana:5,   curr:22  },
  md: { mod:"monitoring", name:"Post-discharge follow-up",  sub:"Hospital or surgery discharge protocol",                 hasVol:true, unit:"active patients",       step:25, min:25,  def:50,  hana:5,   curr:20  },
};

const PT_WF: Record<string, string[]> = {
  surgical:    ["ci","ca","cc","cr","cw","cv","cm","or","oc","ix","iy","md","ma"],
  behavioural: ["ci","ca","cc","cw","cv","cp","or","oc","ib","ic","ma","mt","mv"],
  primary:     ["ci","ca","cc","cr","cw","cv","cp","cm","or","oc","oe","is","mc","ma","mv"],
  specialist:  ["ci","ca","cc","cv","oc","is","mt","mv"],
  polyclinic:  ["ci","ca","cc","cr","cw","cv","cp","cm","or","oc","oe","is","ib","ic","ix","iy","mv","ma","mt","mc","md"],
  healthsystem:["ci","ca","cc","cr","cw","cv","cp","cm","or","oc","oe","is","ic","mc","ma","mv","md"],
  palliative:  ["ci","ca","cw","oe","is","mv","ma","mt","mc","md"],
};

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

function calcResults(providers: number, mods: Record<string, boolean>, wfs: Record<string, boolean>, vols: Record<string, number>) {
  let hana = 0, human = 0;
  const rows: { label: string; hana: number; curr: number }[] = [];

  const hasComms = Object.keys(wfs).some(id => wfs[id] && WORKFLOWS[id]?.mod === "comms");
  if (hasComms && mods["comms"]) {
    const h = providers * 150, c = providers * 300;
    hana += h; human += c;
    rows.push({ label: `Patient communications (${providers} provider${providers > 1 ? "s" : ""})`, hana: h, curr: c });
  }

  MODULES.forEach(m => {
    if (!mods[m.id] || m.id === "comms") return;
    Object.keys(WORKFLOWS).forEach(id => {
      const w = WORKFLOWS[id];
      if (!wfs[id] || w.mod !== m.id || !w.hasVol) return;
      const v = vols[id] ?? w.def ?? 0;
      const h = v * (w.hana ?? 0), c = v * (w.curr ?? 0);
      hana += h; human += c;
      rows.push({ label: `${w.name} (${v})`, hana: h, curr: c });
    });
  });

  const saving = human - hana;
  const pct = human > 0 ? Math.round((saving / human) * 100) : 0;
  return { hana, human, saving, pct, annual: saving * 12, rows };
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  { q: "Where do these estimates come from?", a: "Our benchmarks come from real clinical workflows across 100+ practices in Ireland, the UK, Italy, and the US. Human staff costs reflect average coordinator and nurse hourly rates for each task type. We confirm exact projections on the discovery call." },
  { q: "How does billing actually work?", a: "You start on a paid pilot at $150 per provider per month — everything included, no contract. After 90 days we review the outcomes together and move to outcome-based pricing: you pay per completed intake, recovered appointment, or monitored patient. Never for attempts that don't complete." },
  { q: "Is there a setup fee or contract?", a: "No setup fee. No minimum contract. The pilot is month-to-month. If HANA doesn't deliver the results we projected, you don't move to outcome pricing and you owe nothing beyond the pilot fee." },
  { q: "Do you work with our EHR?", a: "We integrate with 150+ EHR systems including Epic, Cerner, athenahealth, eClinicalWorks, and most systems used in Ireland, the UK, and Europe. Bi-directional read and write-back included on all plans." },
  { q: "What does the 90-day pilot include?", a: "Full EHR integration, workflows built to your specs, clinical safety layer configured, and all flows running. You get a complete outcomes report at day 90 showing exactly what HANA delivered before we discuss any ongoing contract." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center gap-4 text-left">
        <span className="text-sm font-medium text-slate-800">{q}</span>
        <span className={cn("flex-shrink-0 transition-transform duration-200", open && "rotate-45")}>
          <Plus className="w-4 h-4 text-slate-400" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pt-3 text-sm text-slate-500 leading-relaxed font-light">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Slide 1: Practice type ────────────────────────────────────────────────────

function SlideTypeSelect({ value, onChange, onNext, nextLabel }: {
  value: string | null;
  onChange: (v: string) => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div className="w-full max-w-[600px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">1 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">What kind of practice are you?</h2>
      <p className="text-sm text-slate-600 font-light mb-8 leading-relaxed text-center">This pre-selects the most relevant workflows for your setting.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
        {PRACTICE_TYPES.map(pt => (
          <button key={pt.id} onClick={() => onChange(pt.id)}
            className={cn("text-left p-4 rounded-xl border transition-all duration-150",
              value === pt.id ? "border-2 border-blue-500 bg-blue-50" : "border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:-translate-y-0.5"
            )}>
            <div className="text-sm font-medium text-slate-800 mb-1">{pt.name}</div>
            <div className="text-xs text-slate-400 font-light leading-snug">{pt.sub}</div>
          </button>
        ))}
      </div>
      <button onClick={onNext} disabled={!value}
        className="w-full bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-default">
        {nextLabel} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Slide 2: Providers ───────────────────────────────────────────────────────

function SlideProviders({ value, onChange, onNext, onBack, nextLabel, backLabel }: {
  value: number; onChange: (v: number) => void; onNext: () => void; onBack: () => void; nextLabel: string; backLabel: string;
}) {
  return (
    <div className="w-full max-w-[560px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">2 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">How many providers do you have?</h2>
      <p className="text-sm text-slate-600 font-light mb-10 leading-relaxed text-center">Count all clinicians who see patients — doctors, nurses, therapists, PAs.</p>
      <div className="flex items-center justify-center gap-8 mb-3">
        <button onClick={() => onChange(Math.max(1, value - 1))} className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors">
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-['Instrument_Serif'] text-5xl sm:text-6xl font-medium text-slate-900 min-w-[80px] text-center">{value}</span>
        <button onClick={() => onChange(Math.min(50, value + 1))} className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-sm text-slate-400 font-light mb-10">provider{value > 1 ? "s" : ""}</p>
      <div className="flex gap-3">
        <button onClick={onBack} className="border border-slate-200 rounded-lg px-5 py-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors">{backLabel}</button>
        <button onClick={onNext} className="flex-1 bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Slide 3: Modules ─────────────────────────────────────────────────────────

function SlideMods({ mods, wfs, onChange, onNext, onBack, nextLabel, backLabel }: {
  mods: Record<string, boolean>;
  wfs: Record<string, boolean>;
  onChange: (id: string, checked: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  nextLabel: string;
  backLabel: string;
}) {
  const anyMod = Object.values(mods).some(Boolean);
  return (
    <div className="w-full max-w-[560px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">3 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">Which modules do you want?</h2>
      <p className="text-sm text-slate-600 font-light mb-8 leading-relaxed text-center">Select the categories relevant to your practice.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
        {MODULES.map(m => {
          const sel = !!mods[m.id];
          const cnt = Object.keys(WORKFLOWS).filter(w => WORKFLOWS[w].mod === m.id && wfs[w]).length;
          return (
            <button key={m.id} onClick={() => onChange(m.id, !sel)}
              className={cn("text-left p-4 rounded-xl border transition-all duration-150",
                sel ? "border-2 border-blue-500 bg-blue-50" : "border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50"
              )}>
              <div className="flex items-center gap-2 mb-1">
                <div className={cn("w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all",
                  sel ? "bg-blue-500 border-blue-500" : "border-slate-300")}>
                  {sel && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm font-medium text-slate-800">{m.name}</span>
              </div>
              <div className="text-xs text-slate-400 font-light leading-snug mb-2">{m.sub}</div>
              {sel && cnt > 0 && (
                <div className="text-[10px] bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 inline-block font-medium">
                  {cnt} workflow{cnt > 1 ? "s" : ""} selected
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="border border-slate-200 rounded-lg px-5 py-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors">{backLabel}</button>
        <button onClick={onNext} disabled={!anyMod}
          className="flex-1 bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-default">
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Slide 4: Workflows ───────────────────────────────────────────────────────

function SlideWorkflows({ mods, wfs, onChange, onNext, onBack, nextLabel, backLabel }: {
  mods: Record<string, boolean>;
  wfs: Record<string, boolean>;
  onChange: (id: string, checked: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  nextLabel: string;
  backLabel: string;
}) {
  const [openMods, setOpenMods] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    MODULES.forEach(m => { init[m.id] = !!mods[m.id]; });
    return init;
  });

  const toggleMod = (id: string) => setOpenMods(prev => ({ ...prev, [id]: !prev[id] }));
  const anyWF = Object.values(wfs).some(Boolean);
  const activeMods = MODULES.filter(m => mods[m.id]);

  return (
    <div className="w-full max-w-[600px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">4 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">Select your workflows</h2>
      <p className="text-sm text-slate-600 font-light mb-8 leading-relaxed text-center">Select the workflows you want to automate. Toggle any on or off.</p>

      <div className="mb-8 space-y-2">
        {activeMods.map(m => {
          const wfsInMod = Object.keys(WORKFLOWS).filter(id => WORKFLOWS[id].mod === m.id);
          const selCount = wfsInMod.filter(id => wfs[id]).length;
          const isOpen = openMods[m.id];
          return (
            <div key={m.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button onClick={() => toggleMod(m.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors">
                <span className="text-sm font-medium text-slate-800">{m.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-blue-100 text-blue-600 rounded-full px-2.5 py-0.5 font-medium">{selCount} selected</span>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-slate-100">
                  {wfsInMod.map(id => {
                    const w = WORKFLOWS[id];
                    const sel = !!wfs[id];
                    return (
                      <button key={id} onClick={() => onChange(id, !sel)}
                        className={cn("w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-100 last:border-0 transition-colors",
                          sel ? "bg-blue-50" : "hover:bg-slate-50")}>
                        <div className={cn("w-4 h-4 rounded-sm border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                          sel ? "bg-blue-500 border-blue-500" : "border-slate-300")}>
                          {sel && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-800">{w.name}</div>
                          <div className="text-xs text-slate-400 font-light leading-snug mt-0.5">{w.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="border border-slate-200 rounded-lg px-5 py-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors">{backLabel}</button>
        <button onClick={onNext} disabled={!anyWF}
          className="flex-1 bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-default">
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Slide 5: Volumes ─────────────────────────────────────────────────────────

function SlideVolumes({ mods, wfs, vols, onChange, onNext, onBack, nextLabel, backLabel }: {
  mods: Record<string, boolean>;
  wfs: Record<string, boolean>;
  vols: Record<string, number>;
  onChange: (id: string, v: number) => void;
  onNext: () => void;
  onBack: () => void;
  nextLabel: string;
  backLabel: string;
}) {
  let hasAny = false;
  return (
    <div className="w-full max-w-[560px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">5 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">Roughly how many per month?</h2>
      <p className="text-sm text-slate-600 font-light mb-8 leading-relaxed text-center">Estimates are fine. We confirm exact numbers on the discovery call.</p>

      <div className="mb-8">
        {MODULES.map(m => {
          if (!mods[m.id]) return null;
          const wfsWithVol = Object.keys(WORKFLOWS).filter(id => WORKFLOWS[id].mod === m.id && WORKFLOWS[id].hasVol && wfs[id]);
          if (wfsWithVol.length === 0) return null;
          hasAny = true;
          return (
            <div key={m.id} className="mb-5">
              <div className="text-[10px] tracking-[1.5px] uppercase text-slate-400 font-medium mb-2 pb-1.5 border-b border-slate-100">{m.name}</div>
              {wfsWithVol.map(id => {
                const w = WORKFLOWS[id];
                const val = vols[id] ?? w.def ?? 0;
                return (
                  <div key={id} className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
                    <div className="flex-1">
                      <div className="text-sm text-slate-700">{w.name}</div>
                      <div className="text-xs text-slate-400 font-light">{w.unit}</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button onClick={() => onChange(id, Math.max(w.min ?? 0, val - (w.step ?? 1)))}
                        className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={val}
                        min={w.min ?? 0}
                        onChange={e => {
                          const n = parseInt(e.target.value, 10);
                          if (!isNaN(n) && n >= (w.min ?? 0)) onChange(id, n);
                        }}
                        className="font-['Instrument_Serif'] text-xl font-medium text-slate-900 w-16 text-center border border-slate-200 rounded-lg py-1 focus:outline-none focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button onClick={() => onChange(id, val + (w.step ?? 1))}
                        className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        {!hasAny && (
          <p className="text-center text-sm text-slate-400 italic py-8">Only flat-fee workflows selected — no volume inputs needed.</p>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="border border-slate-200 rounded-lg px-5 py-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors">{backLabel}</button>
        <button onClick={onNext}
          className="flex-1 bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Result ───────────────────────────────────────────────────────────────────

function SlideResult({ providers, mods, wfs, vols, onBack, bookCallLabel, backToVolumesLabel }: {
  providers: number;
  mods: Record<string, boolean>;
  wfs: Record<string, boolean>;
  vols: Record<string, number>;
  onBack: () => void;
  bookCallLabel: string;
  backToVolumesLabel: string;
}) {
  const { hana, human, saving, pct, annual, rows } = calcResults(providers, mods, wfs, vols);
  return (
    <div className="w-full max-w-[640px]">
      <div className="text-center mb-6 pb-6 border-b border-slate-200">
        <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-1">Your estimated monthly saving</div>
        <div className="font-['Instrument_Serif'] text-5xl sm:text-6xl font-medium text-blue-500">{fmt(saving)}</div>
        <div className="text-sm text-slate-400 mt-1 font-light">{pct}% less than your current practice cost for the same tasks</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[{ val: fmt(hana), label: "HANA / month" }, { val: fmt(human), label: "Current practice cost" }, { val: fmt(annual), label: "Annual saving" }].map(m => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <div className="font-['Instrument_Serif'] text-xl font-medium text-slate-900">{m.val}</div>
            <div className="text-xs text-slate-400 mt-1 font-light">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200 mb-5">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#00122F] text-slate-300">
              <th className="text-left px-2.5 sm:px-4 py-3 text-[10px] tracking-[1.5px] uppercase font-normal">Workflow</th>
              <th className="text-right px-2.5 sm:px-4 py-3 text-[10px] tracking-[1.5px] uppercase font-normal">HANA</th>
              <th className="text-right px-2.5 sm:px-4 py-3 text-[10px] tracking-[1.5px] uppercase font-normal">Current cost</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="px-2.5 sm:px-4 py-3 text-slate-600 font-light">{r.label}</td>
                <td className="px-2.5 sm:px-4 py-3 text-right text-blue-600 font-medium">{fmt(r.hana)}</td>
                <td className="px-2.5 sm:px-4 py-3 text-right text-slate-400 line-through">{fmt(r.curr)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-200">
              <td className="px-2.5 sm:px-4 py-3 font-medium text-slate-900">Monthly total</td>
              <td className="px-2.5 sm:px-4 py-3 text-right font-medium text-blue-600">{fmt(hana)}</td>
              <td className="px-2.5 sm:px-4 py-3 text-right font-medium text-slate-900">{fmt(human)}</td>
            </tr>
            <tr>
              <td className="px-2.5 sm:px-4 py-3 font-medium text-emerald-700">You save</td>
              <td className="px-2.5 sm:px-4 py-3 text-right font-medium text-emerald-700" colSpan={2}>{fmt(saving)} / month ({pct}%)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#00122F] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-white font-medium text-sm mb-1">Ready to confirm your numbers?</p>
          <p className="text-slate-400 text-xs font-light leading-relaxed">Book a 20-minute call. We'll calculate your exact projection using your actual workflows before any commitment.</p>
        </div>
        <a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer"
          className="flex-shrink-0 bg-blue-500 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap">
          {bookCallLabel}
        </a>
      </div>

      <div className="text-center mt-4">
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 mx-auto">
          <ArrowLeft className="w-3 h-3" /> {backToVolumesLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const TOTAL_SLIDES = 6; // 5 steps + result

export function Pricing() {
  const t = useTranslations();
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [practiceType, setPracticeType] = useState<string | null>(null);
  const [providers, setProviders] = useState(3);
  const [mods, setMods] = useState<Record<string, boolean>>({});
  const [wfs, setWfs] = useState<Record<string, boolean>>({});
  const [vols, setVols] = useState<Record<string, number>>(() => {
    const v: Record<string, number> = {};
    Object.keys(WORKFLOWS).forEach(id => { if (WORKFLOWS[id].hasVol) v[id] = WORKFLOWS[id].def ?? 0; });
    return v;
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const selectPracticeType = (id: string) => {
    setPracticeType(id);
    setMods({});
    setWfs({});
  };

  const toggleMod = (id: string, checked: boolean) => {
    setMods(prev => ({ ...prev, [id]: checked }));
    if (!checked) {
      setWfs(prev => {
        const next = { ...prev };
        Object.keys(WORKFLOWS).forEach(w => { if (WORKFLOWS[w].mod === id) next[w] = false; });
        return next;
      });
    }
  };

  const toggleWf = (id: string, checked: boolean) => {
    setWfs(prev => ({ ...prev, [id]: checked }));
  };

  const goNext = () => { setDirection(1); setSlide(s => s + 1); };
  const goBack = () => { setDirection(-1); setSlide(s => s - 1); };

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? 60 : -60, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit:  (d: number) => ({ y: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const slides = [
    <SlideTypeSelect   key="type"       value={practiceType}  onChange={selectPracticeType}  onNext={goNext} nextLabel={t.pricing.next} />,
    <SlideProviders    key="providers"  value={providers}     onChange={setProviders}         onNext={goNext} onBack={goBack} nextLabel={t.pricing.next} backLabel={t.pricing.back} />,
    <SlideMods         key="mods"       mods={mods}           wfs={wfs}                       onChange={toggleMod}  onNext={goNext} onBack={goBack} nextLabel={t.pricing.next} backLabel={t.pricing.back} />,
    <SlideWorkflows    key="workflows"  mods={mods}           wfs={wfs}                       onChange={toggleWf}   onNext={goNext} onBack={goBack} nextLabel={t.pricing.next} backLabel={t.pricing.back} />,
    <SlideVolumes      key="volumes"    mods={mods}           wfs={wfs}   vols={vols}          onChange={(id, v) => setVols(prev => ({ ...prev, [id]: v }))} onNext={goNext} onBack={goBack} nextLabel={t.pricing.seeEstimate} backLabel={t.pricing.back} />,
    <SlideResult       key="result"     providers={providers} mods={mods} wfs={wfs} vols={vols} onBack={goBack} bookCallLabel={t.pricing.bookCall} backToVolumesLabel={t.pricing.backToVolumes} />,
  ];

  return (
    <>
      <SEO
        title={t.pricing.seoTitle}
        description={t.pricing.seoDescription}
        path="/pricing"
        useExactTitle
        jsonLd={PRICING_FAQ}
      />

      {/* Hero */}
      <section className="pt-36 pb-10 px-4 text-center max-w-2xl mx-auto">
        <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-4">{t.pricing.heading}</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-normal text-slate-900 leading-[1.1] mb-4">
          {t.pricing.subheading}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-light max-w-md mx-auto">
          Answer a few questions about your practice. We'll show you exactly what HANA costs — and what you save across every workflow you automate.
        </p>
      </section>

      {/* Progress bar */}
      <div className="pb-4 flex justify-center gap-1.5">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <div key={i} className={cn("h-0.5 w-8 rounded-full transition-all duration-300",
            i < slide ? "bg-blue-500" : i === slide ? "bg-blue-400/50" : "bg-slate-200"
          )} />
        ))}
      </div>

      {/* Slide area */}
      <div className="min-h-[70vh] flex items-start justify-center px-4 py-8 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full flex justify-center"
          >
            {slides[slide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FAQ */}
      <section className="max-w-xl mx-auto px-4 pb-20">
        <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium text-center mb-2">{t.pricing.commonQuestions}</div>
        <h2 className="font-['Instrument_Serif'] text-2xl md:text-3xl text-slate-900 text-center mb-8">How does this work?</h2>
        {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
      </section>

      <Footer />
    </>
  );
}
