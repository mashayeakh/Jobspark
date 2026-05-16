/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { jobSeekerService } from '@/services/jobSeekerService';
import {
  Zap,
  FileText,
  Target,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  Trophy,
  Sparkles,
  Layout,
  ListChecks,
  ChevronRight,
  Loader2,
  BrainCircuit,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ResumeAnalyzerPage() {
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const loadProfile = useCallback(async () => {
    const res = await jobSeekerService.getProfile();
    if (res.success) {
      setProfile(res.data);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await loadProfile();
    };

    if (isMounted) {
      init();
    }

    return () => {
      isMounted = false;
    };
  }, [loadProfile]);

  const handleAnalyze = async () => {
    if (!targetRole.trim()) {
      toast.error('Please enter a target job title');
      return;
    }

    if (!profile?.resumeUrl) {
      toast.error('Please upload your resume in your profile first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await jobSeekerService.analyzeResume(targetRole);
      if (res.success) {
        setAnalysisResult(res.data);
        toast.success('Resume analysis complete!');
      } else {
        toast.error(res.error || 'Analysis failed');
      }
    } catch (err) {
      toast.error('An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true); // Reuse analyzing state for loading UI
    try {
      const result = await jobSeekerService.uploadResume(file);
      if (result.success && result.data?.resumeUrl) {
        toast.success('Resume uploaded successfully!');
        await loadProfile(); // Refresh profile data
      } else {
        toast.error(result.error || 'Failed to upload resume');
      }
    } catch (err: any) {
      toast.error('An error occurred during upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#4880FF]">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">AI Resume Optimizer</h1>
              <p className="text-gray-500 font-medium">Get your resume ATS-ready and beat the competition.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#4880FF] to-[#6366F1] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-100 min-h-[300px] flex items-center">
            <div className="relative z-10 w-full">
              {!profile?.resumeUrl ? (
                <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-md">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">No Resume Found</h3>
                  <p className="text-blue-100 mb-6 max-w-md">Upload your resume to unlock AI optimization features.</p>
                  
                  <input
                    type="file"
                    id="direct-resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                  <label
                    htmlFor="direct-resume-upload"
                    className={cn(
                      "h-14 px-10 rounded-2xl bg-white text-[#4880FF] hover:bg-blue-50 font-black text-lg shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3",
                      isAnalyzing && "opacity-70 pointer-events-none"
                    )}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Plus className="h-6 w-6" />
                    )}
                    Upload Resume Now
                  </label>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-8 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-full bg-green-400/20 flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-bold">Target Job Role</h3>
                      <Badge className="bg-white/20 text-white border-none text-[10px] ml-2">RESUME READY</Badge>
                    </div>
                    <div className="relative group">
                      <Input
                        placeholder="e.g. Senior Frontend Engineer"
                        className="h-16 pl-14 pr-6 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white focus:text-gray-900 focus:ring-4 focus:ring-white/20 transition-all text-lg font-bold shadow-inner"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                      />
                      <Target className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-200 group-focus-within:text-[#4880FF] transition-colors" />
                    </div>
                    <p className="text-blue-100/70 mt-3 text-xs font-medium pl-2 italic">Tell us which job you&apos;re aiming for to get targeted feedback.</p>
                  </div>
                  <div className="w-full md:w-auto shrink-0">
                    <Button
                      size="lg"
                      disabled={isAnalyzing}
                      onClick={handleAnalyze}
                      className="h-16 px-10 rounded-2xl bg-white text-[#4880FF] hover:bg-blue-50 font-black text-lg shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 flex items-center gap-3 w-full md:w-auto"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <>
                          Run AI Match
                          <Sparkles className="h-6 w-6 fill-current" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {!analysisResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="rounded-3xl border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Resume Scan</h4>
                <p className="text-sm text-gray-500">We extract text from your uploaded PDF using high-precision OCR technology.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-[#4880FF] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Search className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">ATS Audit</h4>
                <p className="text-sm text-gray-500">Our AI simulates an Applicant Tracking System to check for keyword density and formatting.</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <ListChecks className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Improvement Tips</h4>
                <p className="text-sm text-gray-500">Receive actionable steps to increase your score and bypass automated filters.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <Card className="md:col-span-4 rounded-3xl border-none bg-white shadow-xl shadow-blue-50/50 overflow-hidden">
                <div className="h-2 bg-[#4880FF]" />
                <CardContent className="p-10 text-center">
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Overall ATS Score</p>
                  <div className="relative inline-block mb-6">
                    <svg className="h-40 w-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * analysisResult.score) / 100}
                        className="text-[#4880FF] transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-5xl font-black text-gray-900 leading-none">{analysisResult.score}%</span>
                    </div>
                  </div>
                  <Badge className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-bold",
                    analysisResult.atsCompatibility === 'OPTIMIZED' ? 'bg-emerald-100 text-emerald-700' :
                      analysisResult.atsCompatibility === 'HIGH' ? 'bg-blue-100 text-blue-700' :
                        analysisResult.atsCompatibility === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                  )}>
                    {analysisResult.atsCompatibility} COMPATIBILITY
                  </Badge>
                </CardContent>
              </Card>

              <Card className="md:col-span-8 rounded-3xl border-none bg-white shadow-xl shadow-blue-50/50 flex flex-col">
                <CardHeader className="p-8 border-b border-gray-50">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-amber-500 fill-amber-500" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex-1">
                  <p className="text-lg text-gray-700 leading-relaxed font-medium italic">
                    {analysisResult.summary}
                  </p>
                  <div className="mt-8 p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Formatting Verdict
                    </h5>
                    <p className="text-sm text-blue-800">{analysisResult.formattingFeedback}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-3xl border-none shadow-xl shadow-blue-50/50 overflow-hidden">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-50 p-6">
                  <CardTitle className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {analysisResult.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/30 border border-emerald-50 group hover:border-emerald-100 transition-all">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-gray-700 font-bold text-sm">{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-xl shadow-blue-50/50 overflow-hidden">
                <CardHeader className="bg-red-50/50 border-b border-red-50 p-6">
                  <CardTitle className="text-lg font-bold text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Critical Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {analysisResult.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-50/30 border border-red-50 group hover:border-red-100 transition-all">
                        <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <span className="text-gray-700 font-bold text-sm">{w}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Keywords */}
            <Card className="rounded-3xl border-none shadow-xl shadow-blue-50/50 overflow-hidden">
              <CardHeader className="p-8 border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-500" />
                  Missing Keywords (Add these for ATS success)
                </CardTitle>
                <CardDescription className="text-sm font-medium">Industry-standard terms recruiters search for that are currently missing from your resume.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-3">
                  {analysisResult.missingKeywords.map((k: string, i: number) => (
                    <Badge key={i} variant="outline" className="h-10 px-6 rounded-xl border-blue-100 bg-blue-50/50 text-[#4880FF] font-black text-sm hover:bg-blue-100 transition-all">
                      + {k}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actionable Tips */}
            <Card className="rounded-3xl border-none bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl shadow-black/10 overflow-hidden">
              <CardHeader className="p-8 border-b border-white/10">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <Zap className="h-6 w-6 text-[#4880FF]" />
                  Actionable Steps to 90%+ Score
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisResult.actionableTips.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <div className="h-8 w-8 rounded-xl bg-[#4880FF] text-white flex items-center justify-center shrink-0 font-black">
                        {i + 1}
                      </div>
                      <p className="font-bold text-gray-200 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setAnalysisResult(null);
                  setTargetRole('');
                  // Clear local resume state so user can upload again
                  setProfile((prev: any) => prev ? { ...prev, resumeUrl: null } : null);
                }}
                className="rounded-3xl border-gray-200 text-gray-500 font-bold h-16 px-12 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                Reset Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


