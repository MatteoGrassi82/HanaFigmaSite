import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PROGRAMMES, PROGRAMME_FOOTNOTE, type Programme, type ProgrammeId } from "../../../content/programmes/index";
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
 * footnote says so in those words. The one concurrency rule the site DOES hold
 * (APCM excludes CCM, PCM and TCM in the same month, from data.note) is shown
 * when it applies, and nothing else is guessed at.
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

  // the one concurrency rule the site holds, surfaced only when it bites
  const apcm = rows.find((r) => r.p.id === "apcm")?.on;
  const clash = apcm && rows.some((r) => r.on && (r.p.id === "ccm" || r.p.id === "pcm" || r.p.id === "tcm"));

  const fade = reduce ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.5 } };

  return (
    <section id={id} className={cn("scroll-mt-24 py-20 md:py-24 px-6 md:px-16", tone === "band" ? "bg-band border-y border-rule" : "bg-paper")}>
      <div className="max-w-[1120px] mx-auto">
        <motion.div {...fade} className="max-w-[64ch]">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">{eyebrow}</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-3">{heading}</h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0">{body}</p>
        </motion.div>

        {/* ── the toggles ── */}
        <motion.div {...fade} className="mt-9 grid gap-4 rounded-card border border-rule bg-paper-bright p-5 md:p-6 md:grid-cols-2 lg:grid-cols-3">
          {AXES.map((ax) => (
            <fieldset key={ax.key} className="m-0 min-w-0 border-0 p-0">
              <legend className="text-[12px] font-bold uppercase tracking-[1.2px] text-ink-mute mb-2 px-0">{ax.legend}</legend>
              <div className="flex flex-wrap gap-1.5">
                {ax.options.map((o) => {
                  const on = a[ax.key] === o.v;
                  return (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => set(ax.key, o.v)}
                      aria-pressed={on}
                      className={cn(
                        "rounded-pill border px-3 py-1.5 text-[13.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
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

        {clash && (
          <p className="mt-4 flex gap-3 rounded-tile border border-rule bg-paper-bright p-4 text-[13.5px] leading-[1.6] text-ink m-0 max-w-[76ch]">
            <span aria-hidden className="mt-0.5 h-4 w-1 shrink-0 rounded-pill bg-signal-amber" />
            <span>APCM cannot be billed in the same month as CCM, PCM or TCM for the same patient. A patient who lights both is one or the other in a given month, not both.</span>
          </p>
        )}

        <p className="text-[13px] leading-[1.65] text-ink-mute mt-5 mb-0 max-w-[76ch]">
          A lit card means a patient like this can be considered for that programme, not that they are eligible. Consent, the initiating visit, who may bill and the other concurrency rules are open questions listed on each programme page, and this cannot check them. {PROGRAMME_FOOTNOTE}
        </p>
      </div>
    </section>
  );
}

export default ProgrammeFilter;
