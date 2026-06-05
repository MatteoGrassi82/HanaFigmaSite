import { useState, useRef, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Siren, 
  CalendarCheck, 
  Pill, 
  CreditCard, 
  UserPlus, 
  Activity, 
  Clock,
  ShieldCheck,
  Brain,
  Moon,
  Target,
  HeartPulse,
  Users,
  Wallet,
  HeartHandshake,
  Eye,
  CalendarX,
  Home,
  UserCog,
  FlaskConical,
  History,
  Syringe,
  Smile,
  FileSearch,
  Filter,
  X,
  ChevronDown,
  Check
} from 'lucide-react';
import { AgentCard } from './AgentCard';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './SEO';
import { breadcrumbSchema } from './SEO';

interface UseCasesProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

type WorkflowType = "All" | "Monitoring" | "Care Coordination" | "Outreach" | "Intake & Access" | "Operations";
type SpecialtyType = "All" | "Primary Care" | "Specialty Care" | "Behavioral Health" | "Health System" | "Admin & Revenue";

interface UseCase {
  id: string;
  title: string;
  description: string;
  workflow: WorkflowType;
  specialty: SpecialtyType;
  icon: any;
  status: "Live" | "Beta" | "Coming Soon";
  assistantId: string;
  colorClass: "blue" | "emerald";
}

