import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/* ------------------------------------------------------------------ */
/*  Hana Remote — Care Journey motion graphic. Federato's STRUCTURE     */
/*  (rail + swapping vignettes + traveling data), Retell's PALETTE:     */
/*   - WHITE cards, lavender-gray rows, near-black navy ink            */
/*   - docked chips = flat BLUE segments inside full-width gray bars   */
/*   - XL rail badges; active node grows ~1.55x from the line          */
/*   - dashed rail/coda lines = SVG with long thick light dashes       */
/*   - chips fly in arcs w/ tilt + landing bounce (shadow only aloft)  */
/*  Canvas 800x820 @ 30fps, 840-frame loop (28s), TRANSPARENT bg — the */
/*  page provides the navy textured backdrop behind the <Player>.      */
/*  Portrait-ish so it fills the hero's right half; cards sit in the   */
/*  lower two-thirds like the reference, rail just below the navbar.   */
/*  Beats: Enroll · Check in · Flag · Escalate · Document · coda.      */
/*  Scene windows = 120f, travel gaps = 20f.                           */
/* ------------------------------------------------------------------ */

const SANS = "'DM Sans', system-ui, sans-serif";

/* Retell-derived palette (Matteo 2026-08-12: "colour scheme like retell").
   White cards on lavender-gray rows, near-black navy ink, ONE bright blue as
   the accent for every highlight/status, warm peach + indigo only on the rail
   badges. No yellow anywhere — Retell's system doesn't use it. */
const NAVY = "#0A1633";
const BLUE = "#2563EB";
const ORANGE = "#F59E42"; // Retell's warm accent, second of the two
const CARD_BG = "#FFFFFF";
const ROW_BG = "#E7EBF5";
const ROW_INNER = "#F7F8FC";
const CHIP_BG = BLUE;
const CHIP_INK = "#FFFFFF";
const T_TITLE = "#0A1633";
const T_SUB = "#6B7488";
const T_BODY = "#454E63";
const HAIRLINE = "rgba(10,22,51,0.10)";
// Rail + coda dashes: back to white — the hero ground is the dark ocean photo.
const CREAM_LINE = "rgba(255,255,255,0.8)";

// Cards sit on a LIGHT canvas, so they need a hairline as well as a shadow.
const CARD_BORDER = "1px solid rgba(10,22,51,0.07)";
const CARD_SHADOW =
  "0 1px 3px rgba(10,22,51,0.06), 0 18px 44px -14px rgba(10,22,51,0.22)";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

/* Timeline ----------------------------------------------------------- */
/* The OUTCOME CODA opens the loop (like the reference, whose video starts on
   "new submission → quote"): frames 0-120 are the coda with a bare canvas —
   no rail, no chips — then the rail fades in and the five scenes run. So the
   order is: new enrollment → the journey → (loop). */
const SCENE = 120;
const GAP = 20;
const T = SCENE + GAP; // 140
const S0 = T; // first scene starts after the coda
export const CARE_JOURNEY_DURATION = 840; // 6 * T = 28s @30fps

/* Restrained Retell ramp: blue → indigo → peach → coral → navy (cool to warm to
   resolved). White stars on every badge. */
const STAGES = [
  { key: "ENROLL", color: BLUE },
  { key: "CHECK IN", color: "#4F46E5" },
  { key: "FLAG", color: ORANGE },
  { key: "ESCALATE", color: "#E2703A" },
  { key: "DOCUMENT", color: NAVY },
];
// Rail inset from the canvas edges (was 80..720, edge to edge): the reference
// keeps clear margins either side of the rail so it reads as a contained
// diagram rather than a strip bleeding off the panel.
const RAIL_X = [110, 255, 400, 545, 690];
const RAIL_INSET = 46;
const RAIL_LINE_Y = 64;

/* Icon paths (24x24) -------------------------------------------------- */
const P_PHONE =
  "M6.6 10.8c1.5 2.9 3.8 5.2 6.7 6.7l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1l-2.1 2.3z";
const P_CLIP =
  "M9 2h6a1 1 0 0 1 1 1v1h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3V3a1 1 0 0 1 1-1zm1 2v1h4V4h-4z";
const P_ALERT = "M12 3l10 17H2L12 3zm-1 7h2v4h-2v-4zm0 5.5h2v2h-2v-2z";
const P_DB =
  "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zm8 6v4c0 1.7-3.6 3-8 3s-8-1.3-8-3V9c1.7 1.5 4.6 2.2 8 2.2S18.3 10.5 20 9zm0 6v4c0 1.7-3.6 3-8 3s-8-1.3-8-3v-4c1.7 1.5 4.6 2.2 8 2.2s6.3-.7 8-2.2z";

