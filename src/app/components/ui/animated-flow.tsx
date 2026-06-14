import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "motion/react";
import NumberFlow from "@number-flow/react";
import { Phone, FileText, Stethoscope, BellRing } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── "How Hana works" animated pipeline ────────────────────────────────────
   A scroll-driven walkthrough of the Hana flow. As the section scrolls into
   view: a connecting spine draws itself top-to-bottom, each stage card springs
   in staggered, and a closing stat counts up. Built on motion.dev (motion/react
   v12) to match the rest of the site — no fixed timeline, everything reacts to
   the user's scroll position. Scaffold for iteration on /preview. */

type Stage = {
  icon: LucideIcon;
  step: string;
  title: string;
  body: string;
  /* Tailwind classes for the icon chip — Hana palette. */
  chip: string;
};

const STAGES: Stage[] = [
  {
    icon: Phone,
    step: "01",
    title: "Hana reaches the patient",
    body: "Outbound calls that actually connect — voicemail-aware, time-zone smart, and persistent so the touch point never gets missed.",
    chip: "bg-[#3B82F6] text-white",
  },
  {
    icon: Stethoscope,
    step: "02",
    title: "A real clinical conversation",
    body: "Standardized screening that adapts to the patient's answers, capturing far more structured data while staying protocol-valid.",
    chip: "bg-[#00122F] text-white",
  },
  {
    icon: FileText,
    step: "03",
    title: "Structured notes, into the chart",
    body: "Every call becomes a clean, structured note that flows straight into the EHR — no manual documentation, no copy-paste.",
    chip: "bg-[#FFC091] text-[#7A3C12]",
  },
  {
    icon: BellRing,
    step: "04",
    title: "The right escalations surface",
    body: "Anyone who needs a same-day callback is flagged for the care team, so humans spend their time exactly where it matters.",
    chip: "bg-[#7CC4F0] text-[#0B3D63]",
  },
];

/* Staggered spring reveal for each stage card. */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      type: "spring",
      stiffness: 90,
      damping: 16,
    },
  }),
};

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  const Icon = stage.icon;
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="relative flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-7"
    >
      {/* Icon chip — sits over the spine on desktop. */}
      <div
        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stage.chip}`}
      >
        <Icon className="h-6 w-6" strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <span className="font-serif text-sm font-medium text-blue-500">
          {stage.step}
        </span>
        <h3 className="mt-0.5 font-serif text-xl leading-tight text-slate-900 md:text-2xl">
          {stage.title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
          {stage.body}
        </p>
      </div>
    </motion.div>
  );
}

/* The self-drawing vertical spine connecting the stages. Its height is bound
   to scroll progress through the list, so it "draws" as the user scrolls. */
function Spine({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-[2.65rem] top-0 hidden w-px -translate-x-1/2 md:block"
    >
      {/* track */}
      <div className="absolute inset-0 bg-slate-200" />
      {/* drawn fill */}
      <motion.div
        style={{ height }}
        className="absolute left-0 top-0 w-px bg-gradient-to-b from-[#3B82F6] via-[#3B82F6] to-[#7CC4F0]"
      />
    </div>
  );
}

export function AnimatedFlow() {
  const listRef = useRef<HTMLDivElement>(null);

  // Track scroll through the stage list to drive the spine.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.4"],
  });
  const spine = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section className="w-full bg-slate-50 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-widest text-blue-600"
          >
            How Hana works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-serif text-3xl leading-tight text-slate-900 md:text-4xl"
          >
            One conversation, the whole loop closed
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-4 text-slate-500"
          >
            From the first ring to the note in the chart, Hana runs the routine
            outreach end-to-end — and hands your team only what needs a human.
          </motion.p>
        </div>

        {/* Stage list with self-drawing spine */}
        <div ref={listRef} className="relative mx-auto mt-14 max-w-2xl space-y-4">
          <Spine progress={spine} />
          {STAGES.map((stage, i) => (
            <StageCard key={stage.step} stage={stage} index={i} />
          ))}
        </div>

        {/* Closing stat */}
        <StatBanner />
      </div>
    </section>
  );
}

function StatBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 18 }}
      className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-2 rounded-2xl bg-[#00122F] px-6 py-8 text-center sm:px-8 sm:py-10"
    >
      <CountUp />
      <p className="text-sm text-slate-300">
        of routine outreach handled before a human is ever needed
      </p>
    </motion.div>
  );
}

/* Counts up to the target once it scrolls into view. */
function CountUp() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref);
  return (
    <div ref={ref} className="font-serif text-5xl text-white sm:text-6xl md:text-7xl">
      <NumberFlow value={inView ? 85 : 0} suffix="%" />
    </div>
  );
}

/* Tiny helper: fires `true` once the element first enters the viewport. */
import { useInView } from "motion/react";
function useInViewOnce(ref: React.RefObject<Element | null>) {
  return useInView(ref, { once: true, amount: 0.6 });
}

export default AnimatedFlow;
