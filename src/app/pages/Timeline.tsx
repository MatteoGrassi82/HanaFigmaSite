"use client";

import { BrainCircuit, Database, BookOpen, HeartHandshake, ShieldCheck } from "lucide-react";
import RadialOrbitalTimeline from "../components/ui/radial-orbital-timeline";
import { SEO } from "../components/SEO";
import { breadcrumbSchema } from "../components/SEO";
import { getLocale } from "../../lib/i18n";

const it = getLocale() === "it";

const timelineData_EN = [
  {
    id: 1,
    title: "MEMORY LAYER",
    date: "MEMORY LAYER",
    content: "Remembers what the patient said last time. Reported barriers, preferences, interaction history. Every conversation builds on the last.",
    category: "Memory",
    icon: BrainCircuit,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "EHR & PATIENT DATA",
    date: "EHR & PATIENT DATA",
    content: "Reads and writes to 150+ EHR systems. Pulls context before every interaction. Sends structured notes back.",
    category: "Data",
    icon: Database,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "CLINICAL PROTOCOLS",
    date: "CLINICAL PROTOCOLS",
    content: "Follows screening tools and care pathways exactly. Validated instruments. No improvisation on clinical content.",
    category: "Protocols",
    icon: BookOpen,
    relatedIds: [2, 5],
    status: "in-progress" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "ENGAGEMENT & PERSONALIZATION",
    date: "ENGAGEMENT & PERSONALIZATION",
    content: "Picks the right channel, time, language, and tone. Adapts based on patient behavior and preferences.",
    category: "Engagement",
    icon: HeartHandshake,
    relatedIds: [1, 5],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 5,
    title: "SAFETY & OBSERVABILITY",
    date: "SAFETY & OBSERVABILITY",
    content: "Audit trails, risk detection, escalation. Every decision logged. Every call reviewable.",
    category: "Safety",
    icon: ShieldCheck,
    relatedIds: [3, 4],
    status: "completed" as const,
    energy: 100,
  },
];

const timelineData_IT = [
  {
    id: 1,
    title: "LIVELLO MEMORIA",
    date: "LIVELLO MEMORIA",
    content: "Ricorda cosa ha detto il paziente l'ultima volta. Ostacoli segnalati, preferenze, storico delle interazioni. Ogni conversazione si basa sulla precedente.",
    category: "Memoria",
    icon: BrainCircuit,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "EHR E DATI PAZIENTE",
    date: "EHR E DATI PAZIENTE",
    content: "Legge e scrive su 150+ sistemi EHR. Recupera il contesto prima di ogni interazione. Restituisce note strutturate.",
    category: "Dati",
    icon: Database,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "PROTOCOLLI CLINICI",
    date: "PROTOCOLLI CLINICI",
    content: "Segue alla lettera strumenti di screening e percorsi di cura. Strumenti validati. Nessuna improvvisazione sui contenuti clinici.",
    category: "Protocolli",
    icon: BookOpen,
    relatedIds: [2, 5],
    status: "in-progress" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "COINVOLGIMENTO E PERSONALIZZAZIONE",
    date: "COINVOLGIMENTO E PERSONALIZZAZIONE",
    content: "Sceglie il canale, l'orario, la lingua e il tono giusti. Si adatta in base al comportamento e alle preferenze del paziente.",
    category: "Coinvolgimento",
    icon: HeartHandshake,
    relatedIds: [1, 5],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 5,
    title: "SICUREZZA E OSSERVABILITÀ",
    date: "SICUREZZA E OSSERVABILITÀ",
    content: "Audit trail, rilevamento dei rischi, escalation. Ogni decisione registrata. Ogni chiamata consultabile.",
    category: "Sicurezza",
    icon: ShieldCheck,
    relatedIds: [3, 4],
    status: "completed" as const,
    energy: 100,
  },
];

const timelineData = it ? timelineData_IT : timelineData_EN;

/**
 * Used both as the standalone /timeline route AND as a section embedded in the
 * homepage. When `embedded`, we DON'T render <SEO> — otherwise its title/JSON-LD
 * would clobber the host page's (they share document.head + the single
 * data-seo-jsonld script). Only the real /timeline route owns the SEO.
 */
export function RadialOrbitalTimelineDemo({ embedded = false }: { embedded?: boolean }) {
  return (
    <>
      {!embedded && (
        <SEO
          title={it ? "Motore di Ragionamento" : "Reasoning Engine"}
          description={it
            ? "Scopri come funziona il Motore di Ragionamento di Hana. Cinque livelli di intelligenza—Memoria, Dati, Protocolli, Coinvolgimento e Sicurezza—alimentano ogni interazione con il paziente."
            : "See how Hana's Reasoning Engine works. Five layers of intelligence—Memory, Data, Protocols, Engagement, and Safety—power every patient interaction."}
          path="/timeline"
          keywords={it
            ? "motore di ragionamento AI, livelli di intelligenza sanitaria, architettura AI clinica, tecnologia voice AI, AI per interazione con il paziente"
            : "AI reasoning engine, healthcare intelligence layers, clinical AI architecture, voice AI technology, patient interaction AI"}
          jsonLd={breadcrumbSchema([
            { name: "Home", url: "https://www.hana.health/" },
            { name: it ? "Motore di Ragionamento" : "Reasoning Engine", url: "https://www.hana.health/timeline" }
          ])}
        />
      )}
      <RadialOrbitalTimeline
        timelineData={timelineData}
        label={it ? "MOTORE DI RAGIONAMENTO HANA" : "HANA REASONING ENGINE"}
        title={it
          ? "Abbastanza intelligente da sapere quando parlare. E quando passare la palla."
          : "Smart enough to know when to talk. And when to escalate."}
        description={it
          ? "Legge la cartella prima di ogni chiamata. Ricorda cosa ha detto il paziente l'ultima volta. Segue i tuoi protocolli. Segnala ciò che conta."
          : "Reads the chart before every call. Remembers what the patient said last time. Follows your protocols. Flags what matters."}
      />
    </>
  );
}

export default RadialOrbitalTimelineDemo;