'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Activity, AlertTriangle, Terminal, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Stats {
  activeAnomalies: number;
  criticalThreats: number;
  networkLatency: string;
  systemHealth: string;
}

interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: string;
  status: string;
}

export default function AnomalyDetectionPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/anomaly-detection/stats');
      const data = await res.json();
      if (data.success) setStats(data.result);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchAnomalies = async () => {
    try {
      const res = await fetch('/api/admin/anomaly-detection/anomalies');
      const data = await res.json();
      if (data.success) setAnomalies(data.result);
    } catch (error) {
      console.error('Failed to fetch anomalies:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchAnomalies()]);
      setLoading(false);
    };
    init();

    const interval = setInterval(() => {
      fetchStats();
      fetchAnomalies();
    }, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/anomaly-detection/resolve/${id}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        fetchStats();
        fetchAnomalies();
      }
    } catch (error) {
      console.error('Failed to resolve anomaly:', error);
    }
  };

  const runAnalysis = async () => {
    try {
      await fetch('/api/admin/anomaly-detection/analyze', { method: 'POST' });
      fetchStats();
      fetchAnomalies();
    } catch (error) {
      console.error('Failed to run analysis:', error);
    }
  };

  return (
    <AdminShell title="Anomaly Detection">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">AI Anomaly Detection</h2>
            <p className="text-gray-500 font-medium">ML-based system health and performance monitoring</p>
          </div>
          <Button onClick={runAnalysis} className="rounded-xl bg-[#202224] text-white font-bold shadow-lg hover:bg-black">
            <Terminal className="h-4 w-4 mr-2" />
            Run System Analysis
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">System Load (Real-time)</CardTitle>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-gray-500">CPU</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs font-bold text-gray-500">RAM</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px] w-full flex items-end gap-2">
                {/* Visual System Activity bars */}
                {[45, 60, 55, 80, 95, 70, 50, 40, 65, 85, 75, 60, 45, 55, 70, 80, 90, 100, 85, 70].map((h, i) => (
                  <div key={i} className="flex-1 group relative h-full flex items-end">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#202224] text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
                      {h}% Load
                    </div>
                    <div className={`w-full rounded-t-sm transition-all duration-500 ${h > 90 ? 'bg-red-500' : h > 70 ? 'bg-orange-400' : 'bg-blue-500'}`} style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>12:00 PM</span>
                <span>12:30 PM</span>
                <span>01:00 PM</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {[
              { label: 'Active Anomalies', val: stats?.activeAnomalies?.toString() || '0', icon: Activity, color: 'text-orange-500' },
              { label: 'Critical Threats', val: stats?.criticalThreats?.toString() || '0', icon: AlertTriangle, color: 'text-red-500' },
              { label: 'Network Latency', val: stats?.networkLatency || '0ms', icon: Zap, color: 'text-blue-500' },
            ].map((stat, i) => (
              <Card key={i} className="border-0 shadow-sm rounded-2xl bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">{stat.label}</p>
                      <h4 className="text-xl font-bold text-[#202224]">{stat.val}</h4>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-8 border-b border-gray-50">
            <CardTitle className="text-xl font-bold">Anomalous Events</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {anomalies.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-medium">No anomalous events detected.</div>
              ) : (
                anomalies.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl ${
                        item.severity === 'CRITICAL' || item.severity === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#202224]">{item.type}</h4>
                        <p className="text-sm text-gray-500 font-medium">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <Badge className={`${
                        item.status === 'RESOLVED' ? 'bg-green-50 text-green-600' : 
                        item.status === 'INVESTIGATING' ? 'bg-orange-50 text-orange-600' : 
                        'bg-red-50 text-red-600'
                      } border-0 px-4 py-1.5 rounded-lg font-bold`}>
                        {item.status}
                      </Badge>
                      {item.status !== 'RESOLVED' && (
                        <Button onClick={() => handleResolve(item.id)} variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">Mark Resolved</Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
