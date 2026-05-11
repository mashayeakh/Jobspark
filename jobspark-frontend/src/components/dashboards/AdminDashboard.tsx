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
  Bell,
  ChevronDown,
  Loader2
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
  Tooltip as RechartsTooltip
} from 'recharts';

interface AdminDashboardProps {
  user: any;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, historyRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalyticsHistory(7)
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (historyRes.success && historyRes.data) {
          setHistory(historyRes.data);
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
  }, []);

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
    <div className="space-y-8 bg-[#F5F6FA] min-h-screen p-8">
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

      {/* Main Chart Area */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-8 pb-0">
          <CardTitle className="text-xl font-bold text-[#202224]">Platform Performance</CardTitle>
          <div className="flex items-center gap-4 bg-[#F8F9FA] p-1 rounded-lg">
            <Button variant="ghost" size="sm" className="bg-white shadow-sm hover:bg-white text-blue-600 font-bold">Monthly</Button>
            <Button variant="ghost" size="sm" className="text-gray-500 font-bold">Weekly</Button>
            <Button variant="ghost" size="sm" className="text-gray-500 font-bold">Daily</Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[400px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4379EE" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4379EE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F9" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => {
                    try {
                      const date = new Date(str);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    } catch (e) {
                      return str;
                    }
                  }}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 'bold' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 'bold' }}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalJobs" 
                  name="Jobs"
                  stroke="#4379EE" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="totalUsers" 
                  name="Users"
                  stroke="#00B69B" 
                  strokeWidth={4}
                  fillOpacity={0} 
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
