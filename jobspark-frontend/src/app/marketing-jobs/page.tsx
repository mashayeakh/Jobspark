import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { marketingJobs } from '@/components/jobs/data';

export default function MarketingJobsPage() {
  return (
    <JobListingTemplate
      basePath="/marketing-jobs"
      heroTag="8K+ growth & marketing jobs"
      heroHeadline="Grow what's next:"
      accentColor="text-rose-600"
      allJobs={marketingJobs}
    />
  );
}
