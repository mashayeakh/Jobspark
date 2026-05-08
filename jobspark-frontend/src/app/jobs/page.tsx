'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, MapPin, Bookmark, BookmarkCheck } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  workStyle: string;   // e.g. "Remote only", "In office", "Onsite or remote"
  location: string;
  salary: string;
  equity?: string;
  posted: string;
  category: string;
}

const jobs: Job[] = [
  // Product
  {
    id: 1,
    title: 'Product Manager - DroneStack',
    company: 'Applied Intuition',
    logo: 'https://logo.clearbit.com/appliedintuition.com',
    workStyle: 'In office',
    location: 'Sunnyvale',
    salary: '$150k – $220k',
    posted: 'today',
    category: 'Product',
  },
  {
    id: 2,
    title: 'Founding Product Manager',
    company: 'Thoughtly',
    logo: 'https://logo.clearbit.com/thought.ly',
    workStyle: 'In office',
    location: 'New York City',
    salary: '$150k – $190k',
    equity: '0.1% – 0.2%',
    posted: 'yesterday',
    category: 'Product',
  },
  {
    id: 3,
    title: 'Product Manager: E-Commerce & CRO',
    company: 'Cubios Inc.',
    logo: 'https://logo.clearbit.com/cubios.com',
    workStyle: 'Remote only',
    location: 'Everywhere',
    salary: '$50k – $60k',
    equity: 'No equity',
    posted: 'yesterday',
    category: 'Product',
  },
  {
    id: 4,
    title: 'Principal Product Manager',
    company: 'Textla',
    logo: 'https://logo.clearbit.com/textla.com',
    workStyle: 'Onsite or remote',
    location: 'San Francisco',
    salary: '$225k – $275k',
    equity: '0.1% – 0.3%',
    posted: 'yesterday',
    category: 'Product',
  },
  {
    id: 5,
    title: 'Senior Product Manager, Content Moderation',
    company: 'Bazaarvoice',
    logo: 'https://logo.clearbit.com/bazaarvoice.com',
    workStyle: 'Remote',
    location: 'Austin',
    salary: '$100k – $100k',
    posted: 'yesterday',
    category: 'Product',
  },
  // Engineering
  {
    id: 6,
    title: 'Software Development & Customer Success (AI-Coder Friendly)',
    company: 'RSVP Social',
    logo: 'https://logo.clearbit.com/rsvpsocial.com',
    workStyle: 'Remote only',
    location: 'Boston, Massachusetts',
    salary: '$70k – $80k',
    equity: '25.0% – 40.0%',
    posted: 'today',
    category: 'Engineering',
  },
  {
    id: 7,
    title: 'Senior React Native Engineer - Consumer',
    company: 'Posh',
    logo: 'https://logo.clearbit.com/posh.vip',
    workStyle: 'In office',
    location: 'New York',
    salary: '$180k – $220k',
    posted: 'today',
    category: 'Engineering',
  },
  {
    id: 8,
    title: 'Senior Software Engineer',
    company: 'Community Energy Labs',
    logo: 'https://logo.clearbit.com/communityenergylabs.com',
    workStyle: 'Remote only',
    location: 'Everywhere',
    salary: '$135k – $165k',
    posted: 'today',
    category: 'Engineering',
  },
  {
    id: 9,
    title: 'Forward Deployed Engineer',
    company: 'FleetPulse',
    logo: 'https://logo.clearbit.com/fleetpulse.com',
    workStyle: 'In office',
    location: 'Chicago',
    salary: '$140k – $165k',
    posted: 'today',
    category: 'Engineering',
  },
  {
    id: 10,
    title: 'Senior Software Engineer, Data Platform',
    company: 'Juniper Square',
    logo: 'https://logo.clearbit.com/junipersquare.com',
    workStyle: 'Remote',
    location: 'Chicago',
    salary: '$160k – $200k',
    posted: 'today',
    category: 'Engineering',
  },
  // Startups
  {
    id: 11,
    title: '3D Software Engineer',
    company: 'Pencil',
    logo: 'https://logo.clearbit.com/pencil.li',
    workStyle: 'In office',
    location: 'New York City',
    salary: '$100k – $130k',
    equity: '0.1% – 0.25%',
    posted: 'today',
    category: 'Startups',
  },
  {
    id: 12,
    title: 'Student Loan Consultant',
    company: 'Juno',
    logo: 'https://logo.clearbit.com/joinjuno.com',
    workStyle: 'Remote',
    location: 'Everywhere',
    salary: '$65k – $70k',
    posted: 'today',
    category: 'Startups',
  },
  {
    id: 13,
    title: 'Payroll Specialist/PA',
    company: 'Velqor Group',
    logo: 'https://logo.clearbit.com/velqor.com',
    workStyle: 'Remote only',
    location: 'Australia',
    salary: '$70k – $90k',
    equity: '0.7% – 1.0%',
    posted: 'today',
    category: 'Startups',
  },
  {
    id: 14,
    title: 'WordPress Security Engineer / Website Developer',
    company: 'LAVA - High Quality 3d Printing Service',
    logo: 'https://logo.clearbit.com/lava3d.com',
    workStyle: 'Remote only',
    location: 'Everywhere',
    salary: '$125k – $150k',
    equity: 'No equity',
    posted: 'today',
    category: 'Startups',
  },
  {
    id: 15,
    title: 'Account Executive',
    company: 'Hologram',
    logo: 'https://logo.clearbit.com/hologram.io',
    workStyle: 'Remote',
    location: 'Everywhere',
    salary: '$130k – $130k',
    posted: 'today',
    category: 'Startups',
  },
  // Design
  {
    id: 16,
    title: 'Senior Product Designer',
    company: 'Linear',
    logo: 'https://logo.clearbit.com/linear.app',
    workStyle: 'Remote only',
    location: 'Everywhere',
    salary: '$150k – $190k',
    equity: '0.05% – 0.15%',
    posted: 'today',
    category: 'Design',
  },
  {
    id: 17,
    title: 'UX Designer',
    company: 'Figma',
    logo: 'https://logo.clearbit.com/figma.com',
    workStyle: 'In office',
    location: 'San Francisco',
    salary: '$130k – $170k',
    posted: 'today',
    category: 'Design',
  },
  {
    id: 18,
    title: 'Brand Designer',
    company: 'Notion',
    logo: 'https://logo.clearbit.com/notion.so',
    workStyle: 'Onsite or remote',
    location: 'New York City',
    salary: '$120k – $160k',
    posted: 'yesterday',
    category: 'Design',
  },
  {
    id: 19,
    title: 'Motion Designer',
    company: 'Vercel',
    logo: 'https://logo.clearbit.com/vercel.com',
    workStyle: 'Remote only',
    location: 'Everywhere',
    salary: '$110k – $140k',
    posted: 'yesterday',
    category: 'Design',
  },
  {
    id: 20,
    title: 'Design System Lead',
    company: 'Stripe',
    logo: 'https://logo.clearbit.com/stripe.com',
    workStyle: 'In office',
    location: 'San Francisco',
    salary: '$160k – $210k',
    posted: 'yesterday',
    category: 'Design',
  },
];

