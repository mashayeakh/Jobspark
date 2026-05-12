'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Briefcase,
  FileText,
  TrendingUp,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Bookmark
} from 'lucide-react';
import { jobService, Job } from '@/services/jobService';

interface JobSeekerDashboardProps {
  user: { name?: string } | null;
}

export function JobSeekerDashboard({ user }: JobSeekerDashboardProps) {
  // Hardcoded data for demonstration
  const profileStats = {
    profileCompletion: 85,
    resumeUploaded: true,
    skillsAdded: 12,
    totalApplications: 45,
    interviewsScheduled: 3,
    profileViews: 234
  };

  const recentApplications = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      status: 'INTERVIEW_SCHEDULED',
      applied: '2024-01-15',
      type: 'FULL_TIME'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$90k - $120k',
      status: 'UNDER_REVIEW',
      applied: '2024-01-14',
      type: 'HYBRID'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'New York, NY',
      salary: '$100k - $140k',
      status: 'REJECTED',
      applied: '2024-01-13',
      type: 'ONSITE'
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'DataCo',
      location: 'Austin, TX',
      salary: '$110k - $150k',
      status: 'SHORTLISTED',
      applied: '2024-01-12',
      type: 'REMOTE'
    },
  ];

  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [savingJobIds, setSavingJobIds] = useState<Record<string, boolean>>({});
  const [applyingJobIds, setApplyingJobIds] = useState<Record<string, boolean>>({});
  const [savedJobIds, setSavedJobIds] = useState<Record<string, boolean>>({});
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, boolean>>({});

  const formatSalary = (job: Job) => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    }

    if (job.salaryMin) {
      return `$${job.salaryMin.toLocaleString()}+`;
    }

    if (job.salaryMax) {
      return `Up to $${job.salaryMax.toLocaleString()}`;
    }

    return 'Salary not specified';
  };

  const loadDashboardJobs = async () => {
    setJobsLoading(true);
    setJobsError(null);

    try {
      const [jobsResponse, savedResponse] = await Promise.all([jobService.getJobs(), jobService.getSavedJobs()]);

      if (jobsResponse.success && jobsResponse.data) {
        setRecommendedJobs(jobsResponse.data.slice(0, 4));
      } else {
        setJobsError(jobsResponse.error || 'Failed to load recommended jobs.');
      }

      if (savedResponse.success && savedResponse.data) {
        setSavedJobs(savedResponse.data);
        const savedIds = savedResponse.data.reduce<Record<string, boolean>>((acc, job) => {
          acc[job.id] = true;
          return acc;
        }, {});
        setSavedJobIds(savedIds);
      }
    } catch (error) {
      setJobsError(error instanceof Error ? error.message : 'Failed to load jobs.');
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      await loadDashboardJobs();
    };
    void fetchJobs();
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
          const savedJob = recommendedJobs.find((job) => job.id === jobId);
          if (savedJob) {
            setSavedJobs((prev) => [savedJob, ...prev]);
          }
        }
      }
    } catch (error) {
      console.error('Save job error:', error);
    } finally {
      setSavingJobIds((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleApply = async (jobId: string) => {
    setApplyingJobIds((prev) => ({ ...prev, [jobId]: true }));

    try {
      const response = await jobService.applyToJob(jobId);
      if (response.success) {
        setAppliedJobIds((prev) => ({ ...prev, [jobId]: true }));
      }
    } catch (error) {
      console.error('Apply job error:', error);
    } finally {
      setApplyingJobIds((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INTERVIEW_SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'SHORTLISTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'OFFER_EXTENDED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Job Seeker'}!</h1>
        <p className="text-gray-600">Track your job applications and discover new opportunities</p>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.profileCompletion}%</div>
            <Progress value={profileStats.profileCompletion} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {profileStats.resumeUploaded ? '✓ Resume uploaded' : '✗ Upload resume'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {profileStats.interviewsScheduled} interviews scheduled
            </p>
            <Progress value={(profileStats.interviewsScheduled / profileStats.totalApplications) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.profileViews}</div>
            <p className="text-xs text-muted-foreground">
              +23% from last week
            </p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Added</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.skillsAdded}</div>
            <p className="text-xs text-muted-foreground">
              Add more skills to improve matches
            </p>
            <Progress value={(profileStats.skillsAdded / 20) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Track your job application status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{application.title}</h4>
                    <Badge className={getStatusColor(application.status)}>
                      {formatStatus(application.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {application.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {application.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {application.salary}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {application.applied}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
          <Separator className="mt-4" />
          <Button variant="outline" className="w-full mt-4">
            View All Applications
          </Button>
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
          <CardDescription>Jobs that match your profile</CardDescription>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : jobsError ? (
            <div className="text-sm text-red-600">{jobsError}</div>
          ) : recommendedJobs.length > 0 ? (
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{job.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {job.company?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatSalary(job)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={savingJobIds[job.id]}
                      onClick={() => handleToggleSave(job.id)}
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      {savedJobIds[job.id] ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      size="sm"
                      disabled={applyingJobIds[job.id] || appliedJobIds[job.id]}
                      onClick={() => handleApply(job.id)}
                    >
                      {appliedJobIds[job.id] ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No recommended jobs available right now.</div>
          )}
          <Separator className="mt-4" />
          <Button variant="outline" className="w-full mt-4">
            View More Recommendations
          </Button>
        </CardContent>
      </Card> 
 
      {/* Saved Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Jobs</CardTitle>
          <CardDescription>Jobs you&apos;ve saved for later</CardDescription>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((index) => (
                <div key={index} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : savedJobs.length > 0 ? (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{job.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {job.company?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatSalary(job)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={savingJobIds[job.id]}
                      onClick={() => handleToggleSave(job.id)}
                    >
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      disabled={applyingJobIds[job.id] || appliedJobIds[job.id]}
                      onClick={() => handleApply(job.id)}
                    >
                      {appliedJobIds[job.id] ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">You haven&apos;t saved any jobs yet.</div>
          )}
          <Separator className="mt-4" />
          <Button variant="outline" className="w-full mt-4">
            View All Saved Jobs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
