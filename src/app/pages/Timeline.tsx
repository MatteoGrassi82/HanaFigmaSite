"use client";

import { BrainCircuit, Database, BookOpen, HeartHandshake, ShieldCheck } from "lucide-react";
import RadialOrbitalTimeline from "../components/ui/radial-orbital-timeline";
import { SEO } from "../components/SEO";
import { breadcrumbSchema } from "../components/SEO";

const timelineData = [
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
          title="Reasoning Engine"
          description="See how Hana's Reasoning Engine works. Five layers of intelligence—Memory, Data, Protocols, Engagement, and Safety—power every patient interaction."
          path="/timeline"
          keywords="AI reasoning engine, healthcare intelligence layers, clinical AI architecture, voice AI technology, patient interaction AI"
          jsonLd={breadcrumbSchema([
            { name: "Home", url: "https://www.hana.health/" },
            { name: "Reasoning Engine", url: "https://www.hana.health/timeline" }
          ])}
        />
      )}
      <RadialOrbitalTimeline
        timelineData={timelineData}
        label="HANA REASONING ENGINE"
        title="Five layers of intelligence. Not a chatbot with a script."
        description="Safety agents that monitor every conversation in real time. A memory layer that compounds across interactions. Protocol libraries built from your clinical guidelines. Observability so your team sees what the AI did and why. And a reasoning model that ties it all together."
      />
    </>
  );
}

export default RadialOrbitalTimelineDemo;