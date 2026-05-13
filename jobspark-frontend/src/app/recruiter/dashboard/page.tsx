/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { authService } from '@/services/authService';
import { RecruiterDashboard } from '@/components/dashboards/RecruiterDashboard';
import { recruiterService, RecruiterDashboardData } from '@/services/recruiterService';
import { useRouter } from 'next/navigation';

const defaultDashboardData: RecruiterDashboardData = {
  stats: {
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
    interviewsScheduled: 0,
    offersMade: 0,
    timeToHire: 0,
    costPerHire: 0,
    qualityOfHire: 0,
  },
  pipeline: [
    { stage: 'Applied', count: 0 },
    { stage: 'Screening', count: 0 },
    { stage: 'Interview', count: 0 },
    { stage: 'Offer', count: 0 },
    { stage: 'Hired', count: 0 },
  ],
  totalPipeline: 0,
  recentJobs: [],
  recentApplications: [],
  monthlyActivity: [],
};

export default function RecruiterDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<RecruiterDashboardData>(defaultDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = authService.getUser();

    if (!userData || userData.role !== 'RECRUITER') {
      router.push('/login');
      return;
    }

    const timer = setTimeout(() => {
      setUser(userData);
    }, 0);

    recruiterService.getDashboard()
      .then((response) => {
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError(response.error || 'Failed to load dashboard data');
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'An error occurred');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading recruiter dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/recruiter">Recruiter</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <RecruiterDashboard data={dashboardData} />
      </div>
    </div>
  )
}
