import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { designJobs } from '@/components/jobs/data';

export default function DesignJobsPage() {
  return (
    <JobListingTemplate
      basePath="/design-jobs"
      heroTag="5K+ UI/UX & product design jobs"
      heroHeadline="Design what matters:"
      accentColor="text-purple-600"
      allJobs={designJobs}
    />
  );
}
