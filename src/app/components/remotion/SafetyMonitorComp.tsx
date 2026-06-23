import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import type { ReactNode } from "react";
import { getLocale } from "../../../lib/i18n";

/* ============================================================================
   Hana — Safety Monitor  (390f / 13s @ 30fps, seamless loop)

   A centered modal over softly blurred background cards. A live, two-way
   transcript streams in real time; the risk ESCALATES from Low through
   Elevated (L4) to Critical (L9) as a second, more severe danger phrase lands.
   Hana mitigates inline (calm, blue), then three safety protocols EXECUTE live
   — each paired with a small console-style confirmation tag, like the Workflow
   Builder's "the system acts" energy. A closing line ties it off: care team
   notified, zero staff actions.

   Craft notes (raised to match the node-graph demo):
   - One accent (Apple-system blue #0A84FF) carries the brand; semantic colors
     (danger / warning / success / Hana-blue mitigation) appear ONLY where they
     carry meaning. The escalating risk meter is the single focal moment.
   - Layered contact + ambient shadows; near-invisible hairlines; glassy inner
     top-highlights on cards; small dark console tags in GitHub-dark syntax.
   - Everything drifts in (translateY + opacity + blur->sharp) on spring/cubic
     easing, staggered. Continuous micro-life: breathing live dot with a radar
     ping halo, a smooth header waveform, a blinking type cursor — all tuned to
     integer cycles over the loop so they never pop at the seam.
   - Calm, unhurried Apple pace across 13s: stream the escalating transcript,
     let the risk climb (Low -> Elevated -> Critical), cascade the three live
     actions, land the closing line, hold, then gracefully drift+blur out so
     frame (D-1) -> 0 is invisible (backdrop + modal both return to entrance).
   ========================================================================== */

/* ----------------------------- Type scale & color -------------------------- */
const FONT_DISPLAY = "'Instrument Serif', Georgia, 'Times New Roman', serif";
const FONT_UI = "'DM Sans', system-ui, -apple-system, sans-serif";
const FONT_MONO =
  "ui-monospace, 'SF Mono', 'JetBrains Mono', 'Menlo', monospace";

const COLOR = {
  canvas: "#F5F5F4",
  ink: "#0A0A0B",
  ink2: "#030213",
  slate: "#3F3F46",
  slate2: "#52525B",
  muted: "#71717A",
  faint: "#A1A1AA",
  hairline: "rgba(0,0,0,0.06)",
  hairlineStrong: "rgba(0,0,0,0.08)",
  panel: "#FFFFFF",
  accent: "#0A84FF",
  accentDeep: "#0067D6",
  danger: "#FF3B30",
  dangerSoft: "#FF453A",
  dangerDeep: "#C42B22",
  warning: "#FF9F0A",
  warningDeep: "#C77700",
  success: "#30D158",
  successDeep: "#1E9E45",
};

/* Console (GitHub-dark) syntax tints — matches the Workflow Builder. */
const CONSOLE_BG = "#0E1116";
const CONSOLE_BG2 = "#111317";
const SYN_PATH = "#E6EDF3";
const SYN_OK = "#3FB950";
const SYN_COMMENT = "#8B949E";

/* Stacked, realistic elevation: tight contact shadow + soft ambient layers. */
const SHADOW_MODAL =
  "0 1px 2px rgba(0,0,0,0.05), 0 12px 32px -10px rgba(0,0,0,0.16), 0 36px 72px -28px rgba(0,0,0,0.18)";
const SHADOW_CARD =
  "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.10)";
const INNER_HIGHLIGHT = "inset 0 1px 0 rgba(255,255,255,0.75)";

const TAU = Math.PI * 2;

/* --------------------------------- Content ---------------------------------
   The transcript is a back-and-forth with speaker tags. Two danger phrases
   escalate the risk; Hana mitigates inline (calm, blue). Each transcript turn
   types out in sequence over its own char budget.                           */
type Turn =
  | {
      who: "patient";
      before: string;
      danger?: string;
      after?: string;
      tone?: "elevated" | "critical";
    }
  | { who: "hana"; text: string };

const TURNS_EN: Turn[] = [
  {
    who: "patient",
    before:
      "The pain is just unbearable today. I know the bottle says one pill, but ",
    danger: "I've already taken four this morning",
    after: ".",
    tone: "elevated",
  },
  {
    who: "hana",
    text:
      "I hear you — that's more than prescribed and it isn't safe. I'm flagging this for your care team right now. Please don't take any more.",
  },
  {
    who: "patient",
    before: "…and honestly ",
    danger: "I'm thinking about taking the whole bottle just to make it stop",
    after: ".",
    tone: "critical",
  },
];

const TURNS_IT: Turn[] = [
  {
    who: "patient",
    before:
      "Oggi il dolore è insopportabile. Lo so che la scatola dice una pastiglia, ma ",
    danger: "ne ho già prese quattro stamattina",
    after: ".",
    tone: "elevated",
  },
  {
    who: "hana",
    text:
      "La capisco — è più della dose prescritta e non è sicuro. Lo segnalo subito al suo team di cura. La prego, non ne prenda altre.",
  },
  {
    who: "patient",
    before: "…e a dirla tutta ",
    danger: "sto pensando di prendere tutta la scatola pur di farlo smettere",
    after: ".",
    tone: "critical",
  },
];

