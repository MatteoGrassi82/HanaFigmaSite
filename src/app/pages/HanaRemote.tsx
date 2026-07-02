import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/Footer";
import { HanaBloomOrb } from "../components/ui/hana-bloom-orb";
import { LoopFigure } from "../components/ui/loop-diagram";
import { Link } from "react-router";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

/**
 * HANA Remote — product page for the device-less remote patient monitoring
 * platform (RTM / RPM / CCM / ACCESS / Sleep). Shares the design language and
 * interaction patterns of the HANA Contact page: light field, navy + periwinkle,
 * serif display type, slider calculator, tabbed explorer, stat band, FAQ.
 * Signature piece: an animated SaaS-dashboard mock (worklist / patient timeline /
 * billing) — the "full-stack system with a dash" proof no competitor shows.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

// Compact lucide-style icon paths (24×24) used across the page.
const RI = {
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  watch: "M12 7v5l3 2 M9 3h6 M9 21h6 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  clipboard: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 12h6 M9 16h6",
  cycle: "M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.57L21 8 M21 3v5h-5",
  dollar: "M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3z M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5 M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  alert: "M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3.6 9h16.8 M3.6 15h16.8 M12 3a15 15 0 0 1 0 18 M12 3a15 15 0 0 0 0 18",
  heart: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z",
  building: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4",
};

function Glyph({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// ── Content ──────────────────────────────────────────────────────────────────

const HOW_BLOCKS = [
  {
    key: "Voice",
    icon: RI.phone,
    title: "Voice AI replaces the device",
    short: "The conversation is the monitoring.",
    body: "HANA Remote calls your patients on the right cadence, in their language, with the right clinical protocol for their condition. No Bluetooth. No hardware. No compliance problem. The conversation is the monitoring.",
    stat: "85%",
    statLabel: "of patients pick up and engage — vs 20% for apps",
  },
  {
    key: "Wearables",
    icon: RI.watch,
    title: "Wearables data, when you have it",
    short: "Device-less by default. Device-connected when available.",
    body: "HANA Remote connects to wearables and RPM devices via API — so if your patients are already using Apple Watch, WHOOP, or a connected glucometer, that data flows in alongside the voice data.",
    stat: "API",
    statLabel: "Apple Watch · WHOOP · connected glucometers",
  },
  {
    key: "Protocols",
    icon: RI.clipboard,
    title: "45+ clinical protocols",
    short: "Co-built with clinicians inside real clinics.",
    body: "MSK, CPAP/sleep, diabetes, hypertension, behavioral health, post-op, chronic care management, ACCESS. Every protocol was built with practicing clinicians inside real clinics. Not written in a boardroom.",
    stat: "45+",
    statLabel: "clinical protocols across conditions",
  },
  {
    key: "Full-cycle",
    icon: RI.cycle,
    title: "Full-cycle program management",
    short: "Enrollment to escalation to billing — handled.",
    body: "Enrollment, engagement, assessment, escalation, care coordination, billing documentation — HANA Remote runs the full cycle. Your team reviews what matters, on a flagged worklist. The rest is handled.",
    stat: "1",
    statLabel: "flagged worklist is all your team reviews",
  },
  {
    key: "Billing",
    icon: RI.dollar,
    title: "Reimbursable from day one",
    short: "The billing architecture is part of the product.",
    body: "Built around the billing architecture: RTM codes 98975–98981, CCM, APCM, and ACCESS Pathway 4. Every interaction is documented for the clinician's attestation. The reimbursement infrastructure is part of the product, not an afterthought.",
    stat: "Day 1",
    statLabel: "reimbursable — RTM · CCM · APCM · ACCESS",
  },
  {
    key: "EHR",
    icon: RI.database,
    title: "Live inside your EHR",
    short: "No new portal for your team to learn.",
    body: "150+ integrations. Structured data written back to your existing system — ready for the clinician's review the moment the call ends.",
    stat: "150+",
    statLabel: "EHR integrations, live in your workflow",
  },
];

const PROGRAMS = [
  {
    key: "RTM",
    name: "Remote Therapeutic Monitoring",
    who: "Musculoskeletal, respiratory, and behavioral health programs.",
    what: "Software as the device — HANA Remote's voice interactions are the monitoring instrument. No FDA-cleared hardware required.",
    codes: ["98975", "98976", "98977", "98980", "98981"],
    stat: "45+",
    statLabel: "clinical protocols across conditions",
  },
  {
    key: "RPM",
    name: "Remote Patient Monitoring",
    who: "Clinics with existing device-based RPM programs.",
    what: "The engagement layer that makes your existing RPM program work. HANA Remote handles the between-visit contact your devices can't — and keeps patients transmitting.",
    codes: ["99453", "99454", "99457", "99458"],
    stat: "85%",
    statLabel: "patient engagement vs 20% for apps",
  },
  {
    key: "CCM & APCM",
    name: "Chronic Care Management",
    who: "Patients with multiple chronic conditions.",
    what: "Full-cycle coordination — monthly touchpoints, assessments, care plan updates, and escalations. Monthly reimbursement, documented and billable.",
    codes: ["99490", "99439", "APCM"],
    stat: "4M+",
    statLabel: "patient interactions processed",
  },
  {
    key: "ACCESS",
    name: "ACCESS Program (CMS)",
    who: "Enrolled ACCESS participants — or clinics working toward enrollment.",
    what: "Live inside the CMS ACCESS program (launched July 2026). If you're an enrolled participant or working toward enrollment, HANA Remote is your engagement layer for Pathway 4.",
    codes: ["Pathway 4"],
    stat: "Live",
    statLabel: "inside the CMS ACCESS program",
  },
  {
    key: "HANA Sleep",
    name: "Sleep & DME",
    who: "Sleep labs and DME providers with CPAP non-adherence problems.",
    what: "CPAP adherence, sleep program management, and DME resupply outreach. The sharpest use case for the device-less model — voice cuts non-adherence in half.",
    codes: ["E0601", "94660", "Resupply"],
    stat: "50→22%",
    statLabel: "CPAP non-adherence in production",
  },
];

const PAYERS = [
  { icon: RI.dollar, title: "Medicare", body: "RTM and RPM engagement — the codes exist, the money is there, and CMS has been paying for monitoring programs for years." },
  { icon: RI.building, title: "Commercial insurers", body: "The same monitoring programs, reimbursed by commercial payers alongside Medicare." },
  { icon: RI.activity, title: "Value-based contracts", body: "Paid from savings, code-independent. Engagement that keeps patients out of the ED pays for itself." },
  { icon: RI.heart, title: "Cash-pay & DME", body: "GLP-1 programs, CPAP resupply, concierge monitoring — revenue that doesn't wait on a payer at all." },
];

const R_FAQS = [
  {
    q: "Do my patients need a device or an app?",
    a: "No. HANA Remote is device-less by default — the phone call is the monitoring instrument. If your patients already use wearables or connected devices, that data flows in via API alongside the voice data. But nothing is shipped, downloaded, or charged.",
  },
  {
    q: "Does this replace my clinicians' billable time?",
    a: "No — the opposite. We don't replace the clinician's billable interaction; we make it possible and make their time count. HANA Remote captures the data, drives the adherence, and documents every interaction so your clinician reviews a flagged worklist and attests, instead of chasing patients.",
  },
  {
    q: "How does the billing actually work?",
    a: "HANA Remote is built around the billing architecture: RTM codes 98975–98981, CCM, APCM, and ACCESS Pathway 4. Every interaction is documented for the clinician's attestation, and structured billing documentation is generated as the program runs — it's part of the product, not an afterthought.",
  },
  {
    q: "We already run RPM with devices. Why would we add this?",
    a: "Because the devices aren't the problem — engagement is. HANA Remote is the engagement layer that keeps your existing RPM program transmitting: it handles the between-visit contact, chases the missing readings, and recovers the patients who've gone quiet.",
  },
  {
    q: "What is ACCESS, and can we use HANA Remote for it?",
    a: "ACCESS is the CMS program launched in July 2026. HANA Remote is live inside ACCESS — if you're an enrolled participant or working toward enrollment, HANA Remote serves as your engagement layer under Pathway 4.",
  },
  {
    q: "What languages do you support?",
    a: "HANA calls patients in any language they speak, switching automatically per patient — no separate configuration or phone lines required.",
  },
];

// ── Dashboard mock data (stylized, illustrative) ─────────────────────────────

const WORKLIST_ROWS = [
  { initials: "MA", name: "M. Alvarez", program: "CPAP · Sleep", note: "Night 3 — no usage detected", level: "red", action: "Call escalated" },
  { initials: "JC", name: "J. Chen", program: "Hypertension · RPM", note: "BP 158/94 self-reported", level: "amber", action: "Review" },
  { initials: "RP", name: "R. Patel", program: "Post-op · RTM", note: "Pain 8/10 on day 7 check-in", level: "red", action: "Escalated" },
  { initials: "LR", name: "L. Rossi", program: "CCM · Monthly", note: "Check-in complete · goals reviewed", level: "green", action: "Ready to bill" },
  { initials: "KO", name: "K. Okafor", program: "Diabetes · RTM", note: "Glucose log captured by voice", level: "green", action: "Documented" },
];

const TIMELINE_EVENTS = [
  { day: "Day 1", text: "Enrollment call — consent captured, baseline PHQ-2", icon: RI.phone },
  { day: "Day 4", text: "Check-in call — mask discomfort reported, coaching delivered", icon: RI.phone },
  { day: "Day 9", text: "Usage rising — 6.2 hrs/night avg, encouragement call", icon: RI.activity },
  { day: "Day 14", text: "Adherent — threshold met, documented for attestation", icon: RI.clipboard },
];

const BILLING_ROWS = [
  { code: "98975", desc: "RTM initial setup & education", status: "Documented" },
  { code: "98977", desc: "Device/software supply, monthly", status: "Documented" },
  { code: "98980", desc: "Treatment management, first 20 min", status: "Ready for attestation" },
  { code: "98981", desc: "Treatment management, each addl 20 min", status: "Ready for attestation" },
];

const DASH_TABS = ["Flagged worklist", "Patient timeline", "Billing & codes"] as const;

// ── Dashboard panes ──────────────────────────────────────────────────────────

function LevelDot({ level }: { level: string }) {
  const c = level === "red" ? "bg-red-400" : level === "amber" ? "bg-amber-400" : "bg-emerald-400";
  return <span className={`w-2 h-2 rounded-full ${c} shrink-0`} aria-hidden="true" />;
}

function WorklistPane({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const rows = compact ? WORKLIST_ROWS.slice(0, 4) : WORKLIST_ROWS;
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[1px] text-slate-400 border-b border-slate-100 bg-[#fbfcfe]">
        <span>Today · 38 flagged of 412 monitored</span>
        {!compact && <span className="hidden sm:block">Sorted by risk</span>}
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: reduce ? 0 : 0.15 + i * 0.1 }}
          className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-[#fafbfe] transition-colors"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eef1fb] text-[#5b76d9] text-[11px] font-bold shrink-0">
            {r.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <LevelDot level={r.level} />
              <span className="text-[13px] font-semibold text-slate-900 truncate">{r.name}</span>
              <span className="text-[11px] text-slate-400 truncate hidden sm:block">{r.program}</span>
            </div>
            <p className="text-[12px] text-slate-500 m-0 mt-0.5 truncate">{r.note}</p>
          </div>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
              r.level === "green" ? "bg-emerald-50 text-emerald-600" : r.level === "amber" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"
            }`}
          >
            {r.action}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function TimelinePane() {
  const reduce = useReducedMotion();
  // Adherence trend: non-adherence falling 50% → 22% over the program.
  const points = "0,54 40,50 80,44 120,45 160,36 200,30 240,26 280,20 320,16";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr]">
      <div className="p-4 border-b sm:border-b-0 sm:border-r border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#eef1fb] text-[#5b76d9] text-[12px] font-bold">MA</span>
          <div>
            <div className="text-[14px] font-semibold text-slate-900">M. Alvarez</div>
            <div className="text-[11px] text-slate-400">CPAP · HANA Sleep protocol · wk 2</div>
          </div>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[1px] text-slate-400 mb-2">Usage trend</p>
        <svg viewBox="0 0 320 70" className="w-full" aria-label="CPAP usage trend rising across the program">
          <line x1="0" y1="62" x2="320" y2="62" stroke="#e8ecf4" strokeWidth="1" />
          <motion.polyline
            points={points}
            fill="none"
            stroke="#5b76d9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 1.6, ease: "easeOut", delay: 0.3 }}
          />
          <motion.circle
            cx="320" cy="16" r="4" fill="#5b76d9"
            initial={{ opacity: reduce ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: reduce ? 0 : 1.9 }}
          />
        </svg>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>Night 1 · 2.1 hrs</span>
          <span className="text-[#5b76d9] font-semibold">Night 14 · 6.4 hrs ✓ adherent</span>
        </div>
      </div>
      <div className="p-4">
        {TIMELINE_EVENTS.map((e, i) => (
          <motion.div
            key={e.day}
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: reduce ? 0 : 0.2 + i * 0.15 }}
            className="flex items-start gap-3 pb-3.5 last:pb-0"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#eef1fb] text-[#5b76d9] shrink-0 mt-0.5">
              <Glyph d={e.icon} className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="text-[11px] font-bold text-[#5b76d9] uppercase tracking-[1px]">{e.day}</div>
              <p className="text-[12.5px] text-slate-600 leading-[1.5] m-0">{e.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BillingPane() {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[1px] text-slate-400 border-b border-slate-100 bg-[#fbfcfe]">
        <span>This month · RTM program</span>
        <span>412 enrolled</span>
      </div>
      {BILLING_ROWS.map((b, i) => (
        <motion.div
          key={b.code}
          initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: reduce ? 0 : 0.15 + i * 0.12 }}
          className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-[#fafbfe] transition-colors"
        >
          <span className="font-mono text-[12px] font-bold text-[#5b76d9] bg-[#eef1fb] rounded-md px-2 py-1 shrink-0">{b.code}</span>
          <span className="text-[12.5px] text-slate-600 flex-1 min-w-0 truncate">{b.desc}</span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 shrink-0">
            <motion.span
              initial={{ scale: reduce ? 1 : 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 0.5 + i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100"
            >
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            </motion.span>
            <span className="hidden sm:inline">{b.status}</span>
          </span>
        </motion.div>
      ))}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[12px] text-slate-500">Documented this month, pending attestation</span>
        <span className="font-serif text-[22px] text-slate-900">$12,840</span>
      </div>
    </div>
  );
}

// A light "seen on a computer" SaaS window: browser chrome (traffic lights +
// address bar) and an app sidebar. When onNav is provided the sidebar items are
// the live navigation for the tour; without it the window is a static peek.
const DASH_NAV = [
  { label: "Worklist", icon: RI.alert, path: "worklist" },
  { label: "Patients", icon: RI.activity, path: "patients/m-alvarez" },
  { label: "Billing", icon: RI.dollar, path: "billing" },
];

function SaaSWindow({ active, onNav, children }: { active: number; onNav?: (i: number) => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-[0_40px_90px_rgba(0,18,47,0.18)] overflow-hidden text-left">
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f6f7fb] border-b border-slate-200">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <div className="flex-1 flex justify-center min-w-0 px-2">
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-3 py-1 text-[11px] text-slate-400 font-medium max-w-full truncate">
            <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            app.hana.health/remote/{DASH_NAV[active].path}
          </span>
        </div>
        <span className="w-12 shrink-0" aria-hidden="true" />
      </div>
      <div className="flex items-stretch">
        {/* App sidebar */}
        <div className="hidden sm:flex flex-col w-44 shrink-0 bg-[#fbfcfe] border-r border-slate-100 py-4 px-3">
          <div className="flex items-center gap-2 px-2 pb-3 mb-2 border-b border-slate-100">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#1e2a3a] text-white text-[10px] font-bold">H</span>
            <span className="text-[12px] font-semibold text-slate-800">HANA Remote</span>
          </div>
          {DASH_NAV.map((n, i) => (
            <button
              key={n.label}
              onClick={onNav ? () => onNav(i) : undefined}
              disabled={!onNav}
              aria-pressed={i === active}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium transition-colors text-left mb-0.5 ${
                i === active ? "bg-[#eef1fb] text-[#5b76d9]" : `text-slate-500 ${onNav ? "hover:bg-slate-100 cursor-pointer" : "cursor-default"}`
              }`}
            >
              <Glyph d={n.icon} className="w-4 h-4" />
              {n.label}
            </button>
          ))}
          <div className="mt-auto px-2.5 pt-3 border-t border-slate-100 text-[10.5px] text-slate-400">412 patients monitored</div>
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0 bg-white">{children}</div>
      </div>
    </div>
  );
}

// The interactive dashboard tour — the sidebar is the navigation; auto-advances.
function DashboardTour() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setTab((t) => (t + 1) % DASH_TABS.length), 4500);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="max-w-[880px] mx-auto">
        <SaaSWindow active={tab} onNav={setTab}>
          <div className="min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                transition={{ duration: 0.35 }}
              >
                {tab === 0 && <WorklistPane />}
                {tab === 1 && <TimelinePane />}
                {tab === 2 && <BillingPane />}
              </motion.div>
            </AnimatePresence>
          </div>
        </SaaSWindow>
        {/* Mobile tab switcher (sidebar hides below sm) */}
        <div className="flex sm:hidden justify-center gap-2 mt-4">
          {DASH_TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              aria-pressed={tab === i}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                tab === i ? "bg-white text-[#00122F]" : "bg-white/[0.08] text-white/60"
              }`}
            >
              {t.replace("Flagged ", "").replace(" & codes", "")}
            </button>
          ))}
        </div>
        <p className="text-center text-[12px] text-white/35 mt-4">Illustrative interface. Your team reviews what matters — the rest is handled.</p>
      </div>
    </div>
  );
}

