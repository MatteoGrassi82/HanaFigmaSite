import React, { useCallback, useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Arithmetic, BigStat, Note, Panel, useUrlState } from "./kit";
import type { ArithmeticPart } from "./kit";
import { MARKET } from "./rates";
import { PROGRAMS, PROGRAM_FOOTNOTE } from "../ProgramsStack";
import type { Program } from "../ProgramsStack";
import { cn } from "../../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * ProgrammeChooser — which program is this patient?
 *
 * WHERE EVERY RULE IN HERE COMES FROM
 * Nothing is invented. The four programs, their codes, their eligibility rule
 * (`who`), their requirement (`rule`), what your team keeps (`team`) and the
 * APCM billing conflict (`note`) are read straight off PROGRAMS in
 * ../ProgramsStack, which carries its own fact check dated 2026-08-19. The only
 * things added here are the branches, and each branch is a distinction that
 * data already draws:
 *
 *   CCM   'who' says two or more chronic conditions, so one or fewer is out.
 *         'rule' says twenty minutes of clinical staff time a month, and the
 *         code pair 99490 / 99439 is first twenty then each further twenty.
 *   APCM  'rule' says no time threshold at all, which is the whole reason the
 *         minute question routes here. 'who' names three levels in the same
 *         order as the codes: G0556 one condition or fewer, G0557 two or more,
 *         G0558 two or more who are Qualified Medicare Beneficiaries.
 *   BHI   'rule' splits general integration (99484, twenty minutes a month)
 *         from collaborative care, which needs a care manager and a psychiatric
 *         consultant. That staffing question is the branch.
 *   RTM   'rule' says sixteen days of data in thirty for the supply codes, and
 *         98980 needs a real interactive conversation inside the month. Two
 *         conditions, so two questions.
 *
 * WHERE IT STOPS
 * Two branches stop short, on purpose. Collaborative care names all three of its
 * codes and no single one, because they split on minutes and PROGRAMS does not
 * say which code carries which. A short RTM month gets no code at all, because
 * nothing we hold says what a broken data window leaves you. Both say so, in
 * those words, and send you to the requirement and to your MAC. A chooser that
 * always has an answer is a chooser you cannot trust with the ones it does have.
 *
 * PRERENDER
 * The default is two or more chronic conditions, minutes in the month, twenty
 * is where it lands. That renders CCM 99490 with its requirement on first paint,
 * before any effect runs, which is what the headless snapshot indexes.
 * ─────────────────────────────────────────────────────────────────────────── */

/* ── The two figures that are not HANA's ───────────────────────────────────
 * The same cleared third-party market figures EligibilityGap.tsx argues from,
 * for the Medicare fee-for-service population, attributed on screen in the Note
 * below in the same words that component uses. They are not HANA's data and not
 * a measurement of anybody's panel. They are the reason the default lands on two
 * or more chronic conditions: that is the common case, and the gap between
 * eligible and enrolled is the whole problem.
 */
const REACH = {
  eligible: `${MARKET.eligiblePct}%`,
  receiving: `${MARKET.receivingPctOfEligible}%`,
  source: `Medicare fee-for-service, ${MARKET.dataYear}. Third-party figures describing the Medicare population, not HANA's data and not a measurement of your practice. Source: ${MARKET.citation}`,
};

const BY_CODE = Object.fromEntries(PROGRAMS.map((p) => [p.code, p])) as Record<
  "CCM" | "APCM" | "BHI" | "RTM",
  Program
>;

/* ── Choice ────────────────────────────────────────────────────────────────
 * The kit has no primitive for picking one of a set, so this is composed here
 * rather than added to kit.tsx (noted in the handoff). It is deliberately the
 * same object as Dial's preset tap-targets: same 52px floor, same rounded-tile,
 * same brand-tint selected state. Rule 6 asks for tap-targets beside every
 * slider; a categorical question has no slider, so the tap-targets are the
 * whole control and there is nothing to hide at any width.
 *
 * Semantics are a real radiogroup with roving tabindex, so arrow keys move the
 * answer the way they would in a native radio set.
 */
interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  note?: string;
}

