'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Briefcase,
  Users,
  Eye,
  Clock,
  MapPin,
  Calendar,
} from 'lucide-react';

interface RecruiterDashboardProps {
  data: {
    stats: {
      activeJobs: number;
      totalApplications: number;
      totalViews: number;
      interviewsScheduled: number;
      offersMade: number;
      timeToHire: number;
      costPerHire: number;
      qualityOfHire: number;
    };
    pipeline: Array<{ stage: string; count: number }>;
    totalPipeline: number;
    recentJobs: Array<{
      id: string;
      title: string;
      status: string;
      applications: number;
      views: number;
      posted: string;
      expires: string;
      type: string;
      location: string;
    }>;
    recentApplications: Array<{
      id: string;
      candidateName: string;
      jobTitle: string;
      status: string;
      applied: string;
      experience: string;
      location: string;
      match: number;
    }>;
  };
}

export function RecruiterDashboard({ data }: RecruiterDashboardProps) {
  const router = useRouter();
  const { stats, pipeline, totalPipeline, recentJobs, recentApplications } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'CLOSED':
      case 'ARCHIVED': return 'bg-red-100 text-red-800';
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
    if (match >= 90) return 'bg-green-100 text-green-800';
    if (match >= 80) return 'bg-blue-100 text-blue-800';
    if (match >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPipelineColor = (stage: string) => {
    switch (stage) {
      case 'Applied': return 'bg-blue-500';
      case 'Screening': return 'bg-yellow-500';
      case 'Interview': return 'bg-purple-500';
      case 'Offer': return 'bg-green-500';
      case 'Hired': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-600">Manage your job postings and track recruitment progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalApplications} total applications
            </p>
            <Progress value={stats.activeJobs > 0 ? 75 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">
              {stats.offersMade} offers made
            </p>
            <Progress value={stats.interviewsScheduled > 0 ? 60 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              across all job postings
            </p>
            <Progress value={stats.totalViews > 0 ? 85 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeToHire} days</div>
            <p className="text-xs text-muted-foreground">
              average turnaround
            </p>
            <Progress value={stats.timeToHire > 0 ? 70 : 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Pipeline</CardTitle>
          <CardDescription>Track candidates through the hiring process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipeline.map((stage, index) => (
              <div key={stage.stage} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium">{stage.stage}</div>
                <div className="flex-1">
                  <Progress value={totalPipeline > 0 ? (stage.count / totalPipeline) * 100 : 0} className="h-2" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{stage.count}</span>
                  <div className={`w-3 h-3 rounded-full ${getPipelineColor(stage.stage)}`}></div>
                </div>
              </div>
            ))}
          </div>
          <Separator className="mt-4" />
          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <span>Total Candidates: {totalPipeline}</span>
            <span>Conversion Rate: {totalPipeline > 0 ? Math.round((stats.offersMade / totalPipeline) * 100) : 0}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest candidates who applied to your jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No applications yet</p>
            ) : (
              recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="font-medium">{application.candidateName}</h4>
                      {application.match > 0 && (
                        <Badge className={getMatchColor(application.match)}>
                          {application.match}% Match
                        </Badge>
                      )}
                      <Badge className={getStatusColor(application.status)}>
                        {formatStatus(application.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 flex-wrap gap-y-1">
                      <span className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {application.jobTitle}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {application.experience}
                      </span>
                      {application.location !== 'N/A' && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {application.location}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(application.applied).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button size="sm" className="bg-[#4880FF] hover:bg-[#3d72eb]" onClick={() => router.push('/recruiter/schedule-interview?tab=schedule')}>
                      Schedule Interview
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Separator className="mt-4" />
          <Button variant="outline" className="w-full mt-4">
            View All Applications
          </Button>
        </CardContent>
      </Card>

      {/* Job Postings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
          <CardDescription>Manage your active and draft job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentJobs.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No job postings yet</p>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <Badge className={getStatusColor(job.status)}>
                        {formatStatus(job.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 flex-wrap gap-y-1">
                      <span className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {job.type.replace('_', ' ')}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {job.views} views
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {job.applications} applications
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Posted {new Date(job.posted).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button size="sm" className="bg-[#4880FF] hover:bg-[#3d72eb]">
                      {job.status === 'DRAFT' ? 'Publish' : 'View'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Separator className="mt-4" />
          <Button variant="outline" className="w-full mt-4">
            View All Job Postings
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common recruitment tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center space-x-2 bg-[#4880FF] hover:bg-[#3d72eb]" onClick={() => router.push('/recruiter/post-job')}>
              <Briefcase className="h-4 w-4" />
              <span>Post New Job</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>View Candidates</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2" onClick={() => router.push('/recruiter/schedule-interview?tab=schedule')}>
              <Calendar className="h-4 w-4" />
              <span>Schedule Interviews</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
