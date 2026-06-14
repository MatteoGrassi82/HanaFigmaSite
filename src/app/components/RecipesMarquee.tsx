"use client";

import React, { useState, useCallback } from "react";
import { X, ArrowRight } from "lucide-react";

const CHANNELS = {
  ehr:   { label: "EHR",           dot: "#4A7BA7" },
  voice: { label: "Voice",         dot: "#1A1A2E" },
  sms:   { label: "SMS",           dot: "#00A78E" },
  alert: { label: "Staff alert",   dot: "#E07B45" },
  pdmp:  { label: "PDMP / verify", dot: "#8B6FB8" },
  cal:   { label: "Schedule",      dot: "#5A5A72" },
} as const;

type Channel = keyof typeof CHANNELS;

// Product-style icons — each a distinct mark with its own color palette
const ICONS: Record<Channel, React.FC<{ size?: number }>> = {
  // EHR: blue clipboard with a red cross accent
  ehr: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#E8F0FE"/>
      <rect x="9" y="7" width="14" height="18" rx="2" fill="#4A7BA7"/>
      <rect x="13" y="5" width="6" height="4" rx="1" fill="#2C5F8A"/>
      <rect x="12" y="13" width="8" height="1.5" rx="0.75" fill="white"/>
      <rect x="12" y="16" width="8" height="1.5" rx="0.75" fill="white"/>
      <rect x="12" y="19" width="5" height="1.5" rx="0.75" fill="white"/>
    </svg>
  ),
  // Voice: dark waveform mic
  voice: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#E8EAF0"/>
      <rect x="13" y="7" width="6" height="11" rx="3" fill="#1A1A2E"/>
      <path d="M10 17a6 6 0 0 0 12 0" stroke="#1A1A2E" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <line x1="16" y1="23" x2="16" y2="26" stroke="#1A1A2E" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="13" y1="26" x2="19" y2="26" stroke="#1A1A2E" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  // SMS: green speech bubble with dots
  sms: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#E6F7F4"/>
      <path d="M7 10a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7l-5 3v-3H10a3 3 0 0 1-3-3V10z" fill="#00A78E"/>
      <circle cx="12" cy="14" r="1.2" fill="white"/>
      <circle cx="16" cy="14" r="1.2" fill="white"/>
      <circle cx="20" cy="14" r="1.2" fill="white"/>
    </svg>
  ),
  // Alert: orange bell
  alert: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#FEF0E7"/>
      <path d="M16 7c-3.31 0-6 2.69-6 6v5l-2 2v1h16v-1l-2-2v-5c0-3.31-2.69-6-6-6z" fill="#E07B45"/>
      <path d="M14 21a2 2 0 0 0 4 0" fill="#E07B45"/>
      <circle cx="21" cy="9" r="3" fill="#E03B45"/>
    </svg>
  ),
  // PDMP: purple shield with checkmark
  pdmp: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#F0EBF8"/>
      <path d="M16 6L8 9.5v6c0 5 3.6 9.2 8 10.5 4.4-1.3 8-5.5 8-10.5v-6L16 6z" fill="#8B6FB8"/>
      <polyline points="12,16 15,19 21,13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  // Schedule: teal/grey calendar
  cal: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#EEF0F2"/>
      <rect x="7" y="10" width="18" height="15" rx="2" fill="#5A5A72"/>
      <rect x="7" y="10" width="18" height="5" rx="2" fill="#3D3D52"/>
      <rect x="11" y="7" width="2.5" height="5" rx="1.25" fill="#5A5A72"/>
      <rect x="18.5" y="7" width="2.5" height="5" rx="1.25" fill="#5A5A72"/>
      <rect x="10" y="19" width="3" height="3" rx="0.75" fill="white" opacity="0.8"/>
      <rect x="14.5" y="19" width="3" height="3" rx="0.75" fill="white" opacity="0.8"/>
      <rect x="19" y="19" width="3" height="3" rx="0.75" fill="white" opacity="0.8"/>
    </svg>
  ),
};

