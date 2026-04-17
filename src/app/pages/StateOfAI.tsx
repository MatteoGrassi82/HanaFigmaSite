import { useState, useMemo, useEffect, useRef } from "react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { ExternalLink, Search, X, Layers, Phone, Heart, Calendar, MessageSquare, DollarSign, Globe, Brain, AudioLines, Mic, Radio, FlaskConical, GitFork, Download } from "lucide-react";

// --- Animation Helpers (matching other pages) ---
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

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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

// --- Data ---
const DATA: Record<string, Record<string, { n: string; u: string }[]>> = {"Core Voice Infrastructure":{"TTS, Voice Synthesis & Cloning":[{"n":"ElevenLabs","u":"https://elevenlabs.io"},{"n":"PlayAI","u":"https://play.ai"},{"n":"Murf AI","u":"https://murf.ai"},{"n":"Synthesia","u":"https://synthesia.io"},{"n":"Resemble AI","u":"https://resemble.ai"},{"n":"WellSaid","u":"https://wellsaid.io"},{"n":"MetaVoice","u":"https://metavoice.io"},{"n":"Inworld AI","u":"https://inworld.ai"},{"n":"Respeecher","u":"https://respeecher.com"},{"n":"Fish Audio","u":"https://fish.audio"},{"n":"Deepdub","u":"https://deepdub.ai"},{"n":"Rime","u":"https://rime.ai"},{"n":"Verbatik","u":"https://verbatik.com"},{"n":"Capacity","u":"https://capacity.com"},{"n":"Voxygen","u":"https://voxygen.fr"},{"n":"Speech Morphing, Inc.","u":"https://speechmorphinc.com"},{"n":"Acapela Group","u":"https://acapela-group.com"},{"n":"Synthesys AI Studio","u":"https://synthesys.io"},{"n":"My Voice AI","u":"https://myvoice.ai"},{"n":"Kits.AI","u":"https://kits.ai"},{"n":"CoeFont","u":"https://coefont.cloud"},{"n":"AudioPod AI","u":"https://audiopod.ai"},{"n":"Mico Voice AI","u":"https://micovoice.com"},{"n":"CAMB.AI","u":"https://camb.ai"},{"n":"VocaliD","u":"https://vocalid.ai"}],"STT, ASR & Transcription":[{"n":"Deepgram","u":"https://deepgram.com"},{"n":"AssemblyAI","u":"https://assemblyai.com"},{"n":"Otter.ai","u":"https://otter.ai"},{"n":"Gladia","u":"https://gladia.io"},{"n":"Verbit.ai","u":"https://verbit.ai"},{"n":"Ultravox.ai","u":"https://ultravox.ai"},{"n":"Parlance","u":"https://parlancecorp.com"},{"n":"Floatbot.AI","u":"https://floatbot.ai"},{"n":"Mod9 Technologies","u":"https://mod9.com"},{"n":"Vocapia Research","u":"https://vocapia.com"},{"n":"ActionPower","u":"https://actionpower.kr"},{"n":"Yobe Inc.","u":"https://yobeinc.com"},{"n":"iFLYTEK Open Platform","u":"https://xfyun.cn"},{"n":"Kanari AI","u":"https://kanari.ai"},{"n":"Goodcall","u":"https://goodcall.com"},{"n":"Keen Research","u":"https://keenresearch.com"},{"n":"Modulate","u":"https://modulate.ai"},{"n":"Whissle AI","u":"https://whissle.ai"},{"n":"Aqua Voice","u":"https://withaqua.com"},{"n":"EML Speech Technology GmbH","u":"https://eml.org"},{"n":"Voicing AI","u":"https://voicing.ai"},{"n":"Crescendo","u":"https://crescendosystems.co.uk"},{"n":"Starling AI","u":"https://starling-ai.com"},{"n":"Indus Labs","u":"https://induslabs.io"},{"n":"MediLogix","u":"https://medilogix.net"},{"n":"Voice AI","u":"https://voice.ai"},{"n":"Aldea","u":"https://aldea.ai"},{"n":"Picovoice","u":"https://picovoice.ai"},{"n":"DeepL","u":"https://deepl.com"}],"Audio Intelligence & Speech Analytics":[{"n":"Hume AI","u":"https://hume.ai"},{"n":"Behavioral Signals","u":"https://behavioralsignals.com"},{"n":"IRIS Audio Technologies","u":"https://iris.audio"},{"n":"Voicesense","u":"https://voicesense.com"},{"n":"Prosodica","u":"https://prosodica.com"},{"n":"audEERING GmbH","u":"https://audeering.com"},{"n":"pyannoteAI","u":"https://pyannote.ai"},{"n":"Altolabs Inc.","u":"https://altolabs.ai"},{"n":"Synthetic Media Processing Laboratory","u":"https://simplertc.com"},{"n":"Waveshaper AI","u":"https://waveshaper.ai"},{"n":"OmniSpeech LLC","u":"https://omni-speech.com"},{"n":"Dubbing AI","u":"https://dubbingai.io"},{"n":"ai-coustics GmbH","u":"https://ai-coustics.com"},{"n":"Emotion Logic Ltd","u":"https://emotionlogic.ai"},{"n":"Bevoiceai","u":"https://bevoiceai.com"},{"n":"Symbl.ai","u":"https://symbl.ai"},{"n":"Sanas","u":"https://sanas.ai"}],"Model / Data Layer & Adjacent AI":[{"n":"Scale AI","u":"https://scale.com"},{"n":"Cohere","u":"https://cohere.com"},{"n":"AI21 Labs","u":"https://ai21.com"},{"n":"Blue Machines AI","u":"https://bluemachines.ai"},{"n":"Deepslate","u":"https://deepslate.eu"}]},"Voice Agent Platforms":{"Agent Orchestration & Builders":[{"n":"Voiceflow","u":"https://voiceflow.com"},{"n":"Kore.ai","u":"https://kore.ai"},{"n":"Rasa","u":"https://rasa.com"},{"n":"Synthflow AI","u":"https://synthflow.ai"},{"n":"REGAL","u":"https://regal.ai"},{"n":"Parloa","u":"https://parloa.com"},{"n":"Avaamo","u":"https://avaamo.ai"},{"n":"aiOla","u":"https://aiola.ai"},{"n":"gnani.ai","u":"https://gnani.ai"},{"n":"Voxia","u":"https://voxia.ai"},{"n":"Voyce AI","u":"https://voyce.ai"},{"n":"EVE.calls","u":"https://evecalls.com"},{"n":"Intron Voice AI","u":"https://intron.io"},{"n":"Awaz.ai","u":"https://awaz.ai"},{"n":"Orion Labs","u":"https://orionlabs.io"},{"n":"JIQ AI","u":"https://jiq.ai"},{"n":"Rivvi AI, Inc","u":"https://rivvi.ai"},{"n":"VoiceCare AI","u":"https://voicecare.ai"},{"n":"CallBotics","u":"https://callbotics.ai"},{"n":"Kartha","u":"https://karthaai.com"},{"n":"Nova Echo AI","u":"https://novaecho.ai"},{"n":"Live Human AI","u":"https://livehuman.ai"},{"n":"VisionairAI","u":"https://visionairai.org"},{"n":"AlloMia","u":"https://allomia.com"},{"n":"AIM AI","u":"https://aimnow.ai"},{"n":"Pype AI","u":"https://pypeai.com"},{"n":"Xpectrum AI","u":"https://xpectrum-ai.com"},{"n":"Puretalk.ai","u":"https://puretalk.ai"},{"n":"NexaVoxa AI","u":"https://nexavoxa.com"}],"Telephony, Runtime & Call Ops":[{"n":"Retell AI","u":"https://retellai.com"},{"n":"Bland","u":"https://bland.com"},{"n":"Telnyx","u":"https://telnyx.com"},{"n":"Cally Agent","u":"https://callyagent.io"},{"n":"Orato","u":"https://tryorato.com"},{"n":"LoyJoy","u":"https://loyjoy.com"},{"n":"Salk AI","u":"https://salk.ai"},{"n":"Orby AI","u":"https://orby.ai"},{"n":"NIMIR","u":"https://nimircorp.com"}],"Testing, Evaluation & Observability":[{"n":"Cyara","u":"https://cyara.com"},{"n":"Langtail","u":"https://langtail.com"}]},"Engagement Applications":{"Healthcare & Patient Engagement":[{"n":"Hippocratic AI","u":"https://hippocraticai.com"},{"n":"Ambience Healthcare","u":"https://ambiencehealthcare.com"},{"n":"Abridge","u":"https://abridge.com"},{"n":"Hyro","u":"https://hyro.ai"},{"n":"Luma Health","u":"https://lumahealth.io"},{"n":"Artera","u":"https://artera.io"},{"n":"Cadence","u":"https://cadence.care"},{"n":"MyndYou","u":"https://myndyou.com"},{"n":"Medisafe","u":"https://medisafe.com"},{"n":"Orbita","u":"https://orbita.ai"},{"n":"Attune","u":"https://attune.ai"},{"n":"Nyra AI","u":"https://nyraai.io"},{"n":"Clinii","u":"https://clinii.com"},{"n":"BridgeHealthAI","u":"https://bridgehealthequity.com"},{"n":"Droxi Digital Health","u":"https://droxi.ai"},{"n":"Assort Health","u":"https://assorthealth.com"},{"n":"ActiumHealth","u":"https://actiumhealth.com"},{"n":"Brilo AI","u":"https://brilo.ai"},{"n":"Phelix.ai","u":"https://phelix.ai"},{"n":"Caregentic","u":"https://caregentic.com"},{"n":"CareBestie","u":"https://carebestie.com"},{"n":"EmpowerHealth","u":"https://empowerhealth.ai"},{"n":"Vasquez Platform","u":"https://vasquezplatform.com"},{"n":"ContactSwing.AI","u":"https://contactswing.ai"},{"n":"QuantumLoopAi","u":"https://quantumloopai.com"},{"n":"Vitarys","u":"https://vitarys.com"},{"n":"TrampolineAI","u":"https://trampolineai.com"},{"n":"Ostro","u":"https://ostrohealth.com"},{"n":"Medical Office Force","u":"https://medicalofficeforce.com"},{"n":"Pubgenius Inc.","u":"https://pubgenius.io"},{"n":"Olimi AI","u":"https://olimi.ai"},{"n":"Gravity Rail","u":"https://gravityrail.com"},{"n":"VOCALLS","u":"https://vocalls.ai"},{"n":"Paratus Health","u":"https://paratushealth.com"},{"n":"MayaMD.AI","u":"https://mayamd.ai"},{"n":"VoxxyAgent AI","u":"https://voxxyagent.ai"},{"n":"Popai Health","u":"https://popai.health"},{"n":"OmniHelio","u":"https://omnihelio.com"},{"n":"Adni","u":"https://adni.ai"},{"n":"Tabia Health","u":"https://tabiahealth.com"},{"n":"Cairns Health","u":"https://cairns.ai"},{"n":"Yeswici LLC","u":"https://ranty.net"},{"n":"Verbal","u":"https://tryverbal.com"},{"n":"CueZen","u":"https://cuezen.com"},{"n":"Areti Health","u":"https://aretihealth.com"},{"n":"VoiceSpin","u":"https://voicespin.com"},{"n":"Callsure AI","u":"https://callsure.ai"},{"n":"Pharmesol","u":"https://pharmesol.com"},{"n":"CallVitalz Inc.","u":"https://callvitalz.com"},{"n":"Voice-Care","u":"https://voice-care.com"},{"n":"Prodoc AI","u":"https://prodoc.ai"},{"n":"Alden","u":"https://alden.health"},{"n":"Inflo Health","u":"https://inflohealth.com"},{"n":"VoxyHealth","u":"https://voxyhealth.ai"},{"n":"Altira Health","u":"https://altirahealth.com"},{"n":"Mai Call","u":"https://maicall.ai"},{"n":"Lifelink Systems","u":"https://lifelinksystems.com"},{"n":"Amplify Craft","u":"https://amplifycraft.com"},{"n":"AcquisitionAI","u":"https://acquisitionai.com"},{"n":"Kouper","u":"https://kouperhealth.com"},{"n":"ManageCare","u":"https://managecare.ai"},{"n":"WellSaid AI","u":"https://wellsaid.ai"},{"n":"Callie Care","u":"https://getcallie.care"},{"n":"Aiva Health","u":"https://aivahealth.com"},{"n":"Vocal Agent Ai","u":"https://vocalagent.eu"},{"n":"HealthTalk A.I.","u":"https://healthtalkai.com"},{"n":"OhMD","u":"https://ohmd.com"},{"n":"Attuned Intelligence","u":"https://attuned-intelligence.com"},{"n":"Consig","u":"https://consig.ai"},{"n":"Althea Health","u":"https://altheahealth.io"},{"n":"6omb AI","u":"https://6omb.ai"},{"n":"Tucuvi","u":"https://tucuvi.com"},{"n":"ViClinic","u":"https://viclinic.com"},{"n":"Nagish","u":"https://nagish.com"}],"Patient Access, Scheduling & Admin":[{"n":"Syllable AI","u":"https://syllable.ai"},{"n":"Infinitus Systems","u":"https://infinitus.ai"},{"n":"SuperDial","u":"https://superdial.com"},{"n":"Hello Patient","u":"https://hellopatient.com"},{"n":"Talkie.ai","u":"https://talkie.ai"},{"n":"Heidi","u":"https://heidihealth.com"},{"n":"Operator Labs","u":"https://operatorlabs.ai"},{"n":"Parakeet Health","u":"https://parakeethealth.com"},{"n":"Callin.io","u":"https://callin.io"},{"n":"VINSI.AI","u":"https://vinsi.ai"},{"n":"Caretalk","u":"https://caretalk.ai"},{"n":"PracticePilot AI","u":"https://practicepilotai.com"},{"n":"OmniMD","u":"https://omnimd.com"},{"n":"Pretty Good AI","u":"https://prettygoodai.com"},{"n":"MIEA Health","u":"https://mieahealth.com"},{"n":"Holly by Nimblr.ai","u":"https://nimblr.ai"},{"n":"NextServices","u":"https://nextservices.com"},{"n":"PatientGenie","u":"https://patientgenie.com"},{"n":"LunaBill","u":"https://lunabill.com"},{"n":"VCare Health","u":"https://vcare-health.com"},{"n":"Roseline AI","u":"https://roseline.ai"},{"n":"CareCall","u":"https://carecall.ai"},{"n":"Gupshup","u":"https://gupshup.ai"},{"n":"Clinic Dial AI","u":"https://clinicdialai.com"},{"n":"Outbound AI","u":"https://outbound.ai"},{"n":"VoCall","u":"https://getvocall.com"},{"n":"Auxilis AI","u":"https://auxilis.ai"},{"n":"Standard Practice AI","u":"https://standardpractice.ai"},{"n":"Reggie Health","u":"https://reggiehealth.ai"},{"n":"dentalrobot","u":"https://dentalrobot.ai"},{"n":"TechNovaTime","u":"https://technovatime.com"},{"n":"Inquira Health","u":"https://inquira.health"},{"n":"Linear Health","u":"https://linear.health"},{"n":"RingEmAll","u":"https://ringemall.com"},{"n":"Transform9","u":"https://transform9.com"},{"n":"Allyzent","u":"https://allyzent.com"},{"n":"Prosper AI","u":"https://getprosper.ai"},{"n":"Healthsync AI","u":"https://healthsync.tech"},{"n":"Clara Health","u":"https://clarahealth.co"}],"Customer Support & Contact Center":[{"n":"PolyAI","u":"https://poly.ai"},{"n":"Observe.AI","u":"https://observe.ai"},{"n":"ASAPP","u":"https://asapp.com"},{"n":"Cresta","u":"https://cresta.com"},{"n":"Decagon","u":"https://decagon.ai"},{"n":"Aisera","u":"https://aisera.com"},{"n":"Maven AGI","u":"https://mavenagi.com"},{"n":"Tovie AI","u":"https://tovie.ai"},{"n":"Loris","u":"https://loris.ai"},{"n":"NoraVoice","u":"https://noravoice.ai"},{"n":"purpleScape","u":"https://purplescape.com"},{"n":"Novaurion","u":"https://novaurion.com"},{"n":"Xtend.AI","u":"https://xtend.ai"},{"n":"OpenMic AI","u":"https://openmic.ai"},{"n":"PartnerHero","u":"https://crescendo.ai"}],"Sales & Revenue Engagement":[{"n":"Gong","u":"https://gong.io"},{"n":"Dialo","u":"https://dialo.ai"}]}};

