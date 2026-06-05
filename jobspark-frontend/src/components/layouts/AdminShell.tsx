/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { 
  ChevronDown,
  Maximize2
} from "lucide-react"

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
}

export function AdminShell({ children, title }: AdminShellProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const userData = authService.getUser();
    
    // Check if user is authenticated and is admin
    if (!userData || userData.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    
    // Defer state updates to the next tick to avoid "cascading renders" warning
    const timeoutId = setTimeout(() => {
      setUser(userData);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4880FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Initializing JobsPark Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset className="bg-[#F5F6FA] min-h-screen">
        {/* Premium Header */}
        <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b bg-white/70 backdrop-blur-xl sticky top-0 z-30 px-8 transition-all duration-300">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-10 w-10 rounded-xl hover:bg-gray-100 transition-colors" />
            <Separator
              orientation="vertical"
              className="h-6 opacity-20"
            />

          </div>

          <div className="flex items-center gap-3">
            {/* Action Icons */}
            <div className="hidden md:flex items-center gap-1 mr-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={toggleFullScreen}
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>

          </div>
        </header>

        {/* Dynamic Breadcrumbs Area */}
        <div className="px-8 pt-6 pb-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard" className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">ADMIN</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronDown className="h-3 w-3 -rotate-90 text-gray-300" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs font-bold text-blue-600 uppercase tracking-widest">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
