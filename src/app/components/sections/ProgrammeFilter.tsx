import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PROGRAMMES, PROGRAMME_FOOTNOTE, sameMonth, type Programme, type ProgrammeId } from "../../../content/programmes/index";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * ProgrammeFilter — describe a patient with toggles; the programmes light up.
 *
 * REPLACES THREE SECTIONS ON THE HUB: the three-question ProgrammeChooser
 * (1,668px, 450 words, prose at every branch), the static seven-card grid
 * (1,621px), and the seven-way CodeTable (2,539px, 1,109 words). Matteo, 9
 * Sept 2026: "too much text ... I like the idea behind it but it's really kind
 * of pointless ... you build filters for all of this ... something cool and
 * interactive that is also simple to understand and simple to do."
 *
 * THE MODEL IS A FILTER, NOT A DECISION TREE. The chooser asked three questions
 * in sequence and wrote a paragraph at each leaf, which meant every new
 * dimension -- a device, a discharge, an ACCESS track -- was another branch of
 * prose, and it could never say "this patient fits TWO programmes". A filter
 * can: each toggle is independent, and a card lights when its own condition
 * holds. WITH NOTHING TOGGLED, EVERYTHING IS LIT, so the untouched section is
 * also the card grid it replaces. Toggle, and it narrows.
 *
 * EVERY CONDITION BELOW IS ALREADY ASSERTED SOMEWHERE ELSE ON THIS SITE. They
 * are lifted from the content module's `who` lines and from the branches the
 * old chooser already drew, not invented for this component:
 *   CCM   two or more chronic conditions
 *   PCM   ONE complex condition
 *   APCM  any count -- G0556 for one or fewer, G0557 for two or more
 *   BHI   a behavioural health condition managed in primary care
 *   RTM   a device recording a THERAPY (adherence, response): CPAP is the case
 *   RPM   a device recording a PHYSIOLOGIC reading (pressure, weight, oxygen)
 *   TCM   a discharge in the last thirty days
 *   ACCESS enrolled in one of the model's four tracks
 *
 * WHAT IT MUST NOT CLAIM. Lighting a card means "a patient like this can be
 * CONSIDERED for this programme", not "is eligible" -- consent, initiating
 * visit, who may bill and the concurrency rules are open questions listed on
 * every programme page, and this component cannot check any of them. The
 * footnote says so in those words.
 *
 * STACKS. Matteo, 9 Sept 2026: "I want to make sure these happen if there is
 * any possibility I can stack them." So under the cards the section works out
 * which of the lit programmes CMS lets a practice bill for the same patient in
 * the same month, from SAME_MONTH in the content module (every pair cited
 * there). It lists the largest compatible sets with their combined figure, the
 * pairs that are barred, and the pairs we have not found a ruling on, which it
 * calls unsettled rather than guessing. Two caveats travel with every stack:
 * the same minutes never count twice, and a stack is what MAY be billed, not
 * what this patient qualifies for.
 *
 * COLOUR (fourth pass, 9 Sept 2026). Matteo, twice: "that orange we had
 * before, too much blue sharing", then "instead of just the blue, I would
 * like the orange one highlighted". So signal-amber IS the lit colour here,
 * which reads against tokens.css ("signals are never for series or
 * decoration") and against amber's other job on this site, the patient's
 * share and the escalation flag. It is a deliberate exception, asked for
 * twice, and it holds only because nothing else in this section competes:
 *   INK    what the reader chose, and every number they read. The choice is
 *          marked by a rule on the left of the option, not a filled pill
 *          (Matteo, 9 Sept: "the selector could be better: just the line on
 *          the left"), which gives five axes one vertical rhythm in place of
 *          five segmented tracks of differing width, and reads the same on a
 *          phone as on a desktop. The four ACCESS tracks are options in that
 *          list now, so there is no nested control: track only ever decides
 *          whether the ACCESS card lights, so "enrolled, track unknown" and
 *          "any" produced the same answer and one of them had to go.
 *   AMBER  lit, and only lit: the lamp in each row's gutter, the dot beside
 *          the count, the tint on the stack chips. A stack then reads as the
 *          lamps that stayed on, which is what a stack is.
 *   GREY   the caution block, which used to be the amber one. Two ambers in
 *          one card, one meaning "this is available" and one meaning "this is
 *          barred", would have cancelled each other out.
 * AMBER NEVER CARRIES TEXT. #e8a06a is 2.0:1 on paper. It is a disc, a halo
 * and a chip ground; the type on and beside it is ink.
 *
 * The described patient is read back as a sentence at the TOP OF THE ANSWER,
 * not under the controls: "A patient with two or more chronic conditions and
 * a device sending readings" sitting above "6 of 8" is the whole cause and
 * effect in one line, and it keeps the two columns near the same height.
 *
 *   INK    what the reader chose, and every number they read. The choice is
 *          marked by a rule on the left of the option, not a filled pill
 *          (Matteo, 9 Sept: "the selector could be better: just the line on
 *          the left"), which gives five axes one vertical rhythm in place of
 *          five segmented tracks of differing width, and reads the same on a
 *          phone as on a desktop. The four ACCESS tracks are options in that
 *          list now, so there is no nested control: track only ever decides
 *          whether the ACCESS card lights, so "enrolled, track unknown" and
 *          "any" produced the same answer and one of them had to go.
 *   BRAND  the lit signal, and only that: a 3px rail on a row that fits.
 *          No blue words, and no rails at all until the reader has described
 *          somebody, because eight rails at rest is a blue column that means
 *          nothing. The rail is an answer, so it arrives with the question.
 *   AMBER  the caution, which is what signal-amber means everywhere else on
 *          this site (the patient's share in PayVisual, an escalation in the
 *          loop, the illustrative frame on the estimator). tokens.css says
 *          signals are never decoration, so it is NOT the lit colour: it
 *          carries the one block that says what the month cannot hold.
 * The chips use --color-brand-tint, the token that exists for the accent as a
 * surface wash, in place of the hand-mixed brand-soft/45.
 *
 * ACCESS IS A CARD IN ITS OWN SHAPE, same as on the hub: a payment model by
 * track, not a monthly code, so it carries the track name instead of a rate.
 * ─────────────────────────────────────────────────────────────────────────── */

type Count = "any" | "0" | "1" | "2+";
type Device = "any" | "none" | "physiologic" | "therapeutic";
type YesNo = "any" | "yes" | "no";
type Track = "any" | "none" | "CKM" | "eCKM" | "BH" | "MSK";

interface Answers { count: Count; device: Device; behavioral: YesNo; discharged: YesNo; track: Track }
const NONE: Answers = { count: "any", device: "any", behavioral: "any", discharged: "any", track: "any" };

/** Does this programme light for these answers? "any" on an axis never excludes. */
function lit(id: ProgrammeId | "access", a: Answers): boolean {
  switch (id) {
    case "ccm":  return a.count === "any" || a.count === "2+";
    case "pcm":  return a.count === "any" || a.count === "1";
    case "apcm": return true; // every count has a G-code
    case "bhi":  return a.behavioral !== "no";
    case "rtm":  return a.device === "any" || a.device === "therapeutic";
    case "rpm":  return a.device === "any" || a.device === "physiologic";
    case "tcm":  return a.discharged !== "no";
    case "access": return a.track !== "none";
  }
}

/** The APCM code the count implies, so the card can say which one. */
function apcmCode(count: Count): string {
  if (count === "2+") return "G0557";
  if (count === "0" || count === "1") return "G0556";
  return "G0556 · G0557";
}

/** Short code per programme, for the stack chips. */
const CODE: Record<ProgrammeId, string> = Object.fromEntries(PROGRAMMES.map((p) => [p.id, p.code])) as Record<ProgrammeId, string>;

/**
 * The lit signal: a lamp in the gutter, on in signal-amber or off as an empty
 * ring. Amber carries no text here, only the disc and its halo, because
 * #e8a06a is 2.0:1 on paper and could never be read as type.
 */
function Lamp({ on }: { on: boolean }) {
  return (
    <span aria-hidden className="flex h-3 w-3 items-center justify-center">
      <span
        className={cn(
          "block rounded-full transition-all duration-300",
          on
            ? "h-3 w-3 bg-signal-amber ring-4 ring-signal-amber/25"
            : "h-2.5 w-2.5 border border-rule-strong bg-paper"
        )}
      />
    </span>
  );
}

interface Stack { ids: ProgrammeId[]; total: number }
interface Stacks { sets: Stack[]; barred: [ProgrammeId, ProgrammeId][]; open: [ProgrammeId, ProgrammeId][] }

/**
 * The largest sets of lit programmes that may all share a month, by combined
 * figure, plus the lit pairs that are barred or unsettled. Only "yes" edges
 * join a set; an "open" pair keeps the two apart and is reported instead.
 * Seven programmes at most, so every subset is checked, there are 128.
 */
function buildStacks(on: Programme[]): Stacks {
  const ids = on.map((p) => p.id);
  const rate = (id: ProgrammeId) => on.find((p) => p.id === id)!.payment.rate;
  const barred: [ProgrammeId, ProgrammeId][] = [];
  const open: [ProgrammeId, ProgrammeId][] = [];
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const v = sameMonth(ids[i], ids[j]);
    if (v === "no") barred.push([ids[i], ids[j]]);
    if (v === "open") open.push([ids[i], ids[j]]);
  }
  const cliques: ProgrammeId[][] = [];
  for (let m = 1; m < 1 << ids.length; m++) {
    const set = ids.filter((_, i) => m & (1 << i));
    if (set.length < 2) continue;
    if (set.every((x, i) => set.slice(i + 1).every((y) => sameMonth(x, y) === "yes"))) cliques.push(set);
  }
  // maximal only: drop any set contained in a larger one
  const maximal = cliques.filter((c) => !cliques.some((d) => d.length > c.length && c.every((x) => d.includes(x))));
  const sets = maximal
    .map((c) => ({ ids: c, total: c.reduce((n, id) => n + rate(id), 0) }))
    .sort((x, y) => y.total - x.total)
    .slice(0, 4);
  return { sets, barred, open };
}


type Axis = { key: keyof Answers; legend: string; hint?: string; options: { v: string; label: string }[] };
const AXES: Axis[] = [
  { key: "count", legend: "Chronic conditions", options: [{ v: "any", label: "Any" }, { v: "0", label: "None" }, { v: "1", label: "One" }, { v: "2+", label: "2 or more" }] },
  { key: "device", legend: "A device at home", hint: "Readings: blood pressure, weight, oxygen. Therapy: CPAP, adherence.", options: [{ v: "any", label: "Any" }, { v: "none", label: "None" }, { v: "physiologic", label: "Readings" }, { v: "therapeutic", label: "Therapy" }] },
  { key: "behavioral", legend: "Behavioural health condition", options: [{ v: "any", label: "Any" }, { v: "yes", label: "Yes" }, { v: "no", label: "No" }] },
  { key: "discharged", legend: "Discharged in the last 30 days", options: [{ v: "any", label: "Any" }, { v: "yes", label: "Yes" }, { v: "no", label: "No" }] },
  { key: "track", legend: "ACCESS model", options: [{ v: "any", label: "Any" }, { v: "none", label: "Not enrolled" }, { v: "CKM", label: "CKM track" }, { v: "eCKM", label: "eCKM track" }, { v: "BH", label: "BH track" }, { v: "MSK", label: "MSK track" }] },
];
const TRACKS: Track[] = ["CKM", "eCKM", "BH", "MSK"];

/** The toggles read back as one sentence, so the reader can check the patient. */
function describe(a: Answers): string | null {
  const parts: string[] = [];
  if (a.count === "0") parts.push("no chronic condition");
  if (a.count === "1") parts.push("one chronic condition");
  if (a.count === "2+") parts.push("two or more chronic conditions");
  if (a.device === "none") parts.push("no device at home");
  if (a.device === "physiologic") parts.push("a device sending readings");
  if (a.device === "therapeutic") parts.push("a therapy device at home");
  if (a.behavioral === "yes") parts.push("a behavioural health condition");
  if (a.behavioral === "no") parts.push("no behavioural health condition");
  if (a.discharged === "yes") parts.push("a discharge in the last 30 days");
  if (a.discharged === "no") parts.push("no recent discharge");
  if (a.track === "none") parts.push("not enrolled in ACCESS");
  if (TRACKS.includes(a.track)) parts.push(`on the ACCESS ${a.track} track`);
  if (!parts.length) return null;
  const last = parts.pop()!;
  return `A patient with ${parts.length ? parts.join(", ") + " and " : ""}${last}.`;
}

export interface ProgrammeFilterProps { eyebrow?: string; heading?: ReactNode; body?: string; tone?: "light" | "band"; id?: string }

export function ProgrammeFilter({
  eyebrow = "Which programmes fit this patient?",
  heading = <>Describe the patient. <em>The programmes light up.</em></>,
  body = "Toggle what is true of one patient. Every programme they could be considered for stays lit; the rest step back. Leave everything on Any and this is simply all of them.",
  tone = "band",
  id = "codes",
}: ProgrammeFilterProps) {
  const reduce = useReducedMotion();
  const [a, setA] = useState<Answers>(NONE);
  const touched = Object.values(a).some((v) => v !== "any");
  const set = (k: keyof Answers, v: string) => setA((s) => ({ ...s, [k]: v as never }));

  const rows = useMemo(() => PROGRAMMES.map((p) => ({ p, on: lit(p.id, a) })), [a]);
  const accessOn = lit("access", a);
  const litCount = rows.filter((r) => r.on).length + (accessOn ? 1 : 0);
  const stacks = useMemo(() => buildStacks(rows.filter((r) => r.on).map((r) => r.p)), [rows]);
  const sentence = describe(a);

  const fade = reduce ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.5 } };

  return (
    <section id={id} className={cn("scroll-mt-24 py-20 md:py-24 px-6 md:px-16", tone === "band" ? "bg-band border-y border-rule" : "bg-paper")}>
      <div className="max-w-[1120px] mx-auto">
        <motion.div {...fade} className="max-w-[64ch] mx-auto text-center">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">{eyebrow}</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-3">{heading}</h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0">{body}</p>
        </motion.div>

        <motion.div {...fade} className="mt-10 grid gap-5 lg:grid-cols-[5fr_7fr] lg:items-start">
          {/* ── left: the patient ── */}
          <div className="rounded-card border border-rule bg-paper-bright p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-ink-mute m-0">The patient</p>
              {touched && (
                <button type="button" onClick={() => setA(NONE)} className="text-[13.5px] font-semibold text-ink underline underline-offset-4 decoration-rule hover:decoration-ink-soft">
                  Reset
                </button>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-5">
              {AXES.map((ax) => (
                <fieldset key={ax.key} className="m-0 min-w-0 border-0 p-0">
                  <legend className="text-[12px] font-bold uppercase tracking-[1.2px] text-ink-mute mb-1 px-0">{ax.legend}</legend>
                  <div role="group" className="flex flex-col">
                    {ax.options.map((o) => {
                      const on = a[ax.key] === o.v;
                      return (
                        <button
                          key={o.v}
                          type="button"
                          onClick={() => set(ax.key, o.v)}
                          aria-pressed={on}
                          className={cn(
                            "border-l-[3px] py-2.5 pl-4 text-left text-[15.5px] leading-[1.4] transition-colors sm:py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                            on ? "border-ink font-semibold text-ink" : "border-rule-soft text-ink-soft hover:border-rule-strong hover:text-ink"
                          )}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                  {ax.hint && <p className="mt-2 pl-4 text-[12.5px] leading-[1.5] text-ink-mute m-0">{ax.hint}</p>}
                </fieldset>
              ))}
            </div>

          </div>

          {/* ── right: the answer ── */}
          <div className="flex flex-col gap-5">
            <div className="rounded-card border border-rule bg-paper-bright p-5 md:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-ink-mute m-0">Programmes to consider</p>
                <p className="flex items-center gap-2 text-[13.5px] text-ink-soft m-0 tabular-nums" aria-live="polite">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-signal-amber" />
                  {touched ? <><strong className="text-ink">{litCount}</strong> of 8 lit</> : "All 8 lit"}
                </p>
              </div>
              <p className={cn("m-0 mt-2 font-serif text-[19px] leading-[1.4]", sentence ? "text-ink" : "text-ink-soft")} aria-live="polite">
                {sentence ?? "Any patient on your panel. Describe one on the left."}
              </p>
              <ul className="m-0 mt-3 p-0 list-none flex flex-col divide-y divide-rule-soft" aria-label="Programmes">
                {rows.map(({ p, on }) => (
                  <li key={p.id} data-lit={on} className={cn("transition-opacity duration-300", on ? "opacity-100" : "opacity-40")} aria-hidden={!on && touched ? true : undefined}>
                    <a href={p.path} tabIndex={on ? 0 : -1}
                      className="group grid grid-cols-[12px_66px_1fr_auto] items-center gap-x-4 py-3.5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                      <Lamp on={on} />
                      <span className={cn("font-serif text-[24px] leading-none", on ? "text-ink" : "text-ink-mute")}>{p.code}</span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium text-ink leading-[1.3] group-hover:underline underline-offset-4 decoration-rule">{p.name}</span>
                        <span className="block font-mono text-[12px] text-ink-mute mt-0.5">{p.id === "apcm" ? apcmCode(a.count) : p.payment.code}</span>
                      </span>
                      <span className="text-right">
                        <span className="block font-serif text-[20px] leading-none text-ink tabular-nums">${p.payment.rate.toFixed(2)}</span>
                        <span className="block text-[11.5px] text-ink-mute mt-1">{p.id === "tcm" ? "per discharge" : "per month"}</span>
                      </span>
                    </a>
                  </li>
                ))}
                <li data-lit={accessOn} className={cn("transition-opacity duration-300", accessOn ? "opacity-100" : "opacity-40")} aria-hidden={!accessOn && touched ? true : undefined}>
                  <a href="/programs/access-model" tabIndex={accessOn ? 0 : -1}
                    className="group grid grid-cols-[12px_66px_1fr_auto] items-center gap-x-4 py-3.5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    <Lamp on={accessOn} />
                    <span className={cn("font-serif text-[19px] leading-none", accessOn ? "text-ink" : "text-ink-mute")}>ACCESS</span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium text-ink leading-[1.3] group-hover:underline underline-offset-4 decoration-rule">CMS payment model</span>
                      <span className="block font-mono text-[12px] text-ink-mute mt-0.5">{TRACKS.includes(a.track) ? `${a.track} track` : "4 tracks"}</span>
                    </span>
                    <span className="text-right text-[12px] leading-[1.4] text-ink-soft max-w-[13ch]">Paid per track, half withheld for outcomes</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* ── can they stack? ── */}
            {stacks.sets.length > 0 && (
              <div className="rounded-card border border-rule bg-paper-bright p-5 md:p-6">
                <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-ink-mute m-0">Can they stack?</p>
                <p className="text-[13.5px] leading-[1.6] text-ink-soft m-0 mt-1">What one month can hold for the same patient, and what it adds up to.</p>
                <ul className="m-0 mt-4 p-0 list-none flex flex-col divide-y divide-rule-soft">
                  {stacks.sets.map((st) => (
                    <li key={st.ids.join("+")} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
                      <span className="flex flex-wrap items-center gap-1.5">
                        {st.ids.map((pid, i) => (
                          <span key={pid} className="flex items-center gap-1.5">
                            {i > 0 && <span aria-hidden className="text-ink-mute text-[13px]">+</span>}
                            <span className="rounded-pill bg-signal-amber/20 px-2.5 py-1 font-serif text-[16px] leading-none text-ink ring-1 ring-signal-amber/35">{CODE[pid]}</span>
                          </span>
                        ))}
                      </span>
                      <span className="flex items-baseline gap-1.5">
                        <span className="font-serif text-[24px] leading-none text-ink tabular-nums">${st.total.toFixed(2)}</span>
                        <span className="text-[12px] text-ink-mute">{st.ids.includes("tcm") ? "with a discharge" : "in one month"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-l-[3px] border-rule-strong pl-4">
                  <p className="text-[13.5px] leading-[1.6] text-ink m-0">
                    The same minutes never count twice, whichever codes the month carries.
                  </p>
                  {stacks.barred.length > 0 && (
                    <p className="text-[13.5px] leading-[1.6] text-ink-soft m-0 mt-1.5">
                      Not in the same month: {stacks.barred.map(([x, y], i) => (
                        <span key={x + y}>{i > 0 && "; "}{CODE[x]} and {CODE[y]}</span>
                      ))}.
                    </p>
                  )}
                  {stacks.open.length > 0 && (
                    <p className="text-[13.5px] leading-[1.6] text-ink-soft m-0 mt-1.5">
                      Not settled, ask your biller: {stacks.open.map(([x, y], i) => (
                        <span key={x + y}>{i > 0 && "; "}{CODE[x]} and {CODE[y]}</span>
                      ))}.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-[13px] leading-[1.65] text-ink-mute mt-6 mb-0 max-w-[76ch] mx-auto text-center">
          A lit row means a patient like this can be considered for that programme, not that they are eligible. Consent, the initiating visit, who may bill and the rest of the fine print are open questions listed on each programme page, and this cannot check them. A stack is what may be billed together, not what this patient qualifies for. {PROGRAMME_FOOTNOTE}
        </p>
      </div>
    </section>
  );
}

export default ProgrammeFilter;
