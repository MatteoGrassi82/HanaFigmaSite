import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  AnimatePresence,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type Variants,
} from "motion/react";
import { LOOP_ICONS } from "./loop-icons";
import { getLocale } from "../../../lib/i18n";

/* ── Locale ─────────────────────────────────────────────────────────────────
   All visible copy is rendered in Italian when the site locale is Italian and
   stays English otherwise. Translations are kept local to this component. */
const IT = getLocale() === "it";
const t = (en: string, it: string) => (IT ? it : en);

/* ── Hana "closes the loop" infinity diagram ───────────────────────────────
   A refined flat 2D figure-8 on a warm canvas. Two-rail track painted with a
   navy→blue→sky GRADIENT that flows across the loop; nodes sit on the surface
   with a soft shadow. A pulse travels and STOPS at each station, which fills
   with accent and animates its icon, then hands off (Read → Reason → Engage →
   Write-Back → loop). No glow/neon — richness comes from a real surface,
   gradient color, elevation, texture, and type. motion.dev + SVG. No headline
   (placed by the page). Lives on /preview. */

/* ── Palette — Hana brand, dark navy surface ────────────────────────────────
   Deep brand navy card so the gradient rails + white nodes pop. FLAT, no glow:
   drama from the dark field, polish from restraint. White/light text, white
   elevated nodes, navy→blue→sky rails. */
const NAVY = "#00122F"; // primary brand navy (the surface)
const BLUE = "#3B82F6"; // Hana blue accent
const SKY = "#7CC4F0"; // sky accent
const PEACH = "#FFC091"; // warm brand accent — the one thing in motion (pulse)
const CANVAS_TOP = "#00122F"; // matches the section field — no card seam
const CANVAS_BOT = "#00122F"; // pure brand navy, same as Reasoning Engine
const FIELD = "#00122F"; // section field — identical to Reasoning Engine bg
const RAIL_REST = "#1C3A60"; // resting rail — muted navy-blue (visible on dark)
const INK = "#FFFFFF"; // primary text — white
const INK_SOFT = "#9DB2CE"; // muted text — cool light slate
const DOT_GRID = "#7CC4F0"; // texture dots (very low opacity, cool)

/* ── Geometry ──────────────────────────────────────────────────────────────*/
const VIEW_W = 1000;
const VIEW_H = 500;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const OUT_X = 100;
const TOP_Y = 70;
const BOT_Y = VIEW_H - TOP_Y;

const CENTER_PATH = [
  `M ${CX} ${CY}`,
  `C ${CX - 120} ${TOP_Y}, ${OUT_X} ${TOP_Y + 30}, ${OUT_X} ${CY}`,
  `C ${OUT_X} ${BOT_Y - 30}, ${CX - 120} ${BOT_Y}, ${CX} ${CY}`,
  `C ${CX + 120} ${TOP_Y}, ${VIEW_W - OUT_X} ${TOP_Y + 30}, ${VIEW_W - OUT_X} ${CY}`,
  `C ${VIEW_W - OUT_X} ${BOT_Y - 30}, ${CX + 120} ${BOT_Y}, ${CX} ${CY}`,
  `Z`,
].join(" ");

function scaledPath(scale: number) {
  const sx = (x: number) => CX + (x - CX) * scale;
  const sy = (y: number) => CY + (y - CY) * scale;
  return [
    `M ${sx(CX)} ${sy(CY)}`,
    `C ${sx(CX - 120)} ${sy(TOP_Y)}, ${sx(OUT_X)} ${sy(TOP_Y + 30)}, ${sx(OUT_X)} ${sy(CY)}`,
    `C ${sx(OUT_X)} ${sy(BOT_Y - 30)}, ${sx(CX - 120)} ${sy(BOT_Y)}, ${sx(CX)} ${sy(CY)}`,
    `C ${sx(CX + 120)} ${sy(TOP_Y)}, ${sx(VIEW_W - OUT_X)} ${sy(TOP_Y + 30)}, ${sx(VIEW_W - OUT_X)} ${sy(CY)}`,
    `C ${sx(VIEW_W - OUT_X)} ${sy(BOT_Y - 30)}, ${sx(CX + 120)} ${sy(BOT_Y)}, ${sx(CX)} ${sy(CY)}`,
    `Z`,
  ].join(" ");
}
const RAIL_OUTER = scaledPath(1.03);
const RAIL_INNER = scaledPath(0.97);

