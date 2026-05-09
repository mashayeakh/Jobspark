'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Heart, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Bookmark
} from 'lucide-react';

interface JobSeekerDashboardProps {
  user: any;
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

  const recommendedJobs = [
    { 
      id: 1, 
      title: 'Senior Software Engineer', 
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$150k - $200k',
      type: 'FULL_TIME',
      match: 92,
      posted: '2 days ago'
    },
    { 
      id: 2, 
      title: 'React Developer', 
      company: 'Meta',
      location: 'Remote',
      salary: '$130k - $180k',
      type: 'REMOTE',
      match: 88,
      posted: '3 days ago'
    },
    { 
      id: 3, 
      title: 'Frontend Engineer', 
      company: 'Amazon',
      location: 'Seattle, WA',
      salary: '$120k - $160k',
      type: 'HYBRID',
      match: 85,
      posted: '1 week ago'
    },
  ];

  const savedJobs = [
    { 
      id: 1, 
      title: 'Product Manager', 
      company: 'Microsoft',
      location: 'Redmond, WA',
      salary: '$140k - $180k',
      type: 'FULL_TIME',
      saved: '2024-01-10'
    },
    { 
      id: 2, 
      title: 'DevOps Engineer', 
      company: 'Netflix',
      location: 'Los Angeles, CA',
      salary: '$130k - $170k',
      type: 'REMOTE',
      saved: '2024-01-08'
    },
  ];

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

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'bg-green-100 text-green-800';
    if (match >= 80) return 'bg-blue-100 text-blue-800';
    if (match >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
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
          <div className="space-y-4">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{job.title}</h4>
                    <Badge className={getMatchColor(job.match)}>
                      {job.match}% Match
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {job.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.salary}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {job.posted}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
          <CardDescription>Jobs you've saved for later</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {job.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.salary}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Saved {job.saved}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                  <Button size="sm">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Separator className="mt-4" />
          <Button variant="outline" className="w-full mt-4">
            View All Saved Jobs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