interface ChoiceProps<T extends string> {
  label: string;
  /** The small ordinal beside the question. A marker, not a progress bar. */
  step?: string;
  value: T;
  onChange: (next: T) => void;
  options: ChoiceOption<T>[];
  /** "pair" keeps two options side by side at every width. "stack" breaks on small. */
  layout?: "pair" | "stack";
  describedBy?: string;
  className?: string;
}

function Choice<T extends string>({
  label,
  step,
  value,
  onChange,
  options,
  layout = "pair",
  describedBy,
  className,
}: ChoiceProps<T>) {
  const labelId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = options.findIndex((o) => o.value === value);
  const focusIndex = selected >= 0 ? selected : 0;

  const move = useCallback(
    (to: number) => {
      const next = ((to % options.length) + options.length) % options.length;
      onChange(options[next].value);
      refs.current[next]?.focus();
    },
    [onChange, options]
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        move(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        move(index - 1);
        break;
      case "Home":
        event.preventDefault();
        move(0);
        break;
      case "End":
        event.preventDefault();
        move(options.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn(className)}>
      <div className="flex items-baseline gap-3">
        {step && (
          <span className="shrink-0 text-[11.5px] font-bold tracking-[1.4px] text-ink-mute tabular-nums">
            {step}
          </span>
        )}
        <p id={labelId} className="text-[13.5px] font-semibold leading-[1.45] text-ink m-0">
          {label}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        className={cn(
          "grid gap-2 mt-3.5",
          layout === "stack" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"
        )}
      >
        {options.map((option, index) => {
          const on = option.value === value;
          return (
            <button
              key={option.value}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={index === focusIndex ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "min-h-[52px] px-3 py-2.5 rounded-tile border text-left cursor-pointer transition-colors",
                on ? "border-brand bg-brand-tint" : "border-rule bg-paper hover:border-brand-soft"
              )}
            >
              <span
                className={cn(
                  "block text-[14px] font-semibold leading-[1.3]",
                  on ? "text-brand" : "text-navy"
                )}
              >
                {option.label}
              </span>
              {option.note && (
                <span className="block text-[11.5px] leading-[1.35] text-ink-soft mt-1">
                  {option.note}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── The questions ─────────────────────────────────────────────────────── */

type PictureId = "chronic2" | "chronic1" | "behavioral" | "device";
type YesNo = "yes" | "no";

interface Question {
  label: string;
  options: ChoiceOption<YesNo>[];
}

const PICTURES: ChoiceOption<PictureId>[] = [
  {
    value: "chronic2",
    label: "Two or more chronic conditions",
    note: "Expected to last a year or longer.",
  },
  {
    value: "chronic1",
    label: "One chronic condition, or none",
    note: "Still on the panel, still needs contact.",
  },
  {
    value: "behavioral",
    label: "A behavioral health condition",
    note: "Being managed inside primary care.",
  },
  {
    value: "device",
    label: "On a therapy a device records",
    note: "Adherence and response already land as data.",
  },
];

/** The minute question. Same wording for both chronic branches, because it is
 *  the same rule being tested: CCM asks for twenty minutes, APCM asks for none. */
const MINUTES: Question = {
  label: "Is there twenty minutes of clinical staff time in the month?",
  options: [
    {
      value: "yes",
      label: "Yes, the minutes are there",
      note: "Away from the patient, against a care plan they consented to.",
    },
    {
      value: "no",
      label: "No, not every month",
      note: "The minutes are the thing that keeps slipping.",
    },
  ],
};

const MONTH_QUESTION: Record<PictureId, Question> = {
  chronic2: MINUTES,
  chronic1: MINUTES,
  behavioral: {
    label: "Is there a care manager and a psychiatric consultant on this patient?",
    options: [
      { value: "yes", label: "Yes, both", note: "That is the collaborative care build." },
      {
        value: "no",
        label: "No, it stays with primary care",
        note: "General behavioral health integration.",
      },
    ],
  },
  device: {
    label: "Is the device sending sixteen days of data in thirty?",
    options: [
      { value: "yes", label: "Yes, the window holds", note: "What the supply codes ask for." },
      { value: "no", label: "No, the month is short", note: "The window breaks quietly." },
    ],
  },
};

/** The third question exists only where PROGRAMS draws a third distinction. */
function levelQuestion(picture: PictureId, month: YesNo): Question | null {
  if (picture === "chronic2" && month === "yes") {
    return {
      label: "Does the month run past twenty minutes?",
      options: [
        {
          value: "yes",
          label: "Yes, it runs over",
          note: "Each further twenty minutes has its own code.",
        },
        {
          value: "no",
          label: "No, twenty is where it lands",
          note: "The first twenty minutes only.",
        },
      ],
    };
  }
  if (picture === "chronic2" && month === "no") {
    return {
      label: "Is the patient a Qualified Medicare Beneficiary?",
      options: [
        { value: "yes", label: "Yes", note: "The third level of the bundle." },
        { value: "no", label: "No", note: "The two-or-more level." },
      ],
    };
  }
  if (picture === "device" && month === "yes") {
    return {
      label: "Does a real conversation with the patient happen inside the month?",
      options: [
        {
          value: "yes",
          label: "Yes, and it gets written up",
          note: "Treatment management sits on top of supply.",
        },
        { value: "no", label: "No, it is data only", note: "Setup and supply on their own." },
      ],
    };
  }
  return null;
}

/** What fills the third slot when there is no third question. Say why, plainly. */
function levelAside(picture: PictureId, month: YesNo): string {
  if (picture === "chronic1") {
    return "No third question here. The Qualified Medicare Beneficiary level starts at two or more conditions, so this patient sits at the entry level of the bundle.";
  }
  if (picture === "behavioral" && month === "yes") {
    return "No third question here. The three collaborative care codes split on minutes, and we do not map minutes to codes for you.";
  }
  if (picture === "behavioral") {
    return "No third question here. General behavioral health integration is one code against one monthly threshold.";
  }
  return "No third question here. The data window is short, so the codes are not settled and we will not guess at them.";
}

/* ── The answer ────────────────────────────────────────────────────────── */

interface Outcome {
  program: Program;
  /** Null when this branch is genuinely not settled by the rules we hold. */
  codes: string[] | null;
  /** One line naming what those codes are. */
  level?: string;
  /** The working, shown under the answer. */
  trail: ArithmeticPart[];
  /** Where this chooser stops. Rendered whenever it is set. */
  caveat?: string;
}

function decide(picture: PictureId, month: YesNo, level: YesNo): Outcome {
  if (picture === "chronic2") {
    if (month === "yes") {
      const over = level === "yes";
      return {
        program: BY_CODE.CCM,
        codes: over ? ["99490", "99439"] : ["99490"],
        level: over
          ? "The first twenty minutes, then each further twenty."
          : "The first twenty minutes of the month.",
        trail: [
          { value: "2+", label: "chronic conditions" },
          { value: "20 min", label: "of clinical staff time" },
          ...(over ? [{ value: "each further 20 min" }] : []),
        ],
      };
    }
    const qmb = level === "yes";
    return {
      program: BY_CODE.APCM,
      codes: qmb ? ["G0558"] : ["G0557"],
      level: qmb
        ? "Two or more conditions, Qualified Medicare Beneficiary."
        : "Two or more conditions.",
      trail: [
        { value: "2+", label: "chronic conditions" },
        { value: "no 20 min", label: "in the month" },
        ...(qmb ? [{ value: "QMB" }] : []),
      ],
    };
  }

  if (picture === "chronic1") {
    return {
      program: BY_CODE.APCM,
      codes: ["G0556"],
      level: "One condition or fewer.",
      trail: [
        { value: "1 or fewer", label: "chronic conditions" },
        { value: month === "yes" ? "20 min" : "no 20 min", label: "in the month" },
      ],
      caveat:
        month === "yes"
          ? "Twenty minutes does not change this one. CCM asks for two or more chronic conditions, so the minutes have nowhere to land."
          : "Nothing here waits on a minute threshold. The bundle is paid once a month, and the work is reach.",
    };
  }

  if (picture === "behavioral") {
    if (month === "yes") {
      return {
        program: BY_CODE.BHI,
        codes: ["99492", "99493", "99494"],
        level: "Collaborative care. Seventy, sixty or thirty minutes, by code.",
        trail: [
          { value: "1", label: "behavioral health condition" },
          { value: "care manager" },
          { value: "psychiatric consultant" },
        ],
        caveat:
          "Which of the three a month lands on is a minutes question, and this chooser does not answer it. Read the requirement, then confirm it against your MAC.",
      };
    }
    return {
      program: BY_CODE.BHI,
      codes: ["99484"],
      level: "General behavioral health integration.",
      trail: [
        { value: "1", label: "behavioral health condition" },
        { value: "no", label: "care manager or psychiatric consultant" },
      ],
    };
  }

  if (month === "yes") {
    const talked = level === "yes";
    return {
      program: BY_CODE.RTM,
      codes: talked ? ["98975 to 98978", "98980"] : ["98975 to 98978"],
      level: talked
        ? "Setup and supply, plus the first twenty minutes of treatment management. 98981 covers each further twenty."
        : "Setup and supply.",
      trail: [
        { value: "16 days", label: "of data in thirty" },
        { value: talked ? "1" : "no", label: "interactive conversation" },
      ],
    };
  }

  return {
    program: BY_CODE.RTM,
    codes: null,
    trail: [{ value: "under 16 days", label: "of data in thirty" }],
    caveat:
      "The supply codes ask for sixteen days of data in thirty, and this month is short. What a short month leaves you is not something this chooser settles. Read the requirement, then confirm it against your MAC.",
  };
}

/* ── Codecs. A stranger's URL cannot put a program on this page. ─────────── */

const PICTURE_IDS = PICTURES.map((p) => p.value);

function parsePicture(raw: string): PictureId | null {
  return (PICTURE_IDS as string[]).includes(raw) ? (raw as PictureId) : null;
}

function parseYesNo(raw: string): YesNo | null {
  return raw === "yes" || raw === "no" ? raw : null;
}

const DEFAULT_PICTURE: PictureId = "chronic2";
const DEFAULT_MONTH: YesNo = "yes";
const DEFAULT_LEVEL: YesNo = "no";

/* ── The section ───────────────────────────────────────────────────────── */

export interface ProgrammeChooserProps {
  className?: string;
  /**
   * Where the full program rules live, for the branches this chooser does not
   * settle. Left unset there is no link, because only the page that mounts this
   * knows whether the program detail is above it, below it or somewhere else.
   */
  programsHref?: string;
}

export function ProgrammeChooser({ className, programsHref }: ProgrammeChooserProps) {
  const reduce = useReducedMotion();
  const answerId = useId();

  const [picture, setPictureState] = useUrlState<PictureId>("who", DEFAULT_PICTURE, {
    parse: parsePicture,
  });
  const [month, setMonthState] = useUrlState<YesNo>("month", DEFAULT_MONTH, { parse: parseYesNo });
  const [level, setLevel] = useUrlState<YesNo>("level", DEFAULT_LEVEL, { parse: parseYesNo });

  // Changing the patient changes what the next two questions mean, so the
  // answers to them go back to their defaults rather than carrying a "yes"
  // across from a question that asked something else entirely.
  const setPicture = (next: PictureId) => {
    setPictureState(next);
    setMonthState(DEFAULT_MONTH);
    setLevel(DEFAULT_LEVEL);
  };

  // Same reason, one level down. For two or more chronic conditions the month
  // answer decides WHICH third question gets asked: "does it run past twenty
  // minutes" when the minutes are there, "is the patient a Qualified Medicare
  // Beneficiary" when they are not. Carrying a "yes" across those two would put
  // G0558 on screen off the back of an answer nobody gave.
  const setMonth = (next: YesNo) => {
    setMonthState(next);
    setLevel(DEFAULT_LEVEL);
  };

  const monthQuestion = MONTH_QUESTION[picture];
  const third = levelQuestion(picture, month);
  const outcome = decide(picture, month, level);
  const { program, codes, trail, caveat } = outcome;
  const codesText = codes ? codes.join(" · ") : null;

  return (
    <section
      id="program-chooser"
      className={cn("bg-paper py-20 md:py-28 px-6 md:px-16", className)}
    >
      <div className="max-w-[1120px] mx-auto">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-eyebrow font-bold uppercase text-brand m-0">Program fit</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-h2 leading-[1.08] text-navy max-w-[24ch] mx-auto mt-4 mb-0">
            Which program is <em className="text-brand">this patient?</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[60ch] mx-auto mt-5 mb-0">
            CCM asks how many conditions. APCM asks for none of your minutes. BHI asks who else is on
            the case. RTM asks what the device did. Answer what is true and the codes follow.
          </p>
        </motion.div>

        <Panel
          className="mt-10 md:mt-14"
          eyebrow="One patient, three questions at most"
          title="Answer what is true"
          sub="There is nothing to submit. The answer moves as you tap, and the rule it used is written underneath it."
          footnote={
            <>
              A patient can meet more than one of these rules in the same month. This reads the
              eligibility rule and nothing else. It does not check consent, the initiating visit, or
              what any of it pays. {PROGRAM_FOOTNOTE}
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
            {/* ── The questions ── */}
            <div>
              <Choice
                label="What is true about this patient?"
                step="01"
                value={picture}
                onChange={setPicture}
                options={PICTURES}
                layout="stack"
                describedBy={answerId}
              />

              <div className="mt-4">
                <Note>
                  Two or more chronic conditions is where this starts because it is the common case.
                  About {REACH.eligible} of Medicare fee-for-service beneficiaries are eligible for
                  CCM. About {REACH.receiving} receive it. {REACH.source}
                </Note>
              </div>

              <Choice
                key={picture}
                className="mt-8 pt-8 border-t border-rule-soft"
                label={monthQuestion.label}
                step="02"
                value={month}
                onChange={setMonth}
                options={monthQuestion.options}
                describedBy={answerId}
              />

              {/* Fixed floor, because the third slot swaps between a question and
                  a sentence as the first two answers change. */}
              <div className="mt-8 pt-8 border-t border-rule-soft min-h-[132px]">
                {third ? (
                  <Choice
                    key={`${picture}-${month}`}
                    label={third.label}
                    step="03"
                    value={level}
                    onChange={setLevel}
                    options={third.options}
                    describedBy={answerId}
                  />
                ) : (
                  <div className="flex items-baseline gap-3">
                    <span className="shrink-0 text-[11.5px] font-bold tracking-[1.4px] text-ink-mute tabular-nums">
                      03
                    </span>
                    <p className="text-[13.5px] leading-[1.6] text-ink-soft m-0 max-w-[46ch]">
                      {levelAside(picture, month)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── The answer, with its working ── */}
            <div className="rounded-tile border border-rule-soft bg-paper-2 p-6 md:p-7 min-h-[540px] md:min-h-[620px]">
              <p className="text-eyebrow font-bold uppercase text-ink-mute m-0">
                What this patient reads as
              </p>

              <BigStat
                className="mt-5"
                value={program.code}
                label={program.name}
                sub={program.who}
                width={4}
                subLines={3}
              />

              <div id={answerId} className="mt-6 min-h-[112px]">
                <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-2.5">
                  Codes
                </p>
                <span className="sr-only">{program.name}. </span>
                {codes ? (
                  <motion.div
                    key={codes.join("-")}
                    initial={reduce ? false : { opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {codes.map((code) => (
                        <span
                          key={code}
                          className="rounded-pill border border-rule bg-paper-bright text-navy text-[13px] font-semibold tabular-nums px-3 py-1"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                    {outcome.level && (
                      <p className="text-[13px] leading-[1.6] text-ink-soft mt-2.5 mb-0">
                        {outcome.level}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <p className="text-[14px] leading-[1.6] text-ink m-0">
                    Not settled here. The program is right. The code is a conversation with your MAC.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-rule">
                <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-2.5">
                  What the month requires
                </p>
                <p className="text-[14.5px] leading-[1.7] text-ink-soft m-0 min-h-[100px]">
                  {program.rule}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-2.5">
                  What your team still does
                </p>
                <p className="text-[14.5px] leading-[1.7] text-ink m-0 min-h-[76px]">
                  {program.team}
                </p>
              </div>

              {(caveat || program.note) && (
                <div className="mt-5 space-y-4">
                  {caveat && (
                    <p className="text-[13px] leading-[1.65] text-ink-soft m-0 pl-4 border-l-2 border-signal-amber">
                      {caveat}
                      {programsHref && (
                        <>
                          {" "}
                          <a
                            href={programsHref}
                            className="font-semibold text-brand underline underline-offset-2"
                          >
                            Read the full program rules
                          </a>
                          .
                        </>
                      )}
                    </p>
                  )}
                  {program.note && <Note>{program.note}</Note>}
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-rule">
                <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-2.5">
                  How you got here
                </p>
                <Arithmetic
                  op="+"
                  parts={trail}
                  result={{ value: program.code, label: codesText ?? undefined }}
                />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