interface Recipe {
  tag: string;
  title: string;
  flow: Channel[];
  desc: string;
  steps: string[];
  systems: string[];
}

const RECIPES: Recipe[] = [
  { tag: "Intake", flow: ["ehr","voice","ehr"], title: "Call new patients when they register",
    desc: "When a new patient is registered in your EHR, HANA calls them within 24 hours to verify demographics, capture clinical history, and explain what to expect — then writes structured fields directly back into the chart.",
    steps: ['EHR fires "new patient registered" event', "HANA places outbound voice call", "Captures demographics, history, insurance verbally", "Writes structured intake to chart, flags anomalies"],
    systems: ["Athena","Epic","eClinicalWorks","NextGen"] },

  { tag: "Refills", flow: ["voice","ehr","alert"], title: "Triage inbound refill requests",
    desc: "Patient calls in for a refill. HANA verifies identity, checks last fill date and prescription history, confirms pharmacy, and routes the request to the prescriber for approval.",
    steps: ["Patient calls clinic refill line", "HANA verifies identity (DOB + name)", "Checks last fill, pharmacy, eligibility", "Routes to provider task queue with full context"],
    systems: ["Surescripts","Epic","DrFirst"] },

  { tag: "Pre-Op", flow: ["ehr","voice","sms"], title: "Walk patients through pre-op prep",
    desc: "Surgery scheduled in the EHR triggers a 48-hour pre-op call. HANA explains fasting requirements, medication holds, and what to bring, then sends a written checklist via SMS.",
    steps: ["Surgery scheduled in EHR", "HANA calls 48 hours pre-op", "Verifies understanding via teach-back", "SMS sends written prep checklist"],
    systems: ["Epic","Athena","EpicCare"] },

  { tag: "Outreach", flow: ["ehr","voice","cal","ehr"], title: "Close HEDIS care gaps on the call",
    desc: "EHR identifies patients overdue for A1C, mammogram, or colonoscopy. HANA calls, explains what's due, schedules the appointment on the line, and writes the gap closure back to the chart.",
    steps: ["EHR cohort: HEDIS measure overdue", "HANA calls with personalized message", "Books appointment in real-time calendar", "Writes gap-closure status to chart"],
    systems: ["Epic","HEDIS","Innovaccer"] },

  { tag: "Reactivation", flow: ["ehr","voice","cal"], title: "Recall patients lapsed 12+ months",
    desc: "EHR query identifies patients with no recent visit. HANA calls with a personalized message based on their care plan and books an appointment on the call.",
    steps: ["EHR query: no visit in 12+ months", "HANA calls with personalized recall message", "Addresses common barriers conversationally", "Books on the line, confirms via SMS"],
    systems: ["Epic","Athena","eCW"] },

  { tag: "Surgery", flow: ["voice","ehr","alert"], title: "Run 24/48/72h post-op check-ins",
    desc: "Discharge fires automated post-op calls at 24, 48, and 72 hours. HANA asks about pain, wound site, mobility, and medication tolerance — flags red flags to the surgical team immediately.",
    steps: ["Post-op discharge triggers schedule", "HANA calls at 24h, 48h, 72h intervals", "Captures structured symptom data", "Escalates concerning answers to on-call surgeon"],
    systems: ["Epic","Cerner"] },

  { tag: "Behavioral Health", flow: ["voice","alert","ehr"], title: "Flag crisis risk, warm-transfer to your on-call clinician",
    desc: "During a check-in call, HANA detects suicidal ideation or acute distress through validated screening logic. The call is immediately escalated to an on-call clinician with warm handoff.",
    steps: ["HANA conducts routine BH check-in", "Detects high-risk language or PHQ-9 >= 15", "Triggers live clinician escalation", "Logs risk assessment and disposition to chart"],
    systems: ["TherapyNotes","SimplePractice"] },

  { tag: "ADHD", flow: ["ehr","pdmp","voice","ehr"], title: "Monthly stimulant compliance check",
    desc: "Before each refill, HANA runs a PDMP check, calls the patient for efficacy and side effect attestation, and documents the compliance call as a controlled-substance attestation.",
    steps: ["Refill request triggers compliance check", "PDMP query runs in background", "HANA calls for verbal attestation", "Writes documentation with timestamps"],
    systems: ["PMP AWARxE","Surescripts"] },

  { tag: "Testing", flow: ["voice","sms","ehr"], title: "Set up Holter / event monitors",
    desc: "When a cardiac monitor is ordered, HANA walks the patient through device wear, event logging, and symptom diary. SMS reminders go out daily during the monitoring period.",
    steps: ["Cardiac monitor ordered in EHR", "HANA calls for device walkthrough", "Daily SMS reminders during wear period", "Writes monitoring log to chart"],
    systems: ["iRhythm","Bardy","Epic"] },

  { tag: "Lab", flow: ["ehr","voice","ehr"], title: "Deliver normal lab results by voice",
    desc: "Routine normal results trigger a HANA call with plain-language explanation. The call is logged as result delivery and patient acknowledgment is recorded in the chart.",
    steps: ["Normal result posted to EHR", "HANA calls patient with plain-language summary", "Captures patient questions or concerns", "Marks result as delivered, logs interaction"],
    systems: ["Quest","LabCorp","Epic"] },

  { tag: "Intake", flow: ["voice","ehr"], title: "Answer inbound calls from new patients",
    desc: "When new patients call the clinic, HANA collects insurance information, chief complaint, and scheduling preferences — creating a chart record before any human touches the call.",
    steps: ["New patient calls main line", "HANA collects intake conversationally", "Verifies insurance via integration", "Creates chart record + books first visit"],
    systems: ["Any EHR","Availity"] },

  { tag: "Refills", flow: ["ehr","voice","ehr"], title: "Remind patients before they run out",
    desc: "EHR shows 7 days of medication left for chronic patients. HANA calls to confirm adherence, identify side effects, and proactively trigger the refill before the gap.",
    steps: ["EHR detects 7-day med supply remaining", "HANA calls for adherence + side effect check", "Triggers refill via Surescripts if confirmed", "Updates med-rec status in chart"],
    systems: ["Surescripts","Athena","Epic"] },

  { tag: "Outreach", flow: ["ehr","voice","ehr"], title: "Run CCM/APCM monthly care calls",
    desc: "For enrolled chronic care patients, HANA runs structured 20-minute coordination calls each month, captures clinical updates, and auto-bills CPT codes 99490, 99491, or G0511.",
    steps: ["CCM cohort flagged in EHR", "HANA conducts 20-min structured call", "Documents care plan updates + symptoms", "Auto-generates billable encounter"],
    systems: ["CMS","Epic","Athena"] },

  { tag: "Pre-Op", flow: ["ehr","voice","ehr"], title: "Reconcile medications 48h before surgery",
    desc: "Pre-op trigger fires 48 hours before procedure. HANA reviews the patient's current medication list, flags GLP-1s and anticoagulants for hold, and documents instructions given.",
    steps: ["Pre-op timer fires at T-48 hours", "HANA reads current med list to patient", "Identifies meds requiring hold", "Documents hold instructions in chart"],
    systems: ["Surescripts","Epic"] },

  { tag: "Reactivation", flow: ["ehr","voice","sms"], title: "Re-engage missed specialty follow-ups",
    desc: "When cardiology, endocrinology, or GI follow-up appointments are missed, HANA calls with clinical urgency framing and follows up with an SMS reschedule link.",
    steps: ["Missed specialty appointment flagged", "HANA calls with care-plan-aware messaging", "Falls back to SMS if no answer", "Writes contact attempt + outcome to chart"],
    systems: ["Epic","Athena"] },

  { tag: "Lab", flow: ["ehr","voice","cal","alert"], title: "Triage abnormal lab results",
    desc: "Abnormal results post to the EHR. HANA schedules urgent follow-up appointments, escalates critical values immediately to on-call clinicians, and flags pending review.",
    steps: ["Abnormal result posts to EHR", "HANA assesses urgency by value/criteria", "Books follow-up or escalates to MD", "Documents triage decision in chart"],
    systems: ["Epic","Cerner","LabCorp"] },

  { tag: "Behavioral Health", flow: ["ehr","voice","alert"], title: "Administer PHQ-9 / GAD-7 screenings",
    desc: "Routine screening triggers HANA calls. Validated rating scales are administered conversationally, scored automatically, and high scores are escalated same-day to clinical staff.",
    steps: ["Screening trigger fires per cadence", "HANA voice-administers PHQ-9 / GAD-7", "Auto-scores using validated thresholds", "High scores: same-day clinician alert"],
    systems: ["TherapyNotes","Any EHR"] },

  { tag: "Surgery", flow: ["ehr","voice","cal"], title: "Backfill OR cancellations from waitlist",
    desc: "When an OR slot opens unexpectedly, HANA calls the surgical waitlist in clinical priority order, fills the block, and confirms pre-op preparation status with the new patient.",
    steps: ["OR cancellation creates open slot", "HANA calls waitlist by priority order", "Confirms availability + pre-op readiness", "Books patient, notifies OR coordinator"],
    systems: ["Epic OpTime"] },

  { tag: "Outreach", flow: ["ehr","voice","cal"], title: "Schedule Annual Wellness Visits",
    desc: "For Medicare patients due for AWV, HANA calls to schedule, captures the Health Risk Assessment in advance, and prepares the chart for the visit.",
    steps: ["Medicare cohort: AWV due", "HANA calls + captures HRA verbally", "Books AWV appointment", "Pre-populates chart for visit"],
    systems: ["Athena","Epic","CMS"] },

  { tag: "Testing", flow: ["ehr","voice","sms"], title: "Coach patients through bowel prep",
    desc: "The day before a colonoscopy, HANA calls to verify prep has started, checks hydration, addresses tolerability concerns, and texts a final reminder for the morning prep.",
    steps: ["Colonoscopy scheduled for T+1", "HANA calls afternoon before procedure", "Verifies prep started, asks about tolerance", "SMS final reminder before morning prep"],
    systems: ["Epic","GI EHRs"] },

  { tag: "Behavioral Health", flow: ["ehr","voice","ehr"], title: "Run BH new patient intake",
    desc: "Sensitive, conversational intake captures presenting concerns, treatment history, current medications, and support systems — without rushing the patient.",
    steps: ["New BH patient registered", "HANA conducts paced intake call", "Empathetic capture of clinical history", "Writes structured intake to chart"],
    systems: ["TherapyNotes","SimplePractice"] },

  { tag: "ADHD", flow: ["ehr","voice","ehr"], title: "Voice-administer ASRS / Vanderbilt",
    desc: "When ADHD rating scales are due, HANA voice-administers ASRS for adults or Vanderbilt for pediatrics, auto-scores responses, and writes the completed form to the chart.",
    steps: ["Scale due per assessment schedule", "HANA voice-administers age-appropriate scale", "Auto-scores responses", "Writes structured scored form to chart"],
    systems: ["Epic","Athena"] },

  { tag: "Reactivation", flow: ["ehr","voice","cal"], title: "Recover 90-day no-show patients",
    desc: "No-show flag aged 90 days triggers outreach. HANA calls to address underlying barriers, offers flexible rescheduling, and books the next available slot.",
    steps: ["No-show flag aged 90 days", "HANA calls with barrier-aware messaging", "Offers flexible scheduling options", "Books next slot, updates EHR"],
    systems: ["Epic","Athena","eCW"] },

  { tag: "Refills", flow: ["voice","ehr"], title: "Update pharmacy on the call",
    desc: "When a patient mentions during any call that they've switched pharmacies, HANA confirms the new location, validates it via Surescripts, and updates the EHR record.",
    steps: ["Patient mentions pharmacy change in call", "HANA confirms new location + address", "Validates pharmacy in Surescripts", "Updates EHR for future refills"],
    systems: ["Surescripts"] },
];



