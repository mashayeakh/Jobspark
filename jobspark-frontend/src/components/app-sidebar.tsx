import React from 'react';
import { authService } from '@/services/authService';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
  ChevronRight
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
            { title: "Financials", url: "/admin/financials", icon: BarChart3 },
          ]
        },
        {
          label: "AI Intelligence",
          items: [
            { title: "Fraud Shield", url: "/admin/fraud-shield", icon: Shield, badge: "AI" },
            { title: "Market Intel", url: "/admin/market-intelligence", icon: BrainCircuit },
            { title: "Content Sanity", url: "/admin/content-sanity", icon: Lock },
            { title: "Churn Predictor", url: "/admin/churn-predictor", icon: Zap },
            { title: "Support Agent", url: "/admin/support-agent", icon: Bot },
            { title: "Anomaly Detection", url: "/admin/anomaly-detection", icon: Activity },
          ]
        },
        {
          label: "Management",
          items: [
            { title: "Users", url: "/admin/users", icon: Users },
            { title: "Job Moderation", url: "/admin/job-moderation", icon: Briefcase },
            { title: "Taxonomy", url: "/admin/taxonomy", icon: FileText },
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
            { title: "Applications", url: "/jobseeker/applications", icon: FileText },
            { title: "Saved Jobs", url: "/jobseeker/saved-jobs", icon: Briefcase },
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
            { title: "Settings", url: "/recruiter/settings", icon: Settings },
          ]
        },
        {
          label: "Interview",
          items: [
            { title: "Manage Interviews", url: "/recruiter/manage-interviews", icon: Calendar },
          ]
        }
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

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <Sidebar className="border-r border-gray-100 bg-white" {...props}>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4880FF] text-white shadow-lg shadow-blue-200">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Jobs<span className="text-[#4880FF]">Park</span></h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {groups.map((group, idx) => (
          <SidebarGroup key={idx} className="py-2">
            <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {group.label}
            </SidebarGroupLabel>
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
                          "group relative flex items-center gap-3 rounded-xl px-3 py-6 transition-all duration-200",
                          isActive
                            ? "bg-[#4880FF] text-white shadow-md shadow-blue-100 hover:bg-[#3d72eb] hover:text-white"
                            : "text-gray-500 hover:bg-gray-50 hover:text-[#4880FF]"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-white" : "text-gray-400 group-hover:text-[#4880FF]"
                        )} />
                        <span className="flex-1 font-bold whitespace-nowrap">{item.title}</span>
                        {item.badge && (
                          <span className={cn(
                            "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter",
                            isActive ? "bg-white/20 text-white" : "bg-blue-50 text-[#4880FF]"
                          )}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        )}
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3 transition-all hover:bg-gray-100/50">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-sm ring-2 ring-blue-50">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold text-gray-900 leading-none mb-1">{user?.name || 'Administrator'}</p>
            <p className="truncate text-[10px] font-bold uppercase text-gray-400 leading-none">{userRole || 'Admin'}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
