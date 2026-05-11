/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SimpleCalendar } from '@/components/ui/calendar-simple';
import { Separator } from '@/components/ui/separator';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  Video,
  Building,
  Briefcase,
  Send,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
// Simple date formatting functions
const formatDate = (date: Date, formatStr: string) => {
  const options: Intl.DateTimeFormatOptions = {};
  if (formatStr.includes('MMMM')) options.month = 'long';
  if (formatStr.includes('MM')) options.month = '2-digit';
  if (formatStr.includes('d')) options.day = 'numeric';
  if (formatStr.includes('yyyy')) options.year = 'numeric';
  if (formatStr.includes('PPP')) {
    options.month = 'long';
    options.day = 'numeric';
    options.year = 'numeric';
  }

  return date.toLocaleDateString('en-US', options);
};

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  location: string;
  match: number;
  status: string;
  applied: string;
}

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  applications: number;
}

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  date: Date;
  time: string;
  type: 'ONLINE' | 'OFFLINE';
  meetingLink?: string;
  notes: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  feedback?: string;
  aiQuestions?: string[];
}

export default function ScheduleInterviewPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'schedule' | 'manage' | null;
  const [selectedTab, setSelectedTab] = useState<'schedule' | 'manage'>(tabParam || 'schedule');
  const router = useRouter();

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && tabParam !== selectedTab) {
      const timer = setTimeout(() => {
        setSelectedTab(tabParam);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [tabParam, selectedTab]);

  // Form states
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [interviewDate, setInterviewDate] = useState<Date>();
  const [interviewTime, setInterviewTime] = useState<string>('');
  const [interviewType, setInterviewType] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [aiEmail, setAiEmail] = useState<string>('');
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);

  // Manage states
  const [scheduledInterviews, setScheduledInterviews] = useState<Interview[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const [candidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Frontend Developer',
      experience: '5 years',
      location: 'San Francisco, CA',
      match: 92,
      status: 'SHORTLISTED',
      applied: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 987-6543',
      position: 'UX Designer',
      experience: '3 years',
      location: 'New York, NY',
      match: 88,
      status: 'SHORTLISTED',
      applied: '2024-01-14'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
      phone: '+1 (555) 456-7890',
      position: 'Backend Developer',
      experience: '7 years',
      location: 'Remote',
      match: 85,
      status: 'SHORTLISTED',
      applied: '2024-01-13'
    }
  ]);

  const [jobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      type: 'FULL_TIME',
      location: 'San Francisco, CA',
      applications: 45
    },
    {
      id: '2',
      title: 'UX Designer',
      type: 'FULL_TIME',
      location: 'New York, NY',
      applications: 32
    },
    {
      id: '3',
      title: 'Backend Developer',
      type: 'REMOTE',
      location: 'Remote',
      applications: 28
    }
  ]);

  const [interviews] = useState<Interview[]>([
    {
      id: '1',
      candidateId: '1',
      candidateName: 'John Doe',
      jobId: '1',
      jobTitle: 'Senior Frontend Developer',
      date: new Date(2024, 0, 20),
      time: '10:00 AM',
      type: 'ONLINE',
      meetingLink: 'https://zoom.us/j/123456789',
      notes: 'Technical interview focusing on React and TypeScript',
      status: 'SCHEDULED',
      aiQuestions: [
        'Can you explain your experience with React hooks?',
        'Describe a challenging project you worked on recently.',
        'How do you approach code optimization?'
      ]
    },
    {
      id: '2',
      candidateId: '2',
      candidateName: 'Jane Smith',
      jobId: '2',
      jobTitle: 'UX Designer',
      date: new Date(2024, 0, 21),
      time: '2:00 PM',
      type: 'OFFLINE',
      notes: 'Portfolio review and design discussion',
      status: 'SCHEDULED'
    }
  ]);

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData || userData.role !== 'RECRUITER') {
      router.push('/login');
      return;
    }

    const timer = setTimeout(() => {
      setUser(userData);
      setScheduledInterviews(interviews);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [router, interviews]);

  const generateAIEmail = () => {
    if (!selectedCandidate || !selectedJob || !interviewDate || !interviewTime) return;

    const emailTemplate = `
Dear ${selectedCandidate.name},

I hope this email finds you well.

We are pleased to invite you for an interview for the ${selectedJob.title} position at ${user?.company || 'our company'}.

Interview Details:
- Date: ${formatDate(interviewDate, 'MMMM d, yyyy')}
- Time: ${interviewTime}
- Type: ${interviewType === 'ONLINE' ? 'Online Interview' : 'In-Person Interview'}
${interviewType === 'ONLINE' && meetingLink ? `- Meeting Link: ${meetingLink}` : ''}

${notes ? `Additional Notes: ${notes}` : ''}

Please confirm your availability for this time slot. If you need to reschedule, please let us know at your earliest convenience.

We look forward to speaking with you and learning more about your experience and qualifications.

Best regards,
${user?.name || 'Recruitment Team'}
${user?.company || 'Company Name'}
${user?.email || 'recruitment@company.com'}
    `.trim();

    setAiEmail(emailTemplate);
  };

  const generateAIQuestions = () => {
    if (!selectedJob) return;

    const questionTemplates = {
      'Senior Frontend Developer': [
        'Can you explain your experience with React hooks and when you would use them?',
        'Describe a challenging frontend problem you solved recently.',
        'How do you approach performance optimization in web applications?',
        'What are your thoughts on modern CSS frameworks like Tailwind?',
        'How do you ensure code quality and maintainability in your projects?'
      ],
      'UX Designer': [
        'Can you walk us through your design process?',
        'How do you approach user research and usability testing?',
        'Describe a project where you had to balance user needs with business requirements.',
        'What tools and software do you prefer for UX design?',
        'How do you stay updated with the latest UX trends and best practices?'
      ],
      'Backend Developer': [
        'Can you explain your experience with database design and optimization?',
        'How do you approach API design and documentation?',
        'Describe your experience with cloud services and deployment.',
        'What are your thoughts on microservices vs monolithic architecture?',
        'How do you ensure security in your backend applications?'
      ]
    };

    const questions = questionTemplates[selectedJob.title as keyof typeof questionTemplates] || [
      'Tell us about your relevant experience for this position.',
      'Why are you interested in this role and our company?',
      'Describe a challenging project you worked on.',
      'How do you approach problem-solving in your work?',
      'Where do you see yourself in the next 5 years?'
    ];

    setAiQuestions(questions);
  };

  const scheduleInterview = () => {
    if (!selectedCandidate || !selectedJob || !interviewDate || !interviewTime) {
      alert('Please fill in all required fields');
      return;
    }

    const newInterview: Interview = {
      id: Date.now().toString(),
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.name,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      date: interviewDate,
      time: interviewTime,
      type: interviewType,
      meetingLink: interviewType === 'ONLINE' ? meetingLink : undefined,
      notes,
      status: 'SCHEDULED',
      aiQuestions
    };

    setScheduledInterviews([...scheduledInterviews, newInterview]);

    // Reset form
    setSelectedCandidate(null);
    setSelectedJob(null);
    setInterviewDate(undefined);
    setInterviewTime('');
    setMeetingLink('');
    setNotes('');
    setAiEmail('');
    setAiQuestions([]);

    alert('Interview scheduled successfully!');
  };

  const cancelInterview = (interviewId: string) => {
    setScheduledInterviews(scheduledInterviews.map(interview =>
      interview.id === interviewId
        ? { ...interview, status: 'CANCELLED' }
        : interview
    ));
  };

  const rescheduleInterview = (interviewId: string) => {
    const interview = scheduledInterviews.find(i => i.id === interviewId);
    if (interview) {
      setSelectedCandidate(candidates.find(c => c.id === interview.candidateId) || null);
      setSelectedJob(jobs.find(j => j.id === interview.jobId) || null);
      setInterviewDate(interview.date);
      setInterviewTime(interview.time);
      setInterviewType(interview.type);
      setMeetingLink(interview.meetingLink || '');
      setNotes(interview.notes);
      setAiQuestions(interview.aiQuestions || []);

      // Remove old interview
      setScheduledInterviews(scheduledInterviews.filter(i => i.id !== interviewId));
    }
  };

  const filteredInterviews = scheduledInterviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || interview.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading interview scheduler...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/recruiter">Recruiter</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedTab === 'schedule' ? 'Schedule Interview' : 'Manage Interviews'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {selectedTab === 'schedule' ? (
            <div className="max-w-5xl mx-auto space-y-8 pb-10">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Schedule Interview</h1>
                <p className="text-gray-500">Set up and manage interview appointments with candidates</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Select Candidate */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Select Candidate
                    </CardTitle>
                    <CardDescription>Choose the candidate for the interview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.01] ${selectedCandidate?.id === candidate.id
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                            : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 truncate">{candidate.name}</h4>
                              <p className="text-sm text-gray-600 truncate">{candidate.position}</p>
                            </div>
                            <Badge className={`ml-2 flex-shrink-0 ${candidate.match >= 90 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {candidate.match}% Match
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{candidate.email}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                              <Phone className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{candidate.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{candidate.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Select Job Position */}
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-indigo-500" />
                      Select Job Position
                    </CardTitle>
                    <CardDescription>Choose the job position</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.01] ${selectedJob?.id === job.id
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                            : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                          onClick={() => setSelectedJob(job)}
                        >
                          <h4 className="font-semibold text-gray-900 mb-2 truncate">{job.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1 min-w-0">
                              <Building className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{job.type.replace('_', ' ')}</span>
                            </span>
                            <span className="flex items-center gap-1 min-w-0">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </span>
                            <span className="flex items-center gap-1 min-w-0">
                              <Users className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{job.applications} applications</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interview Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Interview Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Choose Interview Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {interviewDate ? formatDate(interviewDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <SimpleCalendar
                            selected={interviewDate}
                            onSelect={setInterviewDate}
                            disabled={(date: Date) => date < new Date() || date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Choose Interview Time</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {interviewTime || 'Select time'}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {timeSlots.map((time) => (
                            <DropdownMenuItem key={time} onClick={() => setInterviewTime(time)}>
                              {time}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div>
                      <Label>Select Interview Type</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {interviewType === 'ONLINE' ? (
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Online Interview
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                In-Person Interview
                              </div>
                            )}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem onClick={() => setInterviewType('ONLINE')}>
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Online Interview
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setInterviewType('OFFLINE')}>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              In-Person Interview
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {interviewType === 'ONLINE' && (
                      <div>
                        <Label>Add Meeting Link</Label>
                        <Input
                          placeholder="https://zoom.us/j/..."
                          value={meetingLink}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingLink(e.target.value)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Add Short Notes</Label>
                      <Textarea
                        placeholder="Add any notes about the interview..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">AI Interview Questions</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateAIQuestions}
                          disabled={!selectedJob}
                        >
                          Generate AI Questions
                        </Button>
                      </div>
                      {aiQuestions.length > 0 && (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {aiQuestions.map((question, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                              {index + 1}. {question}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Email Generation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    AI Interview Invitation Email
                  </CardTitle>
                  <CardDescription>Generate and customize interview invitation email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Email Template</Label>
                    <Button
                      variant="outline"
                      onClick={generateAIEmail}
                      disabled={!selectedCandidate || !selectedJob || !interviewDate || !interviewTime}
                    >
                      Generate AI Email
                    </Button>
                  </div>
                  {aiEmail && (
                    <Textarea
                      value={aiEmail}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAiEmail(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  )}
                  <Button
                    className="w-full"
                    onClick={() => alert('Email sent successfully!')}
                    disabled={!aiEmail}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Interview Invitation
                  </Button>
                </CardContent>
              </Card>

              {/* Schedule Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="px-8"
                  onClick={scheduleInterview}
                  disabled={!selectedCandidate || !selectedJob || !interviewDate || !interviewTime}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Interviews</h1>
                <p className="text-gray-600">View and manage all scheduled interviews</p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search candidates by name or position..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="min-w-[160px] justify-between">
                            <div className="flex items-center gap-2">
                              <Filter className="h-4 w-4 text-gray-400" />
                              <span>{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                            <DropdownMenuRadioItem value="all">All Status</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="SCHEDULED">Scheduled</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="COMPLETED">Completed</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="CANCELLED">Cancelled</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {filteredInterviews.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews found</h3>
                      <p className="text-gray-600">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try adjusting your search or filter criteria'
                          : 'No interviews scheduled yet'
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredInterviews.map((interview) => (
                    <Card key={interview.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">{interview.candidateName}</h3>
                              <Badge className={
                                interview.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                                  interview.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    interview.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                              }>
                                {interview.status}
                              </Badge>
                              <Badge variant="outline">
                                {interview.type === 'ONLINE' ? (
                                  <div className="flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    Online
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <Building className="h-3 w-3" />
                                    In-Person
                                  </div>
                                )}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium">Position:</span>
                                  <span>{interview.jobTitle}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium">Date:</span>
                                  <span>{formatDate(interview.date, 'MMMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium">Time:</span>
                                  <span>{interview.time}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {interview.meetingLink && (
                                  <div className="flex items-center gap-2">
                                    <Video className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">Meeting:</span>
                                    <a
                                      href={interview.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Join Meeting
                                    </a>
                                  </div>
                                )}
                                {interview.notes && (
                                  <div className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div>
                                      <span className="font-medium">Notes:</span>
                                      <p className="text-gray-600 mt-1">{interview.notes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {interview.status === 'SCHEDULED' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => rescheduleInterview(interview.id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Reschedule
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelInterview(interview.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {interview.status === 'COMPLETED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => alert('Add feedback functionality coming soon!')}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Add Feedback
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
