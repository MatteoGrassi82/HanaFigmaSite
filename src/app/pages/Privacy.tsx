import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { getLocale } from "../../lib/i18n";

/**
 * Privacy Policy for the public hana.health website (site visitors / prospects).
 * Patient PHI processed on behalf of healthcare providers through the HANA
 * platform is governed separately by the Business Associate Agreement (BAA) and
 * Data Processing Agreement (DPA), not by this Site policy.
 *
 * Localized: all visible copy is held in self-contained EN/IT objects below and
 * selected via getLocale(). Layout, structure, props, and styling are unchanged.
 */

type Copy = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  dates: string;
  intro: React.ReactNode;
  phi: React.ReactNode;
  s1Title: string;
  s1Body: React.ReactNode;
  s2Title: string;
  s2Lead: string;
  s2ColCategory: string;
  s2ColExamples: React.ReactNode;
  s2Rows: { term: string; meaning: string }[];
  s2Note: string;
  s3Title: string;
  s3Lead: string;
  s3Items: string[];
  s3Bases: React.ReactNode;
  s4Title: string;
  s4Lead: string;
  s4Items: React.ReactNode[];
  s4Note: string;
  s5Title: string;
  s5ColProvider: string;
  s5ColPurpose: string;
  s5Rows: { term: string; meaning: string }[];
  s5Note: string;
  s6Title: string;
  s6Body: React.ReactNode;
  s7Title: string;
  s7Items: string[];
  s7Note: string;
  s8Title: string;
  s8Lead: React.ReactNode;
  s8Items: React.ReactNode[];
  s9Title: string;
  s9Body: React.ReactNode;
  s10Title: string;
  s10Body: React.ReactNode;
  s11Title: string;
  s11_1Title: string;
  s11_1Body: string;
  s11_2Title: string;
  s11_2Body: React.ReactNode;
  s11_3Title: string;
  s11_3Body: React.ReactNode;
  s12Title: string;
  s12Body: React.ReactNode;
  s13Title: string;
  s13Body: React.ReactNode;
  s14Title: string;
  s14Body: React.ReactNode;
  s15Title: string;
  s15Body: React.ReactNode;
  s16Title: string;
  s16Company: string;
  s16Privacy: string;
  s16General: string;
  s16Web: string;
};

const strong = (children: React.ReactNode) => <strong className="text-[#1e2a3a]">{children}</strong>;
const mail = (addr: string) => (
  <a href={`mailto:${addr}`} className="text-blue-600 hover:underline">{addr}</a>
);

