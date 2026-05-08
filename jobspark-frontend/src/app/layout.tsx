// app/layout.tsx
"use client"; // needed for useSession

import { Inter, Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Navbar } from "@/components/navbar1";
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
  const hidePublicChrome = pathname === "/signup" || pathname === "/forgetPassword" || pathname === "/verify-email";

  // const { data: session } = authClient.useSession();
  // const hideNavbar = !!session?.user?.role;

  return (
    <html lang="en">
      <body className="scroll-smooth">
        <div
          className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground min-h-full flex flex-col`}
        >
          {!hidePublicChrome && <Navbar />}
          {children}
        </div>
      </body>
    </html>
  );
}
