'use client';

import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { allCategoryJobs } from '@/components/jobs/data';

export default function JobsPage() {
  return (
    <JobListingTemplate
      basePath="/jobs"
      heroTag="Over 130k remote & local startup jobs"
      heroHeadline="Find what's next:"
      accentColor="text-rose-500"
      allJobs={allCategoryJobs}
    />
  );
}
