// app/layout.tsx
"use client"; // needed for useSession

import { useState, useEffect } from "react";
import { Inter, Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Navbar } from "@/components/navbar1";
import { LoadingBarProvider } from "@/components/providers/LoadingBarProvider";
// import LenisProvider from "@/components/providers/LenisProvider";

// import { Navbar } from "@/src/components/layout/navbar";


const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidePublicChrome = pathname === "/signup" || pathname === "/login" || pathname === "/forgetPassword" || pathname === "/verify-email" || pathname.startsWith("/admin/") || pathname.startsWith("/jobseeker/") || pathname.startsWith("/recruiter/");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Simulating fetching unread notifications count
    // In a real app, this would fetch from your API
    const unreadCount = 4; // Example: 4 unread notifications
    setNotificationCount(unreadCount);
  }, []);

  // const { data: session } = authClient.useSession();
  // const hideNavbar = !!session?.user?.role;

  return (
    <html lang="en">
      <body className="scroll-smooth">
        <div
          className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground min-h-full flex flex-col`}
        >
          <LoadingBarProvider>
            {!hidePublicChrome && <Navbar variant="default" notificationCount={notificationCount} />}
            {children}
          </LoadingBarProvider>
        </div>
      </body>
    </html>
  );
}
