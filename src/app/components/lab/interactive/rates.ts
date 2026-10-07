/* ─────────────────────────────────────────────────────────────────────────────
 * rates.ts — Medicare payment amounts, sourced.
 *
 * WAS rates.todo.ts, holding invented placeholders behind a warning banner.
 * Sourced 2026-09-05 from CMS primary documents. Every amount below is the
 * CY2026 national NON-FACILITY allowed amount, computed the way CMS computes it
 * (total non-facility RVUs x conversion factor, national locality, all GPCIs
 * 1.000), taken from the CY2026 PFS Final Rule (CMS-1832-F) Addendum B and
 * independently reproduced a second time from a different primary chain before
 * being written here.
 *
 * FIVE THINGS THAT MAKE A QUOTED FIGURE WRONG. Any page using these must not
 * present a bare dollar amount as "what you get paid".
 *
 * 1. CY2026 HAS TWO CONVERSION FACTORS, the first year this has ever happened.
 *    $33.4009 for clinicians who are NOT Qualifying APM Participants, $33.5675
 *    for those who are. The amounts below use the NON-qualifying factor, which
 *    is the lower one and covers most clinicians. 99490 is $66.46 rather than
 *    $66.13 for a QP. So there is no single national rate to quote.
 * 2. GEOGRAPHIC ADJUSTMENT. These are national, before GPCIs. Real payment
 *    varies by MAC locality, roughly plus or minus 10 to 15 percent.
 * 3. SEQUESTRATION. The 2 percent reduction still applies on remittance, so a
 *    practice nets about $64.81 on 99490, not $66.13.
 * 4. PATIENT COINSURANCE. These are Part B services with the standard 20
 *    percent coinsurance and deductible. On 99490 that is about $52.90 from
 *    Medicare and about $13.23 from the patient or their supplemental plan.
 *    Quoting the gross amount as practice revenue overstates it, and CCM
 *    coinsurance is a well-known enrollment obstacle in its own right.
 * 5. THE YEAR MOVES. 99490 was $60.49 in CY2025 and is $66.13 in CY2026, about
 *    9 percent up. Never mix years inside one comparison. Re-verify when the
 *    CY2027 final rule lands, around 1 November 2026.
 *
 * WHAT IS DELIBERATELY NOT MODELLED
 * One base code per enrolled patient per calendar month. No add-on increments,
 * no geographic adjustment, no sequestration, no coinsurance split. Note that
 * 99439 (each further 20 minutes of CCM) is $50.44 national non-facility and
 * Medicare allows at most two units a month, so the practical CCM ceiling is
 * about $167 per patient per month rather than the $66.13 modelled here. If the
 * estimator ever models add-ons, that is the number to build from.
 *
 * PROGRAM FACTS BELOW (code families, who qualifies, what the code pays for)
 * are carried verbatim from the verified set in lab/ProgramsStack.tsx and
 * src/content/programmes.ts, fact-checked 2026-08-19.
 * ─────────────────────────────────────────────────────────────────────────── */

/** True once every entry carries a confirmed rate, year and source. */
export const RATES_CONFIRMED = true;

