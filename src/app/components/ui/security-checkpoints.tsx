import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { ShieldCheck, Lock, BookLock, UserCheck, FileCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Security checkpoints ────────────────────────────────────────────────────
   A deliberate INVERSION of the hero loop: instead of a closed figure-8, a
   single STRAIGHT left→right track with five squared shield checkpoints. Each
   maps one security guarantee to a stage of the same Read→Reason→Engage→
   Write-Back call. A peach pulse sweeps one-directionally through the track and
   each checkpoint lights up as it passes. Dark navy, same design language as
   the loop; mobile is a dedicated vertical stepper (no curved geometry).
   Complements (does not duplicate) ComplianceSection, which carries the certs. */

/* Hana palette (shared with the loop diagram). */
const NAVY = "#00122F";
const BLUE = "#3B82F6";
const SKY = "#7CC4F0";
const PEACH = "#FFC091";
const RAIL_REST = "#1C3A60";
const INK_SOFT = "#9DB2CE";
const DOT_GRID = "#7CC4F0";

type Checkpoint = {
  id: string;
  num: number;
  stage: string; // ties back to the loop's verbs
  title: string;
  line: string;
  icon: LucideIcon;
  at: number; // 0..1 position along the straight track
};

/* Trust credentials cycled in the thin marquee ribbon. */
const TRUST_ITEMS = [
  "HIPAA-aligned",
  "SOC 2 Type II (in progress)",
  "ISO 27001-aligned",
  "GDPR",
  "BAA available",
  "Immutable audit trail",
  "Encrypted in transit & at rest",
  "Role-based access",
  "Human-in-the-loop escalation",
];

const CHECKPOINTS: Checkpoint[] = [
  {
    id: "encrypt",
    num: 1,
    stage: "Read",
    title: "Encrypted in transit & at rest",
    line: "Every chart pull and call runs over encrypted channels (TLS 1.2/1.3), with data encrypted at rest (AES-256).",
    icon: Lock,
    at: 0.1,
  },
  {
    id: "access",
    num: 2,
    stage: "Read",
    title: "Least-privilege access",
    line: "Hana sees only the fields a call needs, under role-based access. No standing access to PHI.",
    icon: ShieldCheck,
    at: 0.3,
  },
  {
    id: "protocol",
    num: 3,
    stage: "Reason",
    title: "Protocol-bound reasoning",
    line: "It acts inside your clinical protocols and guardrails — never a generic model's own judgment.",
    icon: BookLock,
    at: 0.5,
  },
  {
    id: "human",
    num: 4,
    stage: "Engage",
    title: "Risk routed to a human",
    line: "Anything clinical is handed off live to your nurse or on-call. Hana never decides care alone.",
    icon: UserCheck,
    at: 0.7,
  },
  {
    id: "audit",
    num: 5,
    stage: "Write-Back",
    title: "Logged & auditable",
    line: "Every call is recorded, transcribed, and written to the chart. Who said what, and why — reviewable any time.",
    icon: FileCheck,
    at: 0.9,
  },
];

/* Straight-track geometry (desktop SVG). */
const VW = 1000;
const VH = 150;
const TRACK_Y = 70;
const TRACK_X0 = 90;
const TRACK_X1 = 910;
const trackX = (at: number) => TRACK_X0 + at * (TRACK_X1 - TRACK_X0);
const NODE = 64; // squared node side
const SWEEP_MS = 7000;

/* Linear pulse: sweeps left→right, then restarts from the left (one-directional,
   the inverse of the loop's cyclical orbit). Activates the nearest checkpoint. */
function useSweep(enabled: boolean) {
  const progress = useMotionValue(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const controls = animate(progress, 1, {
      duration: SWEEP_MS / 1000,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [enabled, progress]);

  useMotionValueEvent(progress, "change", (v) => {
    const p = v % 1;
    let nearest: string | null = null;
    let best = 0.06;
    for (const c of CHECKPOINTS) {
      const d = Math.abs(p - c.at);
      if (d < best) {
        best = d;
        nearest = c.id;
      }
    }
    setActiveId((cur) => (cur === nearest ? cur : nearest));
  });

  return { progress, activeId };
}

export function SecurityCheckpoints() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const { progress, activeId } = useSweep(inView);
  const pulseCx = useTransform(progress, (v) => trackX(v % 1));

  return (
    <section
      className="relative w-full overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: NAVY }}
    >
      {/* blue radial glow + dot-grid texture — same surface as the loop */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-200px] z-0 h-[800px] w-[800px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
        }}
      />
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div ref={ref} className="relative mx-auto max-w-5xl px-2 md:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${DOT_GRID} 0.6px, transparent 0.6px)`,
              backgroundSize: "22px 22px",
              opacity: 0.05,
            }}
          />

          {/* Heading */}
          <div className="relative z-10 mx-auto mb-14 max-w-2xl text-center md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: SKY }}
            >
              Security
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-4 font-serif text-3xl leading-tight text-white md:text-[2.6rem] md:leading-[1.15]"
            >
              Safe at every step of the call.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed"
              style={{ color: INK_SOFT }}
            >
              Security is built into the workflow, not bolted around it — from the
              moment Hana reads the chart to the note it writes back.
            </motion.p>
          </div>

          {/* ── Desktop: straight checkpoint track ─────────────────────────── */}
          <div className="relative z-10 hidden md:block">
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              className="h-auto w-full overflow-visible"
              role="img"
              aria-label="Security checkpoints across every call: encrypted, access-controlled, protocol-bound, human-escalated, audited"
            >
              <defs>
                <linearGradient id="scRail" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={BLUE} />
                  <stop offset="50%" stopColor={SKY} />
                  <stop offset="100%" stopColor={BLUE} />
                </linearGradient>
                <filter id="scShadow" x="-60%" y="-60%" width="220%" height="220%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* resting + drawn rail */}
              <line x1={TRACK_X0} y1={TRACK_Y} x2={TRACK_X1} y2={TRACK_Y} stroke={RAIL_REST} strokeWidth={3} strokeLinecap="round" />
              <motion.line
                x1={TRACK_X0}
                y1={TRACK_Y}
                x2={TRACK_X1}
                y2={TRACK_Y}
                stroke="url(#scRail)"
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />

              {/* one-directional peach pulse */}
              <motion.circle
                r={7}
                fill={PEACH}
                stroke="#FFFFFF"
                strokeWidth={2}
                cy={TRACK_Y}
                style={{ cx: pulseCx }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ opacity: { duration: 0.4, delay: 1.4 } }}
              />

              {/* checkpoints */}
              {CHECKPOINTS.map((c, i) => {
                const x = trackX(c.at);
                const active = activeId === c.id;
                const Icon = c.icon;
                return (
                  <motion.g
                    key={c.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18, delay: inView ? 1 + i * 0.16 : 0 }}
                    style={{ transformOrigin: `${x}px ${TRACK_Y}px` }}
                  >
                    {/* expanding activation ring */}
                    <motion.rect
                      x={x - NODE / 2}
                      y={TRACK_Y - NODE / 2}
                      width={NODE}
                      height={NODE}
                      rx={16}
                      fill="none"
                      stroke={PEACH}
                      strokeWidth={2}
                      initial={{ scale: 1, opacity: 0 }}
                      animate={active ? { scale: 1.4, opacity: [0, 0.6, 0] } : { scale: 1, opacity: 0 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      style={{ transformOrigin: `${x}px ${TRACK_Y}px` }}
                    />
                    {/* squared node (inverts the loop's circular discs) */}
                    <motion.rect
                      x={x - NODE / 2}
                      y={TRACK_Y - NODE / 2}
                      width={NODE}
                      height={NODE}
                      rx={16}
                      filter="url(#scShadow)"
                      animate={{ fill: active ? PEACH : "#FFFFFF", stroke: active ? PEACH : "rgba(255,255,255,0.7)" }}
                      transition={{ duration: 0.3 }}
                      strokeWidth={1.5}
                    />
                    <foreignObject x={x - 17} y={TRACK_Y - 17} width={34} height={34}>
                      <div className="flex h-[34px] w-[34px] items-center justify-center">
                        <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} style={{ color: NAVY }} />
                      </div>
                    </foreignObject>
                  </motion.g>
                );
              })}
            </svg>

            {/* labels under each checkpoint */}
            <div className="relative mt-4 grid grid-cols-5 gap-3">
              {CHECKPOINTS.map((c) => {
                const active = activeId === c.id;
                return (
                  <div key={c.id} className="text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: SKY }}>
                      {c.stage}
                    </span>
                    <div className="mt-1 flex items-center justify-center gap-1.5">
                      <motion.span
                        className="font-serif text-2xl leading-none"
                        animate={{ color: active ? PEACH : "#3E587C" }}
                        transition={{ duration: 0.3 }}
                      >
                        {c.num}
                      </motion.span>
                      <span className="text-sm font-semibold tracking-tight text-white">{c.title}</span>
                    </div>
                    <p className="mx-auto mt-1.5 max-w-[12rem] text-[12px] leading-relaxed" style={{ color: INK_SOFT }}>
                      {c.line}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mobile: vertical stepper (mirrors the loop's mobile pattern) ── */}
          <MobileCheckpoints inView={inView} progress={progress} activeId={activeId} />

          {/* thin trust marquee — a continuous ribbon of credentials */}
          <TrustMarquee inView={inView} />

          {/* hand-off to the compliance section below */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            Cloud, private cloud, or dedicated — the same controls on every call.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* Thin, continuously-scrolling ribbon of trust credentials. Pure CSS marquee
   (duplicated track for a seamless loop), masked to fade at both edges. */
function TrustMarquee({ inView }: { inView: boolean }) {
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS]; // duplicate for seamless loop
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="relative z-10 mt-12 overflow-hidden md:mt-16"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <style>{`
        @keyframes sc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .sc-marquee-track { animation: sc-marquee 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .sc-marquee-track { animation: none; } }
      `}</style>
      <div className="sc-marquee-track flex w-max items-center gap-3">
        {items.map((label, i) => (
          <span key={i} className="flex items-center gap-3">
            <span
              className="whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                backgroundColor: "rgba(255,255,255,0.04)",
                color: INK_SOFT,
              }}
            >
              {label}
            </span>
            <span aria-hidden style={{ color: SKY, opacity: 0.5 }}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}

const MC_ROW_H = 116;
const MC_RAIL_X = 28;
const MC_NODE = 52;

function MobileCheckpoints({
  inView,
  progress,
  activeId,
}: {
  inView: boolean;
  progress: ReturnType<typeof useMotionValue<number>>;
  activeId: string | null;
}) {
  const railTop = MC_ROW_H / 2;
  const railBottom = railTop + (CHECKPOINTS.length - 1) * MC_ROW_H;
  const railSpan = railBottom - railTop;
  const pulseTop = useTransform(progress, (v) => railTop + (v % 1) * railSpan);

  return (
    <div className="relative z-10 mx-auto w-full max-w-md md:hidden">
      {/* rail */}
      <div
        className="absolute w-[3px] -translate-x-1/2 rounded-full"
        style={{
          left: MC_RAIL_X,
          top: railTop,
          height: railSpan,
          background: `linear-gradient(${BLUE}, ${SKY}, ${BLUE})`,
          opacity: 0.85,
        }}
      />
      {/* pulse */}
      <motion.div
        className="absolute z-30 h-3.5 w-3.5 rounded-full border-2 border-white shadow"
        style={{ left: MC_RAIL_X, top: pulseTop, x: "-50%", y: "-50%", backgroundColor: PEACH, opacity: inView ? 1 : 0 }}
      />

      {CHECKPOINTS.map((c, i) => {
        const active = activeId === c.id;
        const Icon = c.icon;
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: 14 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.12 }}
            className="relative flex items-center"
            style={{ minHeight: MC_ROW_H }}
          >
            {/* squared node on the rail */}
            <div className="absolute z-20 -translate-x-1/2" style={{ left: MC_RAIL_X }}>
              <motion.div
                className="flex items-center justify-center rounded-xl border shadow-md"
                animate={{
                  backgroundColor: active ? PEACH : "#FFFFFF",
                  borderColor: active ? PEACH : "rgba(255,255,255,0.7)",
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{ width: MC_NODE, height: MC_NODE }}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} style={{ color: NAVY }} />
              </motion.div>
            </div>

            {/* card */}
            <motion.div
              className="ml-[68px] flex-1 rounded-2xl border p-4"
              animate={{
                backgroundColor: active ? "rgba(255,192,145,0.10)" : "rgba(255,255,255,0.03)",
                borderColor: active ? "rgba(255,192,145,0.45)" : "rgba(255,255,255,0.08)",
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: SKY }}>
                {c.stage}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <motion.span
                  className="font-serif text-2xl leading-none"
                  animate={{ color: active ? PEACH : "#3E587C" }}
                  transition={{ duration: 0.3 }}
                >
                  {c.num}
                </motion.span>
                <span className="text-base font-semibold tracking-tight text-white">{c.title}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: INK_SOFT }}>
                {c.line}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default SecurityCheckpoints;
