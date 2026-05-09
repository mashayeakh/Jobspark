'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fraudLogs = [
  { id: 1, type: 'Bot Activity', severity: 'High', source: 'IP: 192.168.1.45', status: 'Blocked', time: '2 mins ago' },
  { id: 2, type: 'Ghost Job Posting', severity: 'Medium', source: 'Recruiter: ScamCorp', status: 'Flagged', time: '15 mins ago' },
  { id: 3, type: 'Suspicious Signup', severity: 'Low', source: 'user_42@tempmail.com', status: 'Pending Review', time: '1 hour ago' },
  { id: 4, type: 'Brute Force Attempt', severity: 'High', source: 'IP: 45.23.12.89', status: 'Blocked', time: '3 hours ago' },
];

export default function FraudShieldPage() {
  return (
    <AdminShell title="AI Fraud Shield">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">AI Fraud Shield</h2>
            <p className="text-gray-500 font-medium">Real-time threat monitoring and automated defense</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-xl border-gray-200 font-bold">
              <Search className="h-4 w-4 mr-2" />
              Scan System
            </Button>
            <Button className="rounded-xl bg-blue-600 font-bold shadow-lg">
              Security Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-green-50 rounded-2xl">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Protection Status</p>
                <h3 className="text-xl font-bold text-green-600">Active & Secure</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-orange-50 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Pending Alerts</p>
                <h3 className="text-xl font-bold text-orange-600">12 Alerts</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Threats Blocked</p>
                <h3 className="text-xl font-bold text-blue-600">4,289 Today</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8 bg-white border-b border-gray-100">
            <CardTitle className="text-xl font-bold">Recent Security Logs</CardTitle>
            <Button variant="ghost" size="sm" className="font-bold text-blue-600 hover:bg-blue-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter Logs
            </Button>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8F9FA] border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Severity</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {fraudLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-[#202224]">{log.type}</td>
                      <td className="px-8 py-6">
                        <Badge className={`${
                          log.severity === 'High' ? 'bg-red-50 text-red-600' : 
                          log.severity === 'Medium' ? 'bg-orange-50 text-orange-600' : 
                          'bg-blue-50 text-blue-600'
                        } border-0 rounded-lg px-3 py-1 font-bold`}>
                          {log.severity}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-gray-500 font-medium">{log.source}</td>
                      <td className="px-8 py-6 font-bold text-gray-700">{log.status}</td>
                      <td className="px-8 py-6 text-gray-400 font-medium">{log.time}</td>
                      <td className="px-8 py-6">
                        <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">Details</Button>
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
