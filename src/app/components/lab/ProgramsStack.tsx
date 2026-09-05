import { useState } from "react";
import { motion } from "motion/react";
import { Check, ChevronRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

/* ── The four programs Remote runs, and their rules ──────────────────────────
 * FACT CHECK (verified 2026-08-19, sources handed to Matteo in chat):
 *  · CCM 99490 = first 20 min clinical staff time per calendar month, 2+ chronic
 *    conditions expected to last 12+ months; 99439 = each additional 20 min.
 *  · APCM = HCPCS G0556 / G0557 / G0558, new in the CY2025 PFS, NO time
 *    threshold, billed once a month, 13 service elements must be AVAILABLE.
 *    Levels: 1 or fewer chronic conditions / 2 or more / 2 or more who are
 *    Qualified Medicare Beneficiaries. Cannot be billed the same month as CCM,
 *    PCM or TCM for the same patient. Value in Primary Care MVP reporting from
 *    2026 (2025 performance year).
 *  · BHI 99484 = 20 min clinical staff time a month; CoCM 99492 / 99493 / 99494
 *    = 70 / 60 / 30 min with a care manager and psychiatric consultant.
 *  · RTM 98975-98978 = setup and device supply (16 days of data in 30);
 *    98980 = first 20 min treatment management, requires interactive
 *    communication with the patient; 98981 = each additional 20 min.
 *
 * These four are the programs Sthita's build actually ships. TCM (99495/99496,
 * interactive contact within 2 business days of discharge, face-to-face inside
 * 14 or 7 days) is the sharpest phone argument of the lot and is deliberately
 * NOT here, because there is no TCM module yet. Add the card when there is.
 *
 * COPY GUARDRAILS, enforced in every string below: HANA's call time is never
 * the billable clinical time; HANA flags against a clinician-set threshold and
 * never interprets or concludes; the device in RTM is the practice's, not
 * HANA's; HANA is never called software or a platform.
 */
export type Program = {
  code: string;
  codes: string;
  name: string;
  who: string;
  rule: string;
  hana: string[];
  team: string;
  lands: string[];
  note?: string;
};

export const PROGRAMS: Program[] = [
  {
    code: "CCM",
    codes: "99490 · 99439",
    name: "Chronic Care Management",
    who: "Two or more chronic conditions expected to last a year or longer.",
    rule: "Twenty minutes of clinical staff time a month, away from the patient, against a care plan they have consented to.",
    hana: [
      "Calls every patient on the panel at the cadence the protocol asks for, not the cadence the roster allows.",
      "Captures adherence, symptoms and the barrier behind them in the patient's own words.",
      "Writes the call back into the time log as a structured summary, so nobody types it.",
      "Flags the answers that cross a threshold your clinician set.",
    ],
    team: "Reviews the summary, adds their own work, attests. The minutes on the claim are your team's minutes.",
    lands: ["Structured call summary", "Care-plan touch", "Flag queue"],
  },
  {
    code: "APCM",
    codes: "G0556 · G0557 · G0558",
    name: "Advanced Primary Care Management",
    who: "Three levels: one condition or fewer, two or more, and two or more for Qualified Medicare Beneficiaries.",
    rule: "No time threshold at all. One bundled payment a month, with thirteen service elements that have to be available to the patient.",
    hana: [
      "Answers the elements that are pure reach: ongoing communication, the monthly contact, the follow-up after a transition.",
      "Runs across the whole panel every month, including the patients nobody had minutes left for.",
      "Logs and attributes every contact, so an element being available is documented rather than asserted.",
    ],
    team: "Owns the care plan, the round-the-clock access and every clinical judgement. HANA is the capacity behind the elements.",
    lands: ["Monthly contact record", "Consent and initiating-visit trail"],
    note: "APCM cannot be billed in the same month as CCM, PCM or TCM for the same patient, and practices billing it report the Value in Primary Care MVP from 2026.",
  },
  {
    code: "BHI",
    codes: "99484 · CoCM 99492 to 99494",
    name: "Behavioral Health Integration",
    who: "A behavioral health condition being managed inside primary care.",
    rule: "Twenty minutes of clinical staff time a month for general BHI. Collaborative care is a bigger build: a care manager, a psychiatric consultant, and seventy, sixty or thirty minutes by code.",
    hana: [
      "Makes the between-visit contact that decides whether a plan holds or quietly lapses.",
      "Administers the instrument your protocol asks for, by voice, and records the score with its date.",
      "Watches the direction of travel rather than a single answer, and calls sooner when it worsens.",
    ],
    team: "Anything that sounds like risk reaches a person live, not a queue. Diagnosis, medication and treatment stay with your clinicians.",
    lands: ["Instrument score with date", "Call summary", "Escalation record"],
  },
  {
    code: "RTM",
    codes: "98975 to 98978 · 98980 · 98981",
    name: "Remote Therapeutic Monitoring",
    who: "Patients on a therapy whose adherence and response a device already records.",
    rule: "Sixteen days of data in thirty for the supply codes, and 98980 needs a real interactive conversation with the patient inside the month.",
    hana: [
      "Makes the interactive conversation happen on schedule and writes it up the same day.",
      "Brings the number into the call: what actually happened on the nights the data dipped.",
      "Checks what it hears against the threshold a clinician set, and flags instead of concluding.",
    ],
    team: "The device is yours and reading it is yours. HANA summarises the conversation, never interprets the data, and never changes therapy.",
    lands: ["Interactive-contact record", "Patient-reported context beside the data"],
  },
];

export const PROGRAM_FOOTNOTE =
  "Programs are what your practice bills. HANA does not bill, and its call time is never counted as clinical time. Requirements here are the Medicare rules as they stand in August 2026 and are worth checking against your MAC before you rely on them.";

/* ── The programs section: a stack a clinician can scan ───────────────────── */
export function ProgramsStack() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <motion.div {...fadeUp} className="max-w-[58ch]">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Programs</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] m-0 max-w-[24ch]">
            Every program is a <em className="text-[#2563EB]">calling problem.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft mt-5 mb-0">
            CCM wants twenty minutes a month. APCM wants no minutes and a whole panel. BHI wants the
            call between the visits. Different rules, one bottleneck: somebody has to pick up the
            phone, every month, for everybody.
          </p>
        </motion.div>

        <div className="mt-12 md:mt-14 border-t border-rule">
          {PROGRAMS.map((x, i) => {
            const on = open === i;
            return (
              <motion.div
                key={x.code}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.03 + i * 0.05 }}
                className="border-b border-rule"
              >
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="w-full text-left bg-transparent border-0 py-7 flex items-center gap-6 cursor-pointer group"
                >
                  <span
                    className={`shrink-0 font-serif text-[22px] leading-none w-[76px] transition-colors ${
                      on ? "text-[#2563EB]" : "text-[#0A1633]"
                    }`}
                  >
                    {x.code}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[16.5px] font-semibold text-[#0A1633]">{x.name}</span>
                    <span className="block text-[14px] leading-[1.6] text-ink-mute mt-1 max-w-[62ch]">
                      {x.who}
                    </span>
                  </span>
                  <span className="hidden md:block shrink-0 text-[12.5px] tabular-nums text-ink-mute w-[190px] text-right">
                    {x.codes}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full grid place-items-center transition-colors ${
                      on ? "bg-[#0A1633] text-white" : "bg-paper-2 text-[#0A1633] group-hover:bg-rule-soft"
                    }`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ${on ? "rotate-90" : ""}`}
                      strokeWidth={2.4}
                    />
                  </span>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-[400ms] ease-out"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="pb-9 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:pl-[100px]">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-ink-mute m-0">
                          What the month requires
                        </p>
                        <p className="text-[14.5px] leading-[1.7] text-ink-soft mt-2.5 mb-0">{x.rule}</p>

                        <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-ink-mute mt-7 mb-0">
                          Where your team stays
                        </p>
                        <p className="text-[14.5px] leading-[1.7] text-[#0A1633] mt-2.5 mb-0">{x.team}</p>

                        {x.note && (
                          <p className="text-[13px] leading-[1.6] text-ink-soft mt-6 mb-0 pl-4 border-l-2 border-[#E8A06A]">
                            {x.note}
                          </p>
                        )}
                      </div>

                      <div className="rounded-[18px] bg-[#F7F9FC] border border-rule p-6">
                        <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#2563EB] m-0">
                          What HANA does in it
                        </p>
                        <ul className="list-none p-0 mt-3.5 mb-0 space-y-3">
                          {x.hana.map((h) => (
                            <li key={h} className="flex gap-3">
                              <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-1" strokeWidth={2.8} />
                              <span className="text-[14.5px] leading-[1.6] text-ink-soft">{h}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-rule">
                          {x.lands.map((l) => (
                            <span
                              key={l}
                              className="rounded-full bg-paper-bright border border-rule text-ink-soft text-[12px] font-semibold px-3 py-1"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p {...fadeUp} className="text-[13px] leading-[1.7] text-ink-soft mt-8 mb-0 max-w-[86ch]">
          {PROGRAM_FOOTNOTE}
        </motion.p>
      </div>
    </section>
  );
}
