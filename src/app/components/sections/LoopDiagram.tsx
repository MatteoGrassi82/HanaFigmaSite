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
import { LOOP_ICONS } from "../media/LoopIcons";
import { getLocale } from "../../../lib/i18n";

/* ── Locale ─────────────────────────────────────────────────────────────────
   All visible copy is rendered in Italian when the site locale is Italian and
   stays English otherwise. Translations are kept local to this component. */
const IT = getLocale() === "it";
const t = (en: string, it: string) => (IT ? it : en);

/* ── Hana "closes the loop" infinity diagram ───────────────────────────────
   A refined flat 2D figure-8 on a warm canvas. Two-rail track painted with a
   warm ink-ramp GRADIENT that flows across the loop; nodes sit on the surface
   with a soft shadow. A pulse travels and STOPS at each station, which fills
   with accent and animates its icon, then hands off (Read → Reason → Engage →
   Write-Back → loop). No glow/neon — richness comes from a real surface,
   gradient color, elevation, texture, and type. motion.dev + SVG. No headline
   (placed by the page). Lives on /preview. */

/* ── Palette — Newsprint Ultramarine ────────────────────────────────────────
   Two grounds: the default sits on navy, the `light` variant on the paper
   band. Structure (rails, discs, numerals, chips) is carried by the warm
   ink/rule ramp. Ultramarine is spent on the one live thing — the travelling
   pulse and the station it is lighting — plus the eyebrow. Literal hex with
   the token name beside it, because this artwork is also read outside the
   page's CSS scope. */
const NAVY = "#00122f"; // navy — the true dark ground
const NAVY_SOFT = "#1e2a3a"; // navy-soft — the resting rail on dark
const INK = "#00122f"; // ink — primary type on light
const INK_SOFT = "#475569"; // ink-soft — secondary type on light
const INK_MUTE = "#64748b"; // ink-mute — captions, labels, meta
const PAPER = "#ffffff"; // paper — the page ground
const PAPER_2 = "#f6f7fb"; // paper-2 — the alternating band
const PAPER_BRIGHT = "#ffffff"; // paper-bright — node discs, cards, type on navy
const RULE = "#cfd8e6"; // rule — borders on light
const RULE_SOFT = "#e2e8f0"; // rule-soft — hairlines on light
const RULE_STRONG = "#8b95a5"; // rule-strong — the rail at its darkest on light
const BRAND = "#2536E6"; // brand — ultramarine, the accent on light
const BRAND_SOFT = "#A9B4FF"; // brand-soft — the accent on a dark ground
const BRAND_TINT = "#ECEDFB"; // brand-tint — the accent as a wash

/* Ground-dependent roles. `light` picks the paper band, otherwise navy. */
const accentOn = (light: boolean) => (light ? BRAND : BRAND_SOFT);
const typeOn = (light: boolean) => (light ? INK : PAPER_BRIGHT);
const softOn = (light: boolean) => (light ? INK_SOFT : "rgba(253,252,250,0.70)"); // paper-bright alpha
const muteOn = (light: boolean) => (light ? INK_MUTE : "rgba(253,252,250,0.42)");
/* The un-lit step numeral. Subordinate to the accent, but still a readable
   figure: rule-strong on paper (rule itself sat at 1.5:1, invisible) and a
   paper-bright alpha on navy rather than an ink value, which has no business
   on the dark ground. */
