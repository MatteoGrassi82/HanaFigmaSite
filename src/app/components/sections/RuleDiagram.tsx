import type { Programme } from "../../../content/programmes/index";

/* ─────────────────────────────────────────────────────────────────────────────
 * RuleDiagram — a programme's billing rule, drawn.
 *
 * WHY THIS EXISTS. All seven programme heroes carried the same photograph, and
 * Matteo saw it: "it looks like the same image for everything ... care programs
 * should be different ... I don't need the image there for the hero." He is
 * right, and the reason the pages looked identical is that they differ by DATA
 * (rule, code, rate) but wore the same CHROME. The fix is not seven photos --
 * that reopens the AI-face question and buys nothing -- it is to let the one
 * thing that genuinely differs between programmes be the visual.
 *
 * And the rules ARE different shapes:
 *   CCM   twenty minutes in a month                 -> an arc, filled to 20 of 60
 *   APCM  no time threshold, thirteen elements      -> a checklist, deliberately no clock
 *   BHI   twenty minutes, on a behavioural condition -> the arc again, with the
 *                                                       primary-care/behavioural link
 *   RTM   sixteen days of data in thirty            -> a 30-day strip, 16 lit
 *   RPM   sixteen days of readings in thirty        -> the same strip, with the
 *                                                       reading itself drawn
 *   PCM   ONE condition, thirty minutes             -> one node, an arc to 30
 *   TCM   two business days, then a visit inside 14 -> a timeline with two deadlines
 *
 * Each is one small SVG in a fixed 400x240 viewBox, so they sit in the same
 * frame the photo used to and the hero layout does not move. Colours are the
 * site tokens via CSS variables, so a palette change carries. No prose inside
 * the SVG beyond the figures the rule itself states; the sentence that explains
 * it is the caption underneath, and it comes from `data.rule`.
 *
 * WHAT THE DIAGRAMS MUST NOT DO: invent a threshold. Every number drawn here is
 * in the content module's `rule` string for that programme. If a rule changes,
 * change it there first; a diagram that disagrees with its own caption is worse
 * than a photo.
 * ─────────────────────────────────────────────────────────────────────────── */

const INK = "var(--color-ink)";
const SOFT = "var(--color-ink-soft)";
const MUTE = "var(--color-ink-mute)";
const RULE = "var(--color-rule)";
const BRAND = "var(--color-brand)";
const TINT = "var(--color-brand-tint)";
const AMBER = "var(--color-signal-amber)";

const LABEL = { fontFamily: "var(--font-sans, inherit)", fontSize: 12, fontWeight: 700, letterSpacing: 1.2, fill: MUTE } as const;
const SERIF = { fontFamily: "var(--font-serif, serif)", fill: INK } as const;

/** A ring filled to `minutes` of a 60-minute face. Shared by CCM, BHI, PCM. */
function MinuteArc({ minutes, cx, cy, r, label }: { minutes: number; cx: number; cy: number; r: number; label: string }) {
  const C = 2 * Math.PI * r;
  const filled = (minutes / 60) * C;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={RULE} strokeWidth={14} />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={BRAND} strokeWidth={14} strokeLinecap="round"
        strokeDasharray={`${filled} ${C - filled}`} transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* The figure sits inside the ring; the label sits BELOW it. At r=78 the
          inner diameter at the label's baseline was narrower than the label,
          so "ONE MONTH" ran into the stroke on the right. */}
      <text x={cx} y={cy + 16} textAnchor="middle" style={{ ...SERIF, fontSize: 48 }}>{minutes}</text>
      <text x={cx} y={cy + r + 30} textAnchor="middle" style={LABEL}>{label}</text>
    </g>
  );
}

