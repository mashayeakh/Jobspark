'use client';

import React, { use } from 'react';
import JobDetailFetcher from '@/components/jobs/JobDetailFetcher';

export default function DesignJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <JobDetailFetcher
      id={id}
      backPath="/design-jobs"
      backLabel="Design Jobs"
    />
  );
}