export interface ProgrammeRate {
  /** Stable key. Also the value written to the URL, so do not rename casually. */
  id: "ccm" | "apcm" | "bhi" | "rtm" | "rpm" | "pcm" | "tcm";
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
    rate: 66.13,
    placeholder: false,
    year: "CY2026",
    source: "CMS CY2026 PFS Final Rule (CMS-1832-F) Addendum B: 99490 total non-facility RVUs 1.98 x non-qualifying-APM conversion factor $33.4009. Verified against the CMS PFS Look-Up data service and independently reproduced from the RVU26D national relative value file.",
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
    rate: 53.78,
    placeholder: false,
    year: "CY2026",
    source: "CMS CY2026 PFS Final Rule (CMS-1832-F) Addendum B: G0557 total non-facility RVUs 1.61 x non-qualifying-APM conversion factor $33.4009. Independently reproduced from the updated 02/26/2026 addenda package.",
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
    rate: 57.45,
    placeholder: false,
    year: "CY2026",
    source: "CMS CY2026 PFS Final Rule (CMS-1832-F) Addendum B: 99484 total non-facility RVUs 1.72 x non-qualifying-APM conversion factor $33.4009. Confirmed identical in the rvu26a and rvu26d national relative value files.",
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
    rate: 54.11,
    placeholder: false,
    year: "CY2026",
    source: "CMS CY2026 PFS Final Rule (CMS-1832-F) Addendum B: 98980 total non-facility RVUs 1.62 x non-qualifying-APM conversion factor $33.4009. Independently reproduced from CMS primary files.",
  },
  {
    // REMOTE PHYSIOLOGIC MONITORING.
    // The base code modelled here is 99457, the treatment-management code, and
    // it is chosen for the same reason 98980 is chosen for RTM: it is the only
    // RPM code whose work is a conversation. 99457 requires at least one live
    // interactive communication with the patient or caregiver in the month.
    //
    // THE DEVICE CODES ARE NOT MODELLED AND MUST NEVER BE. 99453 (setup) and
    // 99454 (device supply) are sourced and carried in `alsoBillable` on the
    // programme so a practice can see the whole family, but they belong to the
    // practice's device, not to HANA, and no page may present their amounts as
    // something HANA earns you. See the guardrail block in the RPM page file.
    //
    // TWO CY2026 CODES ARE DELIBERATELY UNSOURCED: 99470 (first 10 minutes of
    // treatment management) and 99445 (device supply for 2 to 15 days of data),
    // both new in CY2026. Secondary write-ups put them near $26 and $47, which
    // is not the standard this file holds, so they are named on the page
    // WITHOUT a figure rather than quoted from a blog.
    id: "rpm",
    short: "RPM",
    name: "Remote Physiologic Monitoring",
    code: "99457",
    codes: "99453 · 99454 · 99445 · 99457 · 99458 · 99470",
    basis: "The first twenty minutes of treatment management in a month, and it needs at least one live interactive communication with the patient.",
    eligible: "Patients whose physiologic readings a device already records and transmits.",
    rate: 51.77,
    placeholder: false,
    year: "CY2026",
    source: "CMS CY2026 PFS: 99457 total non-facility RVUs 1.55 x non-qualifying-APM conversion factor $33.4009 = $51.77. Cross-checked against an independent CY2026 summary quoting approximately $52 national non-facility.",
  },
  {
    // PRINCIPAL CARE MANAGEMENT.
    // Base code is 99426, the CLINICAL STAFF track, because that is the track
    // HANA's model sits in and it is the direct parallel to CCM's 99490.
    //
    // ███ PCM CODE NUMBERING IS THE REVERSE OF CCM'S. ███
    // In CCM, 99490 is clinical staff and 99491 is the physician. In PCM it
    // flips: 99424/99425 are the PHYSICIAN/QHP track and 99426/99427 are the
    // CLINICAL STAFF track. Getting this backwards puts the wrong figure on the
    // page and the wrong code on a claim, and it is the most common PCM billing
    // error there is. 99424 and 99426 are mutually exclusive in a month.
    //
    // 99424 WAS UNPRICED until 7 Oct 2026, when two chains disagreed on its
    // total non-facility RVUs (2.62 against 2.63). Settled at 2.62 ($87.51):
    // CMS Addendum B for CMS-1832-F, RVU26A and RVU26D all carry it. The PCM
    // add-on and physician-track amounts live in the programme content module's
    // alsoBillable, not here, because this file holds one base code each.
    id: "pcm",
    short: "PCM",
    name: "Principal Care Management",
    code: "99426",
    codes: "99424 · 99425 · 99426 · 99427",
    basis: "The first thirty minutes of clinical staff time in a month, directed at one high-risk condition rather than the whole chart.",
    eligible: "Patients with ONE complex chronic condition expected to last at least three months.",
    rate: 67.80,
    placeholder: false,
    year: "CY2026",
    source: "CMS CY2026 PFS: 99426 total non-facility RVUs 2.03 x non-qualifying-APM conversion factor $33.4009 = $67.80. Reproduced from two independent CY2026 chains, both landing on 2.03 and $67.80.",
  },
  {
    // TRANSITIONAL CARE MANAGEMENT.
    //
    // ███ THIS ONE IS NOT PER CALENDAR MONTH. ███
    // Every other entry in this file is one base code per enrolled patient per
    // calendar month. TCM is billed ONCE PER QUALIFYING DISCHARGE, across a
    // thirty-day service period. RevenueEstimator models a monthly enrolled
    // panel and every string in it says "per month", so pointing it at TCM
    // produces a confidently wrong number. ProgrammePage takes
    // `showEstimator={false}` for exactly this reason. Do not add TCM to the
    // estimator without changing its unit.
    //
    // ███ TCM REQUIRES A FACE-TO-FACE VISIT AND HANA CANNOT DO ONE. ███
    // The claim needs three things: interactive contact within 2 business days
    // of discharge, medication reconciliation, and a face-to-face visit inside
    // 14 days (99495) or 7 days (99496). HANA does the FIRST of those and only
    // the first. The page must never imply otherwise.
    id: "tcm",
    short: "TCM",
    name: "Transitional Care Management",
    code: "99495",
    codes: "99495 · 99496",
    basis: "One qualifying discharge, moderate complexity, with the face-to-face visit inside fourteen days. Billed per discharge, not per month.",
    eligible: "Patients discharged from an inpatient or observation stay back into the community.",
    rate: 220.11,
    placeholder: false,
    year: "CY2026",
    source: "CMS CY2026 PFS: 99495 total non-facility RVUs 6.59 x non-qualifying-APM conversion factor $33.4009 = $220.11. Reproduced from two independent CY2026 chains. 99496 is 8.94 RVUs = $298.60 on the same basis.",
  },
];