function Icon({ d, size, color }: { d: string; size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block" }}>
      <path d={d} fill={color} />
    </svg>
  );
}

function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block" }}>
      <path
        d="M12 0 C13.2 6.8 17.2 10.8 24 12 C17.2 13.2 13.2 17.2 12 24 C10.8 17.2 6.8 13.2 0 12 C6.8 10.8 10.8 6.8 12 0 Z"
        fill={color}
      />
    </svg>
  );
}

/* Small UI atoms ------------------------------------------------------ */
/* A row bar: full-ish width, chips dock INSIDE it as flat segments.    */
function Bar({ w, h = 26 }: { w: number; h?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: w,
        height: h,
        borderRadius: 6,
        background: ROW_BG,
        verticalAlign: "middle",
      }}
    />
  );
}

function Header({ d, title, sub }: { d: string; title: string; sub: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingBottom: 10,
        marginBottom: 14,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: "#EFF3FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon d={d} size={15} color={BLUE} />
      </div>
      <div style={{ fontFamily: SANS }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_TITLE, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: T_SUB, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

/* Staggered child reveal: quick crisp rise. `at` is absolute frames.   */
function riseStyle(frame: number, fps: number, at: number, dist = 10): React.CSSProperties {
  if (frame < at) return { opacity: 0, transform: `translateY(${dist}px)` };
  const s = spring({ frame: frame - at, fps, config: { damping: 17, stiffness: 210, mass: 0.6 } });
  return {
    opacity: Math.min(s, 1),
    transform: `translateY(${(1 - s) * dist}px)`,
  };
}

function Rise({
  frame,
  fps,
  at,
  children,
  dist,
}: {
  frame: number;
  fps: number;
  at: number;
  children: React.ReactNode;
  dist?: number;
}) {
  return <div style={riseStyle(frame, fps, at, dist)}>{children}</div>;
}

/* Scene container: crisp spring entrance, quick slide-out, idle breath. */
function sceneStyle(frame: number, fps: number, i: number): React.CSSProperties | null {
  const start = S0 + i * T;
  const end = start + SCENE;
  if (frame < start - 2 || frame > end + 12) return null;
  const s = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 190, mass: 0.7 } });
  const settle = Math.min(s, 1);
  const out = interpolate(frame, [end - 2, end + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const breath = settle > 0.98 && out === 0 ? Math.sin((frame - start) / 24) * 1.6 : 0;
  return {
    opacity: settle * (1 - out),
    transform: `translateY(${(1 - s) * 22 - out * 16 + breath}px) scale(${0.97 + s * 0.03 - out * 0.015})`,
  };
}

/* Chips ---------------------------------------------------------------- */
/* Docked = flat blue segment inside a bar (y equals the bar's y, same   */
/* height, no shadow). Travel segments fly an arc with tilt; arrivals    */
/* land with a bounce. Chip height 26 matches Bar height.                */
type Dock = { f: number; x: number; y: number };
/* Frames below are absolute and already include the leading coda (+S0). */
const CHIPS: { text: string; born: number; bg?: string; ink?: string; docks: Dock[] }[] = [
  {
    text: "Maria R.",
    born: 170,
    docks: [
      { f: 170, x: 176, y: 438 },
      { f: 256, x: 176, y: 438 },
      { f: 304, x: 176, y: 423 },
      { f: 396, x: 176, y: 423 },
      { f: 454, x: 170, y: 558 },
      { f: 536, x: 170, y: 558 },
      { f: 584, x: 151, y: 459 },
      { f: 676, x: 151, y: 459 },
      { f: 724, x: 238, y: 408 },
      { f: 820, x: 238, y: 408 },
    ],
  },
  {
    text: "CPAP · 2 hrs last night",
    born: 305,
    docks: [
      { f: 305, x: 182, y: 537 },
      { f: 401, x: 182, y: 537 },
      { f: 449, x: 190, y: 421 },
      { f: 537, x: 190, y: 421 },
      { f: 585, x: 268, y: 459 },
      { f: 677, x: 268, y: 459 },
      { f: 725, x: 246, y: 442 },
      { f: 820, x: 246, y: 442 },
    ],
  },
  {
    text: "Below 4-hr threshold",
    born: 445,
    // the risk finding travels in the warm accent, so the two data types read apart
    bg: ORANGE,
    ink: "#3D2408",
    docks: [
      { f: 445, x: 470, y: 712 },
      { f: 541, x: 470, y: 712 },
      { f: 589, x: 214, y: 515 },
      { f: 681, x: 214, y: 515 },
      { f: 729, x: 232, y: 476 },
      { f: 820, x: 232, y: 476 },
    ],
  },
];

const ARC_LIFT = 36;

function Chip({ frame, fps, chip }: { frame: number; fps: number; chip: (typeof CHIPS)[number] }) {
  const { docks } = chip;

  // Fade out before the loop returns to the coda — the coda canvas stays bare.
  const opacity = interpolate(frame, [chip.born, chip.born + 8, 822, 834], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < chip.born - 1 || opacity <= 0) return null;

  let k = docks.length - 2;
  for (let i = 0; i < docks.length - 1; i++) {
    if (frame >= docks[i].f && frame < docks[i + 1].f) {
      k = i;
      break;
    }
  }
  const d0 = docks[Math.max(0, k)];
  const d1 = docks[Math.min(docks.length - 1, k + 1)];
  const moving = d0.x !== d1.x || d0.y !== d1.y;

  let x = d0.x;
  let y = d0.y;
  let rot = 0;
  let lift = 0;

  if (moving && frame >= d0.f) {
    const p = interpolate(frame, [d0.f, d1.f], [0, 1], {
      easing: EASE_IO,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const air = Math.sin(p * Math.PI);
    x = d0.x + (d1.x - d0.x) * p;
    y = d0.y + (d1.y - d0.y) * p - air * ARC_LIFT;
    rot = air * 7 * Math.sign(d1.x - d0.x || 1);
    lift = air;
  }

  let landScale = 1;
  if (!moving && k > 0) {
    const prev = docks[k - 1];
    const flewIn = prev.x !== d0.x || prev.y !== d0.y;
    if (flewIn) {
      const s = spring({ frame: frame - d0.f, fps, config: { damping: 10, stiffness: 260, mass: 0.6 } });
      landScale = 1.12 - Math.min(s, 1) * 0.12;
    }
  }

  const pop = spring({ frame: frame - chip.born, fps, config: { damping: 12, stiffness: 190, mass: 0.7 } });
  const scale = (0.65 + Math.min(pop, 1.15) * 0.35) * landScale * (1 + lift * 0.06);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale}) rotate(${rot}deg)`,
        background: chip.bg ?? CHIP_BG,
        color: chip.ink ?? CHIP_INK,
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 700,
        height: 26,
        lineHeight: "26px",
        padding: "0 12px",
        borderRadius: 6,
        /* flat when parked — depth only while airborne (reference look) */
        boxShadow: lift > 0.02 ? `0 ${lift * 18}px ${6 + lift * 30}px rgba(0,0,0,${0.18 + lift * 0.3})` : "none",
        whiteSpace: "nowrap",
        zIndex: 3,
      }}
    >
      {chip.text}
    </div>
  );
}

/* Speech bubble --------------------------------------------------------- */
function Bubble({ who, children, maxWidth }: { who: "hana" | "patient"; children: React.ReactNode; maxWidth?: number }) {
  const hana = who === "hana";
  return (
    <div style={{ display: "flex", justifyContent: hana ? "flex-start" : "flex-end" }}>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 13,
          lineHeight: 1.45,
          padding: "8px 13px",
          borderRadius: 14,
          maxWidth: maxWidth ?? 360,
          ...(hana
            ? { background: "#0A1633", color: "#fff", borderBottomLeftRadius: 4 }
            : { background: ROW_INNER, color: T_TITLE, border: `1px solid ${HAIRLINE}`, borderBottomRightRadius: 4 }),
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CheckLine({ text, color }: { text: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: SANS, fontSize: 12, fontWeight: 600, color }}>
      <svg viewBox="0 0 24 24" width={14} height={14}>
        <path d="M5 13l4 4L19 7" stroke={color} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </div>
  );
}

function Card({
  x,
  y,
  w,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        background: CARD_BG,
        /* uniform radius — the reference's oversized bottom-left corner read as
           a mistake at this scale (Matteo 2026-08-12: "weird shape") */
        borderRadius: 18,
        padding: 22,
        boxShadow: CARD_SHADOW,
        border: CARD_BORDER,
        zIndex: 2,
      ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Dashed line as SVG — long thick cream dashes like the reference.      */
function DashedLine({ vertical, length }: { vertical?: boolean; length: number }) {
  return (
    <svg
      width={vertical ? 4 : length}
      height={vertical ? length : 4}
      style={{ display: "block" }}
      aria-hidden
    >
      <line
        x1={vertical ? 2 : 0}
        y1={vertical ? 0 : 2}
        x2={vertical ? 2 : length}
        y2={vertical ? length : 2}
        stroke={CREAM_LINE}
        strokeWidth={2.5}
        strokeDasharray="11 9"
      />
    </svg>
  );
}

/* Rail ------------------------------------------------------------------ */
function Rail({ frame, fps }: { frame: number; fps: number }) {
  // Fully hidden while the coda plays (frames 0-126): the opening beat is a bare
  // canvas with nothing on top. Fades in as the first scene arrives, out at the end.
  const dim = interpolate(frame, [126, 148, 806, 826], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (dim <= 0.01) return null;

  let runner: { x: number; o: number } | null = null;
  for (let i = 0; i < 4; i++) {
    const g0 = S0 + i * T + SCENE;
    const g1 = S0 + (i + 1) * T;
    if (frame >= g0 - 2 && frame <= g1 + 2) {
      const p = interpolate(frame, [g0, g1], [0, 1], {
        easing: EASE_IO,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      runner = {
        x: RAIL_X[i] + (RAIL_X[i + 1] - RAIL_X[i]) * p,
        o: Math.sin(p * Math.PI),
      };
    }
  }

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 130, opacity: dim }}>
      <div style={{ position: "absolute", left: RAIL_INSET, top: RAIL_LINE_Y - 2 }}>
        <DashedLine length={800 - RAIL_INSET * 2} />
      </div>
      {runner && (
        <div
          style={{
            position: "absolute",
            left: runner.x - 5,
            top: RAIL_LINE_Y - 5,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: CHIP_BG,
            opacity: runner.o,
            boxShadow: `0 0 14px 5px rgba(239,233,127,${0.55 * runner.o})`,
            zIndex: 2,
          }}
        />
      )}
      {STAGES.map((s, i) => {
        const start = S0 + i * T;
        const end = start + SCENE;
        const scale = interpolate(frame, [start - 6, start + 12, end + 2, end + 16], [1, 1.55, 1.55, 1], {
          easing: EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const lift = interpolate(scale, [1, 1.55], [0, 1]);
        const ringT = interpolate(frame, [start, start + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        });
        return (
          <div
            key={s.key}
            style={{
              position: "absolute",
              left: RAIL_X[i] - 80,
              top: RAIL_LINE_Y - 22,
              width: 160,
              height: 44,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${scale})`,
              transformOrigin: "50% 30%",
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: "relative",
                background: CARD_BG,
                borderRadius: 12,
                border: CARD_BORDER,
                padding: "11px 15px 9px",
                boxShadow: `0 ${5 + lift * 12}px ${16 + lift * 26}px rgba(0,0,0,${0.28 + lift * 0.2})`,
              }}
            >
              {ringT > 0 && ringT < 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    border: `2px solid ${s.color}`,
                    transform: `translateX(-50%) scale(${1 + ringT * 1.4})`,
                    opacity: 1 - ringT,
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  top: -16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
                }}
              >
                <Star size={15} color="#FFFFFF" />
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  color: T_TITLE,
                  whiteSpace: "nowrap",
                  paddingTop: 4,
                }}
              >
                {s.key}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Coda -------------------------------------------------------------------- */
