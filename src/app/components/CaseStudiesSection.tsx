import image_f650da2227696c54cef0e7df2c6156528919b7ef from 'figma:asset/f650da2227696c54cef0e7df2c6156528919b7ef.png';
import image_79f9f204476e9693a3b2efedb57797a6f4a0fa38 from 'figma:asset/79f9f204476e9693a3b2efedb57797a6f4a0fa38.png';
import image_15b8b08ff934107140826361e6e3912f69618bae from 'figma:asset/15b8b08ff934107140826361e6e3912f69618bae.png';
import { Play, Quote } from "lucide-react";

interface CaseStudy {
  id: string;
  quote: string;
  author?: {
    name: string;
    role: string;
    avatarUrl: string;
    logoUrl?: string;
    logoBg?: string;
    isDarkLogo?: boolean;
  };
  image: string;
  theme: "dark" | "peach" | "blue";
  hasVideo?: boolean;
  cta?: string;
  videoCta?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "shoorah",
    quote: "We're partnering exclusively with Hana in the UK because their reasoning models are fundamentally different from everyone else, positioning us with the strongest AI powered care coordination offering as we scale together.",
    image: image_f650da2227696c54cef0e7df2c6156528919b7ef,
    theme: "dark",
    author: {
        name: "Lorri Hanes",
        role: "Shoorah",
        avatarUrl: "https://images.unsplash.com/photo-1758518727592-706e80ebc354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwZXhlY3V0aXZlJTIwbW9kZXJuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwNDEyOTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        logoUrl: "SHOORAH",
        logoBg: "bg-white",
        isDarkLogo: true
    }
  },
  {
    id: "penry",
    quote: "The Hana team understood that quality assessments require both consistency and flexibility. Their Voice AI conducts standardized screening tools, adapts questions based on patient responses, and captures 340% more clinical data while maintaining protocol validity.",
    image: image_15b8b08ff934107140826361e6e3912f69618bae,
    theme: "blue",
    hasVideo: true,
    videoCta: "Play Video",
    author: {
      name: "Katie Murphy Psy.D.",
      role: "Founder of Penry",
      avatarUrl: "https://images.unsplash.com/photo-1758599543120-4e462429a4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBwc3ljaG9sb2dpc3QlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGdsYXNzZXN8ZW58MXx8fHwxNzcwNDEyOTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      logoUrl: "PENRY",
      logoBg: "bg-[#00D2B4]",
      isDarkLogo: true
    }
  },
  {
    id: "ntx",
    quote: "What impressed me about Hana wasn't just the AI technology though that's excellent it was how well the team understood our challenges. They helped us customize the system for our patients. It felt like a real partnership, not a typical vendor relationship.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTENXFW2ZMxnYJKiDS-MTN5cwZUzdJVIEUQ_w&s",
    theme: "peach",
    hasVideo: true,
    videoCta: "Play Video",
    author: {
        name: "Jonathan Wayne",
        role: "Founder of NTX",
        avatarUrl: "https://images.unsplash.com/photo-1696992443065-64eadfc2ded1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBzdWl0JTIwY29ycG9yYXRlJTIwbGVhZGVyJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDQxMjk2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        logoUrl: "NTX",
        logoBg: "bg-white",
        isDarkLogo: true
    }
  }
];

export function CaseStudiesSection() {
  return (
    <section className="py-12 md:py-24 bg-[#F5F5F5] dark:bg-slate-950" id="case-studies">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-6">
        {caseStudies.map((study, index) => (
          <div
            key={study.id}
            className={`
              sticky top-24
              rounded-3xl overflow-hidden p-8 md:p-10
              min-h-[450px] 
              flex flex-col lg:flex-row gap-8 items-stretch shadow-xl
              ${study.theme === 'dark' ? 'bg-[#00122F] text-white' : ''}
              ${study.theme === 'peach' ? 'bg-[#FFC091] text-slate-900' : ''}
              ${study.theme === 'blue' ? 'bg-[#3B82F6] text-white' : ''}
            `}
            style={{ 
              zIndex: index + 1,
              marginBottom: index === caseStudies.length - 1 ? 0 : '1.5rem'
            }}
          >
            {/* Left Content */}
            <div className="flex-1 flex flex-col justify-between z-10 w-full relative">
              <div className="space-y-6">
                <Quote className={`w-6 h-6 ${study.theme === 'peach' ? 'text-slate-900' : 'text-white/80'}`} />
                
                <h3 className="text-xl md:text-2xl lg:text-3xl font-serif leading-tight tracking-tight max-w-3xl">
                  {study.quote}
                </h3>
              </div>

              {/* Bottom Row of Left Content: Author + Button */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8 md:mt-0">
                 {/* Author */}
                 {study.author && (
                  <div className="flex flex-col gap-1">
                    <span className={`font-bold text-lg ${study.theme === 'peach' ? 'text-slate-900' : 'text-white'}`}>{study.author.name}</span>
                    <span className={`text-sm font-medium uppercase tracking-wide opacity-80 ${study.theme === 'peach' ? 'text-slate-800' : 'text-slate-300'}`}>{study.author.role}</span>
                  </div>
                )}

                {/* CTA Button */}
                {study.cta && (
                  <button className={`
                    px-5 py-2 rounded-full text-xs font-semibold transition-transform hover:scale-105 active:scale-95 whitespace-nowrap self-start md:self-auto
                    ${study.theme === 'peach' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'bg-white text-slate-900 hover:bg-slate-100 shadow-sm'}
                  `}>
                    {study.cta}
                  </button>
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-[320px] xl:w-[380px] h-[300px] lg:h-auto relative rounded-2xl overflow-hidden shadow-2xl shrink-0 order-first lg:order-last">
              <img 
                src={study.image} 
                alt="Case study visualization" 
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}