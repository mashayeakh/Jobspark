/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { recruiterService, Application } from '@/services/recruiterService';
import { interviewService } from '@/services/interviewService';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  XCircle,
  Sparkles,
  Trophy,
  MapPin,
  Briefcase,
  Calendar as CalendarIcon,
  Mail,
  Loader2,
  GraduationCap,
  Building2,
  Award,
  ChevronRight,
  FileText,
  Video,
  Phone,
  UserPlus,
  Clock,
  X,
  Plus,
  Upload,
  Globe,
  Link as LinkIcon,
  MessageSquare,
  ExternalLink,
  Calendar
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";

export default function ApplicationReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Interview Modal States
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewType, setInterviewType] = useState('video');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('45 min');
  const [platform, setPlatform] = useState('Google Meet');
  const [interviewers, setInterviewers] = useState<string[]>(['Sarah Chen (Lead)']);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      recruiterService.getApplicationDetails(id as string)
        .then((res) => {
          if (res.success) {
            setApplication(res.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await recruiterService.analyzePotential(id as string);
      if (res.success) {
        setAnalysis(res.data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInterview = async () => {
    console.log("[Interview Modal] 🚀 Submit clicked");
    
    if (!interviewDate) {
      console.warn("[Interview Modal] ⚠️ Missing date");
      toast.error("Please select a date");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      status: 'INTERVIEWING',
      type: interviewType.toUpperCase(),
      scheduledAt: new Date(`${interviewDate} ${interviewTime}`).toISOString(),
      location: platform,
      reason: "Scheduling an interview for this role."
    };

    console.log("[Interview Modal] 📦 Sending payload:", payload);

    try {
      const res = await recruiterService.updateApplicationStatus(id as string, payload);
      console.log("[Interview Modal] 📥 Response received:", res);

      if (res.success) {
        toast.success("Interview scheduled and email sent with Meet link!");
        setIsInterviewModalOpen(false);
        setApplication((prev: any) => ({ ...prev, status: 'INTERVIEWING' }));
      } else {
        toast.error(res.error || "Failed to schedule interview");
      }
    } catch (error) {
      console.error('[Interview Modal] ❌ Error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsSubmitting(true);
    const toastId = toast.loading(`Updating candidate status to ${newStatus.toLowerCase()}...`);
    try {
      console.log(`[Application Review] Updating status to ${newStatus}...`);
      const res = await recruiterService.updateApplicationStatus(id as string, { 
        status: newStatus,
        reason: newStatus === 'ACCEPTED' ? "Welcome to the team!" : "Thank you for your interest."
      });
      
      console.log(`[Application Review] API Response:`, res);

      if (res.success) {
        toast.success(`Application ${newStatus.toLowerCase()} successfully!`, { id: toastId });
        setApplication((prev: any) => ({ ...prev, status: newStatus }));
      } else {
        toast.error(res.error || "Failed to update status", { id: toastId });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-[#4880FF] animate-spin" />
          <p className="text-gray-500 font-medium">Fetching application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-6 md:p-8 max-w-7xl mx-auto w-full bg-gray-50/50">
      {/* Header & Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/recruiter">Recruiter</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/recruiter/candidates">Candidates</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Application Review</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#4880FF] to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100">
              {application.seeker.user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{application.seeker.user.name}</h1>
                <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 transition-colors">
                  {application.status}
                </Badge>
              </div>
              <p className="text-lg text-gray-500 font-medium mb-3">Applied for <span className="text-[#4880FF] font-bold">{application.job.title}</span></p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {application.seeker.user.email}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {application.job.location || 'Remote'}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              disabled={isSubmitting || application.status === 'REJECTED' || application.status === 'ACCEPTED'}
              onClick={() => handleStatusUpdate('REJECTED')}
              className="h-12 px-6 rounded-xl border-gray-200 hover:bg-gray-50 font-bold flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
            </Button>
            <Button 
              disabled={isSubmitting || application.status === 'ACCEPTED' || application.status === 'REJECTED'}
              onClick={() => handleStatusUpdate('ACCEPTED')}
              className="h-12 px-6 rounded-xl bg-gray-900 hover:bg-black text-white font-bold transition-all shadow-lg shadow-gray-200 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept Candidate'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Potential & Skills */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Analysis Section */}
          <Card className="rounded-3xl border-0 shadow-xl shadow-blue-50/50 overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-blue-600 to-[#4880FF] p-8 text-white">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">AI Candidate Potential</h2>
                    <p className="text-blue-100 text-xs font-medium">Llama 3.3 Powered Assessment</p>
                  </div>
                </div>
                {!analysis && (
                  <Button
                    onClick={handleRunAnalysis}
                    disabled={analyzing}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl h-11 px-6 shadow-lg shadow-blue-900/20"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Run AI Match
                      </>
                    )}
                  </Button>
                )}
              </div>

              {analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-300" />
                      <span className="text-blue-50 font-bold uppercase tracking-wider text-xs">Overall Match Score</span>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-7xl font-black leading-none">{analysis.score}%</span>
                      <Badge className="bg-white/20 text-white border-0 text-sm font-bold px-3 py-1 mb-1">
                        {analysis.matchLevel}
                      </Badge>
                    </div>
                    <Progress value={analysis.score} className="h-3 bg-white/20" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <p className="text-sm font-medium leading-relaxed italic text-blue-50">
                      {analysis.recommendation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                    <Sparkles className="h-8 w-8 text-blue-200" />
                  </div>
                  <p className="text-blue-50 font-medium max-w-xs">
                    Get an instant AI-powered match analysis for this candidate.
                  </p>
                </div>
              )}
            </div>

            {analysis && (
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    Strategic Fit Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm font-medium bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    {analysis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Competitive Strengths
                    </h4>
                    <div className="space-y-2">
                      {analysis.strengths.map((s: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-green-50/30 rounded-xl border border-green-100/50">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700 font-medium">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-orange-500" />
                      Critical Gaps
                    </h4>
                    <div className="space-y-2">
                      {analysis.gaps.map((g: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-orange-50/30 rounded-xl border border-orange-100/50">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700 font-medium">{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Skills Comparison */}
          <Card className="rounded-3xl border border-gray-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 p-8">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Skills Match Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Required Skills Comparison</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.job.skills.map((jobSkill: any) => {
                      const candidateSkill = application.seeker.skills.find(
                        (s: any) => s.skill.name.toLowerCase() === jobSkill.skill.name.toLowerCase()
                      );
                      return (
                        <div key={jobSkill.skill.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-900">{jobSkill.skill.name}</span>
                            <span className="text-xs text-gray-400">Required Skill</span>
                          </div>
                          {candidateSkill ? (
                            <div className="flex flex-col items-end gap-1">
                              <Badge className="bg-green-100 text-green-700 border-0">{candidateSkill.yearsExp} yrs Exp</Badge>
                              <span className="text-[10px] font-bold text-green-600 uppercase">Match Found</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <Badge className="bg-red-50 text-red-600 border-0">Missing</Badge>
                              <span className="text-[10px] font-bold text-red-400 uppercase">Gap</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Additional Candidate Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.seeker.skills
                      .filter((s: any) => !application.job.skills.some((js: any) => js.skill.name.toLowerCase() === s.skill.name.toLowerCase()))
                      .map((s: any) => (
                        <Badge key={s.skill.id} variant="secondary" className="h-8 px-4 rounded-lg bg-purple-50 text-purple-700 border-purple-100">
                          {s.skill.name} • {s.yearsExp}y
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="rounded-3xl border border-gray-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 p-8">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#4880FF]" />
                Professional Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-12 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                {application.seeker.workExperience.map((work: any, i: number) => (
                  <div key={i} className="relative pl-12 group">
                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-white border-2 border-[#4880FF] group-hover:bg-[#4880FF] transition-colors flex items-center justify-center z-10 shadow-sm">
                      <Building2 className={`h-4 w-4 ${i === 0 ? 'text-[#4880FF] group-hover:text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-lg font-black text-gray-900 group-hover:text-[#4880FF] transition-colors">{work.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                          <span>{work.companyName}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span className="text-[#4880FF]">{work.location || 'Remote'}</span>
                        </div>
                      </div>
                      <Badge className="bg-gray-100 text-gray-600 border-0 font-bold px-4 py-1.5 h-auto">
                        {new Date(work.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -
                        {work.endDate ? new Date(work.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
                      </Badge>
                    </div>
                    {work.description && (
                      <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-2xl bg-gray-50/50 p-4 rounded-xl">
                        {work.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Stats & Job Details */}
        <div className="space-y-8">
          {/* Quick Stats Card */}
          <Card className="rounded-3xl border border-gray-100 shadow-sm bg-white overflow-hidden sticky top-8">
            <CardHeader className="bg-gray-50/50 border-b border-gray-50 p-6">
              <CardTitle className="text-lg font-bold tracking-tight">Review Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Matching Score</span>
                  <span className={`font-black ${analysis ? 'text-blue-600' : 'text-gray-400'}`}>
                    {analysis ? `${analysis.score}%` : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Experience Level</span>
                  <span className="font-black text-gray-900">Mid-Senior</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Skills Match</span>
                  <span className="font-black text-emerald-600">
                    {application.seeker.skills.filter((s: any) => application.job.skills.some((js: any) => js.skill.name.toLowerCase() === s.skill.name.toLowerCase())).length} / {application.job.skills.length}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 space-y-4">
                <Button
                  disabled={application.status === 'INTERVIEWING' || application.status === 'ACCEPTED' || application.status === 'REJECTED'}
                  onClick={() => setIsInterviewModalOpen(true)}
                  className={`w-full h-12 rounded-xl font-bold transition-all shadow-lg ${
                    (application.status === 'INTERVIEWING' || application.status === 'ACCEPTED' || application.status === 'REJECTED')
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-not-allowed shadow-none' 
                    : 'bg-[#4880FF] hover:bg-blue-600 shadow-blue-100 text-white'
                  }`}
                >
                  {application.status === 'INTERVIEWING' 
                    ? 'Scheduled Already' 
                    : (application.status === 'ACCEPTED' || application.status === 'REJECTED')
                      ? 'Process Completed'
                      : 'Schedule Interview'
                  }
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 text-gray-600 font-bold flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Original Resume
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Job Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-bold uppercase">Company</span>
                      <span className="text-sm font-bold text-gray-900">{application.job.company?.name || 'JobsPark Partner'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-bold uppercase">Location</span>
                      <span className="text-sm font-bold text-gray-900">{application.job.location || 'Remote'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Card */}
          <Card className="rounded-3xl border border-gray-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-50 p-6">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-orange-500" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {application.seeker.education.map((edu: any, i: number) => (
                <div key={i} className="space-y-1 relative before:absolute before:-left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-orange-100 pl-4">
                  <h5 className="text-sm font-black text-gray-900">{edu.degree} in {edu.field}</h5>
                  <p className="text-xs text-gray-500 font-bold">{edu.school}</p>
                  <p className="text-[10px] text-gray-400 font-bold">Graduated {new Date(edu.endDate).getFullYear()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl rounded-[16px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Schedule Interview</h3>
                  <p className="text-sm text-gray-500 font-medium">Coordinate a meeting with the candidate</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsInterviewModalOpen(false)} className="rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Side: Form */}
              <div className="flex-1 overflow-y-auto p-8 border-r border-gray-50">
                <div className="space-y-8">
                  {/* Candidate Quick Info */}
                  <div className="bg-gray-50/80 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#4880FF] text-white flex items-center justify-center font-bold">
                        {application.seeker.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{application.seeker.user.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{application.job.title} • {application.seeker.user.email}</p>
                      </div>
                    </div>
                    <Button variant="link" className="text-[#4880FF] text-xs font-bold gap-1 p-0 h-auto">
                      View Resume <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Interview Type */}
                  <div className="space-y-3">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Interview Type</Label>
                    <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                      {[
                        { id: 'video', label: 'Video Interview', icon: Video },
                        { id: 'phone', label: 'Phone Call', icon: Phone },
                        { id: 'onsite', label: 'In-person', icon: MapPin }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setInterviewType(type.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${interviewType === type.id
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                          <type.icon className={`h-4 w-4 ${interviewType === type.id ? 'text-[#4880FF]' : ''}`} />
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Date</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Time</Label>
                      <select 
                        value={interviewTime} 
                        onChange={(e) => setInterviewTime(e.target.value)}
                        className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Duration</Label>
                      <select 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Zone */}
                  <div className="space-y-3">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Time Zone</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select 
                        defaultValue="utc-5"
                        className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="utc-5">(UTC-05:00) Eastern Time (US & Canada)</option>
                        <option value="utc-0">(UTC+00:00) London</option>
                        <option value="utc+8">(UTC+08:00) Singapore / Beijing</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Meeting Details */}
                  <div className="p-6 rounded-2xl border border-blue-50 bg-blue-50/30 space-y-4">
                    {interviewType === 'video' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-xs font-black text-blue-400 uppercase tracking-widest">Platform</Label>
                          <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                            <option value="Google Meet">Google Meet</option>
                            <option value="Zoom">Zoom</option>
                            <option value="MS Teams">Microsoft Teams</option>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-xs font-black text-blue-400 uppercase tracking-widest">Meeting Link</Label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                            <Input placeholder="https://meet.google.com/..." className="pl-10 rounded-xl border-blue-100 bg-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    {interviewType === 'onsite' && (
                      <div className="space-y-3">
                        <Label className="text-xs font-black text-blue-400 uppercase tracking-widest">Location / Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                          <Input placeholder="Enter office address or meeting room..." className="pl-10 rounded-xl border-blue-100 bg-white" />
                        </div>
                      </div>
                    )}
                    {interviewType === 'phone' && (
                      <div className="space-y-3">
                        <Label className="text-xs font-black text-blue-400 uppercase tracking-widest">Phone Number Confirmation</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                          <Input placeholder="+1 (555) 000-0000" className="pl-10 rounded-xl border-blue-100 bg-white" defaultValue="+1 (555) 123-4567" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interviewers */}
                  <div className="space-y-3">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Interviewers</Label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {interviewers.map((name, i) => (
                        <div key={i} className="flex items-center gap-2 p-1.5 pr-3 bg-white border border-gray-100 rounded-full shadow-sm">
                          <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 text-[10px] flex items-center justify-center font-bold">
                            {name.split(' ')[0][0]}{name.split(' ')[1]?.[0]}
                          </div>
                          <span className="text-xs font-bold text-gray-700">{name}</span>
                          <button onClick={() => setInterviewers(prev => prev.filter(n => n !== name))}>
                            <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full h-8 border-dashed border-gray-300 text-gray-400 font-bold hover:text-blue-600 hover:border-blue-600">
                        <UserPlus className="h-3 w-3 mr-1" /> Add Interviewer
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Notes / Instructions</Label>
                    <Textarea
                      placeholder="Add interview instructions or focus areas..."
                      className="rounded-2xl border-gray-200 min-h-[100px] p-4 text-sm focus:ring-[#4880FF]"
                    />
                  </div>

                  {/* Attachments */}
                  <div className="space-y-3">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Attachments</Label>
                    <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                      <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                        <Upload className="h-6 w-6 text-gray-300 group-hover:text-blue-400" />
                      </div>
                      <p className="text-sm font-bold text-gray-500">Drag & drop files or <span className="text-[#4880FF]">browse</span></p>
                      <p className="text-[10px] text-gray-400 font-medium">Interview guides, prep docs (PDF, DOCX up to 10MB)</p>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="pt-6 border-t border-gray-50 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="email-cand" defaultChecked />
                      <Label htmlFor="email-cand" className="text-sm font-bold text-gray-600 cursor-pointer">Send Email to Candidate</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="cal-invite" defaultChecked />
                      <Label htmlFor="cal-invite" className="text-sm font-bold text-gray-600 cursor-pointer">Send Calendar Invite</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="reminder" defaultChecked />
                      <Label htmlFor="reminder" className="text-sm font-bold text-gray-600 cursor-pointer">Reminder 1 hour before interview</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: AI Assistant */}
              <div className="w-[30%] bg-[#F8FAFF] p-8 flex flex-col gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#4880FF]">
                    <Brain className="h-5 w-5" />
                    <span className="text-sm font-black uppercase tracking-wider">AI Interview Assistant</span>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-blue-50 shadow-sm space-y-4">
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                      Generate interview questions and evaluation plan instantly.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Role</Label>
                        <Input defaultValue={application.job.title} className="h-9 rounded-lg border-gray-100 text-xs font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Key Skills</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {application.job.skills.slice(0, 3).map((s: any) => (
                            <Badge key={s.skill.id} className="bg-blue-50 text-blue-600 border-0 text-[10px] font-bold">
                              {s.skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsAiGenerating(true)}
                        disabled={isAiGenerating}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all shadow-lg shadow-blue-200 border-0"
                      >
                        {isAiGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" /> Generate Plan</>}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* AI Plan Preview (Mockup) */}
                <div className="flex-1 overflow-y-auto space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recommended Focus</h4>
                  <div className="space-y-3">
                    {[
                      { title: 'Technical Proficiency', desc: 'Assess deep understanding of React architecture and state management.' },
                      { title: 'System Design', desc: 'Evaluate ability to design scalable microservices.' },
                      { title: 'Cultural Fit', desc: 'Check alignment with JobSpark\'s agile development values.' }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-white rounded-xl border border-gray-50 space-y-1">
                        <p className="text-xs font-bold text-gray-900">{item.title}</p>
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
              <Button 
                variant="ghost" 
                onClick={() => setIsInterviewModalOpen(false)} 
                disabled={isSubmitting}
                className="rounded-xl font-bold text-gray-500 cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitInterview}
                disabled={isSubmitting}
                className="rounded-xl bg-[#4880FF] hover:bg-blue-600 text-white font-black px-8 h-12 shadow-lg shadow-blue-100 flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Scheduling...</>
                ) : (
                  'Confirm & Send Invite'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
