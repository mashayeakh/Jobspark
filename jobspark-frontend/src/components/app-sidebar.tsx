import React from 'react';
import { authService } from '@/services/authService';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  FileText,
  LogOut,
  User,
  Building,
  BarChart3,
  Shield,
  Zap,
  Activity,
  Bot,
  BrainCircuit,
  Lock,
  Calendar,
  Plus,
  ChevronRight,
  BookText,
  CreditCard,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: string;
}

const getNavigationData = (userRole: string) => {
  switch (userRole) {
    case 'admin':
      return [
        {
          label: "Dashboard",
          items: [
            { title: "Overview", url: "/admin/dashboard", icon: LayoutDashboard },
          ]
        },
        {
          label: "AI Intelligence",
          items: [
            { title: "Fraud Shield", url: "/admin/fraud-shield", icon: Shield, badge: "AI" },
            { title: "Market Intel", url: "/admin/market-intelligence", icon: BrainCircuit },
            { title: "Content Sanity", url: "/admin/content-sanity", icon: Lock },
            { title: "Churn Predictor", url: "/admin/churn-predictor", icon: Zap },
            { title: "Anomaly Detection", url: "/admin/anomaly-detection", icon: Activity },
          ]
        },
        {
          label: "Management",
          items: [
            { title: "Users", url: "/admin/users", icon: Users },
            { title: "Job Moderation", url: "/admin/job-moderation", icon: Briefcase },
            { title: "Blogs", url: "/admin/blogs", icon: BookText },
            { title: "Taxonomy", url: "/admin/taxonomy", icon: FileText },
            { title: "Payments", url: "/admin/payments", icon: CreditCard },
            { title: "Platform Settings", url: "/admin/settings", icon: Settings },
          ]
        }
      ];
    case 'jobseeker':
      return [
        {
          label: "General",
          items: [
            { title: "Dashboard", url: "/jobseeker/dashboard", icon: LayoutDashboard },
            { title: "My Profile", url: "/jobseeker/profile", icon: User },
            { title: "My Network", url: "/jobseeker/network", icon: Users },
            { title: "Profile Analysis", url: "/jobseeker/profile-score", icon: Activity, badge: "New" },
            { title: "AI Resume Optimizer", url: "/jobseeker/resume-analyzer", icon: Zap, badge: "AI" },
            { title: "Applications", url: "/jobseeker/applications", icon: FileText },
            { title: "Saved Jobs", url: "/jobseeker/saved-jobs", icon: Briefcase },
            { title: "My Reviews", url: "/jobseeker/reviews", icon: BookText },
            { title: "Settings", url: "/jobseeker/settings", icon: Settings },
          ]
        }
      ];
    case 'recruiter':
      return [
        {
          label: "General",
          items: [
            { title: "Dashboard", url: "/recruiter/dashboard", icon: LayoutDashboard },
            { title: "Company Profile", url: "/recruiter/company", icon: Building },
            { title: "Job Postings", url: "/recruiter/jobs", icon: Briefcase },
            { title: "Candidates", url: "/recruiter/candidates", icon: Users },
            { title: "Analytics", url: "/recruiter/analytics", icon: BarChart3 },
            { title: "Subscription", url: "/recruiter/subscription", icon: CreditCard },
            { title: "Settings", url: "/recruiter/settings", icon: Settings },
          ]
        },
        {
          label: "HIRING PIPELINE",
          items: [
            { title: "Kanban board", url: "/recruiter/kanban-board", icon: LayoutDashboard },
            { title: "Pipeline stages", url: "/recruiter/pipeline-stages", icon: Building },
            { title: "Task Management", url: "/recruiter/task-management", icon: Briefcase },
          ]
        },
        {
          label: "Interview",
          items: [
            { title: "Manage Interviews", url: "/recruiter/manage-interviews", icon: Calendar },
          ]
        },
        {
          label: "AI TOOLS",
          items: [
            { title: "Job Description Generator", url: "/recruiter/jd-generator", icon: Calendar },
            { title: "Interview Question Generator", url: "/recruiter/interview-question-generator", icon: Calendar },
          ]
        },
      ];
    default:
      return [];
  }
};

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userData = authService.getUser();
    const timeoutId = setTimeout(() => {
      setUser(userData);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const groups = getNavigationData(userRole || '');

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if backend fails, but at least we tried
      router.push('/login');
    }
  };
  return (
    <Sidebar className="border-r-0 !bg-[#313ee7] !text-white [&_[data-sidebar=sidebar]]:!bg-[#313ee7] [&_[data-sidebar=sidebar]]:!text-white" {...props}>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#313ee7] shadow-sm">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Jobs<span className="text-white/80">Park</span></h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{user?.role} Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {/* <div className="px-2 pb-4">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white border border-white/10 shadow-inner">
            <Search className="h-4 w-4 opacity-70" />
            <input type="text" placeholder="Searcdddh" className="bg-transparent text-sm outline-none placeholder:text-white/50 w-full" />
          </div>
        </div> */}

        {groups.map((group, idx) => (
          <Collapsible key={idx} defaultOpen className="group/collapsible">
            <SidebarGroup className="py-1">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer">
                  {group.label}
                  <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = pathname === item.url;
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <Link
                            href={item.url}
                            className={cn(
                              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 mt-1",
                              isActive
                                ? "bg-white/20 text-white shadow-sm font-semibold"
                                : "text-white/70 hover:bg-white/10 hover:text-white font-medium"
                            )}
                          >
                            <Icon className={cn(
                              "h-5 w-5 transition-colors",
                              isActive ? "text-white" : "text-white/70 group-hover:text-white"
                            )} />
                            <span className="flex-1 whitespace-nowrap">{item.title}</span>
                            {item.badge && (
                              <span className={cn(
                                "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter",
                                isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/90"
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 border-white/20 shadow-sm">
            <div className="flex h-full w-full items-center justify-center bg-white text-[#313ee7] font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold text-white leading-none mb-1">{user?.name || 'Administrator'}</p>
            <p className="truncate text-[10px] font-bold uppercase text-white/60 leading-none">{userRole || 'Admin'}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-white/50 hover:text-white hover:bg-white/20 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
