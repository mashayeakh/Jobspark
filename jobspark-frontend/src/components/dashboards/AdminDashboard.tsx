/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  Clock,
  Search,
  ChevronDown,
  Loader2,
  Sparkles,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { adminService, DashboardStats } from '@/services/adminService';
import { useRouter } from 'next/navigation';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface AdminDashboardProps {
  user: any;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancedAnalytics, setAdvancedAnalytics] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthTab, setSelectedMonthTab] = useState('MARCH');
  const [aiReport, setAiReport] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, historyRes, advancedRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalyticsHistory(7),
          adminService.getAdvancedAnalytics(selectedYear)
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (historyRes.success && historyRes.data) {
          setHistory(historyRes.data);
        }

        if (advancedRes.success && advancedRes.data) {
          setAdvancedAnalytics(advancedRes.data);
        }

        if (!statsRes.success) {
          setError(statsRes.error || 'Failed to fetch dashboard stats');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const generateAIReport = async () => {
    try {
      setIsAiLoading(true);
      const res = await adminService.getAIHealthReport();
      if (res.success && res.data) {
        setAiReport(res.data);
        setShowAiModal(true);
      }
    } catch (err) {
      console.error('AI Report error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: (stats?.totalUsers ?? 0).toLocaleString(),
      change: `${stats?.userGrowth ?? 0}%`,
      trend: (stats?.userGrowth ?? 0) > 0 ? "up" : "down",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Total Jobs",
      value: (stats?.totalJobs ?? 0).toLocaleString(),
      change: `${stats?.jobGrowth ?? 0}%`,
      trend: (stats?.jobGrowth ?? 0) > 0 ? "up" : "down",
      icon: Briefcase,
      color: "text-yellow-600",
      bg: "bg-yellow-50"
    },
    {
      title: "Total Applications",
      value: (stats?.totalApplications ?? 0).toLocaleString(),
      change: `${stats?.revenueGrowth ?? 0}%`,
      trend: (stats?.revenueGrowth ?? 0) > 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Pending Applications",
      value: (stats?.pendingApplications ?? 0).toLocaleString(),
      change: `${stats?.pendingGrowth ?? 0}%`,
      trend: (stats?.pendingGrowth ?? 0) > 0 ? "up" : "down",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#F5F6FA] min-h-screen p-8 relative">
      {/* Header with AI Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#202224] tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back, {user?.name || 'Administrator'}</p>
        </div>
        <Button 
          onClick={generateAIReport}
          disabled={isAiLoading}
          className="bg-gradient-to-r from-[#4379EE] to-[#CB3EF9] hover:opacity-90 text-white font-bold py-6 px-8 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex gap-3 items-center group"
        >
          {isAiLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
          )}
          <span>AI Platform Health Report</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#202224] opacity-70 text-sm font-semibold mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-[#202224]">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-[#00B69B]' : 'text-[#F93C65]'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-bold">{stat.change}</span>
                </div>
                <span className="text-sm text-gray-400 font-medium">
                  {stat.trend === 'up' ? 'Up from yesterday' : 'Down from yesterday'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: User Growth by Role */}
        <Card className="lg:col-span-1 border-0 shadow-sm rounded-3xl overflow-hidden bg-white h-[450px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statistics</p>
              <CardTitle className="text-xl font-black text-[#202224]">User Growth by Role</CardTitle>
            </div>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="text-xs font-bold text-gray-500 bg-gray-50 border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
            >
              {[2023, 2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={advancedAnalytics?.demographics || []} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11, fontWeight: 'bold' }} />
                <RechartsTooltip cursor={{ fill: '#F1F4F9' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                <Bar dataKey="jobseeker" name="JOBSEEKER" fill="#4379EE" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="recruiter" name="RECRUITER" fill="#CB3EF9" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="admin" name="ADMIN" fill="#F93C65" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Application Status Breakdown */}
        <Card className="lg:col-span-1 border-0 shadow-sm rounded-3xl overflow-hidden bg-white h-[450px]">
          <CardHeader className="pb-2 px-6 pt-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statistics</p>
            <CardTitle className="text-xl font-black text-[#202224]">Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={advancedAnalytics?.applicationBreakdown?.breakdown || []}
                  cx="50%"
                  cy="42%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {(advancedAnalytics?.applicationBreakdown?.breakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-black text-[#202224] leading-none">{advancedAnalytics?.applicationBreakdown?.total || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">This Month</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full px-6">
               {(advancedAnalytics?.applicationBreakdown?.breakdown || []).map((item: any) => (
                 <div key={item.status} className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: item.color }} />
                   <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">{item.status} {item.percentage}%</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Jobs Posted vs Applications Received */}
        <Card className="lg:col-span-1 border-0 shadow-sm rounded-3xl overflow-hidden bg-white h-[450px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statistics</p>
              <CardTitle className="text-xl font-black text-[#202224]">Jobs vs Applications</CardTitle>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
               <span className="text-[10px]">↑</span>
               <span>{advancedAnalytics?.growth || '0%'}</span>
            </div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="70%">
              <AreaChart data={advancedAnalytics?.jobsVsApps || []}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4379EE" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4379EE" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B69B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00B69B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis hide />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="jobsPosted" name="Jobs Posted" stroke="#4379EE" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" dot={{ r: 4, fill: '#4379EE', strokeWidth: 2, stroke: '#fff' }} />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#00B69B" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" dot={{ r: 4, fill: '#00B69B', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center gap-2 mt-4">
               {['MARCH', 'APRIL', 'MAY'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setSelectedMonthTab(tab)}
                   className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                     selectedMonthTab === tab 
                     ? 'bg-[#4379EE] text-white shadow-lg shadow-blue-200' 
                     : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
            
            <div className="flex justify-center gap-6 mt-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-0.5 bg-[#4379EE]" />
                 <span className="text-[10px] font-bold text-gray-500">Jobs Posted</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-0.5 bg-[#00B69B]" />
                 <span className="text-[10px] font-bold text-gray-500">Applications Received</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent AI Insights */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">AI Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(stats?.aiInsights && stats.aiInsights.length > 0 ? stats.aiInsights : [
                { title: "Anomaly Detected", desc: "Unexpected spike in recruiter signups from Germany region.", type: "warning", time: "2 mins ago" },
                { title: "Fraud Shield Active", desc: "Successfully blocked 42 bot-generated job postings.", type: "success", time: "1 hour ago" },
                { title: "Revenue Forecast", desc: "Predicted 12% growth for Q3 based on current trends.", type: "info", time: "3 hours ago" }
              ]).map((item, i) => {
                let timeDisplay = item.time;
                if (typeof item.time === 'string' && item.time.includes('T')) {
                  const date = new Date(item.time);
                  const now = new Date();
                  const diffMins = Math.round((now.getTime() - date.getTime()) / 60000);
                  if (diffMins < 60) timeDisplay = `${diffMins} mins ago`;
                  else if (diffMins < 1440) timeDisplay = `${Math.round(diffMins/60)} hours ago`;
                  else timeDisplay = date.toLocaleDateString();
                }

                return (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-12 rounded-full ${item.type === 'warning' ? 'bg-orange-400' :
                      item.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                      }`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-[#202224]">{item.title}</h4>
                        <span className="text-xs text-gray-400 font-bold">{timeDisplay}</span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Manage Users", icon: Users, color: "bg-blue-500", path: "/admin/users" },
            { title: "Review Jobs", icon: Briefcase, color: "bg-purple-500", path: "/admin/job-moderation" },
            { title: "Financials", icon: DollarSign, color: "bg-green-500", path: "/admin/financials" },
            { title: "System Audit", icon: FileText, color: "bg-orange-500", path: "/admin/anomaly-detection" }
          ].map((action, i) => (
            <Card
              key={i}
              className="border-0 shadow-sm rounded-2xl hover:bg-gray-50 cursor-pointer transition-all active:scale-95"
              onClick={() => router.push(action.path)}
            >
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className={`p-4 rounded-2xl ${action.color} text-white mb-4 shadow-lg`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <p className="font-bold text-[#202224]">{action.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Health Report Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl border-0 shadow-2xl rounded-[32px] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-[#4379EE] to-[#CB3EF9] p-8 text-white relative">
               <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                onClick={() => setShowAiModal(false)}
               >
                 <ChevronDown className="h-6 w-6 rotate-90" />
               </Button>
               <div className="flex items-center gap-4 mb-2">
                 <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                   <Sparkles className="h-6 w-6" />
                 </div>
                 <h2 className="text-2xl font-black">AI Health Report</h2>
               </div>
               <p className="opacity-90 font-medium">Llama-3 powered platform intelligence</p>
            </div>
            
            <CardContent className="p-8 space-y-8">
              {/* Summary Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#4379EE]">
                  <Zap className="h-5 w-5 fill-[#4379EE]" />
                  <h3 className="font-black uppercase text-xs tracking-widest">Executive Summary</h3>
                </div>
                <p className="text-[#202224] leading-relaxed font-medium">
                  {aiReport?.summary}
                </p>
              </div>

              <Separator className="bg-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bottleneck Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#F93C65]">
                    <Target className="h-5 w-5" />
                    <h3 className="font-black uppercase text-xs tracking-widest">Critical Bottleneck</h3>
                  </div>
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <p className="text-sm text-[#F93C65] font-bold">
                      {aiReport?.bottleneck}
                    </p>
                  </div>
                </div>

                {/* Recommendation Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#00B69B]">
                    <Lightbulb className="h-5 w-5" />
                    <h3 className="font-black uppercase text-xs tracking-widest">Admin Quick Action</h3>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-sm text-[#00B69B] font-bold">
                      {aiReport?.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowAiModal(false)}
                className="w-full py-6 rounded-2xl font-black text-[#202224] bg-gray-100 hover:bg-gray-200 border-none shadow-none"
              >
                Close Report
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
