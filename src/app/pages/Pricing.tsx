import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { cn } from "../../lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRACTICE_TYPES = [
  { id: "surgical",     title: "Surgical / orthopaedic", sub: "Pre-op, post-op, recovery care" },
  { id: "behavioural",  title: "Behavioural health",     sub: "ADHD, therapy, psychiatry" },
  { id: "primary",      title: "Primary care",           sub: "General practice, family medicine" },
  { id: "other",        title: "Other specialty",        sub: "Fertility, palliative, dermatology" },
];

const WORKFLOWS = [
  { id: "preop",         title: "Pre-op and post-op calls",  sub: "Confirm before surgery, follow up after" },
  { id: "adhd",          title: "Clinical intakes",          sub: "ADHD, therapy, structured assessments" },
  { id: "receptionist",  title: "AI receptionist",           sub: "Inbound calls, scheduling, after-hours" },
  { id: "monitoring",    title: "Patient monitoring",        sub: "Between-visit check-ins, adherence" },
  { id: "outreach",      title: "Outreach campaigns",        sub: "Recalls, reactivations, reminders" },
  { id: "appts",         title: "Appointment recovery",      sub: "Fill cancellations, reduce no-shows" },
];

const VOL_CONFIG: Record<string, { label: string; step: number; min: number; max: number; default: number }> = {
  preop:        { label: "Pre/post-op patients per month",    step: 5,  min: 10,  max: 400,  default: 60  },
  adhd:         { label: "Clinical intakes per month",        step: 5,  min: 5,   max: 200,  default: 20  },
  receptionist: { label: "Inbound calls per week",            step: 10, min: 20,  max: 500,  default: 80  },
  monitoring:   { label: "Patients monitored monthly",        step: 10, min: 10,  max: 1000, default: 80  },
  outreach:     { label: "Patients per campaign",             step: 50, min: 50,  max: 2000, default: 200 },
  appts:        { label: "Cancellations to recover / month",  step: 5,  min: 5,   max: 200,  default: 25  },
};

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

