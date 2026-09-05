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
      const el = document.getElementById("live-demo-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else if (onStartCall) onStartCall();
    } else if (onStartCall) {
      onStartCall();
    }
  };

  return (
    <section className="relative w-full">
      {/* Keyframes for the floating orbs */}
      <style>{`
        @keyframes orb1 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          50%      { transform: translate(6%,10%) scale(1.12); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          50%      { transform: translate(-10%,-7%) scale(1.08); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          50%      { transform: translate(-5%,14%) scale(0.92); }
        }
      `}</style>

      <div className="w-full relative overflow-hidden min-h-[90dvh] md:min-h-[850px] flex flex-col items-center justify-center pt-10 pb-20 md:py-0">

        {/* Animated mesh gradient — orbs float on the brand navy base */}
        <div className="absolute inset-0 z-0 bg-[#00122F] overflow-hidden">
          {/* Blue orb — #3B82F6 */}
          <div
            className="absolute w-[70%] h-[90%] -left-[8%] top-[0%] rounded-full blur-[90px] bg-[#3B82F6]/50"
            style={{ animation: "orb1 11s ease-in-out infinite" }}
          />
          {/* Sky orb — #7CC4F0 */}
          <div
            className="absolute w-[55%] h-[65%] left-[38%] -bottom-[20%] rounded-full blur-[80px] bg-[#7CC4F0]/22"
            style={{ animation: "orb2 14s ease-in-out infinite" }}
          />
          {/* Sky orb — top-right accent */}
          <div
            className="absolute w-[40%] h-[50%] -right-[5%] -top-[8%] rounded-full blur-[80px] bg-[#7CC4F0]/18"
            style={{ animation: "orb3 9s ease-in-out infinite" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 flex flex-col justify-center pointer-events-none">
          <div className="flex flex-col items-center text-center z-20 pointer-events-auto max-w-5xl mx-auto">

            {/* Peel badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7CC4F0] shrink-0" />
              <span className="text-sm font-medium text-white/70 tracking-wide">{t.hero.builtByClinicians}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-normal text-white mb-6 md:mb-8 leading-[1.1]">
              {t.hero.headline} <br className="hidden md:block" /><span className="text-[#7CC4F0]">{t.hero.headlineCantMake}</span>.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-2xl text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-normal">
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
                        : <StopCircle className="w-5 h-5 text-red-400 fill-current" />}
                    </div>
                  )}
                </div>
                <span className="text-[#7CC4F0] text-lg font-medium whitespace-nowrap leading-none">
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
