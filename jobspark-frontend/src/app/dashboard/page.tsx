'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { authService } from '@/services/authService';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { JobSeekerDashboard } from '@/components/dashboards/JobSeekerDashboard';
import { RecruiterDashboard } from '@/components/dashboards/RecruiterDashboard';

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard user={user} />;
      case 'JOB_SEEKER':
        return <JobSeekerDashboard user={user} />;
      case 'RECRUITER':
        const recruiterData = {
          stats: {
            activeJobs: 5,
            totalApplications: 23,
            totalViews: 1450,
            interviewsScheduled: 8,
            offersMade: 3,
            timeToHire: 21,
            costPerHire: 4500,
            qualityOfHire: 85
          },
          pipeline: [
            { stage: 'Applied', count: 23 },
            { stage: 'Screening', count: 15 },
            { stage: 'Interview', count: 8 },
            { stage: 'Offer', count: 3 },
            { stage: 'Hired', count: 2 }
          ],
          totalPipeline: 23,
          recentJobs: [
            {
              id: '1',
              title: 'Senior Frontend Developer',
              status: 'ACTIVE',
              applications: 12,
              views: 450,
              posted: '2024-01-10',
              expires: '2024-02-10',
              type: 'FULL_TIME',
              location: 'San Francisco, CA'
            },
            {
              id: '2',
              title: 'React Developer',
              status: 'DRAFT',
              applications: 0,
              views: 0,
              posted: '2024-01-15',
              expires: '2024-02-15',
              type: 'FULL_TIME',
              location: 'Remote'
            }
          ],
          recentApplications: [
            {
              id: '1',
              candidateName: 'John Doe',
              jobTitle: 'Senior Frontend Developer',
              status: 'REVIEWING',
              applied: '2024-01-14',
              experience: '5 years',
              location: 'San Francisco, CA',
              match: 92
            },
            {
              id: '2',
              candidateName: 'Jane Smith',
              jobTitle: 'Senior Frontend Developer',
              status: 'INTERVIEWING',
              applied: '2024-01-13',
              experience: '3 years',
              location: 'Remote',
              match: 85
            }
          ]
        };
        return <RecruiterDashboard data={recruiterData} />;
      default:
        return <div className="p-8 text-center">Invalid user role</div>;
    }
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Admin Dashboard';
      case 'JOB_SEEKER':
        return 'Job Seeker Dashboard';
      case 'RECRUITER':
        return 'Recruiter Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getDashboardTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {getDashboardComponent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
