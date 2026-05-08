'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { useApi } from '@/hooks/useApi';
import JobDetailTemplate from '@/components/jobs/JobDetailTemplate';
import { getJobById } from '@/components/jobs/data';

interface JobDetailFetcherProps {
  id: string;
  backPath: string;
  backLabel: string;
}

export default function JobDetailFetcher({ id, backPath, backLabel }: JobDetailFetcherProps) {
  const { data: jobData, loading, error } = useApi(() => jobService.getJob(id), [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !jobData) {
    // Try to fall back to static data if API fails (for demo purposes)
    const staticJob = getJobById(Number(id));
    if (!staticJob) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The job you're looking for doesn't exist."}</p>
            <Link
              href={backPath}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to {backLabel}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <JobDetailTemplate
        job={staticJob}
        backPath={backPath}
        backLabel={backLabel}
      />
    );
  }

  // Transform API data to match component format
  const job = {
    id: jobData.id,
    title: jobData.title,
    company: jobData.company.name,
    logo: jobData.company.logo || null,
    workStyle: jobData.locationType === 'REMOTE' ? 'Remote' : jobData.locationType === 'HYBRID' ? 'Hybrid' : 'Onsite',
    location: jobData.location,
    salary: jobData.salaryMin && jobData.salaryMax ? `$${(jobData.salaryMin / 1000).toFixed(0)}k – $${(jobData.salaryMax / 1000).toFixed(0)}k` : 'Salary not disclosed',
    equity: undefined,
    posted: 'today',
    category: jobData.category?.name || 'General',
    type: jobData.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
    experience: jobData.experienceLevel.charAt(0).toUpperCase() + jobData.experienceLevel.slice(1).toLowerCase(),
    description: jobData.description,
    requirements: jobData.requirements ? jobData.requirements.split('.').map((r: string) => r.trim()).filter((r: string) => r) : jobData.skills.filter(s => s.isRequired).map(s => s.skill.name),
    responsibilities: jobData.responsibilities ? jobData.responsibilities.split(';').map((r: string) => r.trim()).filter((r: string) => r) : [],
    benefits: jobData.benefits ? jobData.benefits.split(';').map((b: string) => b.trim()).filter((b: string) => b) : [],
    vacancy: jobData.vacancy || 1,
    skills: jobData.skills.map(s => s.skill.name),
    aboutCompany: jobData.company.description || jobData.company.name,
  };

  return (
    <JobDetailTemplate
      job={job}
      backPath={backPath}
      backLabel={backLabel}
    />
  );
}
