'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Bot, User, Send, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const activeChats = [
  { id: 1, user: 'Alex Rivera', role: 'Jobseeker', issue: 'Payment Refund', handledBy: 'AI Agent', status: 'In Progress' },
  { id: 2, user: 'BuildFast Inc', role: 'Recruiter', issue: 'Job Post Rejected', handledBy: 'Human', status: 'Critical' },
  { id: 3, user: 'Jordan Smith', role: 'Jobseeker', issue: 'Profile Deletion', handledBy: 'AI Agent', status: 'Resolved' },
];

export default function SupportAgentPage() {
  return (
    <AdminShell title="Support Agent">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">AI Support Agent</h2>
            <p className="text-gray-500 font-medium">Automated resolution and human-handoff management</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-xl font-bold border-gray-200">
              Training Knowledge Base
            </Button>
            <Button className="rounded-xl bg-blue-600 font-bold shadow-lg">
              Live Support Console
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Tickets', val: '42', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'AI Resolution', val: '84%', icon: Bot, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Avg Resp Time', val: '12s', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'CSAT Score', val: '4.8', icon: CheckCircle2, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} mb-3`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-500 font-bold mb-1 uppercase">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#202224]">{stat.val}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-bold text-gray-900 px-2">Active Conversations</h4>
            {activeChats.map((chat) => (
              <Card key={chat.id} className="border-0 shadow-sm rounded-2xl hover:bg-white cursor-pointer group transition-all">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-[#202224] group-hover:text-blue-600">{chat.user}</h5>
                    <Badge className={`${
                      chat.status === 'Critical' ? 'bg-red-50 text-red-600' : 
                      chat.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                    } border-0 rounded-lg text-[10px] font-bold`}>
                      {chat.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-3">{chat.issue}</p>
                  <div className="flex items-center gap-2">
                    {chat.handledBy === 'AI Agent' ? (
                      <Bot className="h-3 w-3 text-blue-500" />
                    ) : (
                      <User className="h-3 w-3 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-400 font-bold">{chat.handledBy}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl bg-white flex flex-col h-[600px]">
            <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  AR
                </div>
                <div>
                  <h4 className="font-bold text-[#202224]">Alex Rivera</h4>
                  <p className="text-xs text-green-500 font-bold">AI Agent Handling...</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl border-gray-200 font-bold text-orange-600">
                Take Over (Handoff)
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                  <p className="text-sm text-gray-700 font-medium">Hello, I&apos;d like to request a refund for my last subscription payment.</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none max-w-[80%] text-white">
                  <p className="text-sm font-medium">Hello Alex! I see you&apos;re on our Professional Plan. I can certainly help with that. Could you please confirm the transaction ID from your email?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                  <p className="text-sm text-gray-700 font-medium">Yes, it is TRX-9401.</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none max-w-[80%] text-white">
                  <p className="text-sm font-medium">Processing... I&apos;ve verified the transaction. A refund of $1,200 has been initiated. You should see it in 3-5 business days.</p>
                </div>
              </div>
            </CardContent>
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <input type="text" placeholder="Type a message..." className="flex-1 bg-gray-50 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20" />
              <Button className="bg-blue-600 rounded-xl px-6">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
