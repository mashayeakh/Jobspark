'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import JobDetailTemplate from '@/components/jobs/JobDetailTemplate';
import { remoteJobs } from '@/components/jobs/data';

export default function RemoteJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = remoteJobs.find((j) => j.id === Number(id));
  if (!job) notFound();
  return <JobDetailTemplate job={job} backPath="/remote-jobs" backLabel="Remote Jobs" />;
}
