'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import JobDetailTemplate from '@/components/jobs/JobDetailTemplate';
import { techJobs } from '@/components/jobs/data';

export default function TechJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = techJobs.find((j) => j.id === Number(id));
  if (!job) notFound();
  return <JobDetailTemplate job={job} backPath="/tech-jobs" backLabel="Tech Jobs" />;
}
