/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Briefcase,
  Clock,
  Filter,
  Code,
  Megaphone,
  Briefcase as BusinessIcon,
  Headset,
  Activity,
  Camera,
  Coins,
  TrendingUp,
  Building,
  Sparkles,
  Palette,
  GraduationCap,
  Truck,
  BrainCircuit,
  Users
} from 'lucide-react';
import { Job, jobService } from '@/services/jobService';
import { applicationService } from '@/services/applicationService';

// ─── Category Pill Tab ──────────────────────────────────────────────────────
function CategoryIcon({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border ${
        isActive
          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
          : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </button>
  );
}

// ─── RocketJobs Styled Job Card ──────────────────────────────────────────────
function JobCard({ job, basePath, isApplied }: { job: Job; basePath: string; isApplied: boolean }) {
  const [saved, setSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkSave = async () => {
      try {
        const res = await jobService.checkIfJobSaved(String(job.id));
        if (res.success && res.data && isMounted) setSaved(res.data.isSaved);
      } catch (e) { console.error(e); }
    };
    checkSave();
    return () => { isMounted = false; };
  }, [job.id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loadingSave) return;

    // Optimistic Update
    const previousSaved = saved;
    setSaved(!previousSaved);
    setLoadingSave(true);

    try {
      const res = previousSaved ? await jobService.unsaveJob(String(job.id)) : await jobService.saveJob(String(job.id));
      if (!res.success) {
        setSaved(previousSaved);
      }
    } catch (err) {
      setSaved(previousSaved);
    } finally {
      setLoadingSave(false);
    }
  };

  const hasSalary = !!(job.salaryMin || job.salaryMax);
  const formattedSalary = hasSalary
    ? (job.salaryMin && job.salaryMax
      ? `${(job.salaryMin / 1000).toFixed(0)} - ${(job.salaryMax / 1000).toFixed(0)}k`
      : `${(job.salaryMin || 0) / 1000}k+`)
    : 'Negotiable';

  const companyName = typeof job.company === 'string' ? job.company : job.company?.name || 'Company';
  const companyLogo = (job.company as any)?.logo;

  return (
    <div className={`bg-white rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border hover:border-blue-100 mb-6 group relative overflow-hidden ${isApplied ? 'border-emerald-100 opacity-80' : 'border-transparent'}`}>
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50/50 to-transparent -mr-16 -mt-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Applied badge */}
      {isApplied && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
          <Sparkles className="w-3 h-3" /> Applied
        </div>
      )}

      <Link href={`${basePath}/${job.id}`} className="flex flex-col md:flex-row items-start gap-8 relative z-10">
        {/* Logo */}
        <div className="w-20 h-20 bg-white border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-3 transition-transform duration-500 group-hover:scale-105">
          {companyLogo ? (
            <img src={companyLogo} alt="" className="w-full h-full object-contain" />
          ) : (
            <Building className="w-10 h-10 text-gray-200" />
          )}
        </div>

        {/* Content Area */}
        <div className={`flex-1 min-w-0 ${isApplied ? 'mt-4' : ''}`}>
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate pr-12 tracking-tight">
              {job.title}
            </h3>
            <button
              onClick={handleSave}
              className="absolute top-0 right-0 p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
            >
              {saved ? <BookmarkCheck className="w-6 h-6 text-blue-600 fill-current" /> : <Bookmark className="w-6 h-6" />}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-5">
            <span className="text-base font-bold text-gray-500 flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-300" /> {companyName}
            </span>
            <span className="flex items-center gap-2 text-sm font-bold text-gray-400">
              <MapPin className="w-4 h-4 text-gray-300" /> {job.location || 'Remote'}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100/50">
              <TrendingUp className="w-3.5 h-3.5" /> {job.locationType || 'Remote'}
            </div>
          </div>

          {/* Salary & Info Row */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-baseline gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100/50 flex-shrink-0 whitespace-nowrap">
              <span className={`text-base font-black tracking-tight ${!hasSalary ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' : 'text-blue-600'}`}>
                {formattedSalary}
              </span>
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">USD/mo</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {(job.skills || []).slice(0, 3).map((skill: any, i: number) => (
                <span key={i} className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-4 py-1.5 rounded-xl group-hover:border-blue-200 transition-colors">
                  {typeof skill === 'string' ? skill : skill.skill?.name || skill.name}
                </span>
              ))}
              {!isApplied && (
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100">New</span>
              )}

              <div className="ml-2 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                <ChevronDown className="w-6 h-6 -rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

import { Meta } from '@/services/jobService';

