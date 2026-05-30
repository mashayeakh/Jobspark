/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Book, Menu, Sunset, Trees, Zap, Bell, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  Briefcase,
  Users,
  FileText,
  ChevronDown
} from "lucide-react";

import { NotificationModal } from "./NotificationModal";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  rightItems?: MenuItem[];
  isSeparator?: boolean;
}

type NavbarVariant = "default" | "compact" | "minimal";

interface Navbar1Props {
  className?: string;
  variant?: NavbarVariant;
  notificationCount?: number;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "JobSpark Logo",
    title: "JobSpark",
  },
  menu = [
    {
      title: "Overview",
      url: "/",
    },
    {
      title: "Find Jobs",
      url: "/jobs",
      items: [
        { title: "Job Seekers", url: "/jobseekers", description: "Resources for candidates" },
        { title: "Remote Jobs", url: "/remote-jobs", description: "Work from anywhere" },
        { title: "Tech Jobs", url: "/tech-jobs", description: "Engineering & development" },
        { title: "Design Jobs", url: "/design-jobs", description: "UI/UX & product design" },
        { title: "Marketing Jobs", url: "/marketing-jobs", description: "Growth & marketing" },
      ],
      rightItems: [
        { title: "All Categories", url: "/categories" },
        { title: "List of Companies", url: "/companies" },
      ]
    },
    {
      title: "For Companies",
      url: "/hire",
    },
    {
      title: "Connection",
      url: "/connections",
    },
    {
      title: "Blog",
      url: "/resources/blog",
    },
  ],
  auth = {
    login: { title: "Log in", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  variant = "default",
  notificationCount = 0,
  className,
}: Navbar1Props) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status on mount and when storage changes
    const checkAuth = () => {
      try {
        const userData = authService.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  const variantStyles = {
    default: {
      container: cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-blue-50/80 backdrop-blur-lg shadow-sm"
          : "bg-blue-50"
      ),
      nav: "hidden items-center justify-between py-3 lg:flex",
      gap: "gap-3",
      logoSize: "text-xl",
    },
    compact: {
      container: cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-blue-50/80 backdrop-blur-md"
          : "bg-blue-50"
      ),
      nav: "hidden items-center justify-between py-2 lg:flex",
      gap: "gap-2",
      logoSize: "text-lg",
    },
    minimal: {
      container: "sticky top-0 z-50 w-full bg-transparent",
      nav: "hidden items-center justify-between py-2 lg:flex",
      gap: "gap-4",
      logoSize: "text-lg",
    },
  };

  const styles = variantStyles[variant];
  return (
    <section className={cn(styles.container, className)}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Menu */}
        <nav className={styles.nav}>
          <div className="flex items-center w-[250px]">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className={cn("font-bold tracking-tighter text-gray-900", styles.logoSize)}>
                {logo.title}
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-center flex-1">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item, pathname))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className={cn("flex items-center justify-end w-[250px]", styles.gap)}>
            <NotificationModal>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900 rounded-full h-9 w-9">
                <Bell className="size-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600"></span>
                )}
              </Button>
            </NotificationModal>
            {isLoading ? (
              <div className="h-9 w-20 animate-pulse bg-gray-200 rounded-md" />
            ) : !user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            ) : (
              <>
                {/* Post a Job button for recruiters */}
                {user.role === 'RECRUITER' && (
                  <Button asChild variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Link href="/recruiter/post-job" className="flex items-center gap-2">
                      <Plus className="size-4" />
                      Post a Job
                    </Link>
                  </Button>
                )}

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group flex items-center gap-2 outline-none">
                      <div className="relative h-9 w-9 rounded-xl overflow-hidden ring-2 ring-blue-500/10 group-hover:ring-blue-500/30 transition-all duration-300">
                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      </div>
                      <ChevronDown className="size-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 mt-2 rounded-2xl shadow-2xl border-gray-100 bg-white/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 font-sans" align="end">
                    <DropdownMenuLabel className="p-3">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-gray-900">{user.name || 'User'}</p>
                        <p className="text-xs font-medium text-gray-500 truncate">{user.email || 'user@example.com'}</p>
                        <Badge variant="outline" className="w-fit mt-2 text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border-blue-100 px-2 py-0.5">
                          {user.role || 'MEMBER'}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2 bg-gray-50" />

                    <div className="space-y-0.5">
                      {user.role === 'RECRUITER' ? (
                        <>
                          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer group">
                            <Link href="/recruiter/dashboard" className="flex items-center gap-3 w-full">
                              <LayoutDashboard className="size-4 text-gray-400 group-focus:text-blue-600" />
                              <span className="text-sm font-bold">Recruiter Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer group">
                            <Link href="/recruiter/jobs" className="flex items-center gap-3 w-full">
                              <Briefcase className="size-4 text-gray-400 group-focus:text-blue-600" />
                              <span className="text-sm font-bold">My Job Postings</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer group">
                            <Link href="/recruiter/candidates" className="flex items-center gap-3 w-full">
                              <Users className="size-4 text-gray-400 group-focus:text-blue-600" />
                              <span className="text-sm font-bold">Candidates</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer group">
                            <Link href="/dashboard" className="flex items-center gap-3 w-full">
                              <LayoutDashboard className="size-4 text-gray-400 group-focus:text-blue-600" />
                              <span className="text-sm font-bold">Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer group">
                            <Link href="/applications" className="flex items-center gap-3 w-full">
                              <FileText className="size-4 text-gray-400 group-focus:text-blue-600" />
                              <span className="text-sm font-bold">My Applications</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer group">
                        <Link href={user.role === 'RECRUITER' ? "/recruiter/settings" : "/settings"} className="flex items-center gap-3 w-full">
                          <Settings className="size-4 text-gray-400 group-focus:text-blue-600" />
                          <span className="text-sm font-bold">Account Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-gray-50" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl px-3 py-2.5 focus:bg-red-50 text-red-600 focus:text-red-700 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <LogOut className="size-4 text-red-400 group-focus:text-red-600" />
                        <span className="text-sm font-bold">Log out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-bold tracking-tighter text-gray-900">
                {logo.title}
              </span>
            </Link>
            <div className="flex items-center gap-2">

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        <img
                          src={logo.src}
                          className="max-h-8 dark:invert"
                          alt={logo.alt}
                        />
                        <span className="text-lg font-bold">{logo.title}</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item, pathname))}
                    </Accordion>

                    <div className="flex flex-col gap-3">
                      {isLoading ? (
                        <div className="h-10 w-full animate-pulse bg-gray-100 rounded-lg" />
                      ) : !user ? (
                        <>
                          <Button asChild variant="outline" className="w-full rounded-xl h-11">
                            <Link href={auth.login.url}>{auth.login.title}</Link>
                          </Button>
                          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl h-11 shadow-lg shadow-blue-100">
                            <Link href={auth.signup.url}>{auth.signup.title}</Link>
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">{user.name || 'User'}</span>
                              <span className="text-xs text-gray-500 truncate max-w-[180px]">{user.email || 'user@example.com'}</span>
                              <Badge variant="outline" className="w-fit mt-1 text-[9px] font-black uppercase tracking-wider bg-white text-blue-600 border-blue-100 px-2 py-0">
                                {user.role || 'MEMBER'}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            {user.role === 'RECRUITER' ? (
                              <>
                                <Button asChild variant="outline" className="justify-start gap-3 h-11 rounded-xl border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                  <Link href="/recruiter/dashboard">
                                    <LayoutDashboard className="size-4" />
                                    Dashboard
                                  </Link>
                                </Button>
                                <Button asChild variant="outline" className="justify-start gap-3 h-11 rounded-xl border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                  <Link href="/recruiter/jobs">
                                    <Briefcase className="size-4" />
                                    Job Postings
                                  </Link>
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button asChild variant="outline" className="justify-start gap-3 h-11 rounded-xl border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                  <Link href="/dashboard">
                                    <LayoutDashboard className="size-4" />
                                    Dashboard
                                  </Link>
                                </Button>
                                <Button asChild variant="outline" className="justify-start gap-3 h-11 rounded-xl border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                  <Link href="/applications">
                                    <FileText className="size-4" />
                                    Applications
                                  </Link>
                                </Button>
                              </>
                            )}
                            <Button asChild variant="outline" className="justify-start gap-3 h-11 rounded-xl border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all">
                              <Link href={user.role === 'RECRUITER' ? "/recruiter/settings" : "/settings"}>
                                <Settings className="size-4" />
                                Settings
                              </Link>
                            </Button>
                          </div>

                          <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-center gap-2 h-11 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 font-bold transition-all"
                          >
                            <LogOut className="size-4" />
                            Log out
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

const renderMenuItem = (item: MenuItem, pathname: string) => {
  const isActive = item.url === '/' ? pathname === item.url : pathname.startsWith(item.url);

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className={cn(isActive && "font-bold text-blue-600 bg-blue-50/50")}>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground flex">
          <div className="flex flex-col p-2">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title} className="w-80">
                <SubMenuLink item={subItem} pathname={pathname} />
              </NavigationMenuLink>
            ))}
          </div>
          {item.rightItems && (
            <div className="flex flex-col p-2 bg-muted/30 border-l border-muted">
              {item.rightItems.map((subItem) => (
                <NavigationMenuLink asChild key={subItem.title} className="w-56">
                  <SubMenuLink item={subItem} pathname={pathname} />
                </NavigationMenuLink>
              ))}
            </div>
          )}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className={cn(
            "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-white/50 hover:text-accent-foreground",
            isActive && "font-bold text-blue-600 border-b-2 border-blue-600 rounded-none bg-blue-50/30"
          )}
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, pathname: string) => {
  const isActive = item.url === '/' ? pathname === item.url : pathname.startsWith(item.url);

  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className={cn("text-md py-0 font-semibold hover:no-underline", isActive && "text-blue-600")}>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} pathname={pathname} />
          ))}
          {item.rightItems && (
            <div className="mt-2 pt-2 border-t border-muted bg-muted/20">
              {item.rightItems.map((subItem) => (
                <SubMenuLink key={subItem.title} item={subItem} pathname={pathname} />
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className={cn("text-md font-semibold", isActive && "text-blue-600")}>
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item, pathname }: { item: MenuItem, pathname?: string }) => {
  const isActive = pathname && (item.url === '/' ? pathname === item.url : pathname.startsWith(item.url));
  return (
    <Link
      className={cn("flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground", isActive && "bg-muted text-accent-foreground")}
      href={item.url}
    >
      <div className={cn("text-foreground", isActive && "text-blue-600")}>{item.icon}</div>
      <div>
        <div className={cn("text-sm font-semibold", isActive && "text-blue-600")}>{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar };
