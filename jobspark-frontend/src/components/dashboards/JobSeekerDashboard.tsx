/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  FileText,
  TrendingUp,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Bookmark,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { jobSeekerService } from '@/services/jobSeekerService';
import { applicationService } from '@/services/applicationService';
import { jobService, Job, AIRecommendedJob } from '@/services/jobService';

interface JobSeekerDashboardProps {
  user: { name?: string } | null;
}

export function JobSeekerDashboard({ user }: JobSeekerDashboardProps) {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendedJob[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [savingJobIds, setSavingJobIds] = useState<Record<string, boolean>>({});
  const [savedJobIds, setSavedJobIds] = useState<Record<string, boolean>>({});
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, boolean>>({});
  const [recPage, setRecPage] = useState(1);
  const REC_PER_PAGE = 6;

  const formatSalary = (job: any) => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) {
      return `$${job.salaryMin.toLocaleString()}+`;
    }
    if (job.salaryMax) {
      return `Up to $${job.salaryMax.toLocaleString()}`;
    }
    return job.salaryRange || 'Salary not specified';
  };

  const loadDashboardJobs = async () => {
    setJobsLoading(true);
    setJobsError(null);

    try {
      const [aiResponse, savedResponse, appliedResponse] = await Promise.all([
        jobService.getAIRecommendedJobs(),
        jobService.getSavedJobs(),
        applicationService.getMyApplications(),
      ]);

      if (aiResponse.success && aiResponse.data) {
        setAiRecommendations(aiResponse.data);
      } else {
        setJobsError(aiResponse.error || 'Failed to load AI recommended jobs.');
      }

      if (savedResponse.success && savedResponse.data) {
        setSavedJobs(savedResponse.data);
        const savedIds = savedResponse.data.reduce<Record<string, boolean>>((acc, job) => {
          acc[job.id] = true;
          return acc;
        }, {});
        setSavedJobIds(savedIds);
      }

      if (appliedResponse.success && appliedResponse.data) {
        const appliedIds = appliedResponse.data.reduce<Record<string, boolean>>((acc, app) => {
          acc[app.job.id] = true;
          return acc;
        }, {});
        setAppliedJobIds(appliedIds);
      }
    } catch (error) {
      setJobsError(error instanceof Error ? error.message : 'Failed to load jobs.');
    } finally {
      setJobsLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const response = await jobSeekerService.getDashboardData();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleCompleteProfile = () => {
    router.push('/jobseeker/profile');
  };

  const handleRefreshMatches = async () => {
    await loadDashboardJobs();
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([loadDashboardData(), loadDashboardJobs()]);
    };
    void fetchData();
  }, []);

  const handleToggleSave = async (jobId: string) => {
    setSavingJobIds((prev) => ({ ...prev, [jobId]: true }));

    try {
      if (savedJobIds[jobId]) {
        const response = await jobService.unsaveJob(jobId);
        if (response.success) {
          setSavedJobIds((prev) => ({ ...prev, [jobId]: false }));
          setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
        }
      } else {
        const response = await jobService.saveJob(jobId);
        if (response.success) {
          setSavedJobIds((prev) => ({ ...prev, [jobId]: true }));
          await loadDashboardJobs();
        }
      }
    } catch (error) {
      console.error('Save job error:', error);
    } finally {
      setSavingJobIds((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INTERVIEWING': return 'bg-blue-100 text-blue-800';
      case 'REVIEWING': return 'bg-yellow-100 text-yellow-800';
      case 'SHORTLISTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'OFFERED': return 'bg-purple-100 text-purple-800';
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-800';
      case 'PENDING': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (dashboardLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-gray-100 rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const profileCompletion = stats.profileCompletion ?? 0;
  const applicationsCount = stats.applicationsCount ?? 0;
  const interviewsScheduled = stats.interviewsScheduled ?? 0;
  const profileViews = stats.profileViews ?? 0;
  const skillsCount = stats.skillsCount ?? 0;

  // ✅ Moved out of JSX to fix "Type '() => Element' is not assignable to type 'ReactNode'" error
  const unappliedRecs = aiRecommendations.filter(job => !appliedJobIds[job.jobId]);
  const totalRecPages = Math.max(1, Math.ceil(unappliedRecs.length / REC_PER_PAGE));
  const pagedRecs = unappliedRecs.slice((recPage - 1) * REC_PER_PAGE, recPage * REC_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back, {user?.name || 'Job Seeker'}!</h1>
          <p className="text-slate-500 font-medium mt-1">Track your job applications and discover new opportunities</p>
        </div>
        <Button
          className="bg-[#4880FF] hover:bg-[#3b6ee0] text-white rounded-2xl px-8 h-14 font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
          onClick={handleCompleteProfile}
        >
          Complete Profile
        </Button>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-[2.5rem] border-slate-100/60 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Profile Status</CardTitle>
            <div className="h-10 w-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="mt-4 h-2.5 bg-slate-100" />
            <p className="text-xs text-slate-400 mt-4 font-bold flex items-center gap-1.5 uppercase">
              {stats.hasResume ? (
                <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Resume Verified</span>
              ) : (
                <span className="text-amber-500 flex items-center gap-1.5">Resume missing</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-slate-100/60 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Applications</CardTitle>
            <div className="h-10 w-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{applicationsCount}</div>
            <p className="text-sm font-bold text-slate-400 mt-1">
              {interviewsScheduled} scheduled
            </p>
            <Progress value={(applicationsCount > 0 ? (interviewsScheduled / applicationsCount) * 100 : 0)} className="mt-4 h-2.5 bg-slate-100" />
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-slate-100/60 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Reach</CardTitle>
            <div className="h-10 w-10 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Eye className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{profileViews}</div>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase">
              Total Views
            </p>
            <Progress value={Math.min((profileViews / 500) * 100, 100)} className="mt-4 h-2.5 bg-slate-100" />
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-slate-100/60 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Skills Match</CardTitle>
            <div className="h-10 w-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{skillsCount}</div>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase">
              Core Skills
            </p>
            <Progress value={(skillsCount / 20) * 100} className="mt-4 h-2.5 bg-slate-100" />
          </CardContent>
        </Card>
      </div>

      {/* Recommended for You Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="bg-linear-to-br from-indigo-500 to-blue-600 p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              Recommended for You
              {aiRecommendations.length > 0 && (
                <span className="text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-2">
                  Showing {aiRecommendations.length} matches
                </span>
              )}
            </h2>
            <p className="text-slate-500 font-medium mt-1">AI-powered matches based on your unique skills and experience</p>
            {jobsError ? <p className="text-sm text-rose-500 mt-2 font-semibold">{jobsError}</p> : null}
          </div>
          <Button variant="ghost" className="text-[#4880FF] font-bold hover:bg-blue-50" onClick={handleRefreshMatches}>
            Refresh Matches
          </Button>
        </div>

        {/* ✅ Clean conditional rendering — no IIFE */}
        {jobsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : unappliedRecs.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pagedRecs.map((job) => (
                <Card key={job.jobId} className="group rounded-[2.5rem] border-slate-100/60 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 border-2 hover:border-blue-200">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                          {job.companyLogo ? (
                            <Image src={job.companyLogo} alt={job.companyName} width={48} height={48} className="h-12 w-12 object-contain" />
                          ) : (
                            <Briefcase className="h-8 w-8 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <h3
                            className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer hover:underline"
                            onClick={() => router.push(`/jobs/${job.jobId}`)}
                          >
                            {job.title}
                          </h3>
                          <p className="text-slate-500 font-bold">{job.companyName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 px-4 py-1.5 rounded-xl font-black text-sm">
                          <Zap className="h-3.5 w-3.5 mr-1.5 fill-emerald-500" />
                          {job.score}% MATCH
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-blue-50/40 rounded-3xl p-5 mb-6 border border-blue-100/50">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-blue-500 shrink-0 mt-1" />
                        <div>
                          <p className="text-blue-900 font-bold text-sm leading-relaxed">{job.explanation}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.matchReasons.map((reason: string, idx: number) => (
                              <span key={idx} className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-700 bg-white/80 px-2.5 py-1 rounded-lg border border-blue-100">
                                <CheckCircle2 className="h-3 w-3" />
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5 text-sm font-bold text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-300" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-slate-300" />
                          {formatSalary(job)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className={`rounded-2xl border-slate-200 h-12 w-12 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all ${savedJobIds[job.jobId] ? 'bg-rose-50 text-rose-500 border-rose-100' : ''}`}
                          onClick={() => handleToggleSave(job.jobId)}
                          disabled={savingJobIds[job.jobId]}
                        >
                          <Bookmark className={`h-5 w-5 ${savedJobIds[job.jobId] ? 'fill-rose-500' : ''}`} />
                        </Button>
                        <Button
                          className="bg-[#4880FF] hover:bg-[#3b6ee0] text-white rounded-2xl px-6 h-12 font-bold shadow-md shadow-blue-100 transition-all"
                          onClick={() => router.push(`/jobs/${job.jobId}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalRecPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-bold text-slate-400">
                  Page {recPage} of {totalRecPages} &middot; {unappliedRecs.length} matches
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-slate-200 h-10 px-4 font-bold disabled:opacity-40"
                    disabled={recPage === 1}
                    onClick={() => setRecPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalRecPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setRecPage(p)}
                      className={`min-w-[40px] h-10 rounded-2xl border text-sm font-black transition-all ${p === recPage
                        ? 'bg-[#4880FF] text-white border-[#4880FF]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    className="rounded-2xl border-slate-200 h-10 px-4 font-bold disabled:opacity-40"
                    disabled={recPage === totalRecPages}
                    onClick={() => setRecPage(p => Math.min(totalRecPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="rounded-[3rem] border-dashed border-2 border-slate-200 bg-slate-50/50">
            <CardContent className="p-16 text-center">
              <div className="h-20 w-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-slate-300" />
              </div>
              {jobsError ? (
                <>
                  <h3 className="text-xl font-black text-rose-500 mb-2">AI Matching Unavailable</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">{jobsError}</p>
                  <button
                    onClick={handleRefreshMatches}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Finding your perfect match...</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">Update your skills and experience to help our AI find the best opportunities for you.</p>
                  <button
                    onClick={handleRefreshMatches}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
                  >
                    Refresh Matches
                  </button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card className="rounded-[3rem] border-slate-100/60 shadow-sm h-full">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Recent Applications</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Track your job application status</CardDescription>
                </div>
                <Button variant="ghost" className="text-[#4880FF] font-bold hover:bg-blue-50">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-4">
                {dashboardData?.recentApplications?.length > 0 ? (
                  dashboardData.recentApplications.map((application: any) => (
                    <div key={application.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-all group">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{application.job?.title}</h4>
                          <Badge className={`${getStatusColor(application.status)} border-0 px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider`}>
                            {formatStatus(application.status)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm font-bold text-slate-400">
                          <span className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-slate-300" />
                            {application.job?.company?.name}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-300" />
                            {new Date(application.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-3">
                        <Button variant="outline" size="sm" className="rounded-xl px-5 h-11 border-slate-200 font-bold hover:bg-slate-100">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-500 font-bold italic">No applications found. Start your journey today!</p>
                    <Button variant="link" className="text-[#4880FF] font-black mt-2" onClick={() => router.push('/jobs')}>Browse Jobs →</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Jobs Quick Access */}
        <div>
          <Card className="rounded-[3rem] border-slate-100/60 shadow-sm h-full">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-black text-slate-900">Saved Jobs</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Quick access to saved roles</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {jobsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((index) => (
                    <div key={index} className="h-28 bg-slate-100 rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : savedJobs.length > 0 ? (
                <div className="space-y-4">
                  {savedJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="p-5 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all">
                      <h4 className="font-black text-slate-900 leading-tight">{job.title}</h4>
                      <p className="text-slate-500 text-sm font-bold mt-1">{job.company?.name}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[11px] font-black uppercase text-slate-400">{job.location}</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-[#4880FF] font-black" onClick={() => router.push(`/jobs/${job.id}`)}>
                          Apply →
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-2xl border-slate-200 h-12 font-bold hover:bg-slate-50 mt-2" onClick={() => router.push('/jobseeker/saved-jobs')}>
                    View All Saved
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 px-6">
                  <Bookmark className="h-8 w-8 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold text-sm">You haven&apos;t saved any jobs yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}