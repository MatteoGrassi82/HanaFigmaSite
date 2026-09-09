/* ─────────────────────────────────────────────────────────────────────────────
 * src/content/programmes/index.ts — the programme facts, as data.
 *
 * WHAT THIS IS. The four Medicare programmes Remote runs, in the shape a
 * programme page needs: the eligibility rule, the monthly requirement, what
 * HANA does inside it, where the practice's own team stays, what the month
 * produces, and the CY2026 payment amount with the caveats that must travel
 * beside it. Data and types only. No JSX in this file, ever.
 *
 * PROVENANCE, and why nothing here should be reworded.
 * The four entries are carried VERBATIM from `PROGRAMS` in
 * src/app/components/lab/ProgramsStack.tsx, fact-checked 2026-08-19 against
 * primary CMS documents. The wording was argued over sentence by sentence and
 * every string encodes a guardrail: HANA's call time is never the billable
 * clinical time, HANA flags against a clinician-set threshold and never
 * interprets or concludes, the RTM device is the practice's and not HANA's, and
 * HANA is never called software or a platform. Widening the type is fine.
 * Editing a sentence is not: re-run the fact check first.
 *
 * The payment amounts are NOT redefined here. They are joined in from
 * src/app/components/lab/interactive/rates.ts via `rateFor()`, so there is one
 * definition of every dollar figure on the site. Read that file's header before
 * you render a number: CY2026 has two conversion factors, these amounts are
 * national and pre-GPCI, sequestration and Part B coinsurance both reduce what
 * the practice actually collects, and the year moves. `RATE_CAVEATS` below is
 * that header expressed as renderable data so a page can put the caveat next to
 * the figure. A dollar amount is never presented as "what you get paid".
 *
 * ALL SEVEN PROGRAMMES ARE HERE as of 6 Sept 2026. TCM, PCM and RPM were the
 * last three in; see DONE(scope) at the foot of this file for why each was held
 * back and what unblocked it. TCM is the one that does not share the monthly
 * shape: it is billed per qualifying discharge, not per patient per month.
 * ─────────────────────────────────────────────────────────────────────────── */

import {
  MARKET,
  NATIONAL_ENROLLMENT_PCT,
  RATES_ARE_PLACEHOLDER,
  rateFor,
  type ProgrammeRate,
} from "../../app/components/lab/interactive/rates";

/* Re-exported so a page imports one module, not two, and so the rate values
 * still have exactly one definition. */
export { MARKET, NATIONAL_ENROLLMENT_PCT, RATES_ARE_PLACEHOLDER, rateFor };
export type { ProgrammeRate };

/** Stable programme key. Matches `ProgrammeRate["id"]`, which is the join. */
export type ProgrammeId = ProgrammeRate["id"];

export interface RelatedCode {
  code: string;
  /** What the code is for, in one line. Present tense, plain words. */
  what: string;
  /** CY2026 national non-facility amount. Same basis as `payment`.
   *  OPTIONAL ON PURPOSE. A code we can name but cannot price to this file's
   *  standard omits it, and CodeTable prints "not sourced" rather than a
   *  number. A zero here would render as a dollar amount, which is worse than
   *  no figure: it reads as "this code pays nothing". */
  rate?: number;
  /** Anything that would make the figure misleading on its own. */
  caveat?: string;
}

export interface Programme {
  /** Stable key, and the join onto rates.ts. Also goes in URLs. Do not rename. */
  id: ProgrammeId;
  /** URL segment, no slashes. Combine with `PROGRAMME_PATH_PREFIX` or use `path`. */
  slug: string;
  /** Route path the page mounts at, and the `<SEO path>` value. */
  path: string;
  /** The acronym, as a clinician says it. */
  code: string;
  /** The wider code family, shown as a caption so the scope is visible. */
  codes: string;
  /** Full programme name. */
  name: string;
  /** One line for a card or a list row. Present tense, plain words. */
  summary: string;
  /** Who qualifies. The eligibility rule. */
  who: string;
  /** What the calendar month requires of the practice. */
  rule: string;
  /** What HANA does inside the programme. */
  hana: string[];
  /** Where the practice's own team stays. Never delegated. */
  team: string;
  /** What the month produces in the record. */
  lands: string[];
  /** A rule that qualifies the rest. Rendered as an aside, not buried. */
  note?: string;
  /** The CY2026 amount and its sourcing, joined from rates.ts. Never re-typed. */
  payment: ProgrammeRate;

