'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { JobSeekerDashboard } from '@/components/dashboards/JobSeekerDashboard';
import { useRouter } from 'next/navigation';

export default function JobSeekerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = authService.getUser();

    // Check if user is authenticated and is job seeker
    if (!userData || userData.role !== 'JOB_SEEKER') {
      router.push('/login');
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading job seeker dashboard...</div>
      </div>
    );
  }

  return <JobSeekerDashboard user={user} />;
}
