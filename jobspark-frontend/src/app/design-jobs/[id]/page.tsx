'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import JobDetailTemplate from '@/components/jobs/JobDetailTemplate';
import { designJobs } from '@/components/jobs/data';

export default function DesignJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = designJobs.find((j) => j.id === Number(id));
  if (!job) notFound();
  return <JobDetailTemplate job={job} backPath="/design-jobs" backLabel="Design Jobs" />;
}
