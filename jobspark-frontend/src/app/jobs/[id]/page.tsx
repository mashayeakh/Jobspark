'use client';

import React, { use } from 'react';
import JobDetailFetcher from '@/components/jobs/JobDetailFetcher';

const JobDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <JobDetailFetcher
      id={id}
      backPath="/jobs"
      backLabel="All Jobs"
    />
  );
};

export default JobDetailsPage;