function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[280px] text-left bg-[#F1F3F4] rounded-2xl p-5 cursor-pointer hover:bg-[#E8EAED] transition-colors duration-150 flex flex-col justify-between min-h-[180px] border-0"
    >
      <div>
        <div className="text-[13px] font-medium text-blue-600 mb-2">{recipe.tag}</div>
        <div className="text-[20px] font-normal text-slate-900 leading-snug tracking-[-0.2px]">{recipe.title}</div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        {recipe.flow.slice(0, 4).map((ch, i) => (
          <span key={i} className="flex-shrink-0">
            {React.createElement(ICONS[ch], { size: 32 })}
          </span>
        ))}
        {recipe.flow.length > 4 && (
          <span className="text-[12px] text-slate-500 font-medium">+{recipe.flow.length - 4}</span>
        )}
      </div>
    </button>
  );
}

function Modal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#F5F3F0] rounded-2xl max-w-[560px] w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/10 hover:bg-slate-900/20 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-600 mb-3">{recipe.tag}</div>
        <h3 className="font-serif text-[22px] sm:text-[28px] leading-tight text-slate-900 mb-5">{recipe.title}</h3>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap bg-white/60 rounded-xl p-4 mb-6">
          {recipe.flow.map((ch, i) => (
            <React.Fragment key={i}>
              {React.createElement(ICONS[ch], { size: 36 })}
              {i < recipe.flow.length - 1 && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-slate-300">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-slate-400 mb-2">What it does</div>
          <p className="text-[15px] leading-relaxed text-slate-600">{recipe.desc}</p>
        </div>

        <div className="border-t border-slate-900/10 pt-5 mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-slate-400 mb-3">How it works</div>
          <ol className="space-y-0">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 py-3 border-b border-slate-900/8 last:border-0 text-[14px] text-slate-600 leading-snug">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-900/10 pt-5 mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-slate-400 mb-3">Connects to</div>
          <div className="flex flex-wrap gap-2">
            {recipe.systems.map((sys) => (
              <span key={sys} className="text-[12px] text-slate-600 bg-white/70 border border-slate-900/10 px-3 py-1.5 rounded-full">{sys}</span>
            ))}
          </div>
        </div>

        <a
          href="https://calendly.com/matteowastaken/discoverycall"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-blue-600 transition-colors"
        >
          See HANA in action <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

export function RecipesMarquee() {
  const [selected, setSelected] = useState<Recipe | null>(null);
  const select = useCallback((r: Recipe) => setSelected(r), []);
  const close = useCallback(() => setSelected(null), []);

  const row1 = RECIPES.filter((_, i) => i % 3 === 0);
  const row2 = RECIPES.filter((_, i) => i % 3 === 1);
  const row3 = RECIPES.filter((_, i) => i % 3 === 2);

  const renderRow = (items: Recipe[], reverse?: boolean) => {
    const doubled = [...items, ...items];
    const duration = `${items.length * 8}s`;
    return (
      <div
        className="overflow-hidden py-2 mb-3"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div
          className="flex gap-3 w-max"
          style={{ animation: `${reverse ? "marqueeRight" : "marqueeLeft"} ${duration} linear infinite` }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
          onTouchStart={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
          onTouchEnd={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
          onPointerDown={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
          onPointerUp={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
        >
          {doubled.map((r, i) => (
            <RecipeCard key={i} recipe={r} onClick={() => select(r)} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-white overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      <div className="text-center px-6 mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[2.5px] text-slate-400 mb-4">
          Workflow automation
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight mb-4">
          Your clinical protocols, already built in.
        </h2>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          100+ call workflows, ready day one — across ortho, GI, behavioral health, and primary care. Turn on the one bleeding revenue first; add the rest as you go.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {(Object.entries(CHANNELS) as [Channel, (typeof CHANNELS)[Channel]][]).map(([key, ch]) => (
            <div key={key} className="flex items-center gap-2 text-[12px] text-slate-500">
              <span className="flex-shrink-0">{React.createElement(ICONS[key as Channel], { size: 20 })}</span>
              {ch.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        {renderRow(row1, false)}
        {renderRow(row2, true)}
        {renderRow(row3, false)}
      </div>

      {selected && <Modal recipe={selected} onClose={close} />}
    </section>
  );
}