  /** Other codes in the same family a practice may bill, with their own CY2026
   *  amounts. Separate from `payment` because `payment` is the ONE code the
   *  estimator multiplies; these are context, not the model. Sourced 2026-09-05
   *  and each cross-checked: every amount divides cleanly by the same CY2026
   *  non-qualifying-APM conversion factor ($33.4009) that reproduces 99490 and
   *  99439 exactly, so they come from the same Addendum B. */
  alsoBillable?: RelatedCode[];
}

/* Programme pages sit under one prefix so the hub, the seven pages and the
 * breadcrumbs agree. TODO(url): confirm the prefix with Matteo before wiring
 * routes. The code spells it "programmes" and the audience is US practices that
 * search "chronic care management", so the URL uses "programs". If that flips,
 * it flips here and nowhere else. */
export const PROGRAMME_PATH_PREFIX = "/programs";

const path = (slug: string) => `${PROGRAMME_PATH_PREFIX}/${slug}`;

export const PROGRAMMES: Programme[] = [
  {
    id: "ccm",
    slug: "chronic-care-management",
    path: path("chronic-care-management"),
    code: "CCM",
    codes: "99490 · 99439 · 99487 · 99489 · 99491 · 99437",
    name: "Chronic Care Management",
    summary:
      "Twenty minutes of care management a month, for patients with two or more chronic conditions.",
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
    payment: rateFor("ccm"),
    alsoBillable: [
      {
        code: "99487",
        what: "Complex CCM. Sixty minutes of clinical staff time, for a patient whose care plan needs moderate or high-complexity medical decision making.",
        rate: 144.29,
      },
      {
        code: "99489",
        what: "Each further thirty minutes of complex CCM.",
        rate: 78.16,
        caveat: "An add-on to 99487, never billed alone.",
      },
      {
        code: "99491",
        what: "Thirty minutes of the physician's or QHP's OWN time, not clinical staff time.",
        rate: 89.18,
        caveat: "Personal time only. Staff time does not count toward it, and it is not billed in the same month as 99490 for the same patient.",
      },
      {
        code: "99437",
        what: "Each further thirty minutes of physician or QHP time.",
        rate: 63.13,
        caveat: "An add-on to 99491, and personal time only.",
      },
    ],
  },
  {
    id: "apcm",
    slug: "advanced-primary-care-management",
    path: path("advanced-primary-care-management"),
    code: "APCM",
    codes: "G0556 · G0557 · G0558",
    name: "Advanced Primary Care Management",
    summary:
      "One bundled payment a month, no minute threshold, and thirteen service elements that have to be available.",
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
    payment: rateFor("apcm"),
  },
  {
    id: "bhi",
    slug: "behavioral-health-integration",
    path: path("behavioral-health-integration"),
    code: "BHI",
    codes: "99484 · CoCM 99492 to 99494",
    name: "Behavioral Health Integration",
    summary:
      "The contact between the visits, for a behavioral health condition being managed inside primary care.",
    who: "A behavioral health condition being managed inside primary care.",
    rule: "Twenty minutes of clinical staff time a month for general BHI. Collaborative care is a bigger build: a care manager, a psychiatric consultant, and seventy, sixty or thirty minutes by code.",
    hana: [
      "Makes the between-visit contact that decides whether a plan holds or quietly lapses.",
      "Administers the instrument your protocol asks for, by voice, and records the score with its date.",
      "Watches the direction of travel rather than a single answer, and calls sooner when it worsens.",
    ],
    team: "Anything that sounds like risk reaches a person live, not a queue. Diagnosis, medication and treatment stay with your clinicians.",
    lands: ["Instrument score with date", "Call summary", "Escalation record"],
    payment: rateFor("bhi"),
  },
  {
    id: "rtm",
    slug: "remote-therapeutic-monitoring",
    path: path("remote-therapeutic-monitoring"),
    code: "RTM",
    codes: "98975 to 98978 · 98980 · 98981",
    name: "Remote Therapeutic Monitoring",
    summary:
      "The interactive conversation the month requires, beside the data your device already records.",
    who: "Patients on a therapy whose adherence and response a device already records.",
    rule: "Sixteen days of data in thirty for the supply codes, and 98980 needs a real interactive conversation with the patient inside the month.",
    hana: [
      "Makes the interactive conversation happen on schedule and writes it up the same day.",
      "Brings the number into the call: what actually happened on the nights the data dipped.",
      "Checks what it hears against the threshold a clinician set, and flags instead of concluding.",
    ],
    team: "The device is yours and reading it is yours. HANA summarises the conversation, never interprets the data, and never changes therapy.",
    lands: ["Interactive-contact record", "Patient-reported context beside the data"],
    payment: rateFor("rtm"),
  },
  {
    /* REMOTE PHYSIOLOGIC MONITORING.
     * The twin of RTM, and it carries the same single guardrail: HANA IS NEVER
     * THE DEVICE. RPM pays for two separable things. The device half (99453
     * setup, 99454 or 99445 supply) turns on hardware the practice already has,
     * recording and transmitting a physiologic reading. The conversation half
     * (99457, 99458, 99470) turns on a live interactive communication with the
     * patient inside the calendar month. HANA does the second and only ever the
     * second. `alsoBillable` below lists the device codes with their sourced
     * amounts because a practice deserves to see the whole family, NOT because
     * they are revenue HANA produces. */
    id: "rpm",
    slug: "remote-physiologic-monitoring",
    path: path("remote-physiologic-monitoring"),
    code: "RPM",
    codes: "99453 · 99454 · 99445 · 99457 · 99458 · 99470",
    name: "Remote Physiologic Monitoring",
    summary:
      "The live conversation the month requires, beside the readings your device already sends.",
    who: "Patients whose physiologic readings a device already records and transmits.",
    rule: "Sixteen days of readings in thirty for 99454, and 99457 needs at least one live interactive communication with the patient or caregiver inside the month.",
    hana: [
      "Makes the live interactive communication happen on schedule and writes it up the same day.",
      "Brings the reading into the call: what was going on at home on the days the numbers moved.",
      "Checks what it hears against the threshold a clinician set, and flags instead of concluding.",
    ],
    team: "The device is yours and reading it is yours. HANA summarises the conversation, never interprets a reading, and never changes therapy.",
    lands: ["Interactive-communication record", "Patient-reported context beside the readings"],
    note: "The figure on this page is 99457 alone, the conversation code. The device codes are yours and are billed separately.",
    payment: rateFor("rpm"),
    alsoBillable: [
      {
        code: "99458",
        what: "Each further twenty minutes of treatment management in the same month.",
        rate: 41.42,
        caveat: "An add-on to 99457, never billed alone.",
      },
      {
        code: "99454",
        what: "Supply of the device, for a thirty-day period with at least sixteen days of readings.",
        // 1.56 total non-facility RVUs x $33.4009 = $52.1054, which rounds to
        // $52.11. Secondary write-ups print $52.10 because they truncate rather
        // than round; do not "correct" this back to match them.
        rate: 52.11,
        caveat: "This is your device, not HANA's. HANA does not supply hardware and does not generate readings.",
      },
      {
        code: "99453",
        what: "One-off setup and patient education on using the device.",
        rate: 21.71,
        caveat: "Billed once per episode, not monthly. Again, your device.",
      },
    ],
  },
  {
    /* PRINCIPAL CARE MANAGEMENT.
     * The programme for the patient CCM turns away. CCM needs two or more
     * chronic conditions; PCM is the one-condition programme, for a single
     * complex condition serious enough to need its own care plan.
     *
     * WATCH THE CODE NUMBERING. It is the reverse of CCM's. 99426/99427 are
     * the CLINICAL STAFF track (the figure on this page) and 99424/99425 are
     * the PHYSICIAN track. See the guardrail in rates.ts. */
    id: "pcm",
    slug: "principal-care-management",
    path: path("principal-care-management"),
    code: "PCM",
    codes: "99424 · 99425 · 99426 · 99427",
    name: "Principal Care Management",
    summary:
      "Thirty minutes a month on one condition, for the patient who does not qualify for chronic care management.",
    who: "One complex chronic condition expected to last at least three months, serious enough to risk hospitalisation or decline.",
    rule: "Thirty minutes of clinical staff time in a calendar month, directed at that single condition, against a disease-specific care plan the patient has consented to.",
    hana: [
      "Makes the monthly contact and keeps it on the one condition, rather than drifting across the whole chart.",
      "Asks the disease-specific questions your clinicians scoped, in 30+ languages.",
      "Writes it up the same day with the time attributed, ready for review.",
    ],
    team: "Your clinicians set the care plan and own every clinical decision on it. HANA makes the contact and documents it, and nothing bills until a person on your team approves it.",
    lands: ["Monthly time log against one condition", "Disease-specific contact record"],
    note: "PCM cannot be billed in the same month as advanced primary care management for the same patient. 99424 and 99426 are also mutually exclusive: one month is either the physician track or the clinical staff track, never both.",
    payment: rateFor("pcm"),
    alsoBillable: [
      {
        code: "99427",
        what: "Each further thirty minutes of clinical staff time in the same month.",
        caveat: "No sourced CY2026 amount yet, so no figure is shown. An add-on to 99426, never billed alone.",
      },
      {
        code: "99424 / 99425",
        what: "The physician or QHP track, where the practitioner rather than clinical staff does the thirty minutes.",
        caveat: "No figure shown on purpose: two independent CY2026 chains disagree on 99424's RVUs (2.62 against 2.63). Mutually exclusive with 99426 in the same month.",
      },
    ],
  },
  {
    /* TRANSITIONAL CARE MANAGEMENT.
     *
     * TWO THINGS MAKE THIS PAGE DIFFERENT FROM EVERY OTHER PROGRAMME PAGE.
     *
     * 1. IT IS NOT A MONTHLY PROGRAMME. TCM is billed once per qualifying
     *    discharge across a thirty-day service period. The page ships with
     *    showEstimator={false} because RevenueEstimator models a monthly
     *    enrolled panel and would put a confidently wrong number on screen.
     *
     * 2. IT REQUIRES A FACE-TO-FACE VISIT, AND HANA CANNOT DO ONE. The claim
     *    needs interactive contact within 2 business days of discharge,
     *    medication reconciliation, and a face-to-face visit inside 14 days
     *    (99495) or 7 days (99496). HANA does the FIRST of those three and
     *    only the first. It happens to be the one that fails most often and
     *    takes the whole claim with it, which is the argument this page makes.
     *    It must never be written so as to imply HANA supplies the visit. */
    id: "tcm",
    slug: "transitional-care-management",
    path: path("transitional-care-management"),
    code: "TCM",
    codes: "99495 · 99496",
    name: "Transitional Care Management",
    summary:
      "The two-business-day call after discharge, which is the requirement that most often goes missing.",
    who: "Patients discharged from an inpatient or observation stay back into the community.",
    rule: "Interactive contact within two business days of discharge, medication reconciliation by the date of the visit, and a face-to-face visit inside fourteen days for 99495 or seven for 99496.",
    hana: [
      "Makes the interactive contact inside the two-business-day window, including evenings and weekends, when a discharge on a Friday is otherwise lost.",
      "Attempts again and documents every attempt, which is what the requirement actually asks for.",
      "Writes up what it hears and flags anything your clinicians said to escalate, before the visit rather than at it.",
    ],
    team: "The face-to-face visit is yours and only yours, and so is the medication reconciliation and every clinical decision. HANA does the two-business-day contact and documents it.",
    lands: ["Two-business-day contact record, with every attempt timed", "Patient-reported state before the visit"],
    note: "The figure on this page is per qualifying DISCHARGE, not per patient per month, which is the one place this programme does not work like the others. HANA does the two-business-day contact only. The face-to-face visit the claim requires is yours.",
    payment: rateFor("tcm"),
    alsoBillable: [
      {
        code: "99496",
        what: "High complexity, with the face-to-face visit inside seven days of discharge rather than fourteen.",
        rate: 298.60,
        caveat: "Same discharge, higher medical decision making and a tighter visit window. Never billed alongside 99495 for the same discharge.",
      },
    ],
  },
];

