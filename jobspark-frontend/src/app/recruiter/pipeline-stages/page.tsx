/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit2, Trash2, Plus, Users, ArrowRight, CheckCircle2, Clock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { recruiterService } from '@/services/recruiterService';
import { companyService } from '@/services/companyService';

const candidateTimeline = [
  { id: 1, title: 'Application Submitted', date: 'Oct 24, 2023', icon: Users, status: 'completed' },
  { id: 2, title: 'HR Round Invitation Sent', date: 'Oct 25, 2023', icon: Mail, status: 'completed' },
  { id: 3, title: 'HR Interview Completed', date: 'Oct 27, 2023', icon: CheckCircle2, status: 'completed' },
  { id: 4, title: 'Assessment Assigned', date: 'Oct 28, 2023', icon: Clock, status: 'current' },
  { id: 5, title: 'Technical Interview', date: 'Pending', icon: Users, status: 'upcoming' },
];

export default function PipelineStagesPage() {
  const [stages, setStages] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await recruiterService.getProfile();
        if (profileRes.success && profileRes.data) {
          const cId = profileRes.data.companyId;
          setCompanyId(cId);
          
          const stagesData = await companyService.getPipelineStages(cId);
          if (stagesData && stagesData.length > 0) {
            setStages(stagesData.map((s: any) => ({ ...s, candidates: Math.floor(Math.random() * 50), conversion: '50%', active: false, completed: false })));
          } else {
            // Default stages if none exist
            setStages([
              { id: '1', name: 'Applied', candidates: 45, conversion: '100%', active: false, completed: true },
              { id: '2', name: 'HR Review', candidates: 25, conversion: '55%', active: false, completed: true },
              { id: '3', name: 'Hired', candidates: 1, conversion: '100%', active: false, completed: false }
            ]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReorder = async (newStages: any[]) => {
    setStages(newStages);
  };

  const saveOrder = async () => {
    if (!companyId) return;
    const stagesToSave = stages.map((s, idx) => ({ id: s.id, order: idx + 1 }));
    await companyService.reorderPipelineStages(companyId, stagesToSave);
    alert("Pipeline order saved!");
  };

  const handleAddStage = async () => {
    if (!companyId) return;
    const name = prompt("Enter new stage name:");
    if (!name) return;
    
    // We want to insert the new stage just before the last stage (which is usually the final outcome like 'Offer Sent')
    const insertIndex = stages.length > 0 ? stages.length - 1 : 0;
    
    const newStage = await companyService.createPipelineStage(companyId, { name, order: insertIndex + 1 });
    if (newStage) {
      const newStageObj = { ...newStage, candidates: 0, conversion: '0%', active: false, completed: false };
      
      const newStages = [...stages];
      // Insert at second to last position
      newStages.splice(insertIndex, 0, newStageObj);
      setStages(newStages);
      
      // Automatically save the new order
      const stagesToSave = newStages.map((s, idx) => ({ id: s.id, order: idx + 1 }));
      await companyService.reorderPipelineStages(companyId, stagesToSave);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!companyId) return;
    if (confirm("Are you sure you want to delete this stage?")) {
      await companyService.deletePipelineStage(companyId, stageId);
      setStages(stages.filter(s => s.id !== stageId));
    }
  };

  if (loading) return <div className="p-8">Loading pipeline stages...</div>;

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 bg-[#f8f9fc] min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pipeline Stages</h1>
          <p className="text-gray-500 mt-1">Configure your hiring process and track candidate progression</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={saveOrder} variant="outline" className="font-medium shadow-sm">Save Order</Button>
          <Button onClick={handleAddStage} className="bg-[#4880FF] hover:bg-blue-600 shadow-sm"><Plus className="w-4 h-4 mr-2" /> Add Stage</Button>
        </div>
      </div>

      {/* Horizontal Pipeline Visualization */}
      <Card className="p-6 bg-white shadow-sm border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-gray-900">Hiring Funnel Overview</h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Total Candidates: 45</span>
        </div>
        
        <div className="flex items-start justify-between relative overflow-x-auto custom-scrollbar pb-4">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
          
          {stages.map((stage, idx) => (
            <div key={stage.id} className="flex flex-col items-center relative min-w-[120px] group cursor-pointer">
              {/* Progress Connector Fill */}
              {idx !== 0 && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: stage.completed || stage.active ? '100%' : '0%' }}
                  className={cn(
                    "absolute top-5 right-[50%] h-1 -z-10",
                    stage.active ? "bg-[#4880FF]" : "bg-emerald-500"
                  )}
                  style={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              )}
              
              {/* Stage Node */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: idx * 0.1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-sm",
                  stage.completed ? "bg-emerald-500 text-white" : 
                  stage.active ? "bg-[#4880FF] text-white ring-4 ring-blue-100" : "bg-white border-2 border-gray-200 text-gray-400"
                )}
              >
                {stage.completed ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
              </motion.div>
              
              <div className="text-center">
                <p className={cn("text-xs font-bold mb-1 transition-colors", stage.active ? "text-[#4880FF]" : "text-gray-700")}>{stage.name}</p>
                <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full mt-2 bg-gray-900 text-white p-2 rounded shadow-lg z-20 whitespace-nowrap">
                  <span className="text-xs font-medium">{stage.candidates} Candidates</span>
                  <span className="text-[10px] text-gray-400">Conversion: {stage.conversion}</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{stage.candidates}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Pipeline Configuration List (Image 3 reference) */}
        <Card className="lg:col-span-2 p-6 bg-[#1a1c23] border-[#2d303a] shadow-xl text-white rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold">Pipeline stages</h2>
              <p className="text-xs text-gray-400 mt-1">Drag to reorder · Applied to: Senior React Dev</p>
            </div>
          </div>
          
          <Reorder.Group axis="y" values={stages} onReorder={handleReorder} className="space-y-3">
            {stages.map((stage, idx) => (
              <Reorder.Item 
                key={stage.id} 
                value={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between bg-[#242731] border border-[#343846] p-4 rounded-lg hover:bg-[#2a2d39] transition-colors group cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-gray-500 group-hover:text-gray-300" />
                  <div className="w-6 h-6 rounded-full bg-[#343846] flex items-center justify-center text-xs font-bold text-blue-400">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{stage.name}</h3>
                    <p className="text-xs text-gray-400">{idx === 0 ? 'Entry stage' : idx === stages.length - 1 ? 'Final stage' : 'Interview stage'} · {stage.candidates} candidate{stage.candidates !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-[#343846] rounded-md transition-colors text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteStage(stage.id)} className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </Card>

        {/* Candidate Timeline Overview */}
        <Card className="p-6 bg-white shadow-sm border-gray-100 h-fit rounded-xl">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Candidate Timeline Example</h2>
          
          <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
            {candidateTimeline.map((item, idx) => (
              <div key={item.id} className="relative pl-6">
                <div className={cn(
                  "absolute -left-[11px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm",
                  item.status === 'completed' ? "bg-emerald-500 text-white" : 
                  item.status === 'current' ? "bg-[#4880FF] text-white" : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                )}>
                  <item.icon className="w-3 h-3" />
                </div>
                
                <div>
                  <h3 className={cn(
                    "text-sm font-bold",
                    item.status === 'completed' ? "text-gray-900" :
                    item.status === 'current' ? "text-[#4880FF]" : "text-gray-500"
                  )}>{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