function Coda({ frame, fps }: { frame: number; fps: number }) {
  const start = 0; // the coda OPENS the loop
  if (frame > 132) return null;
  const at = (d: number) => spring({ frame: frame - start - d, fps, config: { damping: 15, stiffness: 150, mass: 0.8 } });
  const fadeAll = interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1 = interpolate(frame, [start + 14, start + 30], [0, 74], { easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2 = interpolate(frame, [start + 44, start + 60], [0, 74], { easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pill: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    background: CHIP_BG,
    color: CHIP_INK,
    padding: "11px 20px",
    borderRadius: 8,
    boxShadow: "0 8px 22px rgba(0,0,0,0.35)",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeAll,
        zIndex: 4,
      }}
    >
      <div style={{ ...pill, opacity: at(2), transform: `translateY(${(1 - Math.min(at(2), 1)) * 14}px)` }}>New enrollment</div>
      <div style={{ height: line1, overflow: "hidden", margin: "12px 0" }}>
        <DashedLine vertical length={74} />
      </div>
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 999,
          background: NAVY,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 18px 44px rgba(0,0,0,0.5)",
          opacity: at(26),
          transform: `scale(${0.7 + Math.min(at(26), 1) * 0.3})`,
        }}
      >
        <Icon d={P_PHONE} size={32} color="#FFFFFF" />
      </div>
      <div style={{ height: line2, overflow: "hidden", margin: "12px 0 2px" }}>
        <DashedLine vertical length={74} />
      </div>
      <div
        aria-hidden
        style={{
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `8px solid ${CREAM_LINE}`,
          marginBottom: 10,
          opacity: line2 > 70 ? 1 : 0,
        }}
      />
      <div style={{ ...pill, opacity: at(58), transform: `translateY(${(1 - Math.min(at(58), 1)) * 14}px)` }}>Note in your EHR</div>
    </div>
  );
}

