'use client';

import { useState } from 'react';
import { jobService } from '@/services/jobService';
import { useApi } from '@/hooks/useApi';

export default function JobTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { data: jobsData, loading: jobsLoading, error: jobsError } = useApi(() => jobService.getJobs());

  const testJobFetch = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await jobService.getJobs();
      
      if (response.success && response.data) {
        const jobs = response.data;
        setResult(`✅ Jobs fetched successfully!\n\nFound ${jobs.length} jobs:\n${jobs.map(job => 
          `• ${job.title} at ${job.company.name}\n  - ${job.type} | ${job.locationType}\n  - $${job.salaryMin?.toLocaleString()} - $${job.salaryMax?.toLocaleString()}\n  - Skills: ${job.skills.map(s => s.skill.name).join(', ')}`
        ).join('\n\n')}`);
      } else {
        setResult(`❌ Failed to fetch jobs: ${response.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Job API Test</h2>
      
      <button
        onClick={testJobFetch}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 mr-4"
      >
        {loading ? 'Testing...' : 'Test Job Fetch'}
      </button>
      
      {jobsLoading && (
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-4"></div>
      )}
      
      {jobsError && (
        <div className="text-red-600 ml-4">❌ Auto-fetch failed: {jobsError}</div>
      )}
      
      {jobsData && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <div className="text-green-800 font-semibold">✅ Auto-fetch successful!</div>
          <div className="text-sm text-green-700 mt-1">
            Found {jobsData.length} jobs automatically
          </div>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
