/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { jobService, Job } from '@/services/jobService';
import { useRouter } from 'next/navigation';
import { RecruiterLoading } from '@/components/shared/RecruiterLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Briefcase,
  Plus,
  Eye,
  Users,
  Clock,
  MapPin,
  Search,
  Filter,
  Edit,
  Trash2,
  PauseCircle,
  X,
  ChevronDown,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EditFormData {
  title: string;
  description: string;
  type: Job['type'];
  status: Job['status'];
  location: string;
  salaryMin: string;
  salaryMax: string;
  benefits: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  vacancy: string;
  applicationDeadline: string;
}



// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_SKILLS: Record<string, string[]> = {
  'Development': ['React', 'Node.js', 'TypeScript', 'Next.js', 'Vue.js', 'Angular', 'Symfony', 'Python', 'Docker', 'AWS', 'Azure', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Mobile Development'],
  'Design': ['UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Graphic Design', 'Product Design', 'Motion Design', 'Brand Identity'],
  'Marketing': ['SEO', 'SEM', 'Digital Marketing', 'Content Writing', 'Social Media Management', 'Email Marketing', 'Google Analytics', 'Brand Strategy'],
  'Business': ['Project Management', 'Business Development', 'Sales', 'Operations', 'Strategy', 'CRM', 'Agile Methodology', 'Financial Modeling'],
  'Data & AI': ['Python', 'Machine Learning', 'Data Analysis', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Data Engineering', 'Artificial Intelligence', 'SQL'],
  'Customer Support': ['Communication', 'Troubleshooting', 'Customer Success', 'ZenDesk', 'Technical Support', 'CRM', 'Intercom', 'Problem Solving'],
  'Finance': ['Accounting', 'Financial Analysis', 'Excel', 'Audit', 'Taxation', 'Corporate Finance', 'Budgeting', 'QuickBooks'],
  'Human Resources': ['Recruitment', 'Talent Management', 'Employee Relations', 'Payroll', 'Training & Development', 'HRIS', 'Onboarding'],
};

const DEFAULT_SKILLS = ['Communication', 'Teamwork', 'Problem Solving', 'Adaptability', 'Time Management'];


const EMPTY_FORM: EditFormData = {
  title: '',
  description: '',
  type: 'FULL_TIME',
  status: 'ACTIVE',
  location: '',
  salaryMin: '',
  salaryMax: '',
  benefits: '',
  responsibilities: '',
  requirements: '',
  skills: [],
  vacancy: '1',
  applicationDeadline: '',
};


const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active', color: 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100' },
  { value: 'CLOSED', label: 'Closed', color: 'border-red-400 text-red-700 bg-red-50 hover:bg-red-100' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
    case 'OPEN':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CLOSED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}


function jobToFormData(job: Job): EditFormData {
  return {
    title: job.title ?? '',
    description: job.description ?? '',
    type: job.type ?? 'FULL_TIME',
    status: job.status === 'ACTIVE' || job.status === 'CLOSED'
      ? job.status
      : 'ACTIVE',
    location: job.location ?? '',
    salaryMin: job.salaryMin?.toString() ?? '',
    salaryMax: job.salaryMax?.toString() ?? '',
    benefits: job.benefits ?? '',
    responsibilities: job.responsibilities ?? '',
    requirements: job.requirements ?? '',
    skills: job.skills?.map(skill => skill.skill.name) ?? [],
    vacancy: job.vacancy?.toString() ?? '1',
    applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
  };
}


// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface TextAreaFieldProps {
  label: string;
  value: string;
  rows?: number;
  placeholder?: string;
  onChange: (value: string) => void;
}