function calcResults(providers: number, workflows: string[], volumes: Record<string, number>) {
  let hana = providers * 150;
  let human = providers * 300;
  const rows: [string, string, string][] = [
    [`Platform access (${providers} provider${providers > 1 ? "s" : ""})`, fmt(providers * 150), fmt(providers * 300)],
  ];

  workflows.forEach((id) => {
    const v = volumes[id] ?? VOL_CONFIG[id]?.default ?? 0;
    if (id === "preop")        { hana += v * 13;              human += v * 38;              rows.push([`Pre/post-op calls (${v} pts)`,      fmt(v * 13),              fmt(v * 38)]);              }
    if (id === "adhd")         { hana += v * 40;              human += v * 160;             rows.push([`Clinical intakes (${v})`,           fmt(v * 40),              fmt(v * 160)]);             }
    if (id === "receptionist") { hana += providers * 150;     human += providers * 600;     rows.push([`Receptionist`,                     fmt(providers * 150),     fmt(providers * 600)]);     }
    if (id === "monitoring")   { hana += v * 5;               human += v * 20;              rows.push([`Patient monitoring (${v})`,         fmt(v * 5),               fmt(v * 20)]);              }
    if (id === "outreach")     { hana += Math.round(v * 0.4); human += Math.round(v * 3);   rows.push([`Outreach campaigns`,               fmt(Math.round(v * 0.4)), fmt(Math.round(v * 3))]);   }
    if (id === "appts")        { hana += v * 10;              human += v * 32;              rows.push([`Appointment recovery (${v})`,       fmt(v * 10),              fmt(v * 32)]);              }
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center gap-4 text-left group"
      >
        <span className="text-sm font-medium text-slate-800">{q}</span>
        <span className={cn("flex-shrink-0 transition-transform duration-200", open && "rotate-45")}>
          <Plus className="w-4 h-4 text-slate-400" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm text-slate-500 leading-relaxed font-light">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Wizard slides ─────────────────────────────────────────────────────────────

function SlideTypeSelect({ value, onChange, onNext }: {
  value: string | null;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-[560px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">1 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">What kind of practice are you?</h2>
      <p className="text-sm text-slate-500 font-light mb-8 leading-relaxed text-center">This helps us show you the most relevant outcome benchmarks.</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {PRACTICE_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "text-left p-5 rounded-xl border transition-all duration-150",
              value === t.id
                ? "border-2 border-blue-500 bg-blue-50"
                : "border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:-translate-y-0.5"
            )}
          >
            <div className="text-sm font-medium text-slate-800 mb-1">{t.title}</div>
            <div className="text-xs text-slate-400 font-light leading-snug">{t.sub}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-default"
      >
        Next <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function SlideProviders({ value, onChange, onNext, onBack }: {
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="w-full max-w-[560px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">2 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">How many providers do you have?</h2>
      <p className="text-sm text-slate-500 font-light mb-10 leading-relaxed text-center">Count all clinicians who see patients — doctors, nurses, therapists.</p>
      <div className="flex items-center justify-center gap-8 mb-3">
        <button onClick={() => onChange(Math.max(1, value - 1))} className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors">
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-['Instrument_Serif'] text-6xl font-medium text-slate-900 min-w-[80px] text-center">{value}</span>
        <button onClick={() => onChange(Math.min(50, value + 1))} className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-sm text-slate-400 font-light mb-10">provider{value > 1 ? "s" : ""}</p>
      <div className="flex gap-3">
        <button onClick={onBack} className="border border-slate-200 rounded-lg px-5 py-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors">Back</button>
        <button onClick={onNext} className="bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors">
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SlideWorkflows({ value, onChange, onNext, onBack }: {
  value: string[];
  onChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };
  return (
    <div className="w-full max-w-[560px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">3 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">What do you want HANA to do?</h2>
      <p className="text-sm text-slate-500 font-light mb-8 leading-relaxed text-center">Select everything that applies. We'll calculate the saving for each.</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {WORKFLOWS.map((w) => {
          const sel = value.includes(w.id);
          return (
            <button
              key={w.id}
              onClick={() => toggle(w.id)}
              className={cn(
                "text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3",
                sel ? "border-2 border-blue-500 bg-blue-50" : "border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50"
              )}
            >
              <div className={cn(
                "w-[18px] h-[18px] rounded-[4px] border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                sel ? "bg-blue-500 border-blue-500" : "border-slate-300"
              )}>
                {sel && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <div>
                <div className="text-xs font-medium text-slate-800 mb-0.5">{w.title}</div>
                <div className="text-xs text-slate-400 font-light leading-snug">{w.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="border border-slate-200 rounded-lg px-5 py-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors">Back</button>
        <button onClick={onNext} disabled={value.length === 0} className="bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-default">
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SlideVolumes({ workflows, volumes, onChange, onNext, onBack }: {
  workflows: string[];
  volumes: Record<string, number>;
  onChange: (id: string, v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="w-full max-w-[560px]">
      <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-3 text-center">4 of 5</div>
      <h2 className="font-['Instrument_Serif'] text-3xl md:text-4xl text-slate-900 mb-2 text-center">Roughly how many per month?</h2>
      <p className="text-sm text-slate-500 font-light mb-8 leading-relaxed text-center">Estimates are fine. We confirm exact numbers on the discovery call.</p>
      <div className="mb-8">
        {workflows.map((id) => {
          const c = VOL_CONFIG[id];
          if (!c) return null;
          const val = volumes[id] ?? c.default;
          return (
            <div key={id} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
              <span className="text-sm text-slate-700">{c.label}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onChange(id, Math.max(c.min, val - c.step))}
                  className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-['Instrument_Serif'] text-xl font-medium text-slate-900 min-w-[52px] text-center">{val}</span>
                <button
                  onClick={() => onChange(id, Math.min(c.max, val + c.step))}
                  className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="border border-slate-200 rounded-lg px-5 py-3 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors">Back</button>
        <button onClick={onNext} className="bg-[#00122F] text-white px-8 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors">
          See my estimate <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SlideResult({ providers, workflows, volumes, onBack }: {
  providers: number;
  workflows: string[];
  volumes: Record<string, number>;
  onBack: () => void;
}) {
  const { hana, human, saving, pct, annual, rows } = calcResults(providers, workflows, volumes);
  return (
    <div className="w-full max-w-[620px]">
      {/* Saving hero */}
      <div className="text-center mb-6 pb-6 border-b border-slate-200">
        <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-1">Your estimated monthly saving</div>
        <div className="font-['Instrument_Serif'] text-6xl font-medium text-blue-500">{fmt(saving)}</div>
        <div className="text-sm text-slate-400 mt-1 font-light">{pct}% less than human staff doing the same tasks</div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { val: fmt(hana),   label: "HANA / month"   },
          { val: fmt(human),  label: "Current cost"   },
          { val: fmt(annual), label: "Annual saving"  },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <div className="font-['Instrument_Serif'] text-xl font-medium text-slate-900">{m.val}</div>
            <div className="text-xs text-slate-400 mt-1 font-light">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-slate-200 mb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#00122F] text-slate-300">
              <th className="text-left px-4 py-3 text-[10px] tracking-[1.5px] uppercase font-normal">Task</th>
              <th className="text-right px-4 py-3 text-[10px] tracking-[1.5px] uppercase font-normal">HANA</th>
              <th className="text-right px-4 py-3 text-[10px] tracking-[1.5px] uppercase font-normal">Human staff</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-3 text-slate-600 font-light">{r[0]}</td>
                <td className="px-4 py-3 text-right text-slate-600 font-light">{r[1]}</td>
                <td className="px-4 py-3 text-right text-slate-600 font-light">{r[2]}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-900">Total / month</td>
              <td className="px-4 py-3 text-right font-medium text-slate-900">{fmt(hana)}</td>
              <td className="px-4 py-3 text-right font-medium text-slate-900">{fmt(human)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-emerald-700">You save</td>
              <td className="px-4 py-3 text-right font-medium text-emerald-700 col-span-2" colSpan={2}>{fmt(saving)} / month ({pct}%)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="bg-[#00122F] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-white font-medium text-sm mb-1">Ready to confirm your numbers?</p>
          <p className="text-slate-400 text-xs font-light leading-relaxed">Book a 20-minute call. We'll calculate your exact projection using your actual workflows before any commitment.</p>
        </div>
        <a
          href="https://calendly.com/matteowastaken/discoverycall"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-blue-500 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          Book a discovery call
        </a>
      </div>

      <div className="text-center mt-4">
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 mx-auto">
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const TOTAL_SLIDES = 5;

export function Pricing() {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [practiceType, setPracticeType] = useState<string | null>(null);
  const [providers, setProviders] = useState(3);
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const initVolumes = (wfs: string[]) => {
    const v: Record<string, number> = {};
    wfs.forEach((id) => { v[id] = VOL_CONFIG[id]?.default ?? 0; });
    return v;
  };

  const goNext = () => {
    setDirection(1);
    if (slide === 2) setVolumes(initVolumes(workflows));
    setSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1));
  };
  const goBack = () => { setDirection(-1); setSlide((s) => Math.max(s - 1, 0)); };

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? 60 : -60, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit:  (d: number) => ({ y: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const slideContent = [
    <SlideTypeSelect  key="type"       value={practiceType}  onChange={setPracticeType}  onNext={goNext} />,
    <SlideProviders   key="providers"  value={providers}     onChange={setProviders}      onNext={goNext}  onBack={goBack} />,
    <SlideWorkflows   key="workflows"  value={workflows}     onChange={setWorkflows}      onNext={goNext}  onBack={goBack} />,
    <SlideVolumes     key="volumes"    workflows={workflows} volumes={volumes}
                      onChange={(id, v) => setVolumes((prev) => ({ ...prev, [id]: v }))}
                      onNext={goNext}  onBack={goBack} />,
    <SlideResult      key="result"     providers={providers} workflows={workflows} volumes={volumes} onBack={goBack} />,
  ];

  return (
    <>
      <SEO
        title="Pricing | Hana Voice AI"
        description="Outcome-based pricing aligned with your savings. Calculate exactly what Hana costs and what you save compared to human staff."
        path="/pricing"
        useExactTitle
      />

      {/* Hero */}
      <section className="pt-36 pb-10 px-4 text-center max-w-2xl mx-auto">
        <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium mb-4">
          Outcome-based pricing
        </div>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight text-slate-900 leading-[0.95] mb-4">
          Pricing aligned with{" "}
          <em className="italic text-blue-500">your savings</em>
        </h1>
        <p className="text-base text-slate-500 leading-relaxed font-light max-w-md mx-auto">
          Answer five quick questions about your practice. We'll show you exactly what HANA costs — and what you save compared to human staff doing the same work.
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
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 relative">
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
            {slideContent[slide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FAQ */}
      <section className="max-w-xl mx-auto px-4 pb-20">
        <div className="text-xs tracking-[2.5px] uppercase text-blue-500 font-medium text-center mb-2">Common questions</div>
        <h2 className="font-['Instrument_Serif'] text-2xl md:text-3xl text-slate-900 text-center mb-8">How does this work?</h2>
        {FAQS.map((f) => (
          <FaqItem key={f.q} q={f.q} a={f.a} />
        ))}
      </section>

      <Footer />
    </>
  );
}
