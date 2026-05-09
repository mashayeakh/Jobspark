'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingDown, AlertCircle, Mail, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const atRiskUsers = [
  { id: 1, name: 'StartupXYZ', role: 'RECRUITER', probability: '85%', reason: 'No login in 14 days', status: 'Critical' },
  { id: 2, name: 'John Doe', role: 'JOB_SEEKER', probability: '62%', reason: 'Deleted profile draft', status: 'Warning' },
  { id: 3, name: 'CloudScale', role: 'RECRUITER', probability: '45%', reason: 'Billing failure', status: 'Monitoring' },
  { id: 4, name: 'Sarah Miller', role: 'JOB_SEEKER', probability: '38%', reason: 'Low app activity', status: 'Monitoring' },
];

export default function ChurnPredictorPage() {
  return (
    <AdminShell title="Churn Predictor">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Churn Predictor</h2>
            <p className="text-gray-500 font-medium">Predictive AI identifying users likely to leave the platform</p>
          </div>
          <Button className="rounded-xl bg-blue-600 font-bold shadow-lg">
            Retrain ML Model
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-8">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm text-gray-500 font-bold">Churn Rate (Monthly)</p>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-4xl font-bold text-[#202224]">4.2%</h3>
            <p className="text-xs text-green-500 font-bold mt-2">-0.8% from last month</p>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-8">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm text-gray-500 font-bold">At Risk Users</p>
              <Users className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="text-4xl font-bold text-[#202224]">284</h3>
            <p className="text-xs text-orange-500 font-bold mt-2">12 new users identified</p>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-8">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm text-gray-500 font-bold">Retention Potential</p>
              <AlertCircle className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-4xl font-bold text-[#202224]">85%</h3>
            <p className="text-xs text-blue-500 font-bold mt-2">High success rate for recovery</p>
          </Card>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-50 bg-white">
            <CardTitle className="text-xl font-bold">At-Risk User Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="divide-y divide-gray-50">
              {atRiskUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#202224]">{user.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex-1 px-12">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Churn Probability</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            parseInt(user.probability) > 80 ? 'bg-red-500' : 
                            parseInt(user.probability) > 50 ? 'bg-orange-500' : 'bg-blue-500'
                          }`} 
                          style={{ width: user.probability }} 
                        />
                      </div>
                      <span className="font-bold text-[#202224]">{user.probability}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Top Factor</p>
                      <p className="text-sm font-bold text-gray-600">{user.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg border-gray-200 font-bold text-blue-600">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button size="sm" className="rounded-lg bg-blue-600 font-bold">
                        <Gift className="h-4 w-4 mr-2" />
                        Offer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
