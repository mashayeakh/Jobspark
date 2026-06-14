'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Search, Filter, Plus, FileText, FileDown, Sparkles, X,
  BrainCircuit, Clock, CheckCircle2, AlertCircle, MoreVertical, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Hardcoded Seed Tasks ─────────────────────────────────────────────────────
const seedTasks = [
  {
    id: 't1', type: 'MCQ', title: 'React Fundamentals MCQ',
    candidate: { name: 'Sarah Smith', initials: 'SS', color: 'bg-pink-600' },
    status: 'Submitted', priority: 'High', isAiGenerated: true, dueDate: 'Oct 28, 2023',
    details: { questions: 20, duration: '30 mins', passingScore: 70, candidateScore: 85 },
  },
  {
    id: 't2', type: 'Text', title: 'Product Analysis Assignment',
    candidate: { name: 'Alex Brown', initials: 'AB', color: 'bg-blue-600' },
    status: 'In Progress', priority: 'Medium', isAiGenerated: false, dueDate: 'Nov 2, 2023',
    details: { instructions: 'Analyze the given product metrics and write a 2-page summary on potential growth areas focusing on user retention.' },
  },
  {
    id: 't3', type: 'PDF', title: 'Backend Architecture Design',
    candidate: { name: 'Michael Johnson', initials: 'MJ', color: 'bg-orange-500' },
    status: 'Under Review', priority: 'Urgent', isAiGenerated: false, dueDate: 'Oct 26, 2023',
    details: { fileName: 'System_Design_Requirements_v2.pdf', fileSize: '2.4 MB' },
  },
  {
    id: 't4', type: 'MCQ', title: 'AI Frontend Assessment',
    candidate: { name: 'John Doe', initials: 'JD', color: 'bg-zinc-800' },
    status: 'Pending', priority: 'High', isAiGenerated: true, dueDate: 'Nov 5, 2023',
    details: { questions: 15, duration: '45 mins', passingScore: 80 },
  },
];

type MCQDetails = {
  questions: number;
  duration: string;
  passingScore: number;
  candidateScore?: number;
};

type TextDetails = {
  instructions: string;
};

type PDFDetails = {
  fileName: string;
  fileSize: string;
};

type TaskDetails = MCQDetails | TextDetails | PDFDetails;

type Task = {
  id: string;
  type: string;
  title: string;
  candidate: { name: string; initials: string; color: string };
  status: string;
  priority: string;
  isAiGenerated: boolean;
  dueDate: string;
  details: TaskDetails;
};

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    'Pending': 'bg-gray-100 text-gray-700 border-gray-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Submitted': 'bg-amber-100 text-amber-700 border-amber-200',
    'Under Review': 'bg-purple-100 text-purple-700 border-purple-200',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
};

const getPriorityColor = (priority: string) => {
  const map: Record<string, string> = {
    'Urgent': 'text-red-600 bg-red-50',
    'High': 'text-orange-600 bg-orange-50',
    'Medium': 'text-blue-600 bg-blue-50',
    'Low': 'text-gray-600 bg-gray-50',
  };
  return map[priority] ?? 'text-gray-600 bg-gray-50';
};

