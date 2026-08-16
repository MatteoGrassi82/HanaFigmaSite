import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/* ------------------------------------------------------------------ */
/*  Companion showcase — the PATIENT'S side of HANA as a motion        */
/*  graphic (twin of CompassShowcaseComp, which is the clinician's).   */
/*                                                                     */
/*  Four chapters on one looping timeline (from Matteo's HTML mock):   */
/*    0  Caller ID  — the clinic's name on the phone, not "Spam likely"*/
/*    1  Attempts   — mornings, evenings, Saturdays until she answers  */
/*    2  Conversation — repeats itself, follows tangents, completes    */
/*    3  Memory     — next month's call references what she said       */
/*  The page accordion seeks chapters and follows playback.            */
/*                                                                     */
/*  Canvas 660x660 @ 30fps, 600-frame loop (20s), TRANSPARENT bg —     */
/*  the page provides the warm pastel tile behind the <Player>.        */
/*  Copy stays inside the billing guardrail: call DURATION may show;   */
/*  HANA never logs "billable minutes" — notes are attested by staff.  */
/* ------------------------------------------------------------------ */

const SANS = "'DM Sans', system-ui, sans-serif";

const BLUE = "#2563EB";
const INK = "#0A1633";
const SUB = "#6B7488";
const HAIRLINE = "rgba(10,22,51,0.09)";
const GREEN = "#3FBB5A";
const RED = "#E5544B";

export const COMPANION_CHAPTER_LEN = 150;
export const COMPANION_DURATION = 600; // 4 chapters, 20s @30fps

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

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
  const start = i * COMPANION_CHAPTER_LEN;
  const end = start + COMPANION_CHAPTER_LEN;
  if (frame < start - 1 || frame > end + 1) return null;
  const inO = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const outO = interpolate(frame, [end - 8, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return {
    opacity: Math.min(inO, outO),
    transform: `translateY(${(1 - inO) * 12}px)`,
    position: "absolute",
    inset: 0,
  };
}

/* Centering wrapper for the card chapters (1-3). Chapter 0 positions itself so
   the phone can bleed off the bottom edge like the reference. */
const CENTERED: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 44,
};

/* ---- Real device frame (public/textures/phone-frame.png) ---------------- */
/* Transparent PNG, 946x1864. The SCREEN is a transparent hole, so screen
   content renders BEHIND the image and shows through it. Rect measured off the
   alpha channel: left 8.33%, top 4.43%, w 83.33%, h 91.15%. */
const FRAME_ASPECT = 946 / 1864;
const SCREEN = { left: 8.33, top: 4.43, width: 83.33, height: 91.15 };

function PhoneFrame({ width, children }: { width: number; children: React.ReactNode }) {
  const height = width / FRAME_ASPECT;
  return (
    <div style={{ position: "relative", width, height }}>
      <div
        style={{
          position: "absolute",
          left: `${SCREEN.left}%`,
          top: `${SCREEN.top}%`,
          width: `${SCREEN.width}%`,
          height: `${SCREEN.height}%`,
          borderRadius: width * 0.115,
          overflow: "hidden",
          background: "#EEF2FA",
        }}
      >
        {children}
      </div>
      <img
        src="/textures/phone-frame.png"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
    </div>
  );
}

/* ---- Chapter 0: branded caller ID on a real device frame ---------------- */
/* Reference treatment (Retell's telephony tile): the device sits large and
   bottom-cropped in the tile, home screen visible, the call banner dropping in
   over it. Ours adds the punchline chip above the phone. */
/* Home-screen apps. Icons are drawn here as simple SVG glyphs rather than using
   Apple's actual app artwork (the reference screenshots a real iPhone; those
   icons are Apple's IP). Generic-but-recognisable reads the same at this size
   and keeps the asset ours. */
type AppIcon = { label: string; bg: string; glyph: React.ReactNode };

const g = (d: string, color = "#fff") => (
  <svg viewBox="0 0 24 24" width="58%" height="58%">
    <path d={d} fill={color} />
  </svg>
);

