import { useState, useEffect, useRef } from "react";
import { Footer } from "../components/Footer";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SEO } from "../components/SEO";
import { breadcrumbSchema } from "../components/SEO";

const publications = [
  {
    id: 1,
    title: "Voice in Parkinson's disease: a machine-learning study",
    description: "Machine learning models detect Parkinson's-related voice changes even in early stages. Using 115 patients and 108 controls, algorithms differentiated early vs. mid-advanced PD and quantified therapy effects. L-dopa improved but did not fully restore vocal quality. Demonstrates how non-invasive voice monitoring allows continuous tracking and personalized care for patients.",
    journal: "Frontiers",
    articleUrl: "https://www.frontiersin.org/journals/neurology/articles/10.3389/fneur.2022.831428/full",
  },
  {
    id: 2,
    title: "Artificial-intelligence-based voice assessment of patients with Parkinson's disease off and on treatment: machine vs. deep-learning comparison",
    description: "Compared traditional ML (k-NN, SVM, Naive Bayes) and deep learning (CNN) approaches for PD voice assessment. Both achieved comparable accuracy, with CNN slightly ahead, across vocal parameters including jitter, shimmer, and harmonic-to-noise ratio. AI-powered voice monitoring enables remote feedback loops between patients and clinicians, enhancing engagement.",
    journal: "Sensors",
    articleUrl: "https://www.mdpi.com/1424-8220/23/4/2293",
  },
  {
    id: 3,
    title: "Voice biomarkers for detecting depression",
    description: "Acoustic markers (pitch variability, tempo, pauses) correlate with depression severity. CNN and LSTM achieved up to 90% accuracy. Enables continuous mental health monitoring through voice AI.",
    journal: "IEEE",
    articleUrl: "https://academic.oup.com/jamia/article/31/10/2394/7715014",
  },
  {
    id: 4,
    title: "Conversational agents in healthcare: scoping review",
    description: "Across 17 studies, voice-enabled agents improved adherence and self-management in chronic conditions. Noted design gaps: patient trust and engagement.",
    journal: "JAMIA",
    articleUrl: "https://academic.oup.com/jamia/article/25/9/1248/5052181",
  },
  {
    id: 5,
    title: "Voice biomarkers predict hospital readmission in heart failure",
    description: "ML models trained on HF patients achieved AUC 0.80 for readmission prediction. Voice AI monitoring supports proactive outreach and early intervention.",
    journal: "Yonsei",
    articleUrl: "https://www.ahajournals.org/doi/10.1161/JAHA.119.013359",
  },
  {
    id: 6,
    title: "Voice-based conversational agents for older adults",
    description: "Virtual health counselors maintained weekly interaction for 6 weeks, improving adherence and mood. Shows how medical voice agents enable patient engagement among elderly users.",
    journal: "JMIR",
    articleUrl: "https://www.jmir.org/2021/3/e25933",
  },
  {
    id: 7,
    title: "AI and vocal biomarkers of cognitive decline",
    description: "Recurrent neural networks identified mild cognitive impairment with >80% accuracy. Voice as an early screening tool for neurodegenerative diseases.",
    journal: "IEEE",
    articleUrl: "https://www.nature.com/articles/s41598-025-96575-6",
  },
  {
    id: 8,
    title: "Patient engagement through voice-enabled virtual assistants",
    description: "Meta-based chronic disease evidence-based medication adherence by 19%. Validates voice AI as a home-based adherence enabler.",
    journal: "JMIR",
    articleUrl: "https://www.jmir.org/2022/10/e39243",
  },
  {
    id: 9,
    title: "Detecting anxiety via voice and speech patterns",
    description: "CNN-RNN hybrid achieved >85% accuracy in identifying anxiety states. Voice AI can flag distress for adaptive support.",
    journal: "Sensors",
    articleUrl: "https://www.mdpi.com/1424-8220/20/1/183",
  },
  {
    id: 10,
    title: "The promise of voice in healthcare: ambient clinical intelligence and patient experience",
    description: "Reviews how voice AI streamlines documentation and boosts near-time empathy signals. Voice as the core engagement tool, unifying patients and providers.",
    journal: "NPJ",
    articleUrl: "https://www.ahajournals.org/doi/10.1161/CIRCHEARTFAILURE.124.012303",
  },
];

const capabilities = [
  "Voice analysis + NLP + interaction models, synchronized in real time",
  "Adaptive engagement: loop that continuously refines patient baselines",
  "Federated learning architecture for privacy-preserving insight",
  "Clinically aligned insights, generated automatically and at scale",
  "Patient-grading framework: designed to set a new standard in care engagement",
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >{children}</div>
  );
}

