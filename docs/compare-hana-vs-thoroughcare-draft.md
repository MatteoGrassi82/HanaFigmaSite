# Draft: /compare/hana-vs-thoroughcare

**Status:** draft for human review. Not published, not in any route list. Lives in docs/ (content-drafts/ is git-ignored) so it travels with the repo.
**Shape:** the page pattern that wins "X alternatives" and "X vs Y" on Google, Perplexity and ChatGPT today (CCN Health, HealthArc, Accelerate): direct answer first, one comparison table, "choose X if / choose Y if", six FAQs with FAQPage schema, links to sibling compare pages.
**Sources:** every ThoroughCare fact below was read from thoroughcare.net on 12 Sep 2026 (homepage, /chronic-care-management-software, /solutions/care-management-software). Every HANA fact is already on hana.health. Nothing here is inferred from third-party summaries. Re-verify ThoroughCare facts before publishing; their site changes.
**Guardrails applied:** no em dashes; no ACCESS in Remote copy; "30+ languages"; HANA never generates billable time; SOC 2 "in progress".

---

## Title / meta

- Title: HANA vs ThoroughCare: the engagement layer or the care-management platform?
- Description: ThoroughCare runs the CCM program. HANA makes the patient calls. A plain comparison of what each does, where they overlap, and how practices run both.
- Canonical: https://www.hana.health/compare/hana-vs-thoroughcare
- Breadcrumb: Home › Compare › HANA vs ThoroughCare

## H1

HANA vs ThoroughCare

## Direct answer (first 80 words, this is what engines quote)

ThoroughCare and HANA solve different halves of the same problem. ThoroughCare is care-coordination software: a clinician-facing system of record for CCM, RPM, APCM, BHI, PCM, TCM and Annual Wellness Visits, with care plans, time logs, CPT coding and analytics. HANA is a clinical voice AI that makes the between-visit patient calls, follows a clinician-built protocol, and writes the structured note back to the chart. Practices that need a program platform choose ThoroughCare. Practices whose bottleneck is reaching patients choose HANA. Many need both.

## Quick comparison

| | HANA | ThoroughCare |
|---|---|---|
| What it is | Clinical voice AI that calls and texts patients | Care-coordination software, est. 2013 |
| Who uses it day to day | The patient, on the phone; the clinician, on a flagged worklist | Care managers and clinicians, in the platform |
| Programs | CCM, APCM, BHI, RTM device-free; RPM as the engagement layer over existing devices | CCM, RPM, APCM, BHI, PCM, TCM, AWV, Advance Care Planning |
| Patient outreach | AI conducts the call: reads the chart, runs the protocol, escalates on thresholds | Care manager conducts the call; secure texting and WebMD Ignite education content (17 languages) |
| Documentation | Structured note written to the EHR after every call, attributed to a named clinician for attestation | Time logs, service tracking and automated CPT coding (99490, 99439, 99487, 99489, 99491, 99437, G0511) |
| AI | Dual-model: a reasoning engine plans the call, a voice model speaks it; self-hosted | TC Compass: Smart Summary synthesises patient data for the care manager |
| EHR | Direct integrations, or 95+ systems through Redox; reads and writes back | Bi-directional interoperability with EHRs, HIEs, remote monitoring devices, and a patient mobile app |
| Languages | 30+ | Education content in 17 languages |
| Clinical services | Protocol library built with clinicians; escalation to your named clinician | Clinical Advisory Team: workflow design, training, documentation review, audit preparation |
| Scale (their own numbers) | [use the one confirmed interaction count; see listing-kit §0] | 140+ care delivery organisations, 1M+ patients, $1MM monthly reimbursements |
| Billing | Does not bill and does not generate clinical minutes; prepares the documentation | Tracks and reports billable services and CPT codes |
| Pricing | Custom, typically per actively managed patient per month | Not published; consultation |

## Where they overlap

Both touch patient engagement. ThoroughCare gives care managers texting and educational content to keep patients in the program. HANA replaces the routine outbound call itself. If your care managers spend most of their month dialling, HANA takes that work. If they spend most of their month documenting and planning, ThoroughCare is built for that.

