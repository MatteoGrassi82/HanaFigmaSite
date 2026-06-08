import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { WhitepaperFlows } from "../components/WhitepaperFlows";

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── TOC ───────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "workflow-overview", label: "Workflow Overview" },
  { id: "the-challenge", label: "The Challenge" },
  { id: "the-solution", label: "The HANA Solution" },
  { id: "interview-architecture", label: "Interview Architecture" },
  { id: "patient-journey", label: "Patient Journey" },
  { id: "ehr-integration", label: "EHR Integration" },
  { id: "outcomes", label: "Expected Outcomes" },
  { id: "onboarding", label: "Onboarding Timeline" },
];

// ── Modules data ──────────────────────────────────────────────────────────────
const MODULES = [
  {
    key: "M1", num: "01",
    title: "Opening & Rapport",
    description: "Establishes trust, orients the family to the interview process, and collects the chief complaint and primary goal data that frame the rest of the assessment.",
    items: [
      { id: "S1", topic: "State & Consent", purpose: "Orient the family, establish trust, and obtain verbal consent to proceed with the assessment interview." },
      { id: "S2", topic: "Process Explanation", purpose: "Set expectations for the interview format, duration, and how HANA's questions will be used." },
      { id: "S3", topic: "Chief Complaint", purpose: "Identify the primary reason the family is seeking an ADHD assessment at this time." },
      { id: "S4", topic: "Primary Goal", purpose: "Clarify what a successful outcome from the assessment looks like for this family." },
      { id: "S5", topic: "Symptom Diversity", purpose: "Screen for the breadth and variety of challenges the parent or patient has observed." },
      { id: "S6", topic: "Background Context", purpose: "Capture key behavioral events or moments that motivated the decision to seek assessment." },
    ],
    sample: '"Thank you for completing the intake paperwork. My name is Hana. As the first step in your assessment process, I\'m going to ask about your experience at home so we can form a complete picture of your child\'s challenges and goals before your appointment with the clinician. You can take a break or ask questions at any time."',
  },
  {
    key: "M2", num: "02",
    title: "Diagnostic Decision & Functional Plan",
    description: "The clinical core of the interview. Collects cross-setting symptom data and maps symptoms to real-world functional impairment to support DSM-5 criteria mapping and differential diagnosis.",
    callout: "HANA gathers cross-setting symptom information, functional impairment across domains, and school and peer context to support DSM-5 criteria mapping and differential diagnosis.",
    items: [
      { id: "C1", topic: "Cross-Setting Review", purpose: "Collect symptom data across home and school settings to establish cross-setting impairment — a DSM-5 criterion for ADHD." },
      { id: "C2", topic: "Peer & Social Functioning", purpose: "Assess the quality of peer relationships, social skills, and any peer-related impairment." },
      { id: "C3", topic: "School Follow-up", purpose: "Probe academic performance, teacher observations, IEP/504 plan status, and classroom behavior." },
      { id: "C4", topic: "Goal-Setting", purpose: "Identify the family's priority functional domains for treatment planning." },
      { id: "C5", topic: "Functional Impairment", purpose: "Quantify the degree to which ADHD-related symptoms are impairing daily functioning across settings." },
    ],
  },
  {
    key: "M3", num: "03",
    title: "Developmental Context & Treatment Resources",
    description: "Collects contextual information clinicians need to design an effective, individualized treatment plan — going beyond symptom description to the full developmental profile.",
    callout: 'A key clinical directive: distinguishing between an agility deficit ("Won\'t do" — motivational) and a knowledge/skill/environmental deficit ("Can\'t do" — capability gap). This distinction is foundational to T1 treatment planning.',
    items: [
      { id: "D1", topic: "Strengths & Resources", purpose: "Identify family supports, community resources, and prior interventions that can be leveraged in treatment planning." },
      { id: "D2", topic: "Motivation Patterns", purpose: "Understand intrinsic vs. extrinsic motivation drivers to tailor behavioral strategies." },
      { id: "D3", topic: "Emotional Regulation", purpose: "Assess co-occurring emotional dysregulation, anxiety, or mood factors that interact with ADHD presentation." },
      { id: "D4", topic: "Developmental History", purpose: "Gather perinatal history, developmental milestones, prior diagnoses, and prior treatment history." },
      { id: "D5", topic: "Hyperfocus / Midnight Focus", purpose: "Document hyperfocus patterns and special interests — clinically important for differential diagnosis and strengths-based treatment." },
      { id: "D6", topic: "School & Social Context", purpose: "Synthesize school performance, peer relationship quality, and any formal accommodations in place." },
    ],
  },
];