const APPS: AppIcon[] = [
  { label: "Phone", bg: "linear-gradient(160deg,#5CD672,#1FA94A)", glyph: g("M6.6 10.8c1.5 2.9 3.8 5.2 6.7 6.7l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1l-2.1 2.3z") },
  { label: "Messages", bg: "linear-gradient(160deg,#6FE07C,#25B34C)", glyph: g("M12 3C6.9 3 3 6.4 3 10.6c0 2.4 1.3 4.5 3.4 5.9-.2 1.2-.8 2.4-1.7 3.4 1.7-.2 3.3-.9 4.6-1.9.8.2 1.7.3 2.7.3 5.1 0 9-3.4 9-7.7S17.1 3 12 3z") },
  { label: "Calendar", bg: "#FFFFFF", glyph: (
    <svg viewBox="0 0 24 24" width="72%" height="72%">
      <text x="12" y="9" textAnchor="middle" fontSize="6" fontWeight="700" fill="#E5544B" fontFamily="'DM Sans', sans-serif">MON</text>
      <text x="12" y="20" textAnchor="middle" fontSize="11" fontWeight="500" fill="#1B2436" fontFamily="'DM Sans', sans-serif">6</text>
    </svg>
  ) },
  { label: "Camera", bg: "linear-gradient(160deg,#7C8798,#4A5563)", glyph: g("M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5zM20 6h-3l-1.2-1.6a1 1 0 0 0-.8-.4H9a1 1 0 0 0-.8.4L7 6H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zm-8 11.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z") },
  { label: "Mail", bg: "linear-gradient(160deg,#6FB6FF,#1E7FE0)", glyph: g("M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11zm2 .8v.4l7 4.4 7-4.4v-.4l-7 4.3L5 7.3z") },
  { label: "Notes", bg: "linear-gradient(160deg,#FFE79A,#F4C64A)", glyph: g("M5 4h14a1 1 0 0 1 1 1v10l-5 5H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm2 5h10v1.6H7V9zm0 4h7v1.6H7V13z", "#6B4E12") },
  { label: "Health", bg: "#FFFFFF", glyph: g("M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20z", "#F0435F") },
  { label: "Clock", bg: "#15181F", glyph: (
    <svg viewBox="0 0 24 24" width="72%" height="72%">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeWidth="1.4" />
      <path d="M12 7v5.4l3.6 2.1" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  ) },
  { label: "Settings", bg: "linear-gradient(160deg,#B9C2CE,#7A8492)", glyph: g("M12 8.6A3.4 3.4 0 1 0 12 15.4 3.4 3.4 0 0 0 12 8.6zm9-1.1-1.5.6a7.6 7.6 0 0 0-.9-1.6l.9-1.3-1.7-1.7-1.3.9a7.6 7.6 0 0 0-1.6-.9L14.3 2h-2.4l-.6 1.5c-.6.2-1.1.5-1.6.9L8.4 3.5 6.7 5.2l.9 1.3c-.4.5-.7 1-.9 1.6L5 8.7v2.4l1.7.6c.2.6.5 1.1.9 1.6l-.9 1.3 1.7 1.7 1.3-.9c.5.4 1 .7 1.6.9l.6 1.7h2.4l.6-1.7c.6-.2 1.1-.5 1.6-.9l1.3.9 1.7-1.7-.9-1.3c.4-.5.7-1 .9-1.6L21 11V7.5z") },
  { label: "Maps", bg: "linear-gradient(160deg,#8FD98F,#4EA9D8)", glyph: g("M12 3a6 6 0 0 0-6 6c0 4.4 6 12 6 12s6-7.6 6-12a6 6 0 0 0-6-6zm0 8.4A2.4 2.4 0 1 1 12 6.6a2.4 2.4 0 0 1 0 4.8z") },
  { label: "Music", bg: "linear-gradient(160deg,#FF7A8A,#E8324F)", glyph: g("M9 18.2a2.6 2.6 0 1 1-1.7-2.45V7.4L18 5.2v8.9a2.6 2.6 0 1 1-1.7-2.45V8.1L9 9.6v8.6z") },
  { label: "Photos", bg: "#FFFFFF", glyph: (
    <svg viewBox="0 0 24 24" width="70%" height="70%">
      {[
        ["#F0435F", 0], ["#F8A23C", 60], ["#F5D046", 120],
        ["#4EC26A", 180], ["#3E9BE8", 240], ["#9B6BE0", 300],
      ].map(([c, a]) => (
        <ellipse key={String(a)} cx="12" cy="12" rx="3.1" ry="6.4" fill={c as string} opacity="0.72" transform={`rotate(${a} 12 12)`} />
      ))}
    </svg>
  ) },
];