const COPY_EN: Copy = {
  seoTitle: "Privacy Policy | HANA Health",
  seoDescription:
    "How HANA Health, Inc. collects, uses, discloses, and protects personal information of visitors to the hana.health website, including your privacy rights under GDPR and US state law.",
  eyebrow: "HANA Health, Inc.",
  title: "Privacy Policy",
  dates: "Effective Date: 14 June 2026  |  Last Updated: 14 June 2026",
  intro: (
    <>
      HANA Health, Inc. (&ldquo;HANA,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard personal information when you visit or interact with the {strong("hana.health")} website and related pages (collectively, the &ldquo;Site&rdquo;), and the privacy rights and choices available to you. By using the Site, you agree to this Privacy Policy.
    </>
  ),
  phi: (
    <>
      {strong("Patient health information.")} When HANA processes Protected Health Information (PHI) on behalf of a healthcare provider through the HANA platform, HANA acts as a HIPAA business associate (and, where applicable, a processor under the GDPR). That information is governed by the Business Associate Agreement (BAA) and Data Processing Agreement (DPA) between HANA and the provider, and by the provider&rsquo;s own Notice of Privacy Practices &mdash; not by this Site Privacy Policy. This Site is intended for healthcare organizations and prospective customers, not for patient care.
    </>
  ),
  s1Title: "Who we are",
  s1Body: (
    <>
      The entity responsible for personal information collected through the Site is HANA Health, Inc., a company organized in the United States. You can reach us about privacy at{" "}
      {mail("privacy@hana.health")}. If you are located in the European Economic Area (EEA) or the United Kingdom, see Section 11 for how to contact us and your right to lodge a complaint with a supervisory authority.
    </>
  ),
  s2Title: "Information we collect",
  s2Lead: "We collect the following categories of personal information:",
  s2ColCategory: "Category",
  s2ColExamples: <>Examples &amp; source</>,
  s2Rows: [
    { term: "Identifiers & contact data", meaning: "First and last name, email address, and organization, when you submit our contact form or request a demo. Provided directly by you." },
    { term: "Enquiry content", meaning: "The subject and free-text message you send us, and any information you include in it. Provided directly by you." },
    { term: "Scheduling data", meaning: "If you book a demo, your name, email, and selected time, processed through our scheduling provider (Calendly)." },
    { term: "Usage & device data", meaning: "IP address, approximate location, device and browser type, pages viewed, referring/exit pages, and interaction events, collected automatically via cookies and analytics (Google Analytics 4 / Google Tag Manager)." },
    { term: "Interactive media data", meaning: "If you engage an embedded VideoAsk (Typeform) widget, the responses and usage data you provide to it." },
  ],
  s2Note: "Please do not submit health information, PHI, or other sensitive personal data through the Site’s free-text fields. The Site is for general business enquiries only.",
  s3Title: "How we use personal information, and our legal bases",
  s3Lead: "We use personal information to:",
  s3Items: [
    "respond to your enquiries and provide the information, demos, or materials you request;",
    "communicate with you about our products, including sales and account communications;",
    "operate, maintain, secure, and improve the Site and measure its performance;",
    "detect, prevent, and respond to fraud, abuse, security incidents, and unlawful activity; and",
    "comply with legal obligations and enforce our agreements.",
  ],
  s3Bases: (
    <>
      Where the GDPR / UK GDPR applies, our legal bases are: {strong("performance of a contract or pre-contractual steps")} (responding to enquiries and demos); {strong("legitimate interests")} (operating, securing, and marketing our business, balanced against your rights); {strong("consent")} (non-essential cookies and certain marketing); and {strong("legal obligation")} (compliance and record-keeping). You may withdraw consent at any time.
    </>
  ),
  s4Title: "How we disclose personal information",
  s4Lead: "We do not sell your personal information for money. We disclose personal information to:",
  s4Items: [
    <>{strong("Service providers / processors")} who perform services on our behalf under contract, including those listed in Section 5;</>,
    <>{strong("Professional advisers")} (lawyers, auditors, accountants) where necessary;</>,
    <>{strong("Authorities and third parties")} when required by law, legal process, or to protect rights, safety, and security; and</>,
    <>{strong("A successor entity")} in connection with a merger, acquisition, financing, or sale of assets, subject to this Privacy Policy.</>,
  ],
  s4Note: "See Section 8 regarding analytics “sharing” for cross-context behavioral advertising and your choices.",
  s5Title: "Service providers we use",
  s5ColProvider: "Provider",
  s5ColPurpose: "Purpose",
  s5Rows: [
    { term: "Google LLC", meaning: "Website analytics and tag management (Google Analytics 4, Google Tag Manager)." },
    { term: "Calendly LLC", meaning: "Scheduling and booking of demo calls." },
    { term: "Typeform S.L. (VideoAsk)", meaning: "Embedded interactive video, where used." },
    { term: "FormSubmit", meaning: "Delivery of contact-form submissions to our team by email." },
    { term: "Cloud, email & CRM providers", meaning: "Hosting, email delivery, and management of enquiries and customer relationships." },
  ],
  s5Note: "Each provider is permitted to process personal information only as needed to perform services for us and consistent with this Privacy Policy.",
  s6Title: "Cookies and analytics",
  s6Body: (
    <>
      The Site uses cookies and similar technologies for functionality and analytics. For a full inventory, the providers involved, and how to manage your choices, please see our{" "}
      <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>.
    </>
  ),
  s7Title: "Data retention",
  s7Items: [
    "Contact and enquiry data: retained for as long as needed to handle your request and for a reasonable follow-up period, generally up to 24 months after our last interaction.",
    "Scheduling data: retained for the duration of the prospective or active customer relationship.",
    "Analytics data: retained according to the retention period configured in Google Analytics (generally up to 14 months).",
  ],
  s7Note: "We retain personal information longer only where required to comply with legal obligations, resolve disputes, or enforce our agreements, and we delete or de-identify it when no longer needed.",
  s8Title: "Your privacy choices (Do Not Sell or Share)",
  s8Lead: (
    <>
      We use analytics and tag-management tools (such as Google Analytics) that may involve &ldquo;sharing&rdquo; personal information for cross-context behavioral advertising or analytics under certain US state laws. We do not sell personal information for monetary consideration. You can exercise the following choices:
    </>
  ),
  s8Items: [
    <>Opt out of analytics/advertising cookies through our cookie controls (see the <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>) and your browser settings.</>,
    <>We honor the Global Privacy Control (GPC) signal as a valid opt-out of &ldquo;sale&rdquo;/&ldquo;sharing&rdquo; where required by law.</>,
    <>Submit a request to {mail("privacy@hana.health")}, or use the <a href="/contact" className="text-blue-600 hover:underline">contact form</a>.</>,
  ],
  s9Title: "Data security",
  s9Body: (
    <>
      We maintain administrative, technical, and physical safeguards designed to protect personal information, including encryption in transit (TLS 1.2/1.3) and at rest (AES-256), access controls, and monitoring. No method of transmission or storage is completely secure, and we cannot guarantee absolute security. Security measures applicable to the HANA platform and PHI are described in our Terms of Service &amp; Security Policy and the BAA.
    </>
  ),
  s10Title: "International data transfers",
  s10Body: (
    <>
      We are based in the United States and use service providers located in the US and elsewhere. If you access the Site from the EEA, the UK, or another region with data-transfer restrictions, your personal information may be transferred to and processed in the United States. Where required, we rely on appropriate safeguards for such transfers, such as the EU-US Data Privacy Framework and/or the European Commission&rsquo;s Standard Contractual Clauses (with the UK Addendum). You may request more information about these safeguards by contacting {mail("privacy@hana.health")}.
    </>
  ),
  s11Title: "Your rights",
  s11_1Title: "11.1 EEA / UK residents",
  s11_1Body: "Subject to applicable law, you have the right to access, rectify, erase, restrict, or object to the processing of your personal information; to data portability; and to withdraw consent. You also have the right to lodge a complaint with your local data protection supervisory authority.",
  s11_2Title: "11.2 California, and other US state residents",
  s11_2Body: (
    <>
      Depending on your state of residence (including California, Colorado, Connecticut, Texas, Virginia, and others), you may have the right to: confirm whether we process your personal information and access it; correct inaccuracies; delete it; obtain a portable copy; and opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information and of targeted advertising. California residents may also request the categories of personal information collected, the sources, the business purposes, and the categories of third parties to whom it is disclosed, and may limit the use of sensitive personal information. We will not discriminate against you for exercising these rights.
    </>
  ),
  s11_3Title: "11.3 How to exercise your rights",
  s11_3Body: (
    <>
      Submit a request by emailing {mail("privacy@hana.health")} or using our <a href="/contact" className="text-blue-600 hover:underline">contact form</a>. We will verify your request as required by law and respond within the applicable timeframes. You may use an authorized agent where permitted.
    </>
  ),
  s12Title: "Children's privacy",
  s12Body: (
    <>
      The Site is directed to healthcare organizations and businesses, not to children, and we do not knowingly collect personal information from children through the Site. Health information concerning minor patients that is processed through the HANA platform is handled under the applicable BAA/DPA and the provider&rsquo;s authority, with parental or guardian consent obtained by the provider. If you believe a child has provided us personal information through the Site, contact {mail("privacy@hana.health")} and we will delete it.
    </>
  ),
  s13Title: "Consumer health data",
  s13Body: (
    <>
      Certain US state laws, including the Washington My Health My Data Act and Nevada SB370, regulate &ldquo;consumer health data.&rdquo; We do not use the Site to collect consumer health data for advertising, and we do not sell consumer health data. Where these laws apply and require consent before collecting or sharing such data, we will obtain it. To exercise rights regarding consumer health data, contact {mail("privacy@hana.health")}.
    </>
  ),
  s14Title: "Third-party links",
  s14Body: (
    <>
      The Site may link to third-party websites and services (for example, scheduling, documentation, or social media). We are not responsible for their privacy practices, and we encourage you to review their privacy notices.
    </>
  ),
  s15Title: "Changes to this Privacy Policy",
  s15Body: (
    <>
      We may update this Privacy Policy from time to time. We will post the updated version here with a new &ldquo;Last Updated&rdquo; date and, where required, provide additional notice. Your continued use of the Site after an update constitutes acceptance of the revised policy.
    </>
  ),
  s16Title: "Contact us",
  s16Company: "HANA Health, Inc.",
  s16Privacy: "Privacy:",
  s16General: "General:",
  s16Web: "Web:",
};

const COPY_IT: Copy = {
  seoTitle: "Informativa sulla Privacy | HANA Health",
  seoDescription:
    "Come HANA Health, Inc. raccoglie, utilizza, divulga e protegge le informazioni personali dei visitatori del sito hana.health, inclusi i tuoi diritti in materia di privacy ai sensi del GDPR e delle leggi statali statunitensi.",
  eyebrow: "HANA Health, Inc.",
  title: "Informativa sulla Privacy",
  dates: "Data di entrata in vigore: 14 giugno 2026  |  Ultimo aggiornamento: 14 giugno 2026",
  intro: (
    <>
      HANA Health, Inc. (&ldquo;HANA&rdquo;, &ldquo;noi&rdquo; o &ldquo;nostro&rdquo;) rispetta la tua privacy. La presente Informativa sulla Privacy descrive come raccogliamo, utilizziamo, divulghiamo e proteggiamo le informazioni personali quando visiti o interagisci con il sito {strong("hana.health")} e le pagine correlate (collettivamente, il &ldquo;Sito&rdquo;), nonché i diritti e le scelte in materia di privacy a tua disposizione. Utilizzando il Sito, accetti la presente Informativa sulla Privacy.
    </>
  ),
  phi: (
    <>
      {strong("Informazioni sanitarie dei pazienti.")} Quando HANA tratta Informazioni Sanitarie Protette (PHI) per conto di un operatore sanitario attraverso la piattaforma HANA, HANA agisce in qualità di business associate ai sensi dell&rsquo;HIPAA (e, ove applicabile, di responsabile del trattamento ai sensi del GDPR). Tali informazioni sono disciplinate dal Business Associate Agreement (BAA) e dal Data Processing Agreement (DPA) tra HANA e l&rsquo;operatore, nonché dalla Notice of Privacy Practices dell&rsquo;operatore stesso &mdash; e non dalla presente Informativa sulla Privacy del Sito. Questo Sito è destinato alle organizzazioni sanitarie e ai potenziali clienti, non all&rsquo;assistenza dei pazienti.
    </>
  ),
  s1Title: "Chi siamo",
  s1Body: (
    <>
      Il soggetto responsabile delle informazioni personali raccolte attraverso il Sito è HANA Health, Inc., una società costituita negli Stati Uniti. Puoi contattarci in merito alla privacy all&rsquo;indirizzo{" "}
      {mail("privacy@hana.health")}. Se ti trovi nello Spazio Economico Europeo (SEE) o nel Regno Unito, consulta la Sezione 11 per le modalità con cui contattarci e per il tuo diritto di presentare un reclamo a un&rsquo;autorità di controllo.
    </>
  ),
  s2Title: "Informazioni che raccogliamo",
  s2Lead: "Raccogliamo le seguenti categorie di informazioni personali:",
  s2ColCategory: "Categoria",
  s2ColExamples: <>Esempi e fonte</>,
  s2Rows: [
    { term: "Identificativi e dati di contatto", meaning: "Nome e cognome, indirizzo email e organizzazione, quando invii il nostro modulo di contatto o richiedi una demo. Forniti direttamente da te." },
    { term: "Contenuto della richiesta", meaning: "L’oggetto e il messaggio in testo libero che ci invii, e qualsiasi informazione in esso contenuta. Forniti direttamente da te." },
    { term: "Dati di prenotazione", meaning: "Se prenoti una demo, il tuo nome, l’email e l’orario selezionato, trattati tramite il nostro fornitore di prenotazioni (Calendly)." },
    { term: "Dati di utilizzo e di dispositivo", meaning: "Indirizzo IP, posizione approssimativa, tipo di dispositivo e di browser, pagine visualizzate, pagine di provenienza/uscita ed eventi di interazione, raccolti automaticamente tramite cookie e strumenti di analisi (Google Analytics 4 / Google Tag Manager)." },
    { term: "Dati dei contenuti multimediali interattivi", meaning: "Se interagisci con un widget VideoAsk (Typeform) incorporato, le risposte e i dati di utilizzo che vi fornisci." },
  ],
  s2Note: "Ti preghiamo di non inviare informazioni sanitarie, PHI o altri dati personali sensibili attraverso i campi a testo libero del Sito. Il Sito è destinato esclusivamente a richieste commerciali di carattere generale.",
  s3Title: "Come utilizziamo le informazioni personali e le nostre basi giuridiche",
  s3Lead: "Utilizziamo le informazioni personali per:",
  s3Items: [
    "rispondere alle tue richieste e fornire le informazioni, le demo o i materiali che richiedi;",
    "comunicare con te in merito ai nostri prodotti, incluse le comunicazioni commerciali e relative all’account;",
    "gestire, mantenere, proteggere e migliorare il Sito e misurarne le prestazioni;",
    "individuare, prevenire e rispondere a frodi, abusi, incidenti di sicurezza e attività illecite; e",
    "adempiere agli obblighi di legge e far valere i nostri accordi.",
  ],
  s3Bases: (
    <>
      Ove si applichi il GDPR / GDPR del Regno Unito, le nostre basi giuridiche sono: {strong("esecuzione di un contratto o di misure precontrattuali")} (risposta alle richieste e alle demo); {strong("legittimi interessi")} (gestione, sicurezza e promozione della nostra attività, bilanciati con i tuoi diritti); {strong("consenso")} (cookie non essenziali e determinate attività di marketing); e {strong("obbligo legale")} (conformità e conservazione della documentazione). Puoi revocare il consenso in qualsiasi momento.
    </>
  ),
  s4Title: "Come divulghiamo le informazioni personali",
  s4Lead: "Non vendiamo le tue informazioni personali in cambio di denaro. Divulghiamo le informazioni personali a:",
  s4Items: [
    <>{strong("Fornitori di servizi / responsabili del trattamento")} che svolgono servizi per nostro conto su base contrattuale, inclusi quelli elencati nella Sezione 5;</>,
    <>{strong("Consulenti professionali")} (avvocati, revisori, commercialisti) ove necessario;</>,
    <>{strong("Autorità e terze parti")} ove richiesto dalla legge, da un procedimento legale, o per tutelare diritti, sicurezza e incolumità; e</>,
    <>{strong("Un soggetto subentrante")} nell&rsquo;ambito di una fusione, acquisizione, finanziamento o cessione di beni, nel rispetto della presente Informativa sulla Privacy.</>,
  ],
  s4Note: "Consulta la Sezione 8 in merito alla “condivisione” a fini di analisi per la pubblicità comportamentale cross-context e alle tue scelte.",
  s5Title: "Fornitori di servizi che utilizziamo",
  s5ColProvider: "Fornitore",
  s5ColPurpose: "Finalità",
  s5Rows: [
    { term: "Google LLC", meaning: "Analisi del sito web e gestione dei tag (Google Analytics 4, Google Tag Manager)." },
    { term: "Calendly LLC", meaning: "Pianificazione e prenotazione delle chiamate demo." },
    { term: "Typeform S.L. (VideoAsk)", meaning: "Video interattivo incorporato, ove utilizzato." },
    { term: "FormSubmit", meaning: "Recapito via email al nostro team delle richieste inviate tramite il modulo di contatto." },
    { term: "Fornitori di cloud, email e CRM", meaning: "Hosting, recapito email e gestione delle richieste e delle relazioni con i clienti." },
  ],
  s5Note: "A ciascun fornitore è consentito trattare le informazioni personali solo nella misura necessaria a svolgere i servizi per noi e in conformità con la presente Informativa sulla Privacy.",
  s6Title: "Cookie e strumenti di analisi",
  s6Body: (
    <>
      Il Sito utilizza cookie e tecnologie simili per finalità di funzionalità e analisi. Per un inventario completo, i fornitori coinvolti e le modalità di gestione delle tue scelte, consulta la nostra{" "}
      <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>.
    </>
  ),
  s7Title: "Conservazione dei dati",
  s7Items: [
    "Dati di contatto e delle richieste: conservati per il tempo necessario a gestire la tua richiesta e per un ragionevole periodo di follow-up, generalmente fino a 24 mesi dopo la nostra ultima interazione.",
    "Dati di prenotazione: conservati per la durata della relazione con il cliente potenziale o attivo.",
    "Dati di analisi: conservati secondo il periodo di conservazione configurato in Google Analytics (generalmente fino a 14 mesi).",
  ],
  s7Note: "Conserviamo le informazioni personali più a lungo solo quando necessario per adempiere a obblighi di legge, risolvere controversie o far valere i nostri accordi, e le cancelliamo o anonimizziamo quando non sono più necessarie.",
  s8Title: "Le tue scelte sulla privacy (Do Not Sell or Share)",
  s8Lead: (
    <>
      Utilizziamo strumenti di analisi e di gestione dei tag (come Google Analytics) che possono comportare la &ldquo;condivisione&rdquo; di informazioni personali a fini di pubblicità comportamentale cross-context o di analisi ai sensi di determinate leggi statali statunitensi. Non vendiamo informazioni personali a fronte di un corrispettivo economico. Puoi esercitare le seguenti scelte:
    </>
  ),
  s8Items: [
    <>Disattivare i cookie di analisi/pubblicità tramite i nostri controlli sui cookie (consulta la <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>) e le impostazioni del tuo browser.</>,
    <>Rispettiamo il segnale Global Privacy Control (GPC) come valida opposizione alla &ldquo;vendita&rdquo;/&ldquo;condivisione&rdquo; ove richiesto dalla legge.</>,
    <>Inviare una richiesta a {mail("privacy@hana.health")}, oppure utilizzare il <a href="/contact" className="text-blue-600 hover:underline">modulo di contatto</a>.</>,
  ],
  s9Title: "Sicurezza dei dati",
  s9Body: (
    <>
      Adottiamo misure di salvaguardia amministrative, tecniche e fisiche progettate per proteggere le informazioni personali, inclusa la crittografia in transito (TLS 1.2/1.3) e a riposo (AES-256), controlli di accesso e monitoraggio. Nessun metodo di trasmissione o conservazione è completamente sicuro e non possiamo garantire una sicurezza assoluta. Le misure di sicurezza applicabili alla piattaforma HANA e alle PHI sono descritte nei nostri Termini di Servizio e Politica di Sicurezza e nel BAA.
    </>
  ),
  s10Title: "Trasferimenti internazionali di dati",
  s10Body: (
    <>
      Abbiamo sede negli Stati Uniti e ci avvaliamo di fornitori di servizi situati negli Stati Uniti e altrove. Se accedi al Sito dal SEE, dal Regno Unito o da un&rsquo;altra regione con restrizioni sul trasferimento dei dati, le tue informazioni personali potrebbero essere trasferite e trattate negli Stati Uniti. Ove richiesto, ci affidiamo a garanzie adeguate per tali trasferimenti, come l&rsquo;EU-US Data Privacy Framework e/o le Clausole Contrattuali Standard (SCC) della Commissione Europea (con l&rsquo;Addendum del Regno Unito). Puoi richiedere maggiori informazioni su tali garanzie contattando {mail("privacy@hana.health")}.
    </>
  ),
  s11Title: "I tuoi diritti",
  s11_1Title: "11.1 Residenti nel SEE / Regno Unito",
  s11_1Body: "Fatto salvo quanto previsto dalla legge applicabile, hai il diritto di accedere, rettificare, cancellare, limitare od opporti al trattamento delle tue informazioni personali; alla portabilità dei dati; e di revocare il consenso. Hai inoltre il diritto di presentare un reclamo alla tua autorità di controllo locale per la protezione dei dati.",
  s11_2Title: "11.2 Residenti in California e in altri Stati USA",
  s11_2Body: (
    <>
      A seconda del tuo Stato di residenza (inclusi California, Colorado, Connecticut, Texas, Virginia e altri), potresti avere il diritto di: confermare se trattiamo le tue informazioni personali e accedervi; correggere le inesattezze; cancellarle; ottenerne una copia portabile; e opporti alla &ldquo;vendita&rdquo; o &ldquo;condivisione&rdquo; di informazioni personali e alla pubblicità mirata. I residenti in California possono inoltre richiedere le categorie di informazioni personali raccolte, le fonti, le finalità commerciali e le categorie di terze parti a cui sono divulgate, e possono limitare l&rsquo;uso di informazioni personali sensibili. Non ti discrimineremo per aver esercitato questi diritti.
    </>
  ),
  s11_3Title: "11.3 Come esercitare i tuoi diritti",
  s11_3Body: (
    <>
      Invia una richiesta scrivendo a {mail("privacy@hana.health")} o utilizzando il nostro <a href="/contact" className="text-blue-600 hover:underline">modulo di contatto</a>. Verificheremo la tua richiesta come previsto dalla legge e risponderemo entro i termini applicabili. Ove consentito, puoi avvalerti di un agente autorizzato.
    </>
  ),
  s12Title: "Privacy dei minori",
  s12Body: (
    <>
      Il Sito è rivolto a organizzazioni sanitarie e imprese, non ai minori, e non raccogliamo consapevolmente informazioni personali dai minori attraverso il Sito. Le informazioni sanitarie relative a pazienti minorenni trattate attraverso la piattaforma HANA sono gestite ai sensi del BAA/DPA applicabile e sotto l&rsquo;autorità dell&rsquo;operatore, con il consenso dei genitori o del tutore ottenuto dall&rsquo;operatore. Se ritieni che un minore ci abbia fornito informazioni personali attraverso il Sito, contatta {mail("privacy@hana.health")} e provvederemo a cancellarle.
    </>
  ),
  s13Title: "Dati sanitari dei consumatori",
  s13Body: (
    <>
      Alcune leggi statali statunitensi, tra cui il Washington My Health My Data Act e il Nevada SB370, disciplinano i &ldquo;dati sanitari dei consumatori&rdquo;. Non utilizziamo il Sito per raccogliere dati sanitari dei consumatori a fini pubblicitari e non vendiamo dati sanitari dei consumatori. Ove tali leggi siano applicabili e richiedano il consenso prima della raccolta o della condivisione di tali dati, lo otterremo. Per esercitare i diritti relativi ai dati sanitari dei consumatori, contatta {mail("privacy@hana.health")}.
    </>
  ),
  s14Title: "Link a terze parti",
  s14Body: (
    <>
      Il Sito può contenere link a siti web e servizi di terze parti (ad esempio, prenotazioni, documentazione o social media). Non siamo responsabili delle loro pratiche in materia di privacy e ti invitiamo a esaminare le rispettive informative sulla privacy.
    </>
  ),
  s15Title: "Modifiche alla presente Informativa sulla Privacy",
  s15Body: (
    <>
      Potremmo aggiornare la presente Informativa sulla Privacy di tanto in tanto. Pubblicheremo qui la versione aggiornata con una nuova data di &ldquo;Ultimo aggiornamento&rdquo; e, ove richiesto, forniremo un ulteriore avviso. Il tuo utilizzo continuato del Sito dopo un aggiornamento costituisce accettazione della politica rivista.
    </>
  ),
  s16Title: "Contattaci",
  s16Company: "HANA Health, Inc.",
  s16Privacy: "Privacy:",
  s16General: "Generale:",
  s16Web: "Web:",
};

export function Privacy() {
  const COPY = getLocale() === "it" ? COPY_IT : COPY_EN;

  return (
    <>
      <SEO
        title={COPY.seoTitle}
        description={COPY.seoDescription}
        path="/privacy"
      />

      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-[#00122F] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">{COPY.eyebrow}</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-6 leading-[1.1]">
              {COPY.title}
            </h1>
            <p className="text-slate-400 text-base">
              {COPY.dates}
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-16 text-[#1e2a3a]">
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-6">
            {COPY.intro}
          </p>
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            {COPY.phi}
          </p>

          {/* 1 */}
          <Section number="1" title={COPY.s1Title}>
            <p>{COPY.s1Body}</p>
          </Section>

          {/* 2 */}
          <Section number="2" title={COPY.s2Title}>
            <p className="mb-4">{COPY.s2Lead}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-1/3">{COPY.s2ColCategory}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{COPY.s2ColExamples}</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  {COPY.s2Rows.map((row) => (
                    <DefRow key={row.term} term={row.term} meaning={row.meaning} />
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              {COPY.s2Note}
            </p>
          </Section>

          {/* 3 */}
          <Section number="3" title={COPY.s3Title}>
            <p className="mb-4">{COPY.s3Lead}</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              {COPY.s3Items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mb-2">
              {COPY.s3Bases}
            </p>
          </Section>

          {/* 4 */}
          <Section number="4" title={COPY.s4Title}>
            <p className="mb-4">
              {COPY.s4Lead}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              {COPY.s4Items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="mt-4">
              {COPY.s4Note}
            </p>
          </Section>

          {/* 5 */}
          <Section number="5" title={COPY.s5Title}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">{COPY.s5ColProvider}</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">{COPY.s5ColPurpose}</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  {COPY.s5Rows.map((row) => (
                    <DefRow key={row.term} term={row.term} meaning={row.meaning} />
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4">{COPY.s5Note}</p>
          </Section>

          {/* 6 */}
          <Section number="6" title={COPY.s6Title}>
            <p>
              {COPY.s6Body}
            </p>
          </Section>

          {/* 7 */}
          <Section number="7" title={COPY.s7Title}>
            <ul className="list-disc pl-6 space-y-2">
              {COPY.s7Items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4">{COPY.s7Note}</p>
          </Section>

          {/* 8 */}
          <Section number="8" title={COPY.s8Title}>
            <p className="mb-4">
              {COPY.s8Lead}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              {COPY.s8Items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          {/* 9 */}
          <Section number="9" title={COPY.s9Title}>
            <p>
              {COPY.s9Body}
            </p>
          </Section>

          {/* 10 */}
          <Section number="10" title={COPY.s10Title}>
            <p>
              {COPY.s10Body}
            </p>
          </Section>

          {/* 11 */}
          <Section number="11" title={COPY.s11Title}>
            <h4 className="font-semibold text-[#1e2a3a] mb-3">{COPY.s11_1Title}</h4>
            <p className="mb-3">{COPY.s11_1Body}</p>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">{COPY.s11_2Title}</h4>
            <p className="mb-3">
              {COPY.s11_2Body}
            </p>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">{COPY.s11_3Title}</h4>
            <p>
              {COPY.s11_3Body}
            </p>
          </Section>

          {/* 12 */}
          <Section number="12" title={COPY.s12Title}>
            <p>
              {COPY.s12Body}
            </p>
          </Section>

          {/* 13 */}
          <Section number="13" title={COPY.s13Title}>
            <p>
              {COPY.s13Body}
            </p>
          </Section>

          {/* 14 */}
          <Section number="14" title={COPY.s14Title}>
            <p>
              {COPY.s14Body}
            </p>
          </Section>

          {/* 15 */}
          <Section number="15" title={COPY.s15Title}>
            <p>
              {COPY.s15Body}
            </p>
          </Section>

          {/* 16 */}
          <Section number="16" title={COPY.s16Title}>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-[15px]">
              <p className="font-semibold text-[#1e2a3a] mb-1">{COPY.s16Company}</p>
              <p>{COPY.s16Privacy} <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a></p>
              <p>{COPY.s16General} <a href="mailto:hello@hana.health" className="text-blue-600 hover:underline">hello@hana.health</a></p>
              <p>{COPY.s16Web} <a href="https://hana.health/privacy" className="text-blue-600 hover:underline">hana.health/privacy</a></p>
            </div>
          </Section>
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
      <td className="px-4 py-3 font-medium text-[#1e2a3a] align-top">{term}</td>
      <td className="px-4 py-3">{meaning}</td>
    </tr>
  );
}
