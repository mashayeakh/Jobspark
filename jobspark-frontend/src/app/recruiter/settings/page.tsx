'use client';

import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
  Globe
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData || userData.role !== 'RECRUITER') {
      router.push('/login');
      return;
    }
    setUser(userData);

    recruiterService.getProfile()
      .then((res) => {
        if (res.success && res.data) {
          setProfile(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/recruiter">Recruiter</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-[#4880FF]" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4880FF] to-blue-600 text-white text-2xl font-bold">
                    {profile?.user?.name ? profile.user.name.charAt(0).toUpperCase() : user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
                  </div>
                  <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <p className="truncate text-sm font-bold text-gray-900 leading-none mb-1">{profile?.user?.name || user?.name || 'Administrator'}</p>
                  <p className="truncate text-[10px] font-bold uppercase text-gray-400 leading-none">{profile?.position || 'Recruiter'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={profile?.user?.name || user?.name || 'Recruiter Name'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={profile?.user?.email || user?.email || 'recruiter@company.com'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Job Title</Label>
                  <Input id="role" defaultValue="Senior Recruiter" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-[100px] rounded-md border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  defaultValue="Experienced recruiter passionate about connecting talented professionals with innovative companies."
                />
              </div>

              <Button className="bg-[#4880FF] hover:bg-[#3d72eb]">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Account Status */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#4880FF]" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge className="bg-blue-100 text-[#4880FF]">Recruiter</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-medium">Today</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#4880FF]" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" value="********" readOnly />
                </div>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">2FA</span>
                  </div>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                    Not Enabled
                  </Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#4880FF]" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">New Applications</Label>
                      <p className="text-xs text-gray-500">Get notified when someone applies</p>
                    </div>
                    <Switch
                      checked={notifications.newApplications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, newApplications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Interview Reminders</Label>
                      <p className="text-xs text-gray-500">Reminders before scheduled interviews</p>
                    </div>
                    <Switch
                      checked={notifications.interviewReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, interviewReminders: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Marketing Emails</Label>
                      <p className="text-xs text-gray-500">Product updates and newsletters</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Other Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Email Alerts</Label>
                      <p className="text-xs text-gray-500">General account alerts</p>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">SMS Alerts</Label>
                      <p className="text-xs text-gray-500">Text messages for urgent updates</p>
                    </div>
                    <Switch
                      checked={notifications.smsAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Browser Notifications</Label>
                      <p className="text-xs text-gray-500">Push notifications in browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
