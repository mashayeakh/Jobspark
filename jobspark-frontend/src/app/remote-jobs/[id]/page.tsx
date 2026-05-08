'use client';

import React, { use } from 'react';
import JobDetailFetcher from '@/components/jobs/JobDetailFetcher';

export default function RemoteJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <JobDetailFetcher
      id={id}
      backPath="/remote-jobs"
      backLabel="Remote Jobs"
    />
  );
}
