// Locale detection: if hostname starts with "ita." we serve Italian.
// Add more locales here as needed.

export type Locale = "en" | "it";

export function detectLocale(): Locale {
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h.startsWith("ita.") || h.includes("hanafigmasite-ita")) {
      return "it";
    }
  }
  return "en";
}

// Singleton so all components share the same detected locale.
let _locale: Locale | null = null;
export function getLocale(): Locale {
  if (_locale === null) _locale = detectLocale();
  return _locale;
}

// ─── Translation dictionaries ─────────────────────────────────────────────────

export interface Translations {
  // Navbar
  nav: {
    caseStudies: string;
    docs: string;
    resources: string;
    whitepapers: string;
    blog: string;
    labs: string;
    savingsCalculator: string;
    signIn: string;
    bookDemo: string;
  };
  // Announcement bar
  announcement: {
    date: string;
    body: string;
    ctaMobile: string;
    ctaDesktop: string;
    dismissLabel: string;
  };
  // Footer
  footer: {
    tagline: string;
    platform: string;
    integrations: string;
    sdk: string;
    resources: string;
    documentation: string;
    blog: string;
    labs: string;
    stateOfVoiceAI: string;
    useCases: string;
    company: string;
    pricing: string;
    aboutUs: string;
    contact: string;
    partnerships: string;
    bookDemo: string;
    legal: string;
    privacyPolicy: string;
    termsOfService: string;
    compliance: string;
    acceptableUsePolicy: string;
    allRightsReserved: string;
    privacy: string;
    terms: string;
    cookies: string;
    aup: string;
    twitterLabel: string;
    githubLabel: string;
    linkedinLabel: string;
  };
  // Inline Image Header (get started steps)
  getStarted: {
    heading: string;
    subheading: string;
    step1Number: string;
    step1Title: string;
    step1Body: string;
    step2Number: string;
    step2Title: string;
    step2Body: string;
    step3Number: string;
    step3Title: string;
    step3Body: string;
    cta: string;
    note: string;
  };
  // Ready to use / CTA section
  cta: {
    heading: string;
    body: string;
    bookDemo: string;
    savings: string;
    readDocs: string;
  };
  // Compliance section
  compliance: {
    tag: string;
    heading: string;
    body: string;
    humanInLoop: string;
    humanInLoopDesc: string;
    auditTrail: string;
    auditTrailDesc: string;
    protocolBound: string;
    protocolBoundDesc: string;
    certNote: string;
    iso: string;
    isoDesc: string;
    soc2: string;
    soc2Desc: string;
    hipaa: string;
    hipaaDesc: string;
    gdpr: string;
    gdprDesc: string;
    environments: string;
  };
  // Live demo section
  liveDemo: {
    heading: string;
    subheading: string;
    listeningLabel: string;
    formHeading: string;
    formSubheading: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    phoneLabel: string;
    regionUS: string;
    regionEU: string;
    textMeButton: string;
    textingButton: string;
    textedStatus: string;
    calledStatus: string;
    or: string;
    webCallButton: string;
    speakingWithHana: string;
    connecting: string;
    clickEndCall: string;
    establishingConnection: string;
    endCall: string;
    fieldNameRequired: string;
    fieldEmailRequired: string;
    fieldPhoneFormat: string;
    networkError: string;
    callFailed: string;
  };
  // How Hana Works carousel
  howHanaWorks: {
    heading: string;
    headingPrefix: string;
    headingEmphasis: string;
    tab1: string;
    tab1SubHeading: string;
    tab1Body: string;
    tab1f1: string;
    tab1f2: string;
    tab1f3: string;
    tab2: string;
    tab2SubHeading: string;
    tab2Body: string;
    tab2f1: string;
    tab2f2: string;
    tab2f3: string;
    tab3: string;
    tab3SubHeading: string;
    tab3Body: string;
    tab3f1: string;
    tab3f2: string;
    tab3f3: string;
    prevSlide: string;
    nextSlide: string;
  };
  // Case Studies section (homepage teaser)
  caseStudiesTeaser: {
    tag: string;
    heading: string;
    body: string;
    readMore: string;
    readMoreSub: string;
  };
  // Recipes / Workflow Marquee
  recipesMarquee: {
    tag: string;
    heading: string;
    body: string;
  };
  // Hero (hero-dithering-card)
  hero: {
    headline: string;
    headlineCantMake: string;
    subheadline: string;
    endDemo: string;
    connecting: string;
    talkToHana: string;
    bookDemo: string;
  };
  // Integrations section
  integrations: {
    tag: string;
    heading: string;
    headingEmphasis: string;
    body: string;
    ehr: string;
    ehrTagline: string;
    ehrBody: string;
    channels: string;
    channelsTagline: string;
    channelsBody: string;
    noEhr: string;
    noEhrTagline: string;
    noEhrBody: string;
    sdk: string;
    sdkTagline: string;
    sdkBody: string;
    learnPartnerships: string;
  };
  // Pages — Home SEO
  homeSeo: {
    title: string;
    description: string;
    faq: { question: string; answer: string }[];
  };
  // Pages — About
  about: {
    seoTitle: string;
    seoDescription: string;
    h1: string;
    tagline: string;
    story: string;
    foundersTitle: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
    stat4Label: string;
    stat4Value: string;
    valuesTitle: string;
    v1Title: string;
    v1Body: string;
    v2Title: string;
    v2Body: string;
    v3Title: string;
    v3Body: string;
    v4Title: string;
    v4Body: string;
    v5Title: string;
    v5Body: string;
    v6Title: string;
    v6Body: string;
    timelineTitle: string;
    openSourceTitle: string;
    openSourceBody: string;
    meetTeamTitle: string;
    joinTeam: string;
    connectCta: string;
    closingHeading: string;
    closingBody: string;
    bookConversation: string;
  };
  // Pages — Contact
  contact: {
    seoTitle: string;
    seoDescription: string;
    h1: string;
    subheading: string;
    infoTitle: string;
    emailLabel: string;
    officeLabel: string;
    officeCompany: string;
    officeNote: string;
    getStartedTitle: string;
    getStartedBody: string;
    bookDemo: string;
    formTitle: string;
    firstNameLabel: string;
    firstNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
    emailAddress: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectSales: string;
    subjectSupport: string;
    subjectPartnership: string;
    subjectOther: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submittingButton: string;
    privacyNote: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
  };
  // Pages — Pricing (abbreviated — key UI labels)
  pricing: {
    seoTitle: string;
    seoDescription: string;
    heading: string;
    subheading: string;
    next: string;
    back: string;
    seeEstimate: string;
    bookCall: string;
    backToVolumes: string;
    commonQuestions: string;
  };
  // Pages — Blog
  blog: {
    seoTitle: string;
    seoDescription: string;
    heading: string;
    subheading: string;
    noPosts: string;
  };
  // Pages — NotFound
  notFound: {
    heading: string;
    body: string;
    cta: string;
  };
  // Pages — Research / Labs
  labs: {
    seoTitle: string;
    seoDescription: string;
    h1: string;
    subheading: string;
    readDocs: string;
    publicationsTitle: string;
    publicationsBody: string;
    readArticle: string;
  };
}