function TextAreaField({ label, value, rows = 4, placeholder, onChange }: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit Modal
// ---------------------------------------------------------------------------

interface EditModalProps {
  formData: EditFormData;
  onChange: (field: keyof EditFormData, value: any) => void;
  onSkillToggle: (skill: string) => void;
  onSave: () => void;
  onClose: () => void;
  job: Job | null;
}


// Confirmation Dialog Component
function ConfirmDialog({ isVisible, onConfirm, onCancel }: { isVisible: boolean; onConfirm: () => void; onCancel: () => void }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Confirm Changes</h3>
            <p className="text-sm text-gray-600">Are you sure you want to save these changes?</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Success Alert Component
function SuccessAlert({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[70] animate-in slide-in-from-right">
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px]">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">Success!</p>
          <p className="text-sm text-green-600">Job updated successfully</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-green-500 hover:text-green-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function EditModal({ formData, onChange, onSkillToggle, onSave, onClose, job }: EditModalProps) {
  // Get category name from job
  const categoryName = job?.category?.name || '';
  
  // Get skills for this category
  const categorySkills = CATEGORY_SKILLS[categoryName] || DEFAULT_SKILLS;
  
  // Combine with any currently selected skills that might not be in the list
  const allOptions = Array.from(new Set([...categorySkills, ...formData.skills]));

  return (

    <div className="fixed inset-0 bg-gray-500/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">Edit Job Posting</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Job Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange('status', opt.value)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${opt.color} ${formData.status === opt.value
                    ? 'ring-2 ring-offset-1 ring-blue-400 border-opacity-100'
                    : 'opacity-60 border-opacity-50'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="h-11"
            />
          </div>

          {/* Description */}
          <TextAreaField
            label="Job Description *"
            value={formData.description}
            rows={6}
            placeholder="Provide a detailed description of the role..."
            onChange={(v) => onChange('description', v)}
          />

          {/* Type / Location / Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={formData.type}
                onChange={(e) => onChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => onChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="h-11"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => onChange('salaryMin', e.target.value)}
                  placeholder="Min"
                  className="h-11"
                />
                <Input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => onChange('salaryMax', e.target.value)}
                  placeholder="Max"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <TextAreaField
            label="Responsibilities"
            value={formData.responsibilities}
            placeholder="Key responsibilities..."
            onChange={(v) => onChange('responsibilities', v)}
          />

          {/* Requirements */}
          <TextAreaField
            label="Requirements"
            value={formData.requirements}
            placeholder="Requirements..."
            onChange={(v) => onChange('requirements', v)}
          />

          {/* Benefits */}
          <TextAreaField
            label="Benefits"
            value={formData.benefits}
            rows={3}
            placeholder="Benefits..."
            onChange={(v) => onChange('benefits', v)}
          />

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allOptions.map((skill) => (
                <label key={skill} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">

                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => onSkillToggle(skill)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function JobPostingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>(EMPTY_FORM);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showClosedJobs, setShowClosedJobs] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData || userData.role !== 'RECRUITER') {
      router.push('/login');
      return;
    }
    const timer = setTimeout(() => {
      setUser(userData);
    }, 0);

    jobService.getRecruiterJobs()
      .then((res) => {
        if (res.success && res.data) setJobs(res.data);
      })
      .finally(() => setLoading(false));

    return () => clearTimeout(timer);
  }, [router]);

  // Use real data from API
  const displayJobs = jobs;

  const activeCount = displayJobs.filter((j) => j.status === 'ACTIVE' || j.status === 'OPEN').length;

  const draftCount = displayJobs.filter((j) => j.status === 'DRAFT').length;

  const closedCount = displayJobs.filter((j) => j.status === 'CLOSED').length;
  const totalApps = displayJobs.reduce((sum, j) => sum + (j.applicationCount ?? 0), 0);

  const stats = [
    { label: 'Active Jobs', value: activeCount, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Applications', value: totalApps, icon: Users, color: 'text-[#4880FF]', bg: 'bg-blue-50' },
    { label: 'Draft Jobs', value: draftCount, icon: Edit, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Closed', value: closedCount, icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const filteredJobs = displayJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---- handlers ----

  const handleEditClick = (job: any) => {
    setEditingJob(job);
    setEditFormData(jobToFormData(job));
  };

  const handleFormChange = (field: keyof EditFormData, value: any) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setEditFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!editingJob) return;

    // Prepare data for API
    const updateData: any = {
      ...editFormData,
      salaryMin: editFormData.salaryMin ? parseInt(editFormData.salaryMin) : undefined,
      salaryMax: editFormData.salaryMax ? parseInt(editFormData.salaryMax) : undefined,
      vacancy: editFormData.vacancy ? parseInt(editFormData.vacancy) : undefined,
      skills: editFormData.skills.map(skill => ({ name: skill })),
      applicationDeadline: editFormData.applicationDeadline ? new Date(editFormData.applicationDeadline).toISOString() : null,
    };

    try {
      const res = await jobService.updateJob(editingJob.id, updateData);
      if (res.success) {
        setShowConfirmDialog(false);
        setShowSuccessAlert(true);
        setEditingJob(null);
        // Refresh jobs from server
        const refreshedJobs = await jobService.getRecruiterJobs();
        if (refreshedJobs.success && refreshedJobs.data) {
          setJobs(refreshedJobs.data);
        }
      } else {
        alert(res.error || 'Failed to update job');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An unexpected error occurred while updating the job');
    }
  };


  const handleCancelSave = () => {
    setShowConfirmDialog(false);
  };

  const handleCloseModal = () => setEditingJob(null);

  // ---- render ----

  if (loading) {
    return <RecruiterLoading />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isVisible={showConfirmDialog}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
      />

      {/* Success Alert */}
      <SuccessAlert isVisible={showSuccessAlert} onClose={() => setShowSuccessAlert(false)} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600">Manage and track all your job listings</p>
        </div>
        <Button
          className="bg-[#4880FF] hover:bg-[#3d72eb]"
          onClick={() => router.push('/recruiter/post-job')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs by title or department..."
                className="pl-9 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 h-11">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Jobs ({filteredJobs.filter(j => j.status === 'ACTIVE' || j.status === 'OPEN').length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredJobs.filter(j => j.status === 'ACTIVE' || j.status === 'OPEN').length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6 border-2 border-dashed rounded-xl">No active jobs found matching your criteria</p>
            ) : (
              filteredJobs.filter(j => j.status === 'ACTIVE' || j.status === 'OPEN').map((job: any) => (
                <div
                  key={job.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all gap-4 bg-white"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#4880FF]">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.type?.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:justify-end">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{job.applicationCount ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{job.viewCount ?? 0}</span>
                    </div>
                    <Badge className="bg-green-50 text-green-600 border-green-100 uppercase tracking-widest text-[10px] font-black px-2.5 py-1">
                      ACTIVE
                    </Badge>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600" onClick={() => handleEditClick(job)}>
                        <Edit className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

        {/* Expired / Closed Jobs List */}
        <Card className="bg-gray-50/50 border-dashed">
          <CardHeader className="cursor-pointer select-none" onClick={() => setShowClosedJobs(!showClosedJobs)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-500">Expired / Closed Jobs ({filteredJobs.filter(j => j.status === 'CLOSED' || j.status === 'ARCHIVED').length})</CardTitle>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${showClosedJobs ? '' : '-rotate-90'}`} />
            </div>
          </CardHeader>
          {showClosedJobs && (
            <CardContent>
              <div className="space-y-3">
                {filteredJobs.filter(j => j.status === 'CLOSED' || j.status === 'ARCHIVED').length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6 italic">No expired or closed jobs yet</p>
                ) : (
                  filteredJobs.filter(j => j.status === 'CLOSED' || j.status === 'ARCHIVED').map((job: any) => (
                    <div
                      key={job.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 bg-white/60 opacity-75 grayscale-[0.3] hover:grayscale-0 transition-all gap-4"
                    >
                      {/* Left: icon + info */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-700 text-base">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span>{job.type?.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: metrics + actions */}
                      <div className="flex items-center gap-6 sm:justify-end">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{job.applicationCount ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>{job.viewCount ?? 0}</span>
                        </div>
                        <Badge className="bg-red-50 text-red-500 border-red-100 uppercase tracking-widest text-[10px] font-black px-2.5 py-1">
                          CLOSED
                        </Badge>

                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600" onClick={() => handleEditClick(job)}>
                            <Edit className="h-4.5 w-4.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-gray-100 hover:text-gray-900">
                            <Trash2 className="h-4.5 w-4.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          )}
        </Card>

      {/* Edit Modal */}
      {editingJob && (
        <EditModal
          formData={editFormData}
          onChange={handleFormChange}
          onSkillToggle={handleSkillToggle}
          onSave={handleSave}
          onClose={handleCloseModal}
          job={editingJob}
        />

      )}
    </div>
  );
}