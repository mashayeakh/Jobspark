'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import JobDetailTemplate from '@/components/jobs/JobDetailTemplate';
import { marketingJobs } from '@/components/jobs/data';

export default function MarketingJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = marketingJobs.find((j) => j.id === Number(id));
  if (!job) notFound();
  return <JobDetailTemplate job={job} backPath="/marketing-jobs" backLabel="Marketing Jobs" />;
}
