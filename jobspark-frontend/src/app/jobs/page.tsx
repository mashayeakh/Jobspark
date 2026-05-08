'use client';

import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { jobService } from '@/services/jobService';
import { useApi } from '@/hooks/useApi';

export default function JobsPage() {
  const { data: jobsData, loading, error } = useApi(() => jobService.getJobs());

  // Transform API data to match component format
  const transformedJobs = jobsData?.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company.name,
    logo: job.company.logo || null,
    workStyle: job.locationType === 'REMOTE' ? 'Remote' : job.locationType === 'HYBRID' ? 'Hybrid' : 'Onsite',
    location: job.location,
    salary: job.salaryMin && job.salaryMax ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k` : 'Salary not disclosed',
    equity: undefined,
    posted: 'today', // Could calculate from job.createdAt
    category: job.category?.name || 'General',
    type: job.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
    experience: job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1).toLowerCase(),
    description: job.description,
    requirements: job.requirements ? job.requirements.split('.').map(r => r.trim()).filter(r => r) : job.skills.filter(skill => skill.isRequired).map(skill => skill.skill.name),
    responsibilities: job.responsibilities ? job.responsibilities.split(';').map(r => r.trim()).filter(r => r) : [], // Parse from API response
    benefits: job.benefits ? job.benefits.split(';').map(b => b.trim()).filter(b => b) : [], // Parse from API response
    vacancy: job.vacancy || 1,
    skills: job.skills.map(skill => skill.skill.name),
    aboutCompany: job.company.description || job.company.name,
  })) || [];

  return (
    <JobListingTemplate
      basePath="/jobs"
      heroTag="Over 130k remote & local startup jobs"
      heroHeadline="Find what's next:"
      accentColor="text-rose-500"
      allJobs={transformedJobs}
      loading={loading}
      error={error}
    />
  );
}
