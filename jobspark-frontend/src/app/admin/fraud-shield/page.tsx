/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  TrendingUp,
  Activity,
  Target,
  Loader2,
  Search,
  Filter,
  XCircle,
  Zap
} from 'lucide-react';
import { adminService } from '@/services/adminService';

export default function FraudShieldPage() {
  const [stats, setStats] = useState<any>(null);
  const [flaggedJobs, setFlaggedJobs] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  const fetchFraudData = async () => {
    try {
      setLoading(true);
      const [statsResponse, flaggedResponse, alertsResponse, metricsResponse] = await Promise.all([
        adminService.getFraudStats(),
        adminService.getFlaggedJobs({ limit: 20 }),
        adminService.getFraudAlerts(10),
        adminService.getFraudMetrics(30)
      ]);

      if (statsResponse.success) setStats(statsResponse.data);
      if (flaggedResponse.success) setFlaggedJobs(flaggedResponse.data.jobs || []);
      if (alertsResponse.success) setAlerts(alertsResponse.data || []);
      if (metricsResponse.success) setMetrics(metricsResponse.data);

      if (!statsResponse.success && !flaggedResponse.success) {
        setError('Failed to fetch fraud detection data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Fraud shield fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFraudData();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleAnalyzeJob = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      const response = await adminService.analyzeJob(jobId);
      if (response.success) {
        setSelectedJob(response.data);
        alert('Job analysis completed');
      } else {
        alert(response.error || 'Failed to analyze job');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOverrideDetection = async (jobId: string, status: 'SAFE' | 'FLAGGED') => {
    const reason = prompt(`Enter reason for marking job as ${status}:`);
    if (!reason) return;

    try {
      setActionLoading(jobId);
      const response = await adminService.overrideFraudDetection(jobId, status, reason);
      if (response.success) {
        alert(`Job marked as ${status} successfully`);
        await fetchFraudData();
      } else {
        alert(response.error || 'Failed to override detection');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTriggerAnalysis = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      const response = await adminService.triggerAnalysis(jobId);
      if (response.success) {
        alert('Manual analysis triggered successfully');
        setSelectedJob(response.data);
      } else {
        alert(response.error || 'Failed to trigger analysis');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-50 text-red-600 border-red-200';
    if (score >= 60) return 'bg-orange-50 text-orange-600 border-orange-200';
    if (score >= 40) return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    return 'bg-green-50 text-green-600 border-green-200';
  };

  const getRiskIcon = (score: number) => {
    if (score >= 80) return <AlertTriangle className="h-4 w-4" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4" />;
    if (score >= 40) return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const filteredJobs = flaggedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'ALL' ||
      (filterRisk === 'HIGH' && job.fraudScore >= 60) ||
      (filterRisk === 'MEDIUM' && job.fraudScore >= 40 && job.fraudScore < 60) ||
      (filterRisk === 'LOW' && job.fraudScore < 40);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminShell title="AI Fraud Shield">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell title="AI Fraud Shield">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="AI Fraud Shield">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">AI Fraud Shield</h2>
            <p className="text-gray-500 font-medium">Real-time fraud detection and job post analysis</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="rounded-xl border-gray-200 font-bold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button className="rounded-xl bg-[#4880FF] font-bold shadow-lg shadow-blue-100">
              <Zap className="h-4 w-4 mr-2" />
              Analyze All Jobs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Jobs', val: (stats?.totalJobs || 0).toLocaleString(), icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Flagged Jobs', val: (stats?.flaggedJobs || 0).toLocaleString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Safe Jobs', val: (stats?.safeJobs || 0).toLocaleString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Avg Risk Score', val: `${Math.round(stats?.avgRiskScore || 0)}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
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

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <Card className="border-0 shadow-sm rounded-2xl bg-red-50 border-red-200">
            <CardHeader className="p-6 border-b border-red-200">
              <CardTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent High-Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {alerts.slice(0, 3).map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-bold text-[#202224]">{alert.title}</p>
                        <p className="text-sm text-gray-500">{alert.company?.name}</p>
                      </div>
                    </div>
                    <Badge className={`bg-red-600 text-white border-0`}>
                      Risk Score: {alert.fraudScore}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flagged Jobs Table */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-8 bg-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl font-bold">Flagged Jobs ({filteredJobs.length})</CardTitle>
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
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                >
                  <option value="ALL">All Risk Levels</option>
                  <option value="HIGH">High Risk (60+)</option>
                  <option value="MEDIUM">Medium Risk (40-59)</option>
                  <option value="LOW">Low Risk (&lt;40)</option>
                </select>
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
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Score</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Flagged Date</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Applications</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-[#202224]">{job.title}</p>
                        <p className="text-sm text-gray-400 font-medium">{job.location}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-600">{job.company?.name}</span>
                          {job.company?.isVerified && (
                            <Badge className="bg-blue-50 text-blue-600 border-0 text-xs">Verified</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={`${getRiskColor(job.fraudScore)} border px-3 py-1 font-bold flex items-center gap-2 w-fit`}>
                          {getRiskIcon(job.fraudScore)}
                          {job.fraudScore}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-gray-500 font-bold">
                        {new Date(job.fraudFlaggedAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-gray-50 text-gray-600 border-0 px-3 py-1 font-bold">
                          {job._count?.applications || 0}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                            onClick={() => handleAnalyzeJob(job.id)}
                            disabled={actionLoading === job.id}
                          >
                            {actionLoading === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl"
                            onClick={() => handleOverrideDetection(job.id, 'SAFE')}
                            disabled={actionLoading === job.id}
                          >
                            {actionLoading === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
                            onClick={() => handleTriggerAnalysis(job.id)}
                            disabled={actionLoading === job.id}
                          >
                            {actionLoading === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No flagged jobs found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Analysis Detail Modal */}
        {selectedJob && (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="p-6 bg-blue-50 flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-blue-600">Fraud Analysis Result</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{selectedJob.riskLevel} RISK</h3>
                    <p className="text-gray-500">Risk Score: {selectedJob.riskScore}</p>
                  </div>
                  <Badge className={`${getRiskColor(selectedJob.riskScore)} border px-4 py-2 font-bold text-lg`}>
                    {selectedJob.riskScore}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Flagged Issues:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.flaggedIssues?.map((issue: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600">{issue}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Recommendation:</h4>
                  <p className="text-sm text-gray-600">{selectedJob.recommendation}</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Scam Indicators:</h4>
                  <div className="space-y-2">
                    {selectedJob.scamIndicators?.map((indicator: any, i: number) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-bold text-sm">{indicator.category}</p>
                        <p className="text-xs text-gray-500">Confidence: {indicator.confidence}%</p>
                        <p className="text-xs text-gray-500">Evidence: {indicator.evidence?.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
