import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { getLocale } from "../../../lib/i18n";

/* ------------------------------------------------------------------ */
/*  Hana — Patient Context demo. Apple-grade redesign.                 */
/*  Canvas 900x506 @ 30fps, 390-frame graceful loop (13s).             */
/*                                                                     */
/*  Narrative: every interaction across DIFFERENT channels writes a    */
/*  new fact into ONE persistent record — and that record is carried   */
/*  INTO the next interaction. Context COMPOUNDS.                       */
/*                                                                     */
/*  The three timeline touchpoints activate IN SEQUENCE (a call, then  */
/*  a WhatsApp check-in, then an SMS reminder). As each lights, the    */
/*  fact it produced writes into the dark "PATIENT CONTEXT" record     */
/*  WITH a small source tag — so the viewer watches the profile grow   */
/*  touchpoint by touchpoint. A fourth fact (adherence) compounds the  */
/*  record further. The closing beat makes the persistence explicit:   */
/*  "Context carried into next touch".                                 */
/* ------------------------------------------------------------------ */

/* ---- Brand tokens (Newsprint Ultramarine) --------------------------- */
/*  Literal hex, not var(): this comp is rendered headlessly for video    */
/*  export, where the page's CSS custom properties do not exist.          */
const INK = "#16130F"; /* ink */
const INK_DEEP = "#141210"; /* navy — the one genuinely dark ground */
const NAVY_SOFT = "#353029"; /* navy-soft */
const SLATE = "#4A4239"; /* ink-soft — secondary type on paper */
const SLATE_2 = "#353029"; /* navy-soft — the big calendar numeral */
const MUTED = "#6F6659"; /* ink-mute — captions, labels, meta */
const CANVAS = "#FAF8F4"; /* paper — warm uncoated stock */
const PAPER_2 = "#F0EDE6"; /* paper-2 */
const PAPER_BRIGHT = "#FDFCFA"; /* paper-bright — cards and surfaces */
const BAND = "#E0DBD0"; /* band — the tinted step below paper-2 */
const HAIRLINE = "#D9D3C7"; /* rule-soft */
const HAIRLINE_2 = "#CCC4B4"; /* rule */
const BLUE = "#2536E6"; /* brand — ultramarine, the accent */
const BLUE_SOFT = "#A9B4FF"; /* brand-soft — the accent on a dark ground */
const SUCCESS = "#10B981"; /* signal green — done, adherent */
const DANGER = "#FF453A"; /* signal red — a genuine alert state */

/* Channel tints. These carry MEANING (which channel produced the fact),
   so they stay three distinct hues: the accent plus the two signals. */
const WA_GREEN = "#10B981"; /* signal green, normalised from #20BD5A */
const SMS_AMBER = "#E8A06A"; /* signal amber, normalised from #FF9F0A */

const SERIF = "'Fraunces', Georgia, serif";
const SANS = "'IBM Plex Sans', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', monospace";

/* Layered, realistic shadows ---------------------------------------- */
/*  Shadow alphas are warm ink (#16130F), not neutral black, so the lift
    off warm paper stays in the same family as the ground. */
const CARD_SHADOW =
  "0 1px 2px rgba(22,19,15,0.06), 0 8px 24px -10px rgba(22,19,15,0.14), 0 24px 48px -28px rgba(22,19,15,0.14)";
const CARD_SHADOW_SOFT =
  "0 1px 2px rgba(22,19,15,0.05), 0 6px 18px -10px rgba(22,19,15,0.12), 0 18px 40px -28px rgba(22,19,15,0.12)";
const PANEL_SHADOW =
  "0 1px 2px rgba(22,19,15,0.08), 0 12px 34px -12px rgba(22,19,15,0.30), 0 30px 60px -30px rgba(22,19,15,0.35)";
const TOP_INNER_HIGHLIGHT = "inset 0 1px 0 rgba(253,252,250,0.80)"; /* paper-bright */

/* ---- Motion helpers ------------------------------------------------ */
/*  NOTE: these are PURE functions, not hooks. spring()/interpolate()  */
/*  are not React hooks, so it is safe (and rules-of-hooks-clean) to   */
/*  call these inside .map() callbacks. `frame` and `fps` are threaded */
/*  through as plain arguments.                                        */
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

type RevealOpts = { delay?: number; drift?: number; blur?: number; dur?: number };
type Reveal = { opacity: number; translateY: number; blur: number; t: number };

function reveal(
  frame: number,
  fps: number,
  { delay = 0, drift = 10, blur = 0, dur = 26 }: RevealOpts = {}
): Reveal {
  const s = spring({
    fps,
    frame: frame - delay,
    config: { damping: 22, stiffness: 130, mass: 0.9 },
    durationInFrames: dur,
  });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(s, [0, 1], [drift, 0]);
  const blurPx =
    blur > 0 ? interpolate(s, [0, 1], [blur, 0], { extrapolateRight: "clamp" }) : 0;
  return { opacity, translateY, blur: blurPx, t: s };
}

/* gentle overshoot spring used for hero scale-ins */
function overshoot(frame: number, fps: number, delay: number, dur = 30): number {
  return spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 140, mass: 0.85 },
    durationInFrames: dur,
  });
}