/** Carried verbatim from lab/ProgramsStack.tsx. Every programme page needs it. */
export const PROGRAMME_FOOTNOTE =
  "Programs are what your practice bills. HANA does not bill, and its call time is never counted as clinical time. Requirements here are the Medicare rules as they stand in August 2026 and are worth checking against your MAC before you rely on them.";

/* ── The caveats that travel with a dollar figure ──────────────────────────
 * This is the rates.ts header as data, so a page can render the caveat next to
 * the number instead of hoping the reader opens a footnote. The amounts
 * themselves are not repeated here: `payment.rate` is the only copy of a
 * figure, and the derived amounts come from the helpers below.
 *
 * A page showing a figure must show `RATE_BASIS_LINE` plus at least the
 * sequestration and coinsurance caveats. Never a bare amount, and never the
 * words "what you get paid".
 */
export interface RateCaveat {
  id: "conversion-factor" | "geography" | "sequestration" | "coinsurance" | "year" | "modelling";
  /** Short label. Fine for a chip or a definition-list term. */
  label: string;
  /** One or two short sentences. Second person, present tense. */
  body: string;
}

export const RATE_CAVEATS: RateCaveat[] = [
  {
    id: "conversion-factor",
    label: "Two conversion factors",
    body: "CY2026 is the first year with two of them: one for clinicians who are Qualifying APM Participants, a lower one for everybody else. The figures here use the lower one, which covers most clinicians. So there is no single national rate to quote.",
  },
  {
    id: "geography",
    label: "Before geographic adjustment",
    body: "These are national amounts, before the geographic indices are applied. What your locality pays runs roughly 10 to 15 percent either side.",
  },
  {
    id: "sequestration",
    label: "Sequestration",
    body: "The 2 percent reduction still applies on remittance, so the practice nets a little less than the allowed amount.",
  },
  {
    id: "coinsurance",
    label: "Patient coinsurance",
    body: "These are Part B services, so the standard 20 percent coinsurance and the deductible apply. About four fifths comes from Medicare and the rest from the patient or their supplemental plan, and that share is a well-known obstacle to enrollment in its own right.",
  },
  {
    id: "year",
    label: "The year moves",
    body: "CY2026 is about 9 percent above CY2025 on CCM. Never mix years inside one comparison, and re-verify when the CY2027 final rule lands, around 1 November 2026.",
  },
  {
    id: "modelling",
    label: "One code, one month",
    body: "Each figure is the single base code, once per enrolled patient per calendar month. Add-on increments are not in it, so a practice billing the programme fully collects more than the figure shown.",
  },
];