const LAYERS = [
  {
    key: "Core Voice Infrastructure",
    label: "Core Voice Infrastructure",
    tagline: "The organs. STT, TTS, audio intelligence, and foundation models that power every voice AI system.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "bg-blue-600",
    pill: "border-blue-200 bg-blue-50/50",
    pillHover: "hover:border-blue-400 hover:bg-blue-50",
    bucketOrder: ["STT, ASR & Transcription", "TTS, Voice Synthesis & Cloning", "Audio Intelligence & Speech Analytics", "Model / Data Layer & Adjacent AI"],
  },
  {
    key: "Voice Agent Platforms",
    label: "Voice Agent Platforms",
    tagline: "The nervous system. Orchestration, telephony, and tooling that connect infrastructure to real conversations.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    accent: "bg-violet-600",
    pill: "border-violet-200 bg-violet-50/50",
    pillHover: "hover:border-violet-400 hover:bg-violet-50",
    bucketOrder: ["Agent Orchestration & Builders", "Telephony, Runtime & Call Ops", "Testing, Evaluation & Observability"],
  },
  {
    key: "Engagement Applications",
    label: "Engagement Applications",
    tagline: "The interface. Where voice AI meets patients, clinicians, and care workflows.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "bg-emerald-600",
    pill: "border-emerald-200 bg-emerald-50/50",
    pillHover: "hover:border-emerald-400 hover:bg-emerald-50",
    bucketOrder: ["Healthcare & Patient Engagement", "Patient Access, Scheduling & Admin", "Customer Support & Contact Center", "Sales & Revenue Engagement"],
  },
];

