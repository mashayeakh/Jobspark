import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { marketingJobs } from '@/components/jobs/data';

export default function MarketingJobsPage() {
  return (
    <JobListingTemplate
      basePath="/marketing-jobs"
      heroTag="8K+ growth & marketing jobs"
      heroHeadline="Grow what's next:"
      accentColor="text-rose-600"
      groups={[
        { label: 'Marketing Leadership', viewLabel: 'View all leadership jobs', jobs: marketingJobs.filter(j => j.category === 'Leadership') },
        { label: 'Growth Marketing', viewLabel: 'View all growth jobs', jobs: marketingJobs.filter(j => j.category === 'Growth') },
        { label: 'Product Marketing', viewLabel: 'View all product marketing jobs', jobs: marketingJobs.filter(j => j.category === 'Product Marketing') },
        { label: 'Content & Social', viewLabel: 'View all content jobs', jobs: marketingJobs.filter(j => j.category === 'Content' || j.category === 'Social Media') },
      ]}
    />
  );
}
