import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { remoteJobs } from '@/components/jobs/data';

export default function RemoteJobsPage() {
  return (
    <JobListingTemplate
      basePath="/remote-jobs"
      heroTag="10K+ Remote startup jobs worldwide"
      heroHeadline="Work from anywhere:"
      accentColor="text-green-600"
      allJobs={remoteJobs}
    />
  );
}
