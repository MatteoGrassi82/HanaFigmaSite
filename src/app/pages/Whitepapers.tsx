import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, FileText } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

const WHITEPAPERS = [
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

function WhitepaperCard({ wp, index }: { wp: typeof WHITEPAPERS[0]; index: number }) {
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
            Read whitepaper <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function Whitepapers() {
  return (
    <>
      <SEO
        title="Whitepapers | HANA"
        description="Clinical whitepapers on voice AI workflows for healthcare — ADHD intake, chronic care, and more."
        path="/whitepapers"
      />

      <div className="bg-[#00122F] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Hana Health</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Whitepapers</h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Deep-dive clinical workflows and integration guides for HANA partners.
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
              <p className="text-sm font-semibold text-slate-400">More whitepapers coming</p>
              <p className="text-xs text-slate-400 mt-1">Depression screening, chronic care, and more</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
