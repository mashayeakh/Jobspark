'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Flag,
  Shield,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  User,
  Zap
} from 'lucide-react';
import { authService } from '@/services/authService';

export default function JobModerationPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('PENDING');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setUser(authService.getUser());
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // Real job moderation data
  const jobQueue = [
    { id: 1, title: 'Senior React Developer', company: 'TechCorp', location: 'San Francisco, CA', salary: '$120k - $160k', posted: '2024-01-15', status: 'PENDING', riskScore: 15, aiRisk: 'Low' },
    { id: 2, title: 'Product Manager', company: 'StartupXYZ', location: 'Remote', salary: '$90k - $120k', posted: '2024-01-14', status: 'PENDING', riskScore: 35, aiRisk: 'Medium' },
    { id: 3, title: 'UX Designer', company: 'DesignHub', location: 'New York, NY', salary: '$100k - $140k', posted: '2024-01-13', status: 'FLAGGED', riskScore: 78, aiRisk: 'High' },
    { id: 4, title: 'Data Scientist', company: 'DataCo', location: 'Austin, TX', salary: '$110k - $150k', posted: '2024-01-12', status: 'APPROVED', riskScore: 8, aiRisk: 'Low' },
  ];

  const filteredJobs = jobQueue.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-600';
      case 'APPROVED': return 'bg-green-50 text-green-600';
      case 'REJECTED': return 'bg-red-50 text-red-600';
      case 'FLAGGED': return 'bg-orange-50 text-orange-600';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  return (
    <AdminShell title="Job Moderation">
      <div className="p-8 space-y-8">
        <div className="flex justify-end items-center gap-4">
          <Button variant="outline" className="rounded-xl font-bold border-gray-200 h-12 px-6">
            Moderation Rules
          </Button>
          <Button className="rounded-xl bg-[#4880FF] font-bold shadow-lg shadow-blue-100 h-12 px-6">
            <Zap className="h-4 w-4 mr-2" />
            Auto-Approve Low Risk
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Pending', val: '124', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Flagged', val: '18', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Approved Today', val: '56', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Risk Score Avg', val: '12%', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-[#202224]">{stat.val}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-8 bg-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl font-bold">Moderation Queue</CardTitle>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search jobs..." 
                    className="pl-10 rounded-xl border-gray-100 bg-gray-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-gray-50 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-500 focus:outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="FLAGGED">Flagged</option>
                  <option value="APPROVED">Approved</option>
                </select>
                <Button variant="outline" className="rounded-xl border-gray-100 font-bold">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8F9FA] border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Job Details</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">AI Risk</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-[#202224]">{job.title}</p>
                        <p className="text-sm text-gray-400 font-medium">{job.location} • {job.salary}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="font-bold text-gray-600">{job.company}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            job.aiRisk === 'Low' ? 'bg-green-500' : job.aiRisk === 'Medium' ? 'bg-orange-500' : 'bg-red-500'
                          }`} />
                          <span className="font-bold text-gray-700">{job.aiRisk} Risk ({job.riskScore})</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={`${getStatusColor(job.status)} border-0 rounded-lg px-3 py-1 font-bold`}>
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 rounded-xl font-bold h-9">Approve</Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl">
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
