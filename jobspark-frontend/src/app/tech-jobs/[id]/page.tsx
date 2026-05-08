'use client';

import React, { use } from 'react';
import JobDetailFetcher from '@/components/jobs/JobDetailFetcher';

export default function TechJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <JobDetailFetcher
      id={id}
      backPath="/tech-jobs"
      backLabel="Tech Jobs"
    />
  );
}