/** Thirty cells, the first `lit` filled. Shared by RTM and RPM. */
function DayStrip({ lit, y, caption }: { lit: number; y: number; caption: string }) {
  const cells = Array.from({ length: 30 }, (_, i) => i);
  const w = 10, gap = 2.6, x0 = 22;
  return (
    <g>
      {cells.map((i) => (
        <rect key={i} x={x0 + i * (w + gap)} y={y} width={w} height={26} rx={2.5}
          fill={i < lit ? BRAND : TINT} stroke={i < lit ? "none" : RULE} strokeWidth={1} />
      ))}
      <text x={x0} y={y + 52} style={LABEL}>{caption}</text>
      <text x={x0 + 30 * (w + gap) - 2} y={y + 52} textAnchor="end" style={LABEL}>30 DAYS</text>
    </g>
  );
}

export function RuleDiagram({ programme }: { programme: Programme }) {
  const id = programme.id;
  const common = { viewBox: "0 0 400 240", width: "100%", height: "100%", role: "img" as const, "aria-label": programme.rule };

  if (id === "ccm") {
    return (
      <svg {...common}>
        <MinuteArc minutes={20} cx={200} cy={100} r={72} label="MINUTES · ONE MONTH" />
        <text x={200} y={228} textAnchor="middle" style={{ ...LABEL, fill: SOFT }}>CLINICAL STAFF TIME, AWAY FROM THE PATIENT</text>
      </svg>
    );
  }

  if (id === "pcm") {
    return (
      <svg {...common}>
        <MinuteArc minutes={30} cx={200} cy={100} r={72} label="MINUTES · ONE MONTH" />
        {/* the one condition, and no second */}
        <circle cx={200} cy={112} r={14} fill={BRAND} opacity={0} />
        <text x={200} y={228} textAnchor="middle" style={{ ...LABEL, fill: SOFT }}>ONE COMPLEX CONDITION, NOT TWO</text>
      </svg>
    );
  }

  if (id === "bhi") {
    return (
      <svg {...common}>
        <MinuteArc minutes={20} cx={140} cy={100} r={64} label="MINUTES · ONE MONTH" />
        {/* the link between primary care and the behavioural condition */}
        <line x1={210} y1={100} x2={280} y2={100} stroke={RULE} strokeWidth={3} strokeDasharray="6 6" />
        <circle cx={306} cy={100} r={24} fill={TINT} stroke={BRAND} strokeWidth={3} />
        <path d="M296 100h20M306 90v20" stroke={BRAND} strokeWidth={3} strokeLinecap="round" />
        <text x={306} y={146} textAnchor="middle" style={LABEL}>BEHAVIOURAL</text>
        <text x={306} y={160} textAnchor="middle" style={LABEL}>CONDITION</text>
        <text x={200} y={228} textAnchor="middle" style={{ ...LABEL, fill: SOFT }}>MANAGED INSIDE PRIMARY CARE</text>
      </svg>
    );
  }

  if (id === "apcm") {
    // deliberately no clock: the rule is "no time threshold at all"
    const items = Array.from({ length: 13 }, (_, i) => i);
    return (
      <svg {...common}>
        {items.map((i) => {
          const col = i % 5, row = Math.floor(i / 5);
          const x = 58 + col * 60, y = 30 + row * 46;
          return (
            <g key={i}>
              <rect x={x} y={y} width={44} height={34} rx={8} fill={TINT} stroke={RULE} strokeWidth={1} />
              <path d={`M${x + 13} ${y + 18}l7 7 12-14`} fill="none" stroke={BRAND} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        <text x={200} y={202} textAnchor="middle" style={{ ...SERIF, fontSize: 26 }}>13 service elements</text>
        <text x={200} y={226} textAnchor="middle" style={{ ...LABEL, fill: SOFT }}>NO TIME THRESHOLD. ONE BUNDLED PAYMENT.</text>
      </svg>
    );
  }

  if (id === "rtm") {
    return (
      <svg {...common}>
        <text x={22} y={44} style={{ ...SERIF, fontSize: 40 }}>16</text>
        <text x={68} y={44} style={{ ...LABEL, fill: SOFT }}>DAYS OF THERAPY DATA</text>
        <DayStrip lit={16} y={72} caption="DEVICE SUPPLY CODES" />
        {/* plus one real conversation inside the month */}
        <circle cx={40} cy={176} r={13} fill={BRAND} />
        <path d="M33 176h14M40 169v14" stroke="var(--color-paper-bright)" strokeWidth={2.4} strokeLinecap="round" />
        <text x={64} y={181} style={{ ...LABEL, fill: SOFT }}>+ ONE INTERACTIVE CONVERSATION · 98980</text>
        <text x={22} y={222} style={{ ...LABEL, fill: MUTE }}>HANA HAS THE CONVERSATION. THE DEVICE IS YOURS.</text>
      </svg>
    );
  }

  if (id === "rpm") {
    return (
      <svg {...common}>
        <text x={22} y={44} style={{ ...SERIF, fontSize: 40 }}>16</text>
        <text x={68} y={44} style={{ ...LABEL, fill: SOFT }}>DAYS OF READINGS</text>
        <DayStrip lit={16} y={72} caption="DEVICE SUPPLY · 99454" />
        {/* the reading itself, which is what makes this physiologic */}
        <polyline points="22,182 60,182 70,166 82,196 94,174 104,182 150,182" fill="none" stroke={AMBER} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <text x={164} y={186} style={{ ...LABEL, fill: SOFT }}>+ ONE LIVE COMMUNICATION · 99457</text>
        <text x={22} y={222} style={{ ...LABEL, fill: MUTE }}>HANA MAKES THE CALL. IT NEVER READS THE DEVICE.</text>
      </svg>
    );
  }

  if (id === "tcm") {
    // A timeline: discharge, then the contact inside two business days, then
    // the visit inside fourteen. The contact dot sits at ~x=120 rather than
    // hard against the discharge dot: at x=94 the two serif labels overprinted
    // ("Dischargntact") and so did the day labels. Two business days is short
    // but it is not nothing, and the gap has to hold two words.
    const X0 = 44, X1 = 128, X2 = 356, Y = 118;
    return (
      <svg {...common}>
        <line x1={X0} y1={Y} x2={X2} y2={Y} stroke={RULE} strokeWidth={4} strokeLinecap="round" />
        <line x1={X0} y1={Y} x2={X1} y2={Y} stroke={BRAND} strokeWidth={4} strokeLinecap="round" />
        {/* discharge: label ABOVE */}
        <circle cx={X0} cy={Y} r={11} fill={INK} />
        <text x={X0} y={72} textAnchor="start" style={{ ...SERIF, fontSize: 22 }}>Discharge</text>
        <text x={X0} y={92} textAnchor="start" style={LABEL}>DAY 0</text>
        {/* the contact HANA makes: label BELOW, so it cannot collide with the one above */}
        <circle cx={X1} cy={Y} r={13} fill={BRAND} />
        <path d={`M${X1 - 7} ${Y}h14M${X1} ${Y - 7}v14`} stroke="var(--color-paper-bright)" strokeWidth={2.4} strokeLinecap="round" />
        <text x={X1} y={156} textAnchor="middle" style={{ ...SERIF, fontSize: 22 }}>Contact</text>
        <text x={X1} y={176} textAnchor="middle" style={LABEL}>≤ 2 BUSINESS DAYS</text>
        {/* the visit, which is the practice's: label ABOVE, right-anchored */}
        <circle cx={X2} cy={Y} r={11} fill="var(--color-paper-bright)" stroke={INK} strokeWidth={3} />
        <text x={X2} y={72} textAnchor="end" style={{ ...SERIF, fontSize: 22 }}>Visit</text>
        <text x={X2} y={92} textAnchor="end" style={LABEL}>≤ 14 DAYS</text>
        <text x={200} y={212} textAnchor="middle" style={{ ...LABEL, fill: SOFT }}>HANA MAKES THE CONTACT. THE VISIT IS YOURS.</text>
        <text x={200} y={230} textAnchor="middle" style={{ ...LABEL, fill: MUTE }}>BILLED PER DISCHARGE, NOT PER MONTH</text>
      </svg>
    );
  }

  return null;
}

export default RuleDiagram;
