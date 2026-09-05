import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/* ------------------------------------------------------------------ */
/*  Onboarding showcase — "Meet your onboarding team", as a motion     */
/*  graphic. Built to match CompassShowcaseComp exactly (Matteo        */
/*  2026-08-25: the onboarding section should be like the Compass      */
/*  section), so: same canvas, same chapter length, same rise/pop      */
/*  language, transparent background, and the page's accordion seeks   */
/*  chapter starts and follows playback.                               */
/*                                                                     */
/*    0  Your lead    — a named owner, then the checklist ticking      */
/*    1  The academy  — courses land, one plays, the tutor answers     */
/*    2  First cohort — one group first, inspected, then the panel     */
/*                                                                     */
/*  Canvas 760x620 @ 30fps, 510-frame loop (17s), TRANSPARENT bg.      */
/* ------------------------------------------------------------------ */

const SANS = "'IBM Plex Sans', system-ui, sans-serif";

/* Newsprint Ultramarine. Literal hex, not var(): a Remotion comp renders
   headless, where the page's custom properties do not exist. */
const BLUE = "#2536E6"; // brand, ultramarine. Spent on the one live thing per frame
const ORANGE = "#E8A06A"; // signal-amber (normalised from #F59E42)
const INK = "#00122f"; // ink
const SUB = "#64748b"; // ink-mute: captions, labels, meta
const BODY = "#475569"; // ink-soft: secondary prose
const PAPER_BRIGHT = "#ffffff"; // paper-bright: the product surface
const ROW_BG = "#f6f7fb"; // paper-2: the row ground
const HAIRLINE = "#e2e8f0"; // rule-soft
const RULE = "#cfd8e6"; // rule
const GREEN = "#10B981"; // signal-green (normalised from #22A15C)

export const ONBOARDING_CHAPTER_LEN = 170;
export const ONBOARDING_DURATION = 510; // 3 chapters, 17s @30fps

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

const WIN = { x: 20, y: 22, w: 720, h: 576 };

function riseStyle(frame: number, fps: number, at: number, dist = 12): React.CSSProperties {
  if (frame < at) return { opacity: 0, transform: `translateY(${dist}px)` };
  const s = spring({ frame: frame - at, fps, config: { damping: 17, stiffness: 210, mass: 0.6 } });
  return { opacity: Math.min(s, 1), transform: `translateY(${(1 - s) * dist}px)` };
}

function pop(frame: number, fps: number, at: number) {
  if (frame < at) return { opacity: 0, transform: "scale(0.7)" };
  const s = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  return { opacity: Math.min(s, 1), transform: `scale(${0.7 + Math.min(s, 1.1) * 0.3})` };
}

