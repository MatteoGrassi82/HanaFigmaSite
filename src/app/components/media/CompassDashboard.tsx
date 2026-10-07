import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Check } from "lucide-react";

// Compact lucide-style icon paths (24×24) used across the page.
export const RI = {
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

export function Glyph({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// ── Dashboard mock data (stylized, illustrative) ─────────────────────────────
//
// CLEANED 7 Oct 2026, when this mock went onto /care. It used to show RPM, RTM,
// ACCESS and CPAP patients, "$142K billable this month", "85% engagement vs 20%
// app baseline" and an adherence line climbing to 85%. Every one of those was
// either a parked programme or an embargoed number, and the billing tab read
// "met" as "what HANA has captured toward it", i.e. HANA's call time counting
// toward the threshold, which the site may never say. Now: only the four
// published programmes (CCM, PCM, BHI, APCM), "met" is the STAFF time your team
// logged, and no figure is a dollar amount or an outcome rate. Keep it that way.

// Priority queue — each row is a task to work, not a roster entry: why it
// surfaced (reason) + the next best action, ranked by clinical risk.
const TASK_ROWS = [
  { initials: "MA", name: "M. Alvarez", program: "COPD · CCM", reason: "No answer on 3 attempts", level: "red", act: "Call now" },
  { initials: "DT", name: "D. Tran", program: "CHF · PCM", reason: "Reported weight up 3 lbs in 48h", level: "red", act: "Escalate" },
  { initials: "RP", name: "R. Patel", program: "Post-op · follow-up", reason: "Pain 8/10 on day-7 check-in", level: "red", act: "Review" },
  { initials: "JC", name: "J. Chen", program: "Hypertension · CCM", reason: "Reported BP 158/94 on check-in", level: "amber", act: "Review" },
  { initials: "SB", name: "S. Bianchi", program: "Behavioral · BHI", reason: "PHQ-9 = 14 · needs eyes", level: "amber", act: "Review" },
  { initials: "EW", name: "E. Whitmore", program: "Diabetes · CCM", reason: "Missed two scheduled check-ins", level: "amber", act: "Nudge" },
  { initials: "LR", name: "L. Rossi", program: "CCM · Monthly", reason: "Care-plan review documented", level: "green", act: "Ready to attest" },
  { initials: "KO", name: "K. Okafor", program: "Diabetes · APCM", reason: "Glucose log captured by voice", level: "green", act: "Done" },
];

// Billing readiness. Each programme bills its own code family, so a row shows
// the codes that apply and the requirement that gates them. "req" is the
// threshold; "met" is the time YOUR STAFF logged against it this month (or, for
// APCM, which counts no minutes, the level). Never HANA's call time.
//   CCM  — 99490 + 99439 (clinical staff, 20 min)
//   PCM  — 99426 (clinical staff, 30 min, one condition)
//   BHI  — 99484 (clinical staff, 20 min)
//   APCM — G0556/G0557/G0558 (monthly by complexity, no time threshold)
type BillProgram = "CCM" | "PCM" | "BHI" | "APCM";
const BILLING_ROWS: {
  initials: string; name: string; program: BillProgram;
  codes: string; req: string; met: string; pct: number; status: string;
}[] = [
  { initials: "LR", name: "L. Rossi",   program: "CCM",  codes: "99490 · 99439", req: "20 min staff time",  met: "24 min logged",  pct: 100, status: "billable" },
  { initials: "GA", name: "G. Adeyemi", program: "APCM", codes: "G0557",         req: "Monthly · Level 2",  met: "2 conditions",   pct: 100, status: "billable" },
  { initials: "DT", name: "D. Tran",    program: "PCM",  codes: "99426",         req: "30 min staff time",  met: "31 min logged",  pct: 100, status: "billable" },
  { initials: "SB", name: "S. Bianchi", program: "BHI",  codes: "99484",         req: "20 min staff time",  met: "14 min logged",  pct: 70,  status: "needtime" },
  { initials: "JC", name: "J. Chen",    program: "CCM",  codes: "99490",         req: "20 min staff time",  met: "21 min logged",  pct: 100, status: "billable" },
  { initials: "EW", name: "E. Whitmore",program: "CCM",  codes: "99490",         req: "20 min staff time",  met: "16 min logged",  pct: 80,  status: "atrisk" },
  { initials: "DM", name: "D. Mensah",  program: "APCM", codes: "G0556",         req: "Monthly · Level 1",  met: "consented",      pct: 100, status: "billable" },
  { initials: "MA", name: "M. Alvarez", program: "CCM",  codes: "99490",         req: "20 min staff time",  met: "6 min logged",   pct: 30,  status: "atrisk" },
];

const ANALYTICS_KPIS = [
  { label: "Check-ins completed", value: "1,284", sub: "this month", trend: "up" },
  { label: "Flags reviewed", value: "38", sub: "by your clinicians today", trend: "flat" },
  { label: "Notes ready to attest", value: "218", sub: "this month", trend: "up" },
  { label: "Escalation rate", value: "9%", sub: "of check-ins reach a clinician", trend: "flat" },
];
// Monthly check-ins completed, as a share of the month's scheduled calls (12 pts).
const ANALYTICS_TREND = [52, 55, 58, 60, 61, 63, 64, 66, 67, 68, 69, 70];
const ANALYTICS_MIX = [
  { label: "CCM", pct: 46, color: "var(--color-brand)" },
  { label: "APCM", pct: 24, color: "#7c92e6" },
  { label: "PCM", pct: 18, color: "var(--color-brand-soft)" },
  { label: "BHI", pct: 12, color: "#c1cdf5" },
];

const DASH_TABS = ["Task queue", "Billing", "Analytics"] as const;

// ── Dashboard panes ──────────────────────────────────────────────────────────

function LevelDot({ level }: { level: string }) {
  const c = level === "red" ? "bg-red-400" : level === "amber" ? "bg-amber-400" : "bg-emerald-400";
  return <span className={`w-2 h-2 rounded-full ${c} shrink-0`} aria-hidden="true" />;
}

// ACT-color helpers for the task actions.
function actClasses(level: string, primary: boolean) {
  if (level === "green") return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  if (level === "amber") return "bg-amber-50 text-amber-600 border border-amber-100";
  return primary
    ? "bg-brand text-white border border-brand" // red → the one you act on
    : "bg-red-50 text-red-500 border border-red-100";
}

// TASK QUEUE — the priority worklist: reason it surfaced + a next-best action
// button, ranked by clinical + billing risk. You work the queue top-down.
function TaskQueuePane({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const rows = compact ? TASK_ROWS.slice(0, 4) : TASK_ROWS;
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[1px] text-ink-mute border-b border-rule-soft bg-paper-bright">
        <span>Priority queue · 38 of 412 need action</span>
        {!compact && <span className="hidden sm:block">Ranked by risk + billing</span>}
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: reduce ? 0 : 0.15 + i * 0.08 }}
          className="flex items-center gap-3 px-4 py-3 border-b border-rule-soft hover:bg-[#fafbfe] transition-colors"
        >
          <span className="text-[11px] font-semibold text-ink-mute w-4 shrink-0 tabular-nums">{i + 1}</span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-tint text-brand text-[11px] font-bold shrink-0">
            {r.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <LevelDot level={r.level} />
              <span className="text-[13px] font-semibold text-ink truncate">{r.name}</span>
              <span className="text-[11px] text-ink-mute truncate hidden md:block">{r.program}</span>
            </div>
            <p className="text-[12px] text-ink-soft m-0 mt-0.5 truncate">{r.reason}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg shrink-0 ${actClasses(r.level, true)}`}>
            {r.act === "Call now" && <Glyph d={RI.phone} className="w-3 h-3" />}
            {r.act}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Mini progress bar toward a threshold (check-in days / management minutes).
function Meter({ value, max, tone }: { value: number; max: number; tone: string }) {
  const reduce = useReducedMotion();
  const pct = Math.min(100, (value / max) * 100);
  const color = tone === "billable" ? "#10b981" : tone === "atrisk" ? "#f59e0b" : "var(--color-brand)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-paper-2 overflow-hidden min-w-[52px]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: reduce ? `${pct}%` : 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
      <span className="text-[11px] font-semibold text-ink-soft tabular-nums w-11 text-right shrink-0">{value}/{max}</span>
    </div>
  );
}


// BILLING — care-management + monitoring readiness. Per patient: progress toward
// that program's requirement (device-days/minutes for RPM·RTM, care-management
// minutes for CCM·CoCM, monthly enrollment for APCM·ACCESS), with a live status.
// Status describes whether the program's *requirement* is met and the record is
// ready for the clinician's attestation — never that HANA has billed anything.
const BILL_STATUS = {
  billable: { chip: "bg-emerald-50 text-emerald-600", label: "Ready to attest" },
  atrisk: { chip: "bg-amber-50 text-amber-600", label: "Short" },
  needtime: { chip: "bg-brand-tint text-brand", label: "Needs time" },
} as const;

// Per-program accent for the code chip — keeps the six programs visually distinct.
const PROGRAM_CHIP: Record<BillProgram, string> = {
  CCM:  "bg-[#eafaf1] text-emerald-600",
  PCM:  "bg-brand-tint text-brand",
  BHI:  "bg-[#f3eefb] text-[#8b5cf6]",
  APCM: "bg-[#fdf3ea] text-amber-600",
};

function BillingPane() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col h-full">
      {/* month-readiness summary strip */}
      <div className="grid grid-cols-3 border-b border-rule-soft bg-paper-bright">
        {[
          { v: "218", l: "Requirements met", c: "text-emerald-600" },
          { v: "34", l: "Short of threshold", c: "text-amber-600" },
          { v: "4", l: "Programs · CCM · PCM · BHI · APCM", c: "text-navy" },
        ].map((s, i) => (
          <div key={s.l} className={`px-4 py-3.5 ${i > 0 ? "border-l border-rule-soft" : ""}`}>
            <div className={`font-serif text-[24px] leading-none ${s.c}`}>{s.v}</div>
            <div className="text-[11px] text-ink-mute mt-1">{s.l}</div>
          </div>
        ))}
      </div>
      {/* column header */}
      <div className="hidden md:grid grid-cols-[1.5fr_1.1fr_1.4fr_0.9fr] gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-[1px] text-ink-mute border-b border-rule-soft">
        <span>Patient</span>
        <span>Program · codes</span>
        <span>Staff time logged</span>
        <span className="text-right">Status</span>
      </div>
      <div className="flex-1">
        {BILLING_ROWS.map((b) => {
          const st = BILL_STATUS[b.status as keyof typeof BILL_STATUS];
          const tone = b.status === "billable" ? "#10b981" : b.status === "needtime" ? "var(--color-brand)" : "#f59e0b";
          return (
            <div key={b.name} className="grid grid-cols-[1fr_auto] md:grid-cols-[1.5fr_1.1fr_1.4fr_0.9fr] gap-3 items-center px-4 py-3 border-b border-rule-soft hover:bg-[#fafbfe] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-tint text-brand text-[10px] font-bold shrink-0">{b.initials}</span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-ink truncate">{b.name}</div>
                  <div className="text-[11px] text-ink-mute md:hidden">{b.program} · {b.codes}</div>
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-1">
                <span className={`inline-flex w-fit items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${PROGRAM_CHIP[b.program]}`}>{b.program}</span>
                <span className="text-[11px] text-ink-mute tabular-nums">{b.codes}</span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-ink-soft">{b.req}</span>
                  <span className="text-[11px] font-semibold text-ink-soft tabular-nums">{b.met}</span>
                </div>
                <div className="h-1.5 rounded-full bg-paper-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: tone }}
                    initial={{ width: reduce ? `${b.pct}%` : 0 }}
                    whileInView={{ width: `${b.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${st.chip}`}>
                  {b.status === "billable" && <Check className="w-3 h-3" strokeWidth={3} />}
                  {st.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between px-4 py-3 mt-auto border-t border-rule-soft bg-paper-bright">
        <span className="text-[12px] text-ink-soft">One click exports the month's documentation packet — attributed time, escalations &amp; consent, for your biller to work.</span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy-soft rounded-lg px-3 py-1.5 shrink-0">Export documentation</span>
      </div>
    </div>
  );
}

// ANALYTICS — program health at a glance: KPI tiles, adherence trend, program mix.
function AnalyticsPane() {
  const reduce = useReducedMotion();
  const W = 320, H = 90;
  const pts = ANALYTICS_TREND.map((v, i) => {
    const x = (i / (ANALYTICS_TREND.length - 1)) * W;
    const y = H - ((v - 30) / 60) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const areaPts = `0,${H} ${pts} ${W},${H}`;
  return (
    <div className="flex flex-col h-full p-4 md:p-5">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 shrink-0">
        {ANALYTICS_KPIS.map((k) => (
          <div key={k.label} className="rounded-xl border border-rule-soft bg-paper-bright p-3.5">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.5px] text-ink-mute">{k.label}</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-serif text-[28px] leading-none text-navy">{k.value}</span>
              {k.trend === "up" && <span className="text-[11px] font-semibold text-emerald-500">▲</span>}
              {k.trend === "down" && <span className="text-[11px] font-semibold text-emerald-500">▼</span>}
            </div>
            <div className="text-[11px] text-ink-mute mt-1 leading-snug">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 flex-1 min-h-0">
        {/* Check-ins completed trend */}
        <div className="rounded-xl border border-rule-soft bg-paper-bright p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="text-[12px] font-semibold text-ink-soft">Scheduled check-ins completed</span>
            <span className="text-[11px] text-ink-mute">12 months</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full flex-1 min-h-0" aria-label="Scheduled check-ins completed, by month, illustrative">
            <defs>
              <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.polygon
              points={areaPts}
              fill="url(#analyticsFill)"
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <motion.polyline
              points={pts}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="flex justify-between text-[10px] text-ink-mute mt-1 shrink-0"><span>{ANALYTICS_TREND[0]}%</span><span className="text-brand font-semibold">{ANALYTICS_TREND[ANALYTICS_TREND.length - 1]}% now</span></div>
        </div>
        {/* Program mix */}
        <div className="rounded-xl border border-rule-soft bg-paper-bright p-4 flex flex-col">
          <span className="text-[12px] font-semibold text-ink-soft shrink-0">Program mix</span>
          <div className="mt-3.5 flex-1 flex flex-col justify-between gap-2.5">
            {ANALYTICS_MIX.map((m) => (
              <div key={m.label} className="flex items-center gap-2.5">
                <span className="text-[11px] font-medium text-ink-soft w-12 shrink-0">{m.label}</span>
                <div className="h-2 flex-1 rounded-full bg-paper-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: m.color }}
                    initial={{ width: reduce ? `${m.pct}%` : 0 }}
                    whileInView={{ width: `${m.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-ink-soft w-8 text-right tabular-nums shrink-0">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// A light "seen on a computer" SaaS window: browser chrome (traffic lights +
// address bar) and an app sidebar. When onNav is provided the sidebar items are
// the live navigation for the tour; without it the window is a static peek.
const DASH_NAV = [
  { label: "Task queue", icon: RI.alert, path: "queue" },
  { label: "Billing", icon: RI.dollar, path: "billing" },
  { label: "Analytics", icon: RI.activity, path: "analytics" },
];

// KPI mini-stats shown in the sidebar rail — makes it read like a real product.
const DASH_KPIS = [
  { label: "Reached this week", value: "312", trend: "up" },
  { label: "Flagged today", value: "38", trend: "flat" },
  { label: "Ready to attest", value: "218", trend: "up" },
];

// A full-application desktop screen (laptop 16:10 proportions): browser chrome +
// app top bar (search / bell / avatar) + rich left rail + the active view. Sized
// like a real dashboard rather than a small card.
function SaaSWindow({ active, onNav, children }: { active: number; onNav?: (i: number) => void; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-paper-bright border border-rule shadow-[0_50px_110px_rgba(0,18,47,0.22)] overflow-hidden text-left">
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#eef0f4] border-b border-rule">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <div className="flex-1 flex justify-center min-w-0 px-2">
          <span className="inline-flex items-center gap-1.5 bg-paper-bright border border-rule rounded-md px-3 py-1 text-[11px] text-ink-mute font-medium max-w-full truncate">
            <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            app.hana.health/remote/{DASH_NAV[active].path}
          </span>
        </div>
        <span className="w-12 shrink-0" aria-hidden="true" />
      </div>

      {/* App body — readable fixed height on mobile; laptop aspect on sm+ so it
          reads as a full desktop screen without cramping on phones. */}
      <div className="flex items-stretch h-[440px] sm:h-auto sm:aspect-[16/10] sm:max-h-[640px]">
        {/* Left rail */}
        <div className="hidden sm:flex flex-col w-52 lg:w-56 shrink-0 bg-paper-bright border-r border-rule-soft">
          <div className="flex items-center gap-2.5 px-4 h-14 border-b border-rule-soft">
            {/* Compass app mark — three ascending bars in a periwinkle tile */}
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-[#3f57c0] shadow-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 15v3 M12 9v9 M18 5v13" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-ink">Compass</div>
              <div className="text-[10px] text-ink-mute">by HANA</div>
            </div>
          </div>
          <div className="px-3 py-4 flex flex-col flex-1">
            <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-ink-mute">Care team</p>
            {DASH_NAV.map((n, i) => (
              <button
                key={n.label}
                onClick={onNav ? () => onNav(i) : undefined}
                disabled={!onNav}
                aria-pressed={i === active}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors text-left mb-0.5 ${
                  i === active ? "bg-brand-tint text-brand" : `text-ink-soft ${onNav ? "hover:bg-paper-2 cursor-pointer" : "cursor-default"}`
                }`}
              >
                <Glyph d={n.icon} className="w-[18px] h-[18px]" />
                {n.label}
                {i === active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />}
              </button>
            ))}
            {/* KPI mini-cards */}
            <div className="mt-6 space-y-2.5">
              {DASH_KPIS.map((k) => (
                <div key={k.label} className="rounded-lg border border-rule-soft bg-paper-bright px-3 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-mute">{k.label}</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-[18px] font-semibold text-navy leading-none">{k.value}</span>
                    {k.trend === "up" && <span className="text-[11px] font-semibold text-emerald-500">▲</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 pt-4 border-t border-rule-soft">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-tint text-brand text-[10px] font-bold">DR</span>
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-ink-soft truncate">Dr. Reyes</div>
                <div className="text-[10.5px] text-ink-mute">412 monitored</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main column: app top bar + scrolling view */}
        <div className="flex-1 min-w-0 flex flex-col bg-paper-bright">
          <div className="flex items-center gap-3 px-5 h-14 border-b border-rule-soft shrink-0">
            <span className="text-[15px] font-semibold text-navy">{DASH_NAV[active].label}</span>
            <div className="ml-auto hidden md:flex items-center gap-2 bg-paper-2 border border-rule rounded-lg px-3 py-1.5 text-[12px] text-ink-mute w-56">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              Search patients…
            </div>
            <span className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-paper-2 text-ink-mute" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand" />
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </div>
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
      <div className="max-w-[1100px] mx-auto">
        {/* Top tab bar — the switcher above the window. Auto-cycles through the
            three panels (pauses on hover); each pill carries a fill bar that
            drains over the dwell so the "pa pa pa" advance reads on screen. */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex gap-1.5 p-1.5 rounded-full bg-paper-bright/[0.06] border border-white/10">
            {DASH_TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                aria-pressed={tab === i}
                className={`relative overflow-hidden px-4 sm:px-5 py-2 rounded-full text-[12.5px] sm:text-[13px] font-semibold transition-colors ${
                  tab === i ? "bg-paper-bright text-navy" : "text-white/80 hover:text-white/90"
                }`}
              >
                {tab === i && !reduce && !paused && (
                  <motion.span
                    key={`fill-${tab}`}
                    aria-hidden
                    className="absolute inset-0 bg-brand/15"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 4.5, ease: "linear" }}
                    style={{ originX: 0 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <SaaSWindow active={tab}>
          <div className="h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                className="h-full"
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                transition={{ duration: 0.35 }}
              >
                {tab === 0 && <TaskQueuePane />}
                {tab === 1 && <BillingPane />}
                {tab === 2 && <AnalyticsPane />}
              </motion.div>
            </AnimatePresence>
          </div>
        </SaaSWindow>
        <p className="text-center text-[12px] text-white/70 mt-4">Illustrative interface. Your team reviews what matters — the rest is handled.</p>
      </div>
    </div>
  );
}

// Public entry point for the Compass dashboard visual.
export function CompassDashboard() {
  return <DashboardTour />;
}