/** The one line that must sit beside any figure. Pass the programme's payment. */
export function rateBasisLine(payment: ProgrammeRate): string {
  return `${payment.year} national non-facility amount for ${payment.code}, before geographic adjustment, sequestration and patient coinsurance.`;
}

/** Sequestration and coinsurance, as policy rates. Both are in rates.ts. */
export const SEQUESTRATION_PCT = 2;
export const PART_B_COINSURANCE_PCT = 20;

/** What the practice nets after the 2 percent sequestration reduction. */
export function afterSequestration(rate: number): number {
  return rate * (1 - SEQUESTRATION_PCT / 100);
}

/** The Medicare share of the allowed amount, before sequestration. */
export function medicareShare(rate: number): number {
  return rate * (1 - PART_B_COINSURANCE_PCT / 100);
}

/** The patient or supplemental-plan share of the allowed amount. */
export function patientShare(rate: number): number {
  return rate * (PART_B_COINSURANCE_PCT / 100);
}

/** "$66.13". Two decimals, no rounding surprises in a table. */
export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/* ── Lookups ───────────────────────────────────────────────────────────────── */

export const PROGRAMME_IDS: ProgrammeId[] = PROGRAMMES.map((p) => p.id);

export function programmeById(id: ProgrammeId): Programme | undefined {
  return PROGRAMMES.find((p) => p.id === id);
}

