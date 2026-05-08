import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { designJobs } from '@/components/jobs/data';

export default function DesignJobsPage() {
  return (
    <JobListingTemplate
      basePath="/design-jobs"
      heroTag="5K+ UI/UX & product design jobs"
      heroHeadline="Design what matters:"
      accentColor="text-purple-600"
      groups={[
        { label: 'Product Design', viewLabel: 'View all product design jobs', jobs: designJobs.filter(j => j.category === 'Product Design' || j.category === 'UX Design') },
        { label: 'Design Leadership', viewLabel: 'View all design leadership jobs', jobs: designJobs.filter(j => j.category === 'Leadership') },
        { label: 'Brand & Visual Design', viewLabel: 'View all brand jobs', jobs: designJobs.filter(j => j.category === 'Brand Design') },
        { label: 'Design Engineering', viewLabel: 'View all design engineering jobs', jobs: designJobs.filter(j => j.category === 'Design Engineering') },
      ]}
    />
  );
}
