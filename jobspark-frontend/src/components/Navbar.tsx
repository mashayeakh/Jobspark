import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-[80px] bg-white/80 backdrop-blur-md border-b border-border-gray/50">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="relative w-8 h-8 bg-brand rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-brand/20">
            <span className="text-white font-black text-xl leading-none">J</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black rounded-full border-2 border-white" />
          </div>
          <span className="text-[22px] font-black tracking-tight text-black">
            Jobs<span className="text-brand">Park</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/discover" className="text-[14px] font-semibold text-[#555555] hover:text-black transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand after:transition-all hover:after:w-full">
            Discover
          </Link>
          <Link href="/jobs" className="text-[14px] font-semibold text-[#555555] hover:text-black transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand after:transition-all hover:after:w-full">
            For job seekers
          </Link>
          <Link href="/hiring" className="text-[14px] font-semibold text-[#555555] hover:text-black transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand after:transition-all hover:after:w-full">
            For companies
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild className="text-[14px] font-bold text-[#333333] hover:bg-gray-50/50">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild className="px-7 h-11 text-[14px] font-black text-white bg-black rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