const useCases: UseCase[] = [
  // 1. Featured Agents
  {
    id: "demo-1",
    title: "Medicaid Redetermination",
    description: "Proactively contacts members regarding upcoming redetermination deadlines. Guides users through documentation needs.",
    workflow: "Outreach",
    specialty: "Admin & Revenue",
    icon: ClipboardCheck,
    status: "Live",
    assistantId: "4224af64-f52d-449b-883c-8fc07a09d669",
    colorClass: "blue"
  },
  {
    id: "demo-2",
    title: "After-Hours Escalation",
    description: "24/7 infrastructure monitoring assistant. Instantly validates downtime alerts and executes intelligent escalation protocols.",
    workflow: "Operations",
    specialty: "Health System",
    icon: Siren,
    status: "Live",
    assistantId: "451e2104-265c-4448-837f-0491beca54b3",
    colorClass: "emerald"
  },
  
  // 2. Monitoring
  {
    id: "care-plan-review",
    title: "Care Plan Review",
    description: "Regular review of care plan goals, progress tracking, and engagement reinforcement to ensure optimal health outcomes.",
    workflow: "Monitoring",
    specialty: "Primary Care",
    icon: ClipboardCheck,
    status: "Live",
    assistantId: "c2a302b7-cc6a-4c8a-85ba-1ddc40d0d602",
    colorClass: "blue"
  },
  {
    id: "medication-adherence",
    title: "Medication Adherence Call",
    description: "Support for proper medication use, addressing concerns and side effects to ensure treatment effectiveness.",
    workflow: "Monitoring",
    specialty: "Primary Care",
    icon: Pill,
    status: "Live",
    assistantId: "ca20d9d6-7be2-4b6c-8f23-847a48c43b70",
    colorClass: "blue"
  },
  {
    id: "phq9-screening",
    title: "PHQ-9 Depression Screening",
    description: "Regular mental health monitoring using the PHQ-9 assessment to track depression symptoms and ensure timely interventions.",
    workflow: "Monitoring",
    specialty: "Behavioral Health",
    icon: Brain,
    status: "Live",
    assistantId: "29456291-d3c5-4edf-9a1c-1808a9f9966e",
    colorClass: "blue"
  },
  {
    id: "pain-monitoring",
    title: "Pain Monitoring Call",
    description: "Regular assessment of pain levels, patterns, and impact on daily activities to optimize pain management strategies.",
    workflow: "Monitoring",
    specialty: "Specialty Care",
    icon: Activity,
    status: "Live",
    assistantId: "b20b8495-8283-409e-978a-473195f1113d",
    colorClass: "blue"
  },
  {
    id: "sleep-fatigue",
    title: "Sleep & Fatigue Check-In",
    description: "Monitor sleep patterns and energy levels to improve rest quality and manage fatigue effectively.",
    workflow: "Monitoring",
    specialty: "Behavioral Health",
    icon: Moon,
    status: "Live",
    assistantId: "a4611af8-932b-42a3-9025-6a03e5d3783e",
    colorClass: "blue"
  },
  {
    id: "goal-coaching",
    title: "Goal Coaching Call",
    description: "Support and motivation for achieving SMART health goals through regular check-ins and progress tracking.",
    workflow: "Monitoring",
    specialty: "Primary Care",
    icon: Target,
    status: "Live",
    assistantId: "16206946-a057-41c9-bc37-ce1e9546704d",
    colorClass: "blue"
  },
  {
    id: "bp-symptom-monitoring",
    title: "Blood Pressure Monitoring",
    description: "Regular monitoring of blood pressure readings and related symptoms to prevent complications.",
    workflow: "Monitoring",
    specialty: "Primary Care",
    icon: HeartPulse,
    status: "Live",
    assistantId: "e886ab67-ea0f-4e58-9137-a5a237681e74",
    colorClass: "blue"
  },
  {
    id: "social-needs-safety",
    title: "Social Needs & Safety",
    description: "Assessment of social determinants of health and safety concerns to ensure comprehensive care support.",
    workflow: "Monitoring",
    specialty: "Health System",
    icon: Users,
    status: "Live",
    assistantId: "e0c9f0d9-5c76-4a3a-a07c-38508863d9fb",
    colorClass: "blue"
  },
  {
    id: "benefit-stability-income-risk",
    title: "Benefit Stability Check-In",
    description: "A supportive check-in to identify early signs of financial or benefit instability in patients affected by policy changes.",
    workflow: "Monitoring",
    specialty: "Admin & Revenue",
    icon: Wallet,
    status: "Live",
    assistantId: "d370c5df-e6ff-41cc-9045-48beb94ad146",
    colorClass: "blue"
  },
  {
    id: "palliative-care-medication-support",
    title: "Palliative Care Med Support",
    description: "Medication safety and side-effect monitoring for palliative care patients, with opioid safety focus.",
    workflow: "Monitoring",
    specialty: "Specialty Care",
    icon: HeartHandshake,
    status: "Live",
    assistantId: "dbddb25f-f619-4cd0-85bd-5809ae2182ab",
    colorClass: "blue"
  },
  {
    id: "medication-refill-reminder",
    title: "Medication Refill Reminder",
    description: "Proactive outreach when patients are due for prescription refills to maintain medication adherence.",
    workflow: "Monitoring",
    specialty: "Admin & Revenue",
    icon: Clock,
    status: "Live",
    assistantId: "7e7c066f-9c4b-473c-ad89-11f4146dcfcf",
    colorClass: "blue"
  },
  {
    id: "diabetic-eye-exam-reminder",
    title: "Diabetic Eye Exam Reminder",
    description: "Follow-up with diabetic patients to schedule their annual retinal exam and close critical care gaps.",
    workflow: "Monitoring",
    specialty: "Primary Care",
    icon: Eye,
    status: "Live",
    assistantId: "27c89d3f-25e7-4c7a-97e3-05c62ba5f646",
    colorClass: "blue"
  },

  // 3. Coordination
  {
    id: "no-show-rescue",
    title: "No-Show Rescue Call",
    description: "Immediate follow-up after missed appointments to understand barriers and reschedule patients.",
    workflow: "Care Coordination",
    specialty: "Admin & Revenue",
    icon: CalendarX,
    status: "Live",
    assistantId: "50ac1f91-547e-4bc9-8398-8d091adcedae",
    colorClass: "emerald"
  },
  {
    id: "referral-follow-up",
    title: "Referral Follow-Up Call",
    description: "Follow-up on specialist referrals to ensure patients complete recommended care.",
    workflow: "Care Coordination",
    specialty: "Admin & Revenue",
    icon: UserPlus,
    status: "Live",
    assistantId: "e1b48b50-a17b-45e3-9420-72e2b9a82bf1",
    colorClass: "emerald"
  },
  {
    id: "post-discharge",
    title: "Post-Discharge Care",
    description: "Immediate post-hospital discharge support to ensure safe transition and prevent readmission.",
    workflow: "Care Coordination",
    specialty: "Health System",
    icon: Home,
    status: "Live",
    assistantId: "59370d7f-a792-49ba-b3c0-ee7557f97b5e",
    colorClass: "blue"
  },
  {
    id: "palliative-care-family-update",
    title: "Palliative Family Update",
    description: "Compassionate family support call providing clear updates, listening to concerns, and validating emotions.",
    workflow: "Care Coordination",
    specialty: "Specialty Care",
    icon: Users,
    status: "Live",
    assistantId: "c76b30fb-9d0d-4215-a3ed-09ba276c65cb",
    colorClass: "blue"
  },
  {
    id: "post-op-48hr-safety-check",
    title: "Post-Op 48-Hour Safety",
    description: "Critical 48-hour post-discharge call to confirm medications, screen for complications, and route urgent issues.",
    workflow: "Care Coordination",
    specialty: "Specialty Care",
    icon: ShieldCheck,
    status: "Live",
    assistantId: "cbab4560-bf00-4f31-a265-aee253296e3c",
    colorClass: "blue"
  },
  {
    id: "bereavement-triage",
    title: "Bereavement Triage",
    description: "Compassionate support after personal loss, helping families navigate insurance benefits and connecting them with resources.",
    workflow: "Care Coordination",
    specialty: "Behavioral Health",
    icon: HeartHandshake,
    status: "Live",
    assistantId: "bb56eb94-ae95-4c1e-a5f8-2bd19b95af2e",
    colorClass: "blue"
  },
  {
    id: "specialist-appointment-coordination",
    title: "Specialist Coordination",
    description: "Follow-up to ensure patients scheduled their specialist referral and provide assistance if they haven't.",
    workflow: "Care Coordination",
    specialty: "Admin & Revenue",
    icon: UserCog,
    status: "Live",
    assistantId: "specialist-coordination-agent-placeholder",
    colorClass: "emerald"
  },
  {
    id: "lab-work-reminder",
    title: "Lab Work Reminder Call",
    description: "Reminder for patients who need to complete lab work before their upcoming appointment.",
    workflow: "Care Coordination",
    specialty: "Admin & Revenue",
    icon: FlaskConical,
    status: "Live",
    assistantId: "63288099-0dc0-42b7-9f0f-ce8a2b97dbf0",
    colorClass: "blue"
  },

  // 4. Outreach
  {
    id: "dormant-patient-reactivation",
    title: "Dormant Patient Reactivation",
    description: "Re-engage patients who haven't been seen in months to bring them back into care.",
    workflow: "Outreach",
    specialty: "Admin & Revenue",
    icon: History,
    status: "Live",
    assistantId: "cad51e8f-2299-487e-b73f-aa99b7aaa1f4",
    colorClass: "emerald"
  },
  {
    id: "annual-wellness-visit-outreach",
    title: "Annual Wellness Visit Outreach",
    description: "Proactive outreach to schedule Medicare Annual Wellness Visits for eligible patients who haven't completed them yet.",
    workflow: "Outreach",
    specialty: "Primary Care",
    icon: CalendarCheck,
    status: "Live",
    assistantId: "991cd326-f039-4b30-9063-4f9a6343d1c0",
    colorClass: "emerald"
  },
  {
    id: "flu-vaccine-campaign",
    title: "Flu Vaccine Campaign",
    description: "Seasonal outreach to eligible patients offering flu vaccination scheduling and education.",
    workflow: "Outreach",
    specialty: "Primary Care",
    icon: Syringe,
    status: "Live",
    assistantId: "b16eb88f-c590-48d7-9dd5-b49f4e8860f1",
    colorClass: "blue"
  },
  {
    id: "new-patient-welcome",
    title: "New Patient Welcome Call",
    description: "Onboarding call for new patients to introduce the practice, explain how to access care, and build initial relationship.",
    workflow: "Outreach",
    specialty: "Admin & Revenue",
    icon: Smile,
    status: "Live",
    assistantId: "b7f0553b-11ba-4d58-a900-7d63ed2c4d52",
    colorClass: "emerald"
  },

  // 5. Intake
  {
    id: "pre-appointment-preparation",
    title: "Pre-Appointment Prep",
    description: "Call patients 2-3 days before their visit to confirm attendance, review what to bring, and answer questions.",
    workflow: "Intake & Access",
    specialty: "Admin & Revenue",
    icon: ClipboardCheck,
    status: "Live",
    assistantId: "b7f0553b-11ba-4d58-a900-7d63ed2c4d52",
    colorClass: "emerald"
  },
  {
    id: "high-risk-patient-assessment",
    title: "High-Risk Assessment",
    description: "Initial assessment for patients with multiple chronic conditions or rising risk scores to establish baseline.",
    workflow: "Intake & Access",
    specialty: "Health System",
    icon: FileSearch,
    status: "Live",
    assistantId: "9942b37b-5c59-48d9-96f1-1b4fbe1b106a",
    colorClass: "blue"
  },
  {
    id: "insurance-coverage-verification",
    title: "Insurance Verification",
    description: "Reach out to patients with insurance changes or lapses to update information and prevent care disruption.",
    workflow: "Intake & Access",
    specialty: "Admin & Revenue",
    icon: CreditCard,
    status: "Live",
    assistantId: "04947ff4-f66d-42e0-808d-d272d32016b1",
    colorClass: "blue"
  }
];