const categoryConfig: { key: string; label: string; viewLabel: string }[] = [
  { key: 'Product', label: 'Product jobs', viewLabel: 'View all product jobs' },
  { key: 'Engineering', label: 'Engineering jobs', viewLabel: 'View all engineering jobs' },
  { key: 'Startups', label: 'Trending startup jobs', viewLabel: 'View all jobs' },
  { key: 'Design', label: 'Design jobs', viewLabel: 'View all design jobs' },
];

function JobRow({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

  const meta = [
    job.workStyle,
    job.location,
    job.salary,
    job.equity,
    job.posted,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 gap-4">
      {/* Logo + Info */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
          <img
            src={job.logo}
            alt={job.company}
            className="w-full h-full object-cover"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
              const parent = t.parentElement!;
              parent.style.display = 'flex';
              parent.style.alignItems = 'center';
              parent.style.justifyContent = 'center';
              parent.innerHTML = `<span style="font-size:14px;font-weight:700;color:#555">${job.company[0]}</span>`;
            }}
          />
        </div>
        <div className="min-w-0">
          <Link href={`/jobs/${job.id}`}>
            <p className="font-semibold text-gray-900 text-sm leading-snug hover:underline truncate">
              {job.title}
            </p>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{meta}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded transition-colors ${
            saved
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
          }`}
        >
          {saved ? (
            <BookmarkCheck className="w-3.5 h-3.5" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
          {saved ? 'Saved' : 'Save'}
        </button>
        <Link
          href={`/jobs/${job.id}`}
          className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

function CategorySection({
  config,
  jobs,
}: {
  config: (typeof categoryConfig)[number];
  jobs: Job[];
}) {
  const categoryJobs = jobs.filter((j) => j.category === config.key);
  if (categoryJobs.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-900">{config.label}</h2>
        <Link
          href={`/jobs?category=${config.key}`}
          className="text-sm text-gray-700 underline underline-offset-2 hover:text-gray-900 font-medium"
        >
          {config.viewLabel}
        </Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg px-4">
        {categoryJobs.map((job) => (
          <JobRow key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}

const floatingLogos = [
  { src: 'https://logo.clearbit.com/stripe.com',   style: 'top-6  left-[6%]  rotate-[-8deg]  w-10 h-10' },
  { src: 'https://logo.clearbit.com/notion.so',    style: 'top-16 left-[18%] rotate-[6deg]   w-8  h-8'  },
  { src: 'https://logo.clearbit.com/linear.app',   style: 'top-4  left-[34%] rotate-[-4deg]  w-9  h-9'  },
  { src: 'https://logo.clearbit.com/discord.com',  style: 'top-3  left-[55%] rotate-[5deg]   w-10 h-10' },
  { src: 'https://logo.clearbit.com/figma.com',    style: 'top-8  left-[72%] rotate-[-6deg]  w-8  h-8'  },
  { src: 'https://logo.clearbit.com/vercel.com',   style: 'top-4  right-[12%] rotate-[8deg]  w-9  h-9'  },
  { src: 'https://logo.clearbit.com/openai.com',   style: 'top-20 right-[6%]  rotate-[-5deg] w-8  h-8'  },
  { src: 'https://logo.clearbit.com/shopify.com',  style: 'bottom-6 left-[8%] rotate-[7deg]  w-8  h-8'  },
  { src: 'https://logo.clearbit.com/airbnb.com',   style: 'bottom-8 left-[28%] rotate-[-6deg] w-9 h-9'  },
  { src: 'https://logo.clearbit.com/airtable.com', style: 'bottom-5 right-[20%] rotate-[5deg] w-8 h-8'  },
  { src: 'https://logo.clearbit.com/slack.com',    style: 'bottom-7 right-[8%]  rotate-[-8deg] w-10 h-10'},
];

export default function JobsPage() {
  const [titleSearch, setTitleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState({ title: '', location: '' });
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  // Hide/show sticky bar based on hero visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    setActiveSearch({ title: titleSearch, location: locationSearch });
  };

  const filteredJobs =
    activeSearch.title || activeSearch.location
      ? jobs.filter((j) => {
          const matchTitle = j.title
            .toLowerCase()
            .includes(activeSearch.title.toLowerCase());
          const matchLoc = j.location
            .toLowerCase()
            .includes(activeSearch.location.toLowerCase()) ||
            j.workStyle.toLowerCase().includes(activeSearch.location.toLowerCase());
          return (
            (!activeSearch.title || matchTitle) &&
            (!activeSearch.location || matchLoc)
          );
        })
      : jobs;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative bg-[#f5f5f5] overflow-hidden border-b border-gray-200"
        style={{ minHeight: 220 }}
      >
        {/* Floating logos */}
        {floatingLogos.map((logo, i) => (
          <div
            key={i}
            className={`absolute ${logo.style} rounded-xl overflow-hidden shadow-md bg-white border border-gray-200 opacity-80`}
          >
            <img
              src={logo.src}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
            />
          </div>
        ))}

        {/* Centre content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-14">
          <p className="text-xs font-semibold tracking-widest text-rose-500 uppercase mb-3">
            Over 130k remote &amp; local startup jobs
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Find what&apos;s next:
          </h1>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row w-full max-w-2xl bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
            {/* Job title */}
            <div className="flex items-center flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title"
                value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {/* Location */}
            <div className="flex items-center flex-1 px-4 py-3">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Location"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {/* Button */}
            <button
              onClick={handleSearch}
              className="mx-2 my-2 px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── STICKY COMPACT BAR (shown when hero scrolled out) ── */}
      <div
        className={`bg-white border-b border-gray-200 sticky top-0 z-40 transition-all duration-200 ${
          heroVisible ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex gap-2">
          <div className="flex flex-1 items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Job title"
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-1 items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Location"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* ── JOB LISTINGS ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {activeSearch.title || activeSearch.location ? (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Results
              {activeSearch.title && <> for &ldquo;{activeSearch.title}&rdquo;</>}
              {activeSearch.location && <> in {activeSearch.location}</>}
            </h2>
            {filteredJobs.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg px-4">
                {filteredJobs.map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No jobs found. Try a different search.</p>
            )}
          </section>
        ) : (
          categoryConfig.map((config) => (
            <CategorySection key={config.key} config={config} jobs={filteredJobs} />
          ))
        )}
      </div>
    </div>
  );
}
