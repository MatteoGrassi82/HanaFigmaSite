import { useState } from "react";
import { Player } from "@remotion/player";
import { WorkflowBuilderComp } from "../components/remotion/WorkflowBuilderComp";
import { SafetyMonitorComp } from "../components/remotion/SafetyMonitorComp";
import { PatientContextComp } from "../components/remotion/PatientContextComp";
import { Footer } from "../components/Footer";

const compositions = [
  {
    id: "workflow",
    title: "Workflow Builder",
    description: "An inbound cancellation, handled end-to-end: chart read, cancellation logged, waitlist patient found and booked, EHR notes, a staff task, and two confirmation texts — no staff touched anything.",
    component: WorkflowBuilderComp,
    durationInFrames: 510,
  },
  {
    id: "safety",
    title: "Safety Monitor",
    description: "Real-time transcript analysis. Critical risk flags and automated protocol execution.",
    component: SafetyMonitorComp,
    durationInFrames: 390,
  },
  {
    id: "patient",
    title: "Patient Context",
    description: "Every interaction adds context. Channel, timing, history — carried forward automatically.",
    component: PatientContextComp,
    durationInFrames: 390,
  },
];

export function Demo() {
  const [active, setActive] = useState(0);
  const comp = compositions[active];

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Demo Lab</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-slate-900 dark:text-white leading-tight">
            Animated product demos
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-xl">
            Built with Remotion Player — React animations running live in the browser, no video files needed.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {compositions.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active === i
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Player */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Player
            component={comp.component}
            durationInFrames={comp.durationInFrames}
            compositionWidth={900}
            compositionHeight={506}
            fps={30}
            style={{ width: "100%", aspectRatio: "900/506" }}
            controls
            loop
            autoPlay
          />
        </div>

        {/* Caption */}
        <div className="mt-6 flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{comp.title}</h2>
            <p className="mt-1 text-slate-500 text-base">{comp.description}</p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 shrink-0 font-mono">
            {comp.durationInFrames / 30}s @ 30fps
          </div>
        </div>

        {/* Dev note */}
        <div className="mt-16 p-6 bg-blue-50 dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">About this page</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            These animations are React components using the Remotion Player. They replace static screenshots and S3 screen recordings with frame-accurate, brand-consistent product demos.
            Each composition is 300 frames (10s) at 30fps and loops automatically.
            The next step would be to slot these into the <code className="font-mono bg-white dark:bg-slate-900 px-1 rounded">AgenticFrameworkCarousel</code> in place of the raw mp4 videos.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
