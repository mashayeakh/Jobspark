import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-[80px] bg-white border-b border-[#F3F4F6]">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-1.5 group shrink-0">
        <div className="relative w-8 h-8 bg-brand rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-brand/20">
          <span className="text-white font-black text-xl leading-none">J</span>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black rounded-full border-2 border-white" />
        </div>
        <span className="text-[22px] font-black tracking-tight text-black">
          Jobs<span className="text-brand">Park</span>
        </span>
      </Link>
      
      {/* Center: Navigation */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
        <Link href="/discover" className="text-[14px] font-semibold text-[#555555] hover:text-black transition-colors">
          Discover
        </Link>
        <Link href="/jobs" className="text-[14px] font-semibold text-[#555555] hover:text-black transition-colors">
          Job Seekers
        </Link>
        <Link href="/hiring" className="text-[14px] font-semibold text-[#555555] hover:text-black transition-colors">
          Companies
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="outline" asChild className="px-5 h-10 text-[14px] font-bold text-black rounded-[10px] border-[#E5E5E5] hover:bg-gray-50 transition-colors">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild className="px-6 h-10 text-[14px] font-bold text-white bg-[#0A0B0C] rounded-[10px] hover:bg-black/90 transition-all">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;