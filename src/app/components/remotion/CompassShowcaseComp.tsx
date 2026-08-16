import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/* ------------------------------------------------------------------ */
/*  Compass showcase — the care team's control panel as a motion       */
/*  graphic (Retell-style feature section, right panel).               */
/*                                                                     */
/*  One SaaS window, three chapters on a single looping timeline:      */
/*    0  Worklist   — flags rise in, one escalates to a named owner    */
/*    1  Billing    — documentation fills, "ready to attest" lands     */
/*    2  Timeline   — the audit trail assembles itself, entry by entry */
/*  The page's accordion seeks to chapter starts and follows playback  */
/*  (see CompassShowcase in RemoteV2.tsx).                             */
/*                                                                     */
/*  Canvas 760x620 @ 30fps, 510-frame loop (17s), TRANSPARENT bg —     */
/*  the page provides the light gradient tile behind the <Player>.     */
/*  Palette matches the hero comp: white UI, #2563EB blue accent,      */
/*  #F59E42 warm accent, near-black navy ink.                          */
/* ------------------------------------------------------------------ */

const SANS = "'DM Sans', system-ui, sans-serif";

const BLUE = "#2563EB";
const ORANGE = "#F59E42";
const INK = "#0A1633";
const SUB = "#6B7488";
const BODY = "#454E63";
const ROW_BG = "#F0F3FA";
const HAIRLINE = "rgba(10,22,51,0.10)";
const GREEN = "#22A15C";

export const COMPASS_CHAPTER_LEN = 170;
export const COMPASS_DURATION = 510; // 3 chapters, 17s @30fps

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/* Window geometry (px in the 760x620 canvas). */
const WIN = { x: 20, y: 22, w: 720, h: 576 };
const SIDEBAR_W = 178;
const CONTENT_X = WIN.x + SIDEBAR_W + 22;
const CONTENT_W = WIN.x + WIN.w - CONTENT_X - 22;

const NAV = ["Worklist", "Billing", "Timeline"];

/* ---- shared motion helpers (same crisp-rise language as the hero) --- */
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

