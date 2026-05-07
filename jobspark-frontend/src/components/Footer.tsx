import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border-gray py-20 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-1.5 mb-8 group">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-brand/20">
              <span className="text-white font-black text-xl leading-none">J</span>
            </div>
            <span className="text-[20px] font-black tracking-tight text-black">
              Jobs<span className="text-brand">Park</span>
            </span>
          </Link>
          <p className="text-[#666666] text-[14px] max-w-xs leading-relaxed">
            The #1 place for tech jobs and startups. Join the community and find your next career move at JobsPark.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-[12px] mb-6 uppercase tracking-widest text-black">For Candidates</h4>
          <ul className="space-y-4 text-[14px] text-[#555555]">
            <li><Link href="#" className="hover:text-black">Overview</Link></li>
            <li><Link href="#" className="hover:text-black">Startup Jobs</Link></li>
            <li><Link href="#" className="hover:text-black">Web3 Jobs</Link></li>
            <li><Link href="#" className="hover:text-black">Featured</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[12px] mb-6 uppercase tracking-widest text-black">For Recruiters</h4>
          <ul className="space-y-4 text-[14px] text-[#555555]">
            <li><Link href="#" className="hover:text-black">Overview</Link></li>
            <li><Link href="#" className="hover:text-black">Pricing</Link></li>
            <li><Link href="#" className="hover:text-black">Hire Developers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[12px] mb-6 uppercase tracking-widest text-black">Company</h4>
          <ul className="space-y-4 text-[14px] text-[#555555]">
            <li><Link href="#" className="hover:text-black">About</Link></li>
            <li><Link href="#" className="hover:text-black">Blog</Link></li>
            <li><Link href="#" className="hover:text-black">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[12px] mb-6 uppercase tracking-widest text-black">Resources</h4>
          <ul className="space-y-4 text-[14px] text-[#555555]">
            <li><Link href="#" className="hover:text-black">Help Center</Link></li>
            <li><Link href="#" className="hover:text-black">Community</Link></li>
            <li><Link href="#" className="hover:text-black">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-[#999999]">
        <p>© 2026 JobsPark. All rights reserved.</p>
        <div className="flex gap-10">
          <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-black transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
