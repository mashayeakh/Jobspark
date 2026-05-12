'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, MapPin, Bookmark, BookmarkCheck, X, ChevronDown } from 'lucide-react';
import { Job } from './types';
import { useLoadingBar } from '@/components/providers/LoadingBarProvider';
import { workStyleService } from '@/services/workStyleService';
import { useApi } from '@/hooks/useApi';

// ─── Job Row ─────────────────────────────────────────────────────────────────
function JobRow({ job, basePath }: { job: Job; basePath: string }) {
  const [saved, setSaved] = useState(false);

  const meta = [
    job.workStyle,
    job.location,
    job.salary,
    job.equity,
    job.posted,
    job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : null
  ]
    .filter(Boolean)
    .join(' • ');


  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
          {job.logo ? (
            <img
              src={job.logo}
              alt={job.company}
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                const p = t.parentElement!;
                p.innerHTML = `<span style="font-size:13px;font-weight:700;color:#555">${job.company?.[0] || ''}</span>`;
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#555' }}>{job.company?.[0] || ''}</span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <Link href={`${basePath}/${job.id}`}>
            <p className="font-semibold text-gray-900 text-sm leading-snug hover:underline">
              {job.title}
            </p>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{meta}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded transition-colors ${saved
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

// ─── Floating logos ───────────────────────────────────────────────────────────
const floatingLogos = [
  { src: 'https://logo.clearbit.com/stripe.com', cls: 'top-5  left-[5%]   rotate-[-8deg] w-10 h-10' },
  { src: 'https://logo.clearbit.com/notion.so', cls: 'top-14 left-[17%]  rotate-[6deg]  w-8  h-8' },
  { src: 'https://logo.clearbit.com/figma.com', cls: 'top-3  left-[33%]  rotate-[-4deg] w-9  h-9' },
  { src: 'https://logo.clearbit.com/discord.com', cls: 'top-3  left-[55%]  rotate-[5deg]  w-10 h-10' },
  { src: 'https://logo.clearbit.com/linear.app', cls: 'top-6  left-[72%]  rotate-[-5deg] w-8  h-8' },
  { src: 'https://logo.clearbit.com/vercel.com', cls: 'top-3  right-[11%] rotate-[8deg]  w-9  h-9' },
  { src: 'https://logo.clearbit.com/openai.com', cls: 'top-16 right-[5%]  rotate-[-5deg] w-8  h-8' },
  { src: 'https://logo.clearbit.com/shopify.com', cls: 'bottom-5 left-[7%]  rotate-[7deg]  w-8  h-8' },
  { src: 'https://logo.clearbit.com/airbnb.com', cls: 'bottom-7 left-[27%] rotate-[-6deg] w-9  h-9' },
  { src: 'https://logo.clearbit.com/airtable.com', cls: 'bottom-4 right-[20%] rotate-[5deg] w-8  h-8' },
  { src: 'https://logo.clearbit.com/slack.com', cls: 'bottom-6 right-[7%]  rotate-[-8deg] w-10 h-10' },
];

// ─── Filter chip ─────────────────────────────────────────────────────────────
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${active
        ? 'bg-gray-900 text-white border-gray-900'
        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
        }`}
    >
      {label}
    </button>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface JobListingTemplateProps {
  basePath: string;
  heroTag: string;
  heroHeadline: string;
  accentColor: string;
  allJobs: Job[];
  loading?: boolean;
  error?: string | null;
}

// ─── Template ─────────────────────────────────────────────────────────────────
export default function JobListingTemplate({
  basePath,
  heroTag,
  heroHeadline,
  accentColor,
  allJobs,
  loading = false,
  error = null,
}: JobListingTemplateProps) {
  const [titleSearch, setTitleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [activeTitle, setActiveTitle] = useState('');
  const [activeLocation, setActiveLocation] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  const [mounted, setMounted] = useState(false);
  const [workStyle, setWorkStyle] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Fetch filter data
  const { data: workStylesData } = useApi(() => workStyleService.getActiveWorkStyles());
  const { data: jobTypesData } = useApi(() => workStyleService.getActiveJobTypes());
  const { data: experienceLevelsData } = useApi(() => workStyleService.getActiveExperienceLevels());
  const { data: locationTypesData } = useApi(() => workStyleService.getActiveLocationTypes());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const [isSearching, setIsSearching] = useState(false);
  const { startLoading, stopLoading } = useLoadingBar();

  const handleSearch = () => {
    setIsSearching(true);
    startLoading();
    // Small delay to show loading state
    setTimeout(() => {
      setActiveTitle(titleSearch);
      setActiveLocation(locationSearch);
      setIsSearching(false);
      stopLoading();
    }, 800);
  };

  // Build filter options from API data
  // Using locationTypesData for "Work Style" as it matches the Job model's locationType better
  const workStyles = ['All', ...(locationTypesData?.map(lt => lt.label) || [])];
  const jobTypes = ['All', ...(jobTypesData?.map(jt => jt.label) || [])];
  const experiences = ['All', ...(experienceLevelsData?.map(el => el.label) || [])];

  const activeFilterCount =
    (workStyle !== 'All' ? 1 : 0) +
    (jobType !== 'All' ? 1 : 0) +
    (experience !== 'All' ? 1 : 0);

  const clearFilters = () => {
    setWorkStyle('All');
    setJobType('All');
    setExperience('All');
    setActiveTitle('');
    setActiveLocation('');
    setTitleSearch('');
    setLocationSearch('');
  };

  // Apply all filters
  let filtered = allJobs.filter((j) => {
    const matchTitle = !activeTitle || j.title.toLowerCase().includes(activeTitle.toLowerCase()) || j.company.toLowerCase().includes(activeTitle.toLowerCase());
    const matchLocation = !activeLocation || j.location.toLowerCase().includes(activeLocation.toLowerCase()) || j.workStyle.toLowerCase().includes(activeLocation.toLowerCase());
    const matchWorkStyle = workStyle === 'All' || j.workStyle === workStyle;
    const matchType = jobType === 'All' || j.type === jobType;
    const matchExp = experience === 'All' || j.experience === experience;
    return matchTitle && matchLocation && matchWorkStyle && matchType && matchExp;
  });

  // Sort
  if (sortBy === 'Newest') {
    filtered = [...filtered].sort((a, b) => {
      if (a.posted === 'today' && b.posted !== 'today') return -1;
      if (a.posted !== 'today' && b.posted === 'today') return 1;
      return String(b.id).localeCompare(String(a.id)); // Stable tie-breaker
    });
  } else if (sortBy === 'Highest Salary') {
    // Basic salary sort (extracting first number from string)
    const getSal = (s: string) => parseInt(s.replace(/[^0-9]/g, '')) || 0;
    filtered = [...filtered].sort((a, b) => getSal(b.salary) - getSal(a.salary) || String(b.id).localeCompare(String(a.id)));
  }

  const inputClass = 'flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO ── */}
      <div
        ref={heroRef}
        className="relative bg-[#f5f5f5] overflow-hidden border-b border-gray-200"
        style={{ minHeight: 220 }}
      >
        {floatingLogos.map((logo, i) => (
          <div key={i} className={`absolute ${logo.cls} rounded-xl overflow-hidden shadow-md bg-white border border-gray-200 opacity-80`}>
            <img src={logo.src} alt="" className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }} />
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
              <input type="text" placeholder="Job title or company" value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={inputClass} />
            </div>
            <div className="flex items-center flex-1 px-4 py-3">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input type="text" placeholder="Location" value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={inputClass} />
            </div>
            <button onClick={handleSearch} disabled={isSearching}
              className="mx-2 my-2 px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {isSearching && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* ── STICKY COMPACT BAR ── */}
      <div className={`bg-white border-b border-gray-200 sticky top-0 z-40 transition-all duration-200 ${heroVisible ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'
        }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex gap-2">
          <div className="flex flex-1 items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Job title or company" value={titleSearch}
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
          <button onClick={handleSearch} disabled={isSearching}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isSearching && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* ── FILTERS + LISTINGS ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Filter bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">

            {/* Work Style */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Work Style</p>
              <div className="flex flex-wrap gap-2">
                {workStyles.map((ws) => (
                  <FilterChip key={ws} label={ws} active={workStyle === ws} onClick={() => setWorkStyle(ws)} />
                ))}
              </div>
            </div>

            <div className="w-px bg-gray-200 self-stretch hidden sm:block" />

            {/* Job Type */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Job Type</p>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((t) => (
                  <FilterChip key={t} label={t} active={jobType === t} onClick={() => setJobType(t)} />
                ))}
              </div>
            </div>

            <div className="w-px bg-gray-200 self-stretch hidden sm:block" />

            {/* Experience */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Experience</p>
              <div className="flex flex-wrap gap-2">
                {experiences.map((exp) => (
                  <FilterChip key={exp} label={exp} active={experience === exp} onClick={() => setExperience(exp)} />
                ))}
              </div>
            </div>
          </div>

          {/* Active filter count + clear */}
          {activeFilterCount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
              <span className="text-xs text-gray-500">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                <X className="w-3 h-3" /> Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filtered.length}</span> job{filtered.length !== 1 ? 's' : ''} found
          </p>
          {/* Sort */}
          <div className="relative flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 outline-none focus:border-gray-500 cursor-pointer"
              >
                <option>Newest</option>
                <option>Highest Salary</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Job list */}
        {loading || isSearching ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-900 font-semibold text-lg mb-1">Failed to load jobs</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
              Try again
            </button>
          </div>
        ) : !mounted ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl px-4">
            {filtered.map((job) => (
              <JobRow key={job.id} job={job} basePath={basePath} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-900 font-semibold text-lg mb-1">No jobs match your filters</p>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your search or clearing filters.</p>
            <button onClick={clearFilters} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
