'use client';

import { ArrowUp } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">JobSpark</p>
            <p className="max-w-sm text-sm text-slate-300">A modern job marketplace with trusted employers, fast hiring, and responsive support.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Product</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/jobs" className="hover:text-white">Jobs</Link></li>
              <li><Link href="/hire" className="hover:text-white">Hire</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Resources</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
              <li><Link href="/press" className="hover:text-white">Press</Link></li>
              <li><Link href="mailto:islammasayekh@gmail.com" className="hover:text-white">Email us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">© 2024 JobSpark. All rights reserved.</p>
            <ul className="flex flex-wrap gap-4 text-sm font-semibold text-slate-400">
              <li><Link href="https://twitter.com/jobspark" target="_blank" rel="noreferrer" className="hover:text-white">X</Link></li>
              <li><Link href="https://linkedin.com/company/jobspark" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</Link></li>
              <li><Link href="https://youtube.com/jobspark" target="_blank" rel="noreferrer" className="hover:text-white">YouTube</Link></li>
            </ul>  <button onClick={scrollToTop} className="rounded-xl bg-slate-800 px-3 py-2 text-slate-300 hover:bg-slate-700">Top</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
