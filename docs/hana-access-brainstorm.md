# Hana × CMS ACCESS — Research & Brainstorm

> Research compiled June 2026 from CMS primary sources (ACCESS RFA v1.1, Feb 12 2026; Payment Amounts & Performance Targets doc) plus industry/clinical literature. Every claim is source-linked. Confidence tags: **[strong]** / **[plausible]** / **[stretch]**. See §5 for caveats — some claims were flagged overstated by adversarial verification and should not be read as settled fact.

## 1. TL;DR

- **Hana's single most defensible move is a distribution play, not a product pitch: get listed in the CMS ACCESS [Tools Directory](https://www.nixonlawgroup.com/resources/cms-launches-access-model-the-tools-directory-opportunity-for-digital-health-vendors)** — a CMS-sanctioned channel built specifically for non-participant vendors to reach all ~150 participants at once, with no Medicare enrollment required and Hana's FHIR `$report-data` output mapping directly to its "data exchange/interoperability" category.
- **Sell INTO participants, never become one.** ACCESS participation legally requires Medicare Part B enrollment ([CMS](https://www.cms.gov/priorities/innovation/access-model-accepted-applicants)); pure software vendors are structurally excluded. Hana is the white-label engagement layer beneath a Part B participant — the [list of 150+ accepted applicants](https://www.cms.gov/priorities/innovation/access-model-accepted-applicants) is overwhelmingly care-*delivery* entities, none positioned as a horizontal voice+SMS PROM layer.
- **The ICP is the cost-squeezed long tail, not the unicorns.** Omada, Hinge, and Sword all *declined* the first cohort because the rates don't cover high-touch care ([Fierce](https://www.fiercehealthcare.com/health-tech/deeper-dive-access-model-whos-participating-potential-headwinds-and-how-it-could-spur)). The orgs that *did* enter — small PC/specialty groups, FQHCs, AI-native startups, "most of whom have never served Medicare" ([CMS](https://www.cms.gov/priorities/innovation/access-model-accepted-applicants)) — must hit outcome targets on a shoestring and cannot staff it with people.
- **The economic wedge is sharp: ~$216/patient/month of RPM+CCM billing traded for ~$35 max** ([Capstone via Fierce](https://www.fiercehealthcare.com/digital-health/low-pay-rates-medicares-access-model-will-pressure-digital-health-margins-capstone)), with **50% of even that withheld** for 12 months and released only if the org clears a 50% Outcome Attainment Threshold ([CMS payment doc](https://www.cms.gov/priorities/innovation/files/access-payments-amts-perf-targets.pdf)). Hana's $3/patient base + 10%-of-released-withhold fee reframes it as revenue-recovery insurance, not a cost line.
- **The strongest single product fit is the Follow-On re-consent conversation** — a recurring, deadline-bound, billing-gating call that recurs every 12 months for every retained patient across a 10-year model. Missing the 60-day pre-window means the participant simply *cannot bill* ([ACCESS RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf)). This is cleaner than the generic PROM-reminder story because the failure mode is unambiguous and self-inflicted.
- **The population evidence is real and on Hana's side: Medicare patients under-complete portals.** Only 55% of portal-having 50–80 year-olds used it in the past month and 47% prefer calling ([U-Michigan NPHA](https://ihpi.umich.edu/national-poll-healthy-aging/national-findings/use-and-experiences-patient-portals-among-older)); a Medicare THA study hit OAT-passing 75–85% completion *only* by adding active phone follow-up to passive outreach (passive alone: 45–52%) ([PMC12634202](https://pmc.ncbi.nlm.nih.gov/articles/PMC12634202/)).
- **But Hana's headline 85% engagement / 70–80% WHODAS numbers are NOT externally proven for autonomous AI.** A 2025 review found the entire voice-AI engagement category is vendor-reported and not peer-reviewed ([Deepgram](https://deepgram.com/learn/ai-voice-agents-patient-engagement-evidence)); the closest real anchors (75–88% completion) come from *human-staffed* phone follow-up. Lead with the *channel* evidence, label the 85% as a pilot target.
- **Two factual corrections the live /access page needs before any informed sales conversation:** MSK OAP is **$15/mo not $20** ($180/yr, no follow-on), and **WHODAS 2.0 is the OPTIONAL 12-item version, not a required 36-item measure** — the required BH lift is PHQ-9 + GAD-7 + PGIC ([CMS payment doc](https://www.cms.gov/priorities/innovation/files/access-payments-amts-perf-targets.pdf)).

---

## 2. Research by Angle

### (a) ACCESS gaps as Hana opportunities

The ACCESS Model's operationally heavy components — alignment/eligibility, voluntary consent + the 90-day rule, the Initial→Follow-On re-consent transition, the Substitute Spend Adjustment, and multi-track coordination — are fundamentally patient-contact problems with hard deadlines and documentation requirements. All quotes below are anchored to the [ACCESS RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf) (v1.1, Feb 12 2026).

**Key findings**

- **Alignment is a discrete, documentable workflow:** query Eligibility API → validate clinical eligibility → provisionally align via Alignment API → submit baseline measures within a defined window. Disenrollment is a status change, not a separate API; patients may switch/disenroll any time after 90 days ([RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf)).
- **Baseline capture is the make-or-break, time-boxed touch:** provisional alignment is not durable until baseline clinical + PRO measures are submitted, and missing the window forfeits enrollment. For eCKM/CKM, BP must come from a validated upper-arm cuff via timestamped transmission — "Manual entry is not permitted." Patient-attested HTN that turns out non-qualifying causes *full recoupment* unless the participant submits the non-qualifying readings (then keeps up to 2 months) ([RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf)).
- **A CMS-scripted disclosure is mandatory BEFORE any API query** — covering model-test status, data sharing, and the 90:10 randomization that locks control-group patients out for 12 months. "Participants will be required to use standardized language provided by CMS" ([RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf)).
- **The Initial→Follow-On transition is a hard, recurring RE-CONSENT event:** "At the start of each Follow-On Period, Participants must: Obtain and document beneficiary consent to continue no more than 60 days prior… to remain eligible to bill," re-validate medical necessity, and submit a new baseline if the prior measure is stale. The Follow-On target *re-bases* on the new baseline ([RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf)).
- **The Substitute Spend Adjustment is a claims-driven penalty capped at 25%** (reported across secondary analyses; see §5 caveat), measured by the Substitute Spend Rate against a 90% threshold. Patients "remain free to see other providers"; participants get Medicare A/B/D claims via the BCDA API to coordinate. Patient engagement is only an *indirect* lever ([RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf); [techysurgeon](https://techysurgeon.substack.com/p/cms-access-models-substitute-service)).
- **Non-stacking:** CMS applies only the *larger* of the Clinical Outcome Adjustment or the Substitute Spend Adjustment per reconciliation — so pushing OAR up only protects the withhold if SSR isn't the binding penalty ([RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf)).
- **Multi-track patients trigger a flat 5% discount on the lower-cost track(s)** with the same participant; eCKM and CKM are mutually exclusive (immediate switch allowed) ([RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf)).
- **Care coordination is mandated and deadline-bound** — standardized updates within 10 days of care initiation, 30 days after the care period, and 10 days of escalation (per secondary summary; see §5) — and gates a separate PCP Co-Management Payment (~$30/service, ~$100/yr). "Before sharing updates, Participants must obtain the beneficiary's consent" ([RFA](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf); [Longyear](https://longyearhealth.substack.com/p/a-deeper-dive-on-the-cms-access-model)).

**Hana angle**

- **[strong] Own the Follow-On re-consent + re-baseline conversation** as a recurring, deadline-driven campaign: fire a scripted voice/SMS call inside the 60-day pre-window to re-obtain and document consent-to-continue, re-confirm PCP info, trigger a fresh baseline if stale, then write the timestamped attestation back to the EHR. Pure deadline-bound outreach that directly gates billing.
- **[strong] Be the alignment/onboarding front door:** deliver the CMS-scripted disclosure verbatim, capture voluntary consent, record the PCP/referring-clinician contact (a required step), and schedule/capture the first qualifying baseline reading — handing the participant an alignment-ready packet. *Be explicit that Hana does NOT call the Eligibility/Alignment APIs or make the clinical-eligibility determination* — it is the conversation + documentation layer that feeds alignment.
- **[plausible] Run the "non-qualifying hypertension" confirmation outreach:** proactively collect the follow-up home/ambulatory BP readings early so participants either confirm eligibility or capture the non-qualifying readings in time to retain up to 2 months of payment and avoid full recoupment.
- **[plausible] Treat the 90-day cliff and months 7–12 withhold as a retention problem:** run an engagement cadence that keeps patients past the voluntary-disenroll cliff and active when 50% of OAP is at stake, surfacing disengagement risk to staff. Position as risk-flagging + cadence, *not* guaranteed retention (the "more calls → fewer disenrollments" link is assumed).
- **[plausible] Multi-track orchestration:** consolidate 2+ tracks into a single combined contact per touch (e.g., one call covering BP/HbA1c and PHQ-9/GAD-7), encode the eCKM↔CKM exclusivity and immediate-switch logic. *Do not imply Hana captures or offsets the 5% discount* — that accrues to CMS math regardless; Hana reduces the operational abrasion of serving multi-track patients.
- **[stretch] Substitute Spend leakage early-warning:** ingest the BCDA A/B/D feed and flag substitute-listed service initiation (or patient-mentioned outside visits) for redirection into in-program care. Stretch because SSR is fundamentally a claims-analytics + clinical-capacity problem, patients are legally free to leave, claims data is lagged, and SSR may not be the binding penalty. Position as conversational detection feeding a coordination workflow, NOT a "fix."
- **[stretch] Auto-draft the standardized care-coordination update + capture the consent-to-share that gates it.** Stretch because the actual secure transmission (DSM/HIE), FHIR Care Update profile, and clinician sign-off sit outside a pure engagement layer — Hana supplies consent + draft content, not the interoperability plumbing.

---

### (b) Competitive landscape

**Key findings**

- **CMS published a [list of 150+ accepted applicants](https://www.cms.gov/priorities/innovation/access-model-accepted-applicants)** (updated May 27 2026) across four tracks (eCKM, CKM, MSK, BH); launch July 5 2026, a 10-year voluntary CMMI model in Original Medicare. Private payers covering 165M members have pledged to align — a TAM far larger than the 150 named orgs.
- **The named participants are overwhelmingly care-DELIVERY entities, not engagement infrastructure** — RPM/device shells (WHOOP, Withings, Aidar, AliveCor), care-management platforms (Verily, Cecelia, Welldoc, Story Health), behavior-change (Noom, WW, Headspace), condition-specific clinical (Evergreen Nephrology, Somatus, Bold, TailorCare), VBC enablers (Aledade, Pair Team, Guidehealth), food-as-medicine (Foodsmart, NourishedRx). **None is positioned as a horizontal voice+SMS PROM layer** — that's Hana's wedge as a *supplier* to the list ([Longyear](https://longyearhealth.substack.com/p/analyzing-the-cms-access-model-participants)).
- **The AI-native cohort (Slingshot, Scaled Insights, Doctronic, Curai, Wysa) are care-DELIVERY substitutes**, not outreach infrastructure sold to peers — they own the clinical relationship and bill OAP themselves; adjacent to Hana, not direct competitors ([Longyear](https://longyearhealth.substack.com/p/analyzing-the-cms-access-model-participants)).
- **The CMS [Tools Directory](https://www.nixonlawgroup.com/resources/cms-launches-access-model-the-tools-directory-opportunity-for-digital-health-vendors)** is a first-of-its-kind channel for *vendors* (not participants) to list software/interoperability/data-exchange tools — no Medicare enrollment required, promotional offers allowed. The single most actionable finding.
- **OAP rates run ~$7.50–$35/beneficiary/month**, 50% withheld and released only if Outcome Attainment Rate ≥ 50% threshold ([TechTarget](https://www.techtarget.com/virtualhealthcare/news/366641624/CMS-taps-Verily-Noom-150-others-to-participate-in-ACCESS-model)).
- **Closest direct competitors are voice-AI players, positioned differently.** [Hippocratic AI](https://www.fiercehealthcare.com/ai-and-machine-learning/hippocratic-ai-lands-126m-series-c-expand-patient-facing-ai-agents-fuel-ma) (clinical-grade voice, 180M+ interactions, $126M Series C, a reported 275% survey-response lift) targets post-discharge/CCM/AWV outreach but does not prominently document deep bidirectional read-chart/write-notes EHR ops; Infinitus skews administrative/payer. Neither is framed around the OAT/withheld-OAP mechanic or success-fee pricing.
- **Several participants embed their own engagement engines** (Welldoc publishes a [2.5x engagement lift](https://www.welldoc.com/news/welldoc-and-xealth/); Cecelia is "designed to improve engagement"), so they are both prospects AND build-vs-buy competitors. Hana can't sell generic "engagement" to them — only the specific ACCESS gap (validity-windowed PROM completion, conversational completion for non-portal Medicare patients, ACCESS-IG FHIR output).
- **Track distribution skews BH and metabolic:** ~80+ BH participants (nearly 20 BH-only), ~60–70 MSK, few MSK-only; analysts expect BH most profitable and predict the failure mode will be "plumbing" — Part B enrollment, FHIR/outcome reporting at scale ([Longyear](https://longyearhealth.substack.com/p/analyzing-the-cms-access-model-participants)).

**Hana angle**

- **[strong] Get listed in the CMS ACCESS Tools Directory** as a "data exchange / interoperability + engagement" tool, explicitly NOT a participant and NOT RPM — a CMS-sanctioned way to reach all 150+ at once.
- **[strong] Sell into the ~80+ BH participants as the PHQ-9 / GAD-7 / PGIC completion engine** (see correction below re: WHODAS). BH is the largest, highest-margin track and 100% patient-reported with no device shortcut.
- **[plausible] Differentiate vs Hippocratic on "reads chart + writes structured notes back + outcome-aligned pricing," not raw voice quality** — Hippocratic's public materials describe outreach/communication, not deep bidirectional EHR ops, and it isn't framed around OAT or success-fee pricing.
- **[plausible] Target smaller, under-resourced MSK and RPM-device participants** (Bold, Plethy, TailorCare, JOGO; WHOOP/Withings/Aidar) who lack consumer-grade outreach — Hana complements devices because it is explicitly NOT-RPM.
- **[plausible] Pitch the VBC enablers (Aledade, Cadence, Pair Team, Guidehealth, CareHarmony)** as white-label infrastructure across their multi-state ACCESS entities; lead with the NOT-RPM, PROM-completion-and-FHIR framing for the RPM-centric ones.
- **[stretch] Use the 165M-member payer-alignment pledge to expand TAM** beyond the 150 — a forward-looking platform narrative, not yet a proven pipeline.

---

### (c) Buyer & market profile

**Key findings**

- **ACCESS participation legally requires Medicare Part B enrollment** (excluding DME/orthotics/lab suppliers), with a designated Medicare-enrolled medical director — the single biggest gating factor on WHO can buy. Pure SaaS vendors *cannot* be participants; they sell INTO them ([CMS](https://www.cms.gov/priorities/innovation/access-model-accepted-applicants)).
- **"Most [of the ~150] have not previously served Medicare beneficiaries"** — the list is dominated by small single-state PCs, specialty practices (cardiology, nephrology, BH, MSK/PT), FQHC-type centers (Mariposa, Beacon Christian, MLK Jr Community, One Brooklyn), and AI-native startups ([CMS](https://www.cms.gov/priorities/innovation/access-model-accepted-applicants)).
- **The best-capitalized players declined:** Omada and Hinge didn't apply; Sword isn't participating. Omada's president said the rates "don't cover the cost of delivering high-quality, evidence-based care" ([Fierce](https://www.fiercehealthcare.com/health-tech/deeper-dive-access-model-whos-participating-potential-headwinds-and-how-it-could-spur)).
- **Official OAP annual amounts:** eCKM $360/$180, CKM $420/$210, MSK $180 (no follow-on), BH $180/$90 — i.e. ~$30/$15, $35/$17.50, **$15**, $15/$7.50 per month; rural eCKM/CKM Initial gets +$15 for connected-device support ([CMS payment doc](https://www.cms.gov/priorities/innovation/files/access-payments-amts-perf-targets.pdf)).
- **The revenue cliff:** the same chronic patient generates ~$216.83/mo under RPM+CCM vs ~$35 max under ACCESS. Attorney Carrie Nixon: "Why would medical practices give up $216.83… for a $35/month payment?" Capstone: survival "hinges on participant volume, beneficiary volume" with risk of negative margins ([Capstone via Fierce](https://www.fiercehealthcare.com/digital-health/low-pay-rates-medicares-access-model-will-pressure-digital-health-margins-capstone)).
- **Full payment requires the 50% Outcome Attainment Threshold**, and "failure to report a valid required OAP Measure within the end-of-period reporting window constitutes non-attainment" — a missed PROM is a *FAIL*, not neutral; lost-to-follow-up patients stay in the denominator. CMS set 50% deliberately generous, expecting disengagement to be the failure mode ([CMS payment doc](https://www.cms.gov/priorities/innovation/files/access-payments-amts-perf-targets.pdf)).
- **Tight validity windows:** BP, weight, and ALL PROMs valid only within 15 days of submission; labs 1–2 years; baseline due within 60 days of alignment or the beneficiary is unaligned and services may not be provided ([CMS payment doc](https://www.cms.gov/priorities/innovation/files/access-payments-amts-perf-targets.pdf)). *(Note: this "15-day" figure comes from the payment/performance-targets doc and refers to measure-submission validity, not the "15-day outreach window" the live page implies — see §3.)*
- **Required BH PROMs are PHQ-9, GAD-7, PGIC; WHODAS 2.0 is the 12-item version and OPTIONAL for 2026–2027** ([CMS payment doc](https://www.cms.gov/priorities/innovation/files/access-payments-amts-perf-targets.pdf)).
- **Attribution is voluntary and prospective** (patient self-aligns or via PCP referral; no claims-based attribution, no published minimum panel) — so engagement spans the whole funnel: activation, 60-day baseline, and 12-month completion ([CMS](https://www.cms.gov/priorities/innovation/innovation-models/access)).
- **The PCP Co-Management workflow is "up for grabs"** (~$30/review, ~$100/yr) — participants win referrals by being low-friction and outcome-strong ([Fierce](https://www.fiercehealthcare.com/health-tech/deeper-dive-access-model-whos-participating-potential-headwinds-and-how-it-could-spur)).
- **The population under-uses portals:** only 55% of portal-having 50–80 year-olds used it in the past month, 49% are comfortable with portals, 40% prefer a phone call to report health info, with markedly lower comfort among lower-income and Black/Hispanic older adults ([U-Michigan NPHA](https://ihpi.umich.edu/national-poll-healthy-aging/national-findings/use-and-experiences-patient-portals-among-older)).
- **Participants themselves frame ACCESS as a "use software, not headcount" forcing function** — Empirical Health's Ballinger: "Medicare has set the reimbursement rates such that you have to use software, not just headcount" ([Fierce](https://www.fiercehealthcare.com/health-tech/deeper-dive-access-model-whos-participating-potential-headwinds-and-how-it-could-spur)).
- **Multi-payer beachhead:** 165M commercial/MA/Medicaid lives pledged to align via CMS's shared FHIR API and G-codes ([Fierce](https://www.fiercehealthcare.com/digital-health/cms-taps-150-digital-health-companies-providers-access-model)).

**Hana angle**

- **[strong] Make the long tail the ICP** — small PC/lifestyle/specialty groups, FQHCs, and AI-native startups that never served Medicare and can't staff engagement under the rates — not the unicorns who walked away.
- **[strong] Lead with the FFS-vs-ACCESS cliff and the at-risk withhold:** "You're trading ~$216/patient/month of RPM+CCM for ~$35 — and half of *that* is withheld until your patients respond. Hana protects the half you only get back if patients complete." The 10%-of-released-withhold fee mirrors the at-risk dollars honestly.
- **[strong] Make voice-first the hero, backed by the portal data, and position Hana as "not a portal"** — since unreported measures = OAT failure, portal-based collection structurally caps OAR for this population.
- **[strong] Engineer and market outreach scheduling around the CMS validity windows** — the 15-day BP/weight/PROM submission windows, the 60-day baseline-or-unaligned rule, the quarterly cadence, and the end-of-period window. A concrete differentiator generic reminder tools lack.
- **[strong] Reposition the BH pitch around the actually-required PHQ-9/GAD-7/PGIC** and recast WHODAS as the optional 12-item value-add for orgs preparing for the future functional measure — overstating it is a credibility risk with informed buyers.
- **[plausible] Sell to the right decision-makers:** owner-physician/managing partner + practice administrator in small groups; founder/CEO, VP of value-based care, or medical director in tech-enabled participants. The mandated Medicare-enrolled medical director is a built-in clinical champion.
- **[plausible] Offer white-label/SDK "shared infrastructure"** so a participant looks scaled to PCPs and wins the up-for-grabs co-management referral flow.
- **[plausible] Add a CFO durability argument:** the same engagement + FHIR OAP-reporting stack is reusable for the 165M-member payer pledge.
- **[plausible] Build track-specific "OAR rescue" offers**, prioritizing eCKM/CKM (highest $, 15-day BP/weight cadence) and BH (high count of small groups), with MSK secondary.

---

### (d) Proof points

External evidence broadly **supports the channel direction** of Hana's thesis (phone/voice + active follow-up beats passive portal self-completion for older Medicare patients; PHQ-9/GAD-7/WHODAS are reliable by voice) but **does NOT support Hana's specific headline numbers as proven AI outcomes.**

**Key findings**

- **Medicare THA PROM study:** 1-year completion reached 75% (inpatient) / 85% (outpatient) — but *only* by adding intensive active phone follow-up to passive outreach (passive alone captured just 45% / 52%); a prior study hit only 49.9%, failing the CMS ≥50% threshold. The most ACCESS-relevant data point — but the 75–85% was achieved by *human staff* ([PMC12634202](https://pmc.ncbi.nlm.nih.gov/articles/PMC12634202/)).
- **WHODAS 2.0 by telephone vs face-to-face** in adults 60–95: total-score ICC = 0.986, ~85–88% paired completion; "a reliable alternative to face-to-face" — but a consented research crossover with human interviewers ([PMC12653752](https://pmc.ncbi.nlm.nih.gov/articles/PMC12653752/)).
- **A 2025 evidence review found the voice-AI engagement category lacks peer-reviewed validation** — vendor claims (Hyro, Luma, Notable) lack control groups; only Tampa General's 21% had third-party corroboration ([Deepgram](https://deepgram.com/learn/ai-voice-agents-patient-engagement-evidence)). *(See §5 caveat — this "zero studies" framing is itself overstated; some peer-reviewed autonomous-voice data exists but reports ~61–76% completion.)*
- **Interviewer-mediated administration inflates PROM scores up to ~15%** (telephone 71.7 vs online 65.3, p<0.0001) — a double-edged finding: supports the engagement premise but is a mode-of-administration bias Hana must disclose since scores feed OAR ([PMC7721213](https://pmc.ncbi.nlm.nih.gov/articles/PMC7721213/)).
- **Portal self-completion in the wild is low** — a real-world portal survey saw a 13% response rate; one program reported 0% post-op completion ([PMC6970447](https://pmc.ncbi.nlm.nih.gov/articles/PMC6970447/)).
- **National older-adult data:** 78% have a portal but 47% say calling is better for explaining a request; comfort is lowest among <$60k-income and Black/Hispanic respondents ([U-Michigan NPHA](https://ihpi.umich.edu/national-poll-healthy-aging/national-findings/use-and-experiences-patient-portals-among-older)).
- **Telephone outreach reliably lifts response in RCTs** (RECORD 62.5%→67.8%; stroke RCT 26.8%→42.9%); SMS beat email for PROMs (34.8% vs 25.8%) ([PMC3895819](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3895819/)).
- **Automated voice/chatbot administration preserves psychometrics:** IVR vs paper for PHQ-9/SF-36 in men ≥65 correlated r=0.91–0.99 with ≥90% complete data; an LLM chatbot administering PHQ-9 saw 99.82% completion (n=3,895), ICC=0.91 ([PMC4786466](https://pmc.ncbi.nlm.nih.gov/articles/PMC4786466/)).
- **Oncology ePRO:** Medicare patients completed online far less than commercial (54.3% vs 64.0%); Black, rural, single/divorced, and Medicare patients more likely to need assisted completion ([Springer](https://link.springer.com/article/10.1007/s11136-025-03975-2)).

**Hana angle**

- **[strong] Anchor the pitch on the Medicare THA study** — passive alone captured only 45–52%; active phone follow-up was required to clear OAT. Position Hana as automating exactly that active-follow-up layer.
- **[strong] Justify the 70–80% WHODAS target by citing the WHODAS telephone crossover (~85–88%, ICC 0.986)** — framed as "in line with what phone-administered WHODAS achieves in older adults," not a unique AI result.
- **[strong] Re-label "~85% weekly engagement" as an internal/pilot target and lead with externally-validated CHANNEL evidence** (telephone RCTs, SMS 34.8% vs 25.8%, 47% prefer phone), with a one-line honesty note that industry-wide voice-AI engagement numbers aren't yet peer-reviewed.
- **[strong] Target the equity/digital-divide gap** (NPHA + oncology ePRO converge on a Medicare/low-income/minority portal penalty) — the patients most likely to drag OAR below the threshold.
- **[plausible] Proactively address mode-of-administration bias** — cite the ortho meta-analysis and position Hana's standardized voice scripting + structured write-back as a control, so voice-collected scores stay comparable for OAR. (Plausible because Hana would need to *demonstrate* the standardization.)
- **[plausible] Cite the LLM-chatbot PHQ-9 (99.82%, ICC 0.91) and IVR (r=0.91–0.99) studies** as proof automated conversational delivery of the named BH instruments preserves psychometrics — supports "valid collection by voice," though completion was measured among already-engaged participants.

---

## 3. What the current /access page is missing

The live page (`src/app/pages/Access.tsx`) tells essentially one story: **PROM/measure collection → FHIR output → reconciliation of the 50% withheld pool**, priced as $3/patient + 10% of the released withhold, framed as "not RPM." That's a solid spine, but it leaves the most defensible opportunities on the table — and carries factual errors that will undermine credibility with informed buyers.

**Gaps that are also opportunities:**

- **No Follow-On re-consent story** — the single strongest product fit (recurring, billing-gating, deadline-bound, low-clinical-judgment). The page never mentions the 60-day re-consent window or the recurring nature of the 10-year model.
- **No alignment/onboarding front-door story** — the CMS-scripted disclosure, voluntary consent capture, PCP-contact capture, and 60-day baseline-or-unaligned rule are all talk-and-document work Hana could own.
- **No validity-window framing** — the page mentions a "15-day window" only inside the CKM track copy (and as a fabricated "outreach window" — see corrections); it should reframe around the *real* 15-day measure-submission validity windows, the 60-day baseline rule, and the end-of-period window.
- **No buyer-anxiety framing** — the $216-vs-$35 cliff, the withhold-at-risk, and the "use software not headcount" mandate are absent; the ROI math is presented neutrally rather than as revenue-recovery insurance.
- **No equity/portal-failure evidence** — the NPHA and Medicare ePRO data that *justify* a voice-first channel for this population don't appear.
- **No Tools Directory / GTM mention** (out of scope for a product page, but the page is the asset a Directory listing would point to).
- **Care-coordination, multi-track consolidation, and Substitute-Spend detection** are absent — fair as "stretch," but the page could at least gesture at coordination value.

**Factual corrections required before any informed sales conversation** (cross-referenced with the separate fact-check of the page):

- **MSK OAP is $15/patient/month ($180/yr, no follow-on), not the "$20/patient/month" listed** (line ~45). CKM ($35) and BH ($15) on the page match CMS exactly; only MSK is wrong.
- **WHODAS 2.0 is the OPTIONAL 12-item version for 2026–2027, not a required 36-item measure** (lines ~35, 37, 77–78 call it "36-item… the hard one" and a required BH measure with a 70–80% completion target). The required BH lift is **PHQ-9 + GAD-7 + PGIC**. Keep WHODAS as an optional value-add and fix the item count to 12.
- **The "15-day validity window" used as an outreach-timing claim is not in the RFA** — the real 15-day figure is a *measure-submission validity* window in the payment doc. Reframe the copy accordingly.
- **The "~85% weekly engagement" and "70–80% WHODAS completion" figures should be labeled targets/pilot figures**, not externally-proven AI outcomes (see §5).
- **Three tracks vs four** — the page merges eCKM/CKM; CMS pays them separately ($360 vs $420 Initial).

---

## 4. Recommended next moves for Hana

**Tier 1 — do now (highest leverage, lowest risk):**

1. **Apply to the CMS ACCESS Tools Directory** as a data-exchange/interoperability + engagement tool, NOT a participant, NOT RPM. This is the single most actionable, CMS-sanctioned path to all 150+ participants.
2. **Fix the factual errors on /access** (MSK $15 not $20; WHODAS optional/12-item not required/36-item; the fabricated 15-day outreach window; eCKM/CKM as separate tracks) and re-label the 85% / 70–80% figures as targets. Credibility with sophisticated buyers depends on it.
3. **Build the Follow-On re-consent campaign as the flagship product story** — the cleanest, most unambiguous billing-gating fit.

**Tier 2 — build the GTM around the long tail:**

4. **Define the ICP as the cost-squeezed long tail** (small PC/specialty groups, FQHCs, AI-native startups) and lead every conversation with the $216-vs-$35 cliff + the withhold-at-risk.
5. **Lead the BH segment with PHQ-9/GAD-7/PGIC** (corrected), targeting the ~80+ BH participants — largest and highest-margin track, 100% patient-reported.
6. **Make validity-window-aware scheduling the headline differentiator**, backed by the Medicare THA study (45–52% passive → 75–85% with active follow-up).
7. **Reposition the proof points** around channel-level RCT/feasibility evidence and the equity gap; treat the 85% as an honest pilot target.

**Tier 3 — expansion / opportunistic:**

8. **Offer white-label/SDK shared infrastructure** to VBC enablers and to small groups competing for PCP co-management referrals.
9. **Add the 165M-member payer-pledge durability argument** for the CFO.
10. **Prototype the stretch plays** (Substitute-Spend conversational detection, care-update drafting) as roadmap, clearly scoped as detection/draft layers feeding workflows Hana does not own.

---

## 5. Confidence & caveats

Items the adversarial verification flagged — nothing below should read as more certain than this:

- **OVERSTATED (proof-points): the implied equivalence between Hana's "~85% weekly engagement / 70–80% WHODAS completion" and the external 75–88% figures.** Those external numbers come from **human-staffed** active phone follow-up (THA registry) and a **consented research crossover with human interviewers** (WHODAS) — NOT autonomous AI voice outreach to a full Medicare panel. State Hana's 85% as an aspirational/pilot target, not externally proven.
- **PARTIALLY REFUTED: the "zero peer-reviewed studies validate any voice-AI engagement headline" framing is too absolute.** Peer-reviewed autonomous-voice data does exist (e.g., CHAT-AF RCT: ~61.5% overall / 75.6% first-outreach completion) but reports ~61–76% completion and is rated "preliminary." Defensible statement: published voice-AI studies exist but report ~61–76% and *none validates an 85% autonomous-AI headline*.
- **NECESSARY ≠ SUFFICIENT (competitive): "PROM completion drives the org above the 50% Outcome Attainment Threshold" is plausible but unproven.** OAR depends on **clinical-target attainment** (e.g., SBP <130, PHQ-9 reductions), not mere measure completion, and full release *also* requires a Substitute Spend Rate ≥90% — a second gate the engagement narrative ignores. The first ACCESS performance period only begins July 5 2026, so no real-world outcome data exists yet. Engagement is necessary but not provably sufficient.
- **PARTIALLY UNVERIFIED (gaps): the 25% Substitute Spend cap and the 10/30/10-day coordination timing come from secondary analyses, not a verbatim RFA string I could confirm.** They are consistently reported across multiple independent sources and very likely correct, but should be checked against the final RFA / Appendix E before being stated as CMS-verbatim. The RFA *does* confirm the 90% SST, the proportional SSR reduction, the non-stacking ("larger of the two") rule, and the 50% Clinical Outcome Adjustment cap verbatim.
- **VERIFIED (buyer): WHODAS 2.0 is optional/12-item and MSK OAP is $15/mo** — both confirmed against the official CMS payment doc, and both correct errors on Hana's own /access page. Caveat: "optional/12-item" is accurate **only for the 2026–2027 period** — CMS signals intent to introduce a functional measure later. The per-month OAP figures are 1/12 divisions of CMS annual amounts before multi-track discount, rural add-on, coinsurance, or withhold.
- **General:** all dollar figures, rates, and completion percentages above are drawn only from the cited sources. Retention-, leakage-, and bias-control claims for Hana's product are *assumed mechanisms*, not demonstrated outcomes, and are tagged accordingly.

---

## Sources

**CMS primary**
- [ACCESS Model overview](https://www.cms.gov/priorities/innovation/innovation-models/access)
- [ACCESS Request for Applications (RFA) PDF](https://www.cms.gov/priorities/innovation/files/access-rfa.pdf)
- [ACCESS Payment Amounts & Performance Targets PDF](https://www.cms.gov/priorities/innovation/files/access-payments-amts-perf-targets.pdf)
- [Accepted applicants list (150+)](https://www.cms.gov/priorities/innovation/access-model-accepted-applicants)
- [ACCESS FHIR Implementation Guide (DSACMS, draft)](https://dsacms.github.io/cmmi-access-model/)

**Industry / analysis**
- [Fierce — who's participating / headwinds](https://www.fiercehealthcare.com/health-tech/deeper-dive-access-model-whos-participating-potential-headwinds-and-how-it-could-spur)
- [Fierce — low pay rates pressure margins (Capstone)](https://www.fiercehealthcare.com/digital-health/low-pay-rates-medicares-access-model-will-pressure-digital-health-margins-capstone)
- [Fierce — CMS taps 150 companies](https://www.fiercehealthcare.com/digital-health/cms-taps-150-digital-health-companies-providers-access-model)
- [Longyear — analyzing the participants](https://longyearhealth.substack.com/p/analyzing-the-cms-access-model-participants)
- [Longyear — a deeper dive on the model](https://longyearhealth.substack.com/p/a-deeper-dive-on-the-cms-access-model)
- [Nixon Law Group — Tools Directory opportunity](https://www.nixonlawgroup.com/resources/cms-launches-access-model-the-tools-directory-opportunity-for-digital-health-vendors)
- [techysurgeon — Substitute Service](https://techysurgeon.substack.com/p/cms-access-models-substitute-service)
- [TechTarget — Verily/Noom/150 others](https://www.techtarget.com/virtualhealthcare/news/366641624/CMS-taps-Verily-Noom-150-others-to-participate-in-ACCESS-model)
- [Hippocratic AI — $126M Series C](https://www.fiercehealthcare.com/ai-and-machine-learning/hippocratic-ai-lands-126m-series-c-expand-patient-facing-ai-agents-fuel-ma)

**Clinical / population evidence**
- [U-Michigan National Poll on Healthy Aging — portal use](https://ihpi.umich.edu/national-poll-healthy-aging/national-findings/use-and-experiences-patient-portals-among-older)
- [PMC12634202 — Medicare THA PROM completion](https://pmc.ncbi.nlm.nih.gov/articles/PMC12634202/)
- [PMC12653752 — WHODAS 2.0 telephone vs face-to-face](https://pmc.ncbi.nlm.nih.gov/articles/PMC12653752/)
- [PMC7721213 — mode-of-administration PROM bias](https://pmc.ncbi.nlm.nih.gov/articles/PMC7721213/)
- [PMC6970447 — real-world portal PROM response](https://pmc.ncbi.nlm.nih.gov/articles/PMC6970447/)
- [PMC3895819 — telephone/SMS outreach RCTs](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3895819/)
- [PMC4786466 — IVR/automated PHQ-9 psychometrics](https://pmc.ncbi.nlm.nih.gov/articles/PMC4786466/)
- [Springer QoL — oncology ePRO disparities](https://link.springer.com/article/10.1007/s11136-025-03975-2)
- [Deepgram — voice-AI engagement evidence review](https://deepgram.com/learn/ai-voice-agents-patient-engagement-evidence)