const TURNS: Turn[] = getLocale() === "it" ? TURNS_IT : TURNS_EN;

/* Per-turn character length (only the visible text counts). */
function turnLen(t: Turn): number {
  if (t.who === "hana") return t.text.length;
  return t.before.length + (t.danger?.length ?? 0) + (t.after?.length ?? 0);
}
const TURN_LENS = TURNS.map(turnLen);

/* Live protocol actions — each reads as an executed action with a console
   confirmation tag (verb · status), echoing the Workflow Builder.           */
type Protocol = { label: string; tag: string; code: string };
const PROTOCOLS_EN: Protocol[] = [
  { label: "Notify Primary Physician (Urgent)", tag: "paged", code: "200 OK" },
  {
    label: "Flag Chart for Medication Reconciliation",
    tag: "EHR note",
    code: "201",
  },
  { label: "Schedule Same-Day Welfare Check", tag: "task created", code: "OK" },
];

const PROTOCOLS_IT: Protocol[] = [
  { label: "Avvisa il Medico Curante (Urgente)", tag: "paged", code: "200 OK" },
  {
    label: "Segnala la Cartella per Riconciliazione Farmacologica",
    tag: "EHR note",
    code: "201",
  },
  { label: "Pianifica una Verifica in Giornata", tag: "task created", code: "OK" },
];

const PROTOCOLS: Protocol[] =
  getLocale() === "it" ? PROTOCOLS_IT : PROTOCOLS_EN;

/* --------------------------------- Helpers --------------------------------- */
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Eased fade — gentle, confident. */
function fade(frame: number, delay: number, duration: number): number {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}

/** A reveal: opacity, a small upward drift, and a blur-to-sharp pass. */
function reveal(
  frame: number,
  delay: number,
  duration = 22,
  drift = 10,
  blur = 6
): { opacity: number; translateY: number; blur: number } {
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return {
    opacity: p,
    translateY: (1 - p) * drift,
    blur: (1 - p) * blur,
  };
}

/** Cosine ease-in-out used for the graceful loop hand-off (no hard pop). */
function smoothPulse(t: number): number {
  return 0.5 - 0.5 * Math.cos(Math.min(1, Math.max(0, t)) * Math.PI);
}

/* ------------------------------ Inline glyphs ------------------------------ */