function PublicationRow({ pub, isLast, index }: { pub: any, isLast: boolean, index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={Math.min(index * 0.04, 0.25)}>
      <div className="group">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_0.5fr_auto] gap-6 md:gap-10 items-start py-10 md:py-12">
          <h3 className="text-xl font-medium leading-tight text-slate-900 group-hover:text-blue-700 transition-colors">
            {pub.title}
          </h3>
          <p className="text-base leading-relaxed text-slate-600 font-normal">
            {pub.description}
          </p>
          <div className="flex items-center justify-start md:justify-center min-h-[40px]">
            <span className="font-serif text-3xl italic text-slate-400 group-hover:text-slate-900 transition-colors">
              {pub.journal}
            </span>
          </div>
          <div className="flex items-center">
            <a 
              href={pub.articleUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 border border-slate-200 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 whitespace-nowrap"
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
            >
              Read Article <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        {!isLast && <div className="h-px w-full bg-slate-200" />}
      </div>
    </FadeIn>
  );
}

export function Research() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title="Research"
        description="Explore the clinical research and publications behind Hana Voice AI. Advancing conversational AI in healthcare with voice biomarkers, patient engagement studies, and adaptive engagement technology."
        path="/research"
        keywords="clinical AI research, voice biomarkers, healthcare AI publications, conversational AI healthcare, patient engagement research, voice analysis machine learning"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://hanavoice.ai/" },
          { name: "Research", url: "https://hanavoice.ai/research" }
        ])}
      />
      {/* Hero Section */}
      <section className="pt-20 pb-20 md:pt-32 md:pb-24 px-6 relative bg-slate-50 overflow-hidden">
        {/* Abstract background blobs to match homepage feel */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] rounded-[100%] bg-blue-100/30 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
           <FadeIn>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-slate-900 mb-8 leading-[1.05]">
                 Advancing Conversational AI <br/> in Healthcare
              </h1>
           </FadeIn>
           <FadeIn delay={0.1}>
             <div className="space-y-6 max-w-2xl mx-auto">
                <p className="text-xl text-slate-600 leading-relaxed">
                   At Hana, we're pioneering research into how conversational AI can transform patient engagement and care delivery. Our mission is to investigate the complex dynamics of human-AI interaction in healthcare contexts.
                </p>
                <p className="text-xl text-slate-600 leading-relaxed">
                   We focus on fundamental questions: How can AI systems detect subtle changes in patient health through voice? What engagement patterns lead to sustained behavior change?
                </p>
             </div>
           </FadeIn>
        </div>
      </section>

      {/* Adaptive Engagement Engine Section */}
      <section className="py-24 bg-white border-y border-slate-200/60">
         <div className="max-w-3xl mx-auto px-6 text-center">
             <FadeIn>
               <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6 tracking-tight">
                  The Adaptive Engagement Engine
               </h2>
             </FadeIn>
             <FadeIn delay={0.1}>
               <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
                  Our proprietary multi-model intelligence system translates research into practice by continuously monitoring conversations, analyzing vocal biomarkers, and adapting engagement in real time.
               </p>
             </FadeIn>
             
             {/* Capabilities List - Centered */}
             <FadeIn delay={0.2}>
               <div className="bg-slate-50 rounded-2xl p-8 md:p-10 border border-slate-100 mb-10 text-left shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 text-center">Core Capabilities</h3>
                  <div className="grid gap-4">
                      {capabilities.map((cap, i) => (
                         <div key={i} className="flex items-start gap-3">
                            <div className="mt-1 min-w-[20px]"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
                            <span className="text-slate-700 font-medium">{cap}</span>
                         </div>
                      ))}
                  </div>
               </div>
             </FadeIn>

             {/* Link to Docs */}
             <FadeIn delay={0.3}>
               <a 
                 href="https://docs.hana.health/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-lg hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-600/20 transform hover:-translate-y-0.5"
               >
                  Read the Technical Documentation <ArrowRight className="w-4 h-4" />
               </a>
             </FadeIn>
         </div>
      </section>

      {/* Publications Section */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-6xl mx-auto px-6">
             <div className="text-center mb-20 max-w-3xl mx-auto">
                 <FadeIn>
                   <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6">Publications</h2>
                   <p className="text-xl text-slate-600">Discover the research and clinical evidence foundational to our products</p>
                 </FadeIn>
             </div>
             
             <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-sm border border-slate-100/80">
                 {publications.map((pub, i) => (
                   <PublicationRow key={pub.id} pub={pub} isLast={i === publications.length - 1} index={i} />
                 ))}
             </div>
         </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}