// ─── English ──────────────────────────────────────────────────────────────────

const en: Translations = {
  nav: {
    caseStudies: "Case Studies",
    docs: "Docs",
    resources: "Resources",
    whitepapers: "Whitepapers",
    blog: "Blog",
    labs: "Labs",
    savingsCalculator: "Savings Calculator",
    signIn: "Sign in",
    bookDemo: "Book a Demo",
  },
  announcement: {
    date: "July 5",
    body: "The CMS ACCESS program launches.",
    ctaMobile: "ACCESS launches",
    ctaDesktop: "See if you're ready",
    dismissLabel: "Dismiss announcement",
  },
  footer: {
    tagline: "Automate the routine. Free your team.",
    platform: "Platform",
    integrations: "Integrations",
    sdk: "SDK",
    resources: "Resources",
    documentation: "Documentation",
    blog: "Blog",
    labs: "Labs",
    stateOfVoiceAI: "State of Voice AI",
    useCases: "Use Cases",
    company: "Company",
    pricing: "Pricing",
    aboutUs: "About Us",
    contact: "Contact",
    partnerships: "Partnerships",
    bookDemo: "Book a Demo",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    compliance: "Compliance",
    acceptableUsePolicy: "Acceptable Use Policy",
    allRightsReserved: "HANA Health, Inc. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    aup: "AUP",
    twitterLabel: "Follow Hana Health on Twitter",
    githubLabel: "Hana Health on GitHub",
    linkedinLabel: "Hana Health on LinkedIn",
  },
  getStarted: {
    heading: "Three steps. You're live in 3 weeks.",
    subheading: "How to get started with Hana.",
    step1Number: "001",
    step1Title: "Pick the workflow.",
    step1Body: "The one that's costing you most — pre-built, or built around your protocols.",
    step2Number: "002",
    step2Title: "Connect your EHR.",
    step2Body: "Direct, or 95+ systems via Redox & Catagon. Reads the chart first — patients are never asked what you already know.",
    step3Number: "003",
    step3Title: "Go live.",
    step3Body: "Your team tests it on a real line before a single patient is called.",
    cta: "Book a Demo",
    note: "Most teams go live in 3 weeks.",
  },
  cta: {
    heading: "Automate the routine. Free your team.",
    body: "Book a demo. We'll show you a workflow built for how your team works — not a generic product tour.",
    bookDemo: "Book a Demo",
    savings: "See how much you can save",
    readDocs: "Read the Docs",
  },
  compliance: {
    tag: "Safety & Security",
    heading: "A human on every clinical call that needs one.",
    body: "Hana never decides care on its own. You set the escalation rules; it follows them — and logs everything.",
    humanInLoop: "Human-in-the-loop",
    humanInLoopDesc: "Clinical risk is routed to your nurse or on-call clinician with a warm hand-off — live, or next business day, per your rules.",
    auditTrail: "Full audit trail",
    auditTrailDesc: "Every call is recorded, transcribed, and logged to the chart. Who said what, what was decided, and why — reviewable any time.",
    protocolBound: "Protocol-bound",
    protocolBoundDesc: "Hana follows your clinical protocols and screening logic. It works inside guardrails you define, not a generic model's judgment.",
    certNote: "And the controls behind it: HIPAA-aligned, SOC 2 Type II (audit in progress), ISO 27001-aligned, GDPR. Not bolted on — built in.",
    iso: "ISO 27001-aligned",
    isoDesc: "ISMS implemented against ISO 27001 information security controls across EHR systems, with certification on our roadmap.",
    soc2: "SOC 2 Type II (audit in progress)",
    soc2Desc: "Readiness assessment complete and a Type II audit underway, with continuous monitoring and automated evidence collection across EHR environments.",
    hipaa: "HIPAA-aligned",
    hipaaDesc: "HIPAA controls in place — encryption, access controls, and audit logging across EHR integrations — with a BAA available.",
    gdpr: "GDPR",
    gdprDesc: "Providing GDPR-compliant data processing with automated data mapping, consent management, and data subject request tools for EHR systems.",
    environments: "Cloud, private cloud, or dedicated environments. Same standards.",
  },
  liveDemo: {
    heading: "Don't take our word for it. Take the call.",
    subheading: "Drop your number and Hana calls you right now — the agent works out the right demo as you talk.",
    listeningLabel: "Hana is listening",
    formHeading: "Hear Hana handle a real patient conversation.",
    formSubheading: "Enter your details and Hana texts you first to confirm, then calls within seconds — so you can experience the AI live.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    regionUS: "🇺🇸 US / Canada",
    regionEU: "🇪🇺 Europe",
    textMeButton: "Text me & call me",
    textingButton: "Texting…",
    textedStatus: "Check your texts — Hana will call you right back. 📱",
    calledStatus: "Calling you now — pick up your phone! 📞",
    or: "or",
    webCallButton: "Prefer to talk now? Start a web call →",
    speakingWithHana: "Speaking with Hana",
    connecting: "Connecting...",
    clickEndCall: "Click End Call when you're done.",
    establishingConnection: "Establishing connection...",
    endCall: "End Call",
    fieldNameRequired: "Name is required",
    fieldEmailRequired: "Email is required",
    fieldPhoneFormat: "Enter your number in international format, e.g. +1 555 123 4567.",
    networkError: "Network error. Please try again.",
    callFailed: "We couldn't place the call. Please try again.",
  },
  howHanaWorks: {
    heading: "Watch HANA in Action",
    headingPrefix: "Watch HANA in",
    headingEmphasis: "Action",
    tab1: "Remote Monitoring",
    tab1SubHeading: "Inside a HANA Conversation",
    tab1Body: "How the AI monitors, reasons, and reports across a patient conversation.",
    tab1f1: "Adherence & vitals tracking",
    tab1f2: "Motivational interviewing",
    tab1f3: "Multi channel engagement",
    tab2: "Patient Intake",
    tab2SubHeading: "Intelligent Patient Intake & Onboarding",
    tab2Body: "Hana transforms standard intake forms into rich clinical insights. It automatically reviews patient submissions, identifies missing details, and calls patients to gather deep narrative context about symptoms and lifestyle before the first visit.",
    tab2f1: "Smart form gap analysis",
    tab2f2: "Clinical narrative generation",
    tab2f3: "Automated EHR entry",
    tab3: "Care Coordination",
    tab3SubHeading: "24/7 AI Receptionist & Scheduling",
    tab3Body: "Never miss a patient call. Hana handles inbound inquiries, schedules appointments directly into your EHR based on real time availability, collects new patient demographics, and manages rescheduling requests around the clock.",
    tab3f1: "Real time EHR scheduling",
    tab3f2: "New patient registration",
    tab3f3: "24/7 Inbound handling",
    prevSlide: "Previous slide",
    nextSlide: "Next slide",
  },
  caseStudiesTeaser: {
    tag: "Case Studies",
    heading: "Receipts.",
    body: "See how teams put Hana on the routine — and what changed when they did.",
    readMore: "Read the case studies",
    readMoreSub: "Full deployments — with live voice agents you can try.",
  },
  recipesMarquee: {
    tag: "Workflow automation",
    heading: "Your clinical protocols, already built in.",
    body: "100+ call workflows, ready day one — across ortho, GI, behavioral health, and primary care. Turn on the one bleeding revenue first; add the rest as you go.",
  },
  hero: {
    headline: "Automate the routine calls your EHR",
    headlineCantMake: "can't make",
    subheadline: "Hana runs your routine patient calls end to end — reads the chart, makes the call, writes it back. Your team stays on the work that needs a human.",
    endDemo: "End Demo",
    connecting: "Connecting...",
    talkToHana: "Talk to Hana",
    bookDemo: "Book a Demo",
  },
  integrations: {
    tag: "Integrations",
    heading: "Built into the systems you",
    headingEmphasis: "already run.",
    body: "95+ EHRs, reads and writes back automatically. Reaches patients by voice, SMS, WhatsApp, or iMessage — in 3+ languages.",
    ehr: "EHR integrations",
    ehrTagline: "Reads the chart. Engages the patient. Writes back.",
    ehrBody: "Direct integrations with major EHRs. Or connect through Redox and Catagon to reach 95+ systems. Hana reads the chart, engages the patient, and writes structured notes back.",
    channels: "Patient channels",
    channelsTagline: "Hana picks the right channel, time, and tone. No app. No portal. No login.",
    channelsBody: "Hana picks the right channel, time, and tone for each patient. No app. No portal. No login. Just a conversation.",
    noEhr: "No EHR? No problem.",
    noEhrTagline: "Works with what you have.",
    noEhrBody: "No EHR integration? No problem. We build custom dashboards, standalone agent controls, or work alongside whatever you're using today. You don't need to be \"tech-ready\" to start.",
    sdk: "SDK & White-Label",
    sdkTagline: "Building a platform? Embed Hana via SDK and white-label it as your own.",
    sdkBody: "Full API access. Custom dashboards. Your branding. Our reasoning engine.",
    learnPartnerships: "Learn about partnerships",
  },
  homeSeo: {
    title: "Hana Voice AI | The calls your EHR can't make",
    description: "Hana works your patient access calls end to end — pre-visit intake, prior auth status checks, no-show recovery, recalls, refills. Reads the chart, makes the call, writes the note back.",
    faq: [
      { question: "What is Hana Voice AI?", answer: "Hana is a clinical voice AI platform that automates patient engagement across the full care journey — intake, follow-up, remote monitoring, and care coordination. It deploys AI agents that call, text, and message patients using voice, SMS, and chat, integrates with EHR systems, and is HIPAA-compliant with a BAA available." },
      { question: "How is Hana different from a patient portal or a generic AI chatbot?", answer: "Patient portals and text reminders wait for the patient to act, so slots go empty. Hana picks up the phone and reaches patients the way they actually respond. Unlike generic AI chatbots, Hana reads the chart, knows the patient, and follows clinical care protocols, so it is purpose-built for healthcare workflows rather than repurposed call-center or sales AI." },
      { question: "What clinical workflows does Hana support?", answer: "Hana supports post-discharge follow-up to prevent 30-day readmissions, chronic care management (APCM/CCM) that satisfies CMS billing requirements, structured ADHD and behavioral health intake, medication adherence outreach, and remote patient monitoring that writes back to the EHR." },
      { question: "How long does it take to deploy Hana?", answer: "Hana deploys in weeks, not months. Most teams go live in about 3 weeks — your team tests it on a real line before a single patient is called. It is infrastructure that clinics build on rather than a fixed point solution." },
    ],
  },
  about: {
    seoTitle: "About Us | Hana Voice AI",
    seoDescription: "Meet the team behind Hana Voice AI. Founded by clinical experts and engineers to build the infrastructure for continuous patient engagement through AI voice agents.",
    h1: "About Hana",
    tagline: "We're building the care infrastructure for the hours between visits.",
    story: "Healthcare works for the 15-minute appointment. We're solving the 10,000 hours that come after, with AI that listens, adapts, and keeps patients connected to their care.",
    foundersTitle: "Founders' Story",
    stat1Label: "Patient Interactions",
    stat1Value: "1M+",
    stat2Label: "Weekly Engagement",
    stat2Value: "85%",
    stat3Label: "Countries",
    stat3Value: "5",
    stat4Label: "Clinic ROI",
    stat4Value: "31:1",
    valuesTitle: "Our Values",
    v1Title: "Zero friction for patients",
    v1Body: "If it requires a download, a login, or a behavior change, it's already dead. We meet patients where they are: on the phone, in a conversation. No app. No portal. No burden.",
    v2Title: "Safety is not a feature",
    v2Body: "It's the foundation. Over one million patient interactions with zero critical adverse events. Every conversation is monitored, every escalation protocol is clinic-defined, every risk signal is caught.",
    v3Title: "Infrastructure, not applications",
    v3Body: "We don't build point solutions. We build the engagement layer that powers everything from intake to monitoring to adherence. Like electricity for patient communication.",
    v4Title: "Global by design",
    v4Body: "Healthcare protocols are universal. Incentives vary. We operate across five countries, three languages, and both public and private systems, adapting to each without rebuilding.",
    v5Title: "AI fills gaps, not jobs",
    v5Body: "We don't replace nurses and care teams. We put AI into the places where there's no one: missed calls, unmonitored hours, unasked questions. Everyone stays. Care gets better.",
    v6Title: "Outcomes over demos",
    v6Body: "We don't do flashy demos or vibe investing. We do 85% engagement, 96% completion rates, and 31:1 ROI. Boring, functional solutions that actually work. That's what healthcare needs.",
    timelineTitle: "How We Got Here",
    openSourceTitle: "Open source. Self-hosted. Healthcare AI that you actually own.",
    openSourceBody: "Six months ago, we made a decision that changed our trajectory: we moved off OpenAI entirely. We migrated HANA to open-source models running on our own servers. No proprietary API dependency. No patient data leaving your jurisdiction. Full sovereignty.",
    meetTeamTitle: "Meet the Team",
    joinTeam: "Want to join the team?",
    connectCta: "Connect with Matteo",
    closingHeading: "Let's close the engagement gap together",
    closingBody: "Whether you're a clinic, a platform, or a health system, we'd love to talk.",
    bookConversation: "Book a conversation",
  },
  contact: {
    seoTitle: "Contact Us | Hana Voice AI",
    seoDescription: "Have questions about our clinical AI agents? We're here to help you transform your healthcare workflows.",
    h1: "Contact Us",
    subheading: "Have questions about our clinical AI agents? We're here to help you transform your healthcare workflows.",
    infoTitle: "Contact Information",
    emailLabel: "Email",
    officeLabel: "Office",
    officeCompany: "HANA Health, Inc.",
    officeNote: "Remote-first team",
    getStartedTitle: "Ready to get started?",
    getStartedBody: "Skip the queue and schedule a direct demo with our product specialists.",
    bookDemo: "Book a Live Demo",
    formTitle: "Send us a message",
    firstNameLabel: "First Name",
    firstNamePlaceholder: "Jane",
    lastNameLabel: "Last Name",
    lastNamePlaceholder: "Doe",
    emailAddress: "Email Address",
    emailPlaceholder: "jane@organization.com",
    subjectLabel: "Subject",
    subjectSales: "Sales Inquiry",
    subjectSupport: "Technical Support",
    subjectPartnership: "Partnership Opportunity",
    subjectOther: "Other",
    messageLabel: "Message",
    messagePlaceholder: "Tell us about your organization's needs...",
    submitButton: "Send Message",
    submittingButton: "Sending...",
    privacyNote: "By submitting this form you agree to our Privacy Policy.",
    successTitle: "Message sent",
    successBody: "Thanks for reaching out — we'll get back to you shortly.",
    errorTitle: "Couldn't send your message",
    errorBody: "Please email us directly at hello@hana.health.",
  },
  pricing: {
    seoTitle: "Pricing | Hana Voice AI",
    seoDescription: "Outcome-based pricing aligned with your savings. Calculate exactly what Hana costs and what you save compared to human staff.",
    heading: "Outcome-based pricing",
    subheading: "See what this currently costs your practice",
    next: "Next",
    back: "Back",
    seeEstimate: "See my estimate",
    bookCall: "Book a discovery call",
    backToVolumes: "Back to volumes",
    commonQuestions: "Common questions",
  },
  blog: {
    seoTitle: "Blog | Hana Health",
    seoDescription: "Insights on voice AI in healthcare from the Hana team.",
    heading: "Blog",
    subheading: "Insights on voice AI, healthcare automation, and clinical workflows.",
    noPosts: "No posts yet — check back soon.",
  },
  notFound: {
    heading: "Page not found",
    body: "The page you're looking for doesn't exist.",
    cta: "Go home",
  },
  labs: {
    seoTitle: "Labs | Hana Voice AI",
    seoDescription: "Explore the clinical research and publications behind Hana Voice AI. Advancing conversational AI in healthcare with voice biomarkers, patient engagement studies, and adaptive engagement technology.",
    h1: "Advancing Conversational AI in Healthcare",
    subheading: "At Hana, we're pioneering research into how conversational AI can transform patient engagement and care delivery.",
    readDocs: "Read the Technical Documentation",
    publicationsTitle: "Publications",
    publicationsBody: "Discover the research and clinical evidence foundational to our products",
    readArticle: "Read Article",
  },
};