const restNumeral = (light: boolean) => (light ? RULE_STRONG : "rgba(253,252,250,0.42)");

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
    accent: INK_SOFT, // ink-soft
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
    accent: INK_SOFT, // ink-soft
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
    accent: INK_SOFT, // ink-soft
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
    accent: INK_SOFT, // ink-soft
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
          animate={{ color: active ? accentOn(light) : restNumeral(light) }}
          transition={{ duration: 0.3 }}
        >
          {station.num}
        </motion.span>
        <span className="text-xl font-semibold tracking-tight" style={{ color: typeOn(light) }}>
          {station.label}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: softOn(light) }}>
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
        "Read. Engage. Document. Every call.",
        "Legge. Chiama. Documenta. Per ogni paziente.",
      ),
    sub:
      copy?.sub ??
      t(
        "Hana works the whole loop — so your front desk is free for the patients standing in front of them.",
        "Hana gestisce l'intero ciclo — così la tua segreteria è libera per i pazienti che ha davanti.",
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
      style={{ backgroundColor: light ? PAPER_2 : NAVY }}
    >
      {/* warm radial lift at top — matches the Reasoning Engine section so the
          two read as one continuous block (dark theme only) */}
      {!light && (
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-200px] z-0 h-[400px] w-[400px] -translate-x-1/2 md:h-[800px] md:w-[800px]"
        style={{
          background:
            // navy-soft, warmed off the navy field. Decoration, so no accent.
            "radial-gradient(circle, rgba(53,48,41,0.55) 0%, transparent 70%)",
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
              backgroundImage: `radial-gradient(${light ? INK_MUTE : PAPER_BRIGHT} 0.6px, transparent 0.6px)`,
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
              style={{ color: accentOn(light) }}
            >
              {c.eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-4 font-serif text-2xl leading-snug sm:text-3xl md:text-[2.6rem] md:leading-[1.15]"
              style={{ color: typeOn(light) }}
            >
              {c.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed"
              style={{ color: softOn(light) }}
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
                  {/* the rail's flow, done with two steps of the warm ramp
                      rather than two hues: rule → rule-strong → ink-mute on
                      paper, and paper-bright at rising alpha on navy. Never
                      the accent — the rail is structure, not the subject. */}
                  <linearGradient id="railFlow" x1="0" y1="0.5" x2="1" y2="0.5">
                    <stop offset="0%" stopColor={light ? RULE : PAPER_BRIGHT} stopOpacity={light ? 1 : 0.3} />
                    <stop offset="25%" stopColor={light ? RULE_STRONG : PAPER_BRIGHT} stopOpacity={light ? 1 : 0.42} />
                    <stop offset="50%" stopColor={light ? INK_MUTE : PAPER_BRIGHT} stopOpacity={light ? 1 : 0.56} />
                    <stop offset="75%" stopColor={light ? RULE_STRONG : PAPER_BRIGHT} stopOpacity={light ? 1 : 0.42} />
                    <stop offset="100%" stopColor={light ? RULE : PAPER_BRIGHT} stopOpacity={light ? 1 : 0.3} />
                  </linearGradient>
                  {/* soft elevation shadow under the paper-bright discs */}
                  <filter id="nodeShadow" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="6"
                      floodColor={light ? INK : NAVY}
                      floodOpacity={light ? 0.16 : 0.5}
                    />
                  </filter>
                </defs>

                {/* resting rails */}
                <path d={RAIL_OUTER} fill="none" stroke={light ? RULE_SOFT : NAVY_SOFT} strokeWidth={3} strokeLinecap="round" />
                <path d={RAIL_INNER} fill="none" stroke={light ? RULE_SOFT : NAVY_SOFT} strokeWidth={3} strokeLinecap="round" />

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

                {/* pulse(s) — the ACCENT orbiting the neutral track in a
                    constant, unbroken loop. One pulse = a single call; several
                    pulses = a monitoring program with patients mid-cycle. This
                    is the one thing the frame is about, so it gets the
                    ultramarine and the rails do not. The stroke is paper on
                    light and navy on dark, so the dot cuts off the rail. */}
                {pulseDistances.map((dist, k) => (
                  <motion.circle
                    key={k}
                    r={k === 0 ? 7 : 6}
                    fill={accentOn(light)}
                    stroke={light ? PAPER : NAVY}
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
                        style={{ fill: muteOn(light), textTransform: "uppercase" }}
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
                        animate={{ stroke: activeRamp ? accentOn(light) : light ? RULE : "rgba(253,252,250,0.28)" }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.rect
                        x={chipX}
                        y={chipY - 14}
                        width={chipW}
                        height={30}
                        rx={15}
                        animate={{
                          fill: light ? PAPER_BRIGHT : "rgba(253,252,250,0.06)",
                          stroke: activeRamp ? accentOn(light) : light ? RULE : "rgba(253,252,250,0.14)",
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
                        style={{ fontFamily: "var(--font-sans)" }}
                        animate={{ fill: light ? INK : "rgba(253,252,250,0.85)" }}
                      >
                        {copy.offRamp!.label}
                      </motion.text>
                    </motion.g>
                  );
                })()}

                {stations.map((s, i) => (
                  <StationNode key={s.id} station={s} index={i} appear={inView} active={activeId === s.id} light={light} />
                ))}

                {/* center caption */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <ellipse cx={CX} cy={CY} rx={172} ry={52} fill={light ? PAPER_2 : NAVY} />
                  <text
                    x={CX}
                    y={CY - 4}
                    textAnchor="middle"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", fill: typeOn(light) }}
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
                        style={{ fontFamily: "var(--font-sans)", fill: typeOn(light) }}
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
            style={{ color: softOn(light) }}
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
   body) beside it. An ultramarine pulse travels down the rail and each step lights up
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
          background: light
            ? `linear-gradient(${RULE}, ${INK_MUTE}, ${RULE})` // rule → ink-mute → rule
            : "linear-gradient(rgba(253,252,250,0.30), rgba(253,252,250,0.56), rgba(253,252,250,0.30))", // paper-bright alphas
          opacity: 0.85,
        }}
      />
      {/* Traveling accent pulse */}
      <motion.div
        className="absolute z-30 h-3.5 w-3.5 rounded-full border-2 shadow"
        style={{
          left: MS_RAIL_X,
          top: pulseTop,
          x: "-50%",
          y: "-50%",
          borderColor: light ? PAPER : NAVY, // paper / navy, cuts the dot off the rail
          backgroundColor: accentOn(light),
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
                  backgroundColor: active ? accentOn(light) : PAPER_BRIGHT,
                  borderColor: active ? accentOn(light) : light ? RULE : "rgba(253,252,250,0.7)",
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{ width: NODE, height: NODE }}
              >
                {/* on the filled disc the glyph reverses: paper-bright on the
                    ultramarine fill, navy on the brand-soft one */}
                <Icon
                  active={active}
                  color={active ? (light ? PAPER_BRIGHT : NAVY) : INK}
                  accent={active ? (light ? PAPER_BRIGHT : NAVY) : s.accent}
                  size={22}
                />
              </motion.div>
            </div>

            {/* Card beside the node */}
            <motion.div
              className="ml-16 flex-1 rounded-2xl border p-3 sm:ml-[68px] sm:p-4"
              animate={{
                backgroundColor: active
                  ? light ? BRAND_TINT : "rgba(169,180,255,0.10)" // brand-tint / brand-soft wash
                  : light ? PAPER_BRIGHT : "rgba(253,252,250,0.04)",
                borderColor: active
                  ? light ? "rgba(37,54,230,0.35)" : "rgba(169,180,255,0.35)"
                  : light ? RULE : "rgba(253,252,250,0.10)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="font-serif text-2xl leading-none"
                  animate={{ color: active ? accentOn(light) : restNumeral(light) }}
                  transition={{ duration: 0.3 }}
                >
                  {s.num}
                </motion.span>
                <span className="text-base font-semibold tracking-tight" style={{ color: typeOn(light) }}>{s.label}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: softOn(light) }}>
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
        style={{ color: typeOn(light) }}
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
  light = false,
}: {
  station: Station;
  index: number;
  appear: boolean;
  active: boolean;
  light?: boolean;
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
      {/* expanding activation ring — the accent, matching the data-pulse */}
      <motion.circle
        cx={station.x}
        cy={station.y}
        r={R}
        fill="none"
        stroke={accentOn(light)}
        strokeWidth={2}
        initial={{ scale: 1, opacity: 0 }}
        animate={active ? { scale: 1.5, opacity: [0, 0.6, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ transformOrigin: `${station.x}px ${station.y}px` }}
      />
      {/* elevated disc — paper-bright at rest, so the product surface sits on
          the same stock as the page; fills with ultramarine when the pulse
          stops here (active = the live state) */}
      <motion.circle
        cx={station.x}
        cy={station.y}
        r={R}
        filter="url(#nodeShadow)"
        animate={{
          fill: active ? accentOn(light) : PAPER_BRIGHT,
          stroke: active ? accentOn(light) : light ? RULE : "rgba(253,252,250,0.7)",
        }}
        transition={{ duration: 0.3 }}
        strokeWidth={1.5}
      />
      {/* icon — custom, performs its verb when active. On the filled disc the
          glyph reverses: paper-bright on ultramarine, navy on brand-soft. At
          rest it is ink on paper-bright, with ink-soft as the verb highlight. */}
      <foreignObject x={station.x - ICON_BOX / 2} y={station.y - ICON_BOX / 2} width={ICON_BOX} height={ICON_BOX}>
        <div className="flex items-center justify-center" style={{ width: ICON_BOX, height: ICON_BOX }}>
          <Icon
            active={active}
            color={active ? (light ? PAPER_BRIGHT : NAVY) : INK}
            accent={active ? (light ? PAPER_BRIGHT : NAVY) : station.accent}
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