const LEFT_X = 222;
const RIGHT_X = VIEW_W - LEFT_X;
const UP_Y = 132;
const DOWN_Y = VIEW_H - UP_Y;

/* Mobile uses a dedicated vertical stepper (see MobileTimeline), not a
   figure-8 — phones get a top-to-bottom flow that's readable and tappable. */

/* Icon sizing inside each node (bumped up alongside the bigger discs). */
const ICON_BOX = 34; // foreignObject box (viewBox units)
const ICON_SIZE = 27; // rendered icon px

type Station = {
  id: string;
  label: string;
  x: number;
  y: number;
  accent: string;
  corner: "tl" | "bl" | "tr" | "br";
  num: number;
  body: string;
  at: number;
  icon?: StationId;
};

/** Optional copy overrides so the loop works as a standalone unit on any page.
 *  Every field falls back to the homepage (front-desk) copy, so existing
 *  call sites are unchanged. Station geometry/animation stay internal — only
 *  the words are configurable. */
type StationId = "read" | "reason" | "engage" | "writeback";

export type LoopDiagramCopy = {
  eyebrow?: string;
  heading?: string;
  sub?: string;
  center?: [string, string];
  footnote?: string;
  /** Per-station overrides. `icon` remaps to another station's glyph (e.g. a
   *  monitoring loop can use the waveform on its "Monitor" station). */
  stations?: Partial<Record<StationId, { label?: string; body?: string; icon?: StationId }>>;
  /** Small cadence captions rendered beside each station disc ("Daily", "Monthly"…). */
  cadence?: Partial<Record<StationId, string>>;
  /** A dashed branch off one station to a labeled chip — the loop's single human
   *  exit (e.g. Escalate → "Clinician worklist"). */
  offRamp?: { station: StationId; label: string };
  /** Small readings cycling under the center caption ("6.4 hrs/night ✓"…). */
  centerChips?: string[];
};

const STATIONS: Station[] = [
  {
    id: "read",
    label: t("Read", "Legge"),
    x: LEFT_X,
    y: UP_Y,
    accent: BLUE,
    corner: "tl",
    num: 1,
    body: t(
      "Pulls the chart, history, and protocols first.",
      "Apre prima la cartella, lo storico e i protocolli.",
    ),
    at: 0.125,
  },
  {
    id: "reason",
    label: t("Reason", "Ragiona"),
    x: LEFT_X,
    y: DOWN_Y,
    accent: BLUE,
    corner: "bl",
    num: 2,
    body: t(
      "Picks the channel they'll actually answer.",
      "Sceglie il canale a cui il paziente risponde davvero.",
    ),
    at: 0.375,
  },
  {
    id: "engage",
    label: t("Engage", "Contatta"),
    x: RIGHT_X,
    y: UP_Y,
    accent: SKY,
    corner: "tr",
    num: 3,
    body: t(
      "Confirms, chases auth, preps, intakes — routes risk to your nurse.",
      "Conferma, segue le autorizzazioni, prepara, raccoglie i dati — e gira al tuo infermiere ciò che è a rischio.",
    ),
    at: 0.625,
  },
  {
    id: "writeback",
    label: t("Write-Back", "Scrive in cartella"),
    x: RIGHT_X,
    y: DOWN_Y,
    accent: SKY,
    corner: "br",
    num: 4,
    body: t(
      "Structured note, straight to the chart.",
      "Nota strutturata, direttamente nella cartella.",
    ),
    at: 0.875,
  },
];

const STOPS = [...STATIONS].sort((a, b) => a.at - b.at);

