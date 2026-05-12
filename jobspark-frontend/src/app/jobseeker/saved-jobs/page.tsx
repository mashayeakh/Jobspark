'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobService, Job } from '@/services/jobService';
import {
  Bookmark, MapPin, Briefcase, DollarSign,
  Trash2, ArrowUpRight, RefreshCw, Search,
  ExternalLink, Clock, BookmarkX, CheckCircle
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
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center flex-shrink-0">
        <span className="text-base font-bold text-[#4880FF]">{letter}</span>
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
      <img
        src={logo}
        alt={name}
        className="w-full h-full object-cover"
        onError={e => {
          e.currentTarget.parentElement!.innerHTML =
            `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><span class="text-base font-bold text-[#4880FF]">${letter}</span></div>`;
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
        setSavedJobs(res.data);
      } else {
        setError(res.error || 'Failed to load saved jobs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSaved(); }, []);

  const handleRemove = async (jobId: string) => {
    setRemovingIds(prev => ({ ...prev, [jobId]: true }));
    try {
      const res = await jobService.unsaveJob(jobId);
      if (res.success) {
        setSavedJobs(prev => prev.filter(j => j.id !== jobId));
      }
    } finally {
      setRemovingIds(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleApply = async (jobId: string) => {
    setApplyingIds(prev => ({ ...prev, [jobId]: true }));
    try {
      const res = await jobService.applyToJob(jobId);
      if (res.success) {
        setAppliedIds(prev => ({ ...prev, [jobId]: true }));
      }
    } finally {
      setApplyingIds(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const filtered = savedJobs.filter(job =>
    !search ||
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-2">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#4880FF] flex items-center justify-center shadow-sm shadow-blue-200">
              <Bookmark className="w-4 h-4 text-white" />
            </span>
            Saved Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Jobs you&apos;ve bookmarked — apply when you&apos;re ready</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSaved}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4880FF] text-white text-sm font-semibold hover:bg-[#3d72eb] transition-colors shadow-sm shadow-blue-200"
          >
            Browse More <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Saved',   value: savedJobs.length,                                          color: 'text-[#4880FF]', bg: 'bg-blue-50',  icon: Bookmark },
          { label: 'Applied', value: Object.values(appliedIds).filter(Boolean).length,           color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
          { label: 'Removed', value: 0,                                                          color: 'text-gray-500',  bg: 'bg-gray-100', icon: BookmarkX },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold leading-none ${s.color}`}>
                  {loading ? <span className="inline-block w-5 h-4 bg-gray-100 rounded animate-pulse" /> : s.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-[#4880FF] transition-colors">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search saved jobs by title, company or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">✕</button>
          )}
        </div>
        {!loading && (
          <p className="text-xs text-gray-400 mt-2 px-1">
            {filtered.length} of {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
            {search && ' matching your search'}
          </p>
        )}
      </div>

      {/* ── Jobs ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-100 p-10 text-center shadow-sm">
          <BookmarkX className="w-10 h-10 text-red-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Could not load saved jobs</p>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={fetchSaved}
            className="px-5 py-2 bg-[#4880FF] text-white text-sm font-semibold rounded-xl hover:bg-[#3d72eb] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-[#4880FF]" />
          </div>
          <p className="font-semibold text-gray-900 mb-1 text-lg">
            {savedJobs.length === 0 ? 'No saved jobs yet' : 'No matches found'}
          </p>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            {savedJobs.length === 0
              ? 'Browse jobs and click the bookmark icon to save ones you like.'
              : 'Try a different search term.'}
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#4880FF] text-white text-sm font-semibold rounded-xl hover:bg-[#3d72eb] transition-colors"
          >
            Browse Jobs <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => {
            const salary = formatSalary(job);
            const isApplied = appliedIds[job.id];
            const isApplying = applyingIds[job.id];
            const isRemoving = removingIds[job.id];

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="flex items-start gap-4">
                  <CompanyLogo name={job.company?.name ?? ''} logo={job.company?.logo ?? null} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-semibold text-gray-900 hover:text-[#4880FF] transition-colors text-base leading-snug hover:underline"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-0.5 font-medium">{job.company?.name}</p>
                      </div>
                      {/* Location type badge */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#4880FF] border border-blue-100 whitespace-nowrap">
                        {typeLabel(job.locationType)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase className="w-3.5 h-3.5" />
                        {typeLabel(job.type)}
                      </span>
                      {salary && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                          <DollarSign className="w-3.5 h-3.5" />
                          {salary}
                        </span>
                      )}
                      {job.applicationDeadline && (
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action row */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between gap-3 flex-wrap">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4880FF] hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Job Details
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(job.id)}
                      disabled={isRemoving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isRemoving ? 'Removing…' : 'Remove'}
                    </button>
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={isApplying || isApplied}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60 ${
                        isApplied
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                          : 'bg-[#4880FF] text-white hover:bg-[#3d72eb] shadow-sm shadow-blue-200'
                      }`}
                    >
                      {isApplied ? (
                        <><CheckCircle className="w-3.5 h-3.5" /> Applied</>
                      ) : isApplying ? (
                        <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Applying…</>
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
