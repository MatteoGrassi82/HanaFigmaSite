import type { Recipe } from "../app/components/sections/RecipesMarquee";

/* ── The program card set for Remote's workflow marquee ────────────────────
 * Matteo, 2026-08-19: keep the home-page marquee exactly as it is (cards drift,
 * hover pauses, click opens the steps) and change what the chip says. The chip
 * was an ad-hoc workflow name (Outreach, ADHD, Reactivation); now it is the
 * billable program the workflow runs inside: CCM, APCM, BHI, RTM.
 *
 * These feed RecipesMarquee through its `items` prop, so there is one card
 * component and one marquee, and Home is untouched.
 *
 * FACT CHECK (2026-08-19). CCM 99490: first 20 minutes of clinical staff time a
 * calendar month, two or more chronic conditions expected to last 12 months or
 * more; 99439 each further 20 minutes. APCM G0556 / G0557 / G0558: no time
 * threshold, one bundled monthly payment, thirteen service elements that must be
 * AVAILABLE, tiered by one-or-fewer conditions / two or more / two or more for
 * Qualified Medicare Beneficiaries, and it cannot be billed in the same month as
 * CCM, PCM or TCM for the same patient. BHI 99484: 20 minutes a month; CoCM
 * 99492 / 99493 / 99494: 70 / 60 / 30 minutes. RTM 98975 to 98978: setup and
 * device supply, sixteen days of data in thirty; 98980 first 20 minutes of
 * treatment management and it requires interactive communication with the
 * patient; 98981 each further 20 minutes. TCM (99495 / 99496) is deliberately
 * absent: the strongest phone argument of the set, but there is no module yet.
 *
 * NOT localised: these are US Medicare programs, so an Italian visitor falls
 * back to the built-in Italian recipes until we decide what the Italian
 * equivalent should be.
 */