const CORNER_POS: Record<Station["corner"], string> = {
  tl: "md:left-0 md:top-4 md:text-left md:items-start",
  bl: "md:left-0 md:bottom-4 md:text-left md:items-start",
  tr: "md:right-0 md:top-4 md:text-right md:items-end",
  br: "md:right-0 md:bottom-4 md:text-right md:items-end",
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

function CornerLabel({
  station,
  index,
  active,
  light = false,
}: {
  station: Station;
  index: number;
  active: boolean;
  light?: boolean;
}) {
  const alignEnd = station.corner === "tr" || station.corner === "br";
  return (
    <motion.div
      custom={index}
      variants={labelVariants}
      animate={{ opacity: active ? 1 : 0.6 }}
      className={`flex max-w-[16rem] flex-col items-center text-center transition-opacity duration-300 md:absolute ${CORNER_POS[station.corner]}`}
    >
      <div className={`flex items-baseline gap-3 ${alignEnd ? "md:flex-row-reverse" : ""}`}>
        {/* big refined step number */}
        <motion.span
          className="font-serif text-5xl leading-none"
          animate={{ color: active ? PEACH : light ? "#B7C3DA" : "#3E587C" }}
          transition={{ duration: 0.3 }}
        >
          {station.num}
        </motion.span>
        <span className="text-xl font-semibold tracking-tight" style={{ color: light ? NAVY : INK }}>
          {station.label}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: light ? "#64748b" : INK_SOFT }}>
        {station.body}
      </p>
    </motion.div>
  );
}

/* ── Continuous pulse ───────────────────────────────────────────────────────
   The pulse orbits the loop without stopping. We drive a motion value 0→1
   forever (linear) and derive which station is "active" from the pulse's live
   position: a node lights up while the pulse is within ACTIVE_WINDOW of its
   `at`. No dwell, no halting — one smooth, unbroken loop. */
const LAP_MS = 9000; // one full lap
const ACTIVE_WINDOW = 0.07; // ± fraction of the lap a node stays lit around its `at`

/** Shortest distance between two points on a 0..1 ring. */
function ringDist(a: number, b: number) {
  const d = Math.abs(a - b);
  return Math.min(d, 1 - d);
}

