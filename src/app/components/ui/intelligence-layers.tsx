import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  BrainCircuit,
  Database,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Intelligence layers ─────────────────────────────────────────────────────
   The calm, static replacement for the spinning Reasoning Engine orbital. Five
   co-equal capability layers shown as a clean responsive grid (no orbit, no
   perpetual motion — just a staggered fade-in on scroll). Same navy surface as
   the loop so it reads as part of the "how it works" story. The Safety layer
   cross-references the dedicated Security section lower on the page. */

const NAVY = "#00122F";
const SKY = "#7CC4F0";
const INK_SOFT = "#9DB2CE";
const DOT_GRID = "#7CC4F0";

type Layer = {
  title: string;
  body: string;
  icon: LucideIcon;
  /** muted accent for the icon chip */
  accent: string;
};

const LAYERS: Layer[] = [
  {
    title: "Memory",
    body: "Remembers what the patient said last time — barriers, preferences, history. Every conversation builds on the last.",
    icon: BrainCircuit,
    accent: "#3B82F6",
  },
  {
    title: "EHR & patient data",
    body: "Reads and writes to 150+ EHR systems. Pulls context before every call, sends structured notes back.",
    icon: Database,
    accent: "#3B82F6",
  },
  {
    title: "Clinical protocols",
    body: "Follows your screening tools and care pathways exactly. Validated instruments — no improvisation on clinical content.",
    icon: BookOpen,
    accent: "#7CC4F0",
  },
  {
    title: "Engagement",
    body: "Picks the right channel, time, language, and tone. Adapts to each patient's behavior and preferences.",
    icon: HeartHandshake,
    accent: "#7CC4F0",
  },
  {
    title: "Safety & observability",
    body: "Audit trails, risk detection, escalation. Every decision logged, every call reviewable. (More on security below.)",
    icon: ShieldCheck,
    accent: "#FFC091",
  },
];

export function IntelligenceLayers() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      className="relative w-full overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: NAVY }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-[-160px] z-0 h-[640px] w-[640px]"
        style={{
          background:
            "radial-gradient(circle, rgba(124,196,240,0.12) 0%, transparent 70%)",
        }}
      />
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div ref={ref} className="relative mx-auto max-w-6xl">
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
              Reasoning engine
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-4 font-serif text-3xl leading-tight text-white md:text-[2.6rem] md:leading-[1.15]"
            >
              Smart enough to know when to talk. And when to escalate.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed"
              style={{ color: INK_SOFT }}
            >
              Five layers of intelligence behind every call — it reads the chart,
              remembers the patient, follows your protocols, and flags what matters.
            </motion.p>
          </div>

          {/* Layer grid: 5-up on desktop, 1-col on mobile */}
          <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LAYERS.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${layer.accent}1f` }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} style={{ color: layer.accent }} />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-white">
                    {layer.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: INK_SOFT }}>
                    {layer.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntelligenceLayers;
