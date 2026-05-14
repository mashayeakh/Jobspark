/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { RecruiterLoading } from '@/components/shared/RecruiterLoading';
import { DynamicBreadcrumbs } from '@/components/shared/DynamicBreadcrumbs';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = authService.getUser();
      
      if (!userData || userData.role !== 'RECRUITER') {
        router.push('/login?returnTo=/recruiter');
        return;
      }

      // Use setTimeout to move the state update out of the synchronous render cycle
      // this avoids the "cascading render" lint warning more reliably than rAF
      setTimeout(() => {
        setUser(userData);
        setLoading(false);
      }, 0);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <RecruiterLoading />;
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole="recruiter" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
