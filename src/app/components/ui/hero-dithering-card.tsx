import { Star, Loader2, StopCircle, Play } from "lucide-react";
import { useState, Suspense, lazy } from "react";
import { cn } from "../../../lib/utils";
import VoiceWave from "../../../assets/hana-orb.webp";
import { useTranslations } from "../../../lib/i18n";

// Lazy load the heavy shader component with error handling
const Dithering = lazy(() => 
  import('@paper-design/shaders-react')
    .then(module => ({ default: module.Dithering }))
    .catch(() => ({ default: () => <div className="absolute inset-0 bg-blue-50/50" /> }))
);

interface CTASectionProps {
  onStartCall?: () => void;
  isConnecting?: boolean;
  isActive?: boolean;
  disabled?: boolean;
}

export function CTASection({ onStartCall, isConnecting = false, isActive = false, disabled = false }: CTASectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations();

  const handleDemoClick = () => {
    // If the demo is already active or connecting, we might want to let the user end it or view it.
    // If it is NOT active/connecting, scroll to the demo section.
    if (!isActive && !isConnecting) {
      const demoSection = document.getElementById("live-demo-section");
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback if the section isn't on the page (e.g. if we are on a different route in the future)
        // But for now, we assume it is on the page.
        if (onStartCall) onStartCall();
      }
    } else if (onStartCall) {
      // If it IS active, maybe the button should end it? 
      // The button label changes to "End Demo", so clicking it should trigger the action.
      onStartCall();
    }
  };

  return (
    <section className="relative w-full flex justify-center items-center bg-[#00122F]">
      <div 
        className="w-full relative overflow-hidden min-h-[90dvh] md:min-h-[850px] flex flex-col items-center justify-center transition-colors duration-500 pt-10 pb-20 md:py-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background — gradient from slate-50 → navy so mix-blend-multiply
            on the dithering shader naturally darkens toward the loop section */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(to bottom, #f8fafc 0%, #00122F 100%)" }}
        >
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] rounded-[100%] bg-blue-200/40 blur-[120px]" />
        </div>

        {/* Animated Shader Background */}
        <Suspense fallback={<div className="absolute inset-0 bg-blue-50" />}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply">
            <Dithering
              colorBack="#f8fafc" // Slate-50 (Background)
              colorFront="#A7BCF5" // Lighter Blue Accent
              shape="warp"
              type="4x4"
              speed={isHovered ? 0.6 : 0.2}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 flex flex-col justify-center pointer-events-none">

          <div className="flex flex-col items-center text-center z-20 pointer-events-auto max-w-5xl mx-auto">
             {/* Peel badge */}
             <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
               <span className="text-sm font-medium text-slate-700 tracking-wide">{t.hero.builtByClinicians}</span>
             </div>

             {/* Headline */}
             <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-normal text-slate-900 mb-6 md:mb-8 leading-[1.1]">
               {t.hero.headline} <br className="hidden md:block"/><span className="text-blue-600">{t.hero.headlineCantMake}</span>.
             </h1>

             {/* Subheadline */}
             <p className="text-base sm:text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-normal">
               {t.hero.subheadline}
             </p>

             {/* CTAs */}
             <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-auto mx-auto">
                <button
                   onClick={handleDemoClick}
                   disabled={isConnecting || disabled}
                   className="group relative flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-full p-2 pr-6 transition-all duration-300 w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                   <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-inner ring-1 ring-black/5 group-hover:ring-blue-500/20 transition-all bg-[#00122F] shrink-0">
                      <img
                        src={VoiceWave}
                        alt="Voice Wave"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                      />
                      {(isConnecting || isActive) && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                           {isConnecting ? (
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                           ) : (
                              <StopCircle className="w-5 h-5 text-red-500 fill-current" />
                           )}
                        </div>
                      )}
                   </div>
                   <div className="text-left flex flex-col justify-center">
                      <span className="text-blue-600 text-lg font-medium whitespace-nowrap leading-none">
                         {isActive ? t.hero.endDemo : isConnecting ? t.hero.connecting : t.hero.talkToHana}
                      </span>
                   </div>
                </button>

                <a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="inline-block px-6 sm:px-8 py-4 bg-white text-slate-900 rounded-full font-medium text-base sm:text-lg hover:bg-slate-50 transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-slate-200 text-center whitespace-nowrap">
                    {t.hero.bookDemo}
                </a>

             </div>
          </div>
        </div>
      </div>
    </section>
  );
}