// ─── Create Task Modal ────────────────────────────────────────────────────────
function CreateTaskModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, isAi: boolean) => void;
}) {
  const [name, setName] = useState('');
  const [isAi, setIsAi] = useState<boolean | null>(null);

  const handleCreate = () => {
    if (!name.trim() || isAi === null) return;
    onCreate(name.trim(), isAi);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
            <p className="text-sm text-gray-500 mt-0.5">Name your task and choose the type</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Name */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-semibold text-gray-700">Task Name</label>
          <input
            type="text"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="e.g. React Fundamentals Assessment"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4880FF] focus:bg-white transition-all"
          />
        </div>

        {/* Task Type */}
        <div className="space-y-2 mb-8">
          <label className="text-sm font-semibold text-gray-700">Task Type</label>
          <div className="grid grid-cols-2 gap-3">
            {/* AI Generated */}
            <button
              onClick={() => setIsAi(true)}
              className={cn(
                'flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                isAi === true
                  ? 'border-purple-400 bg-gradient-to-br from-blue-50 to-purple-50 ring-4 ring-purple-100'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                isAi === true ? 'bg-gradient-to-br from-[#4880FF] to-purple-600 shadow-lg shadow-blue-200' : 'bg-gray-100'
              )}>
                <BrainCircuit className={cn('w-5 h-5', isAi === true ? 'text-white' : 'text-gray-400')} />
              </div>
              <div>
                <p className={cn('font-bold text-sm', isAi === true ? 'text-gray-900' : 'text-gray-600')}>AI Generated</p>
                <p className="text-xs text-gray-400 mt-0.5">Auto-generate MCQ questions with AI</p>
              </div>
              {isAi === true && (
                <span className="text-[10px] font-bold bg-gradient-to-r from-[#4880FF] to-purple-600 text-white px-2.5 py-1 rounded-full">
                  ✦ SMART
                </span>
              )}
            </button>

            {/* Manual */}
            <button
              onClick={() => setIsAi(false)}
              className={cn(
                'flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                isAi === false
                  ? 'border-emerald-400 bg-emerald-50 ring-4 ring-emerald-100'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                isAi === false ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-gray-100'
              )}>
                <FileText className={cn('w-5 h-5', isAi === false ? 'text-white' : 'text-gray-400')} />
              </div>
              <div>
                <p className={cn('font-bold text-sm', isAi === false ? 'text-gray-900' : 'text-gray-600')}>Manual Task</p>
                <p className="text-xs text-gray-400 mt-0.5">Write your own questions or upload a PDF</p>
              </div>
              {isAi === false && (
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                  ✓ SELECTED
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || isAi === null}
            className={cn(
              'flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2',
              name.trim() && isAi !== null
                ? 'bg-gradient-to-r from-[#4880FF] to-purple-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Task Detail Modal ────────────────────────────────────────────────────────
function TaskDetailModal({ task, onClose, onLaunchAi }: {
  task: Task;
  onClose: () => void;
  onLaunchAi: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border', getStatusColor(task.status))}>{task.status}</span>
            {task.isAiGenerated && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                <BrainCircuit className="w-3 h-3" /> AI Generated
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"><X className="w-4 h-4" /></button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">{task.title}</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <span className={cn('px-2 py-0.5 rounded font-medium', getPriorityColor(task.priority))}>{task.priority} Priority</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {task.dueDate}</span>
        </div>

        {/* Task details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
          {task.type === 'MCQ' && task.details && 'questions' in task.details && (
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[10px] text-gray-500 font-semibold uppercase mb-1">Questions</p><p className="text-sm font-bold text-gray-900">{task.details.questions} ({task.details.duration})</p></div>
              <div><p className="text-[10px] text-gray-500 font-semibold uppercase mb-1">Passing Score</p><p className="text-sm font-bold text-gray-900">{task.details.passingScore}%</p></div>
            </div>
          )}
          {task.type === 'Text' && task.details && 'instructions' in task.details && (
            <p className="text-sm text-gray-700 leading-relaxed">{task.details.instructions}</p>
          )}
          {task.type === 'PDF' && task.details && 'fileName' in task.details && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><FileDown className="w-5 h-5 text-red-500" /></div>
              <div><p className="text-sm font-bold text-gray-900">{task.details.fileName}</p><p className="text-xs text-gray-500">{task.details.fileSize}</p></div>
            </div>
          )}
        </div>

        {/* AI MCQ Launch CTA — only show for AI Generated tasks */}
        {task.isAiGenerated && (
          <button
            onClick={onLaunchAi}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#4880FF] to-purple-600 rounded-2xl text-white mb-4 hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.01] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Generate AI-Powered MCQ</p>
                <p className="text-blue-100 text-xs">Select a job post → AI builds questions → Assign to candidate</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Assignee */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <Avatar className="w-8 h-8 border border-white shadow-sm">
            <AvatarFallback className={cn('text-xs font-bold text-white', task.candidate.color)}>{task.candidate.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[10px] text-gray-500 font-medium">Assigned to</p>
            <p className="text-sm font-bold text-gray-900">{task.candidate.name}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
      <Card
        onClick={onClick}
        className="flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-all border-gray-100 overflow-hidden group cursor-pointer hover:-translate-y-0.5"
      >
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2 items-center flex-wrap">
              <span className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border', getStatusColor(task.status))}>{task.status}</span>
              {task.isAiGenerated && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                  <BrainCircuit className="w-3 h-3" /> AI Generated
                </span>
              )}
            </div>
            <button className="text-gray-400 hover:text-gray-900 transition-colors" onClick={e => e.stopPropagation()}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#4880FF] transition-colors line-clamp-1">{task.title}</h3>
          <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
            <span className={cn('px-2 py-0.5 rounded font-medium', getPriorityColor(task.priority))}>{task.priority} Priority</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {task.dueDate}</span>
          </div>

          {/* Task content */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4 h-28">
            {task.type === 'MCQ' && task.details && 'questions' in task.details && (
              <div className="flex flex-col h-full justify-center">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div><p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Questions</p><p className="text-sm font-bold text-gray-900">{task.details.questions} ({task.details.duration})</p></div>
                  <div><p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Passing Score</p><p className="text-sm font-bold text-gray-900">{task.details.passingScore}%</p></div>
                </div>
                {'candidateScore' in task.details && task.details.candidateScore && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${task.details.candidateScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{task.details.candidateScore}% Scored</span>
                  </div>
                )}
              </div>
            )}
            {task.type === 'Text' && task.details && 'instructions' in task.details && (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <FileText className="w-4 h-4 text-[#4880FF]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Written Task</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{task.details.instructions}</p>
              </div>
            )}
            {task.type === 'PDF' && task.details && 'fileName' in task.details && (
              <div className="flex flex-col h-full justify-center items-center text-center">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2"><FileDown className="w-5 h-5 text-red-500" /></div>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{task.details.fileName}</p>
                <p className="text-xs text-gray-500">{task.details.fileSize}</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border border-white shadow-sm">
              <AvatarFallback className={cn('text-xs font-medium text-white', task.candidate.color)}>{task.candidate.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] text-gray-500 font-medium">Assigned to</p>
              <p className="text-sm font-bold text-gray-900 leading-none">{task.candidate.name}</p>
            </div>
          </div>
          <span className="text-xs text-[#4880FF] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TaskManagementPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(t =>
    (filter === 'All' || t.type === filter) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.candidate.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (name: string, isAi: boolean) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      type: isAi ? 'MCQ' : 'Text',
      title: name,
      candidate: { name: 'Unassigned', initials: '?', color: 'bg-gray-400' },
      status: 'Pending',
      priority: 'Medium',
      isAiGenerated: isAi,
      dueDate: 'TBD',
      details: isAi
        ? { questions: 0, duration: 'TBD', passingScore: 70 }
        : { instructions: 'No instructions added yet.' },
    };
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 bg-[#f8f9fc] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Task Management</h1>
          <p className="text-gray-500 mt-1">Assign, track, and review candidate assessments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4880FF] hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm transition-all hover:shadow-md"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          {['All', 'MCQ', 'Text', 'PDF'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                filter === f ? 'bg-[#4880FF] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {f === 'All' ? 'All Tasks' : `${f} Tasks`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidate or task..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
            <AlertCircle className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900">No tasks found</h3>
            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateTaskModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreate}
          />
        )}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onLaunchAi={() => {
              setSelectedTask(null);
              router.push('/recruiter/ai-mcq-generator');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
