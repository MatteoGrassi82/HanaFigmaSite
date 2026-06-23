import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Player, type PlayerRef } from '@remotion/player';
import { WorkflowBuilderComp } from './remotion/WorkflowBuilderComp';
import { SafetyMonitorComp } from './remotion/SafetyMonitorComp';
import { PatientContextComp } from './remotion/PatientContextComp';
import { getLocale } from '../../lib/i18n';

/* Shared <Player> render for a homepage demo slide. The compositions are
   900x506 (≈16:9), so they fill the carousel's aspect-video frame cleanly.
   Loop, no controls, no audio — these are silent visual animations.

   Autoplay rules:
   - The Player is `initiallyMuted` + `autoPlay`, which is what lets it start
     without a user gesture on mobile (browsers block UN-muted programmatic
     play). Our comps have no audio, so muting is free.
   - We still gate on IntersectionObserver so off-screen slides stay paused
     (Core Web Vitals — don't burn CPU animating canvases the user can't see).
   - Every IN-VIEW slide plays, not just the carousel's "current" index. The
     carousel shows ~1.4 slides, so the peeking next slide is visible and
     should animate too. This is the fix for "the second video doesn't play."
   - We retry play() on a short delay because Remotion's play() can no-op if
     called before the player has fully mounted. */
function DemoPlayer({
  component,
  durationInFrames,
}: {
  component: React.ComponentType;
  durationInFrames: number;
}) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Animate only when this slide is actually on screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drive play/pause off visibility. Retry once shortly after, in case the
  // player mounted a beat after this effect ran (common on mobile / slick).
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const drive = () => {
      const p = playerRef.current;
      if (!p) return;
      if (inView) {
        try {
          p.mute();
          p.play();
        } catch {
          /* not interactive yet */
        }
      } else {
        try {
          p.pause();
        } catch {
          /* noop */
        }
      }
    };
    drive();
    if (inView) timer = setTimeout(drive, 400);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [inView]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Player
        ref={playerRef}
        component={component}
        durationInFrames={durationInFrames}
        compositionWidth={900}
        compositionHeight={506}
        fps={30}
        style={{ width: '100%', height: '100%' }}
        loop
        autoPlay
        initiallyMuted
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
      />
    </div>
  );
}

