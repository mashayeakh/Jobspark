'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Target,
  Loader2,
  Search
} from 'lucide-react';

// TypeScript interfaces
interface ContentSanityResult {
  biasScore: number;
  biasFlags: {
    gender: boolean;
    age: boolean;
    race: boolean;
    disability: boolean;
    cultural: boolean;
  };
  qualityScore: number;
  languageIssues: string[];
  suggestions: string[];
  needsReview: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface JobAnalysis {
  id: string;
  title: string;
  company: string;
  recruiter: string;
  analysis: ContentSanityResult;
  createdAt: string;
  status: 'SAFE' | 'UNDER_REVIEW' | 'FLAGGED';
}

interface SanityStats {
  totalJobs: number;
  safeJobs: number;
  flaggedJobs: number;
  sanityRate: string;
  biasBreakdown: {
    gender: number;
    age: number;
    race: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

// Validation utilities
const validateJobId = (jobId: string): boolean => {
  return /^[a-zA-Z0-9-]{1,50}$/.test(jobId);
};

export default function ContentSanityPage() {
  const [stats, setStats] = useState<SanityStats | null>(null);
  const [jobs, setJobs] = useState<JobAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobAnalysis | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [jobIdInput, setJobIdInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // API functions
  const fetchStats = useCallback(async () => {
    try {
      console.log('🔍 [CLIENT] Starting fetchStats...');
      console.log('🔍 [CLIENT] Fetching from: /api/admin/content-sanity/stats');

      const response = await fetch('/api/admin/content-sanity/stats');

      console.log('🔍 [CLIENT] Response status:', response.status);
      console.log('🔍 [CLIENT] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 [CLIENT] Response error text:', errorText);
        throw new Error(`Failed to fetch stats - Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 [CLIENT] Response data:', data);

      if (data.success) {
        console.log('🔍 [CLIENT] Stats data received:', data.result);
        setStats(data.result);
      } else {
        console.error('🔍 [CLIENT] API returned success=false:', data);

        // Check if backend is offline
        if (data.backendOffline) {
          console.warn('🔍 [CLIENT] Backend is offline - showing empty stats');
          setStats(data.result); // Still set the fallback stats
        }
      }
    } catch (error) {
      console.error('🔍 [CLIENT] Error in fetchStats:', error);
      console.error('🔍 [CLIENT] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      console.log('🔍 [CLIENT] Starting fetchJobs...');

      setLoading(true);
      const response = await fetch('/api/admin/content-sanity/jobs');

      if (!response.ok) throw new Error('Failed to fetch jobs');

      const data = await response.json();
      console.log('🔍 [CLIENT] Jobs response data:', data);

      if (data.success) {
        setJobs(data.result);
      } else {
        console.error('🔍 [CLIENT] Jobs API returned success=false:', data);

        // Check if backend is offline
        if (data.backendOffline) {
          console.warn('🔍 [CLIENT] Backend is offline - showing empty jobs list');
          setJobs([]); // Set empty array for jobs
        }
      }
    } catch (error) {
      console.error('🔍 [CLIENT] Error in fetchJobs:', error);
      console.error('🔍 [CLIENT] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeJob = async (jobId: string) => {
    if (!validateJobId(jobId)) {
      setErrors({ jobId: 'Invalid job ID format' });
      return;
    }

    try {
      setAnalyzing(true);
      setErrors({});

      const response = await fetch(`/api/admin/content-sanity/analyze/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      if (data.success) {
        await fetchJobs();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error analyzing job:', error);
      setErrors({ analysis: 'Failed to analyze job. Please try again.' });
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerBatchAnalysis = async () => {
    try {
      setAnalyzing(true);
      const response = await fetch('/api/admin/content-sanity/analyze-all', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Batch analysis failed');

      const data = await response.json();
      if (data.success) {
        await fetchJobs();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error in batch analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  // Form validation
  const validateAnalysisForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateJobId(jobIdInput)) {
      newErrors.jobId = 'Please enter a valid job ID (alphanumeric, max 50 chars)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || job.analysis.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  // Get risk level color
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-50 text-red-600 border-red-200';
      case 'HIGH': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'LOW': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Get bias badge color
  const getBiasColor = (hasBias: boolean) => {
    return hasBias ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
  };

  useEffect(() => {
    // Use a timeout to defer state updates and avoid "cascading renders" warnings
    const timeoutId = setTimeout(() => {
      fetchStats();
      fetchJobs();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchStats, fetchJobs]);

  return (
    <AdminShell title="Content Sanity">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Content Sanity</h2>
            <p className="text-gray-500 font-medium">AI-driven bias detection and content quality analysis</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-gray-200 font-bold bg-white"
              onClick={triggerBatchAnalysis}
              disabled={analyzing}
            >
              {analyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Analyze All Jobs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-bold mb-1">Total Jobs</p>
                    <h3 className="text-2xl font-bold text-blue-600">{stats.totalJobs.toLocaleString()}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-bold mb-1">Clean Content</p>
                    <h3 className="text-2xl font-bold text-green-600">{stats.sanityRate}%</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-bold mb-1">Flagged Jobs</p>
                    <h3 className="text-2xl font-bold text-orange-600">{stats.flaggedJobs}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-bold mb-1">Bias Detected</p>
                    <h3 className="text-2xl font-bold text-red-600">
                      {stats.biasBreakdown.gender + stats.biasBreakdown.age + stats.biasBreakdown.race}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Form */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-6 border-b border-gray-50">
            <CardTitle className="text-xl font-bold text-[#202224]">Analyze Job Content</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="jobId">Job ID</Label>
                <Input
                  id="jobId"
                  value={jobIdInput}
                  onChange={(e) => setJobIdInput(e.target.value)}
                  placeholder="Enter job ID to analyze..."
                  className={errors.jobId ? 'border-red-500' : ''}
                />
                {errors.jobId && (
                  <p className="text-sm text-red-500 mt-1">{errors.jobId}</p>
                )}
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    if (validateAnalysisForm()) {
                      analyzeJob(jobIdInput);
                    }
                  }}
                  disabled={analyzing || !jobIdInput}
                >
                  {analyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Target className="h-4 w-4 mr-2" />}
                  Analyze
                </Button>
              </div>
            </div>
            {errors.analysis && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">{errors.analysis}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Jobs List */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-6 border-b border-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-[#202224]">Content Analysis Results</CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#202224]">{job.title}</h4>
                          <p className="text-sm text-gray-400 font-bold uppercase">{job.company} • {job.recruiter}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Bias Detection */}
                        <div className="flex gap-2">
                          <Badge className={getBiasColor(job.analysis.biasFlags.gender)}>
                            Gender
                          </Badge>
                          <Badge className={getBiasColor(job.analysis.biasFlags.age)}>
                            Age
                          </Badge>
                          <Badge className={getBiasColor(job.analysis.biasFlags.race)}>
                            Race
                          </Badge>
                        </div>

                        {/* Quality Score */}
                        <div className="text-center">
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">Quality</p>
                          <div className="flex items-center gap-2">
                            <Progress value={job.analysis.qualityScore} className="w-16 h-2" />
                            <span className="text-sm font-bold">{job.analysis.qualityScore}%</span>
                          </div>
                        </div>

                        {/* Risk Level */}
                        <div>
                          <Badge className={`${getRiskColor(job.analysis.riskLevel)} border-0 px-3 py-1.5 rounded-lg font-bold`}>
                            {job.analysis.riskLevel}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-blue-500 hover:bg-blue-50 rounded-xl"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="p-6 border-b border-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-[#202224]">{selectedJob.title}</CardTitle>
                    <p className="text-sm text-gray-400 font-bold uppercase">{selectedJob.company}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedJob(null)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="bias" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="bias">Bias Detection</TabsTrigger>
                    <TabsTrigger value="quality">Quality Analysis</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="corrections">Corrections</TabsTrigger>
                  </TabsList>

                  <TabsContent value="bias" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-bold mb-3">Bias Detection Results</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>Gender Bias</span>
                            <Badge className={getBiasColor(selectedJob.analysis.biasFlags.gender)}>
                              {selectedJob.analysis.biasFlags.gender ? 'Detected' : 'Clear'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>Age Bias</span>
                            <Badge className={getBiasColor(selectedJob.analysis.biasFlags.age)}>
                              {selectedJob.analysis.biasFlags.age ? 'Detected' : 'Clear'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>Race Bias</span>
                            <Badge className={getBiasColor(selectedJob.analysis.biasFlags.race)}>
                              {selectedJob.analysis.biasFlags.race ? 'Detected' : 'Clear'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold mb-3">Overall Risk Assessment</h4>
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                          <div className="text-4xl font-bold mb-2">{selectedJob.analysis.biasScore}%</div>
                          <Badge className={`${getRiskColor(selectedJob.analysis.riskLevel)} text-lg px-4 py-2`}>
                            {selectedJob.analysis.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quality" className="space-y-4">
                    <div>
                      <h4 className="font-bold mb-3">Content Quality Score</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <Progress value={selectedJob.analysis.qualityScore} className="flex-1 h-3" />
                          <span className="text-2xl font-bold">{selectedJob.analysis.qualityScore}%</span>
                        </div>
                        {selectedJob.analysis.languageIssues.length > 0 && (
                          <div>
                            <h5 className="font-semibold mb-2">Language Issues:</h5>
                            <ul className="space-y-1">
                              {selectedJob.analysis.languageIssues.map((issue, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 text-orange-500" />
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="suggestions" className="space-y-4">
                    <div>
                      <h4 className="font-bold mb-3">Inclusive Language Suggestions</h4>
                      <ul className="space-y-2">
                        {selectedJob.analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="corrections" className="space-y-4">
                    <div>
                      <h4 className="font-bold mb-3">Automated Corrections</h4>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Automated corrections are being developed. This feature will suggest specific text replacements
                          to improve inclusivity and remove biased language.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
