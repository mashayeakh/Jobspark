/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobService, Job } from '@/services/jobService';
import {
  Bookmark, MapPin, Briefcase, DollarSign,
  Trash2, ArrowUpRight, RefreshCw, Search,
  ExternalLink, Clock, BookmarkX, CheckCircle,
  Sparkles,
  Zap
} from 'lucide-react';

/* ─── Helpers ────────────────────────────────────────────────── */
function formatSalary(job: Job) {
  if (job.salaryMin && job.salaryMax) return `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`;
  if (job.salaryMin) return `$${(job.salaryMin / 1000).toFixed(0)}k+`;
  if (job.salaryMax) return `Up to $${(job.salaryMax / 1000).toFixed(0)}k`;
  return null;
}

function typeLabel(t: string) {
  return t?.replace('_', ' ') ?? t;
}

/* ─── Company Logo ───────────────────────────────────────────── */
function CompanyLogo({ name, logo }: { name: string; logo: string | null }) {
  const letter = name?.[0]?.toUpperCase() ?? '?';
  if (!logo) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center flex-shrink-0 shadow-inner">
        <span className="text-xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">{letter}</span>
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 bg-white p-1.5 shadow-sm">
      <img
        src={logo}
        alt={name}
        className="w-full h-full object-contain"
        onError={e => {
          e.currentTarget.parentElement!.innerHTML =
            `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><span class="text-xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">${letter}</span></div>`;
        }}
      />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [removingIds, setRemovingIds] = useState<Record<string, boolean>>({});
  const [applyingIds, setApplyingIds] = useState<Record<string, boolean>>({});
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});

  const fetchSaved = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobService.getSavedJobs();
      if (res.success && res.data) {
        // Normalize: Extract nested job data if the backend returns save relationship objects
        const normalized = (res.data as any[]).map(item => {
          if (item.job && (item.jobId || item.job_id)) {
            return { ...item.job };
          }
          return item;
        });
        setSavedJobs(normalized);
      } else {
        setError(res.error || 'Failed to load saved jobs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSaved();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = async (jobId: string) => {
    const idStr = String(jobId);
    setRemovingIds(prev => ({ ...prev, [idStr]: true }));
    try {
      const res = await jobService.unsaveJob(idStr);
      if (res.success) {
        setSavedJobs(prev => prev.filter(j => String(j.id) !== idStr));
      }
    } finally {
      setRemovingIds(prev => ({ ...prev, [idStr]: false }));
    }
  };

  const handleApply = async (jobId: string) => {
    const idStr = String(jobId);
    setApplyingIds(prev => ({ ...prev, [idStr]: true }));
    try {
      const res = await jobService.applyToJob(idStr);
      if (res.success) {
        setAppliedIds(prev => ({ ...prev, [idStr]: true }));
      }
    } finally {
      setApplyingIds(prev => ({ ...prev, [idStr]: false }));
    }
  };

  const filtered = savedJobs.filter(job => {
    const companyName = typeof job.company === 'string' ? job.company : job.company?.name || '';
    return !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8 p-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200">
              <Bookmark className="w-5 h-5 text-white" />
            </span>
            Saved Jobs
          </h1>
          <p className="text-sm text-gray-500 font-medium ml-13 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Jobs you&apos;ve bookmarked — apply when you&apos;re ready
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSaved}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-black hover:opacity-90 transition-all shadow-lg shadow-blue-200"
          >
            Browse More <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Saved',   value: savedJobs.length,                                          color: 'text-blue-600',   bg: 'bg-blue-50',     icon: Bookmark },
          { label: 'Applied', value: Object.values(appliedIds).filter(Boolean).length,           color: 'text-indigo-600', bg: 'bg-indigo-50',   icon: CheckCircle },
          { label: 'Removed', value: 0,                                                          color: 'text-gray-400',   bg: 'bg-gray-100',    icon: BookmarkX },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
              <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-black leading-none ${s.color}`}>
                  {loading ? <span className="inline-block w-8 h-6 bg-gray-100 rounded animate-pulse" /> : s.value}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-black uppercase tracking-widest">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 p-6">
        <div className="flex items-center gap-4 bg-gray-50/50 rounded-2xl px-5 py-4 border border-gray-100 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search saved jobs by title, company or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-base bg-transparent outline-none text-gray-800 placeholder-gray-400 font-bold"
          />
          {search && (
            <button onClick={() => setSearch('')} className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-200 transition-colors font-black">✕</button>
          )}
        </div>
        {!loading && (
          <div className="flex items-center gap-2 mt-4 px-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
              {filtered.length} of {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
              {search && ' matching search'}
            </p>
          </div>
        )}
      </div>

      {/* ── Jobs ── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white rounded-[2rem] border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-[2.5rem] border border-red-100 p-16 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <BookmarkX className="w-10 h-10 text-red-400" />
          </div>
          <p className="font-black text-gray-900 mb-2 text-xl">Could not load saved jobs</p>
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto font-medium">{error}</p>
          <button
            onClick={fetchSaved}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-black rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-red-100"
          >
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-xl shadow-gray-100/50">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Zap className="w-12 h-12 text-blue-500" />
          </div>
          <p className="font-black text-gray-900 mb-2 text-2xl tracking-tight">
            {savedJobs.length === 0 ? 'No saved jobs yet' : 'No matches found'}
          </p>
          <p className="text-base text-gray-400 mb-10 max-w-sm mx-auto font-bold leading-relaxed">
            {savedJobs.length === 0
              ? 'Find your dream job and bookmark it for later. Your future starts here!'
              : 'Try using different keywords or clear the search.'}
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-3xl hover:opacity-90 transition-all shadow-xl shadow-blue-200 group"
          >
            Explore Jobs <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(job => {
            const salary = formatSalary(job);
            const isApplied = appliedIds[String(job.id)];
            const isApplying = applyingIds[String(job.id)];
            const isRemoving = removingIds[String(job.id)];

            const companyName = typeof job.company === 'string' ? job.company : job.company?.name || 'Company';
            const companyLogo = (job.company as any)?.logo;

            return (
              <div
                key={job.id}
                className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all group relative overflow-hidden"
              >
                {/* Decorative gradient corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent -mr-16 -mt-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-8 relative z-10">
                  <CompanyLogo name={companyName} logo={companyLogo} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-black text-gray-900 group-hover:text-blue-600 transition-colors text-2xl leading-tight tracking-tight block"
                        >
                          {job.title}
                        </Link>
                        <p className="text-base text-gray-400 mt-1 font-black flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {companyName}
                        </p>
                      </div>
                      {/* Location type badge */}
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                        {typeLabel(job.locationType || 'Remote')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
                      <span className="flex items-center gap-2 text-sm font-black text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                        <MapPin className="w-4 h-4" />
                        {job.location || 'Global Remote'}
                      </span>
                      <span className="flex items-center gap-2 text-sm font-black text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                        <Briefcase className="w-4 h-4" />
                        {typeLabel(job.type || 'Full Time')}
                      </span>
                      {salary && (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-1.5 rounded-xl border border-blue-100/50">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-black text-blue-600 tracking-tight">{salary}</span>
                        </div>
                      )}
                      {job.applicationDeadline && (
                        <span className="flex items-center gap-2 text-[10px] text-amber-600 font-black uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action row */}
                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between gap-6 flex-wrap relative z-10">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors group/details"
                  >
                    <ExternalLink className="w-4 h-4 transition-transform group-hover/details:rotate-12" />
                    Job Details
                  </Link>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleRemove(String(job.id))}
                      disabled={isRemoving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isRemoving ? '...' : 'Remove'}
                    </button>
                    <button
                      onClick={() => handleApply(String(job.id))}
                      disabled={isApplying || isApplied}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all disabled:opacity-60 shadow-xl ${
                        isApplied
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-blue-200'
                      }`}
                    >
                      {isApplied ? (
                        <><CheckCircle className="w-4 h-4" /> Applied</>
                      ) : isApplying ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> ...</>
                      ) : (
                        <>Apply Now</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Extra icons for the new design
function Building({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 0V4m-2 4h12" />
    </svg>
  );
}
