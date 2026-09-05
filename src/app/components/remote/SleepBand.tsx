import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

/**
 * HANA Sleep, as one section on a care-coordination page.
 *
 * Matteo's call with Sthita (2026-08-19) settled the hierarchy: Remote is the
 * product this page sells, and Sleep gets ONE section that hands off to its own
 * page. The rejected alternative gave Sleep equal billing at the top, which read
 * as "are you a sleep company or a care coordination company?".
 *
 * So: a photo card, a New label (his words: new product, new protocol, new
 * system, NOT "coming soon"), the two Sleep products as rows you can click, and
 * one link out to /hana-sleep. Roughly a third of the height of the two-card
 * feature version it replaced (SleepTwoProducts, still in this folder).
 *
 * PHOTO TODO: Matteo wants a sleep image behind this one. The patient-call photo
 * below is a stand-in, and it is the only thing here that needs swapping.
 *
 * Both product lines come off the live /hana-sleep pages, so nothing new is
 * claimed: Analysis READS the hypnogram a wearable or home test already records
 * (it does not produce one), and the CPAP programme calls through the first
 * ninety days and documents each follow-up.
 */
const SLEEP_PRODUCTS = [
  {
    name: "HANA Sleep Analysis",
    line: "Reads the hypnogram any wearable or home sleep test already records, against the patient's own baseline.",
    href: "/hana-sleep/analysis",
  },
  {
    name: "CPAP Adherence Program",
    line: "Calls new CPAP patients through the ninety days that decide whether therapy holds, and documents each follow-up.",
    href: "/hana-sleep/cpap",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

export function SleepBand() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1240px] mx-auto">
        <motion.div {...fadeUp} className="relative rounded-[26px] overflow-hidden bg-[#0A1633]">
          <img
            src="/products/remote-patient-call.webp"
            alt="A patient at home"
            className="absolute inset-0 w-full h-full object-cover object-[52%_18%]"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,12,26,0.93) 0%, rgba(5,12,26,0.86) 42%, rgba(5,12,26,0.62) 72%, rgba(5,12,26,0.50) 100%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-9 lg:gap-14 items-center p-8 sm:p-10 md:p-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#E8A06A] text-[#231206] text-[11px] font-bold uppercase tracking-[1.2px] px-2.5 py-1">
                  New
                </span>
                <p className={`${eyebrow} text-[#8AB4FF] m-0`}>HANA Sleep</p>
              </div>

              <h2 className="font-serif font-normal text-[29px] sm:text-[34px] md:text-[38px] leading-[1.12] text-white mt-5 mb-0 max-w-[20ch]">
                Your sleep patients need the same phone call.
              </h2>
              <p className="text-[15.5px] leading-[1.65] text-white/75 mt-4 mb-0 max-w-[44ch]">
                A second system, built on the same calls and the same documentation as Remote. One
                side reads the night the patient is already recording. The other calls them until the
                therapy sticks.
              </p>

              <a
                href="/hana-sleep"
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-white no-underline mt-7 border-b border-white/30 pb-1 hover:border-white transition-colors"
              >
                See HANA Sleep
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
              </a>
            </div>

            <div className="space-y-3">
              {SLEEP_PRODUCTS.map((s, i) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center gap-5 rounded-[16px] bg-white/[0.10] backdrop-blur-xl border border-white/15 px-5 py-4 no-underline hover:bg-white/[0.16] hover:border-white/30 transition-colors"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-semibold text-white">{s.name}</span>
                    <span className="block text-[13px] leading-[1.55] text-white/70 mt-1">{s.line}</span>
                  </span>
                  <ChevronRight
                    className="w-4 h-4 text-white/65 shrink-0 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.4}
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
