'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Globe, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const trendingRoles = [
  { role: 'AI Engineer', demand: '+142%', growth: 'Exponential', region: 'San Francisco, CA' },
  { role: 'Product Designer', demand: '+18%', growth: 'Stable', region: 'London, UK' },
  { role: 'Cloud Architect', demand: '+35%', growth: 'High', region: 'Berlin, DE' },
  { role: 'Data Scientist', demand: '+28%', growth: 'High', region: 'New York, US' },
];

export default function MarketIntelligencePage() {
  return (
    <AdminShell title="Market Intelligence">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Market Intelligence</h2>
            <p className="text-gray-500 font-medium">Predictive analytics and job market trends</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-xl border-gray-200 font-bold shadow-sm">
              <Globe className="h-4 w-4 mr-2" />
              Global View
            </Button>
            <Button className="rounded-xl bg-blue-600 font-bold shadow-lg">
              Export Analysis
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Market Growth", val: "23.5%", change: "+2.1%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
            { title: "Hiring Demand", val: "High", change: "+12%", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Active Talents", val: "12,450", change: "-0.5%", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { title: "Average Salary", val: "$112k", change: "+5.4%", icon: ArrowUpRight, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className={`${stat.change.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} border-0 font-bold`}>
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 font-bold mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-[#202224]">{stat.val}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-gray-50">
              <CardTitle className="text-xl font-bold">Trending Job Roles</CardTitle>
              <Button variant="link" className="text-blue-600 font-bold">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {trendingRoles.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        {item.role.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#202224]">{item.role}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase">{item.region}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{item.demand}</p>
                      <p className="text-xs text-gray-400 font-bold">{item.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold">Industry Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="aspect-[4/3] bg-[#F8F9FA] rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Visual Representation of a Heatmap */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-orange-500/20" />
                <div className="flex flex-col items-center relative z-10 text-center">
                  <Globe className="h-16 w-16 text-blue-600 mb-4 opacity-50" />
                  <p className="font-bold text-gray-500 max-w-[200px]">AI-Powered Geographic Demand Visualization</p>
                </div>
                {/* Decorative Dots */}
                <div className="absolute top-10 left-20 w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <div className="absolute bottom-20 right-32 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                <div className="absolute top-1/2 right-10 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
