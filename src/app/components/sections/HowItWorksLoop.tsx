import { useId, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * HowItWorksLoop — the care coordination loop, with the WHO on every step.
 *
 * Extracted from RemoteV2.tsx (§3, from Matteo's HTML mock of 2026-08-13),
 * where it replaced the imported LoopDiagram. Nine pages want it: the seven
 * programme pages and the two audience pages. The point of this version over a
 * plain four-step diagram is that each beat says what HANA does AND what the
 * practice does, which is the post-CY2027 argument in miniature. That rule is
 * NOT settled. It can shape how this section is argued; it must never reach
 * reader-facing copy as a fact until counsel confirms it.
 *
 * THE TWO COPY RULES THAT LIVE IN THIS SECTION
 *
 *  1. MINUTES LEAD, CASELOAD FOLLOWS. The `math` strip runs minutes per patient
 *     first, the caseload it caps at second, and where HANA is built to take it
 *     third. Never present the caseload figure on its own: a competitor already
 *     claims 250, and the number only means anything once the reader has the
 *     minutes it comes from. The defaults below are HANA's published figures.
 *     A page may pass its own, but do not reword these.
 *
 *  2. The step 4 body says the documentation is PREPARED and the minutes are
 *     ATTRIBUTED to the clinician who supplied them. The mock read "Twenty
 *     documented minutes per patient, ready to attest", which asserts that
 *     HANA's call time IS the billable time. That is the one claim this section
 *     must never make. Anything a page passes as its own steps has to hold that
 *     line too.
 *
 * PRERENDER. The original wrapped the header, both step columns, the standing
 * line and the whole maths strip in `whileInView` fadeUp. Headless Chrome used
 * to capture each route at 800x600 without ever scrolling, so on all nine pages
 * this section sits below the fold, the observer never fired, and `opacity: 0`
 * went into the snapshot on every word of it. That is the defect that shipped
 * 52% of the homepage invisible. scripts/prerender.mjs now scrolls the document
 * in viewport-sized steps before it captures, which fixes it at the pipeline for
 * all 28 affected files. This section still carries NO entrance animation and
 * puts nothing behind runtime state, so it cannot regress if that scroll pass is
 * ever lost, out-raced or run against a taller page. What was never at risk, and
 * is kept beat for beat, is the diagram itself: the loop is SMIL on a single 10s
 * cycle, which neither needs an observer nor hides any text.
 *
 * MOTION. `useReducedMotion` drops the travelling dot, the drawn trail and the
 * node pulses, leaving the two static loop strokes and the four white nodes.
 *
 * TOKENS. No hex, with one unavoidable exception: SMIL `values` lists are not
 * CSS and do not resolve `var()`, so the glyph stroke animation carries literal
 * #00122F / #FFFFFF (navy and paper). Every static attribute uses var(). See
 * the comment at the animation itself.
 *
 * COLOUR DELTA, NOT YET EYEBALLED. Three literals from the mock had no exact
 * token, so each was mapped to the nearest role and the hue moved with it: the
 * two loop strokes #8FB2F2 → --color-brand-soft (#a9b4ff), the travelling dot
 * #F59E42 → --color-signal-amber (#e8a06a), the ghost numeral #C9D6F2 →
 * text-brand/25. The dot is also the one place a signal token is used for
 * decoration, which tokens.css otherwise forbids. The drop shadow #0F1B33 →
 * --color-navy is a true match, and every other value is identical to
 * RemoteV2 §3. If the lavender or the peach reads wrong on the paper ground,
 * the fix is a named token in tokens.css, never hex back into this file.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface LoopStep {
  /** The ghost numeral beside the name. "1", "2", … */
  n: string;
  /** One word. "Reach", "Flag", "Document", "Bill". */
  name: string;
  /**
   * Who does what, as "Hana calls · <b>you set the protocol</b>". ReactNode so
   * the page can bold the practice's half of it, which is the whole point.
   */
  role: ReactNode;
  body: string;
  /**
   * Optional glyph for this step's node, drawn centred on (0,0) in roughly a
   * 20x20 box, stroked by the parent. Omit it and the step inherits the default
   * glyph for its position on the loop (reach, flag, document, bill).
   */
  glyph?: ReactNode;
}

export interface LoopMathItem {
  /** The figure. "45-60", "120-160", "29". */
  v: string;
  /** The unit, set small and superior. "min", or "" for a bare count. */
  suf?: string;
  label: string;
  body: string;
}

export interface HowItWorksLoopProps {
  eyebrow?: string;
  /** ReactNode so a page can accent part of its own heading with an <em>. */
  heading?: ReactNode;
  body?: string;
  /** Steps 1 and 2, read down the left of the loop. */
  leftSteps?: LoopStep[];
  /** Steps 3 and 4, read down the right of the loop. */
  rightSteps?: LoopStep[];
  /** The arithmetic strip. Minutes first, caseload second. See rule 1 above. */
  math?: LoopMathItem[];
  /** The escalation line under the diagram. Pass null to drop it. */
  note?: ReactNode;
  /** The human step. The brief says this one never gets cut for length. */
  closing?: ReactNode;
  /** Accessible name for the diagram. Defaults to the step names. */
  diagramLabel?: string;
  /** "light" is the white ground; "band" is the tinted section ground. */
  tone?: "light" | "band";
  className?: string;
  id?: string;
}

/* ── Defaults ──────────────────────────────────────────────────────────────
   Today's Remote copy, unchanged. A programme page passes its own steps; the
   homepage mounts <HowItWorksLoop /> and gets exactly this. */

const DEFAULT_LEFT: LoopStep[] = [
  {
    n: "1",
    name: "Reach",
    role: (
      <>
        Hana calls · <b className="text-navy">you set the protocol</b>
      </>
    ),
    body: "It calls from your number until someone picks up. Then medications, symptoms, and what changed.",
  },
  {
    n: "2",
    name: "Flag",
    role: (
      <>
        Hana routes · <b className="text-navy">your team decides</b>
      </>
    ),
    body: "Anything clinical goes to your team, with the reason and the transcript attached.",
  },
];

const DEFAULT_RIGHT: LoopStep[] = [
  {
    n: "3",
    name: "Document",
    role: (
      <>
        <b className="text-navy">Your clinician reviews</b> · Hana writes
      </>
    ),
    body: "The note is in the chart before your team opens it. Under that patient, not in a spreadsheet.",
  },
  {
    n: "4",
    name: "Bill",
    role: (
      <>
        <b className="text-navy">You submit</b> · Hana supplies the evidence
      </>
    ),
    body: "Every minute attributed to the person who earned it, ready to attest on the first.",
  },
];

/* HANA's published figures. Coordinator time per patient per month, the caseload
   that time caps at, and where HANA is built to take it. Order is load-bearing:
   minutes, then caseload, never caseload alone. Do not reword these. */
const DEFAULT_MATH: LoopMathItem[] = [
  {
    v: "45-60",
    suf: "min",
    label: "per patient, per month, today",
    body: "What a coordinator spends on one enrolled patient when the calling, the chasing and the note are all done by hand.",
  },
  {
    v: "120-160",
    suf: "",
    label: "the caseload that caps at",
    body: "Which is why most programs stall well short of what the panel could support.",
  },
  {
    v: "29",
    suf: "min",
    label: "what HANA is built for",
    body: "Same coordinator, same hours, toward 250 patients. HANA makes the calls; your team reviews and attests.",
  },
];

const DEFAULT_NOTE = (
  <>
    <b className="font-medium text-ink-soft">You set the escalation rules.</b> A person on every
    clinical flag, an audit trail on every call, minutes totalled per patient.
  </>
);

const DEFAULT_CLOSING = (
  <>
    Your team reviews it. Your provider signs it.{" "}
    <b className="font-semibold">Nothing is billed until a person on your team approves it.</b>
  </>
);

/* ── Geometry ──────────────────────────────────────────────────────────────
   The figure-of-eight and the shadow copy sitting a few units outside it. */

const LOOP_PATH =
  "M 400 200 C 300 80, 120 90, 120 200 C 120 310, 300 320, 400 200 C 500 80, 680 90, 680 200 C 680 310, 500 320, 400 200 Z";
const LOOP_PATH_BACK =
  "M 400 200 C 300 74, 112 84, 112 200 C 112 316, 300 326, 400 200 C 500 74, 688 84, 688 200 C 688 316, 500 326, 400 200 Z";
const LOOP_DUR = "10s";

/* The four node positions, in the order the steps fill them: left-top,
   left-bottom, right-top, right-bottom. `window` is the slice of the 10s cycle
   when the travelling dot is on that node, as keyTimes [riseStart, peak,
   fadeEnd]. The path runs centre → left-top → left-bottom → centre → right-top
   → right-bottom → centre, so the four nodes sit at roughly 12%, 37%, 62% and
   87% of the loop. Change a cx/cy and you must move its window with it. */
const LOOP_NODES: { cx: number; cy: number; window: readonly [number, number, number] }[] = [
  { cx: 222, cy: 114, window: [0.075, 0.125, 0.2] },
  { cx: 222, cy: 286, window: [0.325, 0.375, 0.45] },
  { cx: 578, cy: 114, window: [0.575, 0.625, 0.7] },
  { cx: 578, cy: 286, window: [0.825, 0.875, 0.95] },
];

/* Glyphs by position on the loop: reach, flag, document, bill. A step that
   carries its own `glyph` overrides the one for its slot. */
const DEFAULT_GLYPHS: ReactNode[] = [
  <path key="reach" d="M-9 -5 V5 M-4.5 -9 V9 M0 -6 V6 M4.5 -9 V9 M9 -4 V4" />,
  <g key="flag">
    <path d="M0 -9 L9.5 8 H-9.5 Z" />
    <path d="M0 -3 V2" />
    <path d="M0 4.6 V4.7" />
  </g>,
  <g key="document">
    <path d="M-7.5 -10 H5 L8 -7 V10 H-7.5 Z" />
    <path d="M-4 -4 H4 M-4 0.5 H4 M-4 5 H1" />
  </g>,
  <g key="bill">
    <path d="M-8 -10 H8 V10 L4 7 L0 10 L-4 7 L-8 10 Z" />
    <path d="M-4 -4.5 L-1.5 -2 L4 -7" />
    <path d="M-4.5 2.5 H4.5" />
  </g>,
];

/* Tone is two grounds over one layout, token-only, so the .cobalt scope and any
   future palette change carry through untouched. No dark band mid-page: "band"
   separates on --color-band with a hairline, per the palette rules. */
const TONE = {
  light: {
    section: "bg-paper-bright",
    eyebrow: "text-ink-mute",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
    body: "text-ink-soft",
    rule: "border-rule",
  },
  band: {
    section: "bg-band border-y border-rule",
    eyebrow: "text-ink-mute",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
    body: "text-ink-soft",
    rule: "border-rule",
  },
} as const;

/* Private. One step, mirrored on the right so the pair reads inward toward the
   diagram. No entrance animation: see the PRERENDER note at the top. */
function LoopStepBlock({ step, align }: { step: LoopStep; align: "l" | "r" }) {
  const right = align === "r";
  return (
    <div className={cn("max-w-[300px]", right && "ml-auto text-right")}>
      <div className={cn("flex items-baseline gap-2.5", right && "justify-end")}>
        {right ? (
          <>
            <span className="text-[19px] font-bold tracking-[-0.01em] text-navy order-1">
              {step.name}
            </span>
            <span className="font-serif text-[44px] leading-none text-brand/25 order-2">
              {step.n}
            </span>
          </>
        ) : (
          <>
            <span className="font-serif text-[44px] leading-none text-brand/25">{step.n}</span>
            <span className="text-[19px] font-bold tracking-[-0.01em] text-navy">{step.name}</span>
          </>
        )}
      </div>
      <p className="mt-2.5 mb-0 text-[10px] font-bold uppercase tracking-[1px] text-ink-mute">
        {step.role}
      </p>
      {/* Prose floor is text-ink-soft. The original ran this at text-ink-mute,
          which is the labels-only step of the scale. */}
      <p className="mt-2.5 mb-0 text-[14.5px] leading-[1.58] text-ink-soft">{step.body}</p>
    </div>
  );
}

export function HowItWorksLoop({
  eyebrow = "How it works",
  heading = (
    <>
      Forty-five minutes a patient.
      <br />
      <em>We take it under thirty.</em>
    </>
  ),
  body = "One coordinator. Same hours. Two hundred and fifty patients instead of a hundred and fifty.",
  leftSteps = DEFAULT_LEFT,
  rightSteps = DEFAULT_RIGHT,
  math = DEFAULT_MATH,
  note = DEFAULT_NOTE,
  closing = DEFAULT_CLOSING,
  diagramLabel,
  tone = "light",
  className,
  id,
}: HowItWorksLoopProps = {}) {
  const reduce = useReducedMotion();
  const skin = TONE[tone];

  // useId can contain colons, which are not safe inside url(#…).
  const uid = useId().replace(/:/g, "");
  const headingId = `${uid}-loop-heading`;
  const shadowId = `${uid}-loop-shadow`;

  // The nodes fill left-top, left-bottom, right-top, right-bottom in that order,
  // so a column of one leaves its lower node undrawn rather than shifting the loop.
  const nodeSteps: (LoopStep | undefined)[] = [
    leftSteps[0],
    leftSteps[1],
    rightSteps[0],
    rightSteps[1],
  ];

  const label =
    diagramLabel ??
    `The care coordination loop: ${[...leftSteps, ...rightSteps]
      .map((s) => s.name.toLowerCase())
      .join(", ")}`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(skin.section, "py-24 md:py-32 px-6 md:px-16 scroll-mt-24", className)}
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Plain <div>, not motion.div. An entrance animation here bakes
            opacity:0 onto the <h2> in the prerendered HTML. */}
        <div className="text-center">
          {eyebrow ? (
            <p className={cn("text-eyebrow font-bold uppercase mt-0 mb-6", skin.eyebrow)}>
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "font-serif font-normal text-[34px] sm:text-[44px] md:text-[52px] leading-[1.08] tracking-[-0.015em] m-0",
              skin.heading,
            )}
          >
            {heading}
          </h2>
          {body ? (
            <p
              className={cn(
                "text-[17px] leading-[1.62] max-w-[600px] mx-auto mt-6 mb-0",
                skin.body,
              )}
            >
              {body}
            </p>
          ) : null}
        </div>

        {/* the loop */}
        <div className="relative mt-3.5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(520px,760px)_1fr] items-center gap-9 lg:gap-0">
            <div className="lg:px-2 space-y-8 lg:space-y-[150px]">
              {leftSteps.map((s) => (
                <LoopStepBlock key={s.n} step={s} align="l" />
              ))}
            </div>

            <div className="order-first lg:order-none">
              <svg
                viewBox="60 40 680 320"
                className="w-full h-auto overflow-visible"
                role="img"
                aria-label={label}
              >
                <defs>
                  <filter id={shadowId} x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow
                      dx="0"
                      dy="6"
                      stdDeviation="7"
                      floodColor="var(--color-navy)"
                      floodOpacity="0.13"
                    />
                  </filter>
                </defs>
                <path
                  d={LOOP_PATH_BACK}
                  fill="none"
                  stroke="var(--color-brand-soft)"
                  strokeWidth="3.6"
                  opacity="0.26"
                />
                <path
                  d={LOOP_PATH}
                  fill="none"
                  stroke="var(--color-brand-soft)"
                  strokeWidth="4.2"
                  opacity="0.5"
                />
                {!reduce && (
                  <>
                    <path
                      d={LOOP_PATH}
                      fill="none"
                      stroke="var(--color-brand)"
                      strokeWidth="4.6"
                      opacity="0.9"
                      strokeDasharray="120 1500"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="1620"
                        to="0"
                        dur={LOOP_DUR}
                        repeatCount="indefinite"
                      />
                    </path>
                    <circle r="6.5" fill="var(--color-signal-amber)">
                      <animateMotion dur={LOOP_DUR} repeatCount="indefinite" path={LOOP_PATH} />
                    </circle>
                  </>
                )}

                {/* Nodes. Each lights up as the travelling dot reaches it: the
                    windows above are that node's position along the loop, so the
                    pulse and the dot stay in sync on one 10s cycle. */}
                {LOOP_NODES.map((node, i) => {
                  const step = nodeSteps[i];
                  if (!step) return null;
                  const [a, b, c] = node.window;
                  const keyTimes = `0;${a};${b};${c};1`;
                  return (
                    <g key={`${step.n}-${step.name}`}>
                      <g filter={`url(#${shadowId})`}>
                        <circle cx={node.cx} cy={node.cy} r="31" fill="var(--color-paper-bright)" />
                      </g>
                      {!reduce && (
                        <>
                          {/* halo */}
                          <circle
                            cx={node.cx}
                            cy={node.cy}
                            r="31"
                            fill="none"
                            stroke="var(--color-brand)"
                            strokeWidth="2"
                            opacity="0"
                          >
                            <animate
                              attributeName="r"
                              dur={LOOP_DUR}
                              repeatCount="indefinite"
                              values="31;31;40;46;46"
                              keyTimes={keyTimes}
                            />
                            <animate
                              attributeName="opacity"
                              dur={LOOP_DUR}
                              repeatCount="indefinite"
                              values="0;0;0.55;0;0"
                              keyTimes={keyTimes}
                            />
                          </circle>
                          {/* accent fill */}
                          <circle
                            cx={node.cx}
                            cy={node.cy}
                            r="31"
                            fill="var(--color-brand)"
                            opacity="0"
                          >
                            <animate
                              attributeName="opacity"
                              dur={LOOP_DUR}
                              repeatCount="indefinite"
                              values="0;0;1;0;0"
                              keyTimes={keyTimes}
                            />
                          </circle>
                        </>
                      )}
                      <g
                        fill="none"
                        stroke="var(--color-navy)"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform={`translate(${node.cx},${node.cy})`}
                      >
                        {/* The one place raw hex survives: a SMIL `values` list
                            is not a CSS property value and does not resolve
                            var(), so these are --color-navy and --color-paper
                            written out. Keep them in step if the palette moves. */}
                        {!reduce && (
                          <animate
                            attributeName="stroke"
                            dur={LOOP_DUR}
                            repeatCount="indefinite"
                            values="#00122F;#00122F;#FFFFFF;#00122F;#00122F"
                            keyTimes={keyTimes}
                          />
                        )}
                        {step.glyph ?? DEFAULT_GLYPHS[i]}
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="lg:px-2 space-y-8 lg:space-y-[150px]">
              {rightSteps.map((s) => (
                <LoopStepBlock key={s.n} step={s} align="r" />
              ))}
            </div>
          </div>
        </div>

        {note ? (
          <p className="max-w-[820px] mx-auto mt-16 mb-0 text-center text-[14.5px] leading-[1.6] text-ink-soft">
            {note}
          </p>
        ) : null}

        {/* The arithmetic, folded in here rather than given its own section
            (Matteo 2026-08-25). MINUTES FIRST, CASELOAD SECOND, never caseload
            alone, because a competitor already claims 250. */}
        {math.length > 0 ? (
          <div
            className={cn(
              "mt-14 md:mt-16 pt-12 border-t grid grid-cols-1 gap-10 md:gap-12 text-center",
              skin.rule,
              math.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
            )}
          >
            {math.map((m) => (
              <div key={m.label}>
                <p className="font-serif font-normal text-[44px] md:text-[54px] leading-none text-navy m-0">
                  {m.v}
                  {m.suf ? (
                    <span className="text-ink-mute text-[0.4em] align-super ml-1">{m.suf}</span>
                  ) : null}
                </p>
                <p className="text-[15px] font-semibold text-navy mt-4 mb-1.5">{m.label}</p>
                <p className="text-[14px] leading-[1.6] text-ink-soft m-0 max-w-[30ch] mx-auto">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {/* The human step. The brief says this one never gets cut for length. */}
        {closing ? (
          <p className="text-[17px] leading-[1.6] text-navy mt-12 mb-0 max-w-[62ch] mx-auto text-center">
            {closing}
          </p>
        ) : null}
      </div>
    </section>
  );
}