export const PROGRAM_CARDS: Recipe[] = [
  { tag: "CCM", flow: ["ehr", "voice", "ehr"], title: "Run the monthly check-in for every chronic patient",
    desc: "The panel due this month is the panel that gets called. HANA works the list at the cadence the protocol sets, asks how the care plan is actually going, and writes the call back as a structured summary for your clinician to review and attest.",
    steps: ["Cohort: CCM patients due this month", "HANA calls at the protocol's cadence", "Captures adherence, symptoms and the barrier behind them", "Structured summary into the time log for attestation"],
    systems: ["Epic", "Athena", "eClinicalWorks"] },

  { tag: "CCM", flow: ["voice", "ehr", "alert"], title: "Catch the refill that never happened",
    desc: "Patients rarely volunteer that they stopped taking something. HANA asks what is actually in the cabinet, how often it gets taken, and what got in the way, then flags the gap to the prescriber the same day.",
    steps: ["Monthly call includes a medication pass", "Patient describes what they actually take", "HANA logs the gap in the patient's own words", "Prescriber flagged, no interpretation added"],
    systems: ["Surescripts", "Epic"] },

  { tag: "CCM", flow: ["ehr", "voice", "ehr"], title: "Sweep the panel before the month closes",
    desc: "Twenty minutes only counts if somebody made contact. Late in the month HANA finds every enrolled patient with nothing documented and calls them, so the month closes complete instead of partial.",
    steps: ["Query: enrolled, no documented contact this month", "HANA calls the remainder of the panel", "Two attempts, different times of day", "Contact or attempt recorded either way"],
    systems: ["Epic", "Athena"] },

  { tag: "CCM", flow: ["ehr", "voice", "cal"], title: "Check the care plan is still the plan",
    desc: "A care plan written in March is a guess by September. HANA walks the goals in the plan, records what has changed at home, and books the visit when the plan needs a clinician rather than an adjustment.",
    steps: ["Care plan goals read from the chart", "HANA asks about each one conversationally", "Changes recorded against the plan", "Books a visit when the plan needs rewriting"],
    systems: ["Epic", "Elation"] },

  { tag: "APCM", flow: ["ehr", "voice", "ehr"], title: "Reach the whole panel, not the top of the list",
    desc: "APCM pays a monthly bundle with no minute threshold, which turns care management from a timing problem into a reach problem. HANA makes the monthly contact across every enrolled patient, including the ones a short-staffed month would have skipped.",
    steps: ["Panel: every APCM-enrolled patient", "HANA makes the monthly contact", "Every contact logged and attributed", "Anything clinical routed to your team"],
    systems: ["Epic", "Athena", "Elation"] },

  { tag: "APCM", flow: ["ehr", "voice", "cal"], title: "Follow up after a discharge or an ED visit",
    desc: "Transitions are where patients get lost. HANA calls after the event, checks the patient understood what they were told on the way out, and books the visit your clinician wants them in for.",
    steps: ["Discharge or ED event lands from the feed", "HANA calls the patient", "Teach-back on the discharge instructions", "Books the follow-up and writes the contact to the chart"],
    systems: ["ADT feed", "Epic"] },

  { tag: "APCM", flow: ["voice", "ehr"], title: "Keep a documented line open every month",
    desc: "The bundle asks for enhanced, ongoing communication rather than a fixed number of minutes. HANA answers on the number the patient already has, in the language they speak, and every call becomes part of the record that shows the element was there.",
    steps: ["Patient calls in, or HANA calls out", "Handled in 30+ languages", "Summary written to the chart", "Availability documented rather than asserted"],
    systems: ["Epic", "Athena"] },

  { tag: "BHI", flow: ["ehr", "voice", "alert"], title: "Administer PHQ-9 and GAD-7 by voice",
    desc: "When a scale is due, HANA administers it as a conversation rather than a form, scores it against validated thresholds, and routes an elevated score to your clinical staff the same day.",
    steps: ["Scale due on the schedule", "HANA administers PHQ-9 or GAD-7 by voice", "Scored against validated thresholds", "Elevated score: staff alerted the same day"],
    systems: ["Epic", "Athena"] },

  { tag: "BHI", flow: ["ehr", "voice", "ehr"], title: "Call in the gap between the visits",
    desc: "Behavioral health plans lapse quietly between appointments. HANA makes the between-visit contact, asks about sleep, appetite and adherence, and watches the direction of travel rather than one answer on one day.",
    steps: ["Contact due between scheduled visits", "HANA asks the protocol's questions", "Answers compared with the last call", "Worsening trend calls again sooner and tells your team"],
    systems: ["Epic", "Athena"] },

  { tag: "BHI", flow: ["voice", "alert"], title: "Get a risk answer to a person, live",
    desc: "Some answers cannot wait in a queue. When a patient says something that meets the risk criteria your clinicians set, HANA stops the workflow and hands the call to your staff.",
    steps: ["Answer meets your risk criteria", "HANA stops the workflow", "Warm handover to your on-call staff", "Escalation recorded with the transcript"],
    systems: ["On-call rota", "Epic"] },

  { tag: "RTM", flow: ["ehr", "voice", "ehr"], title: "Make the interactive contact the code requires",
    desc: "98980 needs a real conversation inside the calendar month, not a data download. HANA schedules it, has it, and documents it, so the month is billable because the work actually happened.",
    steps: ["Month opens with the RTM cohort", "HANA holds the interactive conversation", "Notes what the patient reports", "Documented contact ready for attestation"],
    systems: ["Device portal", "Epic"] },

  { tag: "RTM", flow: ["ehr", "voice", "ehr"], title: "Ask about the nights the data dipped",
    desc: "The device says usage fell on Tuesday. Only the patient knows why. HANA brings the number into the conversation, records the reason in their words, and checks it against the threshold your clinician set.",
    steps: ["Device data shows a dip", "HANA calls and asks what happened", "Reason recorded in the patient's own words", "Checked against your threshold, flagged rather than interpreted"],
    systems: ["PAP device portal", "Epic"] },

  { tag: "RTM", flow: ["ehr", "alert", "voice"], title: "Keep the sixteen-day window from quietly breaking",
    desc: "The supply codes need sixteen days of data in thirty. HANA watches the running count, calls the patient while there is still time to recover it, and hands your team the at-risk list instead of a surprise at month end.",
    steps: ["Running count of transmitting days", "Slipping patients surfaced early", "HANA calls about the gap", "Team gets the at-risk list, not a surprise"],
    systems: ["Device portal", "Epic"] },
];

