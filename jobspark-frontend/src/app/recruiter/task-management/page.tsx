'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, Filter, Plus, FileText, FileDown,
  BrainCircuit, Clock, CheckCircle2, AlertCircle, PlayCircle, MoreVertical 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Hardcoded Data
const tasks = [
  {
    id: 't1',
    type: 'MCQ',
    title: 'React Fundamentals MCQ',
    candidate: { name: 'Sarah Smith', initials: 'SS', color: 'bg-pink-600' },
    status: 'Submitted',
    priority: 'High',
    isAiGenerated: true,
    details: {
      questions: 20,
      duration: '30 mins',
      passingScore: 70,
      candidateScore: 85,
    },
    dueDate: 'Oct 28, 2023',
    generatedDate: 'Oct 25, 2023',
    difficulty: 'Intermediate'
  },
  {
    id: 't2',
    type: 'Text',
    title: 'Product Analysis Assignment',
    candidate: { name: 'Alex Brown', initials: 'AB', color: 'bg-blue-600' },
    status: 'In Progress',
    priority: 'Medium',
    isAiGenerated: false,
    details: {
      instructions: 'Please analyze the given product metrics and write a 2-page summary on potential growth areas focusing on user retention.',
    },
    dueDate: 'Nov 2, 2023'
  },
  {
    id: 't3',
    type: 'PDF',
    title: 'Backend Architecture Design',
    candidate: { name: 'Michael Johnson', initials: 'MJ', color: 'bg-orange-500' },
    status: 'Under Review',
    priority: 'Urgent',
    isAiGenerated: false,
    details: {
      fileName: 'System_Design_Requirements_v2.pdf',
      fileSize: '2.4 MB',
    },
    dueDate: 'Oct 26, 2023'
  },
  {
    id: 't4',
    type: 'MCQ',
    title: 'AI Frontend Assessment',
    candidate: { name: 'John Doe', initials: 'JD', color: 'bg-zinc-800' },
    status: 'Pending',
    priority: 'High',
    isAiGenerated: true,
    details: {
      questions: 15,
      duration: '45 mins',
      passingScore: 80,
    },
    dueDate: 'Nov 5, 2023',
    generatedDate: 'Oct 28, 2023',
    difficulty: 'Advanced'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Submitted': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Under Review': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Urgent': return 'text-red-600 bg-red-50';
    case 'High': return 'text-orange-600 bg-orange-50';
    case 'Medium': return 'text-blue-600 bg-blue-50';
    case 'Low': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export default function TaskManagementPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(t => 
    (filter === 'All' || t.type === filter) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.candidate.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 bg-[#f8f9fc] min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Task Management</h1>
          <p className="text-gray-500 mt-1">Assign, track, and review candidate assessments</p>
        </div>
        <Button className="bg-[#4880FF] hover:bg-blue-600 shadow-sm"><Plus className="w-4 h-4 mr-2" /> Create Task</Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          {['All', 'MCQ', 'Text', 'PDF'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                filter === f ? "bg-[#4880FF] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {f} Tasks
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF] transition-all"
            />
          </div>
          <Button variant="outline" className="text-gray-600 border-gray-200 shadow-sm"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTasks.map((task, idx) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Card className="flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow border-gray-100 overflow-hidden group">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2 items-center">
                      <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border", getStatusColor(task.status))}>
                        {task.status}
                      </span>
                      {task.isAiGenerated && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                          <BrainCircuit className="w-3 h-3" /> AI Generated
                        </span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-[#4880FF] transition-colors line-clamp-1">{task.title}</h3>
                  <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
                    <span className={cn("px-2 py-0.5 rounded font-medium", getPriorityColor(task.priority))}>{task.priority} Priority</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {task.dueDate}</span>
                  </div>

                  {/* Task Specific Details */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4 h-28">
                    {task.type === 'MCQ' && task.details && (
                      <div className="flex flex-col h-full justify-center">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Questions</p>
                            <p className="text-sm font-bold text-gray-900">{task.details.questions} ({task.details.duration})</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Passing Score</p>
                            <p className="text-sm font-bold text-gray-900">{task.details.passingScore}%</p>
                          </div>
                        </div>
                        {task.status === 'Submitted' && task.details.candidateScore && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", task.details.candidateScore >= task.details.passingScore ? "bg-emerald-500" : "bg-red-500")} style={{ width: `${task.details.candidateScore}%` }} />
                            </div>
                            <span className={cn("text-xs font-bold", task.details.candidateScore >= task.details.passingScore ? "text-emerald-600" : "text-red-600")}>{task.details.candidateScore}% Scored</span>
                          </div>
                        )}
                      </div>
                    )}

                    {task.type === 'Text' && task.details && (
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <FileText className="w-4 h-4 text-[#4880FF]" />
                          <span className="text-xs font-bold uppercase tracking-wider">Written Task</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{task.details.instructions}</p>
                      </div>
                    )}

                    {task.type === 'PDF' && task.details && (
                      <div className="flex flex-col h-full justify-center items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2">
                          <FileDown className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{task.details.fileName}</p>
                        <p className="text-xs text-gray-500">{task.details.fileSize}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate Assignment Footer */}
                <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-white shadow-sm">
                      <AvatarFallback className={cn("text-xs font-medium text-white", task.candidate.color)}>{task.candidate.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium">Assigned to</p>
                      <p className="text-sm font-bold text-gray-900 leading-none">{task.candidate.name}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#4880FF] hover:bg-blue-50 font-medium text-xs h-8">View Details</Button>
                </div>
              </Card>
            </motion.div>
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
    </div>
  );
}