/**
 * SAME MONTH: which pairs of programmes CMS lets a practice bill for the same
 * patient in the same month. Drives the stack readout in ProgrammeFilter.
 *
 *   "yes"  CMS has said so in a PFS final rule or FAQ (cited per pair).
 *   "no"   CMS or CPT bars it.
 *   "open" we have not found the ruling and will not guess. Shown as unsettled.
 *
 * Two things every "yes" carries and the UI must repeat: the same minutes can
 * never count toward two codes, and this is about what may be billed, not what
 * a given patient qualifies for. Keys are the two ids sorted, joined with "+".
 *
 * Sources
 *   APCM × CCM/PCM/TCM barred; APCM × BHI, RPM, RTM allowed:
 *     CMS, CY2025 PFS final rule (CMS-1807-F), APCM section.
 *   CCM × PCM barred: CPT 2022 parenthetical, do not report 99424-99427 in the
 *     same month as 99487-99491.
 *   RPM × RTM barred: CMS, CY2022 PFS final rule (CMS-1751-F), RTM section.
 *   CCM/TCM/BHI/PCM × RPM allowed: CMS, CY2020 (CMS-1715-F) and CY2021
 *     (CMS-1734-F) PFS final rules.
 *   CCM/PCM/TCM/BHI × RTM allowed: CMS, CY2022 PFS final rule (CMS-1751-F).
 *   CCM × TCM allowed: CMS, CY2020 PFS final rule (CMS-1715-F).
 *   CCM × BHI, TCM × BHI allowed: CMS, Behavioral Health Integration FAQ.
 */
