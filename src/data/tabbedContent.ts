import { getLocale } from '../lib/i18n';

export interface Tab {
  id: string;
  label: string;
}

export interface TabContent {
  tagline: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

const tabs_en: Tab[] = [
  { id: 'tab1', label: 'Outreach' },
  { id: 'tab2', label: 'Intake' },
  { id: 'tab3', label: 'Coordination' },
  { id: 'tab4', label: 'Monitoring' }
];

const tabContent_en: Record<string, TabContent> = {
  tab1: {
    tagline: 'Patient Engagement',
    title: 'Bring patients back into care',
    description: 'Automated outreach campaigns that reconnect patients with their healthcare journey through personalized, compliant communication.',
    features: [
      'Reactivation campaigns',
      'Reminders & nudges',
      'HIPAA/TCPA compliant'
    ],
    image: 'https://wnvgvfmhzoyeotjczmys.supabase.co/storage/v1/object/public/hana/Illustration_icons%20only.png'
  },
  tab2: {
    tagline: 'Patient Onboarding',
    title: 'Streamline enrollment & assessment',
    description: 'Comprehensive intake process that captures essential patient information and baseline assessments efficiently.',
    features: [
      'Demographics & consents',
      'PHQ-9, GAD-7, pain, sleep',
      'Baseline + reassessments'
    ],
    image: 'https://wnvgvfmhzoyeotjczmys.supabase.co/storage/v1/object/public/new%20site/Illustration_intake%20flow%20diagram.png'
  },
  tab3: {
    tagline: 'Operational Excellence',
    title: 'Run clinic operations smoothly',
    description: 'Integrated workflow management that keeps your clinic running efficiently while reducing administrative burden.',
    features: [
      'Scheduling & no-show recovery',
      'Call routing & follow-ups',
      'Billing minutes & escalations'
    ],
    image: 'https://wnvgvfmhzoyeotjczmys.supabase.co/storage/v1/object/public/new%20site/Illustration_coordination%20flow%20diagram.png'
  },
  tab4: {
    tagline: 'Continuous Care',
    title: 'Continuous support between visits',
    description: 'Ongoing patient monitoring and support that bridges the gap between appointments with proactive interventions.',
    features: [
      'Weekly check-ins',
      'Coaching & adherence tracking',
      'Real-time risk alerts'
    ],
    image: 'https://wnvgvfmhzoyeotjczmys.supabase.co/storage/v1/object/public/new%20site/Illustration_monitoring%20flow%20simple%20circular.png'
  }
};

const tabs_it: Tab[] = [
  { id: 'tab1', label: 'Outreach' },
  { id: 'tab2', label: 'Accoglienza' },
  { id: 'tab3', label: 'Coordinamento' },
  { id: 'tab4', label: 'Monitoraggio' }
];

const tabContent_it: Record<string, TabContent> = {
  tab1: {
    tagline: 'Coinvolgimento dei Pazienti',
    title: 'Riporta i pazienti in cura',
    description: 'Campagne di outreach automatizzate che riconnettono i pazienti al loro percorso di cura tramite comunicazioni personalizzate e conformi.',
    features: [
      'Campagne di riattivazione',
      'Promemoria e solleciti',
      'Conforme HIPAA/TCPA'
    ],
    image: 'https://wnvgvfmhzoyeotjczmys.supabase.co/storage/v1/object/public/hana/Illustration_icons%20only.png'
  },
  tab2: {
    tagline: 'Onboarding del Paziente',
    title: 'Semplifica iscrizione e valutazione',
    description: 'Processo di accoglienza completo che raccoglie le informazioni essenziali del paziente e le valutazioni di base in modo efficiente.',
    features: [
      'Dati demografici e consensi',
      'PHQ-9, GAD-7, dolore, sonno',
      'Valutazioni iniziali e successive'
    ],
    image: 'https://wnvgvfmhzoyeotjczmys.supabase.co/storage/v1/object/public/new%20site/Illustration_intake%20flow%20diagram.png'
  },
  tab3: {
    tagline: 'Eccellenza Operativa',
    title: 'Fai girare le operazioni della clinica senza intoppi',
    description: 'Gestione integrata dei workflow che mantiene la tua clinica efficiente riducendo al contempo il carico amministrativo.',
    features: [
      'Scheduling e recupero no-show',
      'Smistamento chiamate e follow-up',
      'Minuti di fatturazione ed escalation'
    ],
    image: 'https://wnvgvfmhzoyeotjczmys.supabase.co/storage/v1/object/public/new%20site/Illustration_coordination%20flow%20diagram.png'
  },
  tab4: {
    tagline: 'Cura Continua',
    title: 'Supporto continuo tra le visite',
    description: 'Monitoraggio e supporto continuo dei pazienti che colma il divario tra gli appuntamenti con interventi proattivi.',
    features: [
      'Check-in settimanali',
      'Coaching e tracciamento aderenza',
      'Alert di rischio in tempo reale'
    ],
    image: 'https://wnvgvfmhzoyeotjczmys.supabase.co/storage/v1/object/public/new%20site/Illustration_monitoring%20flow%20simple%20circular.png'
  }
};

export const tabs: Tab[] = getLocale() === 'it' ? tabs_it : tabs_en;
export const tabContent: Record<string, TabContent> = getLocale() === 'it' ? tabContent_it : tabContent_en;