const PEDIATRIC_STEPS = [
  { n: "01", title: "Initial Contact", desc: "10-min screening call. Practice confirms eligibility and sends intake packet." },
  { n: "02", title: "Client Registration", desc: "Family registers in Practice Q. Demographics, history, and insurance captured." },
  { n: "03", title: "Assessment Dispatch", desc: "HANA automatically sends NICHQ, BASC-3, Conners 3, and BRIEF-2 packets." },
  { n: "04", title: "HANA Interview", desc: "Parent completes 3-module voice interview (30–45 min, on their schedule, 24/7)." },
  { n: "05", title: "Data Compilation", desc: "HANA structures interview transcript and all rating scale data into a clinical report." },
  { n: "06", title: "Report Published", desc: "Clinician receives complete intake report in Practice Q before the appointment." },
  { n: "07", title: "Clinician Review", desc: "Clinician reviews report and flags items for deeper exploration in session." },
  { n: "08", title: "Diagnostic Session", desc: "Clinician focuses entirely on interpretation — intake data is already complete." },
];

const ADULT_STEPS = [
  { n: "01", title: "Initial Contact", desc: "Adult contacts practice. Brief screening confirms ADHD assessment pathway." },
  { n: "02", title: "Registration", desc: "Client registers in Practice Q. History and insurance captured electronically." },
  { n: "03", title: "Assessment Dispatch", desc: "HANA sends adult self-report scales and a structured developmental history form." },
  { n: "04", title: "HANA Interview", desc: "Client completes 3-module voice interview covering current functioning and developmental history." },
  { n: "05", title: "Collateral Input", desc: "If available, partner or family member completes a brief observer rating scale." },
  { n: "06", title: "Report Compiled", desc: "HANA organizes all interview and scale data into a structured clinical summary." },
  { n: "07", title: "Clinician Review", desc: "Clinician reviews report and differential diagnosis considerations ahead of session." },
  { n: "08", title: "Diagnostic Session", desc: "Session focused on clinical interpretation, differential, and treatment planning." },
];

const EHR_STEPS = [
  {
    n: "1", title: "Create Your Source Message Template",
    desc: "The email sent to the family with intake instructions, HANA interview link, and assessment packet links.",
    steps: [
      "Navigate to System > Messages > New Templates",
      'Set Template Type to "New Patient Intake"',
      "Title the template: HANA ADHD Intake Packet",
      'Set Email Subject: "Your [Practice Name] Intake Assessment — Please Complete Before Your Appointment"',
      'Open with: "Dear [First Name],"',
      "Body: include the HANA interview link, assessment links (NICHQ, BASC, Conners, BRIEF), and completion deadline (minimum 48 hours before appointment)",
      "Add dynamic merge fields: child name, appointment date/time, clinician name",
      "Save and mark as Active",
    ],
  },
  {
    n: "2", title: "Create the Intake Checklist as a Task List",
    desc: "The task list ensures no assessment component is missed during each intake workflow.",
    steps: [
      "In the EHR, go to Tasks > New Task Template",
      "Name: ADHD Intake Checklist",
      "Add checklist items: HANA interview (link sent), NICHQ parent + teacher, BASC-3, Conners 3, BRIEF-2",
      "Set auto-trigger: fires when a new ADHD intake appointment is created",
      "Assign to: intake coordinator role",
    ],
  },
  {
    n: "3", title: "Configure HANA Interview Scheduling",
    desc: "",
    steps: [
      "HANA interview availability: 24/7, estimated completion time 30–45 minutes",
      "Minimum lead time: dispatch 48 hours before the diagnostic appointment",
      "Automated reminder if not completed: sent 24 hours before deadline",
      "On completion: HANA auto-compiles structured report and posts to the patient chart in Practice Q",
    ],
  },
  {
    n: "4", title: "Automate Report Delivery",
    desc: "Once the interview is complete, HANA automatically:",
    steps: [
      "Transcribes and structures the interview into the standard 3-module clinical report format",
      "Attaches all completed rating scales to the patient chart",
      'Sends the assigned clinician a notification: "Intake complete — review before [appointment date]"',
      "Marks all intake checklist items as complete in the task list",
      "Flags any missing or incomplete assessment components for coordinator follow-up",
    ],
  },
];

