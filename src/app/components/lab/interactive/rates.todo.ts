/* ─────────────────────────────────────────────────────────────────────────────
 * rates.todo.ts — THE BLOCKED FILE.
 *
 * READ THIS BEFORE YOU TOUCH RevenueEstimator.tsx.
 *
 * Every payment figure the estimator multiplies by lives here, and every one of
 * them is a PLACEHOLDER. They are round invented numbers, chosen only so the
 * arithmetic has something to run on. They are not CMS rates, they are not
 * close to CMS rates, and nobody has checked them against anything.
 *
 * The estimator reads `placeholder` and `RATES_CONFIRMED` and renders a large
 * warning on the page while either says the figures are unconfirmed. That is on
 * purpose. It is not a console warning a marketer can miss.
 *
 * TO MAKE THE COMPONENT PUBLISHABLE, THIS FILE IS THE ONLY EDIT:
 *   1. For each entry below, replace `rate` with the confirmed national
 *      non-facility payment amount from the Medicare Physician Fee Schedule.
 *   2. Fill `year` with the fee-schedule year that amount is taken from.
 *   3. Fill `source` with where it came from, precisely enough to re-check.
 *   4. Set `placeholder: false` on that entry.
 *   5. Fill MARKET.citation with the published source for the two market
 *      figures below.
 *   6. Set RATES_CONFIRMED to true.
 * The warning disappears on its own. No JSX changes, no copy changes.
 *
 * WHAT IS DELIBERATELY NOT MODELLED
 * One base code per enrolled patient per calendar month. No add-on increments
 * (99439, 98981), no geographic adjustment, no sequestration, no coinsurance
 * split, no MAC-level variation. When the real rates land, decide whether the
 * estimator should model the add-ons too, or whether keeping it to the base
 * code is the more honest number. The component's footnote says which it is.
 *
 * PROGRAM FACTS BELOW (the code families, who qualifies, what the code pays
 * for) are NOT placeholders. They are carried over verbatim from the verified
 * set in src/app/components/lab/ProgramsStack.tsx and src/content/programmes.ts,
 * fact-checked 2026-08-19. Only the dollar amounts are missing.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Flip to true once every entry below carries a confirmed rate, year and source. */
export const RATES_CONFIRMED = false;

export interface ProgrammeRate {
  /** Stable key. Also the value written to the URL, so do not rename casually. */
  id: "ccm" | "apcm" | "bhi" | "rtm";
  /** Chip label. */
  short: string;
  /** Full program name. */
  name: string;
  /** The single base code this estimate models. */
  code: string;
  /** The wider code family, shown as a caption so the scope is visible. */
  codes: string;
  /** One line: what that base code pays for. Present tense, plain words. */
  basis: string;
  /** Who counts as eligible. Used to label the panel dial honestly. */
  eligible: string;
  /** Dollars per enrolled patient per calendar month. PLACEHOLDER until checked. */
  rate: number;
  /** True while `rate` is invented. The page shows a warning while any is true. */
  placeholder: boolean;
  /** Fee-schedule year `rate` is taken from. Empty while placeholder. */
  year: string;
  /** Where `rate` came from, precisely enough to re-check. Empty while placeholder. */
  source: string;
}

