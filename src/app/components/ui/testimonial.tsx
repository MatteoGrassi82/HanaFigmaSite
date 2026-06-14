import { useRef } from "react";
import { type Variants } from "motion/react";
import { TimelineContent } from "./timeline-animation";

/* ── Mosaic tiles ─────────────────────────────────────────────────────────
   A mix of people-quote tiles and big stat tiles, laid out as a solid-color
   (Hana-tinted) mosaic. 4 real people + 2 stat tiles. Stat tiles show a big
   number plus a big title inside the box, with a smaller supporting line. */

type Tile =
  | {
      kind: "quote";
      quote: string;
      name: string;
      role: string;
      avatarUrl: string;
      tint: Tint;
    }
  | {
      kind: "stat";
      value: string;
      /** Big bold headline inside the box. */
      title: string;
      /** Smaller supporting line. */
      label: string;
      tint: Tint;
    };

type Tint = "blue" | "peach" | "mint" | "sky";

/* Solid, saturated Hana-leaning colors. */
const TINT: Record<Tint, string> = {
  blue: "bg-[#3B82F6] text-white",
  peach: "bg-[#FFC091] text-slate-900",
  mint: "bg-[#00122F] text-white",
  sky: "bg-[#7CC4F0] text-slate-900",
};

const STAT_ACCENT: Record<Tint, string> = {
  blue: "text-white",
  peach: "text-[#7A3C12]",
  mint: "text-[#7CC4F0]",
  sky: "text-[#0B3D63]",
};

/* Whether a tile background is dark (needs light text) or light (dark text). */
const IS_DARK: Record<Tint, boolean> = {
  blue: true,
  peach: false,
  mint: true,
  sky: false,
};

const quoteText = (t: Tint) => (IS_DARK[t] ? "text-white/90" : "text-slate-700");
const nameText = (t: Tint) => (IS_DARK[t] ? "text-white" : "text-slate-900");
const roleText = (t: Tint) => (IS_DARK[t] ? "text-white/70" : "text-slate-500");
const statLabel = (t: Tint) => (IS_DARK[t] ? "text-white/80" : "text-slate-600");

const TILES: Tile[] = [
  {
    kind: "stat",
    value: "2.3×",
    title: "More patients per care coordinator",
    label: "with AI-assisted chronic care outreach",
    tint: "blue",
  },
  {
    kind: "quote",
    quote:
      "In care coordination the biggest bottleneck was always the touch time documentation. Hana handles the monthly calls, captures the conversation in structured notes that go straight into the chart, and flags anyone who needs a same day callback.",
    name: "Fakhrudin Mohamed, MD",
    role: "Board-Certified Physician",
    avatarUrl: "/avatars/fakhrudin.png",
    tint: "peach",
  },
  {
    kind: "quote",
    quote:
      "The Hana team understood that quality assessments require both consistency and flexibility. Their Voice AI conducts standardized screening tools, adapts questions based on patient responses, and captures 340% more clinical data while maintaining protocol validity.",
    name: "Katie Murphy Psy.D.",
    role: "Founder of Penry",
    avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSo8EnMM6OdUF76MM7VtByTGOQ024clSnnSQ&s",
    tint: "mint",
  },
  {
    kind: "quote",
    quote:
      "Getting elderly patients ready for surgery over the phone is nearly impossible — they don't pick up, they miss voicemails, and if they show up unprepared the case gets cancelled. HANA reaches them, walks them through everything they need to know, and flags whoever still isn't ready so we can step in.",
    name: "Lorri Hanes",
    role: "Shoorah",
    avatarUrl: "https://www.eftandmindfulness.com/pictures/profile/pimage-2849-187-photo.jpg",
    tint: "sky",
  },
  {
    kind: "stat",
    value: "53%",
    title: "Fewer day-of cancellations",
    label: "when Hana handles surgical prep outreach",
    tint: "mint",
  },
  {
    kind: "quote",
    quote:
      "What impressed me about Hana wasn't just the AI technology though that's excellent it was how well the team understood our challenges. They helped us customize the system for our patients. It felt like a real partnership, not a typical vendor relationship.",
    name: "Jonathan Wayne",
    role: "Founder of NTX",
    avatarUrl: "/avatars/jonathan.jpg",
    tint: "peach",
  },
];

const revealVariants: Variants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
  hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
};

function QuoteTile({
  tile,
  index,
  timelineRef,
}: {
  tile: Extract<Tile, { kind: "quote" }>;
  index: number;
  timelineRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <TimelineContent
      animationNum={index}
      customVariants={revealVariants}
      timelineRef={timelineRef}
      className={`relative flex h-full flex-col justify-between rounded-2xl p-6 ${TINT[tile.tint]}`}
    >
<p className={`text-[15px] leading-relaxed md:text-base ${quoteText(tile.tint)}`}>
        &ldquo;{tile.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <img
          src={tile.avatarUrl}
          alt={tile.name}
          width={48}
          height={48}
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <div>
          <h3 className={`text-sm font-semibold leading-tight ${nameText(tile.tint)}`}>
            {tile.name}
          </h3>
          <p className={`text-[13px] ${roleText(tile.tint)}`}>{tile.role}</p>
        </div>
      </div>
    </TimelineContent>
  );
}

function StatTile({
  tile,
  index,
  timelineRef,
}: {
  tile: Extract<Tile, { kind: "stat" }>;
  index: number;
  timelineRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <TimelineContent
      animationNum={index}
      customVariants={revealVariants}
      timelineRef={timelineRef}
      className={`flex h-full flex-col justify-between rounded-2xl p-6 ${TINT[tile.tint]}`}
    >
      <div
        className={`font-serif text-5xl leading-none sm:text-6xl md:text-7xl ${STAT_ACCENT[tile.tint]}`}
      >
        {tile.value}
      </div>
      <div className="mt-6">
        <h3 className={`font-serif text-xl leading-tight sm:text-2xl md:text-3xl ${nameText(tile.tint)}`}>
          {tile.title}
        </h3>
        <p className={`mt-2 text-sm leading-relaxed ${statLabel(tile.tint)}`}>{tile.label}</p>
      </div>
    </TimelineContent>
  );
}

export function ClientFeedback() {
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={timelineRef} className="w-full bg-white py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <TimelineContent
            as="h2"
            animationNum={0}
            customVariants={revealVariants}
            timelineRef={timelineRef}
            className="font-serif text-3xl text-slate-900 md:text-4xl"
          >
            Trusted by the teams running routine care
          </TimelineContent>
          <TimelineContent
            as="p"
            animationNum={1}
            customVariants={revealVariants}
            timelineRef={timelineRef}
            className="mx-auto text-slate-500"
          >
            Real outcomes, in the words of the clinics and partners using Hana.
          </TimelineContent>
        </div>

        {/* Mosaic: auto-flowing rows of quote + stat tiles. */}
        <div className="mt-12 grid auto-rows-[1fr] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile, i) =>
            tile.kind === "quote" ? (
              <QuoteTile key={i} tile={tile} index={i} timelineRef={timelineRef} />
            ) : (
              <StatTile key={i} tile={tile} index={i} timelineRef={timelineRef} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default ClientFeedback;