const workflows: WorkflowType[] = ["All", "Monitoring", "Care Coordination", "Outreach", "Intake & Access", "Operations"];
const specialties: SpecialtyType[] = ["All", "Primary Care", "Specialty Care", "Behavioral Health", "Health System", "Admin & Revenue"];

// Reusable Filter Dropdown Component
function FilterDropdown({ 
  label, 
  options, 
  selected, 
  onChange 
}: { 
  label: string; 
  options: string[]; 
  selected: string; 
  onChange: (value: any) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
          ${selected !== "All" 
            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300' 
            : 'bg-white dark:bg-[#0B1D36] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
      >
        <Filter className="w-4 h-4" />
        <span>{selected === "All" ? label : selected}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1A2C4E] rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2 space-y-0.5">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors
                    ${selected === option 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <span className={option === "All" ? "opacity-70" : ""}>
                    {option === "All" ? `All ${label}s` : option}
                  </span>
                  {selected === option && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function UseCases({ 
  activeAgentId, 
  webCallStatus, 
  handleStartWebCall, 
  handleEndWebCall 
}: UseCasesProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowType>("All");
  const [activeSpecialty, setActiveSpecialty] = useState<SpecialtyType>("All");

  const filteredCases = useCases.filter(vc => {
    const matchWorkflow = activeWorkflow === "All" || vc.workflow === activeWorkflow;
    const matchSpecialty = activeSpecialty === "All" || vc.specialty === activeSpecialty;
    return matchWorkflow && matchSpecialty;
  });

  const clearFilters = () => {
    setActiveWorkflow("All");
    setActiveSpecialty("All");
  };

  const hasActiveFilters = activeWorkflow !== "All" || activeSpecialty !== "All";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#00122F] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/50">
      
      <SEO 
        title="Agent Catalogue"
        description="Explore Hana's catalogue of specialized clinical AI agents for monitoring, care coordination, outreach, and intake. Filter by workflow and specialty."
        path="/use-cases"
        keywords="clinical AI agents, healthcare use cases, patient monitoring AI, care coordination automation, medical intake automation, AI outreach agents"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "Agent Catalogue", url: "https://www.hana.health/use-cases" }
        ])}
      />

      {/* Background Gradient Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
      </div>

      <div className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* Header & Filter Controls */}
        <div className="space-y-8">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-serif text-slate-900 dark:text-white">Agent Catalogue</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light">
              Explore how Hana transforms workflows across the care continuum with specialized, pre-trained agents.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">Filter by:</span>
              
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <FilterDropdown 
                  label="Workflow" 
                  options={workflows} 
                  selected={activeWorkflow} 
                  onChange={setActiveWorkflow} 
                />
                
                <FilterDropdown 
                  label="Specialty" 
                  options={specialties} 
                  selected={activeSpecialty} 
                  onChange={setActiveSpecialty} 
                />
                
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors md:ml-2"
                  >
                    <X className="w-4 h-4" /> Clear
                  </button>
                )}
              </div>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Showing {filteredCases.length} agents
            </div>
          </div>
        </div>

        {/* 3x Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredCases.map((useCase) => (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <AgentCard 
                  title={useCase.title}
                  description={useCase.description}
                  icon={useCase.icon}
                  colorClass={useCase.colorClass}
                  assistantId={useCase.assistantId}
                  workflow={useCase.workflow}
                  webCallStatus={activeAgentId === useCase.id ? webCallStatus : "idle"}
                  isOtherAgentActive={activeAgentId !== null && activeAgentId !== useCase.id}
                  onStartWebCall={() => handleStartWebCall(useCase.id, useCase.assistantId)}
                  onEndWebCall={handleEndWebCall}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}