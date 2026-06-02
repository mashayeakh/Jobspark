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

import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidePublicChrome = pathname === "/signup" || pathname === "/login" || pathname === "/forgot-password" || pathname === "/forgetPassword" || pathname === "/verify-email" || pathname.startsWith("/admin/") || pathname.startsWith("/jobseeker/") || pathname.startsWith("/recruiter/");
  const [notificationCount, setNotificationCount] = useState(4);

  // const { data: session } = authClient.useSession();
  // const hideNavbar = !!session?.user?.role;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased scroll-smooth`} suppressHydrationWarning>
        <div
          className="bg-background text-foreground min-h-full flex flex-col"
        >
          <LoadingBarProvider>
            {!hidePublicChrome && <Navbar variant="default" notificationCount={notificationCount} />}
            {children}
            <Toaster position="top-center" richColors />
          </LoadingBarProvider>
        </div>
      </body>
    </html>
  );
}
