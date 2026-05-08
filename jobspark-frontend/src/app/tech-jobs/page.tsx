import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { techJobs } from '@/components/jobs/data';

export default function TechJobsPage() {
  return (
    <JobListingTemplate
      basePath="/tech-jobs"
      heroTag="50K+ tech & engineering jobs"
      heroHeadline="Build what's next:"
      accentColor="text-blue-600"
      allJobs={techJobs}
    />
  );
}
