import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import {
  RATE_CAVEATS,
  afterSequestration,
  medicareShare,
  patientShare,
  type Programme,
} from "../../../content/programmes/index";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * PayVisual — what the base code pays, as a picture with one number in it.
 *
 * REPLACES <CodeTable compact> on the programme pages. That rendered a 1,692px
 * section: a five-row table with prose in every cell, then SIX equal-weight
 * caveat paragraphs, then a disclosure, then a footnote. Every caveat is true
 * and every one belongs on the page. None of them belongs at the same visual
 * weight as the figure they qualify. Matteo, 7 Sept 2026: "too much text."
 *
 * THE SHAPE
 *   1. ONE NUMBER, large. The base code, CY2026 national non-facility.
 *   2. ONE BAR. The same dollar split into what Medicare pays and what the
 *      patient owes, because the coinsurance is the caveat that actually
 *      changes a practice's decision (it is a known enrollment obstacle), and
 *      a 80/20 bar says it in the time a paragraph takes to start.
 *   3. ONE SMALLER NUMBER. After sequestration, because that is the one a
 *      biller will ask about first.
 *   4. THE FAMILY AS CHIPS. Add-on and sibling codes with their amounts, one
 *      line each. A code without a sourced amount prints "not sourced" -- never
 *      a zero, which would read as "pays nothing".
 *   5. THE CAVEATS, COLLAPSED. All six, verbatim from RATE_CAVEATS, behind one
 *      disclosure that says how many there are. They are a click away, not a
 *      screen away, and the honesty is intact: nothing was cut, it was folded.
 *
 * EVERY FIGURE IS DERIVED, NOT TYPED. The split and the sequestration figure
 * come from medicareShare / patientShare / afterSequestration in the content
 * module, off the same `rate` the table used, so the day a rate is revised in
 * rates.ts this section is right without being touched.
 *
 * WHAT IT MUST NOT DO: present the big number as "what you get paid". The line
 * under it says national, before adjustment, not what you collect -- in words,
 * beside the figure, at readable size. Folding the caveats does not license
 * dropping that sentence.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface PayVisualProps {
  data: Programme;
  heading?: ReactNode;
  tone?: "light" | "band";
  id?: string;
}

const usd = (n: number) => `$${n.toFixed(2)}`;

