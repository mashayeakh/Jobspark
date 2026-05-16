'use client';

import { useState, useEffect, useCallback } from 'react';
import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { jobService, Job, Meta } from '@/services/jobService';

const ITEMS_PER_PAGE = 10;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobService.getJobs({ page, limit: ITEMS_PER_PAGE });
      if (response.success && response.data) {
        setJobs(response.data.jobs);
        setMeta(response.data.meta ?? null);
      } else {
        setError(response.error || 'Failed to fetch jobs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => fetchJobs(currentPage), 0);
    return () => clearTimeout(id);
  }, [fetchJobs, currentPage]);

  // Transform API data to match component format
  const transformedJobs = jobs.map(job => ({
    ...job,
    company: job.company,
    workStyle: job.locationType === 'REMOTE' ? 'Remote' : job.locationType === 'HYBRID' ? 'Hybrid' : 'Onsite',
    salary: job.salaryMin && job.salaryMax
      ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
      : 'Salary not disclosed',
    posted: 'today',
    category: job.category?.name || 'General',
    type: job.type.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
    experience: job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1).toLowerCase(),
    requirements: job.requirements
      ? job.requirements.split('.').map((r: string) => r.trim()).filter(Boolean)
      : job.skills.filter(s => s.isRequired).map(s => s.skill.name),
    responsibilities: job.responsibilities
      ? job.responsibilities.split(';').map((r: string) => r.trim()).filter(Boolean)
      : [],
    benefits: job.benefits
      ? job.benefits.split(';').map((b: string) => b.trim()).filter(Boolean)
      : [],
    vacancy: job.vacancy || 1,
    skills: job.skills.map(s => s.skill.name),
    deadline: job.applicationDeadline,
    aboutCompany: job.company.description || job.company.name,
  }));

  return (
    <JobListingTemplate
      basePath="/jobs"
      heroTag="Over 130k remote & local startup jobs"
      heroHeadline="Find what's next:"
      accentColor="text-rose-500"
      allJobs={transformedJobs}
      loading={loading}
      error={error}
      meta={meta}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}
