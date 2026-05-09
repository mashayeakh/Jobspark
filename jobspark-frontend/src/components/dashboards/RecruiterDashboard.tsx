'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  FileText, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MapPin,
  DollarSign,
  Calendar,
  UserPlus,
  Building,
  BarChart3
} from 'lucide-react';

interface RecruiterDashboardProps {
  user: any;
}

export function RecruiterDashboard({ user }: RecruiterDashboardProps) {
  // Hardcoded data for demonstration
  const stats = {
    activeJobs: 8,
    totalApplications: 234,
    interviewsScheduled: 15,
    offersMade: 3,
    profileViews: 1567,
    timeToHire: 18,
    costPerHire: 4500,
    qualityOfHire: 85
  };

  const jobPostings = [
    { 
      id: 1, 
      title: 'Senior React Developer', 
      status: 'ACTIVE',
      applications: 45,
      views: 892,
      posted: '2024-01-10',
      expires: '2024-02-10',
      type: 'FULL_TIME',
      location: 'San Francisco, CA'
    },
    { 
      id: 2, 
      title: 'Product Manager', 
      status: 'ACTIVE',
      applications: 67,
      views: 1234,
      posted: '2024-01-08',
      expires: '2024-02-08',
      type: 'HYBRID',
      location: 'Remote'
    },
    { 
      id: 3, 
      title: 'UX Designer', 
      status: 'DRAFT',
      applications: 0,
      views: 0,
      posted: '2024-01-15',
      expires: '2024-02-15',
      type: 'ONSITE',
      location: 'New York, NY'
    },
    { 
      id: 4, 
      title: 'Data Scientist', 
      status: 'EXPIRED',
      applications: 23,
      views: 456,
      posted: '2023-12-20',
      expires: '2024-01-20',
      type: 'REMOTE',
      location: 'Austin, TX'
    },
  ];

  const recentApplications = [
    { 
      id: 1, 
      candidateName: 'John Doe',
      jobTitle: 'Senior React Developer',
      status: 'INTERVIEW_SCHEDULED',
      applied: '2024-01-15',
      experience: '5 years',
      location: 'San Francisco, CA',
      match: 92
    },
    { 
      id: 2, 
      candidateName: 'Jane Smith',
      jobTitle: 'Product Manager',
      status: 'SHORTLISTED',
      applied: '2024-01-14',
      experience: '3 years',
      location: 'Remote',
      match: 88
    },
    { 
      id: 3, 
      candidateName: 'Mike Johnson',
      jobTitle: 'UX Designer',
      status: 'UNDER_REVIEW',
      applied: '2024-01-13',
      experience: '4 years',
      location: 'New York, NY',
      match: 85
    },
    { 
      id: 4, 
      candidateName: 'Sarah Wilson',
      jobTitle: 'Data Scientist',
      status: 'REJECTED',
      applied: '2024-01-12',
      experience: '2 years',
      location: 'Austin, TX',
      match: 72
    },
  ];

  const pipeline = [
    { stage: 'Applied', count: 89, color: 'bg-blue-500' },
    { stage: 'Screening', count: 45, color: 'bg-yellow-500' },
    { stage: 'Interview', count: 23, color: 'bg-purple-500' },
    { stage: 'Offer', count: 8, color: 'bg-green-500' },
    { stage: 'Hired', count: 3, color: 'bg-emerald-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'INTERVIEW_SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'SHORTLISTED': return 'bg-purple-100 text-purple-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
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

  const totalApplications = pipeline.reduce((sum, stage) => sum + stage.count, 0);

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
            <Progress value={75} className="mt-2" />
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
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
            <Progress value={85} className="mt-2" />
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
              -5 days from last month
            </p>
            <Progress value={70} className="mt-2" />
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
                  <Progress value={(stage.count / totalApplications) * 100} className="h-2" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{stage.count}</span>
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                </div>
              </div>
            ))}
          </div>
          <Separator className="mt-4" />
          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <span>Total Candidates: {totalApplications}</span>
            <span>Conversion Rate: {Math.round((stats.offersMade / totalApplications) * 100)}%</span>
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
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{application.candidateName}</h4>
                    <Badge className={getMatchColor(application.match)}>
                      {application.match}% Match
                    </Badge>
                    <Badge className={getStatusColor(application.status)}>
                      {formatStatus(application.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {application.jobTitle}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {application.experience}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {application.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {application.applied}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button size="sm">
                    Schedule Interview
                  </Button>
                </div>
              </div>
            ))}
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
            {jobPostings.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{job.title}</h4>
                    <Badge className={getStatusColor(job.status)}>
                      {formatStatus(job.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
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
                      <FileText className="h-3 w-3 mr-1" />
                      {job.applications} applications
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Posted {job.posted}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">
                    {job.status === 'DRAFT' ? 'Publish' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
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
            <Button className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Post New Job</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>View Candidates</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Schedule Interviews</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
