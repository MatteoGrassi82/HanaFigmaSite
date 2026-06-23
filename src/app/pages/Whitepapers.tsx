import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, FileText } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { getLocale } from "../../lib/i18n";

const WHITEPAPERS_EN = [
  {
    id: "adhd-intake",
    title: "ADHD Intake Workflow",
    subtitle: "A Complete Walkthrough for Clinic Partners",
    description: "3-module interview architecture, pediatric & adult intake flows, and Practice Q integration. How HANA automates ADHD assessment intake end-to-end.",
    tags: ["ADHD", "Intake", "Clinical Workflow"],
    href: "/whitepapers/adhd-intake",
    year: "2026",
    badge: "Clinic Partner",
  },
];

const WHITEPAPERS_IT = [
  {
    id: "adhd-intake",
    title: "Flusso di Accoglienza ADHD",
    subtitle: "Una Guida Completa per i Centri Partner",
    description: "Architettura di intervista a 3 moduli, flussi di accoglienza pediatrici e per adulti, e integrazione con Practice Q. Come HANA automatizza l'accoglienza della valutazione ADHD dall'inizio alla fine.",
    tags: ["ADHD", "Accoglienza", "Flusso Clinico"],
    href: "/whitepapers/adhd-intake",
    year: "2026",
    badge: "Centro Partner",
  },
];

const WHITEPAPERS = getLocale() === "it" ? WHITEPAPERS_IT : WHITEPAPERS_EN;

function WhitepaperCard({ wp, index }: { wp: typeof WHITEPAPERS[0]; index: number }) {
  const it = getLocale() === "it";
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={wp.href}
        className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
      >
        <div className="bg-[#00122F] px-6 py-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">{wp.badge} Whitepaper</span>
          <h2 className="text-white text-xl font-black mt-1 leading-tight">{wp.title}</h2>
          <p className="text-slate-400 text-xs mt-1">{wp.subtitle}</p>
        </div>
        <div className="flex flex-col flex-1 p-6">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {wp.tags.map(t => (
              <span key={t} className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{t}</span>
            ))}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{wp.year}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed flex-1">{wp.description}</p>
          <div className="mt-5 flex items-center gap-1.5 text-blue-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
            {it ? "Leggi il whitepaper" : "Read whitepaper"} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function Whitepapers() {
  const it = getLocale() === "it";
  return (
    <>
      <SEO
        title={it ? "Whitepaper | HANA" : "Whitepapers | HANA"}
        description={it
          ? "Whitepaper clinici sui flussi di lavoro voice AI per la sanità — accoglienza ADHD, gestione delle cure croniche e altro ancora."
          : "Clinical whitepapers on voice AI workflows for healthcare — ADHD intake, chronic care, and more."}
        path="/whitepapers"
      />

      <div className="bg-[#00122F] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Hana Health</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{it ? "Whitepaper" : "Whitepapers"}</h1>
            <p className="text-slate-400 text-lg max-w-xl">
              {it
                ? "Flussi di lavoro clinici approfonditi e guide all'integrazione per i partner HANA."
                : "Deep-dive clinical workflows and integration guides for HANA partners."}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHITEPAPERS.map((wp, i) => <WhitepaperCard key={wp.id} wp={wp} index={i} />)}
            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 flex flex-col items-center justify-center p-8 text-center min-h-[220px]"
            >
              <FileText size={28} className="text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-400">{it ? "Altri whitepaper in arrivo" : "More whitepapers coming"}</p>
              <p className="text-xs text-slate-400 mt-1">{it ? "Screening depressione, gestione delle cure croniche e altro ancora" : "Depression screening, chronic care, and more"}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