// ─── Italian ──────────────────────────────────────────────────────────────────

const it: Translations = {
  nav: {
    caseStudies: "Casi Studio",
    docs: "Documentazione",
    resources: "Risorse",
    whitepapers: "White Paper",
    blog: "Blog",
    labs: "Ricerca",
    savingsCalculator: "Calcola il Risparmio",
    signIn: "Accedi",
    bookDemo: "Chiedici una Demo",
  },
  announcement: {
    date: "5 Luglio",
    body: "Il programma CMS ACCESS viene lanciato.",
    ctaMobile: "ACCESS in arrivo",
    ctaDesktop: "Scopri se sei pronto",
    dismissLabel: "Chiudi avviso",
  },
  footer: {
    tagline: "Automatizza la routine. Restituisci tempo al tuo team.",
    platform: "Piattaforma",
    integrations: "Integrazioni",
    sdk: "SDK",
    resources: "Risorse",
    documentation: "Documentazione",
    blog: "Blog",
    labs: "Ricerca",
    stateOfVoiceAI: "State of Voice AI",
    useCases: "Casi d'Uso",
    company: "Azienda",
    pricing: "Prezzi",
    aboutUs: "Chi Siamo",
    contact: "Contatti",
    partnerships: "Partnership",
    bookDemo: "Chiedici una Demo",
    legal: "Note Legali",
    privacyPolicy: "Informativa Privacy",
    termsOfService: "Termini di Servizio",
    compliance: "Conformità",
    acceptableUsePolicy: "Policy d'Uso Accettabile",
    allRightsReserved: "HANA Health, Inc. Tutti i diritti riservati.",
    privacy: "Privacy",
    terms: "Termini",
    cookies: "Cookie",
    aup: "AUP",
    twitterLabel: "Segui Hana Health su Twitter",
    githubLabel: "Hana Health su GitHub",
    linkedinLabel: "Hana Health su LinkedIn",
  },
  getStarted: {
    heading: "Tre passi. Sei operativo in 3 settimane.",
    subheading: "Come si parte con Hana.",
    step1Number: "001",
    step1Title: "Scegli il flusso.",
    step1Body: "Quello che ti fa perdere più pazienti — già pronto, o costruito attorno ai tuoi protocolli.",
    step2Number: "002",
    step2Title: "Connetti il tuo gestionale.",
    step2Body: "Integrazione diretta, o 95+ sistemi tramite Redox e Catagon. Hana legge prima la cartella — al paziente non viene mai chiesto quello che sai già.",
    step3Number: "003",
    step3Title: "Parti live.",
    step3Body: "Il tuo team testa l'assistente su una linea reale prima che venga contattato un solo paziente.",
    cta: "Chiedici una Demo",
    note: "La maggior parte dei centri è operativa in 3 settimane.",
  },
  cta: {
    heading: "Smetti di perdere chiamate. Restituisci tempo alla segreteria.",
    body: "Chiedici una demo. Ti mostriamo un flusso costruito sui tuoi protocolli — non una presentazione generica.",
    bookDemo: "Chiedici una Demo",
    savings: "Calcola quanto puoi risparmiare",
    readDocs: "Leggi la Documentazione",
  },
  compliance: {
    tag: "Sicurezza",
    heading: "Un essere umano in ogni chiamata clinica che lo richiede.",
    body: "Hana non decide mai le cure da sola. Sei tu a impostare le regole di escalation; lei le segue — e registra tutto.",
    humanInLoop: "Supervisione umana",
    humanInLoopDesc: "Il rischio clinico viene indirizzato al tuo infermiere o al clinico di guardia con un trasferimento assistito — in tempo reale o il giorno lavorativo successivo, secondo le tue regole.",
    auditTrail: "Audit trail completo",
    auditTrailDesc: "Ogni chiamata viene registrata, trascritta e salvata nella cartella. Chi ha detto cosa, cosa è stato deciso e perché — consultabile in qualsiasi momento.",
    protocolBound: "Vincolato ai protocolli",
    protocolBoundDesc: "Hana segue i tuoi protocolli clinici e la tua logica di screening. Opera all'interno dei guardrail che definisci tu, non del giudizio di un modello generico.",
    certNote: "E i controlli dietro: conforme HIPAA, SOC 2 Type II (audit in corso), allineato ISO 27001, GDPR. Non aggiunti dopo — integrati fin dall'inizio.",
    iso: "Allineato ISO 27001",
    isoDesc: "ISMS implementato secondo i controlli di sicurezza informatica ISO 27001 su tutti i sistemi EHR, con certificazione nel nostro roadmap.",
    soc2: "SOC 2 Type II (audit in corso)",
    soc2Desc: "Valutazione di idoneità completata e audit di Tipo II in corso, con monitoraggio continuo e raccolta automatizzata di prove su tutti gli ambienti EHR.",
    hipaa: "Conforme HIPAA",
    hipaaDesc: "Controlli HIPAA in atto — crittografia, controlli di accesso e audit logging su tutte le integrazioni EHR — con BAA disponibile.",
    gdpr: "GDPR",
    gdprDesc: "Elaborazione dei dati conforme al GDPR con data mapping automatizzato, gestione del consenso e strumenti per le richieste degli interessati su sistemi EHR.",
    environments: "Cloud, private cloud o ambienti dedicati. Stessi standard.",
  },
  liveDemo: {
    heading: "Non fidarti solo di noi. Ascolta la chiamata.",
    subheading: "Lascia il tuo numero e Hana ti chiama adesso — prova dal vivo come risponde ai tuoi pazienti.",
    listeningLabel: "Hana sta ascoltando",
    formHeading: "Ascolta Hana gestire una vera telefonata.",
    formSubheading: "Inserisci i tuoi dati: Hana ti manda prima un messaggio di conferma, poi ti chiama in pochi secondi.",
    nameLabel: "Nome",
    namePlaceholder: "Il tuo nome",
    emailLabel: "Email",
    phoneLabel: "Telefono",
    regionUS: "🇺🇸 USA / Canada",
    regionEU: "🇪🇺 Europa",
    textMeButton: "Mandami un SMS e chiamami",
    textingButton: "Invio SMS…",
    textedStatus: "Controlla i tuoi messaggi — Hana ti richiamerà subito. 📱",
    calledStatus: "Ti stiamo chiamando — rispondi al telefono! 📞",
    or: "oppure",
    webCallButton: "Preferisci parlare ora? Avvia una chiamata web →",
    speakingWithHana: "Stai parlando con Hana",
    connecting: "Connessione in corso...",
    clickEndCall: "Clicca Termina Chiamata quando hai finito.",
    establishingConnection: "Connessione in corso...",
    endCall: "Termina Chiamata",
    fieldNameRequired: "Il nome è obbligatorio",
    fieldEmailRequired: "L'email è obbligatoria",
    fieldPhoneFormat: "Inserisci il numero in formato internazionale, es. +39 02 1234 5678.",
    networkError: "Errore di rete. Riprova.",
    callFailed: "Non siamo riusciti a effettuare la chiamata. Riprova.",
  },
  howHanaWorks: {
    heading: "Guarda HANA in Azione",
    headingPrefix: "Guarda HANA in",
    headingEmphasis: "Azione",
    tab1: "Monitoraggio Remoto",
    tab1SubHeading: "Dentro una Conversazione HANA",
    tab1Body: "Come l'AI monitora, ragiona e riporta nel corso di una conversazione con il paziente.",
    tab1f1: "Tracciamento aderenza e parametri vitali",
    tab1f2: "Colloquio motivazionale",
    tab1f3: "Coinvolgimento multicanale",
    tab2: "Accoglienza Paziente",
    tab2SubHeading: "Accoglienza e Onboarding Intelligente del Paziente",
    tab2Body: "Hana trasforma i moduli standard di accoglienza in approfondimenti clinici ricchi. Rivede automaticamente le schede dei pazienti, identifica i dettagli mancanti e li chiama per raccogliere il contesto narrativo su sintomi e stile di vita prima della prima visita.",
    tab2f1: "Analisi delle lacune nei moduli",
    tab2f2: "Generazione narrativa clinica",
    tab2f3: "Inserimento automatizzato in EHR",
    tab3: "Coordinamento delle Cure",
    tab3SubHeading: "Receptionist AI 24/7 e Pianificazione",
    tab3Body: "Non perdere mai una chiamata di un paziente. Hana gestisce le richieste in entrata, pianifica gli appuntamenti direttamente nel tuo EHR in base alla disponibilità in tempo reale, raccoglie i dati demografici dei nuovi pazienti e gestisce le richieste di riprogrammazione tutto il giorno.",
    tab3f1: "Pianificazione EHR in tempo reale",
    tab3f2: "Registrazione nuovi pazienti",
    tab3f3: "Gestione inbound 24/7",
    prevSlide: "Slide precedente",
    nextSlide: "Slide successiva",
  },
  caseStudiesTeaser: {
    tag: "Casi Studio",
    heading: "Zero chiamate perse. I numeri parlano.",
    body: "Scopri come i centri medici hanno affidato la routine a Hana — e cosa è cambiato davvero.",
    readMore: "Leggi i casi studio",
    readMoreSub: "Deployment reali — con agenti vocali live che puoi provare subito.",
  },
  recipesMarquee: {
    tag: "Automazione dei flussi",
    heading: "I tuoi protocolli, già configurati.",
    body: "100+ flussi di chiamata pronti dal primo giorno — in ortopedia, ginecologia, salute mentale e medicina di base. Attiva prima quello che ti fa perdere più appuntamenti; aggiungi gli altri man mano.",
  },
  hero: {
    headline: "Automatizza le chiamate che il tuo gestionale",
    headlineCantMake: "non può fare",
    subheadline: "Hana risponde a ogni paziente, gestisce prenotazioni e follow-up, e scrive tutto nella cartella. La segreteria smette di inseguire le chiamate e torna ad accogliere le persone.",
    endDemo: "Termina Demo",
    connecting: "Connessione...",
    talkToHana: "Parla con Hana",
    bookDemo: "Chiedici una Demo",
  },
  integrations: {
    tag: "Integrazioni",
    heading: "Si integra con i sistemi che",
    headingEmphasis: "già utilizzi.",
    body: "95+ EHR, legge e scrive automaticamente. Raggiunge i pazienti tramite voce, SMS, WhatsApp o iMessage — in più lingue.",
    ehr: "Integrazioni EHR",
    ehrTagline: "Legge la cartella. Parla col paziente. Scrive il risultato.",
    ehrBody: "Connessioni dirette con i principali software gestionali. O collegati tramite Redox e Catagon per raggiungere 95+ sistemi. Hana legge la cartella prima di chiamare — al paziente non viene mai chiesto quello che già sai.",
    channels: "Canali di contatto",
    channelsTagline: "Sceglie il canale giusto, al momento giusto. Senza app, senza portali, senza login.",
    channelsBody: "Voce, SMS, WhatsApp o iMessage — Hana usa il canale che funziona per quel paziente. Nessuna app da scaricare, nessun portale da accedere. Solo una conversazione.",
    noEhr: "Nessun gestionale? Nessun problema.",
    noEhrTagline: "Partiamo da quello che hai già.",
    noEhrBody: "Non hai ancora un gestionale integrato? Nessun problema. Costruiamo dashboard su misura, pannelli di controllo standalone, o lavoriamo accanto agli strumenti che già usi. Non devi essere \"tech-ready\" per iniziare.",
    sdk: "SDK e White-Label",
    sdkTagline: "Stai costruendo una piattaforma? Incorpora Hana via SDK con il tuo brand.",
    sdkBody: "Accesso completo alle API. Dashboard personalizzati. Il tuo marchio. Il nostro motore di ragionamento.",
    learnPartnerships: "Scopri le opportunità di partnership",
  },
  homeSeo: {
    title: "Hana Voice AI | Le chiamate che il tuo EHR non può fare",
    description: "Hana gestisce le tue chiamate di accesso ai pazienti dall'inizio alla fine — accoglienza pre-visita, verifica autorizzazioni, recupero no-show, richiami, ricariche. Legge la cartella, fa la chiamata, scrive la nota.",
    faq: [
      { question: "Cos'è Hana Voice AI?", answer: "Hana è una piattaforma di voice AI clinica che automatizza il coinvolgimento dei pazienti in tutto il percorso di cura — accoglienza, follow-up, monitoraggio remoto e coordinamento delle cure. Distribuisce agenti AI che chiamano, mandano SMS e messaggi ai pazienti tramite voce, SMS e chat, si integra con i sistemi EHR ed è conforme HIPAA con BAA disponibile." },
      { question: "In cosa Hana si differenzia da un portale pazienti o da un chatbot AI generico?", answer: "I portali pazienti e i promemoria via SMS aspettano che il paziente agisca, quindi le agende rimangono vuote. Hana alza il telefono e raggiunge i pazienti nel modo in cui rispondono davvero. A differenza dei chatbot AI generici, Hana legge la cartella, conosce il paziente e segue i protocolli clinici, quindi è progettata specificamente per i workflow sanitari." },
      { question: "Quali workflow clinici supporta Hana?", answer: "Hana supporta il follow-up post-dimissione per prevenire i ricoveri entro 30 giorni, la gestione delle malattie croniche (APCM/CCM), l'accoglienza strutturata per ADHD e salute mentale, l'outreach per l'aderenza ai farmaci e il monitoraggio remoto dei pazienti con scrittura nell'EHR." },
      { question: "Quanto tempo ci vuole per mettere in produzione Hana?", answer: "Hana viene distribuita in settimane, non mesi. La maggior parte dei team va live in circa 3 settimane — il tuo team la testa su una linea reale prima che venga chiamato un solo paziente. È un'infrastruttura su cui le cliniche costruiscono, non una soluzione puntuale." },
    ],
  },
  about: {
    seoTitle: "Chi Siamo | Hana Voice AI",
    seoDescription: "Incontra il team dietro Hana Voice AI. Fondato da esperti clinici e ingegneri per costruire l'infrastruttura per il coinvolgimento continuo dei pazienti tramite agenti vocali AI.",
    h1: "Chi è Hana",
    tagline: "Stiamo costruendo l'infrastruttura di cura per le ore tra le visite.",
    story: "L'assistenza sanitaria funziona per l'appuntamento di 15 minuti. Noi stiamo risolvendo le 10.000 ore che vengono dopo, con un'AI che ascolta, si adatta e mantiene i pazienti connessi alle loro cure.",
    foundersTitle: "La Storia dei Fondatori",
    stat1Label: "Interazioni con i Pazienti",
    stat1Value: "1M+",
    stat2Label: "Coinvolgimento Settimanale",
    stat2Value: "85%",
    stat3Label: "Paesi",
    stat3Value: "5",
    stat4Label: "ROI per la Clinica",
    stat4Value: "31:1",
    valuesTitle: "I Nostri Valori",
    v1Title: "Zero attrito per i pazienti",
    v1Body: "Se richiede un download, un login o un cambiamento di comportamento, è già morto. Incontriamo i pazienti dove sono: al telefono, in una conversazione. Nessuna app. Nessun portale. Nessun onere.",
    v2Title: "La sicurezza non è una funzionalità",
    v2Body: "È il fondamento. Oltre un milione di interazioni con i pazienti senza eventi avversi critici. Ogni conversazione è monitorata, ogni protocollo di escalation è definito dalla clinica, ogni segnale di rischio viene intercettato.",
    v3Title: "Infrastruttura, non applicazioni",
    v3Body: "Non costruiamo soluzioni puntuali. Costruiamo il livello di coinvolgimento che alimenta tutto, dall'accoglienza al monitoraggio all'aderenza. Come l'elettricità per la comunicazione con i pazienti.",
    v4Title: "Globale per design",
    v4Body: "I protocolli sanitari sono universali. Gli incentivi variano. Operiamo in cinque paesi, tre lingue e sia nei sistemi pubblici che privati, adattandoci a ciascuno senza ricostruire.",
    v5Title: "L'AI colma le lacune, non sostituisce i lavori",
    v5Body: "Non sostituiamo infermieri e team di cura. Portiamo l'AI nei posti in cui non c'è nessuno: chiamate mancate, ore non monitorate, domande non poste. Tutti rimangono. Le cure migliorano.",
    v6Title: "Risultati prima delle demo",
    v6Body: "Non facciamo demo sgargianti o investimenti di immagine. Facciamo 85% di coinvolgimento, 96% di tassi di completamento e 31:1 ROI. Soluzioni noiose e funzionali che funzionano davvero. Questo è ciò di cui ha bisogno la sanità.",
    timelineTitle: "Come Ci Siamo Arrivati",
    openSourceTitle: "Open source. Self-hosted. Healthcare AI che possiedi davvero.",
    openSourceBody: "Sei mesi fa abbiamo preso una decisione che ha cambiato la nostra traiettoria: ci siamo spostati completamente da OpenAI. Abbiamo migrato HANA a modelli open-source sui nostri server. Nessuna dipendenza da API proprietarie. Nessun dato paziente che lascia la tua giurisdizione. Piena sovranità.",
    meetTeamTitle: "Il Nostro Team",
    joinTeam: "Vuoi entrare nel team?",
    connectCta: "Connettiti con Matteo",
    closingHeading: "Chiudiamo insieme il gap di coinvolgimento",
    closingBody: "Che tu sia una clinica, una piattaforma o un sistema sanitario, ci piacerebbe parlare.",
    bookConversation: "Prenota una conversazione",
  },
  contact: {
    seoTitle: "Contattaci | Hana Voice AI",
    seoDescription: "Hai domande sui nostri agenti AI clinici? Siamo qui per aiutarti a trasformare i tuoi workflow sanitari.",
    h1: "Contattaci",
    subheading: "Hai domande sui nostri agenti AI clinici? Siamo qui per aiutarti a trasformare i tuoi workflow sanitari.",
    infoTitle: "Informazioni di Contatto",
    emailLabel: "Email",
    officeLabel: "Ufficio",
    officeCompany: "HANA Health, Inc.",
    officeNote: "Team distribuito",
    getStartedTitle: "Pronto a iniziare?",
    getStartedBody: "Salta la fila e prenota una demo diretta con i nostri specialisti di prodotto.",
    bookDemo: "Prenota una Demo Live",
    formTitle: "Inviaci un messaggio",
    firstNameLabel: "Nome",
    firstNamePlaceholder: "Mario",
    lastNameLabel: "Cognome",
    lastNamePlaceholder: "Rossi",
    emailAddress: "Indirizzo Email",
    emailPlaceholder: "mario@organizzazione.it",
    subjectLabel: "Oggetto",
    subjectSales: "Richiesta Commerciale",
    subjectSupport: "Supporto Tecnico",
    subjectPartnership: "Opportunità di Partnership",
    subjectOther: "Altro",
    messageLabel: "Messaggio",
    messagePlaceholder: "Raccontaci le esigenze della tua organizzazione...",
    submitButton: "Invia Messaggio",
    submittingButton: "Invio in corso...",
    privacyNote: "Inviando questo modulo accetti la nostra Informativa Privacy.",
    successTitle: "Messaggio inviato",
    successBody: "Grazie per averci contattato — ti risponderemo al più presto.",
    errorTitle: "Impossibile inviare il messaggio",
    errorBody: "Ti preghiamo di scriverci direttamente a hello@hana.health.",
  },
  pricing: {
    seoTitle: "Prezzi | Hana Voice AI",
    seoDescription: "Prezzi basati sui risultati, allineati ai tuoi risparmi. Calcola esattamente quanto costa Hana e quanto risparmi rispetto al personale umano.",
    heading: "Prezzi basati sui risultati",
    subheading: "Guarda quanto ti costa attualmente lo studio",
    next: "Avanti",
    back: "Indietro",
    seeEstimate: "Vedi la mia stima",
    bookCall: "Prenota una chiamata esplorativa",
    backToVolumes: "Torna ai volumi",
    commonQuestions: "Domande frequenti",
  },
  blog: {
    seoTitle: "Blog | Hana Health",
    seoDescription: "Approfondimenti sulla voice AI in ambito sanitario dal team Hana.",
    heading: "Blog",
    subheading: "Approfondimenti su voice AI, automazione sanitaria e workflow clinici.",
    noPosts: "Nessun articolo ancora — torna presto.",
  },
  notFound: {
    heading: "Pagina non trovata",
    body: "La pagina che stai cercando non esiste.",
    cta: "Torna alla home",
  },
  labs: {
    seoTitle: "Laboratorio | Hana Voice AI",
    seoDescription: "Esplora la ricerca clinica e le pubblicazioni alla base di Hana Voice AI. Avanziamo la conversational AI in ambito sanitario con biomarcatori vocali, studi sul coinvolgimento dei pazienti e tecnologie di engagement adattativo.",
    h1: "Avanzare la Conversational AI in Ambito Sanitario",
    subheading: "In Hana stiamo aprendo nuove strade nella ricerca su come la conversational AI può trasformare il coinvolgimento dei pazienti e l'erogazione delle cure.",
    readDocs: "Leggi la Documentazione Tecnica",
    publicationsTitle: "Pubblicazioni",
    publicationsBody: "Scopri la ricerca e le prove cliniche alla base dei nostri prodotti",
    readArticle: "Leggi l'Articolo",
  },
};

export const translations: Record<Locale, Translations> = { en, it };

// Hook for use in React components.
import { useMemo } from "react";
export function useTranslations(): Translations {
  const locale = useMemo(() => getLocale(), []);
  return translations[locale];
}
