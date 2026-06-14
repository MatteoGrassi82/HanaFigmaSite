import image_77a7976bf5ac7a4d6dd84ca175d8ece4a749f268 from 'figma:asset/77a7976bf5ac7a4d6dd84ca175d8ece4a749f268.png';
import image_dd3b64b03ed0e3ccd7fa880ddc0aaa53dd304353 from 'figma:asset/dd3b64b03ed0e3ccd7fa880ddc0aaa53dd304353.png';
import { useState, useEffect, useRef } from "react";
import { Footer } from "../components/Footer";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SEO } from "../components/SEO";
import { breadcrumbSchema } from "../components/SEO";

const foundersImage = image_77a7976bf5ac7a4d6dd84ca175d8ece4a749f268;

// --- Animation Helper ---
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
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >{children}</div>
  );
}

// --- Data ---
const stats = [
  { label: "Patient Interactions", value: "1M+" },
  { label: "Weekly Engagement", value: "85%" },
  { label: "Countries", value: "5" },
  { label: "Clinic ROI", value: "31:1" },
];

const values = [
  {
    title: "Zero friction for patients",
    desc: "If it requires a download, a login, or a behavior change, it's already dead. We meet patients where they are: on the phone, in a conversation. No app. No portal. No burden."
  },
  {
    title: "Safety is not a feature",
    desc: "It's the foundation. Over one million patient interactions with zero critical adverse events. Every conversation is monitored, every escalation protocol is clinic-defined, every risk signal is caught."
  },
  {
    title: "Infrastructure, not applications",
    desc: "We don't build point solutions. We build the engagement layer that powers everything from intake to monitoring to adherence. Like electricity for patient communication."
  },
  {
    title: "Global by design",
    desc: "Healthcare protocols are universal. Incentives vary. We operate across five countries, three languages, and both public and private systems, adapting to each without rebuilding."
  },
  {
    title: "AI fills gaps, not jobs",
    desc: "We don't replace nurses and care teams. We put AI into the places where there's no one: missed calls, unmonitored hours, unasked questions. Everyone stays. Care gets better."
  },
  {
    title: "Outcomes over demos",
    desc: "We don't do flashy demos or vibe investing. We do 85% engagement, 96% completion rates, and 31:1 ROI. Boring, functional solutions that actually work. That's what healthcare needs."
  },
];

const timeline = [
  {
    title: "The app that nobody used",
    desc: "Matteo built a mental health monitoring app for patients with bipolar disorder. It collected sleep, activity, and mood data. Technically sound. Clinically useful. Engagement: abysmal."
  },
  {
    title: "The phone call that changed everything",
    desc: "What if we just called them? An AI voice agent that reached patients by phone and SMS. Engagement jumped to 85%. The problem was never the clinical protocol, it was the delivery mechanism."
  },
  {
    title: "From product to platform",
    desc: "Every clinic had different problems (intake, adherence, monitoring, outreach) but the underlying need was the same: continuous patient engagement. So we stopped building a product and started building infrastructure."
  },
  {
    title: "One million interactions later",
    desc: "HANA powers patient engagement across five countries, multiple languages, and every care setting from ADHD diagnostics to palliative care. Our reasoning model learns from every interaction."
  },
  {
    title: "Cutting the cord: fully open-source",
    desc: "Sthita led the migration off proprietary APIs entirely, moving HANA to open-source models on our own servers. No OpenAI. Full data sovereignty. Now we're testing on-premise installations for hospitals in Italy and sovereign cloud deployments in the Middle East. The future of healthcare AI is owned, not rented."
  }
];