// "How it works" — interactive stage flow (the Contact five-step pattern):
// stage cards auto-advance, the active card expands, a detail panel explains.
function HowItWorksFlow() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % HOW_BLOCKS.length), 3800);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  const cur = HOW_BLOCKS[active];

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex gap-2.5 md:gap-3 overflow-x-auto lg:overflow-visible pb-1 -mx-2 px-2 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none">
        {HOW_BLOCKS.map((b, i) => {
          const is = i === active;
          return (
            <button
              key={b.key}
              onClick={() => setActive(i)}
              aria-pressed={is}
              className={`group relative flex-1 min-w-[150px] lg:min-w-0 snap-start text-left rounded-2xl p-5 transition-all duration-500 border ${
                is ? "bg-[#1e2a3a] border-[#1e2a3a] shadow-[0_18px_50px_rgba(0,18,47,0.30)]" : "bg-[#f6f7fb] border-slate-200 hover:border-[#c2cef6]"
              }`}
              style={{ flexGrow: is ? 1.6 : 1 }}
            >
              <span className={`flex items-center justify-center w-10 h-10 rounded-[12px] mb-3 transition-colors ${is ? "bg-white/10 text-[#A7BCF5]" : "bg-[#eef1fb] text-[#5b76d9]"}`}>
                <Glyph d={b.icon} className="w-5 h-5" />
              </span>
              <div className={`font-semibold text-[14.5px] leading-snug ${is ? "text-white" : "text-[#00122F]"}`}>{b.title}</div>
              <motion.p
                initial={false}
                animate={{ opacity: is ? 1 : 0, height: is ? "auto" : 0 }}
                className="overflow-hidden text-[12.5px] leading-[1.5] text-white/75 mt-1.5 m-0"
              >
                {b.short}
              </motion.p>
              <span className={`absolute top-4 right-4 text-[11px] font-bold ${is ? "text-white/60" : "text-slate-300"}`}>{i + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-[#f6f7fb] border border-slate-200 p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8 items-center min-h-[190px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.key}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="font-serif font-normal text-[24px] md:text-[28px] text-[#00122F] mt-0 mb-3">{cur.title}</h3>
            <p className="text-[15px] leading-[1.7] text-slate-500 m-0 max-w-[60ch]">{cur.body}</p>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.key + "-stat"}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-[#00122F] p-6 text-center text-white"
          >
            <div className="font-serif text-[40px] md:text-[48px] leading-[0.95]">{cur.stat}</div>
            <div className="text-[13px] text-white/55 leading-[1.45] mt-2">{cur.statLabel}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2.5 mt-6">
        {HOW_BLOCKS.map((b, i) => (
          <button
            key={b.key}
            onClick={() => setActive(i)}
            aria-label={`Show ${b.title}`}
            className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-[#5b76d9]" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Program explorer — tabbed, auto-advancing (Contact pipeline pattern) ─────

function ProgramExplorer() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % PROGRAMS.length), 4000);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  const cur = PROGRAMS[active];

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-2 px-2 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none lg:justify-center">
        {PROGRAMS.map((p, i) => {
          const is = i === active;
          return (
            <button
              key={p.key}
              onClick={() => setActive(i)}
              aria-pressed={is}
              className={`shrink-0 snap-start px-5 py-3 rounded-full text-[14px] font-semibold transition-all duration-300 ${
                is ? "bg-[#1e2a3a] text-white shadow-[0_10px_28px_rgba(0,18,47,0.25)]" : "bg-white text-[#00122F] border border-slate-200 hover:border-[#A7BCF5]"
              }`}
            >
              {p.key}
            </button>
          );
        })}
      </div>

      <div className="mt-7 rounded-2xl bg-white border border-slate-200 p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8 items-center min-h-[240px] shadow-[0_16px_48px_rgba(0,18,47,0.06)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.key}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="font-serif font-normal text-[26px] md:text-[30px] text-[#00122F] mt-0 mb-1">{cur.name}</h3>
            <p className="text-[14px] font-medium text-[#5b76d9] mt-0 mb-4">{cur.who}</p>
            <p className="text-[15px] leading-[1.7] text-slate-500 m-0 max-w-[58ch]">{cur.what}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {cur.codes.map((c) => (
                <span key={c} className="font-mono text-[12px] font-bold text-[#5b76d9] bg-[#eef1fb] rounded-md px-2.5 py-1">
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.key + "-stat"}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-[#00122F] p-6 text-center text-white"
          >
            <div className="font-serif text-[44px] md:text-[52px] leading-[0.95]">{cur.stat}</div>
            <div className="text-[13px] text-white/55 leading-[1.45] mt-2">{cur.statLabel}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2.5 mt-6">
        {PROGRAMS.map((p, i) => (
          <button
            key={p.key}
            onClick={() => setActive(i)}
            aria-label={`Show ${p.name}`}
            className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-[#5b76d9]" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Sleep / CPAP recovery calculator (Contact calculator chassis) ────────────

const HANA_NONADHERENCE = 22; // % non-adherent with HANA, in production
const PER_PATIENT_DEFAULT = 1400;

function SleepCalculator() {
  const [setups, setSetups] = useState(300);
  const [nonAdherence, setNonAdherence] = useState(50); // current %
  const [perPatient, setPerPatient] = useState(PER_PATIENT_DEFAULT);

  const { patientsSaved, recovered } = useMemo(() => {
    const delta = Math.max(0, nonAdherence - HANA_NONADHERENCE) / 100;
    const saved = setups * 12 * delta;
    return { patientsSaved: saved, recovered: saved * perPatient };
  }, [setups, nonAdherence, perPatient]);

  const money = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;
  const count = (n: number) => Math.round(n).toLocaleString();

  const field = (
    label: string,
    value: number,
    set: (v: number) => void,
    opts: { min: number; max: number; step?: number; prefix?: string; suffix?: string },
  ) => (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-slate-500">{label}</span>
        <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1 focus-within:border-[#5b76d9] focus-within:ring-2 focus-within:ring-[#5b76d9]/20 transition shrink-0">
          {opts.prefix && <span className="text-slate-400 text-[13px] mr-0.5">{opts.prefix}</span>}
          <input
            type="number"
            value={value}
            min={opts.min}
            step={opts.step}
            onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
            className="w-[64px] bg-transparent outline-none text-[15px] font-semibold text-[#00122F] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {opts.suffix && <span className="text-slate-400 text-[13px] ml-0.5">{opts.suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        value={Math.min(value, opts.max)}
        min={opts.min}
        max={opts.max}
        step={opts.step ?? 1}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-3 w-full h-1.5 cursor-pointer accent-[#5b76d9]"
      />
    </div>
  );

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(0,18,47,0.08)]"
    >
      <div className="bg-white p-7 md:p-9">
        <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-5`}>Your sleep / DME program</p>
        <div className="grid grid-cols-1 gap-5">
          {field("New CPAP setups / month", setups, setSetups, { min: 25, max: 1000, step: 25 })}
          {field("Current 90-day non-adherence", nonAdherence, setNonAdherence, { min: 25, max: 83, suffix: "%" })}
          {field("Reimbursement per adherent patient", perPatient, setPerPatient, { min: 500, max: 3000, step: 100, prefix: "$" })}
        </div>
        <p className="text-[12px] text-slate-400 mt-5 leading-[1.6]">
          Estimates only, for illustration. Assumes HANA Remote brings non-adherence to ~22%, its
          production figure. 46–83% of new CPAP patients fail Medicare's 90-day threshold today.{" "}
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="text-[#5b76d9] underline">Get a tailored assessment →</a>
        </p>
      </div>
      <div className="bg-[#00122F] text-white p-7 md:p-9 flex flex-col justify-center">
        <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-3`}>Patients kept adherent</p>
        <div className="font-serif text-[56px] md:text-[72px] leading-[0.95]">
          ≈ {count(patientsSaved)}
          <span className="font-sans text-[18px] md:text-[22px] font-medium text-white/50"> / year</span>
        </div>
        <p className="text-[15px] text-white/60 mt-3">
          That's roughly <span className="font-semibold text-white">{money(recovered)}/year</span> in reimbursement that currently walks out the door.
        </p>
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[15px] leading-[1.6] text-white/60 m-0">
            Recovered with a phone call that actually works — non-adherence drops from{" "}
            <span className="font-semibold text-[#A7BCF5]">{nonAdherence}% to ~22%</span> in production.
          </p>
          <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#A7BCF5]"
              initial={{ width: "0%" }}
              whileInView={{ width: `${Math.max(0, Math.min(100, ((nonAdherence - HANA_NONADHERENCE) / Math.max(nonAdherence, 1)) * 100))}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold tracking-[1px] uppercase text-white/40 mt-2">
            <span>Share of non-adherence eliminated</span>
            <span>{nonAdherence > 0 ? Math.round(((nonAdherence - HANA_NONADHERENCE) / nonAdherence) * 100) : 0}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── The patient agent — accountability + protocol, conversation over the orb ──

// A short behavioral-change exchange: HANA isn't recording a number, it's
// holding the patient to the plan. Bubbles reveal one at a time on scroll.
const AGENT_TURNS: { who: "hana" | "patient"; text: string }[] = [
  { who: "hana", text: "Hi Maria, it's HANA calling for your evening check-in. How many hours did you wear the CPAP last night?" },
  { who: "patient", text: "Only about two. I took it off, it felt too tight." },
  { who: "hana", text: "That's really common in week one — let's fix the fit, not give up. Try loosening the top strap one notch tonight. Can we aim for four hours?" },
  { who: "patient", text: "Okay, I can try that." },
  { who: "hana", text: "Great. I'll check back tomorrow to see how it went. You're doing the hard part — showing up." },
];

const AGENT_PILLARS = [
  {
    icon: RI.heart,
    title: "An accountability partner",
    body: "Patients don't fail because they can't — they drift. HANA calls on cadence, notices when adherence slips, encourages, and holds them to the plan. That follow-through is what actually moves the number.",
  },
  {
    icon: RI.clipboard,
    title: "Running a real protocol",
    body: "Every conversation runs a clinician-built protocol for the condition — the right questions, the right thresholds, the right escalation. The warmth is human; the rigor is clinical.",
  },
];

function PatientAgentSection() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#f6f7fb] py-20 md:py-28 px-6 md:px-16">
      {/* soft periwinkle wash + the bloom orb behind the conversation (lower-left,
          low-opacity so it never fights the heading text) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 30% 75%, rgba(167,188,245,0.30) 0%, rgba(246,247,251,0) 60%)" }} />
        <div className="absolute left-[8%] bottom-[-8%] opacity-35 blur-[3px] hidden md:block">
          <div className="scale-[1.7]" style={{ transformOrigin: "center" }}>
            <HanaBloomOrb />
          </div>
        </div>
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
          <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The patient agent</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
            Not just a monitor. <em className="text-[#5b76d9]">The reason they stick with it.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-slate-500 max-w-[58ch] mx-auto mt-4">
            Data alone doesn't change behavior. A patient who feels seen does. HANA is the voice on
            the other end of the line — an accountability partner running a real clinical protocol.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Conversation mock */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[440px]"
          >
            <div className="rounded-[24px] bg-white/80 backdrop-blur-sm border border-white shadow-[0_30px_80px_rgba(0,18,47,0.14)] p-5 md:p-6">
              <div className="flex items-center gap-2.5 pb-4 mb-2 border-b border-slate-100">
                <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#eef1fb] text-[#5b76d9]">
                  <Glyph d={RI.phone} className="w-4 h-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-[#00122F]">HANA · evening check-in</div>
                  <div className="text-[11px] text-slate-400">CPAP adherence · HANA Sleep protocol</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {AGENT_TURNS.map((turn, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: reduce ? 0 : 0.3 + i * 0.5 }}
                    className={`flex ${turn.who === "patient" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.55] ${
                        turn.who === "hana"
                          ? "bg-[#1e2a3a] text-white rounded-bl-md"
                          : "bg-white text-[#00122F] border border-slate-200 rounded-br-md"
                      }`}
                    >
                      {turn.text}
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: reduce ? 1 : 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: reduce ? 0 : 0.3 + AGENT_TURNS.length * 0.5 }}
                  className="flex items-center gap-2 pt-1 text-[11px] text-slate-400"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                  Logged to chart · follow-up scheduled for tomorrow
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Two pillars: accountability + protocol */}
          <div className="space-y-6">
            {AGENT_PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-[12px] bg-white border border-slate-200 text-[#5b76d9] shrink-0 shadow-sm">
                  <Glyph d={p.icon} className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif font-normal text-[22px] md:text-[24px] leading-[1.2] mt-0 mb-2 text-[#00122F]">{p.title}</h3>
                  <p className="text-[15px] leading-[1.7] text-slate-500 m-0">{p.body}</p>
                </div>
              </motion.div>
            ))}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="pt-2">
              <p className="font-serif text-[20px] md:text-[22px] leading-[1.3] text-[#00122F] m-0">
                85% of patients pick up and engage — <em className="text-[#5b76d9]">because it doesn't feel like a machine.</em>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Small shared bits (Contact patterns) ─────────────────────────────────────

function RStatCell({ value, suffix, first, children }: { value: string; suffix?: string; first?: boolean; children: React.ReactNode }) {
  return (
    <div className={`px-5 md:px-11 ${first ? "" : "lg:border-l lg:border-[#dfe3ee]"}`}>
      <div className="font-serif text-[44px] md:text-[72px] leading-[0.95] mb-3 text-[#00122F]">
        {value}
        {suffix && <span className="text-[24px] md:text-[36px] text-[#5b76d9]">{suffix}</span>}
      </div>
      <div className="text-[15px] text-slate-500 leading-[1.5]">{children}</div>
    </div>
  );
}

function RFaqRow({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[17px] font-medium text-[#00122F] transition-colors duration-200 group-hover:text-[#5b76d9]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#5b76d9] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`rfaq-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[15px] leading-[1.7] text-slate-500 pb-5 pr-8 m-0">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HanaRemote() {
  return (
    <div className="bg-white text-[#00122F] font-sans">
      <SEO
        title="HANA Remote — Device-less Remote Patient Monitoring"
        useExactTitle
        type="product"
        description="HANA Remote is a device-less remote patient monitoring platform. We replace the hardware with a phone call — 85% patient engagement, reimbursable today, live inside your EHR."
        path="/hana-remote"
        keywords="device-less remote patient monitoring, RTM platform, remote therapeutic monitoring, CPAP adherence program, chronic care management, voice AI monitoring, ACCESS program, RPM engagement"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "HANA Remote", url: "https://www.hana.health/hana-remote" },
        ])}
      />

      {/* HERO — centered and dominant (Contact-style) */}
      <header className="bg-[#f6f7fb] pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 text-center">
          <motion.p {...fadeUp} className={`${eyebrow} text-[#5b76d9] m-0`}>
            HANA Remote · RPM without the device
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif font-normal text-[48px] sm:text-[64px] md:text-[84px] leading-[1.0] tracking-[-0.015em] mt-6 mb-0 mx-auto max-w-[15ch]"
          >
            Remote patient monitoring.
            <br />
            <em className="text-[#5b76d9]">Without the device.</em>
          </motion.h1>
          <motion.a
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#1e2a3a] text-white text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity mt-10 md:mt-12"
          >
            Book a demo →
          </motion.a>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="font-serif text-[19px] md:text-[22px] text-slate-600 mt-6 mb-0"
          >
            It knows the patient before it dials. <em className="text-[#5b76d9]">Documents the call after.</em>
          </motion.p>
        </div>
      </header>

      {/* THE LOOP — just the figure, on its own, directly below the hero on the
          same light field (like Contact's hero → diagram). Stations reframed as
          the RTM/RPM closed monitoring cycle: enroll → monitor → escalate → document. */}
      <LoopFigure
        light
        pulses={3}
        copy={{
          center: ["No device. No app.", "No behavior change."],
          centerChips: ["CPAP · 6.4 hrs/night ✓", "BP 128/82 · self-reported", "PHQ-9 · 4 · improving", "98977 · documented ✓"],
          cadence: {
            read: "Day one",
            reason: "Daily · weekly cadence",
            engage: "Only when flagged",
            writeback: "Monthly",
          },
          offRamp: { station: "engage", label: "Clinician worklist" },
          stations: {
            read: { label: "Enroll", body: "Consent, onboarding, and protocol setup — by phone, on day one." },
            reason: { label: "Monitor", body: "Scheduled check-ins capture symptoms, adherence, and vitals — wearables via API.", icon: "engage" },
            engage: { label: "Escalate", body: "Clinical flags routed to your worklist — a clinician on every flag.", icon: "reason" },
            writeback: { label: "Document", body: "Structured data to the EHR — RTM and CCM codes ready for attestation." },
          },
        }}
      />

      {/* SaaS window — the platform peek right after the loop */}
      <section className="bg-[#f6f7fb] pt-20 md:pt-24 pb-24 md:pb-28">
        <div className="max-w-[880px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SaaSWindow active={0}>
              <WorklistPane />
            </SaaSWindow>
          </motion.div>
        </div>
      </section>

      {/* THE PROBLEM — narrative + the CPAP number */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-6`}>The problem</p>
            <div className="font-serif text-[64px] md:text-[92px] leading-[0.9] text-[#00122F] mb-5">46–83%</div>
            <p className="text-lg leading-[1.6] text-[#00122F] m-0 max-w-[30ch]">
              of new CPAP patients fail Medicare's adherence threshold in the first 90 days.
              That's $1,400 per patient walking out the door.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="md:pt-2 space-y-5">
            <p className="text-base leading-[1.75] text-slate-700 m-0">
              Remote patient monitoring is reimbursable. RPM, RTM, CCM, ACCESS — the codes exist,
              the money is there, and CMS has been paying for monitoring programs for years.
            </p>
            <p className="text-base leading-[1.75] text-slate-700 m-0">
              They still fail. Always for the same reason. Patients don't use the devices you ship
              them. They don't open the apps you ask them to download. No engagement means no data.
              No data means no reimbursement. The program dies before it pays for itself.
            </p>
            <p className="text-base leading-[1.75] text-slate-700 m-0">
              The current fix is an offshore call center at $3 a call. It doesn't work either.
            </p>
            <p className="text-base leading-[1.75] font-semibold text-[#00122F] m-0">
              The problem was never the monitoring. It was the engagement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT HANA REMOTE DOES — manifesto with the orb as continuity anchor */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#f6f7fb] text-center overflow-hidden">
        <motion.div {...fadeUp} className="relative flex justify-center mb-2" aria-hidden="true">
          <div className="relative" style={{ width: 120, height: 120 }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="scale-[0.4]" style={{ transformOrigin: "center center" }}>
                <HanaBloomOrb />
              </div>
            </div>
          </div>
        </motion.div>
        <motion.h2
          {...fadeUp}
          className="font-serif font-normal text-[30px] sm:text-[38px] md:text-[44px] leading-[1.15] mx-auto max-w-[26ch] mt-0 mb-6 text-[#00122F]"
        >
          No device to ship. No app to download. <em className="text-[#5b76d9]">No behavior change required.</em>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-[17px] leading-[1.75] text-slate-500 max-w-[62ch] mx-auto m-0"
        >
          We call them. They pick up. We capture the data your program needs, drive the adherence
          that makes your reimbursement real, and write structured clinical data back to your EHR —
          ready for the clinician's review.
        </motion.p>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="text-[16px] leading-[1.7] font-semibold text-[#00122F] max-w-[52ch] mx-auto mt-5 mb-0"
        >
          We don't replace the clinician's billable interaction. We make it possible — and make their time count.
        </motion.p>
      </section>

      {/* HOW IT WORKS — interactive stage flow (Contact five-step pattern) */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>How it works</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              The conversation <em className="text-[#5b76d9]">is the monitoring.</em>
            </h2>
          </motion.div>
          <HowItWorksFlow />
        </div>
      </section>

      {/* TWO SIDES — the control panel (care team) + the agent (patient).
          Section 1: Compass, the SaaS control panel. */}
      <section className="bg-[#00122F] text-white py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>Compass · the control panel</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
              Your team reviews what matters. <em className="text-[#A7BCF5]">The rest is handled.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-white/55 max-w-[56ch] mx-auto mt-4">
              Compass is where your care team lives: enrollment, escalations, and billing
              documentation run on their own. What reaches your team is a flagged worklist — not a phone queue.
            </p>
          </motion.div>
          <DashboardTour />
        </div>
      </section>

      {/* Section 2: the patient agent — accountability + protocol, chat over orb. */}
      <PatientAgentSection />

      {/* PROGRAM EXPLORER */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#f6f7fb]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The programs</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              One platform. <em className="text-[#5b76d9]">Every monitoring program.</em>
            </h2>
          </motion.div>
          <ProgramExplorer />
        </div>
      </section>

      {/* CALCULATOR — sleep/CPAP recovery */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The adherence math</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              What does non-adherence <em className="text-[#5b76d9]">cost your program?</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-slate-500 max-w-[52ch] mx-auto mt-4">
              Run the numbers for a sleep / DME program — the sharpest case for the device-less model.
            </p>
          </motion.div>
          <SleepCalculator />
        </div>
      </section>

      {/* THE NUMBERS — stat band */}
      <section className="py-16 md:py-[72px] px-6 md:px-16 bg-[#f6f7fb]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-3`}>By the numbers</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.05] mt-0 mb-10 md:mb-[52px] max-w-[22ch] text-[#00122F]">
              Engagement you can bill against.
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10">
            <RStatCell value="85" suffix="%" first>
              Patient engagement vs. 20% for apps
            </RStatCell>
            <RStatCell value="50→22" suffix="%">
              CPAP non-adherence, in production
            </RStatCell>
            <RStatCell value="$1.4" suffix="K">
              Recovered per patient in sleep / DME programs
            </RStatCell>
            <RStatCell value="150" suffix="+">
              EHR integrations, live in your workflow
            </RStatCell>
          </div>
          <motion.div {...fadeUp} className="flex flex-wrap gap-2.5 mt-12">
            {["45+ clinical protocols", "4M+ patient interactions", "Live in the CMS ACCESS program", "RTM 98975–98981 · CCM · APCM"].map((c) => (
              <span key={c} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-[#00122F]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5b76d9]" aria-hidden="true" />
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHO IT'S FOR + FOUR-PAYER MODEL */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-10 lg:gap-16 items-start mb-16 md:mb-20">
            <motion.div {...fadeUp}>
              <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>Who it's for</p>
              <h2 className="font-serif font-normal text-[30px] md:text-[38px] leading-[1.12] mt-0 mb-4 text-[#00122F]">
                If you're paying a call center to chase patients — this is what replaces it.
              </h2>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="lg:pt-2">
              <p className="text-base leading-[1.75] text-slate-700 m-0">
                Sleep labs and DME providers with CPAP non-adherence problems. Primary care and
                chronic care management programs. Behavioral health organizations. CCM companies and
                RPM platforms. Any clinic running a monitoring program that's collapsing because
                patients don't engage.
              </p>
            </motion.div>
          </div>

          <motion.div {...fadeUp} className="text-center mb-10">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The four-payer model</p>
            <h2 className="font-serif font-normal text-[30px] md:text-[40px] leading-[1.1] mx-auto max-w-[26ch] text-[#00122F]">
              Revenue across four payment types — <em className="text-[#5b76d9]">not dependent on any one.</em>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PAYERS.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.04 + i * 0.07 }}
                className="rounded-2xl bg-[#f6f7fb] border border-slate-200 p-6"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-[#eef1fb] text-[#5b76d9] mb-4">
                  <Glyph d={p.icon} className="w-5 h-5" />
                </span>
                <h3 className="text-[17px] font-semibold mt-0 mb-2 text-[#00122F]">{p.title}</h3>
                <p className="text-[13.5px] leading-[1.65] text-slate-500 m-0">{p.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-4"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-[#eef1fb] text-[#5b76d9] shrink-0">
              <Glyph d={RI.globe} className="w-5 h-5" />
            </span>
            <p className="text-[14.5px] leading-[1.7] text-slate-600 m-0">
              <span className="font-semibold text-[#00122F]">And in Europe:</span> France's LATM pays
              the technology operator directly. Germany's DiGA is open for Class IIb digital
              therapeutics. The same platform, the same protocols, new markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BRIDGE — how it connects to HANA Contact */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#f6f7fb]">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            {...fadeUp}
            className="rounded-2xl bg-white border border-slate-200 border-l-[3px] border-l-[#A7BCF5] p-8 md:p-10 shadow-[0_16px_48px_rgba(0,18,47,0.06)]"
          >
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>Start with the front desk</p>
            <h3 className="font-serif font-normal text-[26px] md:text-[30px] leading-[1.2] mt-0 mb-4 text-[#00122F]">
              Most clinics start with HANA Contact. The switch to Remote is a switch — not a new project.
            </h3>
            <p className="text-[15px] leading-[1.75] text-slate-500 mt-0 mb-7 max-w-[64ch]">
              HANA Contact is the front desk — the easy first step. When you're ready to move to a
              full monitoring program, HANA Remote is already there. Same platform, same EHR
              integration, same patient relationships. No new onboarding.
            </p>
            <Link
              to="/hana-contact"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#1e2a3a] no-underline hover:text-[#5b76d9] transition-colors"
            >
              Explore HANA Contact →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[820px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>Questions? Answers.</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#00122F]">
              The things everyone asks.
            </h2>
          </motion.div>
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {R_FAQS.map((f, i) => (
              <RFaqRow key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00122F] text-white py-24 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-6`}>Ready to run a monitoring program that actually works?</p>
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[60px] leading-[1.04] mx-auto mb-8 max-w-[16ch]">
            Book a demo — <em>live in days.</em>
          </h2>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-[#00122F] rounded-[10px] font-semibold text-[15px] px-8 py-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </a>
          <p className="text-sm text-slate-400 mt-[18px]">
            Device-less by default · RTM / CCM / APCM / ACCESS · 150+ EHR integrations
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
