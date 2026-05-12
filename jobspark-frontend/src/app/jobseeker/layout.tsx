'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { authService } from '@/services/authService';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export default function JobSeekerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userReady, setUserReady] = useState(false);

    useEffect(() => {
        if (pathname === '/jobseeker') {
            setUserReady(true);
            return;
        }

        const userData = authService.getUser();
        if (!userData || userData.role !== 'JOB_SEEKER') {
            router.push('/login');
            return;
        }

        setUserReady(true);
    }, [pathname, router]);

    if (!userReady) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-base font-medium text-gray-600">Loading your job seeker workspace...</div>
            </div>
        );
    }

    if (pathname === '/jobseeker') {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <AppSidebar userRole="jobseeker" />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
                    <div className="text-sm font-semibold text-slate-700">Job Seeker Portal</div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
