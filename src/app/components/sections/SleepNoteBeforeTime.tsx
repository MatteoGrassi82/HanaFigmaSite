import { MonthWrittenUp, type LogEntry } from "./MonthWrittenUp";

/* ── The month, written up before the clinician starts their time (Sleep) ────
 * On 7 Sept 2026 the section body moved to MonthWrittenUp so the programme
 * pages could use it. This file is now only the CPAP data it always carried,
 * verbatim, and the copy RemoteV2 §9a was signed off with. Nothing rendered on
 * /remote-v2 changed. */

const SLEEP_LOG: LogEntry[] = [
  {
    day: "Aug 3",
    title: "Night 1 · first check-in",
    body: "Mask felt tight. She took it off at 2h 10m.",
    src: "HANA call · summarised",
    len: "4 min",
  },
  {
    day: "Aug 4",
    title: "Night 2 · fit coaching",
    body: "Top strap loosened a notch. Agreed to try again the same night.",
    src: "HANA call · summarised",
    len: "6 min",
  },
  {
    day: "Aug 6",
    title: "Threshold crossed",
    body: "4h 20m. First night above four hours.",
    src: "Device data · flagged to the threshold you set",
    len: "",
  },
  {
    day: "Aug 10",
    title: "Weekly check-in",
    body: "5h 05m average across the week. Cadence drops to weekly.",
    src: "HANA call · summarised",
    len: "5 min",
  },
];

export function SleepNoteBeforeTime() {
  return (
    <MonthWrittenUp
      entries={SLEEP_LOG}
      badge="New program"
      pill="HANA Sleep"
      chip="RTM 98980"
      body="HANA calls the new CPAP patient through the week that decides whether therapy holds, and every call is recorded and summarised straight into the time log. When your clinician opens the patient, the month is already there. The clock they start runs on reading and attesting, not typing."
      stats={[
        { value: "0:00", label: "Time your team spends writing the month up" },
        { value: "4", label: "Documented contacts waiting when they open the chart" },
      ]}
      cta={{ label: "See HANA Sleep", href: "/sleep" }}
    />
  );
}

export default SleepNoteBeforeTime;