export type SameMonth = "yes" | "no" | "open";
export const SAME_MONTH: Record<string, SameMonth> = {
  "apcm+ccm": "no", "apcm+pcm": "no", "apcm+tcm": "no",
  "apcm+bhi": "yes", "apcm+rpm": "yes", "apcm+rtm": "yes",
  "ccm+pcm": "no",
  "rpm+rtm": "no",
  "bhi+ccm": "yes", "ccm+rpm": "yes", "ccm+rtm": "yes", "ccm+tcm": "yes",
  "bhi+rpm": "yes", "bhi+rtm": "yes", "bhi+tcm": "yes",
  "pcm+rpm": "yes", "pcm+rtm": "yes",
  "rpm+tcm": "yes", "rtm+tcm": "yes",
  "bhi+pcm": "open", "pcm+tcm": "open",
};
export function sameMonth(a: ProgrammeId, b: ProgrammeId): SameMonth {
  return SAME_MONTH[[a, b].sort().join("+")] ?? "open";
}

export function programmeBySlug(slug: string): Programme | undefined {
  return PROGRAMMES.find((p) => p.slug === slug);
}

/** Every programme except the one given. For a "related programmes" row. */
export function otherProgrammes(id: ProgrammeId): Programme[] {
  return PROGRAMMES.filter((p) => p.id !== id);
}

