'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Globe, Bell, Lock, Mail, CreditCard, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function PlatformSettingsPage() {
  return (
    <AdminShell title="Platform Settings">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Platform Settings</h2>
            <p className="text-gray-500 font-medium">Global configurations and system preferences</p>
          </div>
          <Button className="rounded-xl bg-blue-600 font-bold shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            {[
              { icon: Globe, label: 'General Settings', active: true },
              { icon: Lock, label: 'Security & Access' },
              { icon: Bell, label: 'Notifications' },
              { icon: Mail, label: 'Email Templates' },
              { icon: CreditCard, label: 'Billing & Pricing' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                item.active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-white'
              }`}>
                <item.icon className="h-5 w-5" />
                <span className="font-bold">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-8">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="p-8 border-b border-gray-50">
                <CardTitle className="text-xl font-bold">General Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#202224]">Maintenance Mode</h5>
                    <p className="text-sm text-gray-500 font-medium">Put the entire platform into read-only mode for maintenance.</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#202224]">New Recruiter Verification</h5>
                    <p className="text-sm text-gray-500 font-medium">Manually approve all new recruiter accounts before they can post.</p>
                  </div>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#202224]">Public Job Boards</h5>
                    <p className="text-sm text-gray-500 font-medium">Enable guest users to browse job listings without signing up.</p>
                  </div>
                  <Switch checked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="p-8 border-b border-gray-50">
                <CardTitle className="text-xl font-bold">AI System Controls</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#202224]">Auto-Moderation Sensitivity</h5>
                    <p className="text-sm text-gray-500 font-medium">Adjust how aggressive the AI is in flagging job postings.</p>
                  </div>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((lvl) => (
                      <Button key={lvl} variant="outline" size="sm" className={`rounded-lg font-bold ${
                        lvl === 'Medium' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-400'
                      }`}>
                        {lvl}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#202224]">Support Agent Autonomy</h5>
                    <p className="text-sm text-gray-500 font-medium">Allow the AI to resolve refund requests up to $500 automatically.</p>
                  </div>
                  <Switch checked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