function useContinuousPulse(enabled: boolean, offsets: number[] = [0]) {
  const progress = useMotionValue(0); // 0..1 around the loop
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const controls = animate(progress, 1, {
      duration: LAP_MS / 1000,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [enabled, progress]);

  useMotionValueEvent(progress, "change", (v) => {
    // With multiple pulses on the rail, a station lights up when ANY pulse is near.
    let nearest: string | null = null;
    let best = ACTIVE_WINDOW;
    for (const s of STATIONS) {
      for (const off of offsets) {
        const d = ringDist((v + off) % 1, s.at);
        if (d < best) {
          best = d;
          nearest = s.id;
        }
      }
    }
    setActiveId((cur) => (cur === nearest ? cur : nearest));
  });

  return { progress, activeId };
}

export function LoopDiagram({
  copy,
  bare = false,
  light = false,
  pulses = 1,
}: { copy?: LoopDiagramCopy; bare?: boolean; light?: boolean; pulses?: number } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const nPulses = Math.min(3, Math.max(1, pulses));
  const pulseOffsets = nPulses === 1 ? [0] : nPulses === 2 ? [0, 0.5] : [0, 1 / 3, 2 / 3];
  const { progress, activeId } = useContinuousPulse(inView, pulseOffsets);
  // map 0..1 loop progress → offsetDistance strings, one per pulse on the rail
  const offsetDistance = useTransform(progress, (v) => `${(v % 1) * 100}%`);
  const offsetDistance2 = useTransform(progress, (v) => `${((v + (pulseOffsets[1] ?? 0)) % 1) * 100}%`);
  const offsetDistance3 = useTransform(progress, (v) => `${((v + (pulseOffsets[2] ?? 0)) % 1) * 100}%`);
  const pulseDistances = [offsetDistance, offsetDistance2, offsetDistance3].slice(0, nPulses);

  // Center readings cycle (only when provided — e.g. the monitoring loop)
  const chips = copy?.centerChips;
  const [chipIdx, setChipIdx] = useState(0);
  useEffect(() => {
    if (!inView || !chips || chips.length < 2) return;
    const id = setInterval(() => setChipIdx((i) => (i + 1) % chips.length), 2400);
    return () => clearInterval(id);
  }, [inView, chips]);

  // Resolve copy: overrides win, otherwise the homepage (front-desk) defaults.
  const c = {
    eyebrow: copy?.eyebrow ?? t("How it works", "Come funziona"),
    heading:
      copy?.heading ??
      t(
        "It knows the patient before it dials. Documents the call after.",
        "Conosce il paziente prima di chiamare. Documenta la chiamata dopo.",
      ),
    sub:
      copy?.sub ??
      t(
        "Not an answering service. Hana works the whole call — chart to note — and routes only what needs a human to your team.",
        "Non una semplice segreteria telefonica. Hana gestisce l'intera chiamata — dalla cartella alla nota — e gira al tuo team solo ciò che richiede una persona.",
      ),
    center:
      copy?.center ??
      ([t("No app. No login.", "Nessuna app. Nessun login."), t("No behavior change.", "Nessun cambio di abitudini.")] as [string, string]),
    footnote:
      copy?.footnote ??
      t(
        "You set the escalation rules. A person on every clinical flag, full audit trail on every call.",
        "Le regole di escalation le imposti tu. Una persona su ogni segnalazione clinica, audit trail completo su ogni chiamata.",
      ),
  };
  const stations = STATIONS.map((s) => ({
    ...s,
    ...copy?.stations?.[s.id as "read" | "reason" | "engage" | "writeback"],
  }));

  return (
    <section
      className={`relative w-full overflow-hidden ${bare ? "py-10 md:py-14" : "py-20 md:py-28"}`}
      style={{ backgroundColor: light ? "#f6f7fb" : FIELD }}
    >
      {/* blue radial glow at top — matches the Reasoning Engine section so the
          two read as one continuous block (dark theme only) */}
      {!light && (
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-200px] z-0 h-[400px] w-[400px] -translate-x-1/2 md:h-[800px] md:w-[800px]"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
        }}
      />
      )}
      <div className="relative z-10 mx-auto px-4 md:px-8">
        <div ref={ref} className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 md:px-14 md:py-6">
          {/* subtle dot-grid texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${DOT_GRID} 0.6px, transparent 0.6px)`,
              backgroundSize: "22px 22px",
              opacity: 0.05,
            }}
          />

          {/* Section heading (omitted in bare mode — the figure stands alone) */}
          {!bare && (
          <div className="relative z-10 mx-auto mb-14 max-w-3xl text-center md:mb-20">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: SKY }}
            >
              {c.eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-4 font-serif text-2xl leading-snug text-white sm:text-3xl md:text-[2.6rem] md:leading-[1.15]"
            >
              {c.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed"
              style={{ color: INK_SOFT }}
            >
              {c.sub}
            </motion.p>
          </div>
          )}

          {/* ── Desktop: animated figure-8 ──────────────────────────────── */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative hidden md:block md:min-h-[26rem]"
          >
            {stations.map((s, i) => (
              <CornerLabel key={s.id} station={s} index={i} active={activeId === s.id} light={light} />
            ))}

            <div className="mx-auto w-full max-w-3xl md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                className="h-auto w-full overflow-visible"
                role="img"
                aria-label={t(
                  "Hana's closed-loop workflow: read, reason, engage, write-back",
                  "Il flusso a ciclo chiuso di Hana: legge, ragiona, contatta, scrive in cartella",
                )}
              >
                <defs>
                  {/* gradient that flows navy → blue → sky across the loop */}
                  <linearGradient id="railFlow" x1="0" y1="0.5" x2="1" y2="0.5">
                    {/* bright across the whole loop so the rail never sinks
                        into the navy field at the ends */}
                    <stop offset="0%" stopColor={BLUE} />
                    <stop offset="25%" stopColor="#5AA0E0" />
                    <stop offset="50%" stopColor={SKY} />
                    <stop offset="75%" stopColor="#5AA0E0" />
                    <stop offset="100%" stopColor={BLUE} />
                  </linearGradient>
                  {/* soft elevation shadow for nodes (dark, reads under white discs) */}
                  <filter id="nodeShadow" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="6"
                      floodColor="#000000"
                      floodOpacity="0.45"
                    />
                  </filter>
                </defs>

                {/* resting rails */}
                <path d={RAIL_OUTER} fill="none" stroke={RAIL_REST} strokeWidth={3} strokeLinecap="round" />
                <path d={RAIL_INNER} fill="none" stroke={RAIL_REST} strokeWidth={3} strokeLinecap="round" />

                {/* gradient rails draw in on scroll */}
                <motion.path
                  d={RAIL_OUTER}
                  fill="none"
                  stroke="url(#railFlow)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d={RAIL_INNER}
                  fill="none"
                  stroke="url(#railFlow)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.1 }}
                />

                {/* pulse(s) — the WARM element(s) orbiting the cool track in a
                    constant, unbroken loop. One pulse = a single call; several
                    pulses = a monitoring program with patients mid-cycle. */}
                {pulseDistances.map((dist, k) => (
                  <motion.circle
                    key={k}
                    r={k === 0 ? 7 : 6}
                    fill={PEACH}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    style={{ offsetPath: `path("${CENTER_PATH}")`, offsetDistance: dist }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: k === 0 ? 1 : 0.85 } : { opacity: 0 }}
                    transition={{ opacity: { duration: 0.4, delay: 1.6 + k * 0.2 } }}
                  />
                ))}

                {/* cadence captions — the program rhythm beside each station */}
                {copy?.cadence &&
                  stations.map((s) => {
                    const label = copy.cadence?.[s.id as StationId];
                    if (!label) return null;
                    const below = s.corner === "tl" || s.corner === "tr";
                    // shift aside when the off-ramp branch leaves this station
                    const rampShift = copy?.offRamp?.station === s.id ? -64 : 0;
                    return (
                      <motion.text
                        key={`cad-${s.id}`}
                        x={s.x + rampShift}
                        y={below ? s.y + 62 : s.y - 52}
                        textAnchor="middle"
                        fontSize="11.5"
                        fontWeight="700"
                        letterSpacing="1.5"
                        style={{ fill: light ? "#94a3b8" : "rgba(255,255,255,0.38)", textTransform: "uppercase" }}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 2, duration: 0.6 }}
                      >
                        {label.toUpperCase()}
                      </motion.text>
                    );
                  })}

                {/* off-ramp — the loop's single human exit: a dashed branch from
                    one station to a labeled chip that lights when the pulse passes */}
                {copy?.offRamp && (() => {
                  const st = stations.find((s) => s.id === copy.offRamp!.station);
                  if (!st) return null;
                  const activeRamp = activeId === st.id;
                  const chipW = Math.max(110, copy.offRamp!.label.length * 7.4 + 28);
                  const chipX = st.x + 24;
                  const chipY = st.y + 86;
                  return (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 2.2, duration: 0.6 }}
                    >
                      <motion.path
                        d={`M ${st.x + 8} ${st.y + 42} C ${st.x + 18} ${st.y + 62}, ${chipX + 14} ${chipY - 34}, ${chipX + 26} ${chipY - 16}`}
                        fill="none"
                        strokeWidth={1.8}
                        strokeDasharray="5 5"
                        animate={{ stroke: activeRamp ? PEACH : light ? "rgba(91,118,217,0.55)" : "rgba(124,196,240,0.45)" }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.rect
                        x={chipX}
                        y={chipY - 14}
                        width={chipW}
                        height={30}
                        rx={15}
                        animate={{
                          fill: light ? "#ffffff" : "rgba(255,255,255,0.06)",
                          stroke: activeRamp ? PEACH : light ? "#e2e6f0" : "rgba(255,255,255,0.14)",
                          scale: activeRamp ? 1.04 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        strokeWidth={1.4}
                        style={{ transformOrigin: `${chipX + chipW / 2}px ${chipY + 1}px`, transformBox: "fill-box" }}
                      />
                      <motion.text
                        x={chipX + chipW / 2}
                        y={chipY + 5.5}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="600"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        animate={{ fill: light ? NAVY : "rgba(255,255,255,0.85)" }}
                      >
                        {copy.offRamp!.label}
                      </motion.text>
                    </motion.g>
                  );
                })()}

                {stations.map((s, i) => (
                  <StationNode key={s.id} station={s} index={i} appear={inView} active={activeId === s.id} />
                ))}

                {/* center caption */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <ellipse cx={CX} cy={CY} rx={172} ry={52} fill={light ? "#f6f7fb" : CANVAS_BOT} />
                  <text
                    x={CX}
                    y={CY - 4}
                    textAnchor="middle"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", fill: light ? NAVY : INK }}
                  >
                    <tspan x={CX} fontSize="22">{c.center[0]}</tspan>
                    <tspan x={CX} dy="28" fontSize="22">{c.center[1]}</tspan>
                  </text>
                  {/* live readings cycling under the caption — the chart filling up */}
                  {chips && chips.length > 0 && (
                    <AnimatePresence mode="wait">
                      <motion.text
                        key={chipIdx}
                        x={CX}
                        y={CY + 42}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="600"
                        style={{ fontFamily: "'DM Sans', sans-serif", fill: light ? "#5b76d9" : SKY }}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.35 }}
                      >
                        {chips[chipIdx]}
                      </motion.text>
                    </AnimatePresence>
                  )}
                </motion.g>
              </svg>
            </div>
          </motion.div>

          {/* ── Mobile: vertical timeline ───────────────────────────────── */}
          <MobileTimeline inView={inView} progress={progress} activeId={activeId} stations={stations} center={c.center} light={light} />

          {/* Reassurance line (omitted in bare mode) */}
          {!bare && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-10 mx-auto mt-12 max-w-2xl text-center text-sm leading-relaxed md:mt-16"
            style={{ color: INK_SOFT }}
          >
            {c.footnote}
          </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Mobile vertical stepper ─────────────────────────────────────────────────
   A purpose-built mobile layout (NOT a squeezed figure-8). A rail runs down the
   left; each station is a row: a node disc ON the rail + a card (number, title,
   body) beside it. A peach pulse travels down the rail and each step lights up
   in sequence (driven by the shared `progress` / `activeId`). Clean, tappable,
   zero collisions. Desktop keeps the figure-8. */
const MS_ROW_H = 116; // px per step row
const MS_RAIL_X = 28; // px — rail / node-center x
const MS_NODE_R = 26; // px node radius

function MobileTimeline({
  inView,
  progress,
  activeId,
  stations = STATIONS,
  center,
  light = false,
}: {
  inView: boolean;
  progress: ReturnType<typeof useMotionValue<number>>;
  activeId: string | null;
  stations?: Station[];
  center: [string, string];
  light?: boolean;
}) {
  const NODE = MS_NODE_R * 2;
  const railTop = MS_ROW_H / 2;
  const railBottom = railTop + (stations.length - 1) * MS_ROW_H;
  const railSpan = railBottom - railTop;
  // Pulse position down the rail: sweeps top→bottom then bottom→top, forever.
  const pulseTop = useTransform(progress, (v) => {
    const p = v % 1;
    const tri = p < 0.5 ? p * 2 : (1 - p) * 2; // 0→1→0
    return railTop + tri * railSpan;
  });

  return (
    <div className="relative z-10 mx-auto w-full max-w-md md:hidden">
      {/* Rail track (behind everything) */}
      <div
        className="absolute w-[3px] -translate-x-1/2 rounded-full"
        style={{
          left: MS_RAIL_X,
          top: railTop,
          height: railSpan,
          background: `linear-gradient(${BLUE}, ${SKY}, ${BLUE})`,
          opacity: 0.85,
        }}
      />
      {/* Traveling peach pulse */}
      <motion.div
        className="absolute z-30 h-3.5 w-3.5 rounded-full border-2 border-white shadow"
        style={{
          left: MS_RAIL_X,
          top: pulseTop,
          x: "-50%",
          y: "-50%",
          backgroundColor: PEACH,
          opacity: inView ? 1 : 0,
        }}
      />

      {stations.map((s, i) => {
        const Icon = LOOP_ICONS[s.icon ?? s.id];
        const active = activeId === s.id;
        return (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: 14 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.12 }}
            className="relative flex items-center"
            style={{ minHeight: MS_ROW_H }}
          >
            {/* Node disc on the rail */}
            <div
              className="absolute z-20 -translate-x-1/2"
              style={{ left: MS_RAIL_X }}
            >
              <motion.div
                className="flex items-center justify-center rounded-full border shadow-md"
                animate={{
                  backgroundColor: active ? PEACH : "#FFFFFF",
                  borderColor: active ? PEACH : "rgba(255,255,255,0.7)",
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{ width: NODE, height: NODE }}
              >
                <Icon active={active} color={NAVY} accent={active ? NAVY : s.accent} size={22} />
              </motion.div>
            </div>

            {/* Card beside the node */}
            <motion.div
              className="ml-16 flex-1 rounded-2xl border p-3 sm:ml-[68px] sm:p-4"
              animate={{
                backgroundColor: active
                  ? light ? "rgba(255,192,145,0.16)" : "rgba(255,192,145,0.10)"
                  : light ? "#ffffff" : "rgba(255,255,255,0.03)",
                borderColor: active
                  ? "rgba(255,192,145,0.45)"
                  : light ? "#e2e6f0" : "rgba(255,255,255,0.08)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="font-serif text-2xl leading-none"
                  animate={{ color: active ? PEACH : light ? "#B7C3DA" : "#3E587C" }}
                  transition={{ duration: 0.3 }}
                >
                  {s.num}
                </motion.span>
                <span className="text-base font-semibold tracking-tight" style={{ color: light ? NAVY : "#FFFFFF" }}>{s.label}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: light ? "#64748b" : INK_SOFT }}>
                {s.body}
              </p>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Closing caption */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-8 text-center font-serif text-lg leading-snug"
        style={{ color: light ? NAVY : "#FFFFFF" }}
      >
        {center[0]}
        <br />
        {center[1]}
      </motion.p>
    </div>
  );
}

/* Node: elevated disc on the surface; fills accent + animates icon when active. */
function StationNode({
  station,
  index,
  appear,
  active,
}: {
  station: Station;
  index: number;
  appear: boolean;
  active: boolean;
}) {
  const Icon = LOOP_ICONS[station.icon ?? station.id];
  const R = 38; // node radius (bumped up for more presence)

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={appear ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 18,
        delay: appear ? 1.2 + index * 0.16 : 0,
      }}
      style={{ transformOrigin: `${station.x}px ${station.y}px` }}
    >
      {/* expanding activation ring — peach, matching the data-pulse */}
      <motion.circle
        cx={station.x}
        cy={station.y}
        r={R}
        fill="none"
        stroke={PEACH}
        strokeWidth={2}
        initial={{ scale: 1, opacity: 0 }}
        animate={active ? { scale: 1.5, opacity: [0, 0.6, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ transformOrigin: `${station.x}px ${station.y}px` }}
      />
      {/* elevated disc — white at rest so it pops on the dark field; turns
          PEACH when the pulse stops here (active = the warm, live state) */}
      <motion.circle
        cx={station.x}
        cy={station.y}
        r={R}
        filter="url(#nodeShadow)"
        animate={{
          fill: active ? PEACH : "#FFFFFF",
          stroke: active ? PEACH : "rgba(255,255,255,0.7)",
        }}
        transition={{ duration: 0.3 }}
        strokeWidth={1.5}
      />
      {/* icon — custom, performs its verb when active. On the peach active
          disc the icon goes NAVY (dark reads on the warm fill); at rest it's
          navy on white with the station accent as the verb-highlight color. */}
      <foreignObject x={station.x - ICON_BOX / 2} y={station.y - ICON_BOX / 2} width={ICON_BOX} height={ICON_BOX}>
        <div className="flex items-center justify-center" style={{ width: ICON_BOX, height: ICON_BOX }}>
          <Icon
            active={active}
            color={NAVY}
            accent={active ? NAVY : station.accent}
            size={ICON_SIZE}
          />
        </div>
      </foreignObject>
    </motion.g>
  );
}

/** The loop figure on its own — no eyebrow, heading, sub, or footnote. For
 *  embedding directly below a page hero (e.g. /hana-remote), where the hero
 *  copy does the talking and the figure is the unit. */
export function LoopFigure({
  copy,
  light = false,
  pulses = 1,
}: { copy?: LoopDiagramCopy; light?: boolean; pulses?: number } = {}) {
  return <LoopDiagram copy={copy} bare light={light} pulses={pulses} />;
}

export default LoopDiagram;