export function isProgrammeId(raw: string): raw is ProgrammeId {
  return PROGRAMMES.some((p) => p.id === raw);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * TODO — WHAT A PROGRAMME PAGE NEEDS AND THIS DATA DOES NOT HAVE.
 * Nothing below is guessable. Each line is a question for Matteo, and until it
 * is answered the page either omits the block or ships a visible gap. Do not
 * invent a statistic, a rate, a CPT code or an eligibility rule to fill one.
 *
 * STRUCTURE AND ROUTING
 * DONE(scope) 2026-09-06: the brief asked for seven programme pages and this
 *   data now covers seven. RPM, PCM and TCM were the three missing, and each
 *   was held back for a different reason worth remembering:
 *     RPM  "HANA is never the device" was read as a reason to have no page.
 *          It is a reason to have a page that says so: RPM splits into a
 *          device half and a conversation half, and HANA does the second.
 *     PCM  simply had no module. Its rate is sourced now (99426, the CLINICAL
 *          STAFF track, whose numbering is the reverse of CCM's).
 *     TCM  had no module, and also does not fit the monthly shape the other
 *          six share. It is per discharge, which is why ProgrammePage grew
 *          showEstimator={false}.
 * TODO(url): confirm `PROGRAMME_PATH_PREFIX`. "/programs/..." assumes a US
 *   audience and US spelling; the hub page slug and the breadcrumb label need
 *   the same decision.
 * TODO(seo): an approved <SEO title> and description per programme. The
 *   prerender regex-scrapes a literal <SEO … /> out of the page file, so these
 *   are strings a human signs off, not something generated at runtime.
 * TODO(i18n): what these routes do on the Italian domain. They are US Medicare
 *   programmes. Hardcode English and leave them off the Italian sitemap, or
 *   exclude the routes entirely.
 * TODO(naming): the product noun to use on these pages. The banned names are
 *   off the table, so decide the phrase once and use it on all seven.
 *
 * RULES THE PAGES WILL BE ASKED ABOUT AND THIS FILE CANNOT ANSWER
 * TODO(consent): how consent is obtained and documented per programme, who
 *   obtains it, and whether it is once or annual.
 * TODO(initiating-visit): which programmes need an initiating visit, and for
 *   which patients. APCM's `lands` promises an initiating-visit trail and the
 *   rule behind it is not written down here.
 * TODO(who-bills): which practitioner types may bill, the one-practitioner-per-
 *   patient-per-month rule, and the supervision level the clinical staff time
 *   sits under.
 * TODO(concurrency): the full same-month matrix. Only APCM's exclusion of CCM,
 *   PCM and TCM is captured. CCM beside BHI, CCM beside RTM, and how time is
 *   kept from being counted twice, are all unwritten.
 * TODO(cy2027): the per-programme line on the PROPOSED CY2027 rule and its
 *   own-staff test. It is always described as proposed, never as settled, and
 *   the wording needs Matteo plus counsel. Never name the account it came from.
 * TODO(fqhc-rhc): whether these pages speak to FQHCs and RHCs at all, and if so
 *   what the correct code and payment story is for them.
 * TODO(payers): whether Medicare Advantage, Medicaid and commercial plans cover
 *   these codes, and what a page may say about that.
 * TODO(coinsurance-handling): what a practice does about the patient share in
 *   practice, and what we are allowed to say about waiving or collecting it.
 * TODO(refresh): an owner and a review date for the "as they stand in August
 *   2026" footnote, plus the re-verify when the CY2027 final rule lands.
 *
 * NUMBERS THAT ARE NOT AVAILABLE AS EXPORTS
 * TODO(rates-exports): rates.ts holds the CY2026 conversion factors, the QP
 *   variant of the CCM amount, the 99439 add-on amount and the practical CCM
 *   monthly ceiling in its header COMMENT, not as exports. A page that shows a
 *   ceiling, a QP comparison or a full add-on stack needs them exported from
 *   rates.ts. Do not retype the numbers here.
 * TODO(add-ons): whether a page shows add-on codes at all. 99439, 98981 and the
 *   G0556 / G0558 levels each need their own sourced amount before they appear.
 * TODO(apcm-levels): APCM is modelled at level 2 only. If a page shows all
 *   three levels, G0556 and G0558 need their own sourced amounts.
 * TODO(cocm): Collaborative Care (99492 / 99493 / 99494) is out of scope in the
 *   rate data on purpose. A BHI page that mentions it must not put a figure on
 *   it, and must say it needs a care manager and a psychiatric consultant.
 * TODO(rtm-supply): 98975 to 98978 are setup and device supply and are not in
 *   the RTM figure, so that figure reads low. Either source the supply codes or
 *   keep saying so beside the number.
 * TODO(legal): sign-off on whether a dollar figure appears on a public page at
 *   all, and on the exact disclaimer wording if it does.
 *
 * PROOF, PRICE AND PRODUCT DETAIL
 * TODO(proof): a real per-programme proof point. Calls placed, reach rate,
 *   months closed complete, enrollment movement. There is none in this data and
 *   the proof gate is unresolved, so no page invents one.
 * TODO(pricing): whether the per-patient-per-month price appears on a programme
 *   page, and on what basis it is stated.
 * TODO(integrations): the verified list of EHRs and device portals HANA writes
 *   back to, per programme, split into live and planned. The marquee card copy
 *   names systems but is not a verified integration list.
 * TODO(instruments): the named instruments HANA may administer by voice for
 *   BHI, and the licensing position on each. The programme data says "the
 *   instrument your protocol asks for" and stops there, on purpose.
 * TODO(escalation): the documented escalation path and the response commitment
 *   behind "reaches a person live". A page that promises it needs the detail.
 * TODO(faq): a fact-checked FAQ set per programme. FaqSection takes items and
 *   the page passes faqSchema(), so these are approved question and answer
 *   pairs, not filler.
 * TODO(cta): the CTA target and lead routing for each page.
 * TODO(media): the hero visual per programme, and clearance for any product
 *   screenshot showing a time log, an activity trail or a billing review.
 * TODO(customers): whether any named customer or quote can appear on these
 *   pages. Never the account that drives the CY2027 exposure.
 * ─────────────────────────────────────────────────────────────────────────── */
