/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MapPin, Briefcase, GraduationCap, Mail, Link as LinkIcon, Users, MoreHorizontal, BadgeCheck, Unplug, Copy, Flag, ShieldBan } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { toast } from 'sonner';

export default function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectedState, setConnectedState] = useState<'NONE' | 'PENDING' | 'ACCEPTED' | 'BLOCKED'>('NONE');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, recommendedRes, statusRes] = await Promise.all([
          apiClient.get<any>(`/network/users/${userId}`),
          apiClient.get<any>('/network/users'),
          apiClient.get<any>(`/network/connect/${userId}/status`),
        ]);

        if (profileRes.success && profileRes.data?.result) {
          setUser(profileRes.data.result);
        }

        if (recommendedRes.success && recommendedRes.data?.result) {
          setRecommended(recommendedRes.data.result);
        }

        if (statusRes.success && statusRes.data?.result) {
          setConnectedState(statusRes.data.result.status);
        } else {
          setConnectedState('NONE');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleConnect = async () => {
    setConnectLoading(true);
    try {
      const res = await apiClient.post(`/network/connect/${userId}`);
      if (res.success) {
        setConnectedState('PENDING');
        toast.success('Connection request sent!', {
          description: `Your request to connect with ${user?.name} is now pending.`,
        });
      } else {
        if (res.error?.toLowerCase().includes('unauthorized') || res.error?.toLowerCase().includes('login')) {
          toast.warning('Login required', {
            description: 'You must be logged in to connect with users.',
            action: {
              label: 'Log in',
              onClick: () => router.push('/login'),
            },
            duration: 6000,
          });
        } else {
          toast.error(res.error || 'Failed to send request.');
        }
      }
    } catch {
      toast.error('An error occurred while sending the request.');
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Find the connection ID from the connections list
      const connectionsRes = await apiClient.get<any>('/network/connections');
      if (connectionsRes.success && connectionsRes.data?.result) {
        const conn = connectionsRes.data.result.find(
          (c: any) => c.sender.id === userId || c.receiver.id === userId
        );
        if (conn) {
          const res = await apiClient.delete(`/network/connect/${conn.id}`);
          if (res.success) {
            setConnectedState('NONE');
            toast.success('Connection removed', {
              description: `You are no longer connected with ${user?.name}.`,
            });
          } else {
            toast.error(res.error || 'Failed to remove connection.');
          }
        }
      }
    } catch {
      toast.error('An error occurred.');
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/connections/${userId}`;
    navigator.clipboard.writeText(url);
    toast.success('Profile link copied!', {
      description: 'The link has been copied to your clipboard.',
    });
  };

  const handleReport = () => {
    toast.info('Report submitted', {
      description: `Thank you for reporting ${user?.name}'s profile. Our team will review it.`,
    });
  };

  const handleBlock = async () => {
    try {
      const res = await apiClient.post(`/network/block/${userId}`);
      if (res.success) {
        setConnectedState('BLOCKED');
        toast.info(`${user?.name} has been blocked`, {
          description: 'You will no longer see this user in your network.',
        });
      } else {
        toast.error(res.error || 'Failed to block user.');
      }
    } catch {
      toast.error('An error occurred.');
    }
  };

  const handleUnblock = async () => {
    try {
      const res = await apiClient.delete(`/network/block/${userId}`);
      if (res.success) {
        setConnectedState('NONE');
        toast.success(`${user?.name} has been unblocked`, {
          description: 'You can now connect with this user again.',
        });
      } else {
        toast.error(res.error || 'Failed to unblock user.');
      }
    } catch {
      toast.error('An error occurred.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">User not found</div>;
  }

  const userTags = user?.expertise?.length ? user.expertise.join(', ') : "Not specified";
  const userInterests = user?.interests?.length ? user.interests.join(', ') : "Not specified";

  return (
    <div className="bg-[#F3F2EF] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-[1128px]">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Content Column */}
          <div className="md:col-span-8 space-y-4">

            {/* Top Profile Card */}
            <Card className="overflow-hidden border border-gray-200 shadow-sm rounded-xl bg-white relative">
              {/* Cover Photo */}
              <div className="h-48 w-full bg-gradient-to-r from-[#B9A696] to-[#8C7A6B] relative">
                <img
                  src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
                  alt="Cover"
                  className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                />
              </div>

              <div className="px-6 pb-6 relative">
                {/* Avatar and Action Buttons */}
                <div className="flex justify-between items-end -mt-20 mb-4">
                  {/* Avatar */}
                  <div className="h-[152px] w-[152px] rounded-full border-4 border-white overflow-hidden bg-white shadow-sm shrink-0">
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pb-2">
                    {connectedState === 'BLOCKED' ? (
                      <Button onClick={handleUnblock} disabled={connectLoading} className="rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold px-5 h-9">
                        Unblock
                      </Button>
                    ) : connectedState === 'PENDING' ? (
                      <Button disabled className="rounded-full bg-gray-400 text-white font-semibold px-5 h-9">
                        Pending
                      </Button>
                    ) : connectedState === 'ACCEPTED' ? (
                      <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold px-5 h-9">
                        Message
                      </Button>
                    ) : (
                      <Button onClick={handleConnect} disabled={connectLoading} className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold px-5 h-9">
                        {connectLoading ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-gray-500 text-gray-500 hover:bg-gray-100 hover:border-gray-600 transition-colors">
                          <MoreHorizontal className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg">
                        <DropdownMenuItem
                          onClick={handleCopyLink}
                          className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg"
                        >
                          <Copy className="size-4 text-gray-500" />
                          <span className="font-medium text-gray-700">Copy profile link</span>
                        </DropdownMenuItem>

                        {connectedState === 'ACCEPTED' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={handleDisconnect}
                              className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                            >
                              <Unplug className="size-4" />
                              <span className="font-medium">Remove connection</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleReport}
                          className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg text-yellow-700 focus:text-yellow-700 focus:bg-yellow-50"
                        >
                          <Flag className="size-4" />
                          <span className="font-medium">Report profile</span>
                        </DropdownMenuItem>

                        {connectedState === 'BLOCKED' ? (
                          <DropdownMenuItem
                            onClick={handleUnblock}
                            className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg text-green-600 focus:text-green-600 focus:bg-green-50"
                          >
                            <ShieldBan className="size-4" />
                            <span className="font-medium">Unblock user</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={handleBlock}
                            className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <ShieldBan className="size-4" />
                            <span className="font-medium">Block user</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-1.5">
                    {user.name}
                    <BadgeCheck className="text-blue-500 size-5 fill-blue-50" />
                  </h1>
                  <p className="text-[16px] text-gray-900 mt-1">{user.title}</p>
                </div>
              </div>
            </Card>

            {/* Pills Row */}
            <div className="flex gap-3 items-center flex-wrap">
              <Badge variant="outline" className="rounded-full px-4 py-1.5 border-gray-300 text-gray-700 hover:bg-gray-100 text-[14px] font-medium bg-white cursor-pointer transition-colors shadow-sm">
                Vendors (32)
              </Badge>
              <Badge className="rounded-full px-4 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-[14px] font-medium cursor-pointer transition-colors shadow-sm">
                Advice (18)
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-1.5 border-gray-300 text-gray-700 hover:bg-gray-100 text-[14px] font-medium bg-white cursor-pointer transition-colors shadow-sm">
                Experts (52)
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-1.5 border-gray-300 text-gray-700 hover:bg-gray-100 text-[14px] font-medium bg-white cursor-pointer transition-colors shadow-sm">
                Followers (142)
              </Badge>
              <div className="ml-auto text-[12px] text-gray-500 hidden sm:flex gap-2">
                <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">Questions & Answers</span> |
                <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">Updates & Insights</span> |
                <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">Articles & News</span>
              </div>
            </div>

            {/* About Card */}
            <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">About</h2>
                <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-line">
                  {user.about} <span className="text-gray-500 hover:text-blue-600 hover:underline cursor-pointer font-medium ml-1">...See more</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="font-semibold text-[15px] text-gray-900 mb-2">Expertise</h3>
                    <p className="text-[14px] text-[#0a66c2] leading-relaxed mb-4 cursor-pointer hover:underline">
                      {userTags}
                    </p>
                    <p className="text-[14px] text-gray-700 mb-1">Open to networking</p>
                    <p className={`text-[14px] font-semibold ${user.openToNetworking ? 'text-green-700' : 'text-gray-500'}`}>{user.openToNetworking ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-gray-900 mb-2">Interests</h3>
                    <p className="text-[14px] text-[#0a66c2] leading-relaxed mb-4 cursor-pointer hover:underline">
                      {userInterests}
                    </p>
                    <p className="text-[14px] text-gray-700 mb-1">Open to advising</p>
                    <p className={`text-[14px] font-semibold ${user.openToAdvising ? 'text-green-700' : 'text-gray-500'}`}>{user.openToAdvising ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>



          </div>

          {/* Right Sidebar Column */}
          <div className="md:col-span-4 space-y-4">

            {/* Intro Card */}
            <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-5 text-gray-900">Intro</h2>
                <div className="space-y-4 text-[14px]">
                  <div className="flex items-start gap-3 text-gray-700">
                    <Briefcase className="size-5 shrink-0 text-gray-500" />
                    <span>{user.title} {user.company && user.company !== "Open to work" ? <span>at <span className="font-semibold text-gray-900">{user.company}</span></span> : ''}</span>
                  </div>
                  {user.education && user.education.length > 0 && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <GraduationCap className="size-5 shrink-0 text-gray-500" />
                      <span>Went to <span className="font-semibold text-gray-900">{user.education[0].school}</span></span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="size-5 shrink-0 text-gray-500" />
                    <span>Lives in <span className="font-semibold text-gray-900">{user.location}</span></span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <Users className="size-5 shrink-0 text-gray-500" />
                    <span>Followed by <span className="font-semibold text-gray-900">{user.connections * 45} people</span></span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <Mail className="size-5 shrink-0 text-gray-500" />
                    <span className="flex items-center gap-1">Email <a href={`mailto:${user.email}`} className="text-[#0a66c2] hover:underline font-medium">{user.email}</a></span>
                  </div>
                  {user.linkedinUrl && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <LinkIcon className="size-5 shrink-0 text-gray-500" />
                      <span className="flex items-center gap-1">LinkedIn <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#0a66c2] hover:underline font-medium">{user.linkedinUrl}</a></span>
                    </div>
                  )}
                  {user.websiteUrl && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <LinkIcon className="size-5 shrink-0 text-gray-500" />
                      <span className="flex items-center gap-1">Website <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="text-[#0a66c2] hover:underline font-medium">{user.websiteUrl}</a></span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Users Card */}
            <Card className="border border-gray-200 shadow-sm rounded-xl bg-white mt-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900">People you may know</h2>
                <div className="space-y-4">
                  {recommended.filter(u => u.id !== userId).slice(0, 4).map(recommendedUser => (
                    <div key={recommendedUser.id} className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                        <img src={recommendedUser.avatar} alt={recommendedUser.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <Link href={`/connections/${recommendedUser.id}`} className="font-bold text-sm text-gray-900 hover:text-[#0a66c2] hover:underline">
                          {recommendedUser.name}
                        </Link>
                        <p className="text-xs text-gray-500 line-clamp-1">{recommendedUser.title}</p>
                        <Button variant="outline" size="sm" className="mt-2 h-7 px-4 text-xs rounded-full border-gray-500 font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
