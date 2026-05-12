/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { authService } from '@/services/authService';
import { recruiterService, Application } from '@/services/recruiterService';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronDown,
  ExternalLink,
  Brain,
  Loader2,
  Sparkles,
  Trophy
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface Candidate {
  id: string;
  name: string;
  email: string;
  location: string;
  appliedFor: string;
  appliedDate: string;
  experience: string;
  status: string;
  match: number;
  skills: string[];
  applications: Application[];
}

export default function CandidatesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(new Set());
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData || userData.role !== 'RECRUITER') {
      router.push('/login');
      return;
    }
    const timer = setTimeout(() => {
      setUser(userData);
    }, 0);

    recruiterService.getAllApplications()
      .then((res) => {
        if (res.success && res.data) {
          setApplications(res.data);
        }
      })
      .finally(() => setLoading(false));

    return () => clearTimeout(timer);
  }, [router]);

  // Deduplicate candidates by seeker ID, grouping their applications
  const candidateMap = new Map<string, Candidate>();

  applications.forEach((app) => {
    const seekerId = app.seekerId;
    if (!candidateMap.has(seekerId)) {
      const latestWork = app.seeker.workExperience[0];
      const experience = latestWork
        ? `${latestWork.title} at ${latestWork.companyName}`
        : 'N/A';
      candidateMap.set(seekerId, {
        id: seekerId,
        name: app.seeker.user.name,
        email: app.seeker.user.email,
        location: 'N/A',
        appliedFor: app.job.title,
        appliedDate: app.appliedAt,
        experience,
        status: app.status,
        match: 0,
        skills: app.seeker.skills.map((s) => s.skill.name),
        applications: [app],
      });
    } else {
      const candidate = candidateMap.get(seekerId)!;
      candidate.applications.push(app);
      // Update to show the most recent application
      if (new Date(app.appliedAt) > new Date(candidate.appliedDate)) {
        candidate.appliedDate = app.appliedAt;
        candidate.appliedFor = app.job.title;
        candidate.status = app.status;
      }
    }
  });

  const candidates = Array.from(candidateMap.values());

  const total = candidates.length;
  const shortlisted = candidates.filter((c) => ['SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'ACCEPTED'].includes(c.status)).length;
  const interviewing = candidates.filter((c) => c.status === 'INTERVIEWING').length;
  const offered = candidates.filter((c) => ['OFFERED', 'ACCEPTED'].includes(c.status)).length;

  const stats = [
    { label: 'Total Candidates', value: total, icon: Users, color: 'text-[#4880FF]', bg: 'bg-blue-50' },
    { label: 'Shortlisted', value: shortlisted, icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Interview Scheduled', value: interviewing, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Offered', value: offered, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INTERVIEWING': return 'bg-blue-100 text-blue-800';
      case 'SHORTLISTED': return 'bg-purple-100 text-purple-800';
      case 'REVIEWING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      case 'OFFERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'bg-green-500';
    if (match >= 80) return 'bg-[#4880FF]';
    if (match >= 70) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleExpanded = (candidateId: string) => {
    const newExpanded = new Set(expandedCandidates);
    if (newExpanded.has(candidateId)) {
      newExpanded.delete(candidateId);
    } else {
      newExpanded.add(candidateId);
    }
    setExpandedCandidates(newExpanded);
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.appliedFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnalyze = async (app: any) => {
    setSelectedApp(app);
    setAnalysisLoading(true);
    setIsSheetOpen(true);
    setAnalysisResult(null);

    try {
      const res = await recruiterService.analyzePotential(app.id);
      if (res.success) {
        setAnalysisResult(res.data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/recruiter">Recruiter</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Candidates</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600">Review and manage job applicants</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates by name or job..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Candidates ({filteredCandidates.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
                  {/* Main candidate row */}
                  <div
                    onClick={() => toggleExpanded(candidate.id)}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4880FF] to-blue-600 text-white font-bold text-lg flex-shrink-0">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                          {candidate.applications.length > 1 && (
                            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Applied to {candidate.applications.length} positions
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{candidate.email}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {candidate.experience === 'N/A' ? 'Experience not specified' : candidate.experience}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {candidate.location}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs border-blue-200 text-[#4880FF]">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                              +{candidate.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:justify-end lg:flex-none">
                      <Badge className={getStatusColor(candidate.status)}>
                        {formatStatus(candidate.status)}
                      </Badge>
                      {/* <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                          <Mail className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                          <Calendar className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div> */}
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${expandedCandidates.has(candidate.id) ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Expanded applications view */}
                  {expandedCandidates.has(candidate.id) && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <h4 className="font-semibold text-sm text-gray-900 mb-3">Applications ({candidate.applications.length})</h4>
                      <div className="space-y-2">
                        {candidate.applications.map((app, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{app.job.title}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Applied {formatDate(app.appliedAt)}
                                </span>
                                {app.job.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {app.job.location}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(app.status)} variant="outline">
                                {formatStatus(app.status)}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-blue-50 text-blue-600"
                                onClick={() => handleAnalyze(app)}
                              >
                                <Brain className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => router.push(`/recruiter/applications/${app.id}`)}
                              >
                                <ExternalLink className="h-3 w-3 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-blue-50">
                <Brain className="h-5 w-5 text-[#4880FF]" />
              </div>
              <SheetTitle className="text-xl font-bold">AI Candidate Analysis</SheetTitle>
            </div>
            <SheetDescription>
              Deep potential assessment for <span className="font-semibold text-gray-900">{selectedApp?.seeker?.user?.name}</span>
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-8">
            {analysisLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-[#4880FF] animate-spin" />
                <p className="text-sm font-medium text-gray-500 animate-pulse text-center">
                  Analyzing resume against job requirements...<br />
                  <span className="text-xs">Processing via llama-3.3-70b-versatile</span>
                </p>
              </div>
            ) : analysisResult ? (
              <>
                {/* Score Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-gray-900 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      Potential Score
                    </h5>
                    <Badge className={`${analysisResult.matchLevel === 'EXCELLENT' ? 'bg-green-100 text-green-700' :
                      analysisResult.matchLevel === 'HIGH' ? 'bg-blue-100 text-blue-700' :
                        analysisResult.matchLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      } border-0 font-bold px-3`}>
                      {analysisResult.matchLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Progress value={analysisResult.score} className="h-3" />
                    </div>
                    <span className="text-2xl font-black text-gray-900">{analysisResult.score}%</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <h5 className="font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#4880FF]" />
                    AI Summary
                  </h5>
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      {analysisResult.summary}
                    </p>
                  </div>
                </div>

                {/* Strengths & Gaps */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Key Strengths
                    </h5>
                    <ul className="space-y-2">
                      {analysisResult.strengths?.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-orange-500" />
                      Potential Gaps
                    </h5>
                    <ul className="space-y-2">
                      {analysisResult.gaps?.map((g: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="pt-6 border-t border-gray-100">
                  <h5 className="font-bold text-gray-900 mb-3">AI Recommendation</h5>
                  <div className="bg-gray-900 text-white rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Brain className="h-12 w-12" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed relative z-10 italic">
                      {analysisResult.recommendation}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-gray-400">
                Failed to load analysis.
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
