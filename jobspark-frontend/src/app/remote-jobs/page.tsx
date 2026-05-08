import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { remoteJobs } from '@/components/jobs/data';

export default function RemoteJobsPage() {
  return (
    <JobListingTemplate
      basePath="/remote-jobs"
      heroTag="10K+ Remote startup jobs worldwide"
      heroHeadline="Work from anywhere:"
      accentColor="text-green-600"
      groups={[
        { label: 'Remote Engineering Jobs', viewLabel: 'View all remote engineering jobs', jobs: remoteJobs.filter(j => j.category === 'Engineering') },
        { label: 'Remote Product Jobs', viewLabel: 'View all remote product jobs', jobs: remoteJobs.filter(j => j.category === 'Product') },
        { label: 'All Remote Jobs', viewLabel: 'View all remote jobs', jobs: remoteJobs },
      ]}
    />
  );
}
