/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { interviewService, Interview, InterviewStats } from '@/services/interviewService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Calendar as CalendarIcon,
  List as ListIcon,
  Search,
  MoreVertical,
  Video,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarDays,
  User,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { RecruiterLoading } from '@/components/shared/RecruiterLoading';

export default function ManageInterviewsPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [stats, setStats] = useState<InterviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit States
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editLink, setEditLink] = useState('');

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (activeTab === 'upcoming') filters.timeframe = 'upcoming';
      if (activeTab === 'past') filters.timeframe = 'past';

      const res = await interviewService.getInterviews(filters);
      if (res.success && res.data) {
        setInterviews(res.data.interviews);
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await interviewService.updateInterview(id, { status });
      if (res.success) {
        toast.success(`Interview marked as ${status.toLowerCase()}`);
        fetchInterviews();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCancelInterview = async () => {
    if (!selectedInterview) return;
    setIsUpdating(true);
    try {
      const res = await interviewService.cancelInterview(selectedInterview.id, cancelReason);
      if (res.success) {
        toast.success("Interview cancelled successfully");
        setIsCancelModalOpen(false);
        fetchInterviews();
      }
    } catch (error) {
      toast.error("Failed to cancel interview");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedInterview) return;
    setIsUpdating(true);
    try {
      const scheduledAt = new Date(`${editDate} ${editTime}`).toISOString();
      const res = await interviewService.updateInterview(selectedInterview.id, {
        scheduledAt,
        meetingLink: editLink,
        status: 'RESCHEDULED'
      });
      if (res.success) {
        toast.success("Interview rescheduled successfully!");
        setIsEditModalOpen(false);
        fetchInterviews();
      }
    } catch (error) {
      toast.error("Failed to reschedule interview");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!loading) setLoading(true);

      try {
        const filters: any = {};
        if (activeTab === 'upcoming') filters.timeframe = 'upcoming';
        if (activeTab === 'past') filters.timeframe = 'past';

        const res = await interviewService.getInterviews(filters);
        if (isMounted && res.success && res.data) {
          setInterviews(res.data.interviews);
          setStats(res.data.stats);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch interviews:', error);
          toast.error("Failed to load interviews");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
      case 'RESCHEDULED': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const filteredInterviews = interviews.filter(i =>
    i.application.seeker.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.application.job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full bg-gray-50/30">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Manage Interviews</h1>
          <p className="text-gray-500 font-medium">Track, schedule, and evaluate your upcoming candidate meetings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-white border border-gray-100 rounded-xl shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
          </div>
          <Button onClick={() => router.push('/recruiter/candidates')} className="bg-[#4880FF] hover:bg-blue-600 text-white font-bold h-12 rounded-xl px-6 shadow-lg shadow-blue-100">
            <Plus className="mr-2 h-5 w-5" /> Schedule New
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Upcoming', value: stats?.upcoming || 0, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Cancelled', value: stats?.cancelled || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total', value: stats?.total || 0, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((stat, i) => (
          <Card key={i} className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="rounded-3xl border border-gray-100 shadow-sm bg-white overflow-hidden min-h-[600px]">
        <div className="border-b border-gray-50 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl w-fit">
              {['upcoming', 'past', 'all'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm"
                />
              </div>
              <Button variant="outline" className="h-11 rounded-xl border-gray-100 px-4 text-gray-600 font-bold">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20">
            <RecruiterLoading fullScreen={false} />
          </div>
        ) : filteredInterviews.length > 0 ? (
          viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Candidate & Role</th>
                    <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews.map((interview) => (
                    <tr key={interview.id} className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center font-bold text-[#4880FF]">
                            {interview.application.seeker.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-[#4880FF] transition-colors">{interview.application.seeker.user.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{interview.application.job.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {new Date(interview.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {new Date(interview.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ({interview.duration}m)
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          {interview.type === 'VIDEO' ? <Video className="h-4 w-4 text-blue-500" /> :
                            interview.type === 'PHONE' ? <Phone className="h-4 w-4 text-green-500" /> :
                              <MapPin className="h-4 w-4 text-orange-500" />}
                          <span className="text-xs font-bold text-gray-700 capitalize">{interview.type.toLowerCase()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <Badge className={`${getStatusColor(interview.status)} border shadow-none px-3 py-1 font-bold rounded-lg text-[10px]`}>
                          {interview.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {interview.meetingLink && (
                            <Button
                              onClick={() => window.open(interview.meetingLink, '_blank')}
                              className="h-9 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-bold text-xs flex items-center gap-2"
                            >
                              <Video className="h-4 w-4" /> Join
                            </Button>
                          )}
                          <Button
                            onClick={() => {
                              setSelectedInterview(interview);
                              setEditDate(interview.scheduledAt.split('T')[0]);
                              setEditTime(new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                              setEditLink(interview.meetingLink || '');
                              setIsEditModalOpen(true);
                            }}
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => router.push(`/recruiter/applications/${interview.applicationId}`)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-gray-100"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-gray-100">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedInterview(interview);
                                  setEditDate(interview.scheduledAt.split('T')[0]);
                                  setEditTime(new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                                  setEditLink(interview.meetingLink || '');
                                  setIsEditModalOpen(true);
                                }}
                                className="rounded-lg font-bold text-sm flex items-center gap-2"
                              >
                                <Edit2 className="h-4 w-4" /> Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(interview.id, 'COMPLETED')}
                                className="rounded-lg font-bold text-sm flex items-center gap-2 text-green-600 focus:text-green-600"
                              >
                                <CheckCircle2 className="h-4 w-4" /> Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedInterview(interview);
                                  setIsCancelModalOpen(true);
                                }}
                                className="rounded-lg font-bold text-sm flex items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" /> Cancel Interview
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 h-full">
              {/* Simplified Calendar Placeholder */}
              <div className="grid grid-cols-7 border border-gray-100 rounded-3xl overflow-hidden bg-gray-50/50">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="p-4 text-center border-b border-r border-gray-100 bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 2;
                  const date = day > 0 && day <= 31 ? day : null;
                  const hasInterviews = date && interviews.some(int => new Date(int.scheduledAt).getDate() === date);
                  return (
                    <div key={i} className={`min-h-[120px] p-4 border-b border-r border-gray-100 bg-white group transition-colors hover:bg-blue-50/20 cursor-pointer`}>
                      <div className={`text-sm font-bold ${date ? 'text-gray-900' : 'text-gray-200'}`}>{date}</div>
                      {hasInterviews && (
                        <div className="mt-2 space-y-1">
                          {interviews
                            .filter(int => new Date(int.scheduledAt).getDate() === date)
                            .slice(0, 2)
                            .map(int => (
                              <div key={int.id} className="p-1.5 rounded-lg bg-blue-100 text-blue-700 text-[9px] font-bold truncate border border-blue-200">
                                {new Date(int.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {int.application.seeker.user.name}
                              </div>
                            ))}
                          {interviews.filter(int => new Date(int.scheduledAt).getDate() === date).length > 2 && (
                            <div className="text-[9px] font-black text-blue-400 text-center uppercase">+ More</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center">
              <CalendarDays className="h-10 w-10 text-gray-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">No interviews found</h3>
              <p className="text-gray-500 font-medium text-sm">There are no scheduled interviews for this category.</p>
            </div>
            <Button onClick={() => router.push('/recruiter/candidates')} className="rounded-xl border-gray-200" variant="outline">
              Schedule your first interview
            </Button>
          </div>
        )}

      </Card>

      {/* Cancel Interview Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Cancel Interview</h3>
              <button onClick={() => setIsCancelModalOpen(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-xs text-red-700 font-medium leading-relaxed">
                Are you sure you want to cancel the interview with <span className="font-bold">{selectedInterview?.application.seeker.user.name}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Reason for Cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Candidate withdrew, Position filled, etc."
                className="w-full rounded-xl border-gray-100 bg-gray-50 p-4 text-sm min-h-[100px] focus:ring-[#4880FF]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsCancelModalOpen(false)} className="flex-1 rounded-xl font-bold">Close</Button>
              <Button
                onClick={handleCancelInterview}
                disabled={isUpdating}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Interview Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Reschedule Interview</h3>
                <p className="text-sm text-gray-500 font-medium">Update meeting time for {selectedInterview?.application.seeker.user.name}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">New Date</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10 h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">New Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      className="pl-10 h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Update Meeting Link</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="https://zoom.us/j/..."
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
                <Button
                  onClick={handleReschedule}
                  disabled={isUpdating}
                  className="flex-1 h-12 rounded-xl bg-[#4880FF] hover:bg-blue-600 text-white font-black shadow-lg shadow-blue-100"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
