/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { recruiterService, RecruiterProfile } from '@/services/recruiterService';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Bell,
  Lock,
  Shield,
  Save,
  Camera,
  Smartphone,
  Globe,
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { RecruiterLoading } from '@/components/shared/RecruiterLoading';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(() => authService.getUser());
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newApplications: true,
    interviewReminders: true,
    marketingEmails: false,
    smsAlerts: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    position: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'RECRUITER') {
      router.push('/login');
      return;
    }

    recruiterService.getProfile()
      .then((res) => {
        if (res.success && res.data) {
          setProfile(res.data);
          setFormData({
            name: res.data.user?.name || res.data.name || '',
            phone: res.data.phoneNumber || '',
            position: res.data.position || '',
            bio: res.data.bio || ''
          });
        }
      })
      .catch(err => {
        console.error('Failed to load profile', err);
        toast.error('Failed to load profile information');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving your profile changes...');
    try {
      const response = await recruiterService.updateProfile({
        name: formData.name,
        phoneNumber: formData.phone,
        position: formData.position,
        bio: formData.bio
      });

      if (response.success) {
        toast.success('Profile updated successfully!', { id: toastId });
        if (response.data) setProfile(response.data);
      } else {
        toast.error(response.error || 'Failed to update profile', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
      router.push('/login');
    }
  };

  if (loading) {
    return <RecruiterLoading />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and platform preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="border-b bg-slate-50/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                  <User className="h-5 w-5 text-[#4880FF]" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-slate-500 mt-1">Update your professional identity</CardDescription>
              </div>
              <Badge className="bg-[#4880FF]/10 text-[#4880FF] border-none px-3 py-1 text-xs font-semibold">
                Recruiter Profile
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="relative group">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#4880FF] to-blue-700 text-white text-4xl font-bold shadow-xl shadow-blue-200 transition-transform group-hover:scale-105 duration-300">
                  {profile?.user?.name ? profile.user.name.charAt(0).toUpperCase() : user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
                </div>
                <button className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg hover:rotate-12">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{profile?.user?.name || user?.name || 'Administrator'}</h3>
                <div className="text-slate-500 font-medium flex items-center gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="text-[#4880FF] border-[#4880FF]/30 bg-[#4880FF]/5">
                    {profile?.position || 'Talent Acquisition'}
                  </Badge>
                  <span className="text-slate-300">|</span>
                  <span className="text-sm">{profile?.company?.name || 'JobsPark Inc.'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">Full Name</Label>
                <Input
                  id="name"
                  className="h-12 border-slate-200 focus:ring-[#4880FF] focus:border-[#4880FF] rounded-xl transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="h-12 bg-slate-50 border-slate-200 text-slate-400 rounded-xl cursor-not-allowed pl-10"
                    value={profile?.user?.email || user?.email || ''}
                    disabled
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    className="h-12 border-slate-200 focus:ring-[#4880FF] focus:border-[#4880FF] rounded-xl pl-10 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="role" className="text-sm font-semibold text-slate-700 ml-1">Job Title</Label>
                <div className="relative">
                  <Input
                    id="role"
                    className="h-12 border-slate-200 focus:ring-[#4880FF] focus:border-[#4880FF] rounded-xl pl-10 transition-all"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Senior Recruiter"
                  />
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 ml-1">Professional Bio</Label>
              <textarea
                id="bio"
                className="w-full min-h-[120px] rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF] transition-all resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about your recruitment philosophy..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                className="bg-[#4880FF] hover:bg-[#3d72eb] h-12 px-8 rounded-xl shadow-lg shadow-blue-200 text-sm font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Status & Security */}
        <div className="space-y-6">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <Shield className="h-5 w-5 text-[#4880FF]" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-600 font-medium">Account Type</span>
                <Badge className="bg-blue-100 text-[#4880FF] border-none hover:bg-blue-100">Recruiter</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-600 font-medium">Status</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-bold text-green-700">Active</span>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-400 font-medium">Member Since</span>
                  <span className="text-slate-700 font-bold">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-400 font-medium">Last Login</span>
                  <span className="text-slate-700 font-bold">Just Now</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <Lock className="h-5 w-5 text-[#4880FF]" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 ml-1">Password</Label>
                <div className="flex gap-2">
                  <Input type="password" value="********" readOnly className="h-10 bg-slate-50 border-slate-100 text-slate-400 rounded-lg" />
                  <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs h-10 px-4 rounded-lg">
                    Edit
                  </Button>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Two-Factor Auth</span>
                    <span className="text-[10px] text-slate-400 font-medium">Add an extra layer of security</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 text-[10px] font-bold">
                  Disabled
                </Badge>
              </div>

              <Button variant="outline" className="w-full border-slate-200 text-slate-700 font-bold text-sm h-11 rounded-xl hover:bg-slate-50 transition-colors">
                Setup 2FA
              </Button>
            </CardContent>
          </Card>

          <Button 
            variant="ghost" 
            disabled={isLoggingOut}
            className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-sm rounded-xl h-11 transition-colors disabled:opacity-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out of all devices
          </Button>
        </div>
      </div>

      {/* Notifications Section */}
      <Card className="mt-8 border-none shadow-md bg-white">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
            <Bell className="h-5 w-5 text-[#4880FF]" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-slate-500 mt-1">Control how you stay updated with candidate activity</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-6 rounded-full bg-[#4880FF]"></div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Email Alerts</h4>
              </div>
              <div className="space-y-5">
                {[
                  { id: 'newApps', title: 'New Applications', desc: 'Get a notification for every new candidate', key: 'newApplications' },
                  { id: 'reminders', title: 'Interview Reminders', desc: 'Alerts before your scheduled sessions', key: 'interviewReminders' },
                  { id: 'marketing', title: 'Product Updates', desc: 'News about feature releases and tips', key: 'marketingEmails' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-bold text-slate-900 group-hover:text-[#4880FF] transition-colors">{item.title}</Label>
                      <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                    </div>
                    <Switch
                      checked={(notifications as any)[item.key]}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                      className="data-[state=checked]:bg-[#4880FF]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-6 rounded-full bg-[#4880FF]"></div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Channel Settings</h4>
              </div>
              <div className="space-y-5">
                {[
                  { id: 'general', title: 'Account Alerts', desc: 'Important security and account news', key: 'emailAlerts' },
                  { id: 'sms', title: 'SMS Notifications', desc: 'Urgent updates sent to your phone', key: 'smsAlerts' },
                  { id: 'push', title: 'Push Notifications', desc: 'Real-time alerts in your browser', key: 'push' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-bold text-slate-900 group-hover:text-[#4880FF] transition-colors">{item.title}</Label>
                      <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                    </div>
                    <Switch
                      defaultChecked={item.id === 'push'}
                      className="data-[state=checked]:bg-[#4880FF]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="text-lg font-semibold text-slate-700">Logging out now..</p>
          </div>
        </div>
      )}
    </div>
  );
}
