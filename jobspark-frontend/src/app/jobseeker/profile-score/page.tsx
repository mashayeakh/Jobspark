/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { jobSeekerService } from "@/services/jobSeekerService";
import { 
  Trophy, 
  Target, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  Circle,
  Download,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Bot,
  Zap,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfileScorePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const isMounted = React.useRef(false);

  const fetchScore = React.useCallback(async () => {
    try {
      const res = await jobSeekerService.getProfileScore();
      if (isMounted.current) {
        if (res.success) {
          setData(res.data || (res as any).result);
        } else {
          toast.error(res.error || "Failed to load profile score");
        }
        setLoading(false);
      }
    } catch (err) {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    // Wrap in a promise to ensure it's truly async and outside the sync effect window
    Promise.resolve().then(() => {
      if (isMounted.current) {
        fetchScore();
      }
    });
    return () => {
      isMounted.current = false;
    };
  }, [fetchScore]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#4880FF] mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Analyzing your profile profile strength...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-400/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#4880FF] text-xs font-black uppercase tracking-widest mb-4 border border-blue-100">
              <BrainCircuit className="h-4 w-4" />
              AI Career Intelligence
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-3">
              Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4880FF] to-indigo-600">Performance</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
              Our AI has analyzed your profile against 50,000+ top-tier job requirements. Here is how you stand.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              className="h-14 px-8 rounded-2xl bg-[#4880FF] hover:bg-blue-600 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
              onClick={() => window.location.href = "/jobseeker/profile"}
            >
              Improve Profile
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Score & Recommendation - STICKY */}
          <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-left duration-700 delay-200 lg:sticky lg:top-12">
            {/* Score Card */}
            <Card className="rounded-[40px] border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[100px] -mr-10 -mt-10 transition-all group-hover:w-40 group-hover:h-40" />
              
              <div className="relative z-10 text-center">
                <div className="relative inline-flex items-center justify-center mb-8">
                  <svg className="h-56 w-56 transform -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      strokeWidth="16"
                      strokeDasharray={2 * Math.PI * 100}
                      strokeDashoffset={2 * Math.PI * 100 * (1 - (data?.totalScore || 0) / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="text-[#4880FF] transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black tracking-tighter text-slate-900">{data?.totalScore}%</span>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Strength</span>
                  </div>
                </div>

                <div className="inline-block px-6 py-2 rounded-2xl bg-green-50 text-green-600 font-black text-sm uppercase tracking-widest border border-green-100 mb-6">
                  {data?.totalScore > 90 ? "Elite Candidate" : data?.totalScore > 70 ? "Rising Professional" : "Developing Talent"}
                </div>
              </div>
            </Card>

            {/* AI Recommendation Card */}
            <Card className="rounded-[40px] border-none bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <BrainCircuit className="h-48 w-48 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Bot className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">AI Insight</h3>
                </div>
                <p className="text-slate-300 font-medium text-lg leading-relaxed mb-8 italic">
                  {data?.recommendation}
                </p>
                <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center overflow-hidden">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Compared to Top 10%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Breakdown & Improvement */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right duration-700 delay-400">
            {/* Detailed Breakdown Card */}
            <Card className="rounded-[40px] border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900">Breakdown Analysis</h2>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                  <Target className="h-4 w-4" />
                  Live Stats
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data?.breakdown || []).map((item: any, i: number) => (
                  <div 
                    key={i} 
                    className={cn(
                      "group p-6 rounded-3xl border-2 transition-all duration-300",
                      item.completed 
                        ? "bg-white border-slate-50 hover:border-green-100 hover:shadow-lg hover:shadow-green-500/5" 
                        : "bg-slate-50 border-transparent hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                        item.completed ? "bg-green-50 text-green-600" : "bg-slate-200 text-slate-400"
                      )}>
                        {item.completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                      </div>
                      <span className={cn(
                        "text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full",
                        item.completed ? "bg-green-100/50 text-green-700" : "bg-slate-100 text-slate-400"
                      )}>
                        +{item.weight}%
                      </span>
                    </div>
                    <p className={cn(
                      "text-lg font-bold leading-tight",
                      item.completed ? "text-slate-900" : "text-slate-400"
                    )}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Improvement Steps Card */}
            {data?.missingSections?.length > 0 && (
              <Card className="rounded-[40px] border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-full h-2 bg-orange-400" />
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <Zap className="h-7 w-7 text-orange-500 fill-orange-500" />
                  Priority Improvement Steps
                </h2>
                <div className="space-y-4">
                  {data.missingSections.map((section: string, i: number) => (
                    <div 
                      key={i} 
                      className="group flex items-center justify-between p-6 rounded-3xl bg-orange-50/50 border-2 border-transparent hover:border-orange-100 hover:bg-orange-50 transition-all cursor-pointer"
                      onClick={() => window.location.href = "/jobseeker/profile"}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-4 w-4 rounded-full bg-orange-400 animate-pulse" />
                        <span className="text-lg font-bold text-orange-900">{section}</span>
                      </div>
                      <Button variant="ghost" className="rounded-xl font-black text-orange-600 hover:bg-white group-hover:translate-x-1 transition-transform">
                        Improve
                        <ChevronRight className="ml-1 h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
