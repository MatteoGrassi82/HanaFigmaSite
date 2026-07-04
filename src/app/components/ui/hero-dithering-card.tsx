import { Loader2, StopCircle } from "lucide-react";
import VoiceWave from "../../../assets/hana-orb.webp";
import { useTranslations } from "../../../lib/i18n";

interface CTASectionProps {
  onStartCall?: () => void;
  isConnecting?: boolean;
  isActive?: boolean;
  disabled?: boolean;
}

export function CTASection({ onStartCall, isConnecting = false, isActive = false, disabled = false }: CTASectionProps) {
  const t = useTranslations();

  const handleDemoClick = () => {
    if (!isActive && !isConnecting) {
      const demoSection = document.getElementById("live-demo-section");
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: "smooth" });
      } else {
        if (onStartCall) onStartCall();
      }
    } else if (onStartCall) {
      onStartCall();
    }
  };

  return (
    <section className="relative w-full flex justify-center items-center">
      <div className="w-full relative overflow-hidden min-h-[90dvh] md:min-h-[850px] flex flex-col items-center justify-center pt-10 pb-20 md:py-0">

        {/* Mesh gradient background — dark navy base + colorful radial glows */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: [
              "radial-gradient(ellipse 75% 80% at 12% 55%, rgba(59,130,246,0.6) 0%, transparent 60%)",
              "radial-gradient(ellipse 55% 55% at 58% 92%, rgba(20,184,166,0.22) 0%, transparent 52%)",
              "radial-gradient(ellipse 45% 45% at 82% 12%, rgba(99,102,241,0.22) 0%, transparent 50%)",
              "#050e2b",
            ].join(", "),
          }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 flex flex-col justify-center pointer-events-none">
          <div className="flex flex-col items-center text-center z-20 pointer-events-auto max-w-5xl mx-auto">

            {/* Peel badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="text-sm font-medium text-white/70 tracking-wide">{t.hero.builtByClinicians}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-normal text-white mb-6 md:mb-8 leading-[1.1]">
              {t.hero.headline} <br className="hidden md:block" /><span className="text-blue-300">{t.hero.headlineCantMake}</span>.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-2xl text-blue-100/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-normal">
              {t.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-auto mx-auto">
              <button
                onClick={handleDemoClick}
                disabled={isConnecting || disabled}
                className="group relative flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full p-2 pr-6 transition-all duration-300 w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5 backdrop-blur-sm"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
                  <img src={VoiceWave} alt="Voice Wave" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  {(isConnecting || isActive) && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                      {isConnecting
                        ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                        : <StopCircle className="w-5 h-5 text-red-400 fill-current" />
                      }
                    </div>
                  )}
                </div>
                <span className="text-blue-300 text-lg font-medium whitespace-nowrap leading-none">
                  {isActive ? t.hero.endDemo : isConnecting ? t.hero.connecting : t.hero.talkToHana}
                </span>
              </button>

              <a
                href="https://calendly.com/matteowastaken/discoverycall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 sm:px-8 py-4 bg-white text-slate-900 rounded-full font-medium text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center whitespace-nowrap"
              >
                {t.hero.bookDemo}
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