function HomeScreen({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const bannerIn = spring({ frame: frame - (t0 + 26), fps, config: { damping: 15, stiffness: 165, mass: 0.75 } });
  const settled = Math.min(bannerIn, 1);
  const ringPulse = frame > t0 + 40 ? 1 + Math.sin((frame - (t0 + 40)) / 5.5) * 0.07 : 1;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(160deg, #DCE6F7 0%, #E7DEF3 45%, #F6E4DE 100%)",
      }}
    >
      {/* status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px 0", fontFamily: SANS, fontSize: 11, fontWeight: 700, color: "#1B2436" }}>
        <span>9:41</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 14, height: 8, borderRadius: 2, border: "1px solid rgba(27,36,54,0.55)" }} />
        </span>
      </div>

      {/* the incoming call banner drops in over the home screen */}
      <div style={{ padding: "10px 10px 0" }}>
        <div
          style={{
            opacity: settled,
            transform: `translateY(${(1 - settled) * -26}px)`,
            background: "rgba(22,26,34,0.92)",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            padding: "11px 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 10px 24px -8px rgba(0,0,0,0.5)",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: BLUE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 24 24" width={14} height={14}>
              <path
                d="M6.6 10.8c1.5 2.9 3.8 5.2 6.7 6.7l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.3c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1l-2.1 2.3z"
                fill="#fff"
              />
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 0, textAlign: "left", fontFamily: SANS }}>
            <div style={{ fontSize: 9, color: "#98A1B2", letterSpacing: 0.3 }}>Incoming call</div>
            <div style={{ fontSize: 12, color: "#fff", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Dr. Reyes' Office
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 24, height: 24, borderRadius: 999, background: RED, display: "grid", placeItems: "center", color: "#fff", fontSize: 10 }}>✕</span>
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                background: GREEN,
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: 10,
                transform: `scale(${ringPulse})`,
              }}
            >
              ✆
            </span>
          </div>
        </div>
      </div>

      {/* app grid — drawn icons with real labels, like the reference's home screen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 13, padding: "22px 18px 0" }}>
        {APPS.map((app) => (
          <div key={app.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: 13,
                background: app.bg,
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {app.glyph}
            </div>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 6.5,
                fontWeight: 500,
                color: "rgba(27,36,54,0.72)",
                letterSpacing: 0.1,
                whiteSpace: "nowrap",
              }}
            >
              {app.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CallerId({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  return (
    <>
      {/* punchline chip, above the device */}
      <div style={{ position: "absolute", top: 54, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            ...pop(frame, fps, t0 + 58),
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(255,255,255,0.92)",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 999,
            padding: "8px 16px",
            fontFamily: SANS,
            fontSize: 12.5,
            color: SUB,
            boxShadow: "0 8px 22px -12px rgba(16,27,51,0.35)",
          }}
        >
          not <s style={{ color: "#B03A2E" }}>Spam likely</s> · your practice's name
        </div>
      </div>

      {/* the device, bottom-cropped by the tile */}
      <div
        style={{
          ...riseStyle(frame, fps, t0 + 8, 26),
          position: "absolute",
          top: 132,
          left: "50%",
          marginLeft: -186,
          filter: "drop-shadow(0 30px 50px rgba(16,27,51,0.34))",
        }}
      >
        <PhoneFrame width={372}>
          <HomeScreen frame={frame} fps={fps} t0={t0} />
        </PhoneFrame>
      </div>
    </>
  );
}

