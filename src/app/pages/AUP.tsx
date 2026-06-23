import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { getLocale } from "../../lib/i18n";

function Section({ number, title, children }: { number?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="border-b border-slate-200 pb-3 mb-6">
        <h2 className="text-xl font-semibold text-[#1e2a3a] tracking-tight">
          {number ? `${number}. ${title}` : title}
        </h2>
      </div>
      <div className="space-y-4 text-[15px] leading-[1.8] text-[#718096]">
        {children}
      </div>
    </div>
  );
}

function Sub({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-[#1e2a3a] mb-3">{number} {title}</h3>
      {children}
    </div>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2">{children}</ul>;
}

export function AUP() {
  const it = getLocale() === "it";

  return (
    <>
      <SEO
        title={it ? "Politica di Uso Accettabile | HANA Health" : "Acceptable Use Policy | HANA Health"}
        description={
          it
            ? "Politica di Uso Accettabile di HANA Health — descrive gli usi vietati e limitati dei servizi, dei prodotti e della piattaforma di HANA."
            : "HANA Health Acceptable Use Policy — describes prohibited and restricted uses of HANA's services, products, and platform."
        }
        path="/aup"
      />

      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-[#00122F] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">HANA Health, Inc.</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-6 leading-[1.1]">
              {it ? "Politica di Uso Accettabile" : "Acceptable Use Policy"}
            </h1>
            <p className="text-slate-400 text-base">
              {it
                ? "Data di Efficacia: 10 maggio 2026  |  Ultimo Aggiornamento: 10 maggio 2026"
                : "Effective Date: 10 May 2026  |  Last Updated: 10 May 2026"}
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-16 text-[#1e2a3a]">
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            {it
              ? 'La presente Politica di Uso Accettabile (la "AUP") descrive gli usi vietati e limitati dei servizi, dei prodotti e della piattaforma di HANA Health, Inc. (i "Servizi"). La presente AUP è incorporata mediante rinvio nel Contratto Quadro di Servizi HANA (il "Contratto") tra HANA e il Cliente. I termini con lettera maiuscola non definiti qui hanno il significato loro attribuito nel Contratto.'
              : 'This Acceptable Use Policy (the "AUP") describes prohibited and restricted uses of HANA Health, Inc.\'s services, products, and platform (the "Services"). This AUP is incorporated by reference into the HANA Master Services Agreement (the "Agreement") between HANA and Customer. Capitalized terms not defined here have the meanings given in the Agreement.'}
          </p>
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            {it
              ? "Utilizzando i Servizi, il Cliente e i suoi Utenti accettano di rispettare la presente AUP. La violazione della presente AUP costituisce una violazione sostanziale del Contratto e può comportare la sospensione o la cessazione dei Servizi."
              : "By using the Services, Customer and its Users agree to comply with this AUP. Violation of this AUP is a material breach of the Agreement and may result in suspension or termination of the Services."}
          </p>

          <Section number="1" title={it ? "Principi generali" : "General principles"}>
            <p>
              {it
                ? "Il Cliente e i suoi Utenti devono utilizzare i Servizi in modo lecito, etico e in conformità con il Contratto. Il Cliente è responsabile di tutte le attività svolte tramite l'account del Cliente, comprese le attività del personale, dei collaboratori e dei pazienti del Cliente."
                : "Customer and its Users must use the Services lawfully, ethically, and in accordance with the Agreement. Customer is responsible for all activity conducted through Customer's account, including activity by Customer's personnel, contractors, and patients."}
            </p>
          </Section>

          <Section number="2" title={it ? "Usi vietati" : "Prohibited uses"}>
            <p>
              {it ? (
                <>Il Cliente e i suoi Utenti <strong className="text-[#1e2a3a]">non devono</strong>, e non devono consentire ad alcun terzo di:</>
              ) : (
                <>Customer and its Users <strong className="text-[#1e2a3a]">must not</strong>, and must not allow any third party to:</>
              )}
            </p>

            <Sub number="2.1" title={it ? "Condotta illecita" : "Unlawful conduct"}>
              <Ul>
                {it ? (
                  <>
                    <li>Utilizzare i Servizi per violare qualsiasi legge, regolamento o ordine applicabile, incluso il Telephone Consumer Protection Act (TCPA), la Telemarketing Sales Rule (TSR), il Do-Not-Call Implementation Act, il CAN-SPAM Act, l'Health Insurance Portability and Accountability Act (HIPAA), il Gramm-Leach-Bliley Act (GLBA), il Fair Credit Reporting Act (FCRA), o le leggi statali applicabili in materia di privacy, tutela dei consumatori o privacy biometrica.</li>
                    <li>Utilizzare i Servizi per commettere frode, inganno o qualsiasi pratica sleale o abusiva.</li>
                    <li>Utilizzare i Servizi per effettuare chiamate o inviare messaggi a destinatari che non hanno fornito il consenso richiesto dalla legge applicabile, o che hanno rinunciato a ricevere comunicazioni.</li>
                  </>
                ) : (
                  <>
                    <li>Use the Services to violate any applicable law, regulation, or order, including the Telephone Consumer Protection Act (TCPA), the Telemarketing Sales Rule (TSR), the Do-Not-Call Implementation Act, the CAN-SPAM Act, the Health Insurance Portability and Accountability Act (HIPAA), the Gramm-Leach-Bliley Act (GLBA), the Fair Credit Reporting Act (FCRA), or applicable state privacy, consumer protection, or biometric privacy laws.</li>
                    <li>Use the Services to perpetrate fraud, deception, or any unfair or abusive practice.</li>
                    <li>Use the Services to make calls or send messages to recipients who have not provided required consent under applicable law, or who have opted out of communications.</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="2.2" title={it ? "Danno e abuso" : "Harm and abuse"}>
              <Ul>
                {it ? (
                  <>
                    <li>Utilizzare i Servizi per molestare, minacciare, intimidire, diffamare o altrimenti danneggiare qualsiasi individuo o organizzazione.</li>
                    <li>Utilizzare i Servizi per discriminare qualsiasi individuo o gruppo sulla base di qualsiasi caratteristica protetta.</li>
                    <li>Utilizzare i Servizi per comunicare con minori in qualsiasi contesto in cui tale comunicazione sia limitata o vietata dalla legge.</li>
                  </>
                ) : (
                  <>
                    <li>Use the Services to harass, threaten, intimidate, defame, or otherwise harm any individual or organization.</li>
                    <li>Use the Services to discriminate against any individual or group on the basis of any protected characteristic.</li>
                    <li>Use the Services to communicate with minors in any context where such communication is restricted or prohibited by law.</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="2.3" title={it ? "Falsa rappresentazione e impersonificazione" : "Misrepresentation and impersonation"}>
              <Ul>
                {it ? (
                  <>
                    <li>Utilizzare i Servizi per impersonare qualsiasi individuo, organizzazione o autorità governativa senza legittima autorizzazione o, ove richiesto, il consenso scritto espresso della persona impersonata.</li>
                    <li>Utilizzare i Servizi per generare voci sintetizzate o clonate che imitano persone reali senza adeguata autorizzazione.</li>
                    <li>Travisare la natura assistita da AI delle comunicazioni ove la divulgazione sia richiesta dalla legge (incluse le norme FCC relative alle comunicazioni vocali generate da AI).</li>
                  </>
                ) : (
                  <>
                    <li>Use the Services to impersonate any individual, organization, or governmental authority without lawful authorization or, where required, the express written consent of the person being impersonated.</li>
                    <li>Use the Services to generate synthesized or cloned voices that mimic real individuals without proper authorization.</li>
                    <li>Misrepresent the AI-assisted nature of communications where disclosure is required by law (including under FCC rules regarding AI-generated voice communications).</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="2.4" title={it ? "Applicazioni ad alto rischio" : "High-risk applications"}>
              <Ul>
                {it ? (
                  <>
                    <li>Utilizzare i Servizi in relazione a qualsiasi Attività ad Alto Rischio, inclusi risposta alle emergenze, sistemi di supporto vitale, decisioni di diagnosi o trattamento medico, o qualsiasi applicazione in cui il malfunzionamento dei Servizi potrebbe ragionevolmente comportare morte, lesioni personali, perdite finanziarie per un terzo o danni ambientali.</li>
                    <li>Utilizzare i Servizi come sostituto del giudizio professionale medico, legale o finanziario.</li>
                    <li>Indirizzare i Servizi a fornire consigli medici, diagnosi o raccomandazioni di trattamento ai pazienti.</li>
                  </>
                ) : (
                  <>
                    <li>Use the Services in connection with any High-Risk Activity, including emergency response, life-support systems, medical diagnosis or treatment decisions, or any application where failure of the Services could reasonably be expected to result in death, personal injury, financial loss to a third party, or environmental damage.</li>
                    <li>Use the Services as a substitute for professional medical, legal, or financial judgment.</li>
                    <li>Direct the Services to provide medical advice, diagnosis, or treatment recommendations to patients.</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="2.5" title={it ? "Restrizioni tecniche" : "Technical restrictions"}>
              <Ul>
                {it ? (
                  <>
                    <li>Effettuare reverse engineering, decompilare, disassemblare o tentare di ricavare il codice sorgente dei Servizi.</li>
                    <li>Copiare, modificare o creare opere derivate dei Servizi o di qualsiasi Tecnologia HANA, salvo quanto espressamente consentito dal Contratto.</li>
                    <li>Condurre test di sicurezza, penetration testing, scansione delle vulnerabilità, test di carico o benchmarking dei Servizi senza il previo consenso scritto di HANA.</li>
                    <li>Interferire con il funzionamento dei Servizi, causarne il degrado delle prestazioni o imporre un carico irragionevole sui Servizi.</li>
                    <li>Tentare di ottenere accesso non autorizzato ai Servizi, agli account o ai sistemi diversi da quelli per i quali al Cliente è stato concesso l'accesso.</li>
                    <li>Utilizzare le credenziali dell'account di qualsiasi altra persona o condividere le credenziali del Cliente con terzi non autorizzati.</li>
                    <li>Inviare codice dannoso, virus, worm o contenuti che violino i diritti di terzi verso o tramite i Servizi.</li>
                  </>
                ) : (
                  <>
                    <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Services.</li>
                    <li>Copy, modify, or create derivative works of the Services or any HANA Technology, except as expressly permitted by the Agreement.</li>
                    <li>Conduct security testing, penetration testing, vulnerability scanning, load testing, or benchmarking of the Services without HANA's prior written consent.</li>
                    <li>Interfere with the operation of, cause performance degradation of, or impose an unreasonable load on the Services.</li>
                    <li>Attempt to gain unauthorized access to the Services, accounts, or systems other than those for which Customer has been granted access.</li>
                    <li>Use any other person's account credentials or share Customer's credentials with unauthorized third parties.</li>
                    <li>Submit malicious code, viruses, worms, or content that infringes any third party's rights to or through the Services.</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="2.6" title={it ? "Uso concorrenziale" : "Competitive use"}>
              <Ul>
                {it ? (
                  <>
                    <li>Utilizzare i Servizi per sviluppare, addestrare, perfezionare, validare o migliorare qualsiasi modello di intelligenza artificiale o di machine learning che sia in concorrenza con i Servizi o con qualsiasi Tecnologia HANA.</li>
                    <li>Utilizzare gli Output dei Servizi per compilare un database allo scopo di competere con o sostituire i Servizi.</li>
                  </>
                ) : (
                  <>
                    <li>Use the Services to develop, train, fine-tune, validate, or improve any artificial intelligence or machine-learning model that competes with the Services or any HANA Technology.</li>
                    <li>Use Outputs of the Services to compile a database for the purpose of competing with or replacing the Services.</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="2.7" title={it ? "Rivendita e sublicenza" : "Resale and sublicensing"}>
              <Ul>
                {it ? (
                  <>
                    <li>Rivendere, sublicenziare, dare in locazione, distribuire o altrimenti rendere disponibili i Servizi a qualsiasi terzo senza il previo consenso scritto di HANA, salvo per l'utilizzo da parte degli Utenti autorizzati del Cliente in conformità con il Contratto.</li>
                  </>
                ) : (
                  <>
                    <li>Resell, sublicense, lease, distribute, or otherwise make the Services available to any third party without HANA's prior written consent, except for use by Customer's authorized Users in accordance with the Agreement.</li>
                  </>
                )}
              </Ul>
            </Sub>
          </Section>

          <Section number="3" title={it ? "Obblighi del Cliente specifici per la voice AI" : "Customer obligations specific to voice AI"}>
            <p>
              {it
                ? "Il Cliente riconosce che i Servizi includono comunicazioni vocali generate da AI e si assume le seguenti responsabilità:"
                : "Customer acknowledges that the Services include AI-generated voice communications and assumes the following responsibilities:"}
            </p>

            <Sub number="3.1" title={it ? "Consenso del paziente" : "Patient consent"}>
              <Ul>
                {it ? (
                  <>
                    <li>Ottenere e mantenere tutti i consensi, le autorizzazioni e le approvazioni richiesti dalla legge affinché HANA possa effettuare e ricevere chiamate o inviare messaggi per conto del Cliente, inclusi eventuali consensi richiesti per le comunicazioni vocali generate da AI ai sensi del TCPA e delle norme FCC.</li>
                    <li>Conservare registrazioni verificabili di tali consensi e fornirle a HANA su ragionevole richiesta.</li>
                  </>
                ) : (
                  <>
                    <li>Obtain and maintain all consents, authorizations, and approvals required by law for HANA to make and receive calls or send messages on Customer's behalf, including any consents required for AI-generated voice communications under the TCPA and FCC rules.</li>
                    <li>Maintain auditable records of such consents and provide them to HANA upon reasonable request.</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="3.2" title={it ? "Divulgazione" : "Disclosure"}>
              <Ul>
                {it ? (
                  <>
                    <li>Garantire che la natura assistita da AI delle comunicazioni sia divulgata ai destinatari ove richiesto dalla legge.</li>
                    <li>Garantire che tutti gli script di chiamata, i prompt e i contenuti della knowledge base utilizzati con i Servizi rappresentino accuratamente il Cliente e la natura delle comunicazioni.</li>
                  </>
                ) : (
                  <>
                    <li>Ensure that the AI-assisted nature of communications is disclosed to recipients where required by law.</li>
                    <li>Ensure that all call scripts, prompts, and knowledge base content used with the Services accurately represent Customer and the nature of the communications.</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="3.3" title={it ? "Supervisione umana" : "Human oversight"}>
              <Ul>
                {it ? (
                  <>
                    <li>Mantenere un'adeguata supervisione umana degli Output generati dai Servizi prima di agire o comunicare qualsiasi Output a qualsiasi paziente o terzo.</li>
                    <li>Indirizzare i chiamanti con necessità mediche di emergenza o urgenti ai servizi di emergenza appropriati.</li>
                  </>
                ) : (
                  <>
                    <li>Maintain appropriate human oversight of Outputs generated by the Services before acting upon or communicating any Output to any patient or third party.</li>
                    <li>Direct callers with emergency or urgent medical needs to appropriate emergency services.</li>
                  </>
                )}
              </Ul>
            </Sub>

            <Sub number="3.4" title={it ? "Conformità do-not-call" : "Do-not-call compliance"}>
              <Ul>
                {it ? (
                  <>
                    <li>Mantenere e rispettare le liste do-not-call interne e nazionali, le preferenze di opt-out e le restrizioni applicabili sugli orari di chiamata.</li>
                  </>
                ) : (
                  <>
                    <li>Maintain and honor internal and national do-not-call lists, opt-out preferences, and applicable calling-time restrictions.</li>
                  </>
                )}
              </Ul>
            </Sub>
          </Section>

          <Section number="4" title={it ? "Sanità e PHI" : "Healthcare and PHI"}>
            <p>
              {it
                ? "Quando i Servizi trattano Informazioni Sanitarie Protette (PHI), il Cliente deve rispettare l'HIPAA, il Business Associate Agreement (BAA) stipulato tra le parti e tutte le leggi statali applicabili in materia di privacy sanitaria. Il Cliente non deve trasmettere PHI ai Servizi attraverso alcun canale non autorizzato dal Contratto e dal BAA."
                : "When the Services process Protected Health Information (PHI), Customer must comply with HIPAA, the Business Associate Agreement (BAA) executed between the parties, and all applicable state medical privacy laws. Customer must not transmit PHI to the Services through any channel not authorized by the Agreement and the BAA."}
            </p>
          </Section>

          <Section number="5" title={it ? "Segnalazione delle violazioni" : "Reporting violations"}>
            <p>
              {it ? (
                <>
                  Se il Cliente viene a conoscenza di qualsiasi violazione effettiva o sospetta della presente AUP, il Cliente deve notificarlo tempestivamente a HANA per iscritto all'indirizzo{" "}
                  <a href="mailto:abuse@hana.health" className="text-blue-600 hover:underline">abuse@hana.health</a>.
                  Le segnalazioni dovrebbero includere dettagli sufficienti affinché HANA possa effettuare le indagini.
                </>
              ) : (
                <>
                  If Customer becomes aware of any actual or suspected violation of this AUP, Customer must promptly notify HANA in writing at{" "}
                  <a href="mailto:abuse@hana.health" className="text-blue-600 hover:underline">abuse@hana.health</a>.
                  Reports should include sufficient detail for HANA to investigate.
                </>
              )}
            </p>
          </Section>

          <Section number="6" title={it ? "Applicazione" : "Enforcement"}>
            <p>{it ? "HANA può, a sua esclusiva discrezione e in conformità con il Contratto:" : "HANA may, in its sole discretion and consistent with the Agreement:"}</p>
            <Ul>
              {it ? (
                <>
                  <li>Indagare su qualsiasi violazione effettiva o sospetta della presente AUP</li>
                  <li>Sospendere o limitare l'accesso ai Servizi</li>
                  <li>Rimuovere o rifiutare di elaborare contenuti o comunicazioni</li>
                  <li>Collaborare con le forze dell'ordine e le autorità di regolamentazione</li>
                  <li>Risolvere il Contratto per violazione sostanziale</li>
                </>
              ) : (
                <>
                  <li>Investigate any actual or suspected violation of this AUP</li>
                  <li>Suspend or restrict access to the Services</li>
                  <li>Remove or refuse to process content or communications</li>
                  <li>Cooperate with law enforcement and regulatory authorities</li>
                  <li>Terminate the Agreement for material breach</li>
                </>
              )}
            </Ul>
            <p className="mt-4">
              {it
                ? "HANA si adopererà con sforzi commercialmente ragionevoli per fornire preavviso della sospensione o limitazione ove praticabile, salvo nei casi in cui sia necessaria un'azione immediata per proteggere HANA, i Servizi o terzi."
                : "HANA will use commercially reasonable efforts to provide notice of suspension or restriction where practicable, except where immediate action is required to protect HANA, the Services, or third parties."}
            </p>
          </Section>

          <Section number="7" title={it ? "Modifiche" : "Modifications"}>
            <p>
              {it ? (
                <>
                  HANA può aggiornare la presente AUP di volta in volta per riflettere modifiche alla normativa applicabile, ai Servizi o ai requisiti operativi. Le modifiche sostanziali saranno pubblicate su{" "}
                  <a href="https://hana.health/aup" className="text-blue-600 hover:underline">hana.health/aup</a>{" "}
                  con ragionevole preavviso (di norma trenta (30) giorni), salvo nei casi in cui sia necessario un preavviso più breve per affrontare una questione di sicurezza, legale o normativa.
                </>
              ) : (
                <>
                  HANA may update this AUP from time to time to reflect changes in applicable law, the Services, or operational requirements. Material changes will be posted at{" "}
                  <a href="https://hana.health/aup" className="text-blue-600 hover:underline">hana.health/aup</a>{" "}
                  with reasonable advance notice (typically thirty (30) days), except where shorter notice is necessary to address a security, legal, or regulatory issue.
                </>
              )}
            </p>
          </Section>

          <Section number="8" title={it ? "Contatti" : "Contact"}>
            <p>{it ? "Le domande relative alla presente AUP possono essere indirizzate a:" : "Questions regarding this AUP can be directed to:"}</p>
            <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 text-[15px]">
              <p className="font-semibold text-[#1e2a3a] mb-1">HANA Health, Inc.</p>
              <p>{it ? "Email: " : "Email: "}<a href="mailto:legal@hana.health" className="text-blue-600 hover:underline">legal@hana.health</a></p>
              <p>{it ? "Web: " : "Web: "}<a href="https://hana.health/aup" className="text-blue-600 hover:underline">hana.health/aup</a></p>
            </div>
          </Section>

          <div className="border-t border-slate-200 pt-8 mt-4">
            <p className="text-[13px] text-slate-400 italic">
              {it
                ? "La presente AUP è incorporata mediante rinvio nel Contratto Quadro di Servizi HANA e nell'Ordine sottoscritto tra HANA Health, Inc. e il Cliente. In caso di conflitto, prevale il Contratto."
                : "This AUP is incorporated by reference into the HANA Master Services Agreement and the Order Form executed between HANA Health, Inc. and Customer. In the event of conflict, the Agreement governs."}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
