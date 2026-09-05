import { Footer } from "../components/layout/Footer";
import { SEO } from "../components/SEO";
import { getLocale } from "../../lib/i18n";

export function Terms() {
  const it = getLocale() === "it";
  return (
    <>
      {/* Without this the route inherited the homepage title and canonical —
          i.e. Google was told /terms is a duplicate of the homepage. */}
      <SEO
        title={it ? "Termini di Servizio e Politica di Sicurezza | HANA Health" : "Terms of Service & Security Policy | HANA Health"}
        description={
          it
            ? "Termini di Servizio e Politica di Sicurezza di HANA Health, Inc. — condizioni d'uso della piattaforma di coinvolgimento dei pazienti, impegni di sicurezza e trattamento dei dati."
            : "HANA Health, Inc. Terms of Service & Security Policy — conditions of use for the patient engagement platform, security commitments, and data handling."
        }
        path="/terms"
      />
      <div className="bg-paper-bright min-h-screen">
        {/* Hero */}
        <section className="bg-navy text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">HANA Health</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-6 leading-[1.1]">
              {it ? <>Termini di Servizio<br />e Politica di Sicurezza</> : <>Terms of Service<br />& Security Policy</>}
            </h1>
            <p className="text-slate-400 text-base">
              {it ? "Data di Efficacia: 14 giugno 2026" : "Effective Date: 14 June 2026"} &nbsp;|&nbsp; {it ? "Ultimo aggiornamento: 14 agosto 2026" : "Last Updated: 14 August 2026"} &nbsp;|&nbsp; {it ? "Versione" : "Version"}: 2.2
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-16 text-navy-soft">
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            {it
              ? "I presenti Termini disciplinano l'accesso e l'uso della piattaforma di coinvolgimento dei pazienti HANA da parte degli operatori sanitari (Clienti) e dei loro pazienti (Utenti Finali). Un separato Accordo sul Trattamento dei Dati (DPA) disciplina gli obblighi di protezione dei dati ed è incorporato mediante rinvio."
              : "These Terms govern access to and use of the HANA patient engagement platform by healthcare providers (Clients) and their patients (End Users). A separate Data Processing Agreement (DPA) governs data protection obligations and is incorporated by reference."}
          </p>

          {/* PART A */}
          <div className="border-b border-rule pb-4 mb-10">
            <h2 className="text-2xl font-semibold text-navy-soft tracking-tight">{it ? "PARTE A — TERMINI DI SERVIZIO" : "PART A — TERMS OF SERVICE"}</h2>
          </div>

          {/* 1. Definitions */}
          <Section number="1" title={it ? "Definizioni" : "Definitions"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-rule rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-paper-2">
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule w-1/3">{it ? "Termine" : "Term"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule">{it ? "Significato" : "Meaning"}</th>
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
            <h4 className="font-semibold text-navy-soft mb-3">{it ? "3.1 Autorizzazioni e Responsabilità Clinica" : "3.1 Licensing and Clinical Responsibility"}</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>{it ? "I Clienti devono essere in possesso di tutte le licenze e le autorizzazioni regolatorie pertinenti necessarie per erogare servizi sanitari nella loro giurisdizione" : "Clients must hold all relevant licences and regulatory approvals required to deliver healthcare services in their jurisdiction"}</li>
              <li>{it ? "I Clienti conservano la piena responsabilità clinica e professionale per tutte le decisioni di cura dei pazienti, indipendentemente dagli output generati dall'AI" : "Clients retain full clinical and professional responsibility for all patient care decisions, regardless of AI-generated outputs"}</li>
              <li>{it ? "I Clienti devono designare un clinico nominativamente individuato responsabile dell'esame delle sintesi generate da HANA e degli avvisi di escalation" : "Clients must designate a named clinician responsible for reviewing HANA-generated summaries and escalation alerts"}</li>
              <li>{it ? "I Clienti devono assicurare che la propria implementazione di HANA sia conforme a tutte le normative sanitarie nazionali e locali applicabili" : "Clients must ensure their deployment of HANA complies with all applicable national and local healthcare regulations"}</li>
            </ul>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "3.2 Consenso del Paziente" : "3.2 Patient Consent"}</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>{it ? "I Clienti sono responsabili dell'ottenimento del consenso informato dei pazienti prima di attivare i flussi di lavoro di coinvolgimento HANA" : "Clients are responsible for obtaining informed consent from patients prior to deploying HANA engagement workflows"}</li>
              <li>{it ? "Il consenso deve includere: la notifica che le interazioni sono mediate dall'AI; la spiegazione dell'uso dei dati; il diritto di opt-out; le procedure di escalation" : "Consent must include: notification that interactions are AI-mediated; explanation of data use; right to opt out; escalation procedures"}</li>
              <li>{it ? "Per i minori o i pazienti privi di capacità, i Clienti devono ottenere il consenso da un rappresentante legale appropriato" : "For minors or patients lacking capacity, clients must obtain consent from an appropriate legal representative"}</li>
              <li>{it ? "I Clienti devono fornire ai pazienti l'accesso all'Informativa sulla Privacy di HANA al momento dell'onboarding" : "Clients must provide patients with access to HANA's Privacy Policy at onboarding"}</li>
            </ul>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "3.3 Uso Appropriato" : "3.3 Appropriate Use"}</h4>
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
              <table className="w-full text-sm border border-rule rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-paper-2">
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule w-2/5">{it ? "Metrica" : "Metric"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule">{it ? "Impegno" : "Commitment"}</th>
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

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "8.1 HANA non è responsabile per:" : "8.1 HANA is not liable for:"}</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>{it ? "Le decisioni cliniche prese dai clinici del Cliente, indipendentemente dal fatto che siano stati consultati output generati dall'AI" : "Clinical decisions made by Client clinicians, regardless of whether AI-generated outputs were consulted"}</li>
              <li>{it ? "I danni derivanti dalla mancata revisione degli avvisi di escalation da parte del Cliente" : "Harm resulting from the Client's failure to review escalation alerts"}</li>
              <li>{it ? "Le interruzioni del servizio causate da guasti dell'infrastruttura di terze parti (telefonia, cloud), a condizione che HANA abbia adempiuto ai propri obblighi di SLA" : "Service disruptions caused by third-party infrastructure failures (telephony, cloud), provided HANA has met its own SLA obligations"}</li>
              <li>{it ? "Gli esiti in implementazioni in cui i protocolli clinici di HANA sono stati modificati in modo sostanziale senza l'approvazione di HANA" : "Outcomes in deployments where HANA's clinical protocols have been materially modified without HANA's approval"}</li>
            </ul>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "8.2 Manleva del Cliente" : "8.2 Client Indemnification"}</h4>
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

          {/* 11. Disclaimer of Warranties */}
          <Section number="11" title={it ? "Esclusione di Garanzie" : "Disclaimer of Warranties"}>
            <p className="mb-4">
              {it
                ? "La piattaforma è fornita “così com'è” e “come disponibile”. Nella misura massima consentita dalla legge, HANA esclude ogni garanzia, espressa, implicita o di legge, incluse le garanzie implicite di commerciabilità, idoneità per uno scopo specifico, titolarità e non violazione di diritti di terzi. HANA non garantisce che la piattaforma sarà ininterrotta, priva di errori o esente da componenti dannosi, né che ogni difetto verrà corretto."
                : "The platform is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, HANA disclaims all warranties, whether express, implied, or statutory, including the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. HANA does not warrant that the platform will be uninterrupted, error-free, or free of harmful components, or that every defect will be corrected."}
            </p>
            <p className="mb-4">
              {it
                ? "La presente esclusione non limita gli impegni espressi assunti da HANA nella Sezione 7 (Livelli di Servizio), nella Parte B (Politica di Sicurezza) o nel Business Associate Agreement, che restano pienamente vincolanti."
                : "This disclaimer does not limit the express commitments HANA makes in Section 7 (Service Levels), Part B (Security Policy), or the Business Associate Agreement, which remain fully binding."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "11.1 Nessun parere medico" : "11.1 No medical advice"}</h4>
            <p>
              {it
                ? "La piattaforma non è un dispositivo medico e non fornisce pareri medici, diagnosi o trattamenti. Gli output generati dall'AI hanno carattere informativo e sono destinati a supportare, non a sostituire, il giudizio professionale di un clinico abilitato. Il Cliente resta l'unico responsabile di ogni decisione clinica. Si veda la Sezione 5."
                : "The platform is not a medical device and does not provide medical advice, diagnosis, or treatment. AI-generated output is informational and is intended to support, not replace, the professional judgment of a licensed clinician. The Client remains solely responsible for all clinical decisions. See Section 5."}
            </p>
          </Section>

          {/* 12. Patient Contact, Call Recording, and Consent */}
          <Section number="12" title={it ? "Contatto dei Pazienti, Registrazione delle Chiamate e Consenso" : "Patient Contact, Call Recording, and Consent"}>
            <p className="mb-4">
              {it
                ? "HANA effettua e riceve chiamate e messaggi vocali automatizzati per conto del Cliente. La responsabilità del consenso è ripartita come segue."
                : "HANA places and receives automated voice calls and messages on behalf of the Client. Responsibility for consent is allocated as follows."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "12.1 Responsabilità del Cliente" : "12.1 Client responsibility"}</h4>
            <p className="mb-6">
              {it
                ? "Il Cliente è l'unica parte titolare di un rapporto con il paziente. Il Cliente dichiara e garantisce che, per ogni contatto che fornisce o autorizza, ha ottenuto e documentato tutti i consensi richiesti dalla normativa applicabile, incluso il Telephone Consumer Protection Act (TCPA), le leggi statali in materia di telemarketing e chiamate, e le leggi applicabili sulle intercettazioni e sulla registrazione delle chiamate. Il Cliente è responsabile del rispetto delle revoche del consenso, delle richieste di iscrizione ai registri delle opposizioni e delle fasce orarie consentite per le chiamate, nonché della tenuta dei propri registri di opposizione."
                : "The Client is the only party with a relationship to the patient. The Client represents and warrants that, for every patient contact record it supplies or authorises, it has obtained and documented all consents required by applicable law, including the Telephone Consumer Protection Act (TCPA), state telemarketing and calling laws, and applicable wiretap and call-recording laws. The Client is responsible for honouring revocations of consent, do-not-call requests, and permitted calling hours, and for maintaining its own do-not-call records."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "12.2 Registrazione e monitoraggio" : "12.2 Recording and monitoring"}</h4>
            <p className="mb-6">
              {it
                ? "Le chiamate effettuate tramite la piattaforma possono essere registrate e trascritte per erogare il servizio, per produrre documentazione clinica e per finalità di revisione della qualità e della sicurezza. Nelle giurisdizioni che richiedono il consenso di tutte le parti, HANA fornisce un'informativa configurabile all'inizio di ogni chiamata. Il Cliente è responsabile di attivare e mantenere tale informativa in conformità alle leggi applicabili a sé e ai propri pazienti."
                : "Calls conducted through the platform may be recorded and transcribed to deliver the service, to produce clinical documentation, and for quality and safety review. In jurisdictions that require all-party consent, HANA provides a configurable disclosure at the start of each call. The Client is responsible for enabling and maintaining that disclosure in line with the laws applicable to it and to its patients."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "12.3 Informativa sull'AI" : "12.3 AI disclosure"}</h4>
            <p className="mb-6">
              {it
                ? "All'inizio di ogni chiamata i pazienti vengono informati che stanno parlando con un assistente automatizzato, in coerenza con la Sezione 5 e con le normative applicabili in materia di trasparenza dell'AI, tra cui la California AB 3030 e disposizioni statali analoghe."
                : "Patients are told at the start of each call that they are speaking with an automated assistant, consistent with Section 5 and with applicable AI disclosure laws, including California AB 3030 and comparable state statutes."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "12.4 Opt-out e manleva" : "12.4 Opt-out and indemnity"}</h4>
            <p>
              {it
                ? "I pazienti possono rinunciare al contatto automatizzato in qualsiasi momento tramite i meccanismi descritti nella Sezione 4. Al ricevimento di una richiesta di opt-out, HANA sospende ogni ulteriore contatto automatizzato verso quel paziente e ne informa il Cliente. Le pretese derivanti dal mancato ottenimento o dal mancato mantenimento di un consenso richiesto sono coperte dalla manleva del Cliente di cui alla Sezione 8.2."
                : "Patients may opt out of automated contact at any time through the mechanisms described in Section 4. On receipt of an opt-out, HANA suppresses further automated contact for that patient and notifies the Client. Claims arising from the Client's failure to obtain or maintain a required consent are covered by the Client indemnity in Section 8.2."}
            </p>
          </Section>

          {/* 13. Class Action and Jury Trial Waiver */}
          <Section number="13" title={it ? "Rinuncia alle Azioni Collettive e al Giudizio con Giuria" : "Class Action and Jury Trial Waiver"}>
            <p className="mb-6">
              {it
                ? "La presente Sezione integra le disposizioni sull'arbitrato di cui alla Sezione 10 e si applica ai Clienti. Non si applica ai pazienti (Utenti Finali), che non sono tenuti a ricorrere all'arbitrato."
                : "This Section supplements the arbitration provisions in Section 10 and applies to Clients. It does not apply to patients (End Users), who are not required to arbitrate."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "13.1 Solo su base individuale" : "13.1 Individual basis only"}</h4>
            <p className="mb-6">
              {it
                ? "Il Cliente e HANA convengono che ciascuna parte potrà proporre pretese nei confronti dell'altra esclusivamente a titolo individuale, e non in qualità di attore o membro di una classe in un procedimento collettivo, consolidato o rappresentativo. L'arbitro non potrà riunire le pretese di più parti né presiedere alcuna forma di procedimento collettivo o rappresentativo."
                : "The Client and HANA agree that each may bring claims against the other only in an individual capacity, and not as a plaintiff or class member in any purported class, collective, consolidated, or representative proceeding. The arbitrator may not consolidate the claims of more than one party and may not preside over any form of class or representative proceeding."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "13.2 Rinuncia al giudizio con giuria" : "13.2 Jury trial waiver"}</h4>
            <p className="mb-6">
              {it
                ? "Nella misura in cui una controversia sia trattata in sede giudiziale anziché arbitrale, ciascuna parte rinuncia consapevolmente e volontariamente a ogni diritto a un giudizio con giuria."
                : "To the extent any dispute proceeds in court rather than arbitration, each party knowingly and voluntarily waives any right to a trial by jury."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "13.3 Preavviso di controversia" : "13.3 Pre-arbitration notice"}</h4>
            <p className="mb-6">
              {it
                ? "Prima di avviare un arbitrato, la parte che agisce deve inviare all'altra un avviso scritto di controversia che descriva la pretesa e il rimedio richiesto. Le parti tenteranno in buona fede di risolvere la questione nei 30 giorni successivi."
                : "Before initiating arbitration, the claiming party must send the other party a written notice of dispute describing the claim and the relief sought. The parties will then attempt in good faith to resolve it for 30 days."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "13.4 Autonomia delle clausole e diritto di opt-out" : "13.4 Severability and right to opt out"}</h4>
            <p>
              {it
                ? "Qualora la Sezione 13.1 risulti inefficace rispetto a una determinata pretesa o richiesta di rimedio, tale pretesa o richiesta sarà scorporata e trattata dinanzi al giudice competente, mentre le restanti previsioni delle Sezioni 10 e 13 rimarranno in vigore. Il Cliente può rinunciare all'applicazione delle Sezioni 10 e 13 mediante comunicazione scritta a legal@hana.health entro 30 giorni dalla prima accettazione dei presenti Termini. L'esercizio di tale facoltà non incide su alcuna altra previsione."
                : "If Section 13.1 is found unenforceable as to a particular claim or request for relief, that claim or request will be severed and heard in a court of competent jurisdiction, and the remainder of Sections 10 and 13 will remain in force. A Client may opt out of Sections 10 and 13 by written notice to legal@hana.health within 30 days of first accepting these Terms. Opting out does not affect any other provision."}
            </p>
          </Section>

          {/* 14. Additional United States Notices */}
          <Section number="14" title={it ? "Ulteriori Avvisi per gli Stati Uniti" : "Additional United States Notices"}>
            <h4 className="font-semibold text-navy-soft mb-3">{it ? "14.1 Avviso per i residenti in California" : "14.1 Notice for California users"}</h4>
            <p className="mb-6">
              {it
                ? "Ai sensi della Sezione 1789.3 del California Civil Code, i residenti in California hanno diritto al seguente avviso. Il fornitore di questo servizio è HANA Health, Inc. I reclami possono essere inviati a legal@hana.health. I residenti in California possono inoltre contattare la Complaint Assistance Unit della Division of Consumer Services del California Department of Consumer Affairs per iscritto all'indirizzo 1625 North Market Blvd., Suite N 112, Sacramento, CA 95834, oppure telefonicamente al numero (800) 952-5210."
                : "Under California Civil Code Section 1789.3, California residents are entitled to the following notice. The provider of this service is HANA Health, Inc. Complaints may be sent to legal@hana.health. California residents may also contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, CA 95834, or by telephone at (800) 952-5210."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "14.2 Diritti limitati del Governo degli Stati Uniti" : "14.2 U.S. Government restricted rights"}</h4>
            <p className="mb-6">
              {it
                ? "La piattaforma e la relativa documentazione costituiscono “commercial products” ai sensi del 48 C.F.R. 2.101, composti da “commercial computer software” e “commercial computer software documentation”. Ogni uso, modifica, riproduzione o divulgazione da parte o per conto del Governo degli Stati Uniti è disciplinato esclusivamente dai presenti Termini, in coerenza con il 48 C.F.R. 12.212 e il 48 C.F.R. 227.7202."
                : "The platform and its documentation are “commercial products” as defined in 48 C.F.R. 2.101, consisting of “commercial computer software” and “commercial computer software documentation”. Any use, modification, reproduction, or disclosure by or on behalf of the U.S. Government is governed solely by these Terms, consistent with 48 C.F.R. 12.212 and 48 C.F.R. 227.7202."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "14.3 Conformità in materia di esportazioni" : "14.3 Export compliance"}</h4>
            <p>
              {it
                ? "Ciascuna parte si conforma alle normative statunitensi applicabili in materia di controllo delle esportazioni e sanzioni. Il Cliente dichiara di non essere situato in un paese soggetto a embargo statunitense, di non essere un soggetto sottoposto a restrizioni, e di non consentire l'accesso alla piattaforma da tali paesi o a tali soggetti."
                : "Each party will comply with applicable U.S. export control and sanctions laws. The Client represents that it is not located in a country subject to U.S. embargo, is not a denied or restricted party, and will not permit access to the platform from such countries or by such parties."}
            </p>
          </Section>

          {/* PART B */}
          <div className="border-b border-rule pb-4 mb-10 mt-16">
            <h2 className="text-2xl font-semibold text-navy-soft tracking-tight">{it ? "PARTE B — POLITICA DI SICUREZZA" : "PART B — SECURITY POLICY"}</h2>
          </div>

          {/* 11. Security Governance */}
          <Section number="15" title={it ? "Governance della Sicurezza" : "Security Governance"}>
            <p className="mb-6">
              {it
                ? "HANA mantiene un Sistema di Gestione della Sicurezza delle Informazioni (ISMS) formale, allineato ai principi della norma ISO 27001. La governance della sicurezza è responsabilità congiunta del CTO e del Responsabile Privacy, con revisioni trimestrali da parte del team dirigenziale."
                : "HANA maintains a formal Information Security Management System (ISMS) aligned with ISO 27001 principles. Security governance is the joint responsibility of the CTO and Privacy Lead, with quarterly reviews by the leadership team."}
            </p>

            <h4 className="font-semibold text-navy-soft mb-3">{it ? "Sintesi del Quadro di Conformità" : "Compliance Framework Summary"}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-rule rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-paper-2">
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule">{it ? "Quadro Normativo" : "Framework"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule">{it ? "Stato" : "Status"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule">{it ? "Ambito" : "Scope"}</th>
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
                    <tr key={fw} className="border-b border-rule-soft last:border-0">
                      <td className="px-4 py-3 font-medium text-navy-soft">{fw}</td>
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
          <Section number="16" title={it ? "Crittografia dei Dati" : "Data Encryption"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-rule rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-paper-2">
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule w-2/5">{it ? "Contesto" : "Context"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule">{it ? "Standard" : "Standard"}</th>
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
          <Section number="17" title={it ? "Controllo degli Accessi" : "Access Control"}>
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
          <Section number="18" title={it ? "Gestione delle Vulnerabilità" : "Vulnerability Management"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "Scansione automatizzata delle vulnerabilità: quotidiana su tutta l'infrastruttura di produzione" : "Automated vulnerability scanning: daily on all production infrastructure"}</li>
              <li>{it ? "Penetration test: pentest esterno annuale condotto da terze parti; risultati esaminati entro 5 giorni lavorativi" : "Penetration testing: annual third-party external pentest; results reviewed within 5 business days"}</li>
              <li>{it ? "Gestione delle patch: vulnerabilità critiche corrette entro 48 ore; alte entro 7 giorni; medie entro 30 giorni" : "Patch management: critical vulnerabilities patched within 48 hours; high within 7 days; medium within 30 days"}</li>
              <li>{it ? "Scansione delle dipendenze: tutte le librerie di terze parti monitorate tramite strumenti automatizzati (tracciamento CVE)" : "Dependency scanning: all third-party libraries monitored via automated tooling (CVE tracking)"}</li>
              <li>{it ? "Programma bug bounty: policy di divulgazione responsabile disponibile su hana.health/security" : "Bug bounty programme: responsible disclosure policy available at hana.health/security"}</li>
            </ul>
          </Section>

          {/* 15. Incident Response */}
          <Section number="19" title={it ? "Risposta agli Incidenti" : "Incident Response"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-rule rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-paper-2">
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule w-2/5">{it ? "Fase" : "Phase"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule">{it ? "Impegno di HANA" : "HANA Commitment"}</th>
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
          <Section number="20" title={it ? "Sicurezza dei Sub-responsabili" : "Subprocessor Security"}>
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
          <Section number="21" title={it ? "Continuità Operativa e Disaster Recovery" : "Business Continuity and Disaster Recovery"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "Recovery Time Objective (RTO): 4 ore per un guasto della piattaforma di livello P1" : "Recovery Time Objective (RTO): 4 hours for P1 platform failure"}</li>
              <li>{it ? "Recovery Point Objective (RPO): 1 ora (replica continua; recupero point-in-time disponibile)" : "Recovery Point Objective (RPO): 1 hour (continuous replication; point-in-time recovery available)"}</li>
              <li>{it ? "Infrastruttura hot standby mantenuta in una regione AWS secondaria" : "Hot standby infrastructure maintained in secondary AWS region"}</li>
              <li>{it ? "Test completi di DR condotti due volte l'anno; risultati esaminati dalla dirigenza" : "Full DR tests conducted bi-annually; results reviewed by leadership"}</li>
              <li>{it ? "L'instradamento dell'escalation clinica rimane operativo durante le interruzioni della piattaforma tramite failover via SMS" : "Clinical escalation routing remains operational during platform outages via SMS failover"}</li>
            </ul>
          </Section>

          {/* 18. AI-Specific Security Measures */}
          <Section number="22" title={it ? "Misure di Sicurezza Specifiche per l'AI" : "AI-Specific Security Measures"}>
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
          <Section number="23" title={it ? "Sicurezza Fisica" : "Physical Security"}>
            <ul className="list-disc pl-6 space-y-2">
              <li>{it ? "HANA è un'azienda cloud-native; nessun dato dei pazienti viene trattato sui dispositivi dei dipendenti" : "HANA is a cloud-native company; no patient data is processed on employee devices"}</li>
              <li>{it ? "Per i deployment on-premise (Italia, Medio Oriente): l'accesso fisico ai server è controllato dall'istituzione sanitaria partner, con HANA che fornisce configurazioni server irrobustite e audit logging" : "For on-premise deployments (Italy, Middle East): physical server access is controlled by the healthcare institution partner, with HANA providing hardened server configurations and audit logging"}</li>
              <li>{it ? "Tutti i dipendenti di HANA completano una formazione obbligatoria di sensibilizzazione alla sicurezza all'ingresso e con cadenza annuale" : "All HANA employees complete mandatory security awareness training on joining and annually thereafter"}</li>
              <li>{it ? "Politica di scrivania pulita / schermo bloccato applicata a tutti i lavoratori da remoto e in ufficio" : "Clean desk / clear screen policy enforced for all remote and office workers"}</li>
            </ul>
          </Section>

          {/* 20. Security Contact */}
          <Section number="24" title={it ? "Contatto per la Sicurezza" : "Security Contact"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-rule rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-paper-2">
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule w-2/5">{it ? "Tipo di Contatto" : "Contact Type"}</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy-soft border-b border-rule">{it ? "Dettagli" : "Details"}</th>
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
          <div className="mt-16 pt-8 border-t border-rule text-center">
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
      <h3 className="text-xl font-semibold text-navy-soft mb-4 tracking-tight">
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
    <tr className="border-b border-rule-soft last:border-0">
      <td className="px-4 py-3 font-medium text-navy-soft">{term}</td>
      <td className="px-4 py-3">{meaning}</td>
    </tr>
  );
}
