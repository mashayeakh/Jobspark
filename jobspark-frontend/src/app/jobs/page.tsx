/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { jobService, Job, Meta } from '@/services/jobService';
import { categoryService } from '@/services/categoryService';

const ITEMS_PER_PAGE = 10;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // ── Filter state (lifted here so we can send them to the server) ──────────
  const [titleSearch, setTitleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [workStyle, setWorkStyle] = useState('All');
  const [minSalary, setMinSalary] = useState(0);

  // Load active categories from backend
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      const res = await categoryService.getActiveCategories();
      if (res.success && res.data && isMounted) {
        setCategories(res.data);
      }
    };
    loadCategories();
    return () => { isMounted = false; };
  }, []);

  const fetchJobs = useCallback(async (
    page: number,
    title: string,
    location: string,
    category: string,
    ws: string,
    salary: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Build server-side filter params
      const params: Record<string, any> = { page, limit: ITEMS_PER_PAGE };

      // Text search (title / keyword)
      if (title) params.searchTerm = title;
      if (location) params.location = location;

      // Category filter using ID
      if (category !== 'All') {
        params.categoryId = category;
      }

      // Work style / location type
      if (ws === 'Remote') params.locationType = 'REMOTE';
      else if (ws === 'Hybrid') params.locationType = 'HYBRID';
      else if (ws === 'Onsite') params.locationType = 'ONSITE';

      // Salary
      if (salary > 0) params.minSalary = salary;

      const response = await jobService.getJobs(params);
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

  // Re-fetch whenever any filter or page changes
  useEffect(() => {
    const id = setTimeout(() => {
      fetchJobs(currentPage, titleSearch, locationSearch, activeCategory, workStyle, minSalary);
    }, 300); // 300 ms debounce for typing
    return () => clearTimeout(id);
  }, [fetchJobs, currentPage, titleSearch, locationSearch, activeCategory, workStyle, minSalary]);

  // Reset to page 1 whenever a filter changes (not page itself)
  const handleFilterChange = (setter: (v: any) => void, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

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
      allJobs={transformedJobs}
      loading={loading}
      error={error}
      meta={meta}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      // Pass filter state down so template controls are in sync
      titleSearch={titleSearch}
      locationSearch={locationSearch}
      activeCategory={activeCategory}
      workStyle={workStyle}
      minSalary={minSalary}
      onTitleSearchChange={(v) => handleFilterChange(setTitleSearch, v)}
      onLocationSearchChange={(v) => handleFilterChange(setLocationSearch, v)}
      onActiveCategoryChange={(v) => handleFilterChange(setActiveCategory, v)}
      onWorkStyleChange={(v) => handleFilterChange(setWorkStyle, v)}
      onMinSalaryChange={(v) => handleFilterChange(setMinSalary, v)}
      categories={categories}
    />
  );
}
