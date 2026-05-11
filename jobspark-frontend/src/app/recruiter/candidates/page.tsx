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
  Download
} from 'lucide-react';

export default function CandidatesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
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

  const candidates = applications.map((app) => {
    const latestWork = app.seeker.workExperience[0];
    const experience = latestWork
      ? `${latestWork.title} at ${latestWork.companyName}`
      : 'N/A';
    return {
      id: app.id,
      name: app.seeker.user.name,
      email: app.seeker.user.email,
      location: 'N/A',
      appliedFor: app.job.title,
      appliedDate: app.appliedAt,
      experience,
      status: app.status,
      match: 0,
      skills: app.seeker.skills.map((s) => s.skill.name),
    };
  });

  const total = candidates.length;
  const shortlisted = candidates.filter((c) => c.status === 'SHORTLISTED').length;
  const interviewing = candidates.filter((c) => c.status === 'INTERVIEWING').length;
  const offered = candidates.filter((c) => c.status === 'OFFERED').length;

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

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.appliedFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <div key={candidate.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4880FF] to-blue-600 text-white font-bold text-lg">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {candidate.appliedFor}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {candidate.location}
                        </span>
                        <span>{candidate.experience}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {candidate.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs border-blue-200 text-[#4880FF]">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:justify-end">
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <span className="text-sm font-medium text-gray-600">{candidate.match}%</span>
                      <Progress value={candidate.match} className="h-2 w-24" />
                    </div>
                    <Badge className={getStatusColor(candidate.status)}>
                      {formatStatus(candidate.status)}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