/* ── The /care page's set (Matteo, 7 Oct 2026: "be more PCM, BHI, TCM, APCM,
 * ACCESS, all that stuff") ──────────────────────────────────────────────────
 *
 * PCM and TCM were added here on 2026-09-02 and pulled the same day, when the
 * build had no module for either. The 24 Sep 2026 capability list (CCM, TCM,
 * APCM, PCM, BHI and CoCM supported today; RPM and RTM roadmap) is the later
 * document, so they are back, for /care only. The homepage still reads
 * PROGRAM_CARDS minus RTM and is unchanged.
 *
 * TCM GUARDRAIL. The two-business-day interactive contact must be made by
 * CLINICAL STAFF (CMS TCM booklet). HANA's call is never that contact, and both
 * TCM cards say so in the description. HANA books the face-to-face visit and
 * gathers the medication list; the contact and the reconciliation are yours.
 *
 * ACCESS reverses the 2026-08-04 rule that kept it out of Remote copy, at
 * Matteo's request. The cards say only what the live /programs/access-model
 * page says: half of each payment is held back until outcome measures come in,
 * and HANA keeps the check-ins on time. They do not claim HANA supplies the
 * device reading the CKM tracks require.
 */
export const PCM_CARDS: Recipe[] = [
  { tag: "PCM", flow: ["ehr", "voice", "ehr"], title: "Give the one-condition patient a monthly call",
    desc: "Principal care management pays for thirty minutes of clinical staff time a month on one serious condition. HANA makes the monthly contact, keeps it on that condition, and writes it up for your clinician to review and attest.",
    steps: ["Cohort: one complex chronic condition", "HANA calls at the protocol's cadence", "Asks the disease-specific questions your clinicians scoped", "Summary to the chart for review and attestation"],
    systems: ["Epic", "eClinicalWorks"] },

  { tag: "PCM", flow: ["voice", "alert", "ehr"], title: "Hear the decline before the admission",
    desc: "For heart failure it is weight, breath and swelling; for COPD it is the inhaler and the stairs. HANA asks what your clinicians want asked about the one condition and flags any answer past their threshold the same day.",
    steps: ["Condition-specific check-in", "Answer checked against your threshold", "Flag to the named clinician, same day", "Patient's own words kept in the note"],
    systems: ["Epic", "Athena"] },
];

export const TCM_CARDS: Recipe[] = [
  { tag: "TCM", flow: ["ehr", "voice", "cal"], title: "Get every discharge to the follow-up visit",
    desc: "TCM needs a face-to-face visit inside 7 or 14 days of discharge. When a discharge lands, HANA calls to book it and checks how the patient is managing. The two-business-day interactive contact the code requires is made by your clinical staff, not by HANA.",
    steps: ["Discharge arrives on the worklist", "Your clinical staff make the two-business-day contact", "HANA books the face-to-face visit", "Anything worrying flagged before the visit"],
    systems: ["Epic", "Athena"] },

  { tag: "TCM", flow: ["voice", "ehr"], title: "Have the medication list ready before the visit",
    desc: "Medication reconciliation is due by the date of the visit. HANA asks the patient what they are actually taking since discharge and puts the list in the chart, so your clinician reconciles it instead of starting from scratch.",
    steps: ["HANA asks what is actually being taken", "New, stopped and changed medicines noted", "List in the chart before the visit", "Your clinician does the reconciliation"],
    systems: ["Epic", "Surescripts"] },
];

export const ACCESS_CARDS: Recipe[] = [
  { tag: "ACCESS", flow: ["ehr", "voice", "ehr"], title: "Keep every ACCESS check-in on time",
    desc: "In the CMS ACCESS model, half of each payment is held back until patients' outcome measures come in. HANA calls and texts enrolled patients when a check-in is due, so each one lands inside the window CMS counts.",
    steps: ["Patients enrolled in an ACCESS track", "HANA calls or texts when a check-in is due", "Answers recorded in the patient's own words", "Missed windows flagged to your team"],
    systems: ["Epic", "Athena", "eClinicalWorks"] },

  { tag: "ACCESS", flow: ["voice", "alert"], title: "Flag the patient who is slipping",
    desc: "Between measures, HANA asks how things are going, for pain and movement on the musculoskeletal track or mood on the behavioral health track, and flags anyone getting worse while there is still time to act.",
    steps: ["Between-measure check-in", "Answer compared with the last one", "Worsening flagged to your team", "Next measure stays on schedule"],
    systems: ["Epic", "Athena"] },
];

/** /care's marquee: every program HANA runs today, grouped by program. RTM is
 *  out (roadmap), PCM, TCM and ACCESS are in. */
export const CARE_PAGE_CARDS: Recipe[] = [
  ...PROGRAM_CARDS.filter((c) => c.tag === "CCM"),
  ...PCM_CARDS,
  ...PROGRAM_CARDS.filter((c) => c.tag === "APCM"),
  ...PROGRAM_CARDS.filter((c) => c.tag === "BHI"),
  ...TCM_CARDS,
  ...ACCESS_CARDS,
];
