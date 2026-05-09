/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AdminDashboardProps {
  user: any;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const stats = [
    { 
      title: "Total User", 
      value: "40,689", 
      change: "8.5%", 
      trend: "up", 
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      title: "Total Jobs", 
      value: "10,293", 
      change: "1.3%", 
      trend: "up", 
      icon: Briefcase,
      color: "text-yellow-600",
      bg: "bg-yellow-50"
    },
    { 
      title: "Total Revenue", 
      value: "$89,000", 
      change: "4.3%", 
      trend: "down", 
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    { 
      title: "Pending", 
      value: "2,040", 
      change: "1.8%", 
      trend: "up", 
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  return (
    <div className="space-y-8 bg-[#F5F6FA] min-h-screen p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
            {/* Custom SVG Chart to match the UI style */}
            <svg viewBox="0 0 1000 400" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4379EE" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#4379EE" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              {[0, 100, 200, 300, 400].map((y) => (
                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#F1F4F9" strokeWidth="1" />
              ))}
              {/* Area */}
              <path 
                d="M0,350 Q100,300 200,320 T400,150 T600,280 T800,100 T1000,200 L1000,400 L0,400 Z" 
                fill="url(#chartGradient)"
              />
              {/* Line */}
              <path 
                d="M0,350 Q100,300 200,320 T400,150 T600,280 T800,100 T1000,200" 
                fill="none" 
                stroke="#4379EE" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
              {/* Data Points */}
              {[
                {x: 200, y: 320, val: "20k"},
                {x: 400, y: 150, val: "45k", active: true},
                {x: 600, y: 280, val: "32k"},
                {x: 800, y: 100, val: "64k"}
              ].map((point, i) => (
                <g key={i}>
                  {point.active && (
                    <g>
                      <rect x={point.x - 40} y={point.y - 50} width="80" height="30" rx="6" fill="#4379EE" />
                      <text x={point.x} y={point.y - 30} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">64,366.77</text>
                      <line x1={point.x} y1={point.y} x2={point.x} y2="400" stroke="#4379EE" strokeWidth="2" strokeDasharray="4 4" />
                    </g>
                  )}
                  <circle cx={point.x} cy={point.y} r={6} fill="white" stroke="#4379EE" strokeWidth="3" />
                </g>
              ))}
              {/* X Axis Labels */}
              {['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'].map((label, i) => (
                <text key={i} x={i * 90} y="390" fontSize="12" fill="#A3AED0" fontWeight="bold">{label}</text>
              ))}
            </svg>
            
            {/* Device Usage Icons (floating like in image) */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
              {[
                { icon: '💻', color: 'bg-blue-600' },
                { icon: '📱', color: 'bg-blue-600' },
                { icon: '💻', color: 'bg-blue-600' },
                { icon: '📱', color: 'bg-blue-600' }
              ].map((item, i) => (
                <div key={i} className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center text-xl shadow-lg border-4 border-white`}>
                  {item.icon}
                </div>
              ))}
            </div>
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
              {[
                { title: "Anomaly Detected", desc: "Unexpected spike in recruiter signups from Germany region.", type: "warning", time: "2 mins ago" },
                { title: "Fraud Shield Active", desc: "Successfully blocked 42 bot-generated job postings.", type: "success", time: "1 hour ago" },
                { title: "Revenue Forecast", desc: "Predicted 12% growth for Q3 based on current trends.", type: "info", time: "3 hours ago" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-12 rounded-full ${
                    item.type === 'warning' ? 'bg-orange-400' : 
                    item.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#202224]">{item.title}</h4>
                      <span className="text-xs text-gray-400 font-bold">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Manage Users", icon: Users, color: "bg-blue-500" },
            { title: "Review Jobs", icon: Briefcase, color: "bg-purple-500" },
            { title: "Financials", icon: DollarSign, color: "bg-green-500" },
            { title: "System Audit", icon: FileText, color: "bg-orange-500" }
          ].map((action, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl hover:bg-gray-50 cursor-pointer transition-all active:scale-95">
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
