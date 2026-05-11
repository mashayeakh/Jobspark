'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Shield,
  Globe,
  Users,
  Loader2
} from 'lucide-react';
import { adminService, Company } from '@/services/adminService';

export default function CompanyManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCompanies();
      if (response.success && response.data) {
        setCompanies(response.data.companies);
      } else {
        setError(response.error || 'Failed to fetch companies');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Companies fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCompany = async (companyId: string) => {
    try {
      setActionLoading(companyId);
      const response = await adminService.verifyCompany(companyId);
      if (response.success) {
        alert('Company verified successfully');
        await fetchCompanies(); // Refresh companies list
      } else {
        alert(response.error || 'Failed to verify company');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCompanies = (companies || []).filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'ALL' ||
      (filterStatus === 'VERIFIED' && company.isVerified) ||
      (filterStatus === 'PENDING' && !company.isVerified);

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600';
  };

  const getStatusIcon = (isVerified: boolean) => {
    return isVerified ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <AdminShell title="Company Verification">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell title="Company Verification">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </AdminShell>
    );
  }

  const companyStats = {
    total: (companies || []).length,
    verified: (companies || []).filter(c => c.isVerified).length,
    pending: (companies || []).filter(c => !c.isVerified).length,
  };

  return (
    <AdminShell title="Company Verification">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Company Verification</h2>
            <p className="text-gray-500 font-medium">Manage and verify company profiles on the platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Companies', val: companyStats.total.toLocaleString(), icon: Building, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Verified', val: companyStats.verified.toLocaleString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending Verification', val: companyStats.pending.toLocaleString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
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
              <CardTitle className="text-xl font-bold">Company Directory</CardTitle>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search companies..."
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
                  <option value="VERIFIED">Verified</option>
                  <option value="PENDING">Pending</option>
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
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Industry</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Size</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                            {company.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#202224]">{company.name}</p>
                            <p className="text-sm text-gray-400 font-medium">{company.email}</p>
                            {company.website && (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Globe className="h-3 w-3" />
                                {company.website}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {company.industry ? (
                          <Badge className="bg-gray-50 text-gray-600 border-0 rounded-lg px-3 py-1 font-bold">
                            {company.industry}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {company.size ? (
                          <Badge className="bg-blue-50 text-blue-600 border-0 rounded-lg px-3 py-1 font-bold">
                            {company.size}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-gray-500 font-bold">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={`${getStatusColor(company.isVerified)} border-0 rounded-lg px-3 py-1 font-bold flex items-center gap-2 w-fit`}>
                          {getStatusIcon(company.isVerified)}
                          {company.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!company.isVerified && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl"
                              onClick={() => handleVerifyCompany(company.id)}
                              disabled={actionLoading === company.id}
                            >
                              {actionLoading === company.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No companies found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