export const PROGRAMME_RATES: ProgrammeRate[] = [
  {
    // TODO(rates): CHRONIC CARE MANAGEMENT.
    //   Programme ........ Chronic Care Management (CCM)
    //   Code ............. CPT 99490
    //   Figure needed .... national NON-FACILITY payment amount, Medicare
    //                      Physician Fee Schedule
    //   Year ............. state it (CY2026 unless we are publishing against
    //                      a different schedule)
    //   Also decide ...... whether 99439 (each further 20 minutes) belongs in
    //                      the model. If it does, it needs its own entry and
    //                      the arithmetic in RevenueEstimator gains a term.
    id: "ccm",
    short: "CCM",
    name: "Chronic Care Management",
    code: "99490",
    codes: "99490 · 99439",
    basis: "The first twenty minutes of clinical staff time in a calendar month, against a care plan the patient has consented to.",
    eligible: "Two or more chronic conditions expected to last a year or longer.",
    rate: 60,
    placeholder: true,
    year: "",
    source: "",
  },
  {
    // TODO(rates): ADVANCED PRIMARY CARE MANAGEMENT.
    //   Programme ........ Advanced Primary Care Management (APCM)
    //   Code ............. HCPCS G0557 (level 2, two or more chronic
    //                      conditions). G0556 and G0558 are the other two
    //                      levels and pay differently.
    //   Figure needed .... national NON-FACILITY payment amount, Medicare
    //                      Physician Fee Schedule
    //   Year ............. state it
    //   Also decide ...... whether the estimator should let a practice split
    //                      its panel across the three levels. Today it models
    //                      one level for the whole panel, which is a
    //                      simplification worth naming if we keep it.
    id: "apcm",
    short: "APCM",
    name: "Advanced Primary Care Management",
    code: "G0557",
    codes: "G0556 · G0557 · G0558",
    basis: "One bundled payment a month, with no time threshold, for thirteen service elements that have to be available to the patient.",
    eligible: "Two or more chronic conditions. Level 2 of three.",
    rate: 110,
    placeholder: true,
    year: "",
    source: "",
  },
  {
    // TODO(rates): BEHAVIORAL HEALTH INTEGRATION.
    //   Programme ........ Behavioral Health Integration (BHI), general
    //   Code ............. CPT 99484
    //   Figure needed .... national NON-FACILITY payment amount, Medicare
    //                      Physician Fee Schedule
    //   Year ............. state it
    //   Also decide ...... Collaborative Care (99492 / 99493 / 99494) is a
    //                      different and much larger build. It is out of scope
    //                      here on purpose. If it goes in, it needs a care
    //                      manager and a psychiatric consultant in the model,
    //                      not just a rate.
    id: "bhi",
    short: "BHI",
    name: "Behavioral Health Integration",
    code: "99484",
    codes: "99484 · CoCM 99492 to 99494",
    basis: "Twenty minutes of clinical staff time a month on a behavioral health condition being managed inside primary care.",
    eligible: "A behavioral health condition being managed in primary care.",
    rate: 50,
    placeholder: true,
    year: "",
    source: "",
  },
  {
    // TODO(rates): REMOTE THERAPEUTIC MONITORING.
    //   Programme ........ Remote Therapeutic Monitoring (RTM)
    //   Code ............. CPT 98980
    //   Figure needed .... national NON-FACILITY payment amount, Medicare
    //                      Physician Fee Schedule
    //   Year ............. state it
    //   Also decide ...... 98975 to 98978 are setup and device supply and are
    //                      NOT in this figure. A practice billing RTM properly
    //                      earns more than 98980 alone, so the estimate here
    //                      reads low. Either add the supply codes or keep
    //                      saying so in the footnote.
    id: "rtm",
    short: "RTM",
    name: "Remote Therapeutic Monitoring",
    code: "98980",
    codes: "98975 to 98978 · 98980 · 98981",
    basis: "The first twenty minutes of treatment management in a month, and it needs a real interactive conversation with the patient.",
    eligible: "Patients on a therapy whose adherence a device already records.",
    rate: 55,
    placeholder: true,
    year: "",
    source: "",
  },
];

/* ── Market context ────────────────────────────────────────────────────────
 * These two are NOT invented. They are third-party market figures cleared for
 * attributed use, and the estimator uses them to explain where its default
 * enrollment rate comes from. What is missing is the citation itself, so the
 * component prints "citation pending" until the string below is filled.
 *
 * TODO(source): attach the published citation both figures come from. Name the
 * publisher, the report and the year, tightly enough that a reader can find it.
 */
export const MARKET = {
  /** Share of Medicare fee-for-service beneficiaries eligible for CCM. */
  eligiblePct: 75,
  /** Share of Medicare fee-for-service beneficiaries who receive CCM. */
  receivingPct: 4,
  citation: "",
};

/* ── Derived, not invented ────────────────────────────────────────────────
 * 4 in 100 receive it, 75 in 100 qualify, so roughly 5 enrolled for every 100
 * eligible. That division is the estimator's honest default, and the component
 * shows the division on the page rather than asserting the 5.
 */
export const NATIONAL_ENROLLMENT_PCT = Math.round(
  (MARKET.receivingPct / MARKET.eligiblePct) * 100
);

/** True while any figure on this page is still a placeholder. */
export const RATES_ARE_PLACEHOLDER =
  !RATES_CONFIRMED || PROGRAMME_RATES.some((r) => r.placeholder);

export function rateFor(id: ProgrammeRate["id"]): ProgrammeRate {
  return PROGRAMME_RATES.find((r) => r.id === id) ?? PROGRAMME_RATES[0];
}

export function isProgrammeId(raw: string): raw is ProgrammeRate["id"] {
  return PROGRAMME_RATES.some((r) => r.id === raw);
}
