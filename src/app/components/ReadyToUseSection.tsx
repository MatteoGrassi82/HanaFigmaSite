import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslations } from "../../lib/i18n";

export function ReadyToUseSection() {
  const t = useTranslations();
  return (
    <section className="py-20 sm:py-24 md:py-32 px-4 bg-[rgb(0,18,47)] relative overflow-hidden text-center border-t border-white/5">
      {/* Background gradients/effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
            {t.cta.heading}
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 font-light mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.cta.body}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 group shadow-lg shadow-blue-900/20">
              {t.cta.bookDemo}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/pricing" className="px-8 py-4 rounded-full text-lg font-medium text-white border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2">
              {t.cta.savings}
            </Link>
            <a href="https://docs.hana.health/" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full text-lg font-medium text-white border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2">
              {t.cta.readDocs}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
