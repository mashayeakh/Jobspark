'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Globe, Bell, Lock, Mail, CreditCard, Save, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newRecruiterVerification: true,
    publicJobBoards: true,
    autoModerationSensitivity: 'Medium',
    supportAgentAutonomy: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await adminService.getPlatformSettings();
        if (res.success) {
          setSettings(res.data);
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSensitivity = (level: string) => {
    setSettings((prev) => ({ ...prev, autoModerationSensitivity: level }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await adminService.updatePlatformSettings(settings);
      if (res.success) {
        setSettings(res.data);
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      const res = await adminService.optimizePlatformSettings();
      if (res.success) {
        setSettings(res.data.settings);
        toast.success(res.data.message || 'AI optimized settings successfully');
      } else {
        toast.error('Failed to optimize settings');
      }
    } catch (error) {
      toast.error('An error occurred during AI optimization');
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return (
      <AdminShell title="Platform Settings">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Platform Settings">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Platform Settings</h2>
            <p className="text-gray-500 font-medium">Global configurations and system preferences</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-blue-600 font-bold shadow-lg">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
                  <Switch checked={settings.maintenanceMode} onCheckedChange={() => handleToggle('maintenanceMode')} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#202224]">New Recruiter Verification</h5>
                    <p className="text-sm text-gray-500 font-medium">Manually approve all new recruiter accounts before they can post.</p>
                  </div>
                  <Switch checked={settings.newRecruiterVerification} onCheckedChange={() => handleToggle('newRecruiterVerification')} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#202224]">Public Job Boards</h5>
                    <p className="text-sm text-gray-500 font-medium">Enable guest users to browse job listings without signing up.</p>
                  </div>
                  <Switch checked={settings.publicJobBoards} onCheckedChange={() => handleToggle('publicJobBoards')} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">AI System Controls</CardTitle>
                <Button onClick={handleOptimize} disabled={optimizing} variant="outline" className="border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold rounded-xl">
                  {optimizing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Auto-Tune AI
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#202224]">Auto-Moderation Sensitivity</h5>
                    <p className="text-sm text-gray-500 font-medium">Adjust how aggressive the AI is in flagging job postings.</p>
                  </div>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((lvl) => (
                      <Button 
                        key={lvl} 
                        onClick={() => handleSensitivity(lvl)}
                        variant="outline" 
                        size="sm" 
                        className={`rounded-lg font-bold ${
                          settings.autoModerationSensitivity === lvl ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-400'
                        }`}
                      >
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
                  <Switch checked={settings.supportAgentAutonomy} onCheckedChange={() => handleToggle('supportAgentAutonomy')} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