/* Chapter container: fade/slide in at its start, out at its end. */
function chapterStyle(frame: number, i: number): React.CSSProperties | null {
  const start = i * COMPASS_CHAPTER_LEN;
  const end = start + COMPASS_CHAPTER_LEN;
  if (frame < start - 1 || frame > end + 1) return null;
  const inO = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const outO = interpolate(frame, [end - 8, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const o = Math.min(inO, outO);
  return { opacity: o, transform: `translateY(${(1 - inO) * 10}px)` };
}

/* ---- small UI atoms -------------------------------------------------- */
function Tag({ text, bg, ink }: { text: string; bg: string; ink: string }) {
  return (
    <span
      style={{
        fontFamily: SANS,
        fontSize: 10.5,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 999,
        background: bg,
        color: ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function BarLine({ w }: { w: number }) {
  return <span style={{ display: "inline-block", width: w, height: 12, borderRadius: 4, background: ROW_BG }} />;
}

function CheckDot({ color = GREEN, size = 16 }: { color?: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}>
        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ---- Chapter 1: flagged worklist ------------------------------------- */
function Worklist({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const rows = [
    { name: "James T.", program: "CCM", status: "Reviewed", flag: false },
    { name: "Maria R.", program: "RTM · Sleep", status: "Escalated → Dr. Reyes", flag: true },
    { name: "Dorothy K.", program: "BHI", status: "Reviewed", flag: false },
    { name: "Albert N.", program: "CCM", status: "No concern", flag: false },
  ];
  return (
    <div>
      <div style={{ ...riseStyle(frame, fps, t0 + 6), display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: INK }}>Flagged worklist</span>
        <span style={{ ...pop(frame, fps, t0 + 64) }}>
          <Tag text="1 needs review" bg="rgba(245,158,66,0.16)" ink="#B4530A" />
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((r, i) => {
          const at = t0 + 14 + i * 9;
          const isFlag = r.flag;
          const flagOn = frame >= t0 + 52;
          return (
            <div
              key={r.name}
              style={{
                ...riseStyle(frame, fps, at),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: isFlag && flagOn ? "rgba(245,158,66,0.10)" : "#fff",
                  border: `1px solid ${isFlag && flagOn ? "rgba(226,112,58,0.4)" : HAIRLINE}`,
                  boxShadow: isFlag && flagOn ? "0 6px 18px -6px rgba(226,112,58,0.25)" : "none",
                  transition: "none",
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: isFlag ? "rgba(245,158,66,0.2)" : ROW_BG,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: SANS,
                    fontSize: 10,
                    fontWeight: 800,
                    color: isFlag ? "#B4530A" : SUB,
                    flexShrink: 0,
                  }}
                >
                  {r.name.split(" ").map((p) => p[0]).join("")}
                </span>
                <span style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 700, color: INK, width: 84 }}>{r.name}</span>
                <span style={{ fontFamily: SANS, fontSize: 11, color: SUB, width: 88 }}>{r.program}</span>
                <span style={{ marginLeft: "auto" }}>
                  {isFlag ? (
                    <span style={pop(frame, fps, t0 + 58)}>
                      <Tag text={r.status} bg="rgba(226,112,58,0.14)" ink="#B4530A" />
                    </span>
                  ) : (
                    <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: frame >= at + 6 ? GREEN : SUB }}>{r.status}</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ ...riseStyle(frame, fps, t0 + 84), fontFamily: SANS, fontSize: 11.5, color: SUB, margin: "14px 0 0" }}>
        12 check-ins completed today · everything else ran on its own
      </p>
    </div>
  );
}

/* ---- Chapter 2: billing readiness ------------------------------------ */
function Billing({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const programs = [
    { key: "CCM", notes: 22, pct: 0.92 },
    { key: "RTM · Sleep", notes: 11, pct: 0.84 },
    { key: "BHI", notes: 5, pct: 0.7 },
  ];
  return (
    <div>
      <div style={{ ...riseStyle(frame, fps, t0 + 6), marginBottom: 14 }}>
        <span style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: INK }}>Billing readiness</span>
        <span style={{ fontFamily: SANS, fontSize: 11.5, color: SUB, marginLeft: 8 }}>this month</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {programs.map((p, i) => {
          const at = t0 + 16 + i * 12;
          const fill = interpolate(frame, [at + 8, at + 46], [0, p.pct], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          });
          return (
            <div key={p.key} style={riseStyle(frame, fps, at)}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: INK }}>{p.key}</span>
                <span style={{ color: SUB }}>{Math.round(p.notes * Math.min(1, fill / p.pct || 0))} notes ready</span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: ROW_BG, overflow: "hidden" }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 999, background: BLUE }} />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          ...riseStyle(frame, fps, t0 + 78),
          marginTop: 18,
          padding: "12px 14px",
          borderRadius: 12,
          background: "#fff",
          border: `1px solid ${HAIRLINE}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={pop(frame, fps, t0 + 88)}>
          <CheckDot />
        </span>
        <span style={{ fontFamily: SANS, fontSize: 12.5, color: BODY }}>
          <strong style={{ color: INK }}>38 notes ready for attestation</strong> · minutes attributed to named staff
        </span>
      </div>
    </div>
  );
}

/* ---- Chapter 3: audit timeline ---------------------------------------- */
function Timeline({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const entries = [
    { text: "Evening check-in completed", time: "6:42 PM", color: BLUE },
    { text: "Flag raised · usage below threshold", time: "6:43 PM", color: ORANGE },
    { text: "Reviewed by Dr. Reyes", time: "8:05 AM", color: BLUE },
    { text: "Note attested", time: "8:07 AM", color: GREEN, check: true },
  ];
  const lineH = interpolate(frame, [t0 + 20, t0 + 96], [0, entries.length * 52 - 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <div>
      <div style={{ ...riseStyle(frame, fps, t0 + 6), marginBottom: 16 }}>
        <span style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: INK }}>Maria R. · audit trail</span>
      </div>
      <div style={{ position: "relative", paddingLeft: 26 }}>
        <div style={{ position: "absolute", left: 7, top: 8, width: 0, height: lineH, borderLeft: `2px dashed rgba(10,22,51,0.18)` }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {entries.map((e, i) => {
            const at = t0 + 18 + i * 20;
            return (
              <div key={e.text} style={{ ...riseStyle(frame, fps, at), position: "relative" }}>
                <span style={{ position: "absolute", left: -26, top: 2 }}>
                  {e.check ? (
                    <span style={pop(frame, fps, at + 4)}>
                      <CheckDot />
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "block",
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        background: "#fff",
                        border: `4px solid ${e.color}`,
                      }}
                    />
                  )}
                </span>
                <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 700, color: INK }}>{e.text}</div>
                <div style={{ fontFamily: SANS, fontSize: 10.5, color: SUB, marginTop: 2 }}>{e.time}</div>
              </div>
            );
          })}
        </div>
      </div>
      <p style={{ ...riseStyle(frame, fps, t0 + 108), fontFamily: SANS, fontSize: 11.5, color: SUB, margin: "16px 0 0" }}>
        One export: transcripts, notes, time attribution, attestations.
      </p>
    </div>
  );
}

/* ---- Composition ------------------------------------------------------ */
export const CompassShowcaseComp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chapter = Math.min(2, Math.floor(frame / COMPASS_CHAPTER_LEN));
  const c0 = chapterStyle(frame, 0);
  const c1 = chapterStyle(frame, 1);
  const c2 = chapterStyle(frame, 2);

  // active nav pill glides between items
  const pillY = interpolate(
    frame,
    [0, 8, COMPASS_CHAPTER_LEN, COMPASS_CHAPTER_LEN + 12, 2 * COMPASS_CHAPTER_LEN, 2 * COMPASS_CHAPTER_LEN + 12],
    [0, 0, 0, 38, 38, 76],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE },
  );

  const winIn = spring({ frame, fps, config: { damping: 18, stiffness: 160, mass: 0.8 } });

  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 18,
          background: "#fff",
          border: `1px solid ${HAIRLINE}`,
          boxShadow: "0 2px 8px rgba(10,22,51,0.08), 0 30px 70px -20px rgba(10,22,51,0.28)",
          overflow: "hidden",
          opacity: Math.min(winIn, 1),
          transform: `translateY(${(1 - winIn) * 18}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* window chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${HAIRLINE}` }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#F2605A" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#F8BE4F" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#5BC46A" }} />
          <span
            style={{
              margin: "0 auto",
              fontSize: 11,
              color: SUB,
              background: ROW_BG,
              borderRadius: 6,
              padding: "3px 14px",
            }}
          >
            compass.hana.health
          </span>
          <span style={{ width: 46 }} />
        </div>

        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* sidebar */}
          <div style={{ width: SIDEBAR_W, borderRight: `1px solid ${HAIRLINE}`, background: "#FAFBFE", padding: "16px 12px" }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: INK, padding: "0 8px", marginBottom: 14 }}>
              HANA <span style={{ color: BLUE }}>Compass</span>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: pillY,
                  height: 32,
                  borderRadius: 8,
                  background: "rgba(37,99,235,0.10)",
                }}
              />
              {NAV.map((n, i) => (
                <div
                  key={n}
                  style={{
                    position: "relative",
                    height: 32,
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 10px",
                    fontSize: 12,
                    fontWeight: chapter === i ? 800 : 600,
                    color: chapter === i ? BLUE : SUB,
                  }}
                >
                  {n}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10, padding: "0 10px" }}>
              <BarLine w={92} />
              <BarLine w={70} />
              <BarLine w={104} />
            </div>
          </div>

          {/* content */}
          <div style={{ position: "relative", flex: 1, padding: "18px 22px" }}>
            {c0 && (
              <div style={{ position: "absolute", inset: "18px 22px", ...c0 }}>
                <Worklist frame={frame} fps={fps} t0={0} />
              </div>
            )}
            {c1 && (
              <div style={{ position: "absolute", inset: "18px 22px", ...c1 }}>
                <Billing frame={frame} fps={fps} t0={COMPASS_CHAPTER_LEN} />
              </div>
            )}
            {c2 && (
              <div style={{ position: "absolute", inset: "18px 22px", ...c2 }}>
                <Timeline frame={frame} fps={fps} t0={2 * COMPASS_CHAPTER_LEN} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
