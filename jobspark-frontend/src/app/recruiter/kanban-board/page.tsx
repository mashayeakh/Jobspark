/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, CheckCircle2, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

type Candidate = {
  id: string;
  name: string;
  initials: string;
  stage: string;
  assignmentStatus: string;
  avatarColor: string;
};

type GroupedTask = {
  id: string;
  title: string;
  taskType: string;
  priority: Priority;
  dueDate: string;
  completionPercentage: number;
  comments: number;
  candidates: Candidate[];
};

type ColumnData = {
  id: string;
  title: string;
  color: string;
  items: GroupedTask[];
};

const initialData: Record<string, ColumnData> = {
  applied: {
    id: 'applied',
    title: 'Applied',
    color: 'bg-blue-500',
    items: [
      {
        id: 'task-1',
        title: 'Initial Screening',
        taskType: 'General',
        priority: 'Medium',
        dueDate: '3 days left',
        completionPercentage: 0,
        comments: 2,
        candidates: [
          { id: 'c1', name: 'John Doe', initials: 'JD', stage: 'Applied', assignmentStatus: 'Pending', avatarColor: 'bg-zinc-800' },
          { id: 'c2', name: 'Emma Wilson', initials: 'EW', stage: 'Applied', assignmentStatus: 'Pending', avatarColor: 'bg-emerald-600' }
        ]
      }
    ]
  },
  hr_round: {
    id: 'hr_round',
    title: 'HR Round',
    color: 'bg-purple-500',
    items: [
      {
        id: 'task-2',
        title: 'Culture Fit Assessment',
        taskType: 'Interview',
        priority: 'High',
        dueDate: 'Tomorrow',
        completionPercentage: 50,
        comments: 5,
        candidates: [
          { id: 'c3', name: 'Michael Johnson', initials: 'MJ', stage: 'HR Round', assignmentStatus: 'Scheduled', avatarColor: 'bg-orange-500' }
        ]
      }
    ]
  },
  assessment: {
    id: 'assessment',
    title: 'Assessment',
    color: 'bg-amber-500',
    items: [
      {
        id: 'task-3',
        title: 'AI Frontend Assessment',
        taskType: 'Coding Task',
        priority: 'Urgent',
        dueDate: 'Today',
        completionPercentage: 80,
        comments: 12,
        candidates: [
          { id: 'c4', name: 'Sarah Smith', initials: 'SS', stage: 'Assessment', assignmentStatus: 'In Progress', avatarColor: 'bg-pink-600' },
          { id: 'c5', name: 'Alex Brown', initials: 'AB', stage: 'Assessment', assignmentStatus: 'Submitted', avatarColor: 'bg-blue-600' }
        ]
      },
      {
        id: 'task-4',
        title: 'React Dashboard Challenge',
        taskType: 'Project',
        priority: 'Medium',
        dueDate: 'Next Week',
        completionPercentage: 20,
        comments: 1,
        candidates: [
          { id: 'c6', name: 'David Lee', initials: 'DL', stage: 'Assessment', assignmentStatus: 'Pending', avatarColor: 'bg-indigo-500' }
        ]
      }
    ]
  },
  interview: {
    id: 'interview',
    title: 'Interview',
    color: 'bg-emerald-500',
    items: []
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'Urgent': return 'bg-red-100 text-red-700';
    case 'High': return 'bg-orange-100 text-orange-700';
    case 'Medium': return 'bg-blue-100 text-blue-700';
    case 'Low': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

import { recruiterService } from '@/services/recruiterService';
import { companyService } from '@/services/companyService';

export default function KanbanBoardPage() {
  const [columns, setColumns] = useState<Record<string, ColumnData>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('By Status');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await recruiterService.getProfile();
        if (profileRes.success && profileRes.data) {
          const cId = profileRes.data.companyId;
          const stagesData = await companyService.getPipelineStages(cId);

          if (stagesData && stagesData.length > 0) {
            const dynamicColumns: Record<string, ColumnData> = {};
            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500', 'bg-pink-500', 'bg-indigo-500'];

            stagesData.forEach((stage: any, index: number) => {
              // Map existing initialData to the dynamic stages if they match loosely, or just empty
              const matchedKey = Object.keys(initialData).find(k => initialData[k].title.toLowerCase().includes(stage.name.toLowerCase()) || stage.name.toLowerCase().includes(initialData[k].title.toLowerCase()));

              dynamicColumns[stage.id] = {
                id: stage.id,
                title: stage.name,
                color: stage.color || colors[index % colors.length],
                items: matchedKey ? initialData[matchedKey].items : []
              };
            });
            setColumns(dynamicColumns);
          } else {
            setColumns(initialData);
          }
        } else {
          setColumns(initialData);
        }
      } catch (e) {
        console.error("Failed to fetch kanban stages:", e);
        setColumns(initialData);
      } finally {
        setLoading(false);
        setIsMounted(true);
      }
    };

    fetchData();
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceItems = [...sourceCol.items];
    const destItems = source.droppableId === destination.droppableId ? sourceItems : [...destCol.items];

    const [removed] = sourceItems.splice(source.index, 1);

    // Update stage of candidates within the moved task if moving to a new column
    if (source.droppableId !== destination.droppableId) {
      removed.candidates = removed.candidates.map(c => ({
        ...c,
        stage: destCol.title
      }));
    }

    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, items: sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems }
    });
  };

  if (!isMounted || loading) return <div className="p-8 text-gray-500">Loading Kanban Board...</div>;

  return (
    <div className="flex flex-1 flex-col p-8 bg-[#f8f9fc] h-full min-w-0">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kanban Dashboard</h1>
          <p className="text-gray-500 mt-1">Madfdsfdsfdnage recruitment pipeline and candidate tasks</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
            {['By Status', 'Tasks Due', 'Completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                  activeFilter === filter
                    ? "bg-[#4880FF] text-white shadow-sm"
                    : filter === 'Completed'
                      ? "text-gray-500 border border-gray-200 hover:text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-[#4880FF] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Assign a new text, PDF, or MCQ assessment to a candidate.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="e.g. React fundamentals MCQ" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instructions</label>
                  <textarea className="w-full px-3 py-2 border rounded-md" placeholder="Describe what the candidate needs to do..." rows={3}></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 border rounded-md text-sm font-medium">Cancel</button>
                <button className="px-4 py-2 bg-[#4880FF] text-white rounded-md text-sm font-medium">Send to candidate</button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 no-scrollbar pr-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="w-full flex flex-col min-h-[450px] max-h-[800px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white", column.color)}>
                      {column.items.length}
                    </span>
                    <h2 className="font-semibold text-gray-700">{column.title}</h2>
                  </div>
                  <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex-1 overflow-y-auto min-h-[200px] rounded-xl transition-colors custom-scrollbar pr-2",
                        snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                      )}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4 focus:outline-none"
                              style={{ ...provided.draggableProps.style }}
                            >
                              <Card
                                className={cn(
                                  "p-4 bg-white border border-gray-100 transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md",
                                  snapshot.isDragging ? "shadow-xl ring-2 ring-[#4880FF]/20 rotate-1 scale-[1.02]" : "shadow-sm"
                                )}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", getPriorityColor(item.priority))}>
                                    {item.priority}
                                  </span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                </div>

                                <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.title}</h3>
                                <p className="text-xs text-gray-500 mb-4">{item.taskType} • {item.candidates.length} Candidate{item.candidates.length !== 1 ? 's' : ''}</p>

                                {item.candidates.length > 0 && (
                                  <div className="bg-gray-50 rounded-lg p-2.5 mb-4 space-y-2 border border-gray-100">
                                    {item.candidates.map(candidate => (
                                      <div key={candidate.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Avatar className="w-5 h-5 border border-white shadow-sm">
                                            <AvatarFallback className={cn("text-[8px] text-white", candidate.avatarColor)}>
                                              {candidate.initials}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs font-medium text-gray-700">{candidate.name}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-sm">
                                          {candidate.assignmentStatus}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between text-gray-400">
                                  <div className="flex -space-x-2">
                                    {item.candidates.slice(0, 3).map((candidate, i) => (
                                      <Avatar key={i} className="w-6 h-6 border-2 border-white shadow-sm ring-1 ring-black/5">
                                        <AvatarFallback className={cn("text-[9px] text-white", candidate.avatarColor)}>
                                          {candidate.initials}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {item.candidates.length > 3 && (
                                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-gray-600 shadow-sm ring-1 ring-black/5">
                                        +{item.candidates.length - 3}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 text-xs font-medium">
                                    <div className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>{item.comments}</span>
                                    </div>
                                    <div className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>{item.completionPercentage}%</span>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