/* ---- Chapter 1: attempts until she answers ---------------------------- */
function Attempts({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const slots = [
    { t: "Tue 10:15", d: "No answer · at dialysis", hit: false },
    { t: "Wed 14:00", d: "No answer · asleep", hit: false },
    { t: "Thu 19:10", d: "Answered · 21 min", hit: true },
    { t: "Sat 09:30", d: "Not needed", hit: false },
  ];
  const hitOn = frame >= t0 + 62;
  return (
    <div
      style={{
        ...riseStyle(frame, fps, t0 + 8, 16),
        width: 340,
        background: "rgba(255,255,255,0.95)",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 20,
        padding: 22,
        boxShadow: "0 24px 50px -22px rgba(16,27,51,0.3)",
        fontFamily: SANS,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", color: SUB, marginBottom: 14 }}>
        Attempts · Mrs. Alvarez
      </div>
      {slots.map((s, i) => {
        const at = t0 + 18 + i * 11;
        const isHit = s.hit && hitOn;
        return (
          <div
            key={s.t}
            style={{
              ...riseStyle(frame, fps, at, 8),
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "9px 6px",
              borderBottom: i < slots.length - 1 ? `1px solid ${HAIRLINE}` : "none",
              background: isHit ? "rgba(37,99,235,0.06)" : "transparent",
              borderRadius: isHit ? 8 : 0,
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                background: isHit ? BLUE : "#D6DCE9",
                boxShadow: isHit ? "0 0 0 4px rgba(37,99,235,0.16)" : "none",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, width: 88, color: INK, fontWeight: 600 }}>{s.t}</span>
            <span style={{ flex: 1, fontSize: 12, color: isHit ? BLUE : SUB, fontWeight: isHit ? 700 : 400 }}>{s.d}</span>
          </div>
        );
      })}
      <p style={{ ...riseStyle(frame, fps, t0 + 96, 6), margin: "12px 0 0", fontSize: 11, color: SUB }}>
        Mornings, evenings, Saturdays · text as a fallback
      </p>
    </div>
  );
}

/* ---- Chapter 2: the conversation that finishes ------------------------- */
function Conversation({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const turns = [
    { who: "h", text: "How have the swollen ankles been since we spoke?" },
    { who: "p", text: "Sorry, say that again?" },
    { who: "h", text: "Of course. Your ankles. Any swelling this week?" },
    { who: "p", text: "A bit in the evenings. Shoes feel tight." },
    { who: "h", text: "Thank you. I'll note that for Dr. Reyes." },
  ];
  return (
    <div style={{ width: 360, fontFamily: SANS }}>
      {turns.map((turn, i) => {
        const at = t0 + 10 + i * 17;
        const hana = turn.who === "h";
        return (
          <div key={i} style={{ ...riseStyle(frame, fps, at, 10), display: "flex", justifyContent: hana ? "flex-start" : "flex-end", marginBottom: 9 }}>
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: 15,
                fontSize: 12.5,
                lineHeight: 1.45,
                ...(hana
                  ? { background: INK, color: "#EDF0F8", borderBottomLeftRadius: 5 }
                  : { background: "rgba(255,255,255,0.96)", color: INK, border: `1px solid ${HAIRLINE}`, borderBottomRightRadius: 5 }),
              }}
            >
              {turn.text}
            </div>
          </div>
        );
      })}
      <div
        style={{
          ...pop(frame, fps, t0 + 104),
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          marginTop: 8,
          fontSize: 11.5,
          fontWeight: 700,
          color: BLUE,
          background: "rgba(37,99,235,0.10)",
          borderRadius: 999,
          padding: "6px 12px",
        }}
      >
        ✓ Protocol completed · note ready to attest
      </div>
    </div>
  );
}

/* ---- Chapter 3: it remembers -------------------------------------------- */
function Memory({ frame, fps, t0 }: { frame: number; fps: number; t0: number }) {
  const quoteGlow = interpolate(frame, [t0 + 72, t0 + 84, t0 + 116], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.96)",
    border: `1px solid ${HAIRLINE}`,
    borderRadius: 17,
    padding: "16px 18px",
    boxShadow: "0 18px 40px -20px rgba(16,27,51,0.28)",
    fontFamily: SANS,
    textAlign: "left",
  };
  return (
    <div style={{ width: 330 }}>
      <div style={{ ...riseStyle(frame, fps, t0 + 10, 14), ...card }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: SUB, marginBottom: 8 }}>March 12</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: INK }}>
          Reported ankle swelling in the evenings. Skipping the water tablet on days she goes out.
        </div>
      </div>
      <div style={{ ...riseStyle(frame, fps, t0 + 44, 14), ...card, marginTop: 12 }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: SUB, marginBottom: 8 }}>April 9</div>
        <div
          style={{
            borderLeft: `2px solid ${BLUE}`,
            paddingLeft: 10,
            marginBottom: 9,
            fontSize: 11.5,
            color: SUB,
            fontStyle: "italic",
            background: `rgba(37,99,235,${0.09 * quoteGlow})`,
            borderRadius: 4,
            padding: "4px 8px 4px 10px",
          }}
        >
          "Skipping the water tablet on days she goes out"
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: INK }}>
          "Last month you mentioned missing the tablet when you're out. Has that gotten any easier?"
        </div>
      </div>
    </div>
  );
}

/* ---- Composition -------------------------------------------------------- */
export const CompanionShowcaseComp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c0 = chapterStyle(frame, 0);
  const c1 = chapterStyle(frame, 1);
  const c2 = chapterStyle(frame, 2);
  const c3 = chapterStyle(frame, 3);

  return (
    <AbsoluteFill style={{ fontFamily: SANS, overflow: "hidden" }}>
      {c0 && (
        <div style={c0}>
          <CallerId frame={frame} fps={fps} t0={0} />
        </div>
      )}
      {c1 && (
        <div style={c1}>
          <div style={CENTERED}>
            <Attempts frame={frame} fps={fps} t0={COMPANION_CHAPTER_LEN} />
          </div>
        </div>
      )}
      {c2 && (
        <div style={c2}>
          <div style={CENTERED}>
            <Conversation frame={frame} fps={fps} t0={2 * COMPANION_CHAPTER_LEN} />
          </div>
        </div>
      )}
      {c3 && (
        <div style={c3}>
          <div style={CENTERED}>
            <Memory frame={frame} fps={fps} t0={3 * COMPANION_CHAPTER_LEN} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
