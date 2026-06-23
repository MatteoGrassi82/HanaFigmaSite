import { Footer } from "../components/Footer";
import { getLocale } from "../../lib/i18n";

export function Terms() {
  const it = getLocale() === "it";
  return (
    <>
      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-[#00122F] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">HANA Health</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-6 leading-[1.1]">
              {it ? <>Termini di Servizio<br />e Politica di Sicurezza</> : <>Terms of Service<br />& Security Policy</>}
            </h1>
            <p className="text-slate-400 text-base">
              {it ? "Data di Efficacia: 14 giugno 2026" : "Effective Date: 14 June 2026"} &nbsp;|&nbsp; {it ? "Versione" : "Version"}: 2.1
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-16 text-[#1e2a3a]">
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            {it
              ? "I presenti Termini disciplinano l'accesso e l'uso della piattaforma di coinvolgimento dei pazienti HANA da parte degli operatori sanitari (Clienti) e dei loro pazienti (Utenti Finali). Un separato Accordo sul Trattamento dei Dati (DPA) disciplina gli obblighi di protezione dei dati ed è incorporato mediante rinvio."
              : "These Terms govern access to and use of the HANA patient engagement platform by healthcare providers (Clients) and their patients (End Users). A separate Data Processing Agreement (DPA) governs data protection obligations and is incorporated by reference."}
          </p>

          {/* PART A */}
          <div className="border-b border-slate-200 pb-4 mb-10">
            <h2 className="text-2xl font-semibold text-[#1e2a3a] tracking-tight">{it ? "PARTE A — TERMINI DI SERVIZIO" : "PART A — TERMS OF SERVICE"}</h2>
          </div>

          {/* 1. Definitions */}
          <Section number="1" title={it ? "Definizioni" : "Definitions"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-1/3">{it ? "Termine" : "Term"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{it ? "Significato" : "Meaning"}</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term={it ? "HANA / Noi / Società" : "HANA / We / Company"} meaning={it ? "HANA Health, Inc., l'operatore della piattaforma HANA" : "HANA Health, Inc., the operator of the HANA platform"} />
                  <DefRow term={it ? "Cliente / Operatore Sanitario" : "Client / Healthcare Provider"} meaning={it ? "L'organizzazione sanitaria o la clinica autorizzata che ha stipulato un contratto con HANA" : "The licensed healthcare organisation or clinic that has contracted with HANA"} />
                  <DefRow term={it ? "Paziente / Utente Finale" : "Patient / End User"} meaning={it ? "Il singolo paziente che interagisce con la piattaforma HANA tramite voce o SMS" : "The individual patient who interacts with the HANA platform via voice or SMS"} />
                  <DefRow term={it ? "Piattaforma" : "Platform"} meaning={it ? "L'infrastruttura di coinvolgimento dei pazienti HANA basata sull'AI, comprensiva di tutti gli agenti AI, le API, le integrazioni e i flussi di lavoro clinici" : "The HANA AI-powered patient engagement infrastructure, including all AI agents, APIs, integrations, and clinical workflows"} />
                  <DefRow term={it ? "Sintesi Clinica" : "Clinical Summary"} meaning={it ? "Un output strutturato assistito dall'AI generato dalle interazioni con i pazienti, destinato alla revisione da parte di un clinico autorizzato" : "An AI-assisted structured output generated from patient interactions, for review by a licensed clinician"} />
                  <DefRow term={it ? "PHI / Dati Sanitari" : "PHI / Health Data"} meaning={it ? "Informazioni Sanitarie Protette (PHI) come definite ai sensi dell'HIPAA; dati personali di categorie particolari come definiti ai sensi del GDPR" : "Protected Health Information as defined under HIPAA; special category personal data as defined under GDPR"} />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 2. Nature of the Platform */}
          <Section number="2" title={it ? "Natura della Piattaforma" : "Nature of the Platform"}>
            <p className="mb-4">
              {it
                ? "HANA è una piattaforma infrastrutturale per i flussi di lavoro clinici e il coinvolgimento dei pazienti. Non è un dispositivo medico, non fornisce diagnosi e non prescrive né raccomanda trattamenti."
                : "HANA is a clinical workflow and patient engagement infrastructure platform. It is not a medical device, does not provide diagnoses, and does not prescribe or recommend treatment."}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "HANA integra, e non sostituisce, le relazioni cliniche e il giudizio clinico umano" : "HANA augments, not replaces, clinical relationships and human clinical judgement"}</li>
              <li>{it ? "Tutti gli output generati dall'AI hanno carattere consultivo e devono essere esaminati da un clinico autorizzato prima che vengano prese decisioni cliniche" : "All AI-generated outputs are advisory and must be reviewed by a licensed clinician before clinical decisions are made"}</li>
              <li>{it ? "HANA opera secondo un'architettura con supervisione umana (human-in-the-loop): i flussi di lavoro dell'AI sono progettati per effettuare l'escalation al personale clinico ogni volta che vengono rilevati incertezza, indicatori di rischio o segnali di sicurezza" : "HANA operates on a human-in-the-loop architecture: AI workflows are designed to escalate to clinical staff whenever uncertainty, risk indicators, or safety flags are detected"}</li>
              <li>{it ? "HANA non è un servizio di emergenza. I pazienti in crisi acuta vengono indirizzati ai servizi di emergenza" : "HANA is not an emergency service. Patients in acute crisis are directed to emergency services"}</li>
            </ul>
            <p className="mt-4">
              {it
                ? "I pazienti sono sempre informati di interagire con un sistema di AI. HANA non si spaccia mai per un clinico umano."
                : "Patients are always informed they are interacting with an AI system. HANA never impersonates a human clinician."}
            </p>
          </Section>

          {/* 3. Client Obligations */}
          <Section number="3" title={it ? "Obblighi del Cliente" : "Client Obligations"}>
            <h4 className="font-semibold text-[#1e2a3a] mb-3">{it ? "3.1 Autorizzazioni e Responsabilità Clinica" : "3.1 Licensing and Clinical Responsibility"}</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>{it ? "I Clienti devono essere in possesso di tutte le licenze e le autorizzazioni regolatorie pertinenti necessarie per erogare servizi sanitari nella loro giurisdizione" : "Clients must hold all relevant licences and regulatory approvals required to deliver healthcare services in their jurisdiction"}</li>
              <li>{it ? "I Clienti conservano la piena responsabilità clinica e professionale per tutte le decisioni di cura dei pazienti, indipendentemente dagli output generati dall'AI" : "Clients retain full clinical and professional responsibility for all patient care decisions, regardless of AI-generated outputs"}</li>
              <li>{it ? "I Clienti devono designare un clinico nominativamente individuato responsabile dell'esame delle sintesi generate da HANA e degli avvisi di escalation" : "Clients must designate a named clinician responsible for reviewing HANA-generated summaries and escalation alerts"}</li>
              <li>{it ? "I Clienti devono assicurare che la propria implementazione di HANA sia conforme a tutte le normative sanitarie nazionali e locali applicabili" : "Clients must ensure their deployment of HANA complies with all applicable national and local healthcare regulations"}</li>
            </ul>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">{it ? "3.2 Consenso del Paziente" : "3.2 Patient Consent"}</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>{it ? "I Clienti sono responsabili dell'ottenimento del consenso informato dei pazienti prima di attivare i flussi di lavoro di coinvolgimento HANA" : "Clients are responsible for obtaining informed consent from patients prior to deploying HANA engagement workflows"}</li>
              <li>{it ? "Il consenso deve includere: la notifica che le interazioni sono mediate dall'AI; la spiegazione dell'uso dei dati; il diritto di opt-out; le procedure di escalation" : "Consent must include: notification that interactions are AI-mediated; explanation of data use; right to opt out; escalation procedures"}</li>
              <li>{it ? "Per i minori o i pazienti privi di capacità, i Clienti devono ottenere il consenso da un rappresentante legale appropriato" : "For minors or patients lacking capacity, clients must obtain consent from an appropriate legal representative"}</li>
              <li>{it ? "I Clienti devono fornire ai pazienti l'accesso all'Informativa sulla Privacy di HANA al momento dell'onboarding" : "Clients must provide patients with access to HANA's Privacy Policy at onboarding"}</li>
            </ul>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">{it ? "3.3 Uso Appropriato" : "3.3 Appropriate Use"}</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "HANA può essere utilizzata esclusivamente per finalità cliniche e operative sanitarie legittime" : "HANA may only be used for legitimate clinical and healthcare operational purposes"}</li>
              <li>{it ? "I Clienti non devono utilizzare HANA per attività di marketing, profilazione commerciale o comunicazioni non cliniche" : "Clients must not use HANA for marketing, commercial profiling, or non-clinical communications"}</li>
              <li>{it ? "I Clienti devono notificare tempestivamente a HANA qualsiasi evento avverso, problematica di tutela o questione di sicurezza dei pazienti derivante dall'uso della piattaforma" : "Clients must promptly notify HANA of any adverse events, safeguarding concerns, or patient safety issues arising from platform use"}</li>
              <li>{it ? "I Clienti devono implementare e mantenere controlli di accesso appropriati per la dashboard clinica di HANA" : "Clients must implement and maintain appropriate access controls for the HANA clinical dashboard"}</li>
            </ul>
          </Section>

          {/* 4. Patient Rights and Opt-Out */}
          <Section number="4" title={it ? "Diritti del Paziente e Opt-Out" : "Patient Rights and Opt-Out"}>
            <p className="mb-4">
              {it
                ? "I pazienti possono rinunciare ai flussi di lavoro di coinvolgimento HANA in qualsiasi momento rispondendo STOP a qualsiasi messaggio SMS o WhatsApp, oppure informando il proprio operatore sanitario. La rinuncia a HANA non pregiudica il diritto del paziente all'assistenza clinica."
                : "Patients may opt out of HANA engagement workflows at any time by replying STOP to any SMS or WhatsApp message, or by informing their healthcare provider. Opting out of HANA does not affect the patient's right to clinical care."}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "Le richieste di opt-out vengono elaborate entro 24 ore" : "Opt-out requests are processed within 24 hours"}</li>
              <li>{it ? "A seguito dell'opt-out non verrà avviata alcuna ulteriore attività di coinvolgimento automatizzata" : "No further automated engagement will be initiated following opt-out"}</li>
              <li>{it ? "Le richieste di cancellazione dei dati sono gestite ai sensi dell'Informativa sulla Privacy e del DPA applicabile" : "Data deletion requests are handled under the Privacy Policy and applicable DPA"}</li>
            </ul>
          </Section>

          {/* 5. AI Transparency and Limitations */}
          <Section number="5" title={it ? "Trasparenza e Limiti dell'AI" : "AI Transparency and Limitations"}>
            <p className="mb-4">{it ? "I Clienti e i pazienti devono comprendere i seguenti limiti dei sistemi di AI di HANA:" : "Clients and patients must understand the following limitations of HANA's AI systems:"}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "I sistemi di AI possono produrre output incompleti, inesatti o insufficientemente sfumati — è sempre richiesta la revisione clinica" : "AI systems may produce outputs that are incomplete, inaccurate, or insufficiently nuanced — clinical review is always required"}</li>
              <li>{it ? "L'AI di HANA offre le migliori prestazioni all'interno dei propri protocolli clinici validati; l'uso al di fuori dei parametri su cui è stata addestrata può ridurne l'accuratezza" : "HANA's AI performs best within its validated clinical protocols; use outside trained parameters may reduce accuracy"}</li>
              <li>{it ? "Le prestazioni dell'AI possono variare a seconda delle lingue, dei dialetti e dei dati demografici dei pazienti — HANA conduce un monitoraggio continuo dei bias ma non può garantire prestazioni uniformi" : "AI performance may vary across languages, dialects, and patient demographics — HANA conducts ongoing bias monitoring but cannot guarantee uniform performance"}</li>
              <li>{it ? "Le funzionalità di analisi vocale (tono, ritmo, biomarcatori acustici) hanno carattere meramente indicativo e non devono essere utilizzate come prova clinica autonoma" : "Voice analysis features (tone, pace, acoustic biomarkers) are indicative only and should not be used as standalone clinical evidence"}</li>
            </ul>
          </Section>

          {/* 6. Intellectual Property */}
          <Section number="6" title={it ? "Proprietà Intellettuale" : "Intellectual Property"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "La piattaforma HANA, comprensiva di tutti i modelli di AI, i protocolli clinici, i design conversazionali, le API e la documentazione, è proprietà intellettuale esclusiva di HANA Health, Inc." : "The HANA platform, including all AI models, clinical protocols, conversation designs, APIs, and documentation, is the exclusive intellectual property of HANA Health, Inc."}</li>
              <li>{it ? "I dati specifici del Cliente, gli output clinici e le cronologie delle conversazioni generati tramite la piattaforma appartengono al Cliente e ai suoi pazienti, nei limiti del DPA" : "Client-specific data, clinical outputs, and conversation histories generated through the platform belong to the Client and their patients, subject to the DPA"}</li>
              <li>{it ? "HANA si riserva il diritto di utilizzare dati anonimizzati, aggregati e non identificabili per migliorare le prestazioni della piattaforma, nei limiti della legge applicabile" : "HANA retains the right to use anonymised, aggregated, non-identifiable data to improve platform performance, subject to applicable law"}</li>
              <li>{it ? "I Clienti non possono effettuare reverse engineering, rivendere, concedere in sublicenza o replicare la piattaforma HANA senza previo consenso scritto" : "Clients may not reverse-engineer, resell, sublicense, or replicate the HANA platform without prior written consent"}</li>
            </ul>
          </Section>

          {/* 7. Service Levels */}
          <Section number="7" title={it ? "Livelli di Servizio, Disponibilità e Supporto" : "Service Levels, Availability, and Support"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">{it ? "Metrica" : "Metric"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{it ? "Impegno" : "Commitment"}</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term={it ? "Obiettivo di Uptime della Piattaforma" : "Platform Uptime Target"} meaning={it ? "99,5% mensile (esclusa la manutenzione programmata)" : "99.5% monthly (excluding scheduled maintenance)"} />
                  <DefRow term={it ? "Finestra di Manutenzione Programmata" : "Scheduled Maintenance Window"} meaning={it ? "Domeniche 02:00–06:00 UTC (con preavviso)" : "Sundays 02:00–06:00 UTC (advance notice provided)"} />
                  <DefRow term={it ? "Risposta a Incidenti Critici" : "Critical Incident Response"} meaning={it ? "Entro 2 ore (P1 — piattaforma non disponibile o guasto del sistema di sicurezza)" : "Within 2 hours (P1 — platform unavailable or safety system failure)"} />
                  <DefRow term={it ? "Risposta del Supporto (Standard)" : "Support Response (Standard)"} meaning={it ? "Entro 1 giorno lavorativo" : "Within 1 business day"} />
                  <DefRow term={it ? "Supporto all'Escalation Clinica" : "Clinical Escalation Support"} meaning={it ? "Instradamento dell'escalation 24/7 al personale clinico di guardia designato" : "24/7 escalation routing to designated on-call clinical staff"} />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 8. Liability and Indemnification */}
          <Section number="8" title={it ? "Responsabilità e Manleva" : "Liability and Indemnification"}>
            <p className="mb-4">
              {it
                ? "La responsabilità di HANA nei confronti dei Clienti è limitata al totale dei corrispettivi pagati dal Cliente nei 12 mesi precedenti la pretesa, salvo i casi di colpa grave, dolo o violazione degli obblighi di protezione dei dati."
                : "HANA's liability to Clients is limited to the total fees paid by the Client in the 12 months preceding the claim, except in cases of gross negligence, wilful misconduct, or breach of data protection obligations."}
            </p>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">{it ? "8.1 HANA non è responsabile per:" : "8.1 HANA is not liable for:"}</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>{it ? "Le decisioni cliniche prese dai clinici del Cliente, indipendentemente dal fatto che siano stati consultati output generati dall'AI" : "Clinical decisions made by Client clinicians, regardless of whether AI-generated outputs were consulted"}</li>
              <li>{it ? "I danni derivanti dalla mancata revisione degli avvisi di escalation da parte del Cliente" : "Harm resulting from the Client's failure to review escalation alerts"}</li>
              <li>{it ? "Le interruzioni del servizio causate da guasti dell'infrastruttura di terze parti (telefonia, cloud), a condizione che HANA abbia adempiuto ai propri obblighi di SLA" : "Service disruptions caused by third-party infrastructure failures (telephony, cloud), provided HANA has met its own SLA obligations"}</li>
              <li>{it ? "Gli esiti in implementazioni in cui i protocolli clinici di HANA sono stati modificati in modo sostanziale senza l'approvazione di HANA" : "Outcomes in deployments where HANA's clinical protocols have been materially modified without HANA's approval"}</li>
            </ul>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">{it ? "8.2 Manleva del Cliente" : "8.2 Client Indemnification"}</h4>
            <p>
              {it
                ? "I Clienti si impegnano a manlevare HANA da pretese derivanti da: esercizio non autorizzato della pratica clinica; mancato ottenimento del consenso del paziente; violazione dei presenti Termini; uso improprio della piattaforma per finalità non cliniche."
                : "Clients agree to indemnify HANA against claims arising from: unlicensed clinical practice; failure to obtain patient consent; breach of these Terms; misuse of the platform for non-clinical purposes."}
            </p>
          </Section>

          {/* 9. Term, Termination, and Offboarding */}
          <Section number="9" title={it ? "Durata, Risoluzione e Offboarding" : "Term, Termination, and Offboarding"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "Durata iniziale del contratto: 12 mesi, con rinnovo automatico salvo preavviso scritto di 60 giorni" : "Initial contract term: 12 months, renewing automatically unless 60 days' written notice is provided"}</li>
              <li>{it ? "Ciascuna parte può recedere con un preavviso di 30 giorni in caso di violazione sostanziale non sanata entro 14 giorni dalla diffida scritta" : "Either party may terminate with 30 days' notice in the event of a material breach not remedied within 14 days of written notice"}</li>
              <li>{it ? "Alla risoluzione, HANA fornirà un'esportazione completa dei dati entro 30 giorni e cancellerà in modo sicuro tutti i dati del Cliente e dei pazienti entro 90 giorni, salvo obblighi legali di conservazione" : "Upon termination, HANA will provide a full data export within 30 days and will securely delete all Client and patient data within 90 days, unless legal retention obligations apply"}</li>
              <li>{it ? "Durante la finestra di offboarding, l'accesso clinico alle sintesi e ai log di escalation rimane disponibile per garantire la continuità delle cure" : "During the offboarding window, clinical access to summaries and escalation logs remains available for continuity of care"}</li>
            </ul>
          </Section>

          {/* 10. Governing Law */}
          <Section number="10" title={it ? "Legge Applicabile" : "Governing Law"}>
            <p>
              {it
                ? "I presenti Termini sono disciplinati dalle leggi dello Stato del Delaware, Stati Uniti, senza riguardo alle relative norme sui conflitti di legge. Per i Clienti con sede negli Stati Uniti, l'HIPAA disciplina gli obblighi relativi alle Informazioni Sanitarie Protette ed è incorporato nel Business Associate Agreement (BAA). Per i Clienti o i pazienti situati nell'UE o nel Regno Unito, il GDPR / UK GDPR e la normativa nazionale di attuazione applicabile disciplinano il trattamento dei loro dati personali. Le parti tenteranno dapprima di risolvere ogni controversia mediante negoziazione in buona fede. Qualsiasi controversia non risolta in tal modo sarà sottoposta ad arbitrato vincolante amministrato da JAMS a Wilmington, Delaware, secondo le sue regole applicabili, e la sentenza sul lodo potrà essere emessa presso qualsiasi tribunale competente; ciascuna parte potrà comunque richiedere provvedimenti inibitori o altri rimedi equitativi presso un tribunale competente. I pazienti (Utenti Finali) non sono tenuti a ricorrere all'arbitrato e conservano tutti i diritti irrinunciabili previsti dalla normativa applicabile in materia di tutela dei consumatori."
                : "These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict-of-laws rules. For US-based Clients, HIPAA governs Protected Health Information obligations and is incorporated into the Business Associate Agreement (BAA). For Clients or patients located in the EU or UK, the GDPR / UK GDPR and applicable national implementing legislation govern the processing of their personal data. The parties will first attempt to resolve any dispute through good-faith negotiation. Any dispute not so resolved will be submitted to binding arbitration administered by JAMS in Wilmington, Delaware under its applicable rules, and judgment on the award may be entered in any court of competent jurisdiction; either party may nonetheless seek injunctive or other equitable relief in a court of competent jurisdiction. Patients (End Users) are not required to arbitrate and retain all non-waivable rights under applicable consumer-protection law."}
            </p>
          </Section>

          {/* PART B */}
          <div className="border-b border-slate-200 pb-4 mb-10 mt-16">
            <h2 className="text-2xl font-semibold text-[#1e2a3a] tracking-tight">{it ? "PARTE B — POLITICA DI SICUREZZA" : "PART B — SECURITY POLICY"}</h2>
          </div>

          {/* 11. Security Governance */}
          <Section number="11" title={it ? "Governance della Sicurezza" : "Security Governance"}>
            <p className="mb-6">
              {it
                ? "HANA mantiene un Sistema di Gestione della Sicurezza delle Informazioni (ISMS) formale, allineato ai principi della norma ISO 27001. La governance della sicurezza è responsabilità congiunta del CTO e del Responsabile Privacy, con revisioni trimestrali da parte del team dirigenziale."
                : "HANA maintains a formal Information Security Management System (ISMS) aligned with ISO 27001 principles. Security governance is the joint responsibility of the CTO and Privacy Lead, with quarterly reviews by the leadership team."}
            </p>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">{it ? "Sintesi del Quadro di Conformità" : "Compliance Framework Summary"}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{it ? "Quadro Normativo" : "Framework"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{it ? "Stato" : "Status"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{it ? "Ambito" : "Scope"}</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  {[
                    ["GDPR", "Compliant", it ? "A livello UE; minimizzazione dei dati, privacy by design, DPA con tutti i responsabili del trattamento" : "EU-wide; data minimisation, privacy by design, DPA with all processors"],
                    ["HIPAA", "Aligned", it ? "BAA disponibile; architettura PHI conforme; controlli di accesso in atto" : "BAA available; PHI architecture compliant; access controls in place"],
                    ["SOC 2 Type II", "In progress", it ? "Valutazione di idoneità completata; audit di Tipo II in corso" : "Readiness assessment complete; Type II audit underway"],
                    ["EU AI Act", "Implementing", it ? "Classificazione del rischio per caso d'uso completata; misure di trasparenza e supervisione implementate" : "Use-case risk classification complete; transparency & oversight measures deployed"],
                    ["DCB0129", "Compliant", it ? "Gestione del rischio clinico per i sistemi IT sanitari del Regno Unito" : "Clinical risk management for UK health IT systems"],
                    ["DTAC", "Compliant", it ? "Digital Technology Assessment Criteria (NHS England)" : "Digital Technology Assessment Criteria (NHS England)"],
                    ["ISO 27001", "Aligned", it ? "ISMS implementato; roadmap di certificazione formale in corso" : "ISMS implemented; formal certification roadmap in progress"],
                  ].map(([fw, status, scope]) => (
                    <tr key={fw} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-[#1e2a3a]">{fw}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === "Compliant" || status === "Completed" ? "bg-green-50 text-green-700" :
                          status === "Aligned" ? "bg-blue-50 text-blue-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {it
                            ? (status === "Compliant" ? "Conforme" :
                               status === "Aligned" ? "Allineato" :
                               status === "In progress" ? "In corso" :
                               status === "Implementing" ? "In implementazione" :
                               status === "Completed" ? "Completato" : status)
                            : status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 12. Data Encryption */}
          <Section number="12" title={it ? "Crittografia dei Dati" : "Data Encryption"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">{it ? "Contesto" : "Context"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{it ? "Standard" : "Standard"}</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term={it ? "Dati a Riposo" : "Data at Rest"} meaning={it ? "AES-256 (chiavi gestite da AWS KMS; chiavi gestite dal cliente disponibili per l'enterprise)" : "AES-256 (AWS KMS-managed keys; customer-managed keys available for enterprise)"} />
                  <DefRow term={it ? "Dati in Transito" : "Data in Transit"} meaning={it ? "TLS 1.2 / TLS 1.3 (obbligatorio; protocolli più datati disabilitati)" : "TLS 1.2 / TLS 1.3 (mandatory; older protocols disabled)"} />
                  <DefRow term={it ? "Canali Vocali" : "Voice Channels"} meaning={it ? "Crittografia end-to-end laddove il canale la supporti; gateway SMS conformi all'HIPAA per gli USA" : "End-to-end encrypted where channel supports it; HIPAA-compliant SMS gateways for US"} />
                  <DefRow term={it ? "Crittografia del database" : "Database encryption"} meaning={it ? "Crittografia a livello di colonna per i campi PHI; crittografia dell'intero disco su tutti i volumi di archiviazione" : "Column-level encryption for PHI fields; full disk encryption on all storage volumes"} />
                  <DefRow term={it ? "Crittografia dei backup" : "Backup encryption"} meaning={it ? "AES-256 applicato a tutti i backup; replica cross-region solo per l'UE" : "AES-256 applied to all backups; cross-region replication for EU only"} />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 13. Access Control */}
          <Section number="13" title={it ? "Controllo degli Accessi" : "Access Control"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "Controllo degli accessi basato sui ruoli (RBAC) applicato a tutti i componenti della piattaforma" : "Role-based access control (RBAC) applied to all platform components"}</li>
              <li>{it ? "I clinici accedono esclusivamente ai dati dei propri pazienti; l'isolamento dei dati tra cliniche è imposto a livello di infrastruttura" : "Clinicians access only their own patients' data; cross-clinic data isolation enforced at infrastructure level"}</li>
              <li>{it ? "Autenticazione a più fattori (MFA) obbligatoria per ogni accesso alla dashboard clinica" : "Multi-factor authentication (MFA) mandatory for all clinical dashboard access"}</li>
              <li>{it ? "Controlli di gestione degli accessi privilegiati (PAM) applicati a tutta l'amministrazione dell'infrastruttura" : "Privileged access management (PAM) controls applied to all infrastructure administration"}</li>
              <li>{it ? "Log di accesso conservati per 24 mesi; gli avvisi di rilevamento delle anomalie vengono esaminati quotidianamente" : "Access logs retained for 24 months; anomaly detection alerts are reviewed daily"}</li>
              <li>{it ? "Diritti di accesso dei dipendenti riesaminati trimestralmente; revocati immediatamente al momento dell'offboarding" : "Employee access rights reviewed quarterly; terminated immediately upon offboarding"}</li>
            </ul>
          </Section>

          {/* 14. Vulnerability Management */}
          <Section number="14" title={it ? "Gestione delle Vulnerabilità" : "Vulnerability Management"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "Scansione automatizzata delle vulnerabilità: quotidiana su tutta l'infrastruttura di produzione" : "Automated vulnerability scanning: daily on all production infrastructure"}</li>
              <li>{it ? "Penetration test: pentest esterno annuale condotto da terze parti; risultati esaminati entro 5 giorni lavorativi" : "Penetration testing: annual third-party external pentest; results reviewed within 5 business days"}</li>
              <li>{it ? "Gestione delle patch: vulnerabilità critiche corrette entro 48 ore; alte entro 7 giorni; medie entro 30 giorni" : "Patch management: critical vulnerabilities patched within 48 hours; high within 7 days; medium within 30 days"}</li>
              <li>{it ? "Scansione delle dipendenze: tutte le librerie di terze parti monitorate tramite strumenti automatizzati (tracciamento CVE)" : "Dependency scanning: all third-party libraries monitored via automated tooling (CVE tracking)"}</li>
              <li>{it ? "Programma bug bounty: policy di divulgazione responsabile disponibile su hana.health/security" : "Bug bounty programme: responsible disclosure policy available at hana.health/security"}</li>
            </ul>
          </Section>

          {/* 15. Incident Response */}
          <Section number="15" title={it ? "Risposta agli Incidenti" : "Incident Response"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">{it ? "Fase" : "Phase"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{it ? "Impegno di HANA" : "HANA Commitment"}</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term={it ? "Rilevamento e Triage" : "Detection & Triage"} meaning={it ? "Allertamento automatizzato; incidenti P1 presi in carico entro 30 minuti" : "Automated alerting; P1 incidents acknowledged within 30 minutes"} />
                  <DefRow term={it ? "Contenimento" : "Containment"} meaning={it ? "Sistemi interessati isolati entro 2 ore dal rilevamento di un P1" : "Affected systems isolated within 2 hours of P1 detection"} />
                  <DefRow term={it ? "Notifica al Cliente" : "Client Notification"} meaning={it ? "Entro 24 ore dalla conferma della violazione (72 ore per la notifica all'autorità di controllo ai sensi dell'Articolo 33 del GDPR)" : "Within 24 hours of confirmed breach (72 hours for GDPR Article 33 notification to DPA)"} />
                  <DefRow term={it ? "Notifica al Paziente" : "Patient Notification"} meaning={it ? "Come richiesto dall'Art. 34 del GDPR e dalla legge applicabile; coordinata con il Cliente" : "As required by GDPR Art. 34 and applicable law; coordinated with Client"} />
                  <DefRow term={it ? "Revisione Post-Incidente" : "Post-Incident Review"} meaning={it ? "Analisi delle cause profonde consegnata entro 5 giorni lavorativi" : "Root cause analysis delivered within 5 business days"} />
                  <DefRow term={it ? "Segnalazione alle Autorità" : "Regulatory Reporting"} meaning={it ? "HANA supporta i Clienti nell'adempimento di tutte le notifiche di violazione obbligatorie verso le autorità di regolamentazione" : "HANA supports Clients in fulfilling all mandatory regulatory breach notifications"} />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 16. Subprocessor Security */}
          <Section number="16" title={it ? "Sicurezza dei Sub-responsabili" : "Subprocessor Security"}>
            <p className="mb-4">
              {it
                ? "Tutti i sub-responsabili del trattamento con accesso a dati personali o sanitari devono soddisfare i seguenti standard minimi prima dell'incarico:"
                : "All sub-processors with access to personal or health data must meet the following minimum standards before engagement:"}
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>{it ? "Accordo sul Trattamento dei Dati (DPA) sottoscritto, comprensivo delle Clausole Contrattuali Standard del GDPR ove richiesto" : "Signed Data Processing Agreement (DPA) incorporating GDPR Standard Contractual Clauses where required"}</li>
              <li>{it ? "Evidenza di certificazione SOC 2 Type II o ISO 27001, o equivalente" : "Evidence of SOC 2 Type II or ISO 27001 certification, or equivalent"}</li>
              <li>{it ? "BAA sottoscritto per qualsiasi responsabile del trattamento con sede negli USA che abbia accesso a PHI" : "BAA executed for any US-based processor with access to PHI"}</li>
              <li>{it ? "Valutazione di sicurezza annuale a cura del team di sicurezza di HANA" : "Annual security assessment by HANA's security team"}</li>
              <li>{it ? "Clausole sul diritto di audit incluse in tutti i contratti con i sub-responsabili" : "Right to audit provisions included in all sub-processor contracts"}</li>
            </ul>
            <p>
              {it
                ? "Un elenco aggiornato dei sub-responsabili attivi è disponibile su hana.health/subprocessors. I Clienti saranno informati con 30 giorni di anticipo dell'incarico di qualsiasi nuovo sub-responsabile e potranno opporsi."
                : "An up-to-date list of active sub-processors is available at hana.health/subprocessors. Clients will be notified 30 days in advance of any new sub-processor engagement and may object."}
            </p>
          </Section>

          {/* 17. Business Continuity and Disaster Recovery */}
          <Section number="17" title={it ? "Continuità Operativa e Disaster Recovery" : "Business Continuity and Disaster Recovery"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "Recovery Time Objective (RTO): 4 ore per un guasto della piattaforma di livello P1" : "Recovery Time Objective (RTO): 4 hours for P1 platform failure"}</li>
              <li>{it ? "Recovery Point Objective (RPO): 1 ora (replica continua; recupero point-in-time disponibile)" : "Recovery Point Objective (RPO): 1 hour (continuous replication; point-in-time recovery available)"}</li>
              <li>{it ? "Infrastruttura hot standby mantenuta in una regione AWS secondaria" : "Hot standby infrastructure maintained in secondary AWS region"}</li>
              <li>{it ? "Test completi di DR condotti due volte l'anno; risultati esaminati dalla dirigenza" : "Full DR tests conducted bi-annually; results reviewed by leadership"}</li>
              <li>{it ? "L'instradamento dell'escalation clinica rimane operativo durante le interruzioni della piattaforma tramite failover via SMS" : "Clinical escalation routing remains operational during platform outages via SMS failover"}</li>
            </ul>
          </Section>

          {/* 18. AI-Specific Security Measures */}
          <Section number="18" title={it ? "Misure di Sicurezza Specifiche per l'AI" : "AI-Specific Security Measures"}>
            <p className="mb-4">{it ? "Data l'architettura di HANA basata sull'AI, si applicano i seguenti controlli di sicurezza aggiuntivi:" : "Given HANA's AI-driven architecture, the following additional security controls apply:"}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "Prevenzione del prompt injection: tutti gli input dei pazienti vengono sanificati e validati prima di raggiungere i modelli di AI" : "Prompt injection prevention: all patient inputs are sanitised and validated before reaching AI models"}</li>
              <li>{it ? "Filtraggio degli output del modello: le risposte dell'AI vengono fatte passare attraverso classificatori di sicurezza prima della consegna" : "Model output filtering: AI responses are passed through safety classifiers before delivery"}</li>
              <li>{it ? "Mitigazione delle allucinazioni: il motore di ragionamento clinico è ancorato a protocolli e basi di conoscenza specifici della clinica; gli output al di fuori dei parametri validati vengono segnalati per la revisione umana" : "Hallucination mitigation: clinical reasoning engine is grounded in clinic-specific protocols and knowledge bases; outputs outside validated parameters are flagged for human review"}</li>
              <li>{it ? "Isolamento dei dati tra clienti: l'inferenza del modello di AI è stateless; nessuna fuoriuscita di dati tra clienti a livello di modello" : "Data isolation between clients: AI model inference is stateless; no cross-client data leakage at model layer"}</li>
              <li>{it ? "Deployment di modelli open-source (Llama 3.1): eseguiti su infrastruttura controllata da HANA; nessun dato dei pazienti trasmesso a fornitori di modelli esterni" : "Open-source model deployments (Llama 3.1): run on HANA-controlled infrastructure; no patient data transmitted to external model providers"}</li>
              <li>{it ? "Log di audit dell'AI: tutte le richieste di inferenza dell'AI e i relativi output vengono registrati con piena tracciabilità a fini di auditabilità" : "AI audit logs: all AI inference requests and outputs are logged with full traceability for auditability"}</li>
            </ul>
          </Section>

          {/* 19. Physical Security */}
          <Section number="19" title={it ? "Sicurezza Fisica" : "Physical Security"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "HANA è un'azienda cloud-native; nessun dato dei pazienti viene trattato sui dispositivi dei dipendenti" : "HANA is a cloud-native company; no patient data is processed on employee devices"}</li>
              <li>{it ? "Per i deployment on-premise (Italia, Medio Oriente): l'accesso fisico ai server è controllato dall'istituzione sanitaria partner, con HANA che fornisce configurazioni server irrobustite e audit logging" : "For on-premise deployments (Italy, Middle East): physical server access is controlled by the healthcare institution partner, with HANA providing hardened server configurations and audit logging"}</li>
              <li>{it ? "Tutti i dipendenti di HANA completano una formazione obbligatoria di sensibilizzazione alla sicurezza all'ingresso e con cadenza annuale" : "All HANA employees complete mandatory security awareness training on joining and annually thereafter"}</li>
              <li>{it ? "Politica di scrivania pulita / schermo bloccato applicata a tutti i lavoratori da remoto e in ufficio" : "Clean desk / clear screen policy enforced for all remote and office workers"}</li>
            </ul>
          </Section>

          {/* 20. Security Contact */}
          <Section number="20" title={it ? "Contatto per la Sicurezza" : "Security Contact"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">{it ? "Tipo di Contatto" : "Contact Type"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{it ? "Dettagli" : "Details"}</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term={it ? "Incidenti di sicurezza e segnalazioni di violazione" : "Security incidents and breach reports"} meaning="security@hana.health" />
                  <DefRow term={it ? "Divulgazione responsabile / segnalazioni di bug" : "Responsible disclosure / bug reports"} meaning={it ? "security@hana.health (chiave PGP disponibile su richiesta)" : "security@hana.health (PGP key available on request)"} />
                  <DefRow term={it ? "Richieste di conformità e audit" : "Compliance and audit requests"} meaning="compliance@hana.health" />
                  <DefRow term={it ? "Domande generali sulla sicurezza" : "General security questions"} meaning="security@hana.health" />
                </tbody>
              </table>
            </div>
          </Section>

          {/* Footer note */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-[#718096]">
              HANA Health, Inc. &nbsp;|&nbsp; <a href="mailto:privacy@hana.health" className="text-blue-600 hover:text-blue-800 transition-colors">privacy@hana.health</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

/* Reusable section wrapper */
function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h3 className="text-xl font-semibold text-[#1e2a3a] mb-4 tracking-tight">
        {number}. {title}
      </h3>
      <div className="text-[15px] leading-[1.8] text-[#718096]">
        {children}
      </div>
    </section>
  );
}

/* Reusable table row */
function DefRow({ term, meaning }: { term: string; meaning: string }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3 font-medium text-[#1e2a3a]">{term}</td>
      <td className="px-4 py-3">{meaning}</td>
    </tr>
  );
}