// ── Module card ───────────────────────────────────────────────────────────────
function ModuleCard({ mod, index }: { mod: typeof MODULES[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-5 p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold flex items-center justify-center">
          {mod.num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Module {mod.num}</p>
          <p className="text-base font-semibold text-slate-900">{mod.title}</p>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{mod.description}</p>
        </div>
        <span className="shrink-0 text-slate-400">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200 p-6 bg-slate-50">
              {mod.callout && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-sm text-blue-700 leading-relaxed">
                  {mod.callout}
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="text-left px-4 py-2.5 font-semibold rounded-tl-lg w-16">ID</th>
                      <th className="text-left px-4 py-2.5 font-semibold w-48">Topic</th>
                      <th className="text-left px-4 py-2.5 font-semibold rounded-tr-lg">Clinical Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mod.items.map((item, i) => (
                      <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="px-4 py-3 font-bold text-blue-600">{item.id}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{item.topic}</td>
                        <td className="px-4 py-3 text-slate-500 leading-relaxed">{item.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {mod.sample && (
                <div className="mt-5 border-l-4 border-blue-500 pl-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Opening sample</p>
                  <p className="text-sm text-slate-500 italic leading-relaxed">{mod.sample}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── EHR step (interactive checklist) ─────────────────────────────────────────
function EHRStep({ step, index }: { step: typeof EHR_STEPS[0]; index: number }) {
  const [checked, setChecked] = useState<boolean[]>(() => step.steps.map(() => false));
  const [open, setOpen] = useState(index === 0);
  const done = checked.filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
          {step.n}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
          {step.desc && <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400">{done}/{step.steps.length}</span>
          {done === step.steps.length && <CheckCircle2 size={16} className="text-blue-500" />}
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
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
            <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-2.5">
              {step.steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setChecked(prev => prev.map((v, j) => j === i ? !v : v))}
                  className="flex items-start gap-3 w-full text-left group"
                >
                  <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    checked[i]
                      ? "bg-blue-600 border-blue-600"
                      : "border-slate-300 group-hover:border-blue-400"
                  }`}>
                    {checked[i] && <CheckCircle2 size={12} className="text-white" />}
                  </span>
                  <span className={`text-sm leading-relaxed transition-colors ${checked[i] ? "text-slate-400 line-through" : "text-slate-600"}`}>
                    {s}
                  </span>
                </button>
              ))}
              {done === step.steps.length && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-blue-400 font-semibold mt-3 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={12} /> Step complete
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Patient Journey ────────────────────────────────────────────────────────────
function JourneyGrid({ steps }: { steps: typeof PEDIATRIC_STEPS }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {steps.map((step, i) => (
        <motion.button
          key={step.n}
          onClick={() => setActive(active === i ? null : i)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`rounded-xl p-4 text-left transition-all border ${
            active === i
              ? "bg-blue-600 border-blue-500 text-white"
              : i < 4
              ? "bg-white border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-300"
              : "bg-blue-50 border-blue-200 text-slate-900 hover:bg-blue-100"
          }`}
        >
          <p className="text-xs font-bold opacity-60 mb-1">{step.n}</p>
          <p className="text-sm font-bold mb-1.5 leading-tight">{step.title}</p>
          <AnimatePresence>
            {active === i && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs opacity-90 leading-relaxed overflow-hidden"
              >
                {step.desc}
              </motion.p>
            )}
          </AnimatePresence>
          {active !== i && <p className="text-xs opacity-60 leading-relaxed line-clamp-2">{step.desc}</p>}
        </motion.button>
      ))}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900">{label}</h2>
      <div className="mt-2.5 h-0.5 bg-blue-500 w-12" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function WhitepaperADHD() {
  const [activeSection, setActiveSection] = useState("executive-summary");
  const [journeyTab, setJourneyTab] = useState<"pediatric" | "adult">("pediatric");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  function setRef(id: string) {
    return (el: HTMLElement | null) => { sectionRefs.current[id] = el; };
  }

  function scrollTo(id: string) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <SEO
        title="ADHD Intake Workflow — Clinic Partner Whitepaper"
        description="A complete walkthrough of the HANA ADHD intake workflow: 3-module interview architecture, pediatric & adult intake flows, and Practice Q integration."
        path="/whitepapers/adhd-intake"
      />

      {/* Hero */}
      <div className="bg-[rgb(0,18,47)] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-5">Clinic Partner Whitepaper</p>
            <h1 className="text-5xl md:text-7xl font-black mb-3 leading-none tracking-tight text-white">HANA</h1>
            <h2 className="text-3xl md:text-4xl font-black text-blue-400 mb-8 leading-tight">ADHD INTAKE WORKFLOW</h2>
            <div className="w-16 h-0.5 bg-blue-500 mb-8" />
            <p className="text-lg text-slate-300 mb-3 font-light">A Complete Walkthrough for Prospective Clinic Partners</p>
            <p className="text-sm text-slate-500">
              Covering: 3-module interview architecture &nbsp;·&nbsp; pediatric &amp; adult intake flows &nbsp;·&nbsp; Practice Q integration
            </p>
          </motion.div>

          {/* Key stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-xl"
          >
            {[
              { val: 85, suffix: "%", label: "faster time to diagnosis" },
              { val: 90, suffix: "%", label: "reduction in coordinator time" },
              { val: 100, suffix: "%", label: "protocol adherence" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white mb-1">
                  <Counter target={s.val} suffix={s.suffix} />
                </p>
                <p className="text-xs text-slate-500 leading-snug">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex gap-12">

            {/* Sticky TOC */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-28">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Contents</p>
                <nav className="space-y-0.5">
                  {SECTIONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                        activeSection === s.id
                          ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200"
                          : "text-slate-500 hover:text-slate-800 hover:bg-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0 space-y-20">

              {/* Executive Summary */}
              <section ref={setRef("executive-summary")} id="executive-summary">
                <SectionHeader label="Executive Summary" />
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>HANA is a voice AI platform that transforms how mental health and neurodevelopmental practices conduct patient intake. This document provides a complete, step-by-step walkthrough of the HANA ADHD intake workflow — from the moment a patient contacts your practice to the moment your clinician receives a structured, analysis-ready report.</p>
                  <p>The HANA ADHD intake is built around a structured <span className="text-slate-900 font-semibold">three-module interview</span>, designed in collaboration with board-certified ADHD diagnosticians. HANA conducts the interview by voice, collects clinician-defined data points, and organizes findings into your practice management system — reducing administrative burden, improving data consistency, and freeing clinicians to focus on care.</p>
                  <p>This walkthrough covers two core use cases: <span className="text-slate-900 font-semibold">pediatric ADHD intake (parent-report flow)</span> and <span className="text-slate-900 font-semibold">adult ADHD intake (self-report flow)</span>. Both leverage the same three-module interview architecture, adapted for the respondent type.</p>
                </div>
              </section>

              {/* Workflow Overview */}
              <section ref={setRef("workflow-overview")} id="workflow-overview">
                <SectionHeader label="Workflow Overview" />
                <p className="text-slate-600 leading-relaxed mb-6">Interactive diagrams of the full patient journey and the three-module interview architecture. Drag to pan, scroll to zoom.</p>
                <WhitepaperFlows />
              </section>

              {/* The Challenge */}
              <section ref={setRef("the-challenge")} id="the-challenge">
                <SectionHeader label="The Challenge: Why ADHD Intake Needs a Rethink" />
                <p className="text-slate-600 leading-relaxed mb-8">ADHD assessment is one of the most data-intensive processes in clinical mental health. A thorough intake requires gathering structured information from multiple informants, across multiple settings, on dozens of behavioral dimensions. The challenge shows up in three ways:</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { title: "Time burden", text: "A comprehensive parent intake interview can take 45–90 minutes of clinician or coordinator time. Most practices cannot absorb this volume without creating bottlenecks or cutting corners." },
                    { title: "Data inconsistency", text: "Unstructured intake calls produce inconsistent clinical data. Different coordinators ask different questions, and important diagnostic dimensions are routinely missed." },
                    { title: "Clinician fatigue", text: "When clinicians conduct intake personally, they spend 30–40% of their diagnostic hours gathering information rather than interpreting it and planning treatment." },
                  ].map((c, i) => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="bg-red-50 border border-red-100 rounded-2xl p-5"
                    >
                      <p className="font-bold text-slate-900 mb-2">{c.title}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mt-6 font-medium">
                  The result: longer wait times for families, higher operational costs for clinics, and clinician burnout — without improving diagnostic accuracy.
                </p>
              </section>

              {/* Solution */}
              <section ref={setRef("the-solution")} id="the-solution">
                <SectionHeader label="The HANA Solution" />
                <p className="text-slate-600 leading-relaxed mb-8">HANA replaces unstructured intake calls with a structured voice AI interview. A parent or patient calls a dedicated HANA line (or receives an outbound call), and HANA conducts a clinician-designed interview — capturing the exact data points your clinicians need, in a consistent and empathetic format, every time.</p>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="bg-slate-800 text-white text-left px-5 py-3.5 font-semibold rounded-tl-2xl">Traditional Intake</th>
                        <th className="bg-blue-600 text-white text-left px-5 py-3.5 font-semibold rounded-tr-2xl">HANA Intake</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["45–90 min of staff time per intake", "Fully automated — zero staff time during the interview"],
                        ["Inconsistent question coverage", "Structured protocol — same clinical quality every time"],
                        ["Unstructured notes to synthesize", "Organized data output, ready for clinician review"],
                        ["Scheduling bottleneck", "Patients complete intake on their own schedule, 24/7"],
                        ["Clinician burnout on data-gathering", "Clinicians engage only at interpretation and planning stage"],
                      ].map(([bad, good], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="px-5 py-3.5 text-slate-500">{bad}</td>
                          <td className="px-5 py-3.5 text-blue-600 font-medium">{good}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Interview Architecture */}
              <section ref={setRef("interview-architecture")} id="interview-architecture">
                <SectionHeader label="The Interview Architecture: Three Modules" />
                <p className="text-slate-600 leading-relaxed mb-8">The HANA ADHD interview is organized into three sequential modules. Each module has a defined clinical purpose and together they produce a complete picture of the patient's presentation, functional impairment, developmental history, and treatment context.</p>
                <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-semibold">Click a module to expand</p>
                <div className="space-y-3">
                  {MODULES.map((mod, i) => <ModuleCard key={mod.key} mod={mod} index={i} />)}
                </div>
              </section>

              {/* Patient Journey */}
              <section ref={setRef("patient-journey")} id="patient-journey">
                <SectionHeader label="The Patient Journey" />
                <p className="text-slate-600 leading-relaxed mb-8">HANA supports two primary ADHD intake flows. Both follow the same three-module interview structure, adapted for the respondent.</p>

                {/* Tab toggle */}
                <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl w-fit mb-8 shadow-sm">
                  {(["pediatric", "adult"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setJourneyTab(tab)}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                        journeyTab === tab
                          ? "bg-blue-600 text-white shadow"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab === "pediatric" ? "Pediatric (Parent-Report)" : "Adult (Self-Report)"}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={journeyTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-sm text-slate-500 mb-5">
                      {journeyTab === "pediatric"
                        ? "A parent or guardian completes the HANA interview on behalf of their child. Most common ADHD assessment pathway in child psychiatry and neuropsychology."
                        : "The patient completes the HANA interview directly, supplemented by adult-normed rating scales. HANA adapts language, pacing, and probe strategy for adult respondents."}
                    </p>
                    <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">Click a step to expand</p>
                    <JourneyGrid steps={journeyTab === "pediatric" ? PEDIATRIC_STEPS : ADULT_STEPS} />

                    {journeyTab === "pediatric" && (
                      <div className="mt-5 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assessment instruments dispatched</p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {["NICHQ Vanderbilt Assessment Scales (Parent & Teacher forms)", "BASC-3: Behavior Assessment System for Children, 3rd Edition", "Conners 3rd Edition (C3) — Parent, Teacher, and Self-Report forms", "BRIEF-2: Behavior Rating Inventory of Executive Function, 2nd Edition"].map(item => (
                            <li key={item} className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">·</span>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </section>

              {/* EHR Integration */}
              <section ref={setRef("ehr-integration")} id="ehr-integration">
                <SectionHeader label="Practice Integration: Setup in EHR" />
                <p className="text-slate-600 leading-relaxed mb-8">HANA integrates directly with your EHR to automate scheduling, assessment dispatch, and report delivery. Work through each step below to configure your practice.</p>
                <div className="space-y-3">
                  {EHR_STEPS.map((step, i) => <EHRStep key={step.n} step={step} index={i} />)}
                </div>
              </section>

              {/* Outcomes */}
              <section ref={setRef("outcomes")} id="outcomes">
                <SectionHeader label="Expected Outcomes for Clinic Partners" />
                <p className="text-slate-600 leading-relaxed mb-8">Practices that implement the HANA ADHD intake workflow see measurable improvements across three dimensions:</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { title: "Operational Efficiency", accent: "border-blue-500", bg: "bg-white", text: "Eliminate 40–90 minutes of coordinator time per intake. Scale ADHD assessment volume without adding headcount or creating scheduling bottlenecks." },
                    { title: "Clinical Quality", accent: "border-indigo-500", bg: "bg-white", text: "100% protocol adherence. Every patient receives the same evidence-based intake — no questions skipped, no informants missed, no variation by coordinator." },
                    { title: "Patient Experience", accent: "border-violet-500", bg: "bg-white", text: "Families complete intake on their own schedule, at home, without a phone appointment. Reduces no-shows and improves intake completion rates." },
                  ].map((o, i) => (
                    <motion.div
                      key={o.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className={`border-t-4 ${o.accent} ${o.bg} border border-slate-200 rounded-2xl p-5 shadow-sm`}
                    >
                      <p className="font-bold text-slate-900 mb-3">{o.title}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{o.text}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Onboarding */}
              <section ref={setRef("onboarding")} id="onboarding">
                <SectionHeader label="Onboarding Timeline" />
                <p className="text-slate-600 leading-relaxed mb-8">HANA is available for pilot deployment with select clinic partners. The typical onboarding timeline is 2–4 weeks, including template configuration, staff training, and a supervised first-intake review.</p>
                <div className="space-y-3 mb-14">
                  {[
                    { week: "Week 1", text: "Kickoff call. EHR integration. Message template and assessment packet configuration." },
                    { week: "Week 2", text: "HANA interview customization to your specific clinical protocol. Staff training session." },
                    { week: "Week 3", text: "Supervised pilot — 2 to 3 live intakes with clinician review of HANA output and protocol refinement." },
                    { week: "Week 4", text: "Go-live. Full ADHD intake volume transitions to the HANA workflow." },
                  ].map((row, i) => (
                    <motion.div
                      key={row.week}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                      className="flex gap-4 items-start p-4 rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg text-white ${i < 3 ? "bg-slate-700" : "bg-blue-600"}`}>{row.week}</span>
                      <p className="text-sm text-slate-600 leading-relaxed pt-1">{row.text}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA — keep dark to match site's CTA sections */}
                <div className="relative rounded-2xl overflow-hidden p-8 text-center bg-[rgb(0,18,47)]">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-600/15 rounded-full blur-[60px] pointer-events-none" />
                  <div className="relative z-10">
                    <p className="text-2xl font-bold text-white mb-2">Ready to transform your ADHD intake workflow?</p>
                    <p className="text-slate-400 text-sm mb-8">Schedule a demo or start a pilot conversation</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="https://calendly.com/matteowastaken/discoverycall"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-100 transition-colors group"
                      >
                        Book a Demo <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                      </a>
                      <a
                        href="mailto:matteo@usehana.com"
                        className="inline-flex items-center gap-2 border border-white/20 text-slate-300 hover:text-white hover:border-white/40 px-6 py-3 rounded-full font-semibold text-sm transition-colors"
                      >
                        matteo@usehana.com <ArrowUpRight size={14} />
                      </a>
                    </div>
                    <p className="text-xs text-slate-600 mt-6">Confidential — prepared exclusively for prospective HANA clinic partners</p>
                  </div>
                </div>
              </section>

            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