// ─── Main Template ────────────────────────────────────────────────────────────
export default function JobListingTemplate({
  basePath,
  allJobs,
  loading = false,
  error = null,
  // Server-side pagination props (optional — falls back to client-side)
  meta,
  currentPage: serverPage,
  onPageChange,
  // Optional controlled filter props (used when parent manages server-side filtering)
  titleSearch: controlledTitleSearch,
  locationSearch: controlledLocationSearch,
  activeCategory: controlledActiveCategory,
  workStyle: controlledWorkStyle,
  minSalary: controlledMinSalary,
  onTitleSearchChange,
  onLocationSearchChange,
  onActiveCategoryChange,
  onWorkStyleChange,
  onMinSalaryChange,
  categories: categoriesFromProp,
}: {
  basePath: string;
  allJobs: any[];
  loading?: boolean;
  error?: string | null;
  meta?: Meta | null;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  // Controlled filter props (all optional — when absent, component manages its own state)
  titleSearch?: string;
  locationSearch?: string;
  activeCategory?: string;
  workStyle?: string;
  minSalary?: number;
  onTitleSearchChange?: (v: string) => void;
  onLocationSearchChange?: (v: string) => void;
  onActiveCategoryChange?: (v: string) => void;
  onWorkStyleChange?: (v: string) => void;
  onMinSalaryChange?: (v: number) => void;
  categories?: any[];
}) {
  // ── Local state (used when no controlled props are passed) ─────────────────
  const [localTitleSearch, setLocalTitleSearch] = useState('');
  const [localLocationSearch, setLocalLocationSearch] = useState('');
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [localActiveCategory, setLocalActiveCategory] = useState('All');
  const [localWorkStyle, setLocalWorkStyle] = useState('All');
  const [localMinSalary, setLocalMinSalary] = useState(0);

  // ── Resolve: use controlled props if provided, else local state ─────────────
  const isControlled = !!onTitleSearchChange; // any one callback signals controlled mode

  const titleSearch    = isControlled ? (controlledTitleSearch    ?? '') : localTitleSearch;
  const locationSearch = isControlled ? (controlledLocationSearch ?? '') : localLocationSearch;
  const activeCategory = isControlled ? (controlledActiveCategory ?? 'All') : localActiveCategory;
  const workStyle      = isControlled ? (controlledWorkStyle      ?? 'All') : localWorkStyle;
  const minSalary      = isControlled ? (controlledMinSalary      ?? 0)   : localMinSalary;
  const currentPage    = isControlled ? (serverPage ?? 1) : localCurrentPage;

  // Unified setters — delegate to parent callbacks or local state
  const updateTitleSearch    = (v: string)  => isControlled ? onTitleSearchChange!(v)    : (setLocalTitleSearch(v),    setLocalCurrentPage(1));
  const updateLocationSearch = (v: string)  => isControlled ? onLocationSearchChange!(v) : (setLocalLocationSearch(v), setLocalCurrentPage(1));
  const updateActiveCategory = (v: string)  => isControlled ? onActiveCategoryChange!(v) : (setLocalActiveCategory(v), setLocalCurrentPage(1));
  const updateWorkStyle      = (v: string)  => isControlled ? onWorkStyleChange!(v)      : (setLocalWorkStyle(v),      setLocalCurrentPage(1));
  const updateMinSalary      = (v: number)  => isControlled ? onMinSalaryChange!(v)      : (setLocalMinSalary(v),      setLocalCurrentPage(1));

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;
    const fetchApplied = async () => {
      try {
        const res = await applicationService.getMyApplications();
        if (res.success && res.data && isMounted) {
          const ids = new Set(res.data.map(app => app.job.id.toString()));
          setAppliedJobIds(ids);
        }
      } catch (e) { console.error('Failed to fetch applications', e); }
    };
    fetchApplied();
    return () => { isMounted = false; };
  }, []);

  const dynamicCategories = useMemo(() => {
    if (!categoriesFromProp || categoriesFromProp.length === 0) {
      // Fallback to static list if none provided
      return [
        { id: 'All', label: 'All', icon: Search },
        { id: 'IT', label: 'IT', icon: Code },
        { id: 'Marketing', label: 'Marketing', icon: Megaphone },
        { id: 'Sales', label: 'Sales', icon: Coins },
        { id: 'Business', label: 'Business', icon: BusinessIcon },
        { id: 'Support', label: 'Support', icon: Headset },
        { id: 'Health', label: 'Health', icon: Activity },
        { id: 'Creative', label: 'Creative', icon: Camera },
      ];
    }

    const titleIconMap: { [key: string]: any } = {
      'Software & Engineering': Code,
      'Development': Code,
      'Design & Creative': Palette,
      'Finance & Accounting': Coins,
      'Design': Palette,
      'Healthcare': Activity,
      'Marketing': Megaphone,
      'Business': BusinessIcon,
      'Education': GraduationCap,
      'Operations & Logistics': Truck,
      'Data & AI': BrainCircuit,
      'Marketing & Sales': Megaphone,
      'Customer Support': Headset,
      'Finance': Coins,
      'Human Resources': Users,
    };

    const list = categoriesFromProp.map(cat => ({
      id: cat.id,
      label: cat.name,
      icon: titleIconMap[cat.name] || Briefcase,
    }));

    return [{ id: 'All', label: 'All', icon: Search }, ...list];
  }, [categoriesFromProp]);

  // REAL-TIME SEARCH LOGIC
  // In controlled/server-paginated mode, the server already filtered the jobs —
  // so we skip client-side filtering entirely and just return allJobs as-is.
  const filtered = useMemo(() => {
    if (isControlled) return allJobs || [];

    return (allJobs || []).filter((j: Job) => {
      // 1. Search filtering
      const companyName = typeof j.company === 'string' ? j.company : j.company?.name || '';
      const matchTitle = !titleSearch ||
        j.title.toLowerCase().includes(titleSearch.toLowerCase()) ||
        companyName.toLowerCase().includes(titleSearch.toLowerCase()) ||
        (j.skills || []).some((s: any) => (typeof s === 'string' ? s : s.skill?.name || s.name || '').toLowerCase().includes(titleSearch.toLowerCase()));

      const matchLocationInput = !locationSearch || (j.location || '').toLowerCase().includes(locationSearch.toLowerCase());

      // 2. Work Style Filtering
      const normalizedWS = (j.locationType || '').toUpperCase();
      const locationText = (j.location || '').toLowerCase();

      let matchWS = workStyle === 'All';
      if (workStyle === 'Remote') {
        matchWS = normalizedWS === 'REMOTE' || locationText.includes('remote');
      } else if (workStyle === 'Hybrid') {
        matchWS = normalizedWS === 'HYBRID' || locationText.includes('hybrid');
      } else if (workStyle === 'Onsite') {
        matchWS = normalizedWS === 'ONSITE' || normalizedWS === 'STATIONARY' || (!locationText.includes('remote') && !locationText.includes('hybrid'));
      }

      // 3. Category match
      const jobCategoryId = j.categoryId || '';
      const categoryName = (j.category?.name || j.category || '').toString().toLowerCase();
      const matchCategory = activeCategory === 'All' || 
                            jobCategoryId === activeCategory || 
                            categoryName.includes(activeCategory.toLowerCase()) ||
                            (activeCategory === 'IT' && (categoryName.includes('software') || categoryName.includes('development') || categoryName.includes('engineering'))) ||
                            (activeCategory === 'Creative' && (categoryName.includes('design') || categoryName.includes('creative')));

      // 4. Salary match
      const matchSalary = minSalary === 0 || (j.salaryMin && j.salaryMin >= minSalary) || (j.salaryMax && j.salaryMax >= minSalary);

      return matchTitle && matchLocationInput && matchWS && matchCategory && matchSalary;
    });
  }, [isControlled, allJobs, titleSearch, locationSearch, workStyle, activeCategory, minSalary]);


  // ── Determine pagination mode ─────────────────────────────────────────────
  // Server-side mode: meta + onPageChange are provided by the parent page.
  // Client-side mode: fall back to in-memory slicing (used by sub-listing pages).
  const isServerPaginated = !!(meta && onPageChange);

  // In server-paginated + controlled mode, the server already filtered the jobs,
  // so filtered === allJobs and we can trust meta.total for the count.
  // In client-side mode, we still need to slice filtered[] ourselves.
  const clientTotalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const activePage   = isServerPaginated ? (serverPage ?? 1) : currentPage;
  const totalPages   = isServerPaginated ? (meta!.totalPages ?? 1) : clientTotalPages;

  // If controlled (server does the filtering), trust meta.total for total count.
  // Otherwise use filtered.length (client-side filtering).
  const totalResults = (isServerPaginated && isControlled) ? (meta!.total ?? filtered.length) : filtered.length;

  const paginatedJobs = isServerPaginated
    ? allJobs // server already returned the correct slice
    : filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    if (isServerPaginated) {
      onPageChange!(clamped);
    } else {
      setLocalCurrentPage(clamped);
    }
  };

  // Build smart page window (show at most 5 page buttons around the active page)
  const pageWindow = (() => {
    const pages: number[] = [];
    const halfWindow = 2;
    const start = Math.max(1, activePage - halfWindow);
    const end   = Math.min(totalPages, activePage + halfWindow);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  })();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-20">

      {/* Search Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Brand/Search Row */}
          <div className="flex flex-col lg:flex-row items-center gap-6 py-8">
            <div className="w-full lg:flex-1 relative flex items-center bg-gray-50 rounded-[2rem] px-6 border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search: Title, company, keywords..."
                className="flex-1 bg-transparent border-none focus:ring-0 py-4 text-base font-bold placeholder-gray-400"
                value={titleSearch}
                onChange={(e) => updateTitleSearch(e.target.value)}
              />
              <div className="h-8 w-px bg-gray-200 mx-4 hidden md:block"></div>
              <MapPin className="w-5 h-5 text-gray-400 mr-3 hidden md:block" />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 bg-transparent border-none focus:ring-0 py-4 text-base font-bold placeholder-gray-400 hidden md:block"
                value={locationSearch}
                onChange={(e) => updateLocationSearch(e.target.value)}
              />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 px-8 rounded-2xl text-white ml-2 shadow-xl shadow-blue-200 flex items-center justify-center hover:opacity-90 transition-all active:scale-95">
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-white border-2 border-gray-100 p-4 rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                <Filter className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Category Bar */}
          <div className="relative">
            {/* Left fade */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
            {/* Right fade */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 px-2">
              {dynamicCategories.map(cat => (
                <CategoryIcon
                  key={cat.id}
                  {...cat}
                  isActive={activeCategory === cat.id}
                  onClick={() => updateActiveCategory(cat.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-100/50 border border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Salary</h4>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100/50">
                {minSalary === 0 ? 'Any' : `${(minSalary / 1000).toFixed(0)}k+ USD`}
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-bold uppercase mb-10 tracking-tight">Minimum monthly gross</p>
            <div className="relative pt-2">
              <input
                type="range"
                min="0"
                max="25000"
                step="500"
                value={minSalary}
                onChange={(e) => updateMinSalary(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-full appearance-none accent-blue-600 cursor-pointer"
              />
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
              <span>0 USD</span>
              <span>25k+ USD</span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-100/50 border border-gray-50">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10">Work style</h4>
            <div className="space-y-8">
              {['Remote', 'Hybrid', 'Onsite'].map(style => (
                <label key={style} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-base font-black text-gray-700 group-hover:text-blue-600 transition-colors tracking-tight">{style}</span>
                  <input
                    type="checkbox"
                    className="w-7 h-7 rounded-xl border-gray-200 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all border-2"
                    checked={workStyle === style}
                    onChange={() => updateWorkStyle(style === workStyle ? 'All' : style)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-9">
          {error ? (
            <div className="bg-red-50 border border-red-100 p-12 rounded-[2.5rem] text-center text-red-600 font-black uppercase tracking-widest shadow-lg">
              <div className="mb-4">Failed to scan the market.</div>
              <button onClick={() => window.location.reload()} className="text-sm underline">Try again</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-10 px-4">
                <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Market scan: <span className="text-gray-900 ml-1 font-black">{totalResults} offers found</span>
                </h2>
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-900 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all group">
                  <Bookmark className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" /> Watch this search
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <div className="font-black text-gray-300 uppercase tracking-[0.3em] text-sm animate-pulse">Scanning the market...</div>
                </div>
              ) : filtered.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {paginatedJobs.map((j: Job) => <JobCard key={j.id} job={j} basePath={basePath} isApplied={appliedJobIds.has(j.id.toString())} />)}
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                    <div className="font-black uppercase tracking-[0.2em] text-gray-400">
                      {isServerPaginated
                        ? `Page ${activePage} of ${totalPages} · ${totalResults} results`
                        : `Showing ${(activePage - 1) * itemsPerPage + 1}–${Math.min(activePage * itemsPerPage, totalResults)} of ${totalResults} results`
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      {/* First page shortcut */}
                      {activePage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className="min-w-[40px] px-4 py-3 rounded-2xl border bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600"
                          >1</button>
                          {activePage > 4 && <span className="text-gray-400 font-black">…</span>}
                        </>
                      )}
                      <button
                        onClick={() => handlePageChange(activePage - 1)}
                        disabled={activePage === 1}
                        className="px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {pageWindow.map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[40px] px-4 py-3 rounded-2xl border ${
                              page === activePage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handlePageChange(activePage + 1)}
                        disabled={activePage === totalPages}
                        className="px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                      {/* Last page shortcut */}
                      {activePage < totalPages - 2 && (
                        <>
                          {activePage < totalPages - 3 && <span className="text-gray-400 font-black">…</span>}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="min-w-[40px] px-4 py-3 rounded-2xl border bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600"
                          >{totalPages}</button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-[3rem] p-28 text-center shadow-xl shadow-gray-100/50 border border-gray-100">
                  <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <Search className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">No offers match your criteria</h3>
                  <p className="text-gray-400 mt-4 font-bold text-lg max-w-sm mx-auto leading-relaxed">Try adjusting your filters or use more general keywords to find what you&apos;re looking for.</p>
                  <button
                    onClick={() => { 
                      updateTitleSearch('');
                      updateMinSalary(0);
                      updateWorkStyle('All');
                      updateActiveCategory('All');
                    }}
                    className="mt-12 px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-200 hover:opacity-90 transition-all active:scale-95"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
