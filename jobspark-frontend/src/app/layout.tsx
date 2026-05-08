// app/layout.tsx
"use client"; // needed for useSession

import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Navbar } from "@/components/navbar1";

// import { Navbar } from "@/src/components/layout/navbar";


const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidePublicChrome = pathname === "/login" || pathname === "/signup" || pathname === "/forgetPassword" || pathname === "/verify-email";

  // const { data: session } = authClient.useSession();
  // const hideNavbar = !!session?.user?.role;

  return (
    <html lang="en">
      <body className="scroll-smooth">
        <div
          className={`${plusJakartaSans.variable} ${fraunces.variable} font-sans antialiased bg-background text-foreground min-h-full flex flex-col`}
        >
          {!hidePublicChrome && <Navbar />}
          {children}
        </div>
      </body>
    </html>
  );
}
