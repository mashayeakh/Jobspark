'use client';

import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { useApi } from '@/hooks/useApi';
import JobDetailTemplate from '@/components/jobs/JobDetailTemplate';

interface JobDetailFetcherProps {
  id: string;
  backPath: string;
  backLabel: string;
}

export default function JobDetailFetcher({ id, backPath, backLabel }: JobDetailFetcherProps) {
  const { data: jobData, loading, error } = useApi(() => jobService.getJob(id), [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The job you're looking for doesn't exist."}</p>
          <Link
            href={backPath}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <JobDetailTemplate
      job={jobData}
      backPath={backPath}
      backLabel={backLabel}
    />
  );  
}