const team = [
  { 
    name: "Matteo Grassi", 
    role: "CEO & Co-founder", 
    background: "3x founder. Clinical psychologist turned healthcare AI founder. 20 years scaling companies to $16M+ revenue. Built API headless commerce platform backed by Accel. Combines rare clinical credibility with proven commercial execution." 
  },
  { 
    name: "Sthita Pragyan Pujari", 
    role: "Co-founder & AI Lead", 
    background: "Voice AI and NLP expert. Built AI voice agents before the category existed. Experience at Honeywell and scaling Speech AI at Thumb Technologies. Architected Hana's proprietary two-model system (reasoning + speaking) that achieves 85% engagement vs. industry 15-20%." 
  },
  { 
    name: "Drew Mcusic, PhD", 
    role: "Co-founder & COO", 
    background: "VC operating partner (Chloe Capital). 15+ years in health tech. Former CTO at Theoria Medical building EHR, AI/ML tools, and value-based care infrastructure. PhD in Bioengineering. Based in Detroit, driving US market expansion." 
  },
  { 
    name: "Marco Massenzio", 
    role: "Head of Engineering", 
    background: "Ex-Meta, Ex-Google, Ex-Adobe. Built systems handling billions of requests. Kubernetes and cloud architecture expert. The senior technical horsepower behind Hana's scalable infrastructure." 
  },
  { 
    name: "Priyanshu Sinha", 
    role: "AI/NLP Engineer", 
    background: "7 patents in NLP and AI. Led conversational intelligence at Gojek (serving millions). Former Honeywell senior data scientist. Deep expertise in multi-turn dialogue systems, search, and applied AI research." 
  },
  { 
    name: "Ankit Nidhi Shroff", 
    role: "Full Stack Developer", 
    background: "5+ years building production AI platforms, real-time systems, and developer tooling. React, TypeScript, Node.js, Python. Previously built AI testing automation at scale. Clean architecture obsessed." 
  },
  { 
    name: "Brittany Tamang", 
    role: "Clinical Product Lead", 
    background: "10+ years in healthcare at Humana, public health, and clinical operations. Delivered $2M+ in pilot savings and 20% readmission reduction. Translates clinical workflows into product requirements." 
  },
  { 
    name: "Marco Margotto", 
    role: "Founding Growth", 
    background: "Psychology student building at the intersection of tech and mental health. Previously co-founded travel-tech startup, ran growth for ESG consultancy. Italy-based, driving European expansion and thought leadership." 
  },
  { 
    name: "Dan Noyes", 
    role: "Strategic Advisor", 
    background: "Healthcare AI Strategist with 40+ certifications from Stanford, Johns Hopkins, Wharton, Google, IBM. Author of \"Subjects to Sovereigns: Reclaiming Medicine in the Age of AI.\" Survived a near-fatal medical error. Brings the patient perspective VCs rarely see on founding teams." 
  }
];

