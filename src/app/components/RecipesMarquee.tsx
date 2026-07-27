"use client";

import React, { useState, useCallback } from "react";
import { X, ArrowRight } from "lucide-react";
import { useTranslations, getLocale } from "../../lib/i18n";

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

const RECIPES_EN: Recipe[] = [
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

  { tag: "Outreach", flow: ["ehr","voice","ehr"], title: "Support CCM/APCM monthly care calls",
    desc: "For enrolled chronic care patients, HANA runs the structured monthly coordination call, captures clinical updates, and prepares the documentation your care-management staff review and attest to under CCM/APCM.",
    steps: ["CCM cohort flagged in EHR", "HANA conducts structured check-in call", "Documents care plan updates + symptoms", "Routes to the named clinician to attest"],
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

// Italian-market workflows. Rewritten for the Italian context (not a literal
// translation of the US set): Italian gestionali, SSN/regional realities, the
// ricetta dematerializzata (DEM), CUP scheduling, and Italian specialties — no
// US billing codes (HEDIS/CCM/CPT/Medicare/AWV) or US systems (Epic, Surescripts).
const RECIPES_IT: Recipe[] = [
  { tag: "Accoglienza", flow: ["ehr","voice","ehr"], title: "Chiama i nuovi pazienti dopo la registrazione",
    desc: "Quando un nuovo paziente viene registrato nel gestionale, HANA lo chiama entro 24 ore per verificare i dati anagrafici, raccogliere l'anamnesi e spiegare cosa lo aspetta — poi scrive i campi strutturati direttamente in cartella.",
    steps: ['Il gestionale registra "nuovo paziente"', "HANA effettua la chiamata in uscita", "Raccoglie anagrafica, anamnesi ed esenzioni a voce", "Scrive l'accoglienza in cartella e segnala le anomalie"],
    systems: ["GIPO","CGM","Dedalus","TeamSystem"] },

  { tag: "Ricette", flow: ["voice","ehr","alert"], title: "Gestisci le richieste di ricetta in entrata",
    desc: "Il paziente chiama per una ricetta. HANA verifica l'identità, controlla l'ultima erogazione e lo storico, conferma la farmacia e instrada la richiesta al medico per l'approvazione.",
    steps: ["Il paziente chiama il numero ricette", "HANA verifica l'identità (nome + data di nascita)", "Controlla ultima erogazione ed esenzione", "Inoltra al medico con il contesto completo"],
    systems: ["Ricetta dematerializzata (DEM)","SAR","CGM"] },

  { tag: "Pre-Operatorio", flow: ["ehr","voice","sms"], title: "Accompagna i pazienti nella preparazione pre-operatoria",
    desc: "Un intervento pianificato nel gestionale attiva una chiamata 48 ore prima. HANA spiega il digiuno, la sospensione dei farmaci e cosa portare, poi invia una checklist scritta via SMS.",
    steps: ["Intervento pianificato nel gestionale", "HANA chiama 48 ore prima", "Verifica la comprensione facendo ripetere", "SMS con la checklist di preparazione"],
    systems: ["Dedalus","GPI","TrakCare"] },

  { tag: "Prevenzione", flow: ["ehr","voice","cal","ehr"], title: "Recupera gli screening in ritardo durante la chiamata",
    desc: "Il gestionale individua i pazienti in ritardo su screening mammografico, colon-retto o controllo dell'emoglobina glicata. HANA chiama, spiega cosa è dovuto, prenota in diretta e scrive l'esito in cartella.",
    steps: ["Coorte gestionale: screening in ritardo", "HANA chiama con messaggio personalizzato", "Prenota sull'agenda in tempo reale", "Scrive in cartella il recupero dello screening"],
    systems: ["Screening regionali","CUP","Dedalus"] },

  { tag: "Recupero", flow: ["ehr","voice","cal"], title: "Richiama i pazienti fermi da oltre 12 mesi",
    desc: "Una query sul gestionale individua i pazienti senza visite recenti. HANA chiama con un messaggio personalizzato sul percorso di cura e prenota un appuntamento durante la telefonata.",
    steps: ["Query gestionale: nessuna visita da 12+ mesi", "HANA chiama con messaggio di richiamo personalizzato", "Affronta i dubbi in modo colloquiale", "Prenota in linea, conferma via SMS"],
    systems: ["CGM","GIPO","CUP"] },

  { tag: "Chirurgia", flow: ["voice","ehr","alert"], title: "Esegui i controlli post-operatori a 24/48/72h",
    desc: "La dimissione avvia chiamate post-operatorie automatiche a 24, 48 e 72 ore. HANA chiede di dolore, ferita, mobilità e tolleranza ai farmaci — e segnala subito i campanelli d'allarme all'équipe chirurgica.",
    steps: ["La dimissione attiva la pianificazione", "HANA chiama a 24h, 48h, 72h", "Raccoglie dati strutturati sui sintomi", "Inoltra le risposte critiche al chirurgo reperibile"],
    systems: ["Dedalus","GPI"] },

  { tag: "Salute Mentale", flow: ["voice","alert","ehr"], title: "Rileva il rischio acuto e passa la chiamata al clinico reperibile",
    desc: "Durante una chiamata di monitoraggio, HANA rileva ideazione suicidaria o disagio acuto tramite logiche di screening validate. La chiamata viene immediatamente inoltrata a un clinico reperibile con passaggio assistito.",
    steps: ["HANA conduce il monitoraggio di routine", "Rileva linguaggio a rischio o PHQ-9 ≥ 15", "Attiva l'inoltro live al clinico", "Registra in cartella la valutazione del rischio"],
    systems: ["Gestionale ambulatoriale","CSM"] },

  { tag: "Cronicità", flow: ["ehr","voice","ehr"], title: "Monitora l'aderenza nelle terapie croniche",
    desc: "Prima di ogni rinnovo, HANA chiama il paziente cronico per verificare efficacia ed effetti collaterali della terapia, e documenta la chiamata di monitoraggio in cartella.",
    steps: ["Il rinnovo attiva il controllo aderenza", "HANA chiama per l'attestazione verbale", "Raccoglie efficacia ed effetti collaterali", "Scrive la documentazione con data e ora"],
    systems: ["CGM","Dedalus"] },

  { tag: "Esami", flow: ["voice","sms","ehr"], title: "Imposta Holter ed event monitor",
    desc: "Quando viene prescritto un monitor cardiaco, HANA guida il paziente nell'uso del dispositivo, nella registrazione degli eventi e nel diario dei sintomi. Promemoria SMS quotidiani durante il periodo di monitoraggio.",
    steps: ["Monitor cardiaco prescritto nel gestionale", "HANA chiama per spiegare il dispositivo", "SMS giornalieri durante il periodo d'uso", "Scrive il registro di monitoraggio in cartella"],
    systems: ["Cardiologia","Dedalus"] },

  { tag: "Referti", flow: ["ehr","voice","ehr"], title: "Comunica a voce i referti nella norma",
    desc: "I referti di routine nella norma attivano una chiamata di HANA con spiegazione in linguaggio semplice. La chiamata è registrata come consegna del referto e la presa visione del paziente viene annotata in cartella.",
    steps: ["Referto nella norma caricato nel gestionale", "HANA chiama con sintesi in linguaggio semplice", "Raccoglie domande o dubbi del paziente", "Segna il referto come consegnato, registra l'interazione"],
    systems: ["Laboratorio","Dedalus"] },

  { tag: "Accoglienza", flow: ["voice","ehr"], title: "Rispondi alle chiamate dei nuovi pazienti",
    desc: "Quando i nuovi pazienti chiamano lo studio, HANA raccoglie esenzione/assicurazione, motivo della visita e preferenze di prenotazione — creando una scheda in cartella prima che intervenga una persona.",
    steps: ["Il nuovo paziente chiama il numero principale", "HANA raccoglie l'accoglienza in modo colloquiale", "Verifica esenzione o copertura", "Crea la scheda e prenota la prima visita"],
    systems: ["Qualsiasi gestionale","CUP"] },

  { tag: "Ricette", flow: ["ehr","voice","ehr"], title: "Avvisa i pazienti prima che finisca la terapia",
    desc: "Il gestionale segnala 7 giorni di terapia residua per i pazienti cronici. HANA chiama per confermare l'aderenza, individuare effetti collaterali e avviare il rinnovo prima dell'interruzione.",
    steps: ["Il gestionale rileva 7 giorni di terapia residua", "HANA chiama per aderenza ed effetti collaterali", "Avvia il rinnovo della ricetta se confermato", "Aggiorna lo stato della terapia in cartella"],
    systems: ["Ricetta dematerializzata (DEM)","CGM"] },

  { tag: "Cronicità", flow: ["ehr","voice","ehr"], title: "Conduci le chiamate mensili di gestione della cronicità",
    desc: "Per i pazienti cronici presi in carico (PDTA), HANA conduce ogni mese una chiamata di coordinamento strutturata, raccoglie gli aggiornamenti clinici e prepara la documentazione per il medico.",
    steps: ["Coorte cronicità segnalata nel gestionale", "HANA conduce la chiamata strutturata", "Documenta aggiornamenti del piano e sintomi", "Genera la registrazione dell'incontro"],
    systems: ["PDTA","CGM","Dedalus"] },

  { tag: "Pre-Operatorio", flow: ["ehr","voice","ehr"], title: "Riconcilia i farmaci 48h prima dell'intervento",
    desc: "Il trigger pre-operatorio scatta 48 ore prima della procedura. HANA rivede la terapia in corso del paziente, segnala anticoagulanti e GLP-1 da sospendere e documenta le istruzioni fornite.",
    steps: ["Il timer pre-operatorio scatta a T-48 ore", "HANA legge al paziente la terapia in corso", "Individua i farmaci da sospendere", "Documenta le istruzioni di sospensione in cartella"],
    systems: ["Ricetta dematerializzata (DEM)","Dedalus"] },

  { tag: "Recupero", flow: ["ehr","voice","sms"], title: "Recupera i follow-up specialistici saltati",
    desc: "Quando vengono saltati i controlli di cardiologia, endocrinologia o gastroenterologia, HANA chiama dando il giusto peso clinico e invia un link SMS per riprenotare.",
    steps: ["Controllo specialistico saltato segnalato", "HANA chiama con messaggio legato al percorso di cura", "Ripiega su SMS se non risponde", "Scrive in cartella tentativo ed esito"],
    systems: ["CUP","Dedalus"] },

  { tag: "Referti", flow: ["ehr","voice","cal","alert"], title: "Gestisci i referti con valori alterati",
    desc: "I referti con valori alterati arrivano nel gestionale. HANA prenota i controlli urgenti, inoltra subito i valori critici al clinico reperibile e segnala i casi in attesa di revisione.",
    steps: ["Referto alterato caricato nel gestionale", "HANA valuta l'urgenza per valore/criteri", "Prenota il controllo o inoltra al medico", "Documenta in cartella la decisione di triage"],
    systems: ["Laboratorio","CUP","Dedalus"] },

  { tag: "Salute Mentale", flow: ["ehr","voice","alert"], title: "Somministra gli screening PHQ-9 / GAD-7",
    desc: "Lo screening di routine attiva le chiamate di HANA. Le scale validate vengono somministrate in modo colloquiale, calcolate automaticamente, e i punteggi elevati sono inoltrati in giornata al personale clinico.",
    steps: ["Il trigger di screening scatta secondo cadenza", "HANA somministra a voce PHQ-9 / GAD-7", "Calcola il punteggio con soglie validate", "Punteggi alti: avviso al clinico in giornata"],
    systems: ["Gestionale ambulatoriale","CSM"] },

  { tag: "Chirurgia", flow: ["ehr","voice","cal"], title: "Riempi le disdette in sala operatoria dalla lista d'attesa",
    desc: "Quando si libera uno slot in sala operatoria, HANA chiama la lista d'attesa chirurgica in ordine di priorità clinica, riempie la seduta e conferma lo stato della preparazione pre-operatoria con il nuovo paziente.",
    steps: ["Una disdetta libera uno slot in sala", "HANA chiama la lista d'attesa per priorità", "Conferma disponibilità e prontezza pre-operatoria", "Prenota il paziente, avvisa il coordinatore di sala"],
    systems: ["Lista d'attesa","Dedalus"] },

  { tag: "Prevenzione", flow: ["ehr","voice","cal"], title: "Prenota le visite di controllo periodiche",
    desc: "Per i pazienti con un controllo periodico dovuto, HANA chiama per prenotare, raccoglie in anticipo le informazioni utili e prepara la cartella per la visita.",
    steps: ["Coorte: controllo periodico dovuto", "HANA chiama e raccoglie le info a voce", "Prenota la visita di controllo", "Pre-compila la cartella per la visita"],
    systems: ["CUP","CGM","Dedalus"] },

  { tag: "Esami", flow: ["ehr","voice","sms"], title: "Guida i pazienti nella preparazione alla colonscopia",
    desc: "Il giorno prima della colonscopia, HANA chiama per verificare che la preparazione sia iniziata, controlla l'idratazione, affronta i problemi di tollerabilità e invia un promemoria finale per la preparazione del mattino.",
    steps: ["Colonscopia pianificata per il giorno dopo", "HANA chiama il pomeriggio precedente", "Verifica l'avvio della preparazione e la tolleranza", "SMS di promemoria finale prima del mattino"],
    systems: ["Endoscopia","Dedalus"] },

  { tag: "Salute Mentale", flow: ["ehr","voice","ehr"], title: "Conduci l'accoglienza dei nuovi pazienti in salute mentale",
    desc: "Un'accoglienza sensibile e colloquiale raccoglie il motivo della richiesta, la storia clinica, i farmaci in corso e la rete di supporto — senza mettere fretta al paziente.",
    steps: ["Nuovo paziente di salute mentale registrato", "HANA conduce un'accoglienza senza fretta", "Raccoglie con empatia la storia clinica", "Scrive l'accoglienza strutturata in cartella"],
    systems: ["Gestionale ambulatoriale","CSM"] },

  { tag: "Aderenza", flow: ["ehr","voice","ehr"], title: "Somministra a voce le scale di valutazione",
    desc: "Quando sono dovute le scale di valutazione, HANA le somministra a voce in base all'età del paziente, calcola automaticamente i punteggi e scrive il modulo compilato in cartella.",
    steps: ["Scala dovuta secondo il calendario", "HANA somministra a voce la scala adatta all'età", "Calcola automaticamente i punteggi", "Scrive in cartella il modulo strutturato"],
    systems: ["CGM","Dedalus"] },

  { tag: "Recupero", flow: ["ehr","voice","cal"], title: "Recupera i pazienti con mancata presentazione da 90 giorni",
    desc: "La segnalazione di mancata presentazione vecchia di 90 giorni attiva il contatto. HANA chiama per affrontare gli ostacoli di fondo, offre una riprenotazione flessibile e prenota il primo slot disponibile.",
    steps: ["Mancata presentazione vecchia di 90 giorni", "HANA chiama affrontando gli ostacoli", "Offre opzioni di prenotazione flessibili", "Prenota il primo slot, aggiorna il gestionale"],
    systems: ["CUP","CGM"] },

  { tag: "Ricette", flow: ["voice","ehr"], title: "Aggiorna la farmacia durante la chiamata",
    desc: "Quando durante una chiamata il paziente dice di aver cambiato farmacia, HANA conferma la nuova sede e aggiorna la scheda nel gestionale.",
    steps: ["Il paziente segnala il cambio di farmacia", "HANA conferma nuova sede e indirizzo", "Verifica i dati della farmacia", "Aggiorna il gestionale per i prossimi rinnovi"],
    systems: ["Ricetta dematerializzata (DEM)"] },
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
  const it = getLocale() === "it";
  const L = {
    whatItDoes: it ? "Cosa fa" : "What it does",
    howItWorks: it ? "Come funziona" : "How it works",
    connectsTo: it ? "Si collega a" : "Connects to",
    cta: it ? "Vedi HANA in azione" : "See HANA in action",
  };
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#F5F3F0] rounded-2xl w-full max-w-[640px] md:max-w-[900px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto p-5 sm:p-8 md:p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/10 hover:bg-slate-900/20 flex items-center justify-center text-slate-500 transition-colors z-10"
        >
          <X size={16} />
        </button>

        {/* Header — spans full width */}
        <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-600 mb-3 pr-10">{recipe.tag}</div>
        <h3 className="font-serif text-[22px] sm:text-[28px] md:text-[32px] leading-tight text-slate-900 mb-6 pr-10">{recipe.title}</h3>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap bg-white/60 rounded-xl p-4 mb-8">
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

        {/* Two-column landscape layout on desktop; stacks on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
          {/* Left column: what it does + connects to */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-slate-400 mb-2">{L.whatItDoes}</div>
              <p className="text-[15px] leading-relaxed text-slate-600">{recipe.desc}</p>
            </div>

            <div className="border-t border-slate-900/10 pt-5">
              <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-slate-400 mb-3">{L.connectsTo}</div>
              <div className="flex flex-wrap gap-2">
                {recipe.systems.map((sys) => (
                  <span key={sys} className="text-[12px] text-slate-600 bg-white/70 border border-slate-900/10 px-3 py-1.5 rounded-full">{sys}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: how it works */}
          <div className="border-t border-slate-900/10 pt-5 mt-6 md:mt-0 md:border-t-0 md:pt-0">
            <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-slate-400 mb-3">{L.howItWorks}</div>
            <ol className="space-y-0">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 py-3 border-b border-slate-900/8 last:border-0 text-[14px] text-slate-600 leading-snug">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <a
          href="https://calendly.com/matteowastaken/discoverycall"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-blue-600 transition-colors mt-8"
        >
          {L.cta} <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

export function RecipesMarquee({
  tags,
  tag: tagOverride,
  heading: headingOverride,
  body: bodyOverride,
}: { tags?: string[]; tag?: string; heading?: string; body?: string } = {}) {
  const t = useTranslations();
  const rm = {
    tag: tagOverride ?? t.recipesMarquee.tag,
    heading: headingOverride ?? t.recipesMarquee.heading,
    body: bodyOverride ?? t.recipesMarquee.body,
  };
  const [selected, setSelected] = useState<Recipe | null>(null);
  const select = useCallback((r: Recipe) => setSelected(r), []);
  const close = useCallback(() => setSelected(null), []);

  const isItalian = getLocale() === "it";
  // Optional tag filter so product pages can show only their relevant workflows
  // (e.g. HANA Contact shows front-desk recipes, not clinical-program ones).
  const ALL_RECIPES = isItalian ? RECIPES_IT : RECIPES_EN;
  const RECIPES = tags ? ALL_RECIPES.filter((r) => tags.includes(r.tag)) : ALL_RECIPES;
  // Channel legend labels — localized (and de-US-ified: PDMP -> "Verifica ricetta").
  const channelLabel = (key: Channel): string => {
    if (!isItalian) return CHANNELS[key].label;
    return {
      ehr: "Gestionale",
      voice: "Voce",
      sms: "SMS",
      alert: "Avviso allo staff",
      pdmp: "Verifica ricetta",
      cal: "Agenda",
    }[key];
  };
  const row1 = RECIPES.filter((_, i) => i % 3 === 0);
  const row2 = RECIPES.filter((_, i) => i % 3 === 1);
  const row3 = RECIPES.filter((_, i) => i % 3 === 2);

  const renderRow = (items: Recipe[], reverse?: boolean) => {
    if (items.length === 0) return null;
    // Repeat short (filtered) rows until they're wide enough that the -50%
    // marquee translation never exposes a gap on large screens.
    const base: Recipe[] = [];
    while (base.length < 8) base.push(...items);
    const doubled = [...base, ...base];
    const duration = `${base.length * 8}s`;
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
          {rm.tag}
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight mb-4">
          {rm.heading}
        </h2>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {rm.body}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {(Object.keys(CHANNELS) as Channel[]).map((key) => (
            <div key={key} className="flex items-center gap-2 text-[12px] text-slate-500">
              <span className="flex-shrink-0">{React.createElement(ICONS[key], { size: 20 })}</span>
              {channelLabel(key)}
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
