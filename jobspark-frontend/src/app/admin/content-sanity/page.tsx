'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, XCircle, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reports = [
  { id: 1, title: 'Python Backend Dev', recruiter: 'DevSquad', reason: 'Profanity in Description', severity: 'Critical', time: '5 mins ago' },
  { id: 2, title: 'UX Designer', recruiter: 'DesignPro', reason: 'Invalid Salary Range', severity: 'Low', time: '20 mins ago' },
  { id: 3, title: 'Marketing Lead', recruiter: 'GrowthAI', reason: 'Biased Language Detected', severity: 'Medium', time: '1 hour ago' },
  { id: 4, title: 'React Expert', recruiter: 'CodeFix', reason: 'Duplicate Content', severity: 'Medium', time: '2 hours ago' },
];

export default function ContentSanityPage() {
  return (
    <AdminShell title="Content Sanity">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Content Sanity</h2>
            <p className="text-gray-500 font-medium">AI-driven automated content moderation</p>
          </div>
          <Button variant="outline" className="rounded-xl border-gray-200 font-bold bg-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recrawl All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Scanned', val: '15.4k', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Clean', val: '98.2%', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Flagged', val: '142', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Violations', val: '12', color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 font-bold mb-1">{stat.label}</p>
                <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.val}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-8 border-b border-gray-50">
            <CardTitle className="text-xl font-bold text-[#202224]">Moderation Queue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {reports.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#202224]">{item.title}</h4>
                      <p className="text-sm text-gray-400 font-bold uppercase">{item.recruiter}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Issue</p>
                      <p className="text-sm font-bold text-[#202224]">{item.reason}</p>
                    </div>
                    <div>
                      <Badge className={`${
                        item.severity === 'Critical' ? 'bg-red-50 text-red-600' : 
                        item.severity === 'Medium' ? 'bg-orange-50 text-orange-600' : 
                        'bg-blue-50 text-blue-600'
                      } border-0 px-4 py-1.5 rounded-lg font-bold`}>
                        {item.severity}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-green-500 hover:bg-green-50 rounded-xl">
                        <CheckCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-red-500 hover:bg-red-50 rounded-xl">
                        <XCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:bg-gray-100 rounded-xl">
                        <Eye className="h-5 w-5" />
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