/* ── Market context ────────────────────────────────────────────────────────
 * SOURCED 2026-09-05, and the sourcing corrected the figures we were about to
 * publish. Read this before touching the numbers.
 *
 * The pair everyone repeats, "75% of Medicare patients are eligible for CCM but
 * only 4% receive it", is a SPLICE OF TWO STUDIES with two different
 * denominators, and neither study states the pair:
 *
 *   - The 4% is real. ASPE/NORC, 2019 Medicare FFS claims. But that same report
 *     puts eligibility at 63.4%, not 75%.
 *   - The 75% comes from a separate conference abstract (Jang & Kim 2023) whose
 *     denominator is FFS beneficiaries aged 65+, which is why it runs ~12 points
 *     higher. That study reports receiving at 3.4%, not 4%.
 *
 * So "75% eligible, 4% receiving" swaps a number between two papers. Do not
 * publish it. Both figures below come from the single ASPE source, where they
 * are internally consistent.
 *
 * SECOND CORRECTION, arithmetic: 4.0% is already the share OF THOSE ELIGIBLE
 * ("just 4.0 percent of beneficiaries potentially eligible for CCM received any
 * CCM services"). The previous code divided it by the eligible share to derive
 * an enrollment rate, which double-counted. The enrollment rate among eligible
 * patients IS 4.0%.
 *
 * STALENESS, the live commercial risk: both figures describe calendar year 2019,
 * seven years ago. CCM volume has grown a lot since (Avalere, June 2025: ~1.3m
 * beneficiaries received CCM in 2023 against 882,728 in 2019). No primary source
 * restates the eligible-share denominator for a recent year, so a current
 * percentage cannot be computed without dividing across mismatched denominators.
 * Every use of these figures must carry the year and the words "fee-for-service".
 */
export const MARKET = {
  /** Share of Medicare FFS beneficiaries potentially eligible for CCM, 2019. */
  eligiblePct: 63.4,
  /** Share OF THOSE ELIGIBLE who received any CCM service, 2019. */
  receivingPctOfEligible: 4.0,
  dataYear: "2019",
  citation:
    "Colligan E et al., “Analysis of 2019 Medicare Fee-for-Service Claims for Chronic Care Management and Transitional Care Management Services”, NORC at the University of Chicago for HHS ASPE, March 2022.",
  citationUrl:
    "https://aspe.hhs.gov/sites/default/files/documents/31b7d0eeb7decf52f95d569ada0733b4/CCM-TCM-Descriptive-Analysis.pdf",
};

/* The national enrollment rate among ELIGIBLE patients. Taken directly from the
 * source, not derived: dividing it again by the eligible share was the bug. */
export const NATIONAL_ENROLLMENT_PCT = MARKET.receivingPctOfEligible;

/** True while any figure on this page is still a placeholder. */
export const RATES_ARE_PLACEHOLDER =
  !RATES_CONFIRMED || PROGRAMME_RATES.some((r) => r.placeholder);

export function rateFor(id: ProgrammeRate["id"]): ProgrammeRate {
  return PROGRAMME_RATES.find((r) => r.id === id) ?? PROGRAMME_RATES[0];
}

export function isProgrammeId(raw: string): raw is ProgrammeRate["id"] {
  return PROGRAMME_RATES.some((r) => r.id === raw);
}
