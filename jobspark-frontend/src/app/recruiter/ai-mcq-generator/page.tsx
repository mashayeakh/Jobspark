'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, BrainCircuit, Sparkles, CheckCircle2, ChevronRight,
  Briefcase, Users, Clock, Target, X, Plus, RefreshCw, Send, Save,
  RotateCcw, Loader2, ChevronDown, Check
} from 'lucide-react';

// ─── Hardcoded Data ──────────────────────────────────────────────────────────
const JOB_POSTS = [
  {
    id: 'j1',
    title: 'Senior React Developer',
    department: 'Engineering',
    experienceLevel: 'Senior (5+ years)',
    location: 'Remote',
    applicants: 48,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Redux', 'Jest', 'CI/CD'],
    postedDate: 'Nov 1, 2023',
  },
  {
    id: 'j2',
    title: 'Product Manager',
    department: 'Product',
    experienceLevel: 'Mid-Level (3-5 years)',
    location: 'New York, NY',
    applicants: 31,
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Roadmapping', 'Stakeholder Management'],
    postedDate: 'Oct 28, 2023',
  },
  {
    id: 'j3',
    title: 'AI/ML Engineer',
    department: 'Data Science',
    experienceLevel: 'Senior (5+ years)',
    location: 'San Francisco, CA',
    applicants: 22,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'LLMs', 'RAG', 'Vector Databases'],
    postedDate: 'Oct 25, 2023',
  },
  {
    id: 'j4',
    title: 'UI/UX Designer',
    department: 'Design',
    experienceLevel: 'Mid-Level (3-5 years)',
    location: 'Remote',
    applicants: 57,
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
    postedDate: 'Nov 3, 2023',
  },
];