const BUCKET_ICONS: Record<string, React.ReactNode> = {
  "STT, ASR & Transcription": <Mic className="w-4 h-4" />,
  "TTS, Voice Synthesis & Cloning": <AudioLines className="w-4 h-4" />,
  "Audio Intelligence & Speech Analytics": <Radio className="w-4 h-4" />,
  "Model / Data Layer & Adjacent AI": <Brain className="w-4 h-4" />,
  "Agent Orchestration & Builders": <GitFork className="w-4 h-4" />,
  "Telephony, Runtime & Call Ops": <Phone className="w-4 h-4" />,
  "Testing, Evaluation & Observability": <FlaskConical className="w-4 h-4" />,
  "Healthcare & Patient Engagement": <Heart className="w-4 h-4" />,
  "Patient Access, Scheduling & Admin": <Calendar className="w-4 h-4" />,
  "Customer Support & Contact Center": <MessageSquare className="w-4 h-4" />,
  "Sales & Revenue Engagement": <DollarSign className="w-4 h-4" />,
};

const ENRICHED: Record<string, { d?: string; t?: string[] }> = {"Verbatik":{"d":"Voice AI infrastructure provider specializing in Text-to-Speech, Voice Cloning, and speech-enabled product development.","t":["2 employees","Founded 2022"]},"Otter.ai":{"d":"Specializing in real-time voice transcription, speaker diarization, and voice AI infrastructure.","t":["$83M funding","$12.9M revenue","207 employees","Mountain View"]},"WellSaid":{"d":"Specializing in AI voice synthesis; offers a developer-first Text-to-Speech API with real-time streaming.","t":["$10M funding","$15M revenue","58 employees","Founded 2018"]},"Ultravox.ai":{"d":"Specializing in real-time voice AI infrastructure, providing APIs and SDKs for multiple platforms.","t":["$34M funding","$2.3M revenue","12 employees","Founded 2022","Seattle"]},"Modulate":{"d":"Specializing in prosocial voice technology; provides real-time voice moderation via the ToxMod platform.","t":["$66M funding","$5.5M revenue","54 employees","Founded 2019"]},"Verbit.ai":{"d":"Develops AI-based transcription and captioning solutions via RESTful API.","t":["$115M revenue","813 employees","Founded 2017"]},"Gladia":{"d":"AI infrastructure company specializing in speech-to-text, translation, and audio intelligence APIs.","t":["$19.9M funding","63 employees","Founded 2022"]},"Inworld AI":{"d":"Offers advanced voice AI solutions including text-to-speech, voice cloning, and real-time speech APIs.","t":["$175.7M funding","$2.0M revenue","87 employees"]},"Scale AI":{"d":"AI data infrastructure company providing training data, evaluation, and deployment tools for AI models.","t":["$1.6B funding","$1.4B revenue","543 employees","Founded 2016"]},"Cohere":{"d":"Enterprise AI company building large language models and NLP infrastructure for business applications.","t":["$970M funding","$35M revenue","450 employees","Founded 2019"]},"AI21 Labs":{"d":"Develops foundation models and AI systems for enterprise use.","t":["$936M funding","$57.8M revenue","210 employees"]},"ElevenLabs":{"d":"Voice AI company specializing in text-to-speech, voice synthesis, and voice cloning.","t":["$881M funding","543 employees","Founded 2022"]},"Murf AI":{"d":"AI voice generator offering 200+ realistic voices in multiple languages.","t":["$11.5M funding","$2M revenue","113 employees"]},"Synthesia":{"d":"AI video communications platform with text-to-speech engine supporting 160+ languages.","t":["$549.8M funding","$100M revenue","573 employees"]},"Synthflow AI":{"d":"No-code platform for deploying voice AI agents that automate phone calls.","t":["$49M funding","68 employees","Founded 2023","Berlin"]},"REGAL":{"d":"AI-powered outbound calling platform for revenue teams with voice agent orchestration.","t":["$83.5M funding"]},"Avaamo":{"d":"Voice AI platform supporting 2B+ interactions annually across healthcare and customer service.","t":["$30.5M funding","$9.3M revenue","112 employees","Founded 2014"]},"Telnyx":{"d":"Cloud communications platform offering voice, messaging, and networking APIs.","t":["$120M funding"]},"Cyara":{"d":"AI-powered CX assurance platform for testing and monitoring voice experiences.","t":["$40.5M funding"]},"Hippocratic AI":{"d":"Healthcare AI company developing safety-focused LLMs and multimodal voice AI.","t":["$402M funding","$76M revenue","200 employees","Founded 2023"]},"Ambience Healthcare":{"d":"AI-powered clinical documentation and ambient AI platform.","t":["$100M funding"]},"Abridge":{"d":"AI-powered clinical conversation platform for medical documentation.","t":["$212.5M funding"]},"Hyro":{"d":"Voice AI solutions for enterprise call center automation and healthcare workflows.","t":["$140M funding","$18.5M revenue","143 employees","Founded 2018"]},"Infinitus Systems":{"d":"AI-powered phone agent platform automating healthcare administrative calls at scale.","t":["$55M funding"]},"Gong":{"d":"Revenue AI platform that analyzes customer interactions for sales insights.","t":["$583.5M revenue","1800 employees"]},"PolyAI":{"d":"Enterprise voice AI for contact centers, handling complex conversations autonomously.","t":["$120M funding"]},"Observe.AI":{"d":"AI-powered conversation intelligence platform for contact centers.","t":["$214M funding"]},"ASAPP":{"d":"AI-native platform for contact centers combining automation and agent augmentation.","t":["$380M funding"]},"Cresta":{"d":"AI platform for contact centers providing real-time coaching and intelligence.","t":["$151M funding"]},"Aisera":{"d":"Enterprise AI platform for IT, HR, and customer service.","t":["$190M funding"]},"Sanas":{"d":"Real-time accent translation technology for contact centers.","t":["$75M funding"]},"DeepL":{"d":"AI-powered translation platform with neural machine translation for 30+ languages.","t":["$100M funding","800 employees"]},"Deepgram":{"d":"Voice AI solutions including speech-to-text, text-to-speech, and conversational AI.","t":["$233.3M funding","$24.2M revenue","208 employees","San Francisco"]},"AssemblyAI":{"d":"AI speech recognition platform offering transcription and audio intelligence APIs.","t":["$115M funding"]},"CAMB.AI":{"d":"AI localization platform specializing in speech synthesis and translation.","t":["$19.3M funding","48 employees"]},"Nagish":{"d":"Real-time AI-powered phone call captioning for people with hearing loss.","t":["$17M funding","35 employees","Founded 2021"]},"MyndYou":{"d":"AI-enabled care management with MyEleanor voice agent for proactive patient engagement.","t":["$4M funding","$6M revenue","34 employees","Founded 2016"]},"Medisafe":{"d":"Healthcare technology with VIA (Voice Intelligent Agent) for medication adherence.","t":["$18.4M revenue","66 employees","Founded 2012"]},"IRIS Audio Technologies":{"d":"Core audio AI infrastructure with real-time noise removal and speech enhancement.","t":["$10M funding","39 employees","Founded 2018"]},"Orion Labs":{"d":"Voice-first intelligent collaboration platform for frontline workforce.","t":["$63M funding","$9.6M revenue","6 employees","Founded 2013"]}};

