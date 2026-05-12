/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { DollarSign, Briefcase, Bot, Sparkles, Edit3, Plus, ArrowLeft } from 'lucide-react';
import { jobService, CreateJobData, Job } from '@/services/jobService';
import { workStyleService } from '@/services/workStyleService';
import { categoryService } from '@/services/categoryService';
import { useApi } from '@/hooks/useApi';
import { recruiterService } from '@/services/recruiterService';
import { Button } from '@/components/ui/button';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface JobFormData {
  title: string;
  description: string;
  type: string;
  locationType: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  location: string;
  company: string;
  vacancy: string;
  applicationDeadline: string;
  benefits: string;



  responsibilities: string;
  requirements: string;
  category: string;
  subCategory: string;
  skills: string[];
}


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

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    type: 'FULL_TIME',
    locationType: 'HYBRID',
    experienceLevel: 'SENIOR',
    salaryMin: '',
    salaryMax: '',
    location: '',
    company: '',
    vacancy: '1',
    applicationDeadline: '',
    benefits: '',
    responsibilities: '',
    requirements: '',
    category: '',
    subCategory: '',
    skills: [],
  });

  useEffect(() => {
    if (profileData?.company?.name) {
      requestAnimationFrame(() => {
        setFormData(prev => ({ ...prev, company: profileData.company.name }));
      });
    }
  }, [profileData]);




  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    // Find category name from data
    const category = categoriesData?.find(c => c.id === categoryId);
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subCategory: '',
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      const experienceLevel = {
        JUNIOR: '0-2 years of experience',
        MID: '2-5 years of experience',
        SENIOR: '5+ years of experience',
        LEAD: '7+ years of experience with leadership responsibilities'
      };

      const description = `We are seeking a talented ${aiRole} to join our dynamic team. The ideal candidate will have ${experienceLevel[aiExperience as keyof typeof experienceLevel]} and strong proficiency in ${aiTechnologies}.

Key Responsibilities:
• Design, develop, and maintain high-quality software solutions
• Collaborate with cross-functional teams to define and implement features
• Write clean, maintainable, and well-documented code
• Participate in code reviews and contribute to technical discussions
• Troubleshoot and debug complex issues

Requirements:
• ${experienceLevel[aiExperience as keyof typeof experienceLevel]} in software development
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
    setIsSubmitting(true);
    setSubmitMessage('');
    setErrorMessage('');

    try {
      const jobData: CreateJobData = {
        title: formData.title,
        description: formData.description,
        type: formData.type as Job['type'],
        locationType: formData.locationType as Job['locationType'],
        experienceLevel: formData.experienceLevel as Job['experienceLevel'],
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        location: formData.location,
        company: formData.company,
        vacancy: formData.vacancy ? parseInt(formData.vacancy) : 1,
        applicationDeadline: formData.applicationDeadline || undefined,
        benefits: formData.benefits,


        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        categoryId: formData.category || undefined,
        subCategoryId: formData.subCategory || undefined,
        skills: formData.skills.map(skill => ({ name: skill })),
      };

      if (formData.applicationDeadline) {
        const deadline = new Date(formData.applicationDeadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadline < today) {
          setErrorMessage('Application deadline cannot be in the past');
          setIsSubmitting(false);
          return;
        }
      }

      const response = await jobService.createJob(jobData);



      if (response.success) {
        setSubmitMessage('Job posted successfully!');
        setTimeout(() => {
          router.push('/recruiter/jobs');
        }, 2000);
      } else {
        const errorMsg = response.error || 'Failed to post job';
        if (errorMsg.includes('login') || errorMsg.includes('recruiter')) {
          setErrorMessage(errorMsg);
        } else {
          setSubmitMessage(errorMsg);
        }
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'An error occurred while posting job';
      if (errorMsg.includes('login') || errorMsg.includes('recruiter') || errorMsg.includes('Unauthorized')) {
        setErrorMessage(errorMsg);
      } else {
        setSubmitMessage(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const jobData: CreateJobData = {
        title: formData.title || 'Untitled Draft',
        description: formData.description || 'No description provided',
        type: (formData.type as Job['type']) || 'FULL_TIME',
        locationType: (formData.locationType as Job['locationType']) || 'REMOTE',
        experienceLevel: (formData.experienceLevel as Job['experienceLevel']) || 'ENTRY',
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        location: formData.location || 'Remote',
        company: formData.company,
        vacancy: formData.vacancy ? parseInt(formData.vacancy) : 1,
        applicationDeadline: formData.applicationDeadline || undefined,
        benefits: formData.benefits,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        categoryId: formData.category || undefined,
        subCategoryId: formData.subCategory || undefined,
        skills: formData.skills.map(skill => ({ name: skill })),
        status: 'DRAFT',
      };

      const response = await jobService.createJob(jobData);

      if (response.success) {
        setSubmitMessage('Draft saved successfully!');
        setTimeout(() => {
          router.push('/recruiter/jobs');
        }, 2000);
      } else {
        setSubmitMessage(response.error || 'Failed to save draft');
      }
    } catch (error: any) {
      setSubmitMessage(error?.message || 'An error occurred while saving draft');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/recruiter/jobs')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Job Postings
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
                <p className="text-gray-600">Create a new job opening to find the perfect candidate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Form (65%) */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">{errorMessage}</p>
                  </div>
                )}

                {/* Success Message */}
                {submitMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">{submitMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g. Senior Solutions Engineer (Full Stack)"
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="e.g. Tech Corp Inc."
                        className={`h-11 ${profileData?.company?.name ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                        readOnly={!!profileData?.company?.name}
                      />
                    </div>

                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
                    />
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-500">
                        {formData.description.length} / 2000 characters
                      </span>
                    </div>
                  </div>
                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type *
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
                      >
                        {jobTypesData?.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location Type *
                      </label>
                      <select
                        required
                        value={formData.locationType}
                        onChange={(e) => handleInputChange('locationType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
                      >
                        {locationTypesData?.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level *
                      </label>
                      <select
                        required
                        value={formData.experienceLevel}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
                      >
                        {experienceLevelsData?.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Salary and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Salary
                      </label>
                      <Input
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        placeholder="e.g. 105000"
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Salary
                      </label>
                      <Input
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        placeholder="e.g. 145000"
                        className="h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <Input
                        required
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g. Global Remote"
                        className="h-11"
                      />
                    </div>
 
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Deadline
                      </label>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.applicationDeadline}
                        onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                        className="h-11"
                      />

                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Positions
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.vacancy}
                        onChange={(e) => handleInputChange('vacancy', e.target.value)}
                        className="h-11"

                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11"
                      >
                        <option value="">Select a category (optional)</option>
                        {categoriesData?.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}

                      </select>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsibilities
                    </label>
                    <textarea
                      rows={4}
                      value={formData.responsibilities}
                      onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Justify technical solutions to business tasks; Create scalable systems from scratch; Handle client calls with professionalism; Onboard quickly; Maintain trust through consistent delivery."
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="4+ years software development experience. Expertise in: (Symfony/Vue) OR (Symfony/Angular) OR (Symfony/Next.js/JS-TS). Advanced English fluency. Strong self-organizational skills and full reliability."
                    />
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits
                    </label>
                    <textarea
                      rows={3}
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Performance-based Equity; Paid Certification Courses; Annual Wellness Stipend; Dynamic Remote Team; No-meeting Thursdays."
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(formData.category 
                        ? CATEGORY_SKILLS[categoriesData?.find(c => c.id === formData.category)?.name || ''] || DEFAULT_SKILLS
                        : DEFAULT_SKILLS
                      ).map(skill => (
                        <label key={skill} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </label>
                      ))}
                    </div>

                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={handleSaveDraft}
                    >
                      {isSubmitting ? 'Saving...' : 'Save as Draft'}
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Job'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Assistant (35%) */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-6">
                {/* AI Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">AI Job Description Generator</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={aiEnabled}
                      onCheckedChange={setAiEnabled}
                    />
                    <span className="text-sm text-gray-600">AI</span>
                  </div>
                </div>

                {aiEnabled && (
                  <>
                    <div className="mb-6 p-4 bg-blue-100 rounded-lg border-l-4 border-blue-600">
                      <p className="text-sm text-blue-800">
                        Generate a professional job description instantly using AI
                      </p>
                    </div>

                    {/* AI Form */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <Input
                          value={aiRole}
                          onChange={(e) => setAiRole(e.target.value)}
                          placeholder="e.g. Backend Developer"
                          className="h-10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Technologies
                        </label>
                        <Input
                          value={aiTechnologies}
                          onChange={(e) => setAiTechnologies(e.target.value)}
                          placeholder="e.g. Node.js, PostgreSQL"
                          className="h-10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience Level
                        </label>
                        <select
                          value={aiExperience}
                          onChange={(e) => setAiExperience(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                        >
                          <option value="">Select experience level</option>
                          <option value="JUNIOR">Junior</option>
                          <option value="MID">Mid-level</option>
                          <option value="SENIOR">Senior</option>
                          <option value="LEAD">Lead</option>
                        </select>
                      </div>

                      <Button
                        onClick={generateAIDescription}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>

                    {/* AI Output */}
                    {aiGeneratedDescription && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Generated Description</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingAi(!isEditingAi)}
                            className="gap-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            {isEditingAi ? 'Done' : 'Edit'}
                          </Button>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <div
                            contentEditable={isEditingAi}
                            suppressContentEditableWarning={true}
                            className={`min-h-[120px] text-sm text-gray-700 whitespace-pre-wrap ${isEditingAi ? 'outline-none border-2 border-blue-500 rounded p-2' : ''
                              }`}
                            onBlur={(e) => {
                              if (isEditingAi) {
                                setAiGeneratedDescription(e.currentTarget.textContent || '');
                              }
                            }}
                          >
                            {aiGeneratedDescription}
                          </div>
                        </div>
                        <Button
                          onClick={insertAIDescription}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Insert into Form
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