export function AgenticFrameworkCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const [expandedSlide, setExpandedSlide] = useState<number | null>(null);

  const it = getLocale() === "it";
  const slides = it
    ? [
        {
          id: 1,
          title: "I tuoi flussi. Non i nostri.",
          description: "Nessuna clinica lavora allo stesso modo. Scegli tra 100+ flussi già pronti o costruiamo i tuoi — abbastanza strutturati da restare sul protocollo, abbastanza flessibili da gestire qualsiasi cosa.",
          component: WorkflowBuilderComp,
          durationInFrames: 510,
        },
        {
          id: 2,
          title: "I Tuoi Protocolli, Linee Guida e Documenti Sempre Attivi",
          description: "Carica i tuoi documenti clinici, le regole sui farmaci e le politiche di escalation. L'agente non li archivia soltanto: li consulta a ogni interazione, così non sfugge nulla.",
          component: SafetyMonitorComp,
          durationInFrames: 390,
        },
        {
          id: 3,
          title: "Un'AI Che Conosce i Tuoi Pazienti e Migliora nel Tempo",
          description: "Ogni interazione aggiunge contesto. Canale preferito, orario migliore per raggiungerli, conversazioni passate, stato di cura. Che sia una chiamata, un messaggio o un promemoria, l'agente porta tutto con sé, così ogni contatto risulta personale.",
          component: PatientContextComp,
          durationInFrames: 390,
        },
      ]
    : [
    {
      id: 1,
      title: "Your workflows. Not ours.",
      description: "No two clinics work the same. Pick from 100+ pre-built workflows or we build yours — structured enough to stay on protocol, flexible enough to handle anything.",
      component: WorkflowBuilderComp,
      durationInFrames: 510,
    },
    {
      id: 2,
      title: "Your Protocols, Guidelines & Documents Always On",
      description: "Upload your clinical documents, medication rules, and escalation policies. The agent doesn't just store them it references them across every interaction, so nothing gets missed.",
      component: SafetyMonitorComp,
      durationInFrames: 390,
    },
    {
      id: 3,
      title: "An AI That Knows Your Patients And Gets Better Over Time",
      description: "Every interaction adds context. Preferred channel, best time to reach them, past conversations, care status. Whether it's a call, a text, or a reminder the agent carries it all forward so every touchpoint feels personal.",
      component: PatientContextComp,
      durationInFrames: 390,
    }
  ];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.4, // Show 1 full slide + 40% of the next
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    draggable: true, // mouse click-and-drag on desktop
    touchThreshold: 10,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  const handleSlideClick = (slideId: number) => {
    // Only open modal on mobile
    if (window.innerWidth < 768) {
      setExpandedSlide(slideId);
    }
  };

  const expandedSlideData = expandedSlide !== null ? slides.find(s => s.id === expandedSlide) : null;

  return (
    <section className="py-16 md:py-24 bg-[#F5F5F5] dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-normal text-slate-900 dark:text-white max-w-2xl leading-[1.1]">
            {it ? "Costruito su come lavora la tua clinica." : "Built around how your clinic works."}
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed md:mt-4 font-sans">
            {it ? "Dai flussi semplici ai percorsi di cura complessi. Attivo in 3 settimane." : "Simple workflows to complex care pathways. Live in 3 weeks."}
          </p>
        </div>

        {/* Carousel */}
        <div className="-mx-4 md:-mx-8 overflow-x-clip"> {/* Negative margin to allow slider to touch edges; overflow-x-clip stops the de-emphasized peeking slide from bleeding past the viewport (body uses overflow-x:clip) while preserving the desktop peek inside the wrapper */}
            <Slider ref={sliderRef} {...settings} className="agentic-carousel pl-4 md:pl-0">
            {slides.map((slide, index) => (
                <div key={slide.id} className="px-1.5 md:px-6 focus:outline-none h-full">
                <div className="group h-full flex flex-col">
                    {/* Image Container with Light Gray Border/Background */}
                    <div 
                      className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 p-1 shadow-lg cursor-pointer md:cursor-grab md:active:cursor-grabbing"
                      onClick={() => handleSlideClick(slide.id)}
                    >
                        {/* Mobile tap hint */}
                        <div className="absolute top-3 right-3 z-10 md:hidden bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-white/80">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                        {/* Inner live Remotion demo */}
                        <div className="w-full h-full rounded-lg overflow-hidden bg-white dark:bg-slate-900 relative pointer-events-none">
                            <DemoPlayer
                                component={slide.component}
                                durationInFrames={slide.durationInFrames}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-8">
                        <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-3">
                            {slide.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base max-w-xl">
                            {slide.description}
                        </p>
                    </div>
                </div>
                </div>
            ))}
            </Slider>
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 md:mt-12 flex items-center gap-3 md:gap-6">
            <div className="flex gap-3">
                <button 
                    onClick={previous}
                    disabled={currentSlide === 0}
                    className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label={it ? "Slide precedente" : "Previous slide"}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={next}
                    disabled={currentSlide === slides.length - 1}
                    className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                    aria-label={it ? "Slide successiva" : "Next slide"}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            
            {/* Page Indicator */}
            <div className="flex items-center gap-3 text-sm font-medium tracking-widest select-none">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => sliderRef.current?.slickGoTo(index)}
                        className={cn(
                            "transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center",
                            currentSlide === index
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                        )}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

             {/* Horizontal Line */}
             <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-2 md:ml-4" />
        </div>

      </div>
      
      {/* Mobile Expanded View Modal */}
      {expandedSlideData && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col md:hidden"
          onClick={() => setExpandedSlide(null)}
        >
          {/* Close button */}
          <div className="flex justify-between items-center p-4">
            <span className="text-white/60 text-sm font-medium">
              {expandedSlideData.title}
            </span>
            <button 
              onClick={() => setExpandedSlide(null)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Full-width live demo */}
          <div className="flex-1 flex items-center px-2" onClick={(e) => e.stopPropagation()}>
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900">
              <DemoPlayer
                component={expandedSlideData.component}
                durationInFrames={expandedSlideData.durationInFrames}
              />
            </div>
          </div>

          {/* Description */}
          <div className="p-4 pb-8">
            <p className="text-white/70 text-sm leading-relaxed">
              {expandedSlideData.description}
            </p>
          </div>

          {/* Slide dots */}
          <div className="flex justify-center gap-2 pb-6">
            {slides.map((s) => (
              <button
                key={s.id}
                onClick={(e) => { e.stopPropagation(); setExpandedSlide(s.id); }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  expandedSlide === s.id 
                    ? "bg-white w-6" 
                    : "bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* CSS Override */}
      <style>{`
        .slick-list {
            overflow: visible !important;
        }
        .agentic-carousel .slick-slide {
            opacity: 0.4;
            transition: opacity 0.5s ease;
        }
        .agentic-carousel .slick-slide.slick-active {
            opacity: 1;
        }
      `}</style>
    </section>
  )
}