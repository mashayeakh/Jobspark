'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, MapPin, Bookmark, BookmarkCheck } from 'lucide-react';
import { Job } from './types';

// ─── Job Row ─────────────────────────────────────────────────────────────────
function JobRow({ job, basePath }: { job: Job; basePath: string }) {
  const [saved, setSaved] = useState(false);

  const meta = [job.workStyle, job.location, job.salary, job.equity, job.posted]
    .filter(Boolean)
    .join(' • ');

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
          <img
            src={job.logo}
            alt={job.company}
            className="w-full h-full object-cover"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
              const p = t.parentElement!;
              p.innerHTML = `<span style="font-size:13px;font-weight:700;color:#555">${job.company[0]}</span>`;
            }}
          />
        </div>
        <div className="min-w-0">
          <Link href={`${basePath}/${job.id}`}>
            <p className="font-semibold text-gray-900 text-sm leading-snug hover:underline truncate">
              {job.title}
            </p>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{meta}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded transition-colors ${
            saved
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
          }`}
        >
          {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          {saved ? 'Saved' : 'Save'}
        </button>
        <Link
          href={`${basePath}/${job.id}`}
          className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}

// ─── Floating logos config ────────────────────────────────────────────────────
const floatingLogos = [
  { src: 'https://logo.clearbit.com/stripe.com',   cls: 'top-5  left-[5%]   rotate-[-8deg] w-10 h-10' },
  { src: 'https://logo.clearbit.com/notion.so',    cls: 'top-14 left-[17%]  rotate-[6deg]  w-8  h-8'  },
  { src: 'https://logo.clearbit.com/figma.com',    cls: 'top-3  left-[33%]  rotate-[-4deg] w-9  h-9'  },
  { src: 'https://logo.clearbit.com/discord.com',  cls: 'top-3  left-[55%]  rotate-[5deg]  w-10 h-10' },
  { src: 'https://logo.clearbit.com/linear.app',   cls: 'top-6  left-[72%]  rotate-[-5deg] w-8  h-8'  },
  { src: 'https://logo.clearbit.com/vercel.com',   cls: 'top-3  right-[11%] rotate-[8deg]  w-9  h-9'  },
  { src: 'https://logo.clearbit.com/openai.com',   cls: 'top-16 right-[5%]  rotate-[-5deg] w-8  h-8'  },
  { src: 'https://logo.clearbit.com/shopify.com',  cls: 'bottom-5 left-[7%]  rotate-[7deg]  w-8  h-8'  },
  { src: 'https://logo.clearbit.com/airbnb.com',   cls: 'bottom-7 left-[27%] rotate-[-6deg] w-9  h-9'  },
  { src: 'https://logo.clearbit.com/airtable.com', cls: 'bottom-4 right-[20%] rotate-[5deg] w-8  h-8'  },
  { src: 'https://logo.clearbit.com/slack.com',    cls: 'bottom-6 right-[7%]  rotate-[-8deg] w-10 h-10' },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface CategoryGroup {
  label: string;
  viewLabel: string;
  jobs: Job[];
}

interface JobListingTemplateProps {
  basePath: string;               // e.g. '/remote-jobs'
  heroTag: string;                // e.g. '10K+ REMOTE STARTUP JOBS'
  heroHeadline: string;           // e.g. 'Work from anywhere:'
  accentColor: string;            // Tailwind text color class for tag
  groups: CategoryGroup[];        // sections to render
}

// ─── Template ─────────────────────────────────────────────────────────────────
export default function JobListingTemplate({
  basePath,
  heroTag,
  heroHeadline,
  accentColor,
  groups,
}: JobListingTemplateProps) {
  const [titleSearch, setTitleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState({ title: '', location: '' });
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = () => setActiveSearch({ title: titleSearch, location: locationSearch });

  const allJobs = groups.flatMap((g) => g.jobs);

  const filteredJobs =
    activeSearch.title || activeSearch.location
      ? allJobs.filter((j) => {
          const matchTitle = j.title.toLowerCase().includes(activeSearch.title.toLowerCase());
          const matchLoc =
            j.location.toLowerCase().includes(activeSearch.location.toLowerCase()) ||
            j.workStyle.toLowerCase().includes(activeSearch.location.toLowerCase());
          return (!activeSearch.title || matchTitle) && (!activeSearch.location || matchLoc);
        })
      : null;

  const searchInputClass =
    'flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO ── */}
      <div
        ref={heroRef}
        className="relative bg-[#f5f5f5] overflow-hidden border-b border-gray-200"
        style={{ minHeight: 220 }}
      >
        {floatingLogos.map((logo, i) => (
          <div
            key={i}
            className={`absolute ${logo.cls} rounded-xl overflow-hidden shadow-md bg-white border border-gray-200 opacity-80`}
          >
            <img
              src={logo.src}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
            />
          </div>
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-14">
          <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${accentColor}`}>
            {heroTag}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">{heroHeadline}</h1>

          <div className="flex flex-col sm:flex-row w-full max-w-2xl bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input type="text" placeholder="Job title" value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={searchInputClass} />
            </div>
            <div className="flex items-center flex-1 px-4 py-3">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input type="text" placeholder="Location" value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={searchInputClass} />
            </div>
            <button
              onClick={handleSearch}
              className="mx-2 my-2 px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── STICKY BAR ── */}
      <div className={`bg-white border-b border-gray-200 sticky top-0 z-40 transition-all duration-200 ${
        heroVisible ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex gap-2">
          <div className="flex flex-1 items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Job title" value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400" />
          </div>
          <div className="flex flex-1 items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Location" value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400" />
          </div>
          <button onClick={handleSearch}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* ── LISTINGS ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {filteredJobs ? (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Results
              {activeSearch.title && <> for &ldquo;{activeSearch.title}&rdquo;</>}
              {activeSearch.location && <> in {activeSearch.location}</>}
            </h2>
            {filteredJobs.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg px-4">
                {filteredJobs.map((job) => (
                  <JobRow key={job.id} job={job} basePath={basePath} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No jobs found. Try a different search.</p>
            )}
          </section>
        ) : (
          groups.map((group) => (
            <section key={group.label} className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">{group.label}</h2>
                <Link
                  href="#"
                  className="text-sm text-gray-700 underline underline-offset-2 hover:text-gray-900 font-medium"
                >
                  {group.viewLabel}
                </Link>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4">
                {group.jobs.map((job) => (
                  <JobRow key={job.id} job={job} basePath={basePath} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
