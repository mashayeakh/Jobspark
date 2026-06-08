/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Briefcase, 
  Bot, 
  Sparkles, 
  Edit3, 
  Plus, 
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Save,
  Info
} from 'lucide-react';
import { workStyleService } from '@/services/workStyleService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/services/adminService';
import { authService } from '@/services/authService';
import { categoryService } from '@/services/categoryService';
import { jobService } from '@/services/jobService';
import { recruiterService } from '@/services/recruiterService';
import { toast } from 'sonner';


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

export default function PostJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState('');
  const [aiRole, setAiRole] = useState('');
  const [aiTechnologies, setAiTechnologies] = useState('');
  const [aiExperience, setAiExperience] = useState('');
  const [isEditingAi, setIsEditingAi] = useState(false);

  // Fetch filter options
  const { data: jobTypesData } = useApi(() => workStyleService.getActiveJobTypes());
  const { data: locationTypesData } = useApi(() => workStyleService.getActiveLocationTypes());
  const { data: experienceLevelsData } = useApi(() => workStyleService.getActiveExperienceLevels());
  const { data: categoriesData } = useApi(() => categoryService.getActiveCategories());
  const { data: profileData } = useApi(() => recruiterService.getProfile());

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'FULL_TIME' as any,
    locationType: 'REMOTE' as any,
    experienceLevel: 'MID' as any,
    salaryMin: '',
    salaryMax: '',
    location: '',
    company: '',
    vacancy: 1,
    benefits: '',
    responsibilities: '',
    requirements: '',
    categoryId: '',
    subCategoryId: '',
    skills: [] as string[],
    applicationDeadline: '',
  });

  useEffect(() => {
    const user = authService.getUser();
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
      router.push('/login?returnTo=/post-job');
      return;
    }

    if (user?.role !== 'RECRUITER') {
      router.push('/');
      return;
    }
    
    if (profileData?.company?.name) {
      requestAnimationFrame(() => {
        setFormData(prev => ({ ...prev, company: profileData.company.name }));
      });
    }
  }, [profileData, router]);


  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId: categoryId,
      subCategoryId: '',
      skills: [] // Reset skills when category changes
    }));
  };

  const handleSkillToggle = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter(s => s !== skillName)
        : [...prev.skills, skillName]
    }));
  };

  const generateAIDescription = async () => {
    if (!aiRole || !aiTechnologies || !aiExperience) {
      setErrorMessage('Please fill in all AI generation fields');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const expLabel = {
        JUNIOR: '0-2 years of experience',
        MID: '2-5 years of experience',
        SENIOR: '5+ years of experience',
        LEAD: '7+ years of experience with leadership responsibilities'
      }[aiExperience as keyof typeof experienceLevelsData] || 'relevant experience';

      const description = `We are seeking a talented ${aiRole} to join our dynamic team. The ideal candidate will have ${expLabel} and strong proficiency in ${aiTechnologies}.

Key Responsibilities:
• Design, develop, and maintain high-quality software solutions
• Collaborate with cross-functional teams to define and implement features
• Write clean, maintainable, and well-documented code
• Participate in code reviews and contribute to technical discussions
• Troubleshoot and debug complex issues

Requirements:
• ${expLabel} in the field
• Strong expertise in ${aiTechnologies}
• Excellent problem-solving and analytical skills
• Ability to work independently and in a team environment
• Strong communication skills and attention to detail

We offer a competitive salary, flexible work environment, and opportunities for professional growth. If you're passionate about technology and want to make an impact, we'd love to hear from you!`;

      setAiGeneratedDescription(description);
    } catch (error) {
      setErrorMessage('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const insertAIDescription = () => {
    setFormData(prev => ({ ...prev, description: aiGeneratedDescription }));
    setSubmitMessage('AI description inserted into form!');
    setTimeout(() => setSubmitMessage(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error('Job Title is required');
      return;
    }
    if (!formData.company) {
      toast.error('Company Name is required');
      return;
    }
    if (!formData.description) {
      toast.error('Job Description is required');
      return;
    }
    if (!formData.type) {
      toast.error('Job Type is required');
      return;
    }
    if (!formData.locationType) {
      toast.error('Location Type is required');
      return;
    }
    if (!formData.experienceLevel) {
      toast.error('Experience Level is required');
      return;
    }
    if (!formData.location) {
      toast.error('Location is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setErrorMessage('');

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        locationType: formData.locationType,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        location: formData.location,
        company: formData.company,
        vacancy: formData.vacancy,
        benefits: formData.benefits,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        categoryId: formData.categoryId || undefined,
        subCategoryId: formData.subCategoryId || undefined,
        skills: formData.skills.map(skill => ({ name: skill })),
        applicationDeadline: formData.applicationDeadline || undefined,
      };

      const response = await jobService.createJob(jobData);

      if (response.success) {
        setSubmitMessage('Job posted successfully!');
        setTimeout(() => {
          router.push('/recruiter/jobs');
        }, 2000);
      } else {
        setErrorMessage(response.error || 'Failed to post job');
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'An error occurred while posting job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategoryName = categoriesData?.find((c: Category) => c.id === formData.categoryId)?.name || '';
  const suggestedSkills = currentCategoryName ? CATEGORY_SKILLS[currentCategoryName] || DEFAULT_SKILLS : DEFAULT_SKILLS;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute top-[20%] -left-[5%] w-[30%] h-[30%] bg-purple-50/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => router.push('/recruiter/jobs')}
              className="group -ml-2 text-gray-500 hover:text-blue-600 transition-colors gap-2"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Post a New Opening</h1>
            <p className="text-lg text-gray-600">Connect with the best talent on JobSpark</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button
                type="button"
                variant="outline"
                onClick={() => {
                  localStorage.setItem('jobDraft', JSON.stringify(formData));
                  setSubmitMessage('Draft saved locally');
                  setTimeout(() => setSubmitMessage(''), 3000);
                }}
                className="gap-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 rounded-xl"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button
                form="post-job-form"
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 h-11 px-8 rounded-xl font-semibold gap-2 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Messages */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-800 font-medium">{errorMessage}</p>
              </div>
            )}

            {submitMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-emerald-800 font-medium">{submitMessage}</p>
              </div>
            )}

            <form id="post-job-form" noValidate onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Card */}
              <Card className="border-0 shadow-sm overflow-hidden rounded-3xl bg-white/80 backdrop-blur">
                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Job Basics</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-semibold text-gray-700 ml-1">Job Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="h-12 bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-xl px-4 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-semibold text-gray-700 ml-1">Company Name <span className="text-red-500">*</span></Label>
                      <div className="relative group">
                        <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${profileData?.company?.name ? 'text-blue-500' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                        <Input
                          id="company"
                          required
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="e.g. Acme Corp"
                          readOnly={!!profileData?.company?.name}
                          className={`h-12 border-gray-200 rounded-xl pl-11 pr-4 transition-all ${profileData?.company?.name ? 'bg-blue-50/50 text-blue-800 font-bold border-blue-100' : 'bg-white/50 focus:bg-white focus:ring-blue-500 focus:border-blue-500'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700 ml-1">Job Description <span className="text-red-500">*</span></Label>
                    <div className="relative group">
                       <Textarea
                        id="description"
                        required
                        rows={8}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-2xl p-4 resize-none min-h-[200px] transition-all"
                        placeholder="Describe the role, the team, and what makes this opportunity unique..."
                      />
                      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-400 border border-gray-100 transition-opacity group-focus-within:opacity-0">
                        {formData.description.length} / 2000
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specifics Card */}
              <Card className="border-0 shadow-sm rounded-3xl bg-white/80 backdrop-blur">
                 <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                      <Info className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Work Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 ml-1">Job Type</Label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full h-12 bg-white/50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all"
                      >
                        {jobTypesData?.map((type: any) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 ml-1">Location Type</Label>
                      <select
                        required
                        value={formData.locationType}
                        onChange={(e) => handleInputChange('locationType', e.target.value)}
                        className="w-full h-12 bg-white/50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all"
                      >
                        {locationTypesData?.map((type: any) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 ml-1">Experience Level</Label>
                      <select
                        required
                        value={formData.experienceLevel}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        className="w-full h-12 bg-white/50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all"
                      >
                        {experienceLevelsData?.map((level: any) => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Min Salary
                      </Label>
                      <Input
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        placeholder="e.g. 80000"
                        className="h-12 bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-xl px-4 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1">
                         <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Max Salary
                      </Label>
                      <Input
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        placeholder="e.g. 120000"
                        className="h-12 bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-xl px-4 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-red-500" /> Office Location
                      </Label>
                      <Input
                        required
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        className="h-12 bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-xl px-4 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-blue-500" /> Vacancies
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.vacancy}
                          onChange={(e) => handleInputChange('vacancy', parseInt(e.target.value))}
                          className="h-12 bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-xl px-4 transition-all"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 ml-1">Category</Label>
                        <select
                          value={formData.categoryId}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full h-12 bg-white/50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="">Select Category</option>
                          {categoriesData?.map((category: Category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-purple-500" /> Deadline
                        </Label>
                        <Input
                          type="date"
                          value={formData.applicationDeadline}
                          onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                          className="h-12 bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-xl px-4 transition-all"
                        />
                      </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sections Card */}
              <Card className="border-0 shadow-sm rounded-3xl bg-white/80 backdrop-blur">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      </div>
                      Responsibilities
                    </Label>
                    <Textarea
                      rows={4}
                      value={formData.responsibilities}
                      onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                      placeholder="• Leading development of core features&#10;• Mentoring junior developers&#10;• Architecture review and design"
                      className="bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-2xl p-4 resize-none transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                      <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                        <AlertCircle className="h-4.5 w-4.5" />
                      </div>
                      Requirements
                    </Label>
                    <Textarea
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="• 5+ years of experience in relevant field&#10;• Strong communication and leadership skills&#10;• Proficiency in core technologies"
                      className="bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-2xl p-4 resize-none transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                      <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                        <Sparkles className="h-4.5 w-4.5" />
                      </div>
                      Benefits & Perks
                    </Label>
                    <Textarea
                      rows={3}
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      placeholder="• Competitive salary and equity&#10;• Remote-first culture&#10;• Health and wellness stipends"
                      className="bg-white/50 border-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 rounded-2xl p-4 resize-none transition-all"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur">
                 <div className="bg-gray-900 px-8 py-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white/10 rounded-xl">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Skills Required</h2>
                        <p className="text-gray-400 text-sm font-medium">Select target skills for matching</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500 text-white border-0 px-3 py-1 text-sm font-bold">
                      {formData.skills.length} Selected
                    </Badge>
                 </div>
                 <CardContent className="p-8">
                    <div className="flex flex-wrap gap-2.5 mb-8 min-h-[56px] p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 transition-all">
                      {formData.skills.length === 0 && (
                        <p className="text-gray-400 text-sm font-medium italic py-1 px-2">No skills selected yet. Click from suggestions below...</p>
                      )}
                      {formData.skills.map(skill => (
                        <Badge key={skill} className="bg-blue-600 hover:bg-blue-700 text-white pl-4 pr-1.5 py-2 gap-2 rounded-full border-0 shadow-md shadow-blue-200 animate-in zoom-in-90 transition-all">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className="bg-black/20 hover:bg-black/40 rounded-full p-0.5 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5 rotate-45" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Suggested for {currentCategoryName || 'this role'}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {suggestedSkills.map(skill => {
                          const isSelected = formData.skills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleSkillToggle(skill)}
                              className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl border text-sm font-bold transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]' 
                                  : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30'
                              }`}
                            >
                              {skill}
                              <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected ? 'bg-white/20 border-white/40' : 'bg-gray-50 border-gray-200 group-hover:border-blue-300 group-hover:bg-blue-50'
                              }`}>
                                <Plus className={`h-3 w-3 transition-transform ${isSelected ? 'text-white rotate-45' : 'text-gray-400 group-hover:text-blue-500'}`} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                 </CardContent>
              </Card>
            </form>
          </div>

          {/* AI Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6">
              <Card className="border-0 shadow-2xl shadow-blue-900/10 overflow-hidden rounded-[2rem] bg-white ring-1 ring-black/5">
                <div className="p-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative">
                  <div className="absolute top-0 right-0 p-6 opacity-10 blur-[1px]">
                    <Sparkles className="h-24 w-24" />
                  </div>
                  
                  <div className="relative flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Bot className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight">AI Copilot</h2>
                    </div>
                    <Switch
                      checked={aiEnabled}
                      onCheckedChange={setAiEnabled}
                      className="data-[state=checked]:bg-white/40 border-0"
                    />
                  </div>
                  <p className="relative text-blue-100 text-sm font-medium leading-relaxed">
                    Let our AI draft a high-impact job description for you in seconds.
                  </p>
                </div>

                <CardContent className={`p-8 transition-all duration-500 ${aiEnabled ? 'opacity-100 translate-y-0' : 'opacity-30 grayscale pointer-events-none translate-y-4'}`}>
                  <div className="space-y-6">
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Role</Label>
                      <Input
                        value={aiRole}
                        onChange={(e) => setAiRole(e.target.value)}
                        placeholder="e.g. Lead Backend Architect"
                        className="h-12 bg-gray-50 border-gray-100 focus:bg-white focus:ring-blue-500 rounded-xl font-semibold px-4"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Key Tech</Label>
                      <Input
                        value={aiTechnologies}
                        onChange={(e) => setAiTechnologies(e.target.value)}
                        placeholder="e.g. Elixir, Phoenix, AWS"
                        className="h-12 bg-gray-50 border-gray-100 focus:bg-white focus:ring-blue-500 rounded-xl font-semibold px-4"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Seniority</Label>
                      <div className="relative">
                        <select
                          value={aiExperience}
                          onChange={(e) => setAiExperience(e.target.value)}
                          className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none appearance-none cursor-pointer font-semibold transition-all"
                        >
                          <option value="">Select Level</option>
                          <option value="JUNIOR">Junior</option>
                          <option value="MID">Mid-level</option>
                          <option value="SENIOR">Senior</option>
                          <option value="LEAD">Lead / Architect</option>
                        </select>
                        <Plus className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-45 pointer-events-none" />
                      </div>
                    </div>

                    <Button
                      onClick={generateAIDescription}
                      disabled={isGenerating || !aiRole || !aiTechnologies}
                      className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-black gap-3 transition-all active:scale-95 shadow-xl shadow-gray-200"
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
                          Generate Copy
                        </>
                      )}
                    </Button>
                  </div>

                  {aiGeneratedDescription && (
                    <div className="mt-10 space-y-5 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">AI Suggestion</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingAi(!isEditingAi)}
                          className={`h-8 px-3 text-xs font-bold gap-2 rounded-lg transition-all ${isEditingAi ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          {isEditingAi ? 'Lock Content' : 'Edit Copy'}
                        </Button>
                      </div>
                      
                      <div className={`relative rounded-2xl border-2 transition-all duration-300 ${isEditingAi ? 'border-blue-500 bg-white shadow-2xl shadow-blue-100 scale-[1.02]' : 'border-gray-100 bg-gray-50/50'}`}>
                        <div
                          contentEditable={isEditingAi}
                          suppressContentEditableWarning={true}
                          className={`min-h-[200px] p-5 text-sm leading-relaxed text-gray-600 font-medium whitespace-pre-wrap outline-none`}
                          onBlur={(e) => setAiGeneratedDescription(e.currentTarget.textContent || '')}
                        >
                          {aiGeneratedDescription}
                        </div>
                      </div>

                      <Button
                        onClick={insertAIDescription}
                        className="w-full h-12 bg-blue-50 hover:bg-blue-100 text-blue-700 border-0 rounded-2xl font-black gap-2 transition-all active:scale-95"
                      >
                        <Plus className="h-4.5 w-4.5" />
                        Apply to Main Form
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pro Tip */}
              <div className="group p-8 bg-white rounded-[2rem] border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                      <AlertCircle className="h-5 w-5" />
                   </div>
                   <h4 className="text-emerald-900 font-black tracking-tight">Recruiter Pro Tip</h4>
                </div>
                <p className="text-emerald-800 text-sm font-semibold leading-relaxed">
                  Postings with salary ranges receive <span className="text-emerald-600 font-black underline decoration-2 underline-offset-4">40% more</span> qualified applicants. Be transparent to win the best talent!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
