/* eslint-disable @next/next/no-img-element */
"use client";

import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
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
      ]
    },
    {
      title: "For Companies",
      url: "/hire",
    },
    {
      title: "Discover",
      url: "/",
      items: [
        { title: "Salary Guide", url: "/resources/salary", description: "Market insights" },
        { title: "Career Advice", url: "/resources/career", description: "Expert tips" },
        { title: "Blog", url: "/resources/blog", description: "Industry news" },
      ]
    },
  ],
  auth = {
    login: { title: "Log in", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  return (
    <section className={cn("sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200", className)}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between py-3 lg:flex">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className="text-xl font-bold tracking-tighter text-gray-900">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <a href={auth.login.url}>{auth.login.title}</a>
            </Button>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <a href={auth.signup.url}>{auth.signup.title}</a>
            </Button>
            {/* Profile Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-8 w-8 rounded-full bg-gray-100 p-0">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      U
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-64">
                    <div className="p-4">
                      <div className="border-b pb-3 mb-3">
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-500">john@example.com</p>
                      </div>
                      <div className="space-y-2">
                        <a href="/profile" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">Profile</a>
                        <a href="/settings" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">Settings</a>
                        <a href="/applications" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">My Applications</a>
                        <hr className="my-2" />
                        <a href="/logout" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-red-600">Log out</a>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-bold tracking-tighter text-gray-900">
                {logo.title}
              </span>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img
                        src={logo.src}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                      />
                      <span className="text-lg font-bold">{logo.title}</span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline" className="w-full">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <a href={auth.signup.url}>{auth.signup.title}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