/* clamp helper */
const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

/* eased 0→1 ramp between two frames (pure interpolate wrapper) */
function ramp(frame: number, a: number, b: number): number {
  return interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}

/* Loop-safe stage guard. The whole stage fades to opacity 0 (with a small
   upward drift + blur for polish) over the final ~12f and blooms back from 0
   over the first ~10f, so the content RESET between frame (D-1) and frame 0 is
   fully hidden behind a fade — a genuinely pop-free wrap, the same mechanism
   the companion demos use. Returns the composited opacity plus the exit
   drift/blur so the seam reads as a soft dissolve, not a hard cut. */
function loopSeam(
  frame: number,
  D: number
): { opacity: number; blur: number; drift: number } {
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const out = interpolate(frame, [D - 12, D - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  return {
    opacity: Math.min(fadeIn, 1 - out),
    blur: out * 6,
    drift: out * 5,
  };
}

/* ---- Iconography (consistent 1.6px stroke) ------------------------ */
function CheckBadge({ size = 14, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.25" stroke={color} strokeWidth="1.6" />
      <path
        d="M8 12.2l2.6 2.6L16 9.2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function DocIcon({ size = 12, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="3" stroke={color} strokeWidth="1.6" />
      <path d="M8 9h8M8 13h8M8 17h5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppGlyph({ size = 13, color = INK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 8.6c-.3 0-.6.1-.8.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.6 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1l-.6-.3-1.6-.8c-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.5-.6-.5H9z"
        fill={color}
      />
    </svg>
  );
}

/* Channel glyphs for the per-card hint + per-row source tag. 1.6px stroke. */
type Channel = "call" | "whatsapp" | "reminder";

function ChannelGlyph({
  channel,
  size = 11,
  color,
}: {
  channel: Channel;
  size?: number;
  color: string;
}) {
  if (channel === "call") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 4.5c1 0 1.8.7 2 1.6l.5 2c.1.6-.1 1.2-.6 1.6l-1.2.9c.9 1.8 2.4 3.3 4.2 4.2l.9-1.2c.4-.5 1-.7 1.6-.6l2 .5c.9.2 1.6 1 1.6 2v1.7c0 1.1-.9 2-2 2C9.6 19.7 4.3 14.4 4.3 7.2c0-1.1.9-2 2-2z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  if (channel === "whatsapp") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3.6a8.4 8.4 0 0 0-7.2 12.7L3.6 20.4l4.3-1.1A8.4 8.4 0 1 0 12 3.6z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9.3 8.5c.2 0 .3.1.4.3l.6 1.4c.1.2 0 .4-.1.5l-.4.4c-.1.1-.1.2 0 .4.3.6 1.1 1.4 1.9 1.7.2.1.3 0 .4-.1l.4-.5c.1-.2.3-.2.5-.1l1.4.7c.2.1.2.3.2.4 0 .5-.6.9-1 1-.4.1-.9.1-2-.4-1.7-.7-3-2.3-3.4-3-.2-.3-.5-1-.5-1.6 0-.7.4-1 .5-1.2.1-.1.3-.2.5-.2z"
          fill={color}
        />
      </svg>
    );
  }
  /* reminder: small bell */
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 16.5c.9-.8 1.4-1.9 1.4-3.1V11a4.6 4.6 0 0 1 9.2 0v2.4c0 1.2.5 2.3 1.4 3.1z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M10.2 19.2a2 2 0 0 0 3.6 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function channelTint(channel: Channel): string {
  if (channel === "call") return BLUE;
  if (channel === "whatsapp") return WA_GREEN;
  return SMS_AMBER;
}

/*  Type that sits ON a filled channel tint. Ultramarine is dark enough to
    carry paper-bright; the green and the amber are light, so they take ink.
    Same rule the palette uses everywhere: light type on dark grounds only. */
function channelFg(channel: Channel): string {
  return channel === "call" ? PAPER_BRIGHT : INK;
}

/*  The same channel identity, restated for the DARK panel. Ultramarine is
    a dark hue: on navy it composites to roughly 1.8:1 and the provenance
    tag stops being readable, so on that ground the call channel takes
    brand-soft. The green and the amber are already light and carry
    themselves on navy unchanged. */
function channelTintOnDark(channel: Channel): string {
  return channel === "call" ? BLUE_SOFT : channelTint(channel);
}

function channelLabel(channel: Channel): string {
  const it = getLocale() === "it";
  if (channel === "call") return it ? "via telefono" : "via call";
  if (channel === "whatsapp") return "via WhatsApp";
  return it ? "via promemoria" : "via reminder";
}

/* ---- Static data (defined once, outside render) ------------------- */
/*  Each touchpoint activates at `activeAt`; the active blue state moves
    along the timeline. The fact it produces writes into the dark record
    a beat later (handled by the row `delay`s below).                  */
type Card = {
  month: string;
  day: string;
  label: string;
  channel: Channel;
  bullets: string[];
  activeAt: number; // frame this touchpoint goes live (active state sweeps here)
};

const CARDS_EN: Card[] = [
  {
    month: "JUN",
    day: "01",
    label: "PREFERENCE CAPTURE",
    channel: "call",
    bullets: ["Consent + channel", "Explanation level"],
    activeAt: 40,
  },
  {
    month: "JUN",
    day: "02",
    label: "CHECK-IN",
    channel: "whatsapp",
    bullets: ["Run protocol", "Baseline delta"],
    activeAt: 150,
  },
  {
    month: "JUN",
    day: "07",
    label: "FOLLOW-UP",
    channel: "reminder",
    bullets: ["Review adherence", "Adjust cadence"],
    activeAt: 240,
  },
];

const CARDS_IT: Card[] = [
  {
    month: "GIU",
    day: "01",
    label: "PREFERENZE RACCOLTE",
    channel: "call",
    bullets: ["Consenso + canale", "Livello di dettaglio"],
    activeAt: 40,
  },
  {
    month: "GIU",
    day: "02",
    label: "CHECK-IN",
    channel: "whatsapp",
    bullets: ["Esegui protocollo", "Scostamento baseline"],
    activeAt: 150,
  },
  {
    month: "GIU",
    day: "07",
    label: "FOLLOW-UP",
    channel: "reminder",
    bullets: ["Verifica aderenza", "Regola frequenza"],
    activeAt: 240,
  },
];

const CARDS: Card[] = getLocale() === "it" ? CARDS_IT : CARDS_EN;

/*  Each record row is tied to the touchpoint that produced it. `source`
    is the small tag (via call / via WhatsApp / via reminder). Rows write
    in as their touchpoint activates — the record visibly compounds.   */
type Row = {
  label: string;
  value: string;
  delay: number;
  source: Channel;
  mono?: boolean;
};

const ROWS_EN: Row[] = [
  { label: "Preferred channel:", value: "WhatsApp", delay: 92, source: "call" },
  { label: "Explanation level:", value: "Simple", delay: 176, source: "whatsapp" },
  { label: "Best time:", value: "Tue 6–7pm", delay: 256, source: "reminder", mono: true },
  // A fourth fact that compounds the record — captured on the check-in,
  // written a beat later (records enrich asynchronously). Distinct source
  // tag + distinct content so the profile reads as genuinely richer.
  { label: "Caregiver:", value: "Daughter · CC", delay: 290, source: "whatsapp" },
];

const ROWS_IT: Row[] = [
  { label: "Canale preferito:", value: "WhatsApp", delay: 92, source: "call" },
  { label: "Livello di dettaglio:", value: "Semplice", delay: 176, source: "whatsapp" },
  { label: "Orario migliore:", value: "Mar 18–19", delay: 256, source: "reminder", mono: true },
  { label: "Caregiver:", value: "Figlia · CC", delay: 290, source: "whatsapp" },
];

const ROWS: Row[] = getLocale() === "it" ? ROWS_IT : ROWS_EN;

const WAVE_BARS = 5;

/* ================================================================== */

export function PatientContextComp() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const D = durationInFrames;
  const loc = getLocale();

  /* Normalized loop phase [0,1). Used for all continuous micro-life so
     every cyclic value returns exactly to its frame-0 state on wrap. */
  const loop = frame / D;
  const TWO_PI = Math.PI * 2;

  /* Global intro bloom: a soft blur-to-sharp on the whole stage as it fades up
     from the seam. Individual elements ALSO carry their own staggered reveal. */
  const stageInBlur = interpolate(frame, [0, 18], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  /* Seamless loop: stage fades to 0 over the last ~12f and blooms back over the
     first ~10f, hiding the content reset behind a dissolve. Drift+blur add polish. */
  const seam = loopSeam(frame, D);
  const stageBlur = Math.max(stageInBlur, seam.blur);

  /* Chrome (top bar / footer) */
  const topBar = reveal(frame, fps, { delay: 4, drift: -6, dur: 24 });
  const footer = reveal(frame, fps, { delay: 10, drift: 6, dur: 24 });

  /* Chat snippet + dark panel reveals */
  const chat = reveal(frame, fps, { delay: 56, drift: 10, blur: 4, dur: 28 });
  const panelOver = overshoot(frame, fps, 70, 36);
  const panelOpacity = interpolate(panelOver, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const panelScale = interpolate(panelOver, [0, 1], [0.94, 1]);
  const panelLift = interpolate(panelOver, [0, 1], [12, 0]);

  /* SYNCED footer reveals after the record has grown a couple of rows. */
  const syncedReveal = reveal(frame, fps, { delay: 312, drift: 6, dur: 24 });

  /* Closing beat: the "carried forward" line lands the persistence idea.
     Drifts in below SYNCED after everything settles (~frame 354), leaving
     a calm restful hold before the loop wraps at D. */
  const carriedReveal = reveal(frame, fps, { delay: 336, drift: 8, blur: 3, dur: 26 });

  /* Pre-compute per-item reveals OUTSIDE of JSX .map() so render order
     stays obvious and stable. Cards reveal early (the empty timeline is
     laid out first); their ACTIVE state then sweeps along over time. */
  const cardReveals = CARDS.map((_, i) =>
    reveal(frame, fps, { delay: 18 + i * 12, drift: 14, blur: 5, dur: 32 })
  );
  const bulletReveals = CARDS.map((card) =>
    card.bullets.map((_, j) =>
      reveal(frame, fps, { delay: card.activeAt + 8 + j * 9, drift: 5, dur: 22 })
    )
  );
  const rowReveals = ROWS.map((row) =>
    reveal(frame, fps, { delay: row.delay, drift: 7, dur: 22 })
  );

  /* The "active" blue state SWEEPS along the timeline. For each card we
     derive how lit it is right now: it ramps up at activeAt, holds while
     it's the live touchpoint, then settles to a calm "completed" floor
     once the next touchpoint takes over. This sells time passing across
     channels without anything popping. */
  const cardActivation = CARDS.map((card, i) => {
    const turnOn = ramp(frame, card.activeAt, card.activeAt + 16);
    const next = CARDS[i + 1];
    // once the next card goes live, this one relaxes from 1 → completed floor
    const handoff = next ? ramp(frame, next.activeAt, next.activeAt + 18) : 0;
    const live = turnOn * (1 - handoff); // 1 only while this is THE active touchpoint
    const completed = turnOn; // stays "touched" for the rest of the run
    return { live, completed };
  });

  /* Continuous micro-life ------------------------------------------- */
  // breathing pulse for live dots — 3 integer cycles over the loop.
  const breathe = 0.5 + 0.5 * Math.sin(loop * TWO_PI * 3);
  const dotPulse = 0.55 + 0.45 * breathe;
  const ringScale = 1 + 0.9 * breathe;
  const ringOpacity = 0.35 * (1 - breathe);

  // cursor blink — softened square wave, 9 integer cycles over the loop.
  const blinkRaw = Math.sin(loop * TWO_PI * 9);
  const cursorOn = clamp01(blinkRaw * 6 + 0.5);

  /* Which channel chip the top bar shows tracks the LIVE touchpoint, so
     the header reads as "currently on channel X". Cross-faded so it never
     hard-cuts. Defaults to the first card before any activation. */
  const liveIndex = (() => {
    let idx = 0;
    for (let i = 0; i < CARDS.length; i++) {
      if (frame >= CARDS[i].activeAt) idx = i;
    }
    return idx;
  })();
  const liveChannel = CARDS[liveIndex].channel;

  return (
    <AbsoluteFill
      style={{
        background: CANVAS,
        fontFamily: SANS,
        opacity: seam.opacity,
        transform: `translateY(${seam.drift}px)`,
        filter: stageBlur > 0.05 ? `blur(${stageBlur}px)` : "none",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ---- Ambient canvas texture: dot grid + soft radial glow ---- */}
      <AbsoluteFill
        style={{
          backgroundImage:
            /* ink at low alpha, so the grain is warm like the stock */
            "radial-gradient(rgba(22,19,15,0.045) 1px, transparent 1.2px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
          opacity: 0.6,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            /* was two blue glows; the depth is now two steps of the warm
               ramp — paper-2 then band — so nothing here is a hue. */
            "radial-gradient(620px 360px at 22% 14%, rgba(240,237,230,0.95), transparent 70%), radial-gradient(560px 420px at 86% 88%, rgba(224,219,208,0.55), transparent 72%)",
        }}
      />
      {/* subtle vignette so the canvas isn't dead-flat */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 140px rgba(22,19,15,0.06)" /* ink */,
          pointerEvents: "none",
        }}
      />

      {/* ================= TOP BAR ================= */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "rgba(253,252,250,0.82)" /* paper-bright, translucent */,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: `1px solid ${HAIRLINE}`,
          boxShadow: TOP_INNER_HIGHLIGHT,
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          gap: 12,
          opacity: topBar.opacity,
          transform: `translateY(${topBar.translateY}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 9, flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: MONO,
              color: MUTED,
              letterSpacing: 0.2,
              textTransform: "uppercase",
            }}
          >
            {loc === "it" ? "A" : "To"}
          </span>
          <span
            style={{
              fontSize: 14.5,
              color: INK,
              letterSpacing: -0.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {loc === "it"
              ? "Salve Sig.ra Johnson, sono Hana, confermo il suo appuntamento"
              : "Hi Ms. Johnson, this is Hana confirming your appointment"}
            <span
              style={{
                display: "inline-block",
                width: 1.5,
                height: 14,
                marginLeft: 3,
                transform: "translateY(2px)",
                /* a text caret is chrome, not a signal: ink keeps the
                   accent budget for the live touchpoint below */
                background: INK,
                opacity: cursorOn,
              }}
            />
          </span>
        </div>

        {/* Live channel chip — tracks the currently-active touchpoint so the
            header reads as "we're on channel X right now". */}
        <ChannelChip channel={liveChannel} />

        {/* Avatar + online dot */}
        <div style={{ position: "relative", width: 34, height: 34 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              /* paper-bright → paper-2 */
              background: `linear-gradient(180deg, ${PAPER_BRIGHT} 0%, ${PAPER_2} 100%)`,
              border: `1px solid ${HAIRLINE_2}`,
              boxShadow: "0 1px 2px rgba(22,19,15,0.07), " + TOP_INNER_HIGHLIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8.5" r="3.6" stroke={MUTED} strokeWidth="1.6" />
              <path
                d="M5 19.5c0-3.7 3.2-6 7-6s7 2.3 7 6"
                stroke={MUTED}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* pulsing ring */}
          <div
            style={{
              position: "absolute",
              right: -1,
              bottom: -1,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: SUCCESS,
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -1,
              bottom: -1,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: SUCCESS,
              border: `2px solid ${PAPER_BRIGHT}`,
              boxShadow: "0 0 0 0.5px rgba(22,19,15,0.06)",
            }}
          />
        </div>
      </div>

      {/* ================= TIMELINE CARDS ================= */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 90,
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        {CARDS.map((card, i) => {
          const r = cardReveals[i];
          const { live, completed } = cardActivation[i];
          // Visual accent strength: fully lit while LIVE, calm tint when completed.
          const accent = live;
          const touched = completed;
          const tint = channelTint(card.channel);
          // type colour once the header is filled with the channel tint
          const litFg = channelFg(card.channel);
          // connector to the next card lights as the touchpoint hands off
          const next = CARDS[i + 1];
          const connectorLit = next ? ramp(frame, card.activeAt + 30, next.activeAt) : 0;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                opacity: r.opacity * interpolate(touched, [0, 1], [0.74, 1]),
                transform: `translateY(${r.translateY}px)`,
                filter: r.blur > 0.05 ? `blur(${r.blur}px)` : "none",
              }}
            >
              {/* timeline connector to the next card (sweeps with handoff) */}
              {next && (
                <div
                  style={{
                    position: "absolute",
                    top: 30,
                    right: -14,
                    width: 14,
                    height: 2,
                    background: HAIRLINE_2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(90deg, ${tint}, ${channelTint(next.channel)})`,
                      transform: `scaleX(${connectorLit})`,
                      transformOrigin: "left center",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  width: 150,
                  background: PAPER_BRIGHT,
                  borderRadius: 18,
                  boxShadow: accent > 0.5 ? CARD_SHADOW : CARD_SHADOW_SOFT,
                  border: `1px solid ${HAIRLINE}`,
                  overflow: "hidden",
                }}
              >
                {/* calendar header — cross-fades from neutral to its channel tint
                    as the touchpoint goes live, then relaxes to a calm tinted
                    state once completed. */}
                <div
                  style={{
                    position: "relative",
                    /* resting header: paper-2 → band, two steps of the ramp */
                    background: `linear-gradient(180deg, ${PAPER_2} 0%, ${BAND} 100%)`,
                    padding: "13px 12px 11px",
                    textAlign: "center",
                    boxShadow: "inset 0 1px 0 rgba(253,252,250,0.7)",
                  }}
                >
                  {/* lit gradient overlay (opacity follows LIVE state) */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      /* flat channel tint; the inset highlight below does
                         the top-light the old two-stop gradient was faking */
                      background: tint,
                      opacity: accent,
                      boxShadow: "inset 0 1px 0 rgba(253,252,250,0.30)",
                    }}
                  />
                  <p
                    style={{
                      position: "relative",
                      margin: 0,
                      fontSize: 10,
                      fontFamily: MONO,
                      fontWeight: 600,
                      color: mixHex(MUTED, litFg, accent),
                      letterSpacing: 2,
                    }}
                  >
                    {card.month}
                  </p>
                  <p
                    style={{
                      position: "relative",
                      margin: "1px 0 0",
                      fontSize: 32,
                      fontFamily: SERIF,
                      fontWeight: 400,
                      color: mixHex(SLATE_2, litFg, accent),
                      lineHeight: 1.05,
                      letterSpacing: -0.5,
                      fontFeatureSettings: "'tnum' 1",
                    }}
                  >
                    {card.day}
                  </p>
                  {/* LIVE indicator dot in header — only while this is the
                      active touchpoint; completed cards show a steady check. */}
                  <div
                    style={{
                      position: "absolute",
                      top: 11,
                      right: 11,
                      width: 7,
                      height: 7,
                    }}
                  >
                    {/* live pulse */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: litFg,
                        opacity: live * dotPulse,
                        /* the glow follows the dot: paper-bright on the
                           ultramarine header, ink on the light tints */
                        boxShadow: `0 0 8px ${hexA(litFg, 0.8)}`,
                      }}
                    />
                    {/* completed check (fades in as live relaxes) */}
                    <div
                      style={{
                        position: "absolute",
                        inset: -2,
                        opacity: clamp01(touched - live) * 0.9,
                      }}
                    >
                      <CheckBadge size={11} color={touched > 0 && accent < 0.3 ? tint : litFg} />
                    </div>
                  </div>
                </div>

                {/* body */}
                <div style={{ padding: "11px 12px 12px" }}>
                  {/* channel hint row — sells the MULTI-channel point */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 9,
                    }}
                  >
                    <div
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: 6,
                        background: hexA(tint, 0.1),
                        border: `1px solid ${hexA(tint, 0.24)}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ChannelGlyph channel={card.channel} size={10} color={tint} />
                    </div>
                    <span
                      style={{
                        fontSize: 8.5,
                        fontFamily: MONO,
                        fontWeight: 600,
                        color: mixHex(MUTED, tint, Math.max(accent, touched * 0.7)),
                        letterSpacing: 0.6,
                      }}
                    >
                      {card.label}
                    </span>
                  </div>
                  {card.bullets.map((b, j) => {
                    const br = bulletReveals[i][j];
                    return (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: j === card.bullets.length - 1 ? 0 : 6,
                          opacity: br.opacity,
                          transform: `translateY(${br.translateY}px)`,
                        }}
                      >
                        <CheckBadge size={12} color={SUCCESS} />
                        <span style={{ fontSize: 10.5, color: SLATE, letterSpacing: -0.1 }}>{b}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "context compounds" caption under the timeline */}
      <ContextCaption frame={frame} fps={fps} cardActivation={cardActivation} />

      {/* ================= RIGHT COLUMN ================= */}
      <div
        style={{
          position: "absolute",
          right: 30,
          top: 78,
          width: 286,
        }}
      >
        {/* Mini chat snippet */}
        <div
          style={{
            opacity: chat.opacity,
            transform: `translateY(${chat.translateY}px)`,
            filter: chat.blur > 0.05 ? `blur(${chat.blur}px)` : "none",
            background: PAPER_BRIGHT,
            borderRadius: 16,
            border: `1px solid ${HAIRLINE}`,
            boxShadow: CARD_SHADOW_SOFT + ", " + TOP_INNER_HIGHLIGHT,
            padding: "12px 14px",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                /* was a blue wash; this is a note avatar, not a state, so
                   it takes the warm ramp and leaves the accent unspent */
                background: `linear-gradient(180deg, ${PAPER_2} 0%, ${BAND} 100%)`,
                border: `1px solid ${HAIRLINE_2}`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DocIcon size={13} color={MUTED} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: "0 0 3px",
                  fontSize: 9.5,
                  fontFamily: MONO,
                  fontWeight: 600,
                  color: MUTED,
                  letterSpacing: 0.6,
                }}
              >
                HANA
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: SLATE,
                  margin: 0,
                  lineHeight: 1.55,
                  letterSpacing: -0.1,
                }}
              >
                {loc === "it"
                  ? "Ogni contatto scrive in un unico record — portato in quello dopo."
                  : "Every touch writes to one record — carried into the next."}
              </p>
            </div>
          </div>
        </div>

        {/* Dark PATIENT CONTEXT panel */}
        <div
          style={{
            opacity: panelOpacity,
            transform: `translateY(${panelLift}px) scale(${panelScale})`,
            transformOrigin: "top right",
            /* the one genuinely dark surface: navy-soft → navy */
            background:
              "linear-gradient(180deg, " + NAVY_SOFT + " 0%, " + INK_DEEP + " 100%)",
            borderRadius: 18,
            padding: "15px 18px 14px",
            boxShadow: PANEL_SHADOW + ", inset 0 1px 0 rgba(253,252,250,0.10)",
            border: "1px solid rgba(253,252,250,0.06)",
          }}
        >
          {/* header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {/* on navy, every grey is a paper-bright alpha, never an ink */}
            <DocIcon size={13} color="rgba(253,252,250,0.55)" />
            <span
              style={{
                fontSize: 9.5,
                fontFamily: MONO,
                fontWeight: 600,
                color: "rgba(253,252,250,0.62)",
                letterSpacing: 1.1,
              }}
            >
              {loc === "it" ? "CONTESTO PAZIENTE" : "PATIENT CONTEXT"}
            </span>
            {/* live record counter — increments as facts compound */}
            <RecordCounter frame={frame} />
            <span
              style={{
                fontSize: 8.5,
                fontFamily: MONO,
                fontWeight: 600,
                color: SUCCESS,
                letterSpacing: 0.8,
                marginLeft: "auto",
                padding: "2px 7px",
                borderRadius: 6,
                background: "rgba(16,185,129,0.14)" /* signal green */,
                border: "1px solid rgba(16,185,129,0.26)",
              }}
            >
              {loc === "it" ? "AGGIORNATO" : "UPDATED"}
            </span>
          </div>

          {/* rows fill in one by one — each tied to its touchpoint, with a
              small source tag. The record visibly GROWS over time. */}
          {ROWS.map((row, i) => {
            const rr = rowReveals[i];
            /* dark ground: the call channel reads as brand-soft here */
            const tint = channelTintOnDark(row.source);
            // freshly-written rows flash their source tint briefly, then calm
            const freshFlash = interpolate(
              frame,
              [row.delay, row.delay + 10, row.delay + 40],
              [0, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
            );
            return (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  opacity: rr.opacity,
                  transform: `translateY(${rr.translateY}px)`,
                }}
              >
                {/* fact line: check · label · value */}
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ position: "relative", width: 14, height: 14, flexShrink: 0 }}>
                    {/* write-in flash halo */}
                    <div
                      style={{
                        position: "absolute",
                        inset: -3,
                        borderRadius: "50%",
                        background: tint,
                        opacity: freshFlash * 0.3,
                        filter: "blur(2px)",
                      }}
                    />
                    <CheckBadge size={14} color={SUCCESS} />
                  </div>
                  <span style={{ fontSize: 11.5, color: "rgba(253,252,250,0.62)", letterSpacing: -0.1 }}>
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: PAPER_BRIGHT,
                      marginLeft: "auto",
                      letterSpacing: -0.1,
                      fontFamily: row.mono ? MONO : SANS,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
                {/* provenance line: which touchpoint produced this fact,
                    indented under the label so the fact reads first. */}
                <div style={{ display: "flex", marginTop: 3, paddingLeft: 23 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 8,
                      fontFamily: MONO,
                      fontWeight: 600,
                      /* mixHex needs literal hex on both ends, so the dim
                         base here is ink-mute, the warm grey that sits
                         between navy and paper on the ramp */
                      color: mixHex(MUTED, tint, 0.5 + freshFlash * 0.5),
                      letterSpacing: 0.4,
                      padding: "1.5px 6px",
                      borderRadius: 5,
                      background: hexA(tint, 0.06 + freshFlash * 0.12),
                      border: `1px solid ${hexA(tint, 0.14 + freshFlash * 0.18)}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <ChannelGlyph channel={row.source} size={8} color={mixHex(MUTED, tint, 0.7)} />
                    {channelLabel(row.source)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* footer */}
          <div
            style={{
              borderTop: "1px solid rgba(253,252,250,0.10)",
              marginTop: 3,
              paddingTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: syncedReveal.opacity,
              transform: `translateY(${syncedReveal.translateY}px)`,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontFamily: MONO,
                color: "rgba(253,252,250,0.45)",
                letterSpacing: 0.4,
              }}
            >
              ID&nbsp;RD8XG5
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontFamily: MONO,
                  fontWeight: 600,
                  color: "rgba(253,252,250,0.55)",
                  letterSpacing: 1,
                }}
              >
                SYNCED
              </span>
              <div style={{ position: "relative", width: 8, height: 8 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: SUCCESS,
                    transform: `scale(${ringScale})`,
                    opacity: ringOpacity * 1.4,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: SUCCESS,
                    opacity: dotPulse,
                    boxShadow: "0 0 6px rgba(16,185,129,0.7)" /* signal green */,
                  }}
                />
              </div>
            </div>
          </div>

          {/* closing beat — context CARRIED FORWARD into the next touch */}
          <div
            style={{
              borderTop: "1px solid rgba(253,252,250,0.10)",
              marginTop: 9,
              paddingTop: 9,
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: carriedReveal.opacity,
              transform: `translateY(${carriedReveal.translateY}px)`,
              filter: carriedReveal.blur > 0.05 ? `blur(${carriedReveal.blur}px)` : "none",
            }}
          >
            {/* forward-arrow chip */}
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                /* the accent on a dark ground: brand-soft, and this chip
                   is the beat the whole frame is about */
                background: "rgba(169,180,255,0.16)",
                border: "1px solid rgba(169,180,255,0.30)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke={BLUE_SOFT}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: 10.5,
                color: "rgba(253,252,250,0.62)",
                letterSpacing: -0.1,
                lineHeight: 1.3,
              }}
            >
              {loc === "it" ? "Contesto portato nel" : "Context carried into"}
              <span style={{ color: PAPER_BRIGHT }}>
                {loc === "it" ? " contatto dopo" : " next touch"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ================= FOOTER BAR ================= */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 52,
          background: "rgba(253,252,250,0.82)" /* paper-bright, translucent */,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderTop: `1px solid ${HAIRLINE}`,
          boxShadow: "inset 0 1px 0 rgba(253,252,250,0.7)",
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          justifyContent: "space-between",
          opacity: footer.opacity,
          transform: `translateY(${footer.translateY}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: 9, height: 9 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: DANGER,
                  transform: `scale(${ringScale})`,
                  opacity: ringOpacity * 1.3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: DANGER,
                  opacity: dotPulse,
                  boxShadow: "0 0 6px rgba(255,69,58,0.6)",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                fontFamily: MONO,
                fontWeight: 600,
                color: SLATE,
                letterSpacing: 1,
              }}
            >
              {loc === "it" ? "CANALE VOCALE ATTIVO" : "VOICE CHANNEL ACTIVE"}
            </span>
          </div>

          {/* gentle live waveform — 4 integer cycles over the loop */}
          <div style={{ display: "flex", alignItems: "center", gap: 3, height: 18 }}>
            {Array.from({ length: WAVE_BARS }).map((_, i) => {
              const phase = loop * TWO_PI * 4 + i * 0.9;
              const h = 5 + (0.5 + 0.5 * Math.sin(phase)) * 11;
              return (
                <div
                  key={i}
                  style={{
                    width: 2.5,
                    height: h,
                    borderRadius: 2,
                    /* ink-soft, so the meter is warm grey not cool slate */
                    background: `rgba(74,66,57,${0.35 + 0.4 * clamp01(h / 16)})`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* END CALL chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "linear-gradient(180deg, #FF5C52 0%, #FF3B30 100%)",
            borderRadius: 9,
            padding: "7px 15px",
            boxShadow:
              "0 1px 2px rgba(22,19,15,0.14), 0 6px 14px -8px rgba(255,59,48,0.55), inset 0 1px 0 rgba(253,252,250,0.30)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 4.5c1 0 1.8.7 2 1.6l.5 2c.1.6-.1 1.2-.6 1.6l-1.2.9c.9 1.8 2.4 3.3 4.2 4.2l.9-1.2c.4-.5 1-.7 1.6-.6l2 .5c.9.2 1.6 1 1.6 2v1.7c0 1.1-.9 2-2 2C9.6 19.7 4.3 14.4 4.3 7.2c0-1.1.9-2 2-2z"
              fill={PAPER_BRIGHT}
            />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: PAPER_BRIGHT, letterSpacing: 0.2 }}>
            {loc === "it" ? "Termina" : "End call"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ================================================================== */
/*  Sub-components                                                      */
/* ================================================================== */

/* Top-bar channel chip — cross-fades between the channel styles so the
   header tracks the LIVE touchpoint without ever hard-cutting. */
function ChannelChip({ channel }: { channel: Channel }) {
  const isWA = channel === "whatsapp";
  const isCall = channel === "call";
  /* Flat channel tint. The old two-stop gradients were faking a top light
     the inset highlight in `glow` already provides. */
  const bg = channelTint(channel);
  const fg = channelFg(channel);
  const glow = isWA
    ? "0 1px 2px rgba(22,19,15,0.12), 0 6px 14px -8px rgba(16,185,129,0.45), inset 0 1px 0 rgba(253,252,250,0.35)"
    : isCall
    ? "0 1px 2px rgba(22,19,15,0.12), 0 6px 14px -8px rgba(37,54,230,0.45), inset 0 1px 0 rgba(253,252,250,0.35)"
    : "0 1px 2px rgba(22,19,15,0.12), 0 6px 14px -8px rgba(232,160,106,0.45), inset 0 1px 0 rgba(253,252,250,0.35)";
  const it = getLocale() === "it";
  const label = isWA
    ? "WhatsApp"
    : isCall
    ? it
      ? "Chiamata"
      : "Voice call"
    : it
    ? "Promemoria SMS"
    : "SMS reminder";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        background: bg,
        borderRadius: 9,
        padding: "6px 12px 6px 10px",
        boxShadow: glow,
      }}
    >
      {isWA ? (
        <WhatsAppGlyph size={14} color={fg} />
      ) : (
        <ChannelGlyph channel={channel} size={13} color={fg} />
      )}
      <span style={{ fontSize: 12, fontWeight: 600, color: fg, letterSpacing: 0.1 }}>
        {label}
      </span>
    </div>
  );
}

/* Small caption under the timeline that lands the compounding idea, and
   subtly counts touchpoints as they accumulate. */
function ContextCaption({
  frame,
  fps,
  cardActivation,
}: {
  frame: number;
  fps: number;
  cardActivation: { live: number; completed: number }[];
}) {
  const r = reveal(frame, fps, { delay: 60, drift: 6, dur: 24 });
  const it = getLocale() === "it";
  const touched = cardActivation.reduce((n, c) => n + (c.completed > 0.5 ? 1 : 0), 0);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 282,
        display: "flex",
        alignItems: "center",
        gap: 9,
        opacity: r.opacity,
        transform: `translateY(${r.translateY}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "5px 11px 5px 9px",
          borderRadius: 999,
          background: "rgba(253,252,250,0.85)" /* paper-bright */,
          border: `1px solid ${HAIRLINE_2}`,
          boxShadow: "0 1px 2px rgba(22,19,15,0.06), inset 0 1px 0 rgba(253,252,250,0.7)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <span
          style={{
            fontSize: 9.5,
            fontFamily: MONO,
            fontWeight: 600,
            /* was the old blue. The live card header is already carrying
               the accent in this frame, so the counter takes ink. */
            color: INK,
            letterSpacing: 0.5,
          }}
        >
          {touched}/3
        </span>
        <span style={{ width: 1, height: 11, background: HAIRLINE_2 }} />
        <span style={{ fontSize: 11.5, color: SLATE, letterSpacing: -0.1 }}>
          {it
            ? "Contatti — ognuno scrive un dato nel record"
            : "Touchpoints — each writes one fact into the record"}
        </span>
      </div>
    </div>
  );
}

