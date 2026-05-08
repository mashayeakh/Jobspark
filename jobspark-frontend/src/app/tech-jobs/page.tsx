import JobListingTemplate from '@/components/jobs/JobListingTemplate';
import { techJobs } from '@/components/jobs/data';

export default function TechJobsPage() {
  return (
    <JobListingTemplate
      basePath="/tech-jobs"
      heroTag="50K+ tech & engineering jobs"
      heroHeadline="Build what's next:"
      accentColor="text-blue-600"
      groups={[
        { label: 'AI & Machine Learning', viewLabel: 'View all AI/ML jobs', jobs: techJobs.filter(j => j.category === 'AI/ML') },
        { label: 'Engineering & Development', viewLabel: 'View all engineering jobs', jobs: techJobs.filter(j => j.category === 'Engineering') },
        { label: 'Security', viewLabel: 'View all security jobs', jobs: techJobs.filter(j => j.category === 'Security') },
        { label: 'Data & Analytics', viewLabel: 'View all data jobs', jobs: techJobs.filter(j => j.category === 'Data') },
        { label: 'Mobile', viewLabel: 'View all mobile jobs', jobs: techJobs.filter(j => j.category === 'Mobile') },
      ]}
    />
  );
}
