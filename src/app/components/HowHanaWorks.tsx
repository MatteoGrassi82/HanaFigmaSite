"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { cn } from "../../lib/utils";
import { CheckCircle2, Play, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, getLocale } from "../../lib/i18n";
import { Player, type PlayerRef } from "@remotion/player";
import { WorkflowBuilderComp } from "./remotion/WorkflowBuilderComp";
import { SafetyMonitorComp } from "./remotion/SafetyMonitorComp";

// Add TypeScript declaration for custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'media-id': string;
        aspect?: string;
      };
    }
  }
}

// Memoized Wistia Player Component
const WistiaPlayer = memo(({ videoId }: { videoId: string }) => {
  useEffect(() => {
    // Only load the main player script once
    if (!document.querySelector('script[src*="fast.wistia.com/player.js"]')) {
      const script = document.createElement("script");
      script.src = "https://fast.wistia.com/player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Load video specific data
    const videoScriptId = `wistia-video-${videoId}`;
    if (!document.getElementById(videoScriptId)) {
        const script = document.createElement("script");
        script.id = videoScriptId;
        script.src = `https://fast.wistia.com/embed/${videoId}.js`;
        script.async = true;
        script.type = "module";
        document.body.appendChild(script);
    }
  }, [videoId]);

  // Using a simpler style approach to avoid hydration issues
  const swatchUrl = `https://fast.wistia.com/embed/medias/${videoId}/swatch`;

  return (
    <div className="w-full h-full relative group">
      {/* Background swatch as a fallback/placeholder */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-0"
        style={{ backgroundImage: `url(${swatchUrl})` }}
      />
      
      {/* The Wistia Player Custom Element */}
      <div className="relative z-10 w-full h-full">
         <wistia-player 
            media-id={videoId} 
            aspect="1.7777777777777777"
            suppressHydrationWarning
            style={{ width: '100%', height: '100%' }}
         ></wistia-player>
      </div>
    </div>
  );
});

WistiaPlayer.displayName = "WistiaPlayer";

// Remotion-based animated player (used on Italian locale instead of Wistia).
// Indexed by slide position, so it must stay the same length as SLIDES.
const REMOTION_SLIDES = [
  { component: WorkflowBuilderComp, durationInFrames: 510 },
  { component: SafetyMonitorComp,    durationInFrames: 390 },
];

function DemoPlayer({ component, durationInFrames }: { component: React.ComponentType; durationInFrames: number }) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const drive = () => {
      const p = playerRef.current;
      if (!p) return;
      try { if (inView) { p.mute(); p.play(); } else { p.pause(); } } catch { /* noop */ }
    };
    drive();
    if (inView) t = setTimeout(drive, 400);
    return () => { if (t) clearTimeout(t); };
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
        style={{ width: "100%", height: "100%" }}
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

export function HowHanaWorks() {
  const t = useTranslations();
  const hw = t.howHanaWorks;
  const isItalian = getLocale() === "it";
  const SLIDES = [
    {
      id: "first-week",
      label: hw.tab2,
      icon: Play,
      title: hw.tab2SubHeading,
      description: hw.tab2Body,
      videoId: "cn9zvmqv80",
      features: [hw.tab2f1, hw.tab2f2, hw.tab2f3],
    },
    {
      id: "monitoring",
      label: hw.tab1,
      icon: Activity,
      title: hw.tab1SubHeading,
      description: hw.tab1Body,
      videoId: "hf22mhjxbe",
      features: [hw.tab1f1, hw.tab1f2, hw.tab1f3],
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1.4,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchThreshold: 8,
    cssEase: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.15,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.08,
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

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#F5F5F5] dark:bg-slate-950 w-full overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white leading-[1.1]">
              {hw.headingPrefix} <span className="text-blue-600 italic">{hw.headingEmphasis}</span>
            </h2>
          </div>
          
          {/* Navigation Controls (Top Right) - Desktop */}
          {/* Moved below carousel */}
        </div>

        {/* Carousel */}
        <div className="-mx-4 md:-mx-8">
            <Slider ref={sliderRef} {...settings} className="hana-carousel pl-4 md:pl-0">
                {SLIDES.map((slide, slideIndex) => (
                    <div key={slide.id} className="px-2 md:px-4 focus:outline-none h-full">
                         <div className="group flex flex-col h-full">
                            {/* Visual Container (The Card) */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 p-1 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
                                <div className="w-full h-full rounded-lg overflow-hidden bg-slate-900 relative">
                                    {isItalian ? (
                                      <DemoPlayer
                                        component={REMOTION_SLIDES[slideIndex].component}
                                        durationInFrames={REMOTION_SLIDES[slideIndex].durationInFrames}
                                      />
                                    ) : (
                                      <WistiaPlayer videoId={slide.videoId} />
                                    )}
                                </div>
                            </div>

                            {/* Content - Compact */}
                            <div className="mt-4 md:mt-5">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                                      <slide.icon size={16} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white leading-tight">
                                        {slide.title}
                                    </h3>
                                </div>

                                {/* Features as inline tags */}
                                <div className="flex flex-wrap gap-2">
                                    {slide.features.map((feature, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700"
                                        >
                                            <CheckCircle2 size={12} className="text-blue-500 flex-shrink-0" />
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                         </div>
                    </div>
                ))}
            </Slider>
        </div>

        {/* Navigation Controls - All screens */}
        <div className="mt-6 md:mt-12 flex items-center gap-4 md:gap-6">
            <div className="flex gap-3">
                <button 
                    onClick={previous}
                    disabled={currentSlide === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label={hw.prevSlide}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={next}
                    disabled={currentSlide === SLIDES.length - 1}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                    aria-label={hw.nextSlide}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            
            {/* Page Indicator */}
            <div className="flex items-center gap-3 text-sm font-medium tracking-widest select-none">
                {SLIDES.map((_, index) => (
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
             <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4" />
        </div>

      </div>
      
      {/* CSS Override */}
      <style>{`
        .slick-list {
            overflow: visible !important;
        }
        .hana-carousel .slick-slide {
            opacity: 0.4;
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .hana-carousel .slick-slide.slick-active {
            opacity: 1;
        }
        .hana-carousel .slick-track {
            display: flex !important;
            align-items: stretch;
        }
        .hana-carousel .slick-slide > div {
            height: 100%;
        }
        @media (max-width: 768px) {
            .hana-carousel .slick-slide {
                opacity: 0.5;
            }
            .hana-carousel .slick-slide.slick-active {
                opacity: 1;
            }
        }
      `}</style>
    </section>
  );
}