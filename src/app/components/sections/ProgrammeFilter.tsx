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

const AXES: { key: keyof Answers; legend: string; options: { v: string; label: string }[] }[] = [
  { key: "count", legend: "Chronic conditions", options: [{ v: "any", label: "Any" }, { v: "0", label: "None" }, { v: "1", label: "One" }, { v: "2+", label: "Two or more" }] },
  { key: "device", legend: "A device at home", options: [{ v: "any", label: "Any" }, { v: "none", label: "No device" }, { v: "physiologic", label: "Readings: BP, weight, O₂" }, { v: "therapeutic", label: "Therapy: CPAP, adherence" }] },
  { key: "behavioral", legend: "Behavioural health condition", options: [{ v: "any", label: "Any" }, { v: "yes", label: "Yes" }, { v: "no", label: "No" }] },
  { key: "discharged", legend: "Discharged in the last 30 days", options: [{ v: "any", label: "Any" }, { v: "yes", label: "Yes" }, { v: "no", label: "No" }] },
  { key: "track", legend: "ACCESS model track", options: [{ v: "any", label: "Any" }, { v: "none", label: "Not enrolled" }, { v: "CKM", label: "CKM" }, { v: "eCKM", label: "eCKM" }, { v: "BH", label: "BH" }, { v: "MSK", label: "MSK" }] },
];

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

  const fade = reduce ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.5 } };

  return (
    <section id={id} className={cn("scroll-mt-24 py-20 md:py-24 px-6 md:px-16", tone === "band" ? "bg-band border-y border-rule" : "bg-paper")}>
      <div className="max-w-[1120px] mx-auto">
        <motion.div {...fade} className="max-w-[64ch] mx-auto text-center">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">{eyebrow}</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-3">{heading}</h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0">{body}</p>
        </motion.div>

        {/* ── the toggles ── */}
        <motion.div {...fade} className="mt-9 grid gap-4 rounded-card border border-rule bg-paper-bright p-5 md:p-6 md:grid-cols-2 lg:grid-cols-3">
          {AXES.map((ax) => (
            <fieldset key={ax.key} className="m-0 min-w-0 border-0 p-0">
              <legend className="text-[12px] font-bold uppercase tracking-[1.2px] text-ink-mute mb-2.5 px-0">{ax.legend}</legend>
              <div className="flex flex-wrap gap-2">
                {ax.options.map((o) => {
                  const on = a[ax.key] === o.v;
                  return (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => set(ax.key, o.v)}
                      aria-pressed={on}
                      className={cn(
                        "rounded-pill border px-4 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                        on ? "border-brand bg-brand text-white" : "border-rule bg-paper-bright text-ink hover:border-rule-strong"
                      )}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <div className="flex items-end justify-between gap-3 md:col-span-2 lg:col-span-3 pt-2 border-t border-rule-soft">
            <p className="text-[13.5px] text-ink-soft m-0" aria-live="polite">
              {touched ? <><strong className="text-ink">{litCount}</strong> of 8 fit a patient like this.</> : "All 8 shown. Toggle anything to narrow."}
            </p>
            {touched && (
              <button type="button" onClick={() => setA(NONE)} className="text-[13.5px] font-semibold text-ink underline underline-offset-4 decoration-rule hover:decoration-ink-soft">
                Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* ── the cards ── */}
        <ul className="m-0 mt-6 p-0 list-none grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Programmes">
          {rows.map(({ p, on }) => (
            <li key={p.id} data-lit={on} className={cn("transition-opacity duration-300", on ? "opacity-100" : "opacity-35")} aria-hidden={!on && touched ? true : undefined}>
              <a
                href={p.path}
                tabIndex={on ? 0 : -1}
                className={cn(
                  "group flex h-full flex-col rounded-card border bg-paper-bright p-5 no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  on ? "border-rule hover:border-rule-strong" : "border-rule-soft"
                )}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-serif text-[24px] leading-none text-ink">{p.code}</span>
                  <span className="font-mono text-[12px] text-ink-mute tabular-nums">{p.id === "apcm" ? apcmCode(a.count) : p.payment.code}</span>
                </span>
                <span className="mt-1.5 text-[14px] font-medium text-ink-soft leading-[1.35]">{p.name}</span>
                <span className="mt-4 flex items-baseline gap-1.5 border-t border-rule-soft pt-3">
                  <span className="font-serif text-[20px] leading-none text-ink tabular-nums">${p.payment.rate.toFixed(2)}</span>
                  <span className="text-[11.5px] text-ink-mute">{p.id === "tcm" ? "per discharge" : "per month"}</span>
                </span>
              </a>
            </li>
          ))}
          {/* ACCESS, in its own shape */}
          <li data-lit={accessOn} className={cn("transition-opacity duration-300", accessOn ? "opacity-100" : "opacity-35")} aria-hidden={!accessOn && touched ? true : undefined}>
            <a
              href="/programs/access-model"
              tabIndex={accessOn ? 0 : -1}
              className={cn(
                "group flex h-full flex-col rounded-card border bg-paper-2 p-5 no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                accessOn ? "border-rule hover:border-rule-strong" : "border-rule-soft"
              )}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-[24px] leading-none text-ink">ACCESS</span>
                <span className="font-mono text-[12px] text-ink-mute">{a.track !== "any" && a.track !== "none" ? a.track : "4 tracks"}</span>
              </span>
              <span className="mt-1.5 text-[14px] font-medium text-ink-soft leading-[1.35]">CMS payment model</span>
              <span className="mt-4 flex items-baseline gap-1.5 border-t border-rule-soft pt-3">
                <span className="text-[13px] leading-[1.4] text-ink-soft">Paid per track, half withheld until outcomes are in</span>
              </span>
            </a>
          </li>
        </ul>

        {/* ── can they stack? ── */}
        {stacks.sets.length > 0 && (
          <div className="mt-6 rounded-card border border-rule bg-paper-bright p-5 md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-ink-mute m-0">Can they stack?</p>
              <p className="text-[13px] text-ink-mute m-0">Same patient, same month. The same minutes never count twice.</p>
            </div>
            <ul className="m-0 mt-4 p-0 list-none grid gap-3 md:grid-cols-2">
              {stacks.sets.map((st) => (
                <li key={st.ids.join("+")} className="flex flex-col gap-3 rounded-tile border border-rule-soft bg-paper p-4">
                  <span className="flex flex-wrap items-center gap-1.5">
                    {st.ids.map((id, i) => (
                      <span key={id} className="flex items-center gap-1.5">
                        {i > 0 && <span aria-hidden className="text-ink-mute text-[13px]">+</span>}
                        <span className="rounded-pill bg-brand-soft/40 px-2.5 py-1 font-serif text-[16px] leading-none text-ink">{CODE[id]}</span>
                      </span>
                    ))}
                  </span>
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-serif text-[26px] leading-none text-ink tabular-nums">${st.total.toFixed(2)}</span>
                    <span className="text-[12px] text-ink-mute">{st.ids.includes("tcm") ? "in a month with a discharge" : "in one month"}</span>
                  </span>
                </li>
              ))}
            </ul>
            {(stacks.barred.length > 0 || stacks.open.length > 0) && (
              <ul className="m-0 mt-4 p-0 list-none flex flex-wrap gap-x-5 gap-y-1.5 text-[13.5px] leading-[1.6]">
                {stacks.barred.map(([x, y]) => (
                  <li key={x + y} className="flex items-center gap-2 text-ink">
                    <span aria-hidden className="h-3.5 w-1 shrink-0 rounded-pill bg-signal-amber" />
                    {CODE[x]} and {CODE[y]}: not the same month
                  </li>
                ))}
                {stacks.open.map(([x, y]) => (
                  <li key={x + y} className="flex items-center gap-2 text-ink-soft">
                    <span aria-hidden className="h-3.5 w-1 shrink-0 rounded-pill bg-rule-strong" />
                    {CODE[x]} and {CODE[y]}: not settled, ask your biller
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="text-[13px] leading-[1.65] text-ink-mute mt-5 mb-0 max-w-[76ch] mx-auto text-center">
          A lit card means a patient like this can be considered for that programme, not that they are eligible. Consent, the initiating visit, who may bill and the rest of the fine print are open questions listed on each programme page, and this cannot check them. A stack is what may be billed together, not what this patient qualifies for. {PROGRAMME_FOOTNOTE}
        </p>
      </div>
    </section>
  );
}

export default ProgrammeFilter;