/* Live record-field counter that ticks up as facts compound. */
function RecordCounter({ frame }: { frame: number }) {
  const count = ROWS.reduce((n, row) => n + (frame >= row.delay + 6 ? 1 : 0), 0);
  return (
    <span
      style={{
        fontSize: 8.5,
        fontFamily: MONO,
        fontWeight: 600,
        color: "rgba(253,252,250,0.45)",
        letterSpacing: 0.5,
        padding: "1.5px 6px",
        borderRadius: 5,
        background: "rgba(253,252,250,0.06)",
        border: "1px solid rgba(253,252,250,0.09)",
      }}
    >
      {count} {getLocale() === "it" ? "campi" : "fields"}
    </span>
  );
}

/* ---- Color helpers (pure) ---------------------------------------- */
/* Mix two #rrggbb hex colors by t in [0,1], return an rgb() string. */
function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [
    parseInt(a.slice(1, 3), 16),
    parseInt(a.slice(3, 5), 16),
    parseInt(a.slice(5, 7), 16),
  ];
  const pb = [
    parseInt(b.slice(1, 3), 16),
    parseInt(b.slice(3, 5), 16),
    parseInt(b.slice(5, 7), 16),
  ];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/* #rrggbb hex → rgba() string with explicit alpha. */
function hexA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`;
}
