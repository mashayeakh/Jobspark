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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Bell, 
  Globe, 
  MessageSquare, 
  Calendar,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Maximize2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
}

export function AdminShell({ children, title }: AdminShellProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
            {/* Search Bar */}
            <div className="relative hidden lg:block w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search everything..." 
                className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 transition-all border-0 ring-1 ring-gray-100"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-bold text-gray-400">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-bold text-gray-400">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Action Icons */}
            <div className="hidden md:flex items-center gap-1 mr-4">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                <Calendar className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                  <Bell className="h-5 w-5" />
                </Button>
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8 hidden md:block opacity-20" />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 px-2 hover:bg-gray-50 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px]">
                      <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center font-bold text-blue-600 overflow-hidden">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || 'Admin'}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Super Admin</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-gray-100 shadow-xl shadow-blue-50">
                <DropdownMenuLabel className="font-bold text-gray-400 text-[10px] uppercase tracking-widest px-2 py-2">Account</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-xl h-10 font-bold focus:bg-blue-50 focus:text-blue-600 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl h-10 font-bold focus:bg-blue-50 focus:text-blue-600 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-gray-50" />
                <DropdownMenuItem 
                  className="rounded-xl h-10 font-bold text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                  onClick={() => authService.logout().then(() => router.push('/login'))}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
