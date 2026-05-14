/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { recruiterService, RecruiterDashboardData } from '@/services/recruiterService';
import { useRouter } from 'next/navigation';
import { RecruiterLoading } from '@/components/shared/RecruiterLoading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Clock,
  Eye,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(() => (typeof window !== 'undefined' ? authService.getUser() : null));
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<RecruiterDashboardData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData || userData.role !== 'RECRUITER') {
      router.push('/login');
      return;
    }

    recruiterService.getDashboard()
      .then((res) => {
        if (res.success && res.data) {
          setDashboardData(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const stats = dashboardData?.stats;
  const pipeline = dashboardData?.pipeline ?? [];
  const recentJobs = dashboardData?.recentJobs ?? [];

  const overviewStats = [
    { label: 'Total Views', value: stats?.totalViews?.toLocaleString() ?? '0', change: '+12.5%', trend: 'up', icon: Eye },
    { label: 'Applications', value: stats?.totalApplications?.toString() ?? '0', change: '+8.2%', trend: 'up', icon: Users },
    { label: 'Interviews', value: stats?.interviewsScheduled?.toString() ?? '0', change: '-2.1%', trend: 'down', icon: Target },
    { label: 'Time to Hire', value: `${stats?.timeToHire ?? 0} days`, change: '-3 days', trend: 'up', icon: Clock },
  ];

  const jobPerformance = recentJobs.map((job) => ({
    id: job.id,
    title: job.title,
    views: job.views,
    applications: job.applications,
    conversion: job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) : '0.0',
    status: 'up' as const,
  }));

  const sourceBreakdown = [
    { source: 'Direct Search', percentage: 42, count: stats?.totalApplications ? Math.round(stats.totalApplications * 0.42) : 0 },
    { source: 'LinkedIn', percentage: 28, count: stats?.totalApplications ? Math.round(stats.totalApplications * 0.28) : 0 },
    { source: 'Indeed', percentage: 18, count: stats?.totalApplications ? Math.round(stats.totalApplications * 0.18) : 0 },
    { source: 'Referrals', percentage: 8, count: stats?.totalApplications ? Math.round(stats.totalApplications * 0.08) : 0 },
    { source: 'Other', percentage: 4, count: stats?.totalApplications ? Math.round(stats.totalApplications * 0.04) : 0 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [renderTime] = useState(() => Date.now());

  const jobOpenings = recentJobs
    .filter(job => job.status === 'OPEN' || job.status === 'ACTIVE')
    .map((job) => ({
      id: job.id,
      title: job.title,
      status: job.status,
      applications: job.applications,
      views: job.views,
      postedDate: job.posted || '2024-01-15',
      type: job.type || 'FULL_TIME',
      location: job.location || 'Remote',
      daysOpen: Math.floor((renderTime - new Date(job.posted || '2024-01-15').getTime()) / (1000 * 60 * 60 * 24)),
    }));

  const totalPages = Math.ceil(jobOpenings.length / itemsPerPage);
  const paginatedJobs = jobOpenings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const monthlyData = dashboardData?.monthlyActivity ?? [
    { month: 'May', jobs: 0, applications: 0 },
    { month: 'Jun', jobs: 0, applications: 0 },
    { month: 'Jul', jobs: 0, applications: 0 },
    { month: 'Aug', jobs: 0, applications: 0 },
    { month: 'Sep', jobs: 0, applications: 0 },
  ];



  const maxApplications = Math.max(...monthlyData.map(d => d.applications));

  if (loading) {
    return <RecruiterLoading />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track recruitment performance and insights</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <stat.icon className="h-5 w-5 text-[#4880FF]" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-400 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Activity</CardTitle>
            <CardDescription>Jobs posted vs applications received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 w-8">{data.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress
                            value={(data.applications / maxApplications) * 100}
                            className="h-2"
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">{data.applications} apps</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-16 justify-center">
                      {data.jobs} jobs
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job Openings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Openings</CardTitle>
            <CardDescription>Current active job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedJobs.map((job) => (
                <div key={job.id} className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.daysOpen} days ago
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={(job.status === 'OPEN' || job.status === 'ACTIVE') ? 'default' : 'secondary'}
                      className={(job.status === 'OPEN' || job.status === 'ACTIVE')
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {job.status === 'OPEN' ? 'ACTIVE' : job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">{job.views}</span>
                        <span className="text-gray-400">views</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{job.applications}</span>
                        <span className="text-gray-400">applications</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Target className="h-4 w-4" />
                        <span className="font-medium">
                          {job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) : '0.0'}%
                        </span>
                        <span className="text-gray-400">conversion</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, jobOpenings.length)}</span> of{' '}
                  <span className="font-medium">{jobOpenings.length}</span> active jobs
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Job Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Performance</CardTitle>
            <CardDescription>Views and conversion rates by job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobPerformance.map((job) => (
                <div key={job.id} className="p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900">{job.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {job.conversion}% conv.
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {job.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {job.applications} apps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Sources</CardTitle>
            <CardDescription>Where candidates are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceBreakdown.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{source.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 font-semibold">{source.count}</span>
                      <span className="text-xs text-gray-400 w-8 text-right">{source.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