function chapterStyle(frame: number, i: number): React.CSSProperties | null {
  const start = i * ONBOARDING_CHAPTER_LEN;
  const end = start + ONBOARDING_CHAPTER_LEN;
  if (frame < start - 1 || frame > end + 1) return null;
  const inO = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const outO = interpolate(frame, [end - 8, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return { opacity: Math.min(inO, outO), transform: `translateY(${(1 - inO) * 10}px)` };
}

/* ---- the window the three chapters play inside ---------------------- */
function Window({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        top: WIN.y,
        width: WIN.w,
        height: WIN.h,
        borderRadius: 20,
        background: PAPER_BRIGHT, // paper-bright
        border: `1px solid ${RULE}`, // rule
        boxShadow: "0 30px 70px -28px rgba(0, 18, 47,0.22)", // warm ink shadow
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 18px",
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        {/* window chrome: decoration, so it sits on the rule ramp, not in colour */}
        <span style={{ width: 9, height: 9, borderRadius: 99, background: RULE }} />
        <span style={{ width: 9, height: 9, borderRadius: 99, background: HAIRLINE }} />
        <span style={{ width: 9, height: 9, borderRadius: 99, background: RULE }} />
        <span style={{ marginLeft: 12, fontFamily: SANS, fontSize: 12.5, fontWeight: 700, color: SUB }}>
          {title}
        </span>
      </div>
      <div style={{ flex: 1, padding: 26, position: "relative" }}>{children}</div>
    </div>
  );
}

function Row({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: ROW_BG,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 13,
        padding: "13px 16px",
        fontFamily: SANS,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---- Chapter 1: one owner, named, and the checklist that clears ----- */
function Owner({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const tasks = [
    "Protocols reviewed with your clinicians",
    "EHR connected and tested",
    "First cohort agreed",
    "First billed month walked through",
  ];
  return (
    <>
      <div style={{ ...riseStyle(frame, fps, t0 + 6), display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 99,
            background: "#ECEDFB", // brand-tint
            display: "grid",
            placeItems: "center",
            fontFamily: SANS,
            fontSize: 20,
            fontWeight: 700,
            color: BLUE,
          }}
        >
          ML
        </div>
        <div style={{ fontFamily: SANS }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: INK }}>Your onboarding lead</div>
          <div style={{ fontSize: 13, color: SUB, marginTop: 3 }}>Named before the first call</div>
        </div>
        <div style={{ ...pop(frame, fps, t0 + 22), marginLeft: "auto" }}>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: INK, // label on ink: signal-green is 2.2:1 here, the wash carries the signal
              background: "rgba(16,185,129,0.12)", // signal-green wash
              borderRadius: 99,
              padding: "6px 11px",
            }}
          >
            Assigned
          </span>
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.map((t, i) => {
          const at = t0 + 40 + i * 22;
          const done = frame > at + 12;
          return (
            <div key={t} style={riseStyle(frame, fps, at, 10)}>
              <Row>
                <span
                  style={{
                    ...pop(frame, fps, at + 12),
                    width: 24,
                    height: 24,
                    borderRadius: 99,
                    background: done ? "rgba(16,185,129,0.14)" : PAPER_BRIGHT,
                    border: done ? "none" : `1px solid ${HAIRLINE}`,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    color: GREEN,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: 14, color: BODY }}>{t}</span>
              </Row>
            </div>
          );
        })}
      </div>

      <div
        style={{
          ...riseStyle(frame, fps, t0 + 140, 10),
          position: "absolute",
          left: 26,
          right: 26,
          bottom: 26,
          fontFamily: SANS,
          fontSize: 13,
          color: SUB,
        }}
      >
        One person, start to first billed month.
      </div>
    </>
  );
}

/* ---- Chapter 2: the academy, and the tutor -------------------------- */
function Academy({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const courses = [
    { t: "Chronic care management, end to end", m: "9 min" },
    { t: "What principal care management needs", m: "6 min" },
    { t: "Behavioural health integration", m: "7 min" },
  ];
  const playAt = t0 + 96;
  const prog = interpolate(frame, [playAt, playAt + 46], [0, 68], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <>
      <div style={{ ...riseStyle(frame, fps, t0 + 6), fontFamily: SANS, fontSize: 12, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", color: SUB }}>
        The academy
      </div>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
        {courses.map((c, i) => {
          const at = t0 + 26 + i * 22;
          const active = i === 0 && frame > playAt;
          return (
            <div key={c.t} style={riseStyle(frame, fps, at, 10)}>
              <Row style={active ? { background: PAPER_BRIGHT, borderColor: "rgba(37,54,230,0.35)" } : undefined}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 99,
                    background: active ? BLUE : INK, // accent only while it plays
                    color: PAPER_BRIGHT,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {active ? "▶" : i + 1}
                </span>
                <span style={{ flex: 1, fontSize: 14, color: BODY, lineHeight: 1.35 }}>{c.t}</span>
                <span style={{ fontSize: 12.5, color: SUB, fontVariantNumeric: "tabular-nums" }}>{c.m}</span>
              </Row>
              {active && (
                <div style={{ height: 4, borderRadius: 99, background: ROW_BG, marginTop: 7, overflow: "hidden" }}>
                  <div style={{ width: `${prog}%`, height: "100%", background: BLUE, borderRadius: 99 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* the tutor, answering from your own protocols */}
      <div style={{ ...riseStyle(frame, fps, t0 + 118, 12), marginTop: 22 }}>
        <div
          style={{
            fontFamily: SANS,
            background: PAPER_BRIGHT, // paper-bright
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 14,
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 12.5, color: SUB }}>“Does a 12-minute call still count this month?”</div>
          <div style={{ display: "flex", gap: 10, marginTop: 11, alignItems: "flex-start" }}>
            <span
              style={{
                ...pop(frame, fps, t0 + 132),
                width: 22,
                height: 22,
                borderRadius: 7,
                background: "linear-gradient(150deg, #00122f 0%, #1e2a3a 100%)", // navy → navy-soft
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 800,
                color: PAPER_BRIGHT,
                flexShrink: 0,
              }}
            >
              H
            </span>
            <span style={{ fontSize: 13.5, color: INK, lineHeight: 1.45 }}>
              Not on its own. You need twenty minutes across the month, and yours is at fourteen.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---- Chapter 3: one cohort, inspected, then the panel --------------- */
function Cohort({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const bars = [22, 30, 44, 58, 74, 92];
  return (
    <>
      <div style={{ ...riseStyle(frame, fps, t0 + 6), fontFamily: SANS, fontSize: 12, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", color: SUB }}>
        First cohort, then the panel
      </div>

      <div style={{ marginTop: 26, display: "flex", alignItems: "flex-end", gap: 12, height: 210 }}>
        {bars.map((h, i) => {
          const at = t0 + 24 + i * 15;
          const grown = interpolate(frame, [at, at + 24], [0, h], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          });
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
              <div
                style={{
                  height: `${grown}%`,
                  borderRadius: "8px 8px 3px 3px",
                  background: i < 2 ? "#e4eaf3" : BLUE, // band before, ultramarine once it holds
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ ...riseStyle(frame, fps, t0 + 118, 10), marginTop: 18, display: "flex", gap: 10 }}>
        <Row style={{ flex: 1 }}>
          <span style={{ fontSize: 13, color: SUB }}>One programme, one group</span>
        </Row>
        <Row style={{ flex: 1, background: PAPER_BRIGHT, borderColor: "rgba(16,185,129,0.35)" }}>
          <span style={{ ...pop(frame, fps, t0 + 132), fontSize: 13, fontWeight: 700, color: INK }}>
            <span style={{ color: GREEN }}>✓</span> Documentation inspected
          </span>
        </Row>
      </div>

      <div
        style={{
          ...riseStyle(frame, fps, t0 + 146, 10),
          marginTop: 14,
          fontFamily: SANS,
          fontSize: 13,
          color: SUB,
        }}
      >
        Expand when the numbers hold, not because a contract says so.
      </div>
    </>
  );
}

const TITLES = ["Onboarding · your lead", "Onboarding · the academy", "Onboarding · first cohort"];

export const OnboardingShowcaseComp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c0 = chapterStyle(frame, 0);
  const c1 = chapterStyle(frame, 1);
  const c2 = chapterStyle(frame, 2);
  const active = Math.min(2, Math.floor(frame / ONBOARDING_CHAPTER_LEN));

  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      {c0 && (
        <div style={c0}>
          <Window title={TITLES[active]}>
            <Owner frame={frame} fps={fps} t0={0} />
          </Window>
        </div>
      )}
      {c1 && (
        <div style={c1}>
          <Window title={TITLES[active]}>
            <Academy frame={frame} fps={fps} t0={ONBOARDING_CHAPTER_LEN} />
          </Window>
        </div>
      )}
      {c2 && (
        <div style={c2}>
          <Window title={TITLES[active]}>
            <Cohort frame={frame} fps={fps} t0={2 * ONBOARDING_CHAPTER_LEN} />
          </Window>
        </div>
      )}
    </AbsoluteFill>
  );
};