type Company = { n: string; u: string };

// --- Components ---
function CompanyPill({ company, isHighlighted, layer, onClick }: { company: Company; isHighlighted: boolean; layer: typeof LAYERS[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 m-0.5 border rounded-full cursor-pointer text-xs font-medium transition-all duration-200 ${
        isHighlighted
          ? `${layer.pill} ${layer.color} border-current`
          : `border-slate-200 bg-white text-slate-700 ${layer.pillHover}`
      }`}
    >
      {company.n}
    </button>
  );
}

function CompanyDetail({ company, onClose }: { company: Company; onClose: () => void }) {
  const domain = company.u.replace(/https?:\/\//, "").replace(/\/$/, "");
  const info = ENRICHED[company.n] || {};
  const tags = info.t || [];
  const desc = info.d || "";

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-serif text-2xl text-slate-900 mb-1 pr-8">{company.n}</h3>
        <a href={company.u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-4 transition-colors">
          {domain} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        {desc && <p className="text-sm text-slate-600 leading-relaxed mb-4">{desc}</p>}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BucketSection({ name, companies, layer, searchTerm, onCompanyClick }: { name: string; companies: Company[]; layer: typeof LAYERS[0]; searchTerm: string; onCompanyClick: (c: Company) => void }) {
  const filtered = searchTerm ? companies.filter(c => c.n.toLowerCase().includes(searchTerm.toLowerCase())) : companies;
  if (searchTerm && filtered.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className={layer.color}>{BUCKET_ICONS[name]}</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{name}</span>
        <span className={`text-xs font-medium ${layer.color}`}>{filtered.length}</span>
      </div>
      <div className="flex flex-wrap -m-0.5">
        {filtered.map((c, i) => (
          <CompanyPill key={i} company={c} isHighlighted={!!searchTerm && c.n.toLowerCase().includes(searchTerm.toLowerCase())} layer={layer} onClick={() => onCompanyClick(c)} />
        ))}
      </div>
    </div>
  );
}

function LayerSection({ layer, searchTerm, onCompanyClick }: { layer: typeof LAYERS[0]; searchTerm: string; onCompanyClick: (c: Company) => void }) {
  const buckets = DATA[layer.key] || {};
  const orderedBuckets = layer.bucketOrder.filter(b => buckets[b]);
  const visibleBuckets = searchTerm ? orderedBuckets.filter(b => buckets[b].some((c: Company) => c.n.toLowerCase().includes(searchTerm.toLowerCase()))) : orderedBuckets;
  if (searchTerm && visibleBuckets.length === 0) return null;
  const layerTotal = orderedBuckets.reduce((sum, b) => sum + (buckets[b]?.length || 0), 0);

  return (
    <FadeIn>
      <div className={`mb-8 ${layer.bg} rounded-2xl p-6 md:p-8 border ${layer.border}`}>
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900">{layer.label}</h2>
            <span className={`font-serif text-xl ${layer.color}`}>{layerTotal}</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{layer.tagline}</p>
          <div className="h-px w-full bg-black/5 mt-5" />
        </div>
        {visibleBuckets.map((bucketName) => (
          <BucketSection key={bucketName} name={bucketName} companies={buckets[bucketName]} layer={layer} searchTerm={searchTerm} onCompanyClick={onCompanyClick} />
        ))}
      </div>
    </FadeIn>
  );
}

// --- Main Component ---
export function StateOfAI() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredLayers = useMemo(() => {
    if (activeFilter === "all") return LAYERS;
    return LAYERS.filter(l => l.key === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="The State of Voice AI in Healthcare"
        description="247 companies mapped across three layers of voice AI infrastructure. The first comprehensive mapping of the healthcare voice AI ecosystem."
        path="/state-of-ai"
        keywords="voice AI landscape, healthcare AI companies, voice infrastructure map, voice agent platforms, patient engagement AI"
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-20 px-6 relative bg-slate-50 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] rounded-[100%] bg-blue-100/30 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            {/* removed "Published by" line */}
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight text-slate-900 mb-8 leading-[1.05]">
              The State of Voice AI <br /> in Healthcare
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-4">
              247 companies. Three layers of infrastructure. One map to make sense of it all.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
              The first comprehensive mapping of the entire voice AI ecosystem in healthcare, from foundational models to patient-facing applications. Your reference for evaluating vendors, mapping the space, or choosing your stack.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <a
              href="https://dissgvupfcazdnhspdzv.supabase.co/storage/v1/object/public/materials/The%20State%20Of%20AI.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mt-8 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full transition-colors shadow-lg shadow-slate-900/20"
            >
              <Download className="w-4 h-4" />
              Download the Full Report
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 pb-16">
        <FadeIn>
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl py-8 px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "247", label: "Companies Mapped", sub: "" },
              { number: "75", label: "Infrastructure", sub: "Core voice tech" },
              { number: "44", label: "Platforms", sub: "Agent orchestration" },
              { number: "128", label: "Applications", sub: "Patient-facing" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-4xl md:text-5xl text-blue-400 mb-1">{stat.number}</div>
                <div className="text-xs font-semibold text-white uppercase tracking-wider">{stat.label}</div>
                {stat.sub && <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>}
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Layer Overview Cards */}
      <section className="px-6 pb-16">
        <FadeIn>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {LAYERS.map((layer, idx) => (
              <div key={layer.key} className={`${layer.bg} rounded-2xl p-6 border ${layer.border}`}>
                <div className={`text-sm font-semibold ${layer.color} mb-1`}>Layer {idx + 1}</div>
                <div className="font-serif text-lg text-slate-900 mb-2">{layer.label}</div>
                <div className="text-sm text-slate-500 leading-relaxed">{layer.tagline}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Search + Filters + Map */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Search + Filters */}
          <FadeIn>
            <div className="flex gap-4 items-center flex-wrap mb-8">
              <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-full px-4 py-2.5 flex-[1_1_280px] max-w-sm shadow-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none outline-none bg-transparent w-full text-sm text-slate-900 placeholder:text-slate-400"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="p-0.5 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "all", label: "All Layers" },
                  { key: "Core Voice Infrastructure", label: "Infrastructure" },
                  { key: "Voice Agent Platforms", label: "Platforms" },
                  { key: "Engagement Applications", label: "Applications" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                      activeFilter === key
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Section label */}
          <FadeIn>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">The Ecosystem Map</p>
          </FadeIn>

          {/* The Map */}
          {filteredLayers.map((layer) => (
            <LayerSection key={layer.key} layer={layer} searchTerm={searchTerm} onCompanyClick={setSelectedCompany} />
          ))}
        </div>
      </section>

      {/* Key Observations */}
      <section className="px-6 pb-20">
        <FadeIn>
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Key Observations</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">What the map reveals</h2>
            <div className="h-px w-full bg-white/10 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12">
              {[
                { title: "The engagement layer is crowded and undifferentiated", body: "107 companies in healthcare engagement and patient access alone. Most are thin application wrappers around the same infrastructure. The question for clinics isn't 'which one?' but 'which architecture?'" },
                { title: "Infrastructure is consolidating", body: "The TTS and STT layers are maturing around a handful of well-funded players. ElevenLabs, Deepgram, AssemblyAI are becoming the default primitives. The competitive advantage has moved up the stack." },
                { title: "The platform layer is the strategic bottleneck", body: "Only 44 companies in the orchestration and telephony layer, yet this is where the real complexity lives. How you route, fallback, and maintain memory across conversations is what separates a demo from a deployment." },
                { title: "Healthcare native voice AI barely exists", body: "Most 'healthcare voice AI' companies are horizontal platforms with a healthcare landing page. Very few have built from the ground up for clinical workflows, safety, and compliance." },
              ].map(({ title, body }, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div>
                    <h3 className="text-base font-medium text-blue-300 mb-2 leading-snug">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <Footer />

      {/* Company Detail Modal */}
      {selectedCompany && <CompanyDetail company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
    </div>
  );
}