export function PayVisual({ data, heading, tone = "band", id = "pays" }: PayVisualProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rate = data.payment.rate;
  const medicare = medicareShare(rate);
  const patient = patientShare(rate);
  const net = afterSequestration(rate);
  const medicarePct = Math.round((medicare / rate) * 100);

  const fade = reduce
    ? {}
    : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.5 } };

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-20 md:py-24 px-6 md:px-16", tone === "band" ? "bg-band border-y border-rule" : "bg-paper")}
    >
      <div className="max-w-[1120px] mx-auto">
        <motion.div {...fade} className="max-w-[62ch]">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">What it pays</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-3">
            {heading ?? <>What <em>{data.code}</em> pays.</>}
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0">
            One base code, one patient, one month. National, before adjustment. Not what you collect.
          </p>
        </motion.div>

        <motion.div {...fade} className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          {/* ── the number and the bar ── */}
          <div className="rounded-card border border-rule bg-paper-bright p-7 md:p-9 shadow-card">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="font-mono text-[14px] font-semibold text-ink-mute tabular-nums">{data.payment.code}</span>
              <span className="text-[13px] text-ink-mute">{data.payment.year} · national non-facility</span>
            </div>
            <p className="font-serif font-normal leading-none text-ink tabular-nums text-[64px] sm:text-[76px] md:text-display m-0 mt-4">
              {usd(rate)}
            </p>
            <p className="text-[15px] leading-[1.6] text-ink-soft m-0 mt-3 max-w-[46ch]">{data.payment.basis}</p>

            {/* the split */}
            <div className="mt-8">
              <div className="flex h-3 w-full overflow-hidden rounded-pill bg-rule-soft" role="img"
                aria-label={`About ${medicarePct} percent from Medicare, ${100 - medicarePct} percent patient coinsurance`}>
                <motion.span
                  className="h-full bg-brand"
                  initial={reduce ? { width: `${medicarePct}%` } : { width: 0 }}
                  whileInView={{ width: `${medicarePct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="h-full flex-1 bg-signal-amber/70" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[1px] text-ink-mute m-0">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-brand" /> Medicare pays
                  </p>
                  <p className="font-serif text-[26px] leading-none text-ink tabular-nums m-0 mt-1.5">{usd(medicare)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[1px] text-ink-mute m-0">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-signal-amber/70" /> Patient owes
                  </p>
                  <p className="font-serif text-[26px] leading-none text-ink tabular-nums m-0 mt-1.5">{usd(patient)}</p>
                  <p className="text-[12.5px] leading-[1.5] text-ink-soft m-0 mt-1">
                    Part B coinsurance. A known enrollment obstacle.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-rule-soft flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[13px] text-ink-mute">After the 2% sequestration, the practice nets about</span>
              <span className="font-serif text-[22px] leading-none text-ink tabular-nums">{usd(net)}</span>
            </div>
          </div>

          {/* ── the family ── */}
          <div className="rounded-card border border-rule bg-paper-bright p-7 md:p-8">
            <p className="text-eyebrow font-bold uppercase text-ink-mute m-0">The code family</p>
            <p className="text-[14.5px] leading-[1.6] text-ink-soft m-0 mt-2">
              What else the same patient's month can carry. Same basis as the figure.
            </p>
            <ul className="m-0 mt-5 p-0 list-none divide-y divide-rule-soft">
              <li className="flex items-baseline justify-between gap-4 py-3">
                <span className="min-w-0">
                  <span className="font-mono text-[14px] font-semibold text-ink tabular-nums">{data.payment.code}</span>
                  <span className="block text-[13px] leading-[1.5] text-ink-soft mt-0.5">The base code on this page.</span>
                </span>
                <span className="font-serif text-[20px] leading-none text-ink tabular-nums shrink-0">{usd(rate)}</span>
              </li>
              {data.alsoBillable?.map((rc) => (
                <li key={rc.code} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="font-mono text-[14px] font-semibold text-ink tabular-nums">{rc.code}</span>
                    <span className="block text-[13px] leading-[1.5] text-ink-soft mt-0.5">{rc.what}</span>
                    {rc.caveat && <span className="block text-[12px] leading-[1.5] text-ink-mute mt-1">{rc.caveat}</span>}
                  </span>
                  {rc.rate === undefined ? (
                    <span className="text-[12.5px] text-ink-mute shrink-0">not sourced</span>
                  ) : (
                    <span className="font-serif text-[20px] leading-none text-ink tabular-nums shrink-0">{usd(rc.rate)}</span>
                  )}
                </li>
              ))}
            </ul>
            {data.note && (
              <p className="mt-5 flex gap-3 rounded-tile border border-rule bg-paper-2 p-4 text-[13.5px] leading-[1.6] text-ink m-0">
                <span aria-hidden className="mt-0.5 h-4 w-1 shrink-0 rounded-pill bg-signal-amber" />
                <span>{data.note}</span>
              </p>
            )}
          </div>
        </motion.div>

        {/* ── the caveats, folded, all of them ── */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={`${id}-caveats`}
            className="flex w-full items-center justify-between gap-4 rounded-tile border border-rule bg-paper-bright px-5 py-4 text-left hover:border-rule-strong transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span className="text-[15px] font-semibold text-ink">
              How to read this figure · {RATE_CAVEATS.length} things that change it
            </span>
            <ChevronDown size={18} className={cn("shrink-0 text-ink-soft transition-transform", open && "rotate-180")} aria-hidden />
          </button>
          {open && (
            <div id={`${id}-caveats`} className="mt-3 grid gap-x-10 gap-y-5 md:grid-cols-2 rounded-tile border border-rule bg-paper-bright p-6">
              {RATE_CAVEATS.map((c) => (
                <div key={c.id}>
                  <p className="text-[12.5px] font-bold uppercase tracking-[1px] text-ink m-0">{c.label}</p>
                  <p className="text-[14px] leading-[1.6] text-ink-soft m-0 mt-1.5">{c.body}</p>
                </div>
              ))}
              <p className="md:col-span-2 text-[12.5px] leading-[1.6] text-ink-mute m-0 pt-3 border-t border-rule-soft">
                Source: {data.payment.source}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PayVisual;
