'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import {
  FileText, MapPin, Briefcase, Clock, Calendar,
  CheckCircle2, XCircle, Clock3, AlertCircle, Sparkles,
  Search, ArrowUpRight, RefreshCw, ChevronRight
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────── */
interface Application {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    type: string;
    locationType: string;
    salaryMin?: number;
    salaryMax?: number;
    vacancy?: number;
    applicationDeadline?: string;
    company: { name: string; logo: string | null; location: string };
  };
  logs: { status: string; changedAt: string; reason?: string | null }[];
}

/* ─── Status config ──────────────────────────────────────────── */
const STATUS_CFG: Record<string, {
  label: string; dot: string; pill: string; icon: React.ElementType
}> = {
  PENDING:             { label: 'Pending',             dot: 'bg-amber-400',   pill: 'bg-amber-50 text-amber-700 border-amber-200',   icon: Clock3 },
  UNDER_REVIEW:        { label: 'Under Review',        dot: 'bg-blue-400',    pill: 'bg-blue-50 text-blue-700 border-blue-200',      icon: AlertCircle },
  SHORTLISTED:         { label: 'Shortlisted',         dot: 'bg-indigo-400',  pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',icon: Sparkles },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', dot: 'bg-purple-400',  pill: 'bg-purple-50 text-purple-700 border-purple-200',icon: Calendar },
  OFFER_EXTENDED:      { label: 'Offer Extended',      dot: 'bg-green-400',   pill: 'bg-green-50 text-green-700 border-green-200',   icon: CheckCircle2 },
  ACCEPTED:            { label: 'Accepted',            dot: 'bg-green-500',   pill: 'bg-green-50 text-green-700 border-green-200',   icon: CheckCircle2 },
  REJECTED:            { label: 'Rejected',            dot: 'bg-red-400',     pill: 'bg-red-50 text-red-700 border-red-200',         icon: XCircle },
  WITHDRAWN:           { label: 'Withdrawn',           dot: 'bg-gray-400',    pill: 'bg-gray-50 text-gray-600 border-gray-200',      icon: XCircle },
};

/* ─── Tab definitions ────────────────────────────────────────── */
const TABS: { label: string; statuses: string[] }[] = [
  { label: 'All',        statuses: [] },
  { label: 'Active',     statuses: ['PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED'] },
  { label: 'Offers',     statuses: ['OFFER_EXTENDED', 'ACCEPTED'] },
  { label: 'Rejected',   statuses: ['REJECTED', 'WITHDRAWN'] },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function formatSalary(min?: number, max?: number) {
  if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`;
  if (min) return `$${(min / 1000).toFixed(0)}k+`;
  if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
  return null;
}

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* ─── Status Badge ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? {
    label: status.replace(/_/g, ' '),
    dot: 'bg-gray-400',
    pill: 'bg-gray-50 text-gray-600 border-gray-200',
    icon: Clock3,
  };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.pill}`}>
      <Icon className="w-3 h-3 flex-shrink-0" />
      {cfg.label}
    </span>
  );
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
export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // apiClient wraps raw JSON into res.data
      // Backend returns: { success: true, result: [...] }
      const res = await apiClient.get<{ success: boolean; message: string; result: Application[] }>(
        '/applications/my-applications'
      );
      if (res.success && res.data) {
        // res.data is the raw backend response, result is the array
        const list = (res.data as any)?.result;
        setApplications(Array.isArray(list) ? list : []);
      } else {
        setError(res.error || 'Failed to load applications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  /* Derived */
  const tabCounts = TABS.reduce<Record<string, number>>((acc, t) => {
    acc[t.label] = t.statuses.length === 0
      ? applications.length
      : applications.filter(a => t.statuses.includes(a.status)).length;
    return acc;
  }, {});

  const currentTab = TABS.find(t => t.label === activeTab)!;
  const filtered = applications.filter(app => {
    const statusOk = currentTab.statuses.length === 0 || currentTab.statuses.includes(app.status);
    const searchOk = !search ||
      app.job.title.toLowerCase().includes(search.toLowerCase()) ||
      app.job.company.name.toLowerCase().includes(search.toLowerCase());
    return statusOk && searchOk;
  });

  const stats = [
    { label: 'Total Applied',  value: applications.length,                                                                               color: 'text-gray-900',   iconBg: 'bg-gray-100', icon: FileText },
    { label: 'In Progress',    value: applications.filter(a => ['PENDING','UNDER_REVIEW','SHORTLISTED','INTERVIEW_SCHEDULED'].includes(a.status)).length, color: 'text-[#4880FF]', iconBg: 'bg-blue-50',  icon: Clock3 },
    { label: 'Offers',         value: applications.filter(a => ['OFFER_EXTENDED','ACCEPTED'].includes(a.status)).length,                 color: 'text-green-700',  iconBg: 'bg-green-50', icon: CheckCircle2 },
    { label: 'Rejected',       value: applications.filter(a => ['REJECTED','WITHDRAWN'].includes(a.status)).length,                     color: 'text-red-600',    iconBg: 'bg-red-50',   icon: XCircle },
  ];

  return (
    <div className="space-y-6 p-2">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#4880FF] flex items-center justify-center shadow-sm shadow-blue-200">
              <FileText className="w-4 h-4 text-white" />
            </span>
            My Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track the status of every job you&apos;ve applied to</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchApplications}
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
            Browse Jobs <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold leading-none ${s.color}`}>
                  {loading ? <span className="inline-block w-6 h-5 bg-gray-100 rounded animate-pulse" /> : s.value}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-[#4880FF] transition-colors">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">✕</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                activeTab === tab.label
                  ? 'bg-[#4880FF] text-white border-[#4880FF] shadow-sm shadow-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#4880FF] hover:text-[#4880FF]'
              }`}
            >
              {tab.label}
              {!loading && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.label ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tabCounts[tab.label]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-100 p-10 text-center shadow-sm">
          <XCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">Could not load applications</p>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-5 py-2 bg-[#4880FF] text-white text-sm font-semibold rounded-xl hover:bg-[#3d72eb] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#4880FF]" />
          </div>
          <p className="font-semibold text-gray-900 mb-1 text-lg">
            {applications.length === 0 ? 'No applications yet' : 'No results found'}
          </p>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            {applications.length === 0
              ? 'Start applying to jobs that match your skills and interests.'
              : 'Try adjusting your search or switching tabs.'}
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
          {filtered.map(app => {
            const salary = formatSalary(app.job.salaryMin, app.job.salaryMax);
            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="flex items-start gap-4">
                  <CompanyLogo name={app.job.company.name} logo={app.job.company.logo} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <Link
                          href={`/jobs/${app.job.id}`}
                          className="font-semibold text-gray-900 hover:text-[#4880FF] transition-colors text-base leading-snug hover:underline"
                        >
                          {app.job.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-0.5 font-medium">{app.job.company.name}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.job.location || app.job.company.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase className="w-3.5 h-3.5" />
                        {app.job.type?.replace('_', ' ')} · {app.job.locationType}
                      </span>
                      {salary && (
                        <span className="text-xs font-semibold text-gray-700">{salary}</span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        Applied {timeAgo(app.appliedAt)}
                      </span>
                      {app.job.applicationDeadline && (
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          Deadline: {new Date(app.job.applicationDeadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Latest recruiter note */}
                    {app.logs?.[0]?.reason && (
                      <p className="mt-2.5 text-xs text-gray-400 italic bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        &ldquo;{app.logs[0].reason}&rdquo;
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/jobs/${app.job.id}`}
                    className="flex-shrink-0 w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#4880FF] hover:border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