## Where they don't

**ThoroughCare does things HANA does not.** It is the registry: eligibility, enrolment status, care plans with SMART goals, risk assessments, SDOH capture, task assignment, claims and missed-revenue analytics across sites, Annual Wellness Visits, Advance Care Planning. HANA does none of that. It has no patient app, no care-plan builder, no CPT engine.

**HANA does things ThoroughCare does not.** It makes the call. A ThoroughCare care manager still has to reach the patient; TC Compass summarises the chart for them, it does not dial. HANA reads the chart, calls or texts the patient in their language, runs the condition protocol, and writes the note. The human steps in on a flag.

## Choose HANA if

- Your CCM or APCM program has the platform but not the reach: patients are enrolled and nobody can get them on the phone.
- Your care managers are the constraint and hiring more is not the plan.
- You already run a care-management system (ThoroughCare or another) and want the calls automated inside it.
- Post-discharge, intake, pre-op or behavioural-health screening calls are part of the same problem.

## Choose ThoroughCare if

- You are standing up CCM, RPM or APCM from nothing and need the program machinery: care plans, time tracking, coding, compliance.
- You want a Clinical Advisory Team to design workflows and prepare you for audit.
- You need Annual Wellness Visit and Advance Care Planning workflows.
- You want analytics across many sites and a patient mobile app.

## Running both

ThoroughCare identifies the eligible patient and holds the care plan. HANA makes the monthly call, captures symptoms and adherence, and returns a structured note. The care manager reviews the flag, attests the time, and ThoroughCare codes the claim. Nothing about HANA's call is counted as clinical time; the qualified staff member's review is.

## FAQ (FAQPage schema)

**Is HANA a replacement for ThoroughCare?**
No. ThoroughCare is a care-coordination platform; HANA is the voice layer that makes the patient calls. A practice can run HANA alongside ThoroughCare or any other care-management system.

**Does HANA track CCM minutes or assign CPT codes?**
No. HANA writes the structured documentation. A named, qualified staff member supplies and attests the billable time in your platform of record. ThoroughCare, by contrast, automates CPT coding for CCM codes including 99490 and 99491.

**Which supports more programs?**
ThoroughCare lists eight: CCM, RPM, APCM, BHI, PCM, TCM, AWV and Advance Care Planning. HANA runs call workflows for CCM, APCM, BHI and RTM without a device, and acts as the engagement layer on top of the devices an RPM program already uses. HANA does not run AWV or Advance Care Planning.

**Does either one use AI?**
Both. ThoroughCare's TC Compass produces a Smart Summary of the patient for the care manager. HANA's AI is the caller: a reasoning model plans the conversation from the chart and the protocol, a voice model conducts it, and the result is written back.

**What about RPM?**
RPM codes require an FDA-defined device that transmits readings. ThoroughCare ingests device data into its platform. HANA does not replace the device; it keeps the patient engaged and transmitting, and chases the quiet days.

**How do the two integrate with the EHR?**
ThoroughCare describes bi-directional interoperability with EHRs, HIEs and remote monitoring devices. HANA integrates directly with major EHRs or reaches 95+ systems through Redox, reading the chart before the call and writing the note after it.

## Sibling pages to link (publish together)

- /compare/vs-care-management-software
- /compare/vs-outsourced-care-management
- /compare/vs-doing-nothing
- /programs/chronic-care-management
- /programs/advanced-primary-care-management

## Before publishing

1. Confirm the single patient-interaction count and put it in the table.
2. Pricing settled 13 Sep 2026: custom, typically per actively managed patient per month. But /pricing still says "$150 per provider per month" and /faq says pricing is "a conversation rather than a figure" — reconcile those two live pages before this one links to either.
3. Re-read thoroughcare.net; update the table if their program list or TC Compass description changed.
4. Route + SEO: add to App.tsx, STATIC_ROUTES, sitemap; FAQPage + BreadcrumbList schema via existing helpers.
5. Legal read: every ThoroughCare statement is a description of their public marketing, not a judgement. Keep it that way.