export function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title="About Us"
        description="Meet the team behind Hana Voice AI. Founded by clinical experts and engineers to build the infrastructure for continuous patient engagement through AI voice agents."
        path="/about"
        keywords="Hana Health team, healthcare AI company, clinical AI founders, voice AI startup, healthcare technology company"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "About", url: "https://www.hana.health/about" }
        ])}
      />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 sm:pt-24 sm:pb-20 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block">About Hana</span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-8 md:leading-tight">
              We're building the care infrastructure for the hours between visits.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Healthcare works for the 15-minute appointment. We're solving the 10,000 hours that come after, with AI that listens, adapts, and keeps patients connected to their care.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Founders Story */}
      <section className="py-20 px-6 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <FadeIn className="order-2 lg:order-1">
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-8">Founders' Story</h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-900">Matteo Grassi</strong>, 3× founder and clinical psychologist. Built an app to monitor patients with bipolar disorder. The tech worked. Engagement didn't. So he threw out the app and called patients directly with AI. Engagement went from 15% to 85%. The problem was never the protocol, it was the delivery.
              </p>
              <p>
                <strong className="text-slate-900">Sthita Pragyan Pujari</strong> was building AI voice agents before voice AI was a category. Ex-Honeywell, scaled Speech AI at Thumb Technologies. Architected HANA's dual-model system, a reasoning engine that thinks before every call, a voice model that speaks, then led the full migration to open-source, self-hosted infrastructure. No OpenAI. No vendor lock-in.
              </p>
              <p>
                Together, they stopped building another healthcare app and started building the infrastructure that powers all of them.
              </p>
              <blockquote className="border-l-4 border-blue-600 pl-6 italic text-slate-800 text-xl my-8">
                "While everyone was building cars, we wanted to build roads."
              </blockquote>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} className="order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-blue-100">
               <img src={foundersImage} alt="Matteo Grassi and Sthita Pragyan Pujari" className="w-full h-auto object-cover" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif mb-2 text-blue-400">{stat.value}</div>
                <div className="text-sm md:text-base font-medium text-slate-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 lg:py-24 px-6 max-w-7xl mx-auto">
        <FadeIn>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-16 text-center">Our Values</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 sm:gap-x-12 sm:gap-y-16">
          {values.map((val, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Timeline - How We Got Here */}
      <section className="py-16 sm:py-20 lg:py-24 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-12 sm:mb-20 text-center">How We Got Here</h2>
          </FadeIn>
          
          <div className="relative w-full">
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-5 gap-8">
               {timeline.map((item, i) => (
                   <FadeIn 
                     key={i} 
                     delay={i * 0.1} 
                     className="relative flex flex-col items-center text-center h-full"
                   >
                      {/* Connecting Line */}
                      {i < timeline.length - 1 && (
                        <div className="absolute top-0 left-1/2 w-[calc(100%+2rem)] h-0.5 bg-blue-100 -translate-y-1/2 -z-10" aria-hidden="true" />
                      )}

                      {/* Content Card */}
                      <div className="relative z-10 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 w-full group h-full flex flex-col">
                        {/* Number/Icon Bubble */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-blue-600 shadow-sm transition-transform group-hover:scale-110">
                           <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                        
                        <div className="pt-4 flex-1 flex flex-col justify-center">
                          <h3 className="font-semibold text-slate-900 mb-3 text-lg leading-tight">{item.title}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                   </FadeIn>
               ))}
            </div>

            {/* Mobile Vertical Layout */}
            <div className="md:hidden space-y-8 relative pl-12">
               {/* Continuous Line */}
               <div className="absolute top-2 bottom-0 left-6 w-0.5 bg-blue-100 -translate-x-1/2" />
               
               {timeline.map((item, i) => (
                 <FadeIn key={i} delay={i * 0.1}>
                    <div className="relative">
                       {/* Dot */}
                       <div className="absolute top-6 -left-6 w-8 h-8 rounded-full border-4 border-slate-50 bg-blue-600 shadow-sm z-10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                       </div>
                       
                       {/* Card */}
                       <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                          <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                 </FadeIn>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Where We're Going */}
      <section className="py-16 sm:py-20 lg:py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#3b82f6_0%,_transparent_50%)]"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Where We're Going</h2>
              <p className="text-xl md:text-2xl text-blue-200 font-light">Open source. Self-hosted. Healthcare AI that you actually own.</p>
            </div>
          </FadeIn>
          
          <div className="space-y-8 text-lg text-slate-300 leading-relaxed mb-12">
            <FadeIn delay={0.1}>
              <p>
                Six months ago, we made a decision that changed our trajectory: we moved off OpenAI entirely. We migrated HANA to open-source models running on our own servers. No proprietary API dependency. No patient data leaving your jurisdiction. Full sovereignty.
              </p>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
               <FadeIn delay={0.2}>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                     <h3 className="text-white font-semibold text-lg mb-3">Open-Source Models</h3>
                     <p className="text-sm">We run Llama 3.1 and other OSS models on our own infrastructure. Our reasoning engine doesn't depend on any single foundation model provider.</p>
                  </div>
               </FadeIn>
               <FadeIn delay={0.3}>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                     <h3 className="text-white font-semibold text-lg mb-3">Data Sovereignty</h3>
                     <p className="text-sm">Patient data stays where it belongs. Our European servers handle GDPR. Our architecture supports region-locked cloud infrastructure.</p>
                  </div>
               </FadeIn>
               <FadeIn delay={0.4}>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                     <h3 className="text-white font-semibold text-lg mb-3">On-Premise Installation</h3>
                     <p className="text-sm">For hospitals running mainframes and sovereign clouds, we're testing on-premise deployments. Your infrastructure, our intelligence.</p>
                  </div>
               </FadeIn>
               <FadeIn delay={0.5}>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                     <h3 className="text-white font-semibold text-lg mb-3">The Data Flywheel</h3>
                     <p className="text-sm">Every interaction makes the model smarter. Over one million patient conversations have trained our reasoning engine on clinical nuance.</p>
                  </div>
               </FadeIn>
            </div>

            <FadeIn delay={0.6}>
              <p className="mt-12 text-center text-xl font-serif italic text-white/90">
                "We believe the future of healthcare AI is open, sovereign, and owned by the institutions that serve patients, not locked behind proprietary APIs."
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20 lg:py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
             <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-16 text-center">Meet the Team</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full relative overflow-hidden group">
                  <div className="flex flex-col h-full">
                     <div className="flex justify-between items-start mb-4 gap-4">
                       <div>
                          <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wide">{member.role}</span>
                       </div>
                     </div>
                     <p className="text-slate-600 text-sm leading-relaxed">{member.background}</p>
                  </div>
                </div>
              </FadeIn>
            ))}

            {/* Hiring CTA Card */}
            <FadeIn delay={team.length * 0.05}>
                <div className="bg-blue-600 p-8 rounded-2xl border border-blue-500 shadow-lg hover:shadow-xl transition-shadow h-full relative overflow-hidden group flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-serif text-white mb-4">Want to join the team?</h3>
                    <a 
                      href="https://calendly.com/matteowastaken/discoverycall"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors"
                    >
                      Connect with Matteo <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24 px-6 bg-white border-t border-slate-200">
         <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
               <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6">Let's close the engagement gap together</h2>
               <p className="text-xl text-slate-600 mb-10">Whether you're a clinic, a platform, or a health system, we'd love to talk.</p>
               <a 
                 href="https://calendly.com/matteowastaken/discoverycall" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-lg hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-600/20 transform hover:-translate-y-0.5"
               >
                 Book a conversation <ArrowRight className="w-4 h-4" />
               </a>
            </FadeIn>
         </div>
      </section>

      <Footer />
    </div>
  );
}