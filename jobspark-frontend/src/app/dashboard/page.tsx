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
        return <RecruiterDashboard user={user} />;
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