function ShieldGlyph({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21.5s7-3.6 7-9V5.2l-7-2.7-7 2.7V12.5c0 5.4 7 9 7 9z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill={`${color}1A`}
      />
      <path
        d="M9 12.2l2.1 2.1L15 10.4"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function WarningGlyph({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M10.7 4.1L3 17.4a1.5 1.5 0 001.3 2.25h15.4A1.5 1.5 0 0021 17.4L13.3 4.1a1.5 1.5 0 00-2.6 0z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
        fill={`${color}1A`}
      />
      <line
        x1="12"
        y1="9.5"
        x2="12"
        y2="13.5"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.6" r="0.95" fill={color} />
    </svg>
  );
}

function CheckGlyph({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <polyline
        points="2.5,6.4 4.9,8.8 9.5,3.4"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HanaGlyph({ size = 11 }: { size?: number }) {
  // Small spark/assistant mark for Hana's mitigation turn.
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2.2 L9.3 6.5 L13.6 8 L9.3 9.5 L8 13.8 L6.7 9.5 L2.4 8 L6.7 6.5 Z"
        fill="#FFFFFF"
        opacity={0.96}
      />
    </svg>
  );
}

/* ============================================================================
   Component
   ========================================================================== */
export function SafetyMonitorComp() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const LOOP = durationInFrames; // 390
  const loc = getLocale();

  /* ---- Choreography (frames @ 390f / 13s) ----
     0    backdrop + blurred cards settle
     10   modal springs in (blur->sharp)
     34   transcript card reveals; turn 1 types
     ~70  first danger phrase lands  -> risk meter climbs Low -> Elevated (L4)
     108  Hana mitigation turn types (calm/blue)
     150  patient turn 3 types
     ~186 SECOND danger phrase lands -> risk CLIMBS Elevated -> Critical (L9)
     186  analysis row reveals (RULE-1C); badge tracks the live risk level
     228  protocol 1 executes (+ console tag)
     252  protocol 2 executes (+ console tag)
     276  protocol 3 executes (+ console tag)
     306  closing summary footer drifts in
     ~306-378  calm steady state, long restful hold
     378  begin graceful 12f exit (drift up + soft blur) -> frame 389->0 seamless
  */

  // Graceful loop hand-off: in the last 12 frames the whole stage drifts up and
  // blurs out, fully returning to the entrance state (opacity 0) so the seam is
  // invisible. Rebased to the real duration so it always ends at durationInFrames.
  const exitDur = 12;
  const exitStart = durationInFrames - exitDur;
  const exit = smoothPulse((frame - exitStart) / exitDur); // 0 -> 1 over final 12f
  // Drive opacity fully to 0 by the last frame so f(D-1) -> f0 has no residual.
  const exitOpacity = 1 - exit;
  const exitY = -exit * 12;
  const exitBlur = exit * 6;

  // Backdrop / blurred context cards: fade in at the head, fully fade out on the
  // exit (×(1-exit), not ×(1-exit*0.6)) so it returns to 0 — matching f0 exactly.
  const backdrop = fade(frame, 0, 14) * (1 - exit);

  // Modal entrance — spring with a touch of overshoot, plus blur-to-sharp.
  const modalSpring = spring({
    fps,
    frame: frame - 10,
    config: { damping: 18, stiffness: 110, mass: 0.9 },
    durationInFrames: 40,
  });
  const modalScale = interpolate(modalSpring, [0, 1], [0.965, 1]);
  const modalY = interpolate(modalSpring, [0, 1], [14, 0]) + exitY;
  const modalOpacity = fade(frame, 10, 18) * exitOpacity;
  const entranceBlur = interpolate(frame, [10, 32], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const modalBlur = entranceBlur + exitBlur;

  // Constant fit-scale so the modal FLOATS with comfortable, uniform breathing
  // room inside the 900x506 frame (it otherwise nearly fills edge-to-edge and
  // reads as "too close up" when the composition is scaled into a carousel
  // slide). The modal's intrinsic box is 588x567px — at full scale it stands
  // ~567px tall on the 506px canvas (taller than the frame). At 0.72 it sits
  // ~408px tall (~81% of 506px, leaving ~49px top/bottom) and ~425px wide on
  // the 900px canvas — so the blurred backdrop context cards + vignette read as
  // the intended surround. Folded into the SAME transform below so it
  // MULTIPLIES with modalScale, preserving the entrance spring, the Y drift,
  // the exit blur, and the translate(-50%,-50%) centering.
  const MODAL_FIT = 0.72;

  // ---- Transcript streaming timeline ----
  // Each turn types over its own window; small gaps between turns to read.
  const TURN_TIMING = [
    { start: 34, dur: 38 }, // patient 1
    { start: 108, dur: 40 }, // hana mitigation
    { start: 150, dur: 38 }, // patient 2 (escalation)
  ];
  const turnChars = TURNS.map((t, i) => {
    const { start, dur } = TURN_TIMING[i];
    return Math.floor(
      interpolate(frame, [start, start + dur], [0, TURN_LENS[i]], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.linear,
      })
    );
  });
  // The currently-typing turn index (-1 once everything has typed).
  let typingTurn = -1;
  for (let i = 0; i < TURNS.length; i++) {
    if (turnChars[i] < TURN_LENS[i] && frame >= TURN_TIMING[i].start) {
      typingTurn = i;
      break;
    }
  }

  // ---- Risk escalation ----
  // The transcript drives a continuous 0..1 risk that climbs in TWO legible
  // steps. Before any danger phrase types, risk is genuinely LOW (~0). As the
  // first danger phrase (turn 0) lands, risk climbs to Elevated (0.42 -> L4).
  // It holds while Hana mitigates, then as the second, more severe phrase
  // (turn 2) lands it climbs to Critical (1.0 -> L9).
  const t0 = TURNS[0] as Extract<Turn, { who: "patient" }>;
  const t2 = TURNS[2] as Extract<Turn, { who: "patient" }>;

  // Sweep 0..1 across the FIRST danger phrase's characters.
  const danger0Start = t0.before.length;
  const danger0End = danger0Start + (t0.danger?.length ?? 0);
  const danger0Progress = interpolate(
    turnChars[0],
    [danger0Start, danger0End],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Sweep 0..1 across the SECOND danger phrase's characters.
  const danger2Start = t2.before.length;
  const danger2End = danger2Start + (t2.danger?.length ?? 0);
  const danger2Progress = interpolate(
    turnChars[2],
    [danger2Start, danger2End],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Step 1: Low -> Elevated, tracking the first danger phrase (0 -> 0.42).
  const riskStep1 = (danger0Progress / 100) * 0.42;
  // Step 2: Elevated -> Critical, tracking the second phrase (0.42 -> 1.0).
  const riskStep2 = (danger2Progress / 100) * 0.58;
  // Monotonic: starts at ~0, climbs to 0.42, holds, climbs to 1.0. No base term.
  const risk = clamp01(riskStep1 + riskStep2);

  const isCritical = risk >= 0.7;
  const isElevated = risk >= 0.25 && !isCritical;
  // Level number tracks the climb: 0 -> 4 (Elevated) -> 9 (Critical).
  const riskLevelNum = Math.round(
    interpolate(risk, [0, 0.42, 1], [0, 4, 9], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const riskLabel = isCritical
    ? loc === "it"
      ? "Critico"
      : "Critical"
    : isElevated
    ? loc === "it"
      ? "Elevato"
      : "Elevated"
    : loc === "it"
    ? "Basso"
    : "Low";
  const riskColor = isCritical
    ? COLOR.danger
    : isElevated
    ? COLOR.warning
    : COLOR.muted;
  const riskColorDeep = isCritical
    ? COLOR.dangerDeep
    : isElevated
    ? COLOR.warningDeep
    : COLOR.slate2;
  // Danger tint (0..1) for the analysis card — neutral/amber when Elevated,
  // full red once Critical. Drives the card chrome so it tracks the climb.
  const dangerTint = interpolate(risk, [0.3, 0.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge "tick" pop each time the level steps up (Elevated land, Critical land).
  const elevatedPop = spring({
    fps,
    frame: frame - 70,
    config: { damping: 13, stiffness: 180, mass: 0.7 },
    durationInFrames: 26,
  });
  const criticalPop = spring({
    fps,
    frame: frame - 186,
    config: { damping: 12, stiffness: 190, mass: 0.7 },
    durationInFrames: 24,
  });
  const badgeKick =
    1 +
    0.06 * (elevatedPop * (1 - elevatedPop) * 4) +
    0.09 * (criticalPop * (1 - criticalPop) * 4);

  // Reveals — spread across the longer runtime for breathing room.
  const transcript = reveal(frame, 28, 24, 10, 6);
  const riskMeterReveal = reveal(frame, 60, 18, 8, 5);
  // Analysis reveals as the first danger phrase resolves, so the badge is on
  // screen to be SEEN climbing Elevated -> Critical (not hardcoded critical).
  const analysis = reveal(frame, 84, 22, 10, 6);

  // Protocol rows, staggered ~24f apart for a calm, deliberate cascade.
  const PROTOCOL_STARTS = [228, 252, 276];
  const protocolReveals = PROTOCOL_STARTS.map((s) => reveal(frame, s, 18, 9, 5));

  // Closing beat: a summary/confirmation footer drifts in once all protocols
  // have settled, then rests calmly through the long hold (covered by exit).
  const summary = reveal(frame, 306, 22, 10, 6);

  // ---- Continuous micro-life (all tuned to integer cycles over LOOP) ----
  // Breathing live dot: 5 full cycles over the loop (auto-adapts to duration).
  const breathePhase = Math.sin((frame / LOOP) * TAU * 5);
  const breathe = 0.6 + 0.4 * (0.5 + 0.5 * breathePhase);
  const breatheScale = 1 + 0.1 * (0.5 + 0.5 * breathePhase);
  // Live-dot halo ring expands & fades. Period 26f -> 15 cycles over 390 -> clean seam.
  const ringPhase = (frame % 26) / 26;
  const ringScale = 1 + ringPhase * 1.7;
  const ringOpacity = (1 - ringPhase) * 0.5 * (1 - exit);
  // The header LIVE pill shifts green (calm) -> amber -> red as risk peaks.
  const livePeak = isCritical
    ? COLOR.danger
    : isElevated
    ? COLOR.warning
    : COLOR.success;
  const livePeakDeep = isCritical
    ? COLOR.dangerDeep
    : isElevated
    ? COLOR.warningDeep
    : COLOR.successDeep;
  const livePeakRGBA = isCritical
    ? "255,59,48"
    : isElevated
    ? "255,159,10"
    : "48,209,88";
  // Typing cursor blink. Period 26f -> 15 cycles over 390 -> clean at the seam.
  const cursorBlink = frame % 26 < 13 ? 1 : 0.18;
  // Header waveform.
  const waveBars = 9;

  /* ----------------------------- Backdrop cards --------------------------- */
  const ghostCard = (extra: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    background: COLOR.panel,
    borderRadius: 16,
    border: `1px solid ${COLOR.hairline}`,
    boxShadow: SHADOW_CARD,
    ...extra,
  });

  return (
    <AbsoluteFill
      style={{
        background: COLOR.canvas,
        fontFamily: FONT_UI,
        WebkitFontSmoothing: "antialiased",
        // Subtle radial glow + faint dot grid so the canvas isn't dead-flat.
        backgroundImage: `
          radial-gradient(130% 95% at 50% -12%, rgba(10,132,255,0.045), rgba(10,132,255,0) 56%),
          radial-gradient(rgba(0,0,0,0.022) 1px, transparent 1px)
        `,
        backgroundSize: "auto, 24px 24px",
        backgroundPosition: "center, center",
      }}
    >
      {/* ---- Blurred background context (the "session" behind the modal) ---- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: backdrop * 0.85,
          // Static blur (no per-loop animation -> no seam); depth, not motion.
          filter: "blur(4px) saturate(0.97)",
        }}
      >
        <div style={ghostCard({ left: 36, top: 40, width: 228, height: 122 })} />
        <div style={ghostCard({ left: 36, top: 180, width: 228, height: 80 })} />
        <div style={ghostCard({ left: 36, top: 278, width: 228, height: 58 })} />
        <div
          style={ghostCard({
            right: 40,
            top: 48,
            width: 176,
            height: 44,
            borderRadius: 12,
          })}
        />
        <div
          style={ghostCard({
            left: 36,
            bottom: 70,
            width: 214,
            height: 60,
            borderRadius: 12,
            background: "rgba(255,59,48,0.05)",
            border: "1px solid rgba(255,59,48,0.13)",
            borderLeft: `3px solid ${COLOR.danger}`,
          })}
        />
        <div
          style={ghostCard({
            right: 40,
            bottom: 46,
            width: 214,
            height: 52,
            borderRadius: 12,
          })}
        />
      </div>

      {/* Vignette to focus attention on the modal. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(115% 85% at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.07) 100%)",
          opacity: backdrop,
        }}
      />

      {/* -------------------------------- Modal -------------------------------- */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 588,
          transform: `translate(-50%, calc(-50% + ${modalY}px)) scale(${
            modalScale * MODAL_FIT
          })`,
          transformOrigin: "center center",
          opacity: modalOpacity,
          filter: `blur(${modalBlur}px)`,
          background: "linear-gradient(180deg, #FFFFFF 0%, #FBFBFC 100%)",
          borderRadius: 20,
          border: `1px solid ${COLOR.hairline}`,
          boxShadow: `${SHADOW_MODAL}, ${INNER_HIGHLIGHT}`,
          overflow: "hidden",
        }}
      >
        {/* ------------------------------ Header ------------------------------ */}
        <div
          style={{
            padding: "12px 22px 10px",
            borderBottom: `1px solid ${COLOR.hairline}`,
            background:
              "linear-gradient(180deg, rgba(10,132,255,0.04), rgba(10,132,255,0))",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 11,
                  background:
                    "linear-gradient(180deg, rgba(10,132,255,0.16), rgba(10,132,255,0.06))",
                  border: "1px solid rgba(10,132,255,0.18)",
                  boxShadow: INNER_HIGHLIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldGlyph color={COLOR.accent} size={18} />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: -0.3,
                    color: COLOR.ink,
                  }}
                >
                  {loc === "it" ? "Monitor di Sicurezza" : "Safety Monitor"}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 10.5,
                    fontFamily: FONT_MONO,
                    letterSpacing: 0.3,
                    color: COLOR.muted,
                    fontFeatureSettings: "'tnum' 1",
                  }}
                >
                  SESSION ID: 8821-X
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Live waveform — 12 full integer cycles over the loop -> seamless. */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2.5,
                  height: 18,
                }}
              >
                {Array.from({ length: waveBars }).map((_, i) => {
                  const env = 0.6 + 0.4 * Math.sin(i * 1.7); // per-bar shape
                  const osc =
                    0.5 + 0.5 * Math.sin((frame / LOOP) * TAU * 12 + i * 0.9);
                  const h = 4 + 8 * osc * env;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 2.5,
                        height: Math.max(3, h),
                        borderRadius: 2,
                        background: isCritical
                          ? COLOR.danger
                          : isElevated
                          ? COLOR.warning
                          : COLOR.accent,
                        opacity: 0.35 + 0.4 * (h / 12),
                      }}
                    />
                  );
                })}
              </div>

              {/* Pulsing LIVE indicator (color tracks the risk peak). */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "4px 11px 4px 9px",
                  borderRadius: 999,
                  background: `rgba(${livePeakRGBA},0.10)`,
                  border: `1px solid rgba(${livePeakRGBA},0.24)`,
                }}
              >
                <div style={{ position: "relative", width: 8, height: 8 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: livePeak,
                      transform: `scale(${ringScale})`,
                      opacity: ringOpacity,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: livePeak,
                      transform: `scale(${breatheScale})`,
                      opacity: breathe,
                      boxShadow: `0 0 6px rgba(${livePeakRGBA},0.6)`,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: 0.6,
                    color: livePeakDeep,
                  }}
                >
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------- Transcript ---------------------------- */}
        <div
          style={{
            padding: "10px 22px 8px",
            opacity: transcript.opacity,
            transform: `translateY(${transcript.translateY}px)`,
            filter: `blur(${transcript.blur}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0 0 6px",
            }}
          >
            <SectionLabel>
              {loc === "it" ? "Trascrizione Live" : "Live Transcript"}
            </SectionLabel>
            {/* Risk meter — the legible escalation moment. */}
            <RiskMeter
              risk={risk}
              label={riskLabel}
              level={riskLevelNum}
              color={riskColor}
              reveal={riskMeterReveal}
            />
          </div>
          <div
            style={{
              background: "#FAFAF9",
              borderRadius: 14,
              border: `1px solid ${COLOR.hairline}`,
              boxShadow: INNER_HIGHLIGHT,
              padding: "11px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minHeight: 124,
            }}
          >
            {TURNS.map((turn, i) => {
              if (frame < TURN_TIMING[i].start - 2) return null;
              return (
                <TranscriptLine
                  key={i}
                  turn={turn}
                  chars={turnChars[i]}
                  isTyping={typingTurn === i}
                  cursorOpacity={cursorBlink}
                  danger0Progress={i === 0 ? danger0Progress : 100}
                  danger2Progress={i === 2 ? danger2Progress : 100}
                />
              );
            })}
          </div>
        </div>

        {/* ----------------------------- Analysis ----------------------------- */}
        <div
          style={{
            padding: "2px 22px 8px",
            opacity: analysis.opacity,
            transform: `translateY(${analysis.translateY}px)`,
            filter: `blur(${analysis.blur}px)`,
          }}
        >
          <SectionLabel>
            {loc === "it" ? "Analisi in Tempo Reale" : "Real-Time Analysis"}
          </SectionLabel>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              // Card chrome tracks the climb: warm/amber when Elevated, red when
              // Critical. dangerTint cross-fades the red overlay in.
              background: `
                linear-gradient(180deg, rgba(255,59,48,${(
                  0.07 * dangerTint
                ).toFixed(3)}), rgba(255,59,48,${(0.025 * dangerTint).toFixed(
                3
              )})),
                linear-gradient(180deg, rgba(255,159,10,${(
                  0.06 *
                  (1 - dangerTint)
                ).toFixed(3)}), rgba(255,159,10,${(
                0.02 *
                (1 - dangerTint)
              ).toFixed(3)}))
              `,
              border: `1px solid rgba(${
                isCritical ? "255,59,48" : "255,159,10"
              },0.22)`,
              borderRadius: 14,
              boxShadow: INNER_HIGHLIGHT,
              padding: "11px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: `rgba(${
                    isCritical ? "255,59,48" : "255,159,10"
                  },0.10)`,
                  border: `1px solid rgba(${
                    isCritical ? "255,59,48" : "255,159,10"
                  },0.22)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <WarningGlyph
                  color={isCritical ? COLOR.danger : COLOR.warning}
                  size={18}
                />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    fontWeight: 600,
                    letterSpacing: -0.2,
                    color: COLOR.ink,
                  }}
                >
                  {loc === "it"
                    ? "Uso Improprio di Farmaci Rilevato"
                    : "Medication Misuse Detected"}
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 10.5,
                    fontFamily: FONT_MONO,
                    letterSpacing: 0.2,
                    color: COLOR.muted,
                  }}
                >
                  RULE-1C · Dose Escalation
                </p>
              </div>
            </div>

            {/* Risk badge — tracks the LIVE level, climbing Elevated -> Critical. */}
            <div
              style={{
                transform: `scale(${badgeKick})`,
                transformOrigin: "right center",
                background: `linear-gradient(180deg, rgba(${
                  isCritical ? "255,59,48" : "255,159,10"
                },0.12), rgba(${
                  isCritical ? "255,59,48" : "255,159,10"
                },0.05))`,
                border: `1px solid rgba(${
                  isCritical ? "255,59,48" : "255,159,10"
                },0.28)`,
                boxShadow: `0 2px 8px -4px rgba(${
                  isCritical ? "255,59,48" : "255,159,10"
                },0.4)`,
                borderRadius: 12,
                padding: "5px 13px 7px",
                textAlign: "right",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 8.5,
                  fontWeight: 600,
                  letterSpacing: 0.9,
                  color: COLOR.muted,
                }}
              >
                {loc === "it" ? "LIVELLO DI RISCHIO" : "RISK LEVEL"}
              </p>
              <p
                style={{
                  margin: "1px 0 0",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "flex-end",
                  gap: 5,
                  color: riskColorDeep,
                }}
              >
                {/* Instrument Serif carries the single focal word. */}
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 22,
                    lineHeight: 1,
                    fontWeight: 400,
                    letterSpacing: -0.2,
                  }}
                >
                  {riskLabel}
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                    fontFeatureSettings: "'tnum' 1",
                  }}
                >
                  L{riskLevelNum}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------- Protocol execution ---------------------- */}
        <div style={{ padding: "2px 22px 8px" }}>
          <SectionLabel>
            {loc === "it"
              ? "Risposta Live · Protocolli in Esecuzione"
              : "Live Response · Protocols Executing"}
          </SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PROTOCOLS.map((p, i) => {
              const r = protocolReveals[i];
              // Tag types in shortly after the row settles -> "system acts".
              const tagP = fade(frame, PROTOCOL_STARTS[i] + 10, 12);
              return (
                <div
                  key={i}
                  style={{
                    opacity: r.opacity,
                    transform: `translateY(${r.translateY}px)`,
                    filter: r.blur > 0.05 ? `blur(${r.blur}px)` : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background:
                      "linear-gradient(180deg, rgba(48,209,88,0.07), rgba(48,209,88,0.025))",
                    border: "1px solid rgba(48,209,88,0.20)",
                    borderRadius: 12,
                    boxShadow: INNER_HIGHLIGHT,
                    padding: "6px 12px 6px 14px",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "linear-gradient(180deg, #34D862, #25A648)",
                      boxShadow:
                        "0 1px 2px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      // Tiny scale-in synced to the row reveal.
                      transform: `scale(${interpolate(
                        r.opacity,
                        [0, 1],
                        [0.6, 1]
                      )})`,
                    }}
                  >
                    <CheckGlyph size={11} />
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: COLOR.slate,
                      fontWeight: 500,
                      letterSpacing: -0.1,
                    }}
                  >
                    {p.label}
                  </span>
                  {/* Console-style confirmation tag — the "system acts" energy. */}
                  <span
                    style={{
                      marginLeft: "auto",
                      opacity: tagP,
                      transform: `translateX(${(1 - tagP) * 4}px)`,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 8px",
                      borderRadius: 7,
                      background: `linear-gradient(180deg, ${CONSOLE_BG2}, ${CONSOLE_BG})`,
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow:
                        "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: SYN_OK,
                        boxShadow: `0 0 5px ${SYN_OK}aa`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 9,
                        letterSpacing: 0.2,
                        color: SYN_PATH,
                      }}
                    >
                      {p.tag}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 9,
                        letterSpacing: 0.2,
                        color: SYN_OK,
                        fontWeight: 600,
                      }}
                    >
                      {p.code}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----------------------- Closing summary footer --------------------- */}
        {/* Final confirmation beat: drifts in after all protocols settle, then
            rests through the long calm hold. Covered by the modal exit fade. */}
        <div style={{ padding: "0 22px 12px" }}>
          <div
            style={{
              opacity: summary.opacity,
              transform: `translateY(${summary.translateY}px)`,
              filter: summary.blur > 0.05 ? `blur(${summary.blur}px)` : "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background:
                "linear-gradient(180deg, rgba(48,209,88,0.10), rgba(48,209,88,0.04))",
              border: "1px solid rgba(48,209,88,0.24)",
              borderRadius: 12,
              boxShadow: `${SHADOW_CARD}, ${INNER_HIGHLIGHT}`,
              padding: "8px 12px 8px 14px",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #34D862, #25A648)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transform: `scale(${interpolate(
                  summary.opacity,
                  [0, 1],
                  [0.6, 1]
                )})`,
              }}
            >
              <CheckGlyph size={9} />
            </div>
            <span
              style={{
                fontSize: 12,
                color: COLOR.successDeep,
                fontWeight: 600,
                letterSpacing: -0.1,
              }}
            >
              {loc === "it"
                ? "Tutti i protocolli inviati"
                : "All protocols dispatched"}
            </span>
            <span style={{ margin: "0 1px", color: COLOR.faint, fontSize: 11 }}>
              ·
            </span>
            <span
              style={{
                fontSize: 11.5,
                color: COLOR.slate2,
                fontWeight: 500,
                letterSpacing: -0.1,
              }}
            >
              {loc === "it" ? "Team di cura avvisato" : "Care team notified"}
            </span>
            {/* mono "0 staff actions" tag — echoes Workflow Builder's close. */}
            <span
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: FONT_MONO,
                fontSize: 9.5,
                letterSpacing: 0.3,
                color: COLOR.successDeep,
                background: "rgba(48,209,88,0.10)",
                border: "1px solid rgba(48,209,88,0.22)",
                borderRadius: 7,
                padding: "3px 8px",
                flexShrink: 0,
              }}
            >
              <span style={{ color: SYN_COMMENT }}>//</span>{" "}
              {loc === "it" ? "0 azioni dello staff" : "0 staff actions"}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ============================================================================
   Risk meter — segmented pips + climbing level. The single focal escalation
   moment: it visibly climbs Low -> Elevated (L4) -> Critical (L9).
============================================================================ */
function RiskMeter({
  risk,
  label,
  level,
  color,
  reveal: r,
}: {
  risk: number;
  label: string;
  level: number;
  color: string;
  reveal: { opacity: number; translateY: number; blur: number };
}) {
  // 9 pips; filled count tracks the level. Pips light warm->red as risk climbs.
  const pips = 9;
  const filled = level;
  return (
    <div
      style={{
        opacity: r.opacity,
        transform: `translateY(${r.translateY}px)`,
        filter: r.blur > 0.05 ? `blur(${r.blur}px)` : "none",
        display: "flex",
        alignItems: "center",
        gap: 9,
      }}
    >
      <span
        style={{
          fontFamily: FONT_UI,
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 0.2,
          color,
          fontFeatureSettings: "'tnum' 1",
        }}
      >
        L{level}
      </span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5 }}>
        {Array.from({ length: pips }).map((_, i) => {
          const on = i < filled;
          // Top pips run hotter (warning -> red) to read as "climbing".
          const hot = i >= 5;
          const pipColor = !on
            ? "rgba(0,0,0,0.08)"
            : hot
            ? COLOR.danger
            : COLOR.warning;
          return (
            <div
              key={i}
              style={{
                width: 4,
                height: 8 + i * 0.9,
                borderRadius: 2,
                background: pipColor,
                boxShadow: on ? `0 0 5px ${pipColor}66` : "none",
                opacity: on ? 1 : 0.5 + 0.3 * risk,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   Transcript line — speaker-tagged turn with typewriter reveal. Patient turns
   can carry a [danger] phrase that sweeps amber/red as it lands; Hana's
   mitigation turn renders calm/blue with a small spark avatar.
============================================================================ */
function TranscriptLine({
  turn,
  chars,
  isTyping,
  cursorOpacity,
  danger0Progress,
  danger2Progress,
}: {
  turn: Turn;
  chars: number;
  isTyping: boolean;
  cursorOpacity: number;
  danger0Progress: number;
  danger2Progress: number;
}) {
  const isHana = turn.who === "hana";
  const tagColor = isHana ? COLOR.accent : COLOR.slate2;
  const tagBg = isHana ? "rgba(10,132,255,0.10)" : "rgba(0,0,0,0.04)";
  const tagBorder = isHana
    ? "1px solid rgba(10,132,255,0.20)"
    : `1px solid ${COLOR.hairlineStrong}`;

  const cursor = isTyping ? (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "1.02em",
        marginLeft: 1.5,
        transform: "translateY(2px)",
        borderRadius: 1,
        background: isHana ? COLOR.accent : COLOR.accentDeep,
        opacity: cursorOpacity,
      }}
    />
  ) : null;

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      {/* Speaker tag */}
      <span
        style={{
          flexShrink: 0,
          marginTop: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontFamily: FONT_MONO,
          fontSize: 8.5,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: tagColor,
          background: tagBg,
          border: tagBorder,
          borderRadius: 6,
          padding: "2px 7px",
          minWidth: 54,
          justifyContent: "center",
        }}
      >
        {isHana && (
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: `linear-gradient(180deg, ${COLOR.accent}, ${COLOR.accentDeep})`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HanaGlyph size={8} />
          </span>
        )}
        {isHana ? "HANA" : "PATIENT"}
      </span>

      {/* Body */}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          lineHeight: 1.55,
          letterSpacing: -0.1,
          color: isHana ? COLOR.accentDeep : COLOR.slate,
          fontWeight: isHana ? 500 : 400,
        }}
      >
        {isHana
          ? renderHana(turn.text, chars, cursor)
          : renderPatient(
              turn,
              chars,
              cursor,
              danger0Progress,
              danger2Progress
            )}
      </p>
    </div>
  );
}

function renderHana(
  text: string,
  chars: number,
  cursor: ReactNode
): ReactNode {
  const shown = text.slice(0, Math.max(0, chars));
  const done = chars >= text.length;
  return (
    <>
      {shown}
      {!done && cursor}
    </>
  );
}

function renderPatient(
  turn: Extract<Turn, { who: "patient" }>,
  chars: number,
  cursor: ReactNode,
  danger0Progress: number,
  danger2Progress: number
): ReactNode {
  const before = turn.before;
  const danger = turn.danger ?? "";
  const after = turn.after ?? "";
  const dangerStart = before.length;
  const dangerEnd = dangerStart + danger.length;
  const total = dangerEnd + after.length;

  let remaining = chars;
  const beforeShown = before.slice(
    0,
    Math.max(0, Math.min(remaining, before.length))
  );
  remaining -= before.length;
  const dangerShown =
    remaining > 0 ? danger.slice(0, Math.min(remaining, danger.length)) : "";
  remaining -= danger.length;
  const afterShown =
    remaining > 0 ? after.slice(0, Math.min(remaining, after.length)) : "";

  const inBefore = chars < dangerStart;
  const inDanger = chars >= dangerStart && chars < dangerEnd;
  const inAfter = chars >= dangerEnd && chars < total;

  // Which danger sweep drives this phrase's highlight wipe.
  const isCriticalPhrase = turn.tone === "critical";
  const sweep = isCriticalPhrase ? danger2Progress : danger0Progress;
  const tint = isCriticalPhrase ? "255,59,48" : "255,159,10";
  const phraseColor = isCriticalPhrase ? COLOR.danger : COLOR.warningDeep;

  return (
    <>
      {beforeShown}
      {inBefore && cursor}
      {dangerShown && (
        <span
          style={{
            color: phraseColor,
            fontWeight: 600,
            padding: "1px 4px",
            margin: "0 -2px",
            borderRadius: 5,
            background: `linear-gradient(90deg, rgba(${tint},${
              isCriticalPhrase ? 0.16 : 0.13
            }) ${sweep}%, rgba(${tint},0) ${sweep}%)`,
            boxShadow:
              sweep > 4
                ? `inset 0 -1.5px 0 rgba(${tint},${(
                    (isCriticalPhrase ? 0.55 : 0.4) *
                    (sweep / 100)
                  ).toFixed(3)})`
                : "none",
          }}
        >
          {dangerShown}
          {inDanger && cursor}
        </span>
      )}
      {afterShown}
      {inAfter && cursor}
    </>
  );
}

/* ------------------------------ Section label ------------------------------ */
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: 9.5,
        fontWeight: 600,
        textTransform: "uppercase",
        color: COLOR.faint,
        letterSpacing: 1.4,
        margin: "0 0 6px",
        fontFamily: FONT_UI,
      }}
    >
      {children}
    </p>
  );
}
