'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Loader2,
  RefreshCw,
  Brain
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useState, useEffect } from 'react';

interface IndustryTrend {
  industry: string;
  currentJobs: number;
  previousPeriodJobs: number;
  growthRate: number;
  trend: 'RISING' | 'STABLE' | 'DECLINING';
  prediction: string;
}

interface MarketSurge {
  category: string;
  currentPeriod: number;
  previousPeriod: number;
  surgePercentage: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  topSkills: string[];
  avgSalary: number;
}

interface DemandForecast {
  skill: string;
  currentDemand: number;
  forecastedDemand: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  confidence: number;
  timeframe: string;
}

interface CompetitiveInsight {
  metric: string;
  topCompanies: {
    name: string;
    value: number;
    industry: string;
  }[];
  marketAverage: number;
  insight: string;
}

interface MarketData {
  industryTrends: {
    trends: IndustryTrend[];
    summary: string;
    overallMarketHealth: 'GROWING' | 'STABLE' | 'DECLINING';
  };
  marketSurge: {
    surges: MarketSurge[];
    summary: string;
    totalSurge: number;
  };
  demandForecast: {
    forecasts: DemandForecast[];
    summary: string;
    emergingSkills: string[];
  };
  competitiveIntelligence: {
    insights: CompetitiveInsight[];
    summary: string;
    topHiringCompanies: string[];
  };
}

export default function MarketIntelligencePage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getMarketIntelligenceDashboard(days);
      if (response.success && response.data) {
        setMarketData(response.data);
      } else {
        setError('Failed to load market intelligence data');
      }
    } catch (err) {
      setError('Error fetching market data');
      console.error('Market intelligence error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMarketData();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [days]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'RISING':
      case 'INCREASING':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'DECLINING':
      case 'DECREASING':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'text-red-600 bg-red-50';
      case 'MEDIUM':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getMarketHealthColor = (health: string) => {
    switch (health) {
      case 'GROWING':
        return 'text-green-600 bg-green-50';
      case 'DECLINING':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <AdminShell title="Market Intelligence">
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-500">Analyzing market data...</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  if (error || !marketData) {
    return (
      <AdminShell title="Market Intelligence">
        <div className="p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-red-50 rounded-full">
              <Brain className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Unable to load market data</h3>
            <p className="text-gray-500">{error || 'No market data available'}</p>
            <Button onClick={fetchMarketData} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Market Intelligence">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Market Intelligence</h2>
            <p className="text-gray-500 font-medium">AI-powered market analysis and predictions</p>
          </div>
          <div className="flex gap-4 items-center">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
            <Button onClick={fetchMarketData} variant="outline" className="rounded-xl border-gray-200 font-bold shadow-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="rounded-xl bg-blue-600 font-bold shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Market Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className={`p-3 rounded-2xl ${getMarketHealthColor(marketData.industryTrends.overallMarketHealth)}`}>
                  <BarChart3 className="h-6 w-6" />
                </div>
                <Badge className={`${getMarketHealthColor(marketData.industryTrends.overallMarketHealth)} border-0 font-bold`}>
                  {marketData.industryTrends.overallMarketHealth}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 font-bold mb-1">Market Health</p>
              <h3 className="text-lg font-bold text-[#202224] capitalize">{marketData.industryTrends.overallMarketHealth.toLowerCase()} market</h3>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-2xl text-orange-600 bg-orange-50">
                  <Zap className="h-6 w-6" />
                </div>
                <Badge className="text-orange-600 bg-orange-50 border-0 font-bold">
                  {marketData.marketSurge.surges.filter(s => s.severity === 'HIGH').length} High
                </Badge>
              </div>
              <p className="text-sm text-gray-500 font-bold mb-1">Market Surges</p>
              <h3 className="text-lg font-bold text-[#202224]">{marketData.marketSurge.surges.length} Active</h3>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-2xl text-purple-600 bg-purple-50">
                  <Target className="h-6 w-6" />
                </div>
                <Badge className="text-purple-600 bg-purple-50 border-0 font-bold">
                  {marketData.demandForecast.emergingSkills.length}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 font-bold mb-1">Emerging Skills</p>
              <h3 className="text-lg font-bold text-[#202224]">{marketData.demandForecast.emergingSkills.length} Rising</h3>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-2xl text-blue-600 bg-blue-50">
                  <Users className="h-6 w-6" />
                </div>
                <Badge className="text-blue-600 bg-blue-50 border-0 font-bold">
                  {marketData.competitiveIntelligence.topHiringCompanies.length}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 font-bold mb-1">Top Companies</p>
              <h3 className="text-lg font-bold text-[#202224]">Active Hiring</h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Industry Trends */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-gray-50">
              <CardTitle className="text-xl font-bold">Industry Hiring Trends</CardTitle>
              <Badge className="text-blue-600 bg-blue-50 border-0 font-bold">
                {marketData.industryTrends.trends.length} Industries
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {marketData.industryTrends.trends.slice(0, 6).map((trend, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center">
                        {getTrendIcon(trend.trend)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#202224]">{trend.industry}</h4>
                        <p className="text-xs text-gray-400 font-bold">{trend.prediction}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${trend.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.growthRate >= 0 ? '+' : ''}{trend.growthRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-400 font-bold">{trend.currentJobs} jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Surges */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-gray-50">
              <CardTitle className="text-xl font-bold">Market Surge Analysis</CardTitle>
              <Badge className="text-orange-600 bg-orange-50 border-0 font-bold">
                {marketData.marketSurge.totalSurge.toFixed(1)}% Total
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {marketData.marketSurge.surges.slice(0, 6).map((surge, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getSeverityColor(surge.severity)}`}>
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#202224]">{surge.category}</h4>
                        <p className="text-xs text-gray-400 font-bold">{surge.topSkills.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${surge.surgePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {surge.surgePercentage >= 0 ? '+' : ''}{surge.surgePercentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-400 font-bold">${surge.avgSalary.toLocaleString()} avg</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demand Forecast */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-gray-50">
            <CardTitle className="text-xl font-bold">Skills Demand Forecast</CardTitle>
            <Badge className="text-purple-600 bg-purple-50 border-0 font-bold">
              {marketData.demandForecast.forecasts.length} Skills Tracked
            </Badge>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketData.demandForecast.forecasts.slice(0, 9).map((forecast, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-[#202224]">{forecast.skill}</h4>
                    {getTrendIcon(forecast.trend)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current:</span>
                      <span className="font-bold">{forecast.currentDemand}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Forecast:</span>
                      <span className="font-bold text-blue-600">{forecast.forecastedDemand}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Confidence:</span>
                      <span className="font-bold">{forecast.confidence}%</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${forecast.trend === 'INCREASING' ? 'bg-green-500' :
                            forecast.trend === 'DECREASING' ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                        style={{ width: `${forecast.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competitive Intelligence */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-gray-50">
            <CardTitle className="text-xl font-bold">Competitive Intelligence</CardTitle>
            <Badge className="text-blue-600 bg-blue-50 border-0 font-bold">
              {marketData.competitiveIntelligence.insights.length} Metrics
            </Badge>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {marketData.competitiveIntelligence.insights.map((insight, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-[#202224]">{insight.metric}</h3>
                    <p className="text-sm text-gray-500">Market avg: {insight.marketAverage}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {insight.topCompanies.slice(0, 5).map((company, j) => (
                      <div key={j} className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-sm text-[#202224]">{company.name}</h4>
                        <p className="text-lg font-bold text-blue-600">{company.value}</p>
                        <p className="text-xs text-gray-400">{company.industry}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 italic">{insight.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