/* ---- Composition ------------------------------------------------------ */
export const CareJourneyComp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s0 = sceneStyle(frame, fps, 0);
  const s1 = sceneStyle(frame, fps, 1);
  const s2 = sceneStyle(frame, fps, 2);
  const s3 = sceneStyle(frame, fps, 3);
  const s4 = sceneStyle(frame, fps, 4);

  // Scene baselines, offset by the leading coda.
  const t0 = S0 + 0 * T;
  const t1 = S0 + 1 * T;
  const t2 = S0 + 2 * T;
  const t3 = S0 + 3 * T;
  const t4 = S0 + 4 * T;

  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <Rail frame={frame} fps={fps} />

      {/* 0 · Enrollment call */}
      {s0 && (
        <Card x={130} y={360} w={540} style={s0}>
          <Rise frame={frame} fps={fps} at={t0 + 4}>
            <Header d={P_PHONE} title="HANA · enrollment call" sub="CPAP program · Dr. Reyes' office" />
          </Rise>
          <Rise frame={frame} fps={fps} at={t0 + 14}>
            <div style={{ marginBottom: 10 }}>
              <Bar w={280} />
            </div>
          </Rise>
          <Rise frame={frame} fps={fps} at={t0 + 22}>
            <Bubble who="hana">Hi Maria, it's HANA calling from Dr. Reyes' office to set up your CPAP check-ins. Is now a good time?</Bubble>
          </Rise>
          <Rise frame={frame} fps={fps} at={t0 + 34}>
            <div style={{ marginTop: 10 }}>
              <Bar w={210} />
            </div>
          </Rise>
          <Rise frame={frame} fps={fps} at={t0 + 44}>
            <div style={{ marginTop: 13 }}>
              <CheckLine text="Consent captured on the call" color={BLUE} />
            </div>
          </Rise>
        </Card>
      )}

      {/* 1 · Evening check-in */}
      {s1 && (
        <Card x={130} y={345} w={540} style={s1}>
          <Rise frame={frame} fps={fps} at={t1 + 4}>
            <Header d={P_PHONE} title="Evening check-in" sub="Day 6 on program" />
          </Rise>
          <Rise frame={frame} fps={fps} at={t1 + 10}>
            <div style={{ marginBottom: 10 }}>
              <Bar w={280} />
            </div>
          </Rise>
          <Rise frame={frame} fps={fps} at={t1 + 16}>
            <Bubble who="hana">How many hours did you wear the CPAP last night?</Bubble>
          </Rise>
          <Rise frame={frame} fps={fps} at={t1 + 34}>
            <div style={{ marginTop: 6 }}>
              <Bubble who="patient">Only about two. I took it off, it felt too tight.</Bubble>
            </div>
          </Rise>
          <Rise frame={frame} fps={fps} at={t1 + 20}>
            <div style={{ marginTop: 12 }}>
              <Bar w={330} />
            </div>
          </Rise>
          <Rise frame={frame} fps={fps} at={t1 + 48}>
            <div style={{ marginTop: 8 }}>
              <Bar w={240} />
            </div>
          </Rise>
        </Card>
      )}

      {/* 2 · Protocol scoring */}
      {s2 && (
        <Card x={120} y={340} w={560} style={s2}>
          <Rise frame={frame} fps={fps} at={t2 + 4}>
            <Header d={P_CLIP} title="HANA Sleep protocol" sub="Every answer scored in real time" />
          </Rise>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Rise frame={frame} fps={fps} at={t2 + 10}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Bar w={330} />
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 1,
                    color: "#B45309",
                    textTransform: "uppercase",
                    ...riseStyle(frame, fps, t2 + 18, 6),
                  }}
                >
                  Scored
                </span>
              </div>
            </Rise>
            <Rise frame={frame} fps={fps} at={t2 + 16}>
              <div style={{ borderRadius: 8, background: ROW_INNER, border: `1px solid ${HAIRLINE}`, padding: "8px 13px", fontSize: 13, color: T_BODY }}>
                Mask discomfort · coaching delivered
              </div>
            </Rise>
            <Rise frame={frame} fps={fps} at={t2 + 22}>
              <div style={{ borderRadius: 8, background: ROW_INNER, border: `1px solid ${HAIRLINE}`, padding: "8px 13px", fontSize: 13, color: T_SUB }}>
                Mood check · no concern
              </div>
            </Rise>
          </div>
          <Rise frame={frame} fps={fps} at={t2 + 28}>
            <div style={{ marginTop: 12 }}>
              <Bar w={220} />
            </div>
          </Rise>
          <Rise frame={frame} fps={fps} at={t2 + 34}>
            <div style={{ marginTop: 8 }}>
              <Bar w={300} />
            </div>
          </Rise>
        </Card>
      )}

      {/* 3 · Compass worklist */}
      {s3 && (
        <Card x={100} y={370} w={600} style={s3}>
          <Rise frame={frame} fps={fps} at={t3 + 4}>
            <Header d={P_ALERT} title="Compass · flagged worklist" sub="What your team actually reviews" />
          </Rise>
          <Rise frame={frame} fps={fps} at={t3 + 10}>
            <div style={{ borderRadius: 10, background: ROW_INNER, border: `1px solid ${HAIRLINE}`, padding: "11px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <Bar w={120} />
              <Bar w={170} />
              <span
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#B4530A",
                  background: "rgba(245,158,66,0.14)",
                  border: "1px solid rgba(226,112,58,0.32)",
                  borderRadius: 999,
                  padding: "5px 11px",
                  whiteSpace: "nowrap",
                  ...riseStyle(frame, fps, t3 + 30, 8),
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#E2703A" }} />
                Escalated → Dr. Reyes
              </span>
            </div>
          </Rise>
          {/* reason row — the flag chip docks in here rather than floating below */}
          <Rise frame={frame} fps={fps} at={t3 + 18}>
            <div style={{ marginTop: 8, borderRadius: 10, background: ROW_INNER, border: `1px solid ${HAIRLINE}`, padding: "11px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: T_SUB, width: 52 }}>Reason</span>
              <Bar w={200} />
            </div>
          </Rise>
          <Rise frame={frame} fps={fps} at={t3 + 40}>
            <div style={{ fontSize: 12, color: T_SUB, marginTop: 10 }}>12 check-ins completed today · 1 needs review</div>
          </Rise>
        </Card>
      )}

      {/* 4 · Structured note */}
      {s4 && (
        <Card x={130} y={330} w={540} style={s4}>
          <Rise frame={frame} fps={fps} at={t4 + 4}>
            <Header d={P_DB} title="Structured note" sub="Written to your EHR the moment the call ends" />
          </Rise>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: T_BODY }}>
            <Rise frame={frame} fps={fps} at={t4 + 10}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 56 }}>Patient</span> <Bar w={220} />
              </div>
            </Rise>
            <Rise frame={frame} fps={fps} at={t4 + 15}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 56 }}>Finding</span> <Bar w={220} />
              </div>
            </Rise>
            <Rise frame={frame} fps={fps} at={t4 + 20}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 56 }}>Risk</span> <Bar w={220} />
              </div>
            </Rise>
            <Rise frame={frame} fps={fps} at={t4 + 25}>
              <div>Plan · strap adjustment, follow-up call tomorrow</div>
            </Rise>
            <Rise frame={frame} fps={fps} at={t4 + 30}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 56 }}>Program</span> <Bar w={150} />
              </div>
            </Rise>
          </div>
          <Rise frame={frame} fps={fps} at={t4 + 46}>
            <div style={{ marginTop: 14, paddingTop: 11, borderTop: `1px solid ${HAIRLINE}` }}>
              <CheckLine text="Ready for Dr. Reyes to attest" color={BLUE} />
            </div>
          </Rise>
        </Card>
      )}

      {/* Traveling chips (above cards) */}
      {CHIPS.map((c) => (
        <Chip key={c.text} frame={frame} fps={fps} chip={c} />
      ))}

      {/* 5 · Outcome coda */}
      <Coda frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