const GENERATED_QUESTIONS_MAP: Record<string, { question: string; options: string[]; answer: number; explanation: string }[]> = {
  j1: [
    {
      question: 'What is the primary difference between `useMemo` and `useCallback` in React?',
      options: ['useMemo caches values, useCallback caches functions', 'useCallback caches values, useMemo caches functions', 'They are identical in behavior', 'useMemo is for class components only'],
      answer: 0,
      explanation: 'useMemo returns a memoized value by executing a function, while useCallback returns a memoized version of the callback function itself.'
    },
    {
      question: 'Which TypeScript utility type makes all properties of a type optional?',
      options: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Pick<T, K>'],
      answer: 1,
      explanation: 'Partial<T> constructs a type with all properties of T set to optional.'
    },
    {
      question: 'In Redux Toolkit, what does `createSlice` automatically generate?',
      options: ['API endpoints', 'Action creators and reducers', 'Selectors and thunks', 'Store configuration'],
      answer: 1,
      explanation: 'createSlice generates action creators and action types based on the reducers you provide.'
    },
    {
      question: 'What is the purpose of `React.memo()`?',
      options: ['To manage component state', 'To prevent unnecessary re-renders of functional components', 'To replace useEffect', 'To create context providers'],
      answer: 1,
      explanation: 'React.memo is a higher-order component that memoizes the rendered output of the wrapped component.'
    },
    {
      question: 'Which GraphQL operation type is used to modify server-side data?',
      options: ['Query', 'Subscription', 'Mutation', 'Fragment'],
      answer: 2,
      explanation: 'Mutations are used for creating, updating, and deleting data on the server in GraphQL.'
    },
  ],
  j2: [
    { question: 'What does MVP stand for in product management?', options: ['Most Viable Product', 'Minimum Viable Product', 'Maximum Value Proposition', 'Managed Value Pipeline'], answer: 1, explanation: 'MVP stands for Minimum Viable Product, the smallest feature set to validate a hypothesis.' },
    { question: 'Which Agile ceremony is focused on process improvement?', options: ['Sprint Planning', 'Daily Standup', 'Sprint Retrospective', 'Sprint Review'], answer: 2, explanation: 'The Sprint Retrospective focuses on the team process, identifying what to start, stop, and continue.' },
    { question: 'What is a North Star Metric?', options: ['A KPI for investor relations', 'The single metric that best captures core product value', 'A metric only used at product launch', 'The OKR for the entire company'], answer: 1, explanation: 'A North Star Metric is the single number that best reflects the core value a product delivers to customers.' },
    { question: 'In a product roadmap, what does an "Outcome-based" approach focus on?', options: ['Features shipped per sprint', 'Business results and user behaviour changes', 'Number of bugs fixed', 'Design mockup approvals'], answer: 1, explanation: 'Outcome-based roadmaps focus on the measurable change in customer or business behaviour rather than specific features.' },
    { question: 'What is the RICE scoring model used for?', options: ['Competitor analysis', 'Prioritizing features and initiatives', 'Risk assessment', 'Revenue calculation'], answer: 1, explanation: 'RICE (Reach, Impact, Confidence, Effort) is a prioritization framework for ranking product initiatives.' },
  ],
  j3: [
    { question: 'What is a Vector Database primarily used for in AI/ML applications?', options: ['Storing relational data', 'Storing and querying high-dimensional embeddings', 'Log storage', 'Model weight storage'], answer: 1, explanation: 'Vector databases store embeddings and enable similarity searches, essential for RAG and semantic search applications.' },
    { question: 'What does RAG stand for in LLM applications?', options: ['Retrieval-Augmented Generation', 'Random Access Generation', 'Recursive Attention Graph', 'Reinforced Agent Guidance'], answer: 0, explanation: 'RAG is a technique that retrieves relevant documents from a knowledge base and feeds them to an LLM to generate grounded answers.' },
    { question: 'In PyTorch, what is a `DataLoader` used for?', options: ['Defining neural network layers', 'Efficiently batching and loading datasets for training', 'Optimising model parameters', 'Evaluating model performance'], answer: 1, explanation: 'DataLoader wraps a Dataset and provides utilities for batching, shuffling, and parallel data loading.' },
    { question: 'What is MLOps focused on?', options: ['Model architecture design', 'Operationalizing ML models in production', 'Data collection processes', 'Research paper writing'], answer: 1, explanation: 'MLOps combines ML, DevOps, and data engineering to reliably and efficiently deploy and maintain ML models in production.' },
    { question: 'What is the vanishing gradient problem?', options: ['When model accuracy plateaus', 'When gradients become too small to effectively train deep networks', 'When training data runs out', 'When GPU memory is exhausted'], answer: 1, explanation: 'In deep networks, gradients shrink exponentially as they propagate back through layers, making early layers hard to train.' },
  ],
  j4: [
    { question: 'What is the primary purpose of a design system?', options: ['To replace all designers', 'To provide consistent, reusable UI components and design standards', 'To generate code automatically', 'To manage project timelines'], answer: 1, explanation: 'A design system is a single source of truth for design and code, enabling consistency and speed across teams.' },
    { question: 'What does WCAG stand for?', options: ['Web Content Accessibility Guidelines', 'Website Core Architecture Guide', 'Web Component Authoring Guide', 'Wireframe Creation Approach Guidelines'], answer: 0, explanation: 'WCAG (Web Content Accessibility Guidelines) sets standards for making web content more accessible to people with disabilities.' },
    { question: 'In user research, what is the difference between qualitative and quantitative data?', options: ['Quantitative is opinions, qualitative is numbers', 'Qualitative is opinions/insights, quantitative is measurable numerical data', 'They are the same', 'Qualitative data can only come from surveys'], answer: 1, explanation: 'Qualitative research (interviews, observations) gives deep insights into the "why", while quantitative (analytics, surveys) gives the "what" at scale.' },
    { question: 'What is the atomic design methodology?', options: ['A design approach using only minimal elements', 'A hierarchical approach (atoms → molecules → organisms → templates → pages)', 'A design tool by Adobe', 'A grid-based layout system'], answer: 1, explanation: 'Atomic Design breaks UIs into five stages from smallest (atoms like buttons) to largest (pages), enabling scalable design systems.' },
    { question: 'What is the purpose of A/B testing in UX?', options: ['To test technical performance', 'To compare two design variants to determine which performs better', 'To check for broken links', 'To run accessibility audits'], answer: 1, explanation: 'A/B testing shows different variations to different user segments and measures which achieves the desired outcome better.' },
  ],
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = ['Select Job', 'Configure', 'Generate & Preview', 'Save & Assign'];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm',
              idx < currentStep ? 'bg-emerald-500 text-white' :
              idx === currentStep ? 'bg-[#4880FF] text-white ring-4 ring-blue-100' :
              'bg-white border-2 border-gray-200 text-gray-400'
            )}>
              {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={cn(
              'text-[10px] font-semibold mt-1.5 whitespace-nowrap',
              idx === currentStep ? 'text-[#4880FF]' : idx < currentStep ? 'text-emerald-600' : 'text-gray-400'
            )}>{label}</span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={cn(
              'w-16 h-0.5 mx-1 mb-5 transition-all duration-500',
              idx < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Skill Tag ────────────────────────────────────────────────────────────────
function SkillTag({ skill, onRemove }: { skill: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-full">
      {skill}
      {onRemove && (
        <button onClick={onRemove} className="text-blue-400 hover:text-blue-700 transition-colors">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIMCQGeneratorPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedJob, setSelectedJob] = useState<typeof JOB_POSTS[0] | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [settings, setSettings] = useState({ numQuestions: 10, difficulty: 'Medium', timeLimit: 30, passingScore: 70 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<typeof GENERATED_QUESTIONS_MAP['j1']>([]);
  const [saved, setSaved] = useState(false);
  const [expandedQ, setExpandedQ] = useState<number | null>(0);

  const selectJob = (job: typeof JOB_POSTS[0]) => {
    setSelectedJob(job);
    setSkills([...job.skills]);
  };

  const removeSkill = (idx: number) => setSkills(prev => prev.filter((_, i) => i !== idx));
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const generate = async () => {
    setIsGenerating(true);
    setStep(2);
    await new Promise(r => setTimeout(r, 2800));
    if (selectedJob) {
      const pool = GENERATED_QUESTIONS_MAP[selectedJob.id] || GENERATED_QUESTIONS_MAP['j1'];
      setQuestions(pool.slice(0, settings.numQuestions));
    }
    setIsGenerating(false);
  };

  const regenerate = async () => {
    setIsGenerating(true);
    setQuestions([]);
    await new Promise(r => setTimeout(r, 2000));
    if (selectedJob) {
      const pool = GENERATED_QUESTIONS_MAP[selectedJob.id] || GENERATED_QUESTIONS_MAP['j1'];
      setQuestions([...pool].reverse().slice(0, settings.numQuestions));
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full min-w-0 overflow-y-auto bg-gradient-to-br from-[#f0f4ff] via-white to-[#f8f0ff]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4880FF] to-purple-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">AI MCQ Generator</h1>
              <p className="text-xs text-gray-500 mt-0.5">Powered by AI · JobsPark Intelligence</p>
            </div>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> AI Powered
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 py-8 max-w-5xl mx-auto w-full">
        <StepIndicator currentStep={step} />

        <AnimatePresence mode="wait">
          {/* ── STEP 0: Select Job ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Select a Job Post</h2>
                <p className="text-gray-500 mt-1">Choose the job to automatically populate skills and context</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {JOB_POSTS.map(job => (
                  <button
                    key={job.id}
                    onClick={() => { selectJob(job); setStep(1); }}
                    className={cn(
                      'text-left p-5 bg-white rounded-2xl border-2 shadow-sm hover:shadow-md hover:border-[#4880FF] transition-all duration-200 group',
                      selectedJob?.id === job.id ? 'border-[#4880FF] ring-4 ring-blue-50' : 'border-gray-100'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#4880FF] transition-colors">{job.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{job.department} · {job.location}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#4880FF] mt-1 transition-colors" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.experienceLevel}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.applicants} applicants</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 4).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">{s}</span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-semibold rounded-full">+{job.skills.length - 4} more</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Configure ── */}
          {step === 1 && selectedJob && (
            <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Configure Assessment</h2>
                <p className="text-gray-500 mt-1">Review job details and customize the assessment settings</p>
              </div>

              {/* Job Summary Card */}
              <div className="bg-gradient-to-r from-[#4880FF] to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Selected Job Post</p>
                    <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                    <p className="text-blue-100 mt-1">{selectedJob.department} · {selectedJob.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-200 text-xs">Experience</p>
                    <p className="text-sm font-bold">{selectedJob.experienceLevel}</p>
                    <button onClick={() => setStep(0)} className="text-blue-200 hover:text-white text-xs mt-2 underline">Change job</button>
                  </div>
                </div>
              </div>

              {/* Skills Editor */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h4 className="font-bold text-gray-900 mb-1">Required Skills</h4>
                <p className="text-xs text-gray-500 mb-4">These will be used to generate relevant questions. Add or remove skills as needed.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((s, i) => <SkillTag key={s} skill={s} onRemove={() => removeSkill(i)} />)}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill and press Enter..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF]"
                  />
                  <button onClick={addSkill} className="px-4 py-2 bg-blue-50 text-[#4880FF] rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              {/* Generation Settings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h4 className="font-bold text-gray-900 mb-4">Assessment Settings</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {/* Number of Questions */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Target className="w-3 h-3" /> Questions
                    </label>
                    <div className="flex items-center gap-2">
                      {[5, 10, 15, 20].map(n => (
                        <button key={n} onClick={() => setSettings(s => ({ ...s, numQuestions: n }))}
                          className={cn('flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all',
                            settings.numQuestions === n ? 'border-[#4880FF] bg-blue-50 text-[#4880FF]' : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'
                          )}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <BrainCircuit className="w-3 h-3" /> Difficulty
                    </label>
                    <div className="flex gap-2">
                      {['Easy', 'Medium', 'Hard'].map(d => (
                        <button key={d} onClick={() => setSettings(s => ({ ...s, difficulty: d }))}
                          className={cn('flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all',
                            settings.difficulty === d
                              ? d === 'Easy' ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                : d === 'Medium' ? 'border-amber-400 bg-amber-50 text-amber-700'
                                : 'border-red-400 bg-red-50 text-red-700'
                              : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'
                          )}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Limit */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Time Limit
                    </label>
                    <div className="relative">
                      <select
                        value={settings.timeLimit}
                        onChange={e => setSettings(s => ({ ...s, timeLimit: Number(e.target.value) }))}
                        className="w-full appearance-none px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#4880FF] pr-8"
                      >
                        {[15, 20, 30, 45, 60, 90].map(t => <option key={t} value={t}>{t} mins</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Passing Score */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passing Score
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min={50} max={90} step={5}
                        value={settings.passingScore}
                        onChange={e => setSettings(s => ({ ...s, passingScore: Number(e.target.value) }))}
                        className="flex-1 accent-[#4880FF]"
                      />
                      <span className="text-sm font-bold text-[#4880FF] w-10 text-right">{settings.passingScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary + CTA */}
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-[#4880FF]" /> <strong className="text-gray-900">{settings.numQuestions}</strong> questions</span>
                  <span className="flex items-center gap-1.5"><BrainCircuit className="w-4 h-4 text-[#4880FF]" /> <strong className="text-gray-900">{settings.difficulty}</strong></span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#4880FF]" /> <strong className="text-gray-900">{settings.timeLimit} mins</strong></span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#4880FF]" /> Pass at <strong className="text-gray-900">{settings.passingScore}%</strong></span>
                </div>
                <button
                  onClick={generate}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#4880FF] to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" /> Generate Assessment
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Generate & Preview ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isGenerating ? 'Generating Questions...' : 'Preview Assessment'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {isGenerating ? `AI is crafting ${settings.numQuestions} ${settings.difficulty.toLowerCase()} questions for ${selectedJob?.title}` : `${questions.length} questions generated · Review before saving`}
                </p>
              </div>

              {/* Loading State */}
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse" />
                    <div className="absolute inset-2 rounded-full border-4 border-t-[#4880FF] border-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainCircuit className="w-8 h-8 text-[#4880FF]" />
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    {['Analyzing job requirements...', 'Mapping skill competencies...', 'Drafting MCQ questions...', 'Validating answers...'].map((label, i) => (
                      <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}
                        className="text-sm text-gray-500 flex items-center gap-2 justify-center"
                      >
                        <Loader2 className="w-3 h-3 animate-spin text-[#4880FF]" /> {label}
                      </motion.p>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions Preview */}
              {!isGenerating && questions.length > 0 && (
                <div className="space-y-4">
                  {/* Assessment Header Card */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <BrainCircuit className="w-5 h-5 text-[#4880FF]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{selectedJob?.title} — {settings.difficulty} MCQ</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
                        <span>{questions.length} questions</span>
                        <span>·</span>
                        <span>{settings.timeLimit} min limit</span>
                        <span>·</span>
                        <span>Pass at {settings.passingScore}%</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Generated
                    </span>
                  </div>

                  {questions.map((q, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-blue-50 text-[#4880FF] text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          <span className="font-medium text-gray-900 text-sm">{q.question}</span>
                        </div>
                        <ChevronDown className={cn('w-4 h-4 text-gray-400 flex-shrink-0 ml-4 transition-transform', expandedQ === i ? 'rotate-180' : '')} />
                      </button>

                      <AnimatePresence>
                        {expandedQ === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="px-6 pb-5 border-t border-gray-50">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                {q.options.map((opt, oi) => (
                                  <div key={oi} className={cn(
                                    'flex items-center gap-2.5 p-3 rounded-xl border text-sm transition-all',
                                    oi === q.answer
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                                      : 'bg-gray-50 border-gray-100 text-gray-700'
                                  )}>
                                    <span className={cn(
                                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                                      oi === q.answer ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
                                    )}>
                                      {String.fromCharCode(65 + oi)}
                                    </span>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
                                <strong>Explanation:</strong> {q.explanation}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  {/* Action Bar */}
                  <div className="flex items-center gap-3 pt-4">
                    <button onClick={regenerate} className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 bg-white text-gray-700 rounded-xl font-medium hover:border-gray-300 transition-all text-sm">
                      <RefreshCw className="w-4 h-4" /> Regenerate
                    </button>
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 bg-white text-gray-700 rounded-xl font-medium hover:border-gray-300 transition-all text-sm">
                      <RotateCcw className="w-4 h-4" /> Edit Settings
                    </button>
                    <div className="flex-1" />
                    <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4880FF] to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm">
                      <ChevronRight className="w-4 h-4" /> Save & Assign →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Save & Assign ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Save & Assign Assessment</h2>
                <p className="text-gray-500 mt-1">Choose candidates to assign this assessment to</p>
              </div>

              {/* Assessment Summary */}
              <div className="p-5 bg-gradient-to-r from-[#4880FF] to-purple-600 rounded-2xl text-white mb-6 shadow-lg shadow-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedJob?.title} Assessment</h3>
                    <div className="flex gap-4 text-blue-100 text-sm mt-0.5">
                      <span>{questions.length} questions</span>
                      <span>·</span>
                      <span>{settings.difficulty}</span>
                      <span>·</span>
                      <span>{settings.timeLimit} min</span>
                      <span>·</span>
                      <span>Pass at {settings.passingScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-4">Assign to Candidates in HR Interview Stage</h4>
                {[
                  { name: 'Sarah Smith', initials: 'SS', color: 'bg-pink-500', stage: 'HR Interview', status: 'Awaiting Assessment' },
                  { name: 'Alex Brown', initials: 'AB', color: 'bg-blue-500', stage: 'HR Interview', status: 'Awaiting Assessment' },
                  { name: 'David Lee', initials: 'DL', color: 'bg-indigo-500', stage: 'HR Interview', status: 'Awaiting Assessment' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white', c.color)}>{c.initials}</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.stage}</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full font-medium">{c.status}</span>
                  </div>
                ))}
              </div>

              {/* Final Actions */}
              {!saved ? (
                <div className="flex gap-3">
                  <button onClick={() => router.back()} className="px-6 py-3 border-2 border-gray-200 bg-white text-gray-700 rounded-xl font-medium hover:border-gray-300 transition-all">
                    Cancel
                  </button>
                  <button onClick={() => setSaved(true)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#4880FF] text-[#4880FF] rounded-xl font-bold hover:bg-blue-50 transition-all">
                    <Save className="w-4 h-4" /> Save Only
                  </button>
                  <button onClick={() => setSaved(true)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4880FF] to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-200">
                    <Send className="w-4 h-4" /> Save & Send to Candidates
                  </button>
                </div>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-4"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Assessment Sent! 🎉</h3>
                  <p className="text-gray-500 text-center">3 candidates have been notified and can start their assessment.</p>
                  <button onClick={() => router.push('/recruiter/task-management')} className="mt-2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4880FF] to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                    View in Task Management →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
