/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Briefcase, Clock, DollarSign,
  CheckCircle, Bookmark, BookmarkCheck, Share2, Building, Users, ChevronRight, FileText, ExternalLink, Globe
} from 'lucide-react';
import { Job, jobService } from '@/services/jobService';

interface JobDetailTemplateProps {
  job: Job;
  backPath: string;
  backLabel: string;
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function JobSidebarCard({ job, basePath }: { job: Job; basePath: string }) {
  const formattedSalary = job.salaryMin && job.salaryMax 
    ? `$${(job.salaryMin/1000).toFixed(0)}k - $${(job.salaryMax/1000).toFixed(0)}k`
    : job.salaryMin ? `$${(job.salaryMin/1000).toFixed(0)}k+` : 'Negotiable';

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded border border-gray-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.company?.logo ? (
            <img src={job.company.logo} alt="" className="w-full h-full object-contain p-1" />
          ) : (
            <Building className="w-5 h-5 text-gray-200" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`${basePath}/${job.id}`}>
            <h5 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[#0a66c2] group-hover:underline truncate">
              {job.title}
            </h5>
          </Link>
          <p className="text-xs text-gray-600 mt-0.5 truncate">{job.company?.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{job.location}</p>
          <p className="text-[11px] font-bold text-green-700 mt-1">{formattedSalary}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Template ────────────────────────────────────────────────────────────

export default function JobDetailTemplate({ job, backPath, backLabel }: JobDetailTemplateProps) {
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);

  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [saveResponse, appliedResponse] = await Promise.all([
          jobService.checkIfJobSaved(String(job.id)),
          jobService.checkIfJobApplied(String(job.id)),
        ]);
        if (isMounted) {
          if (saveResponse.success && saveResponse.data) setSaved(saveResponse.data.isSaved);
          if (appliedResponse.success && appliedResponse.data) setApplied(appliedResponse.data.isApplied);
        }
        
        // Fetch More Jobs
        const similarRes = await jobService.getJobs({ categoryId: job.categoryId || undefined });
        if (similarRes.success && similarRes.data && isMounted) {
          setSimilarJobs(similarRes.data.filter(j => j.id !== job.id).slice(0, 4));
        }

        const companyRes = await jobService.getJobs(); 
        if (companyRes.success && companyRes.data && isMounted) {
          setCompanyJobs(companyRes.data.filter(j => j.companyId === job.companyId && j.id !== job.id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [job.id, job.categoryId, job.companyId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).catch(console.error);
    }
  };

  const handleSave = async () => {
    if (loadingSave) return;
    setLoadingSave(true);
    try {
      const response = saved ? await jobService.unsaveJob(String(job.id)) : await jobService.saveJob(String(job.id));
      if (response.success) setSaved(!saved);
    } finally { setLoadingSave(false); }
  };

  const handleApply = async () => {
    if (loadingApply || applied) return;
    setLoadingApply(true);
    try {
      const response = await jobService.applyToJob(String(job.id));
      if (response.success) setApplied(true);
    } finally { setLoadingApply(false); }
  };

  const formatList = (val?: string | string[]) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(line => line.trim().length > 0);
    if (typeof val !== 'string') return [];
    return val.split('\n').filter(line => line.trim().length > 0);
  };

  const formattedSalary = job.salaryMin && job.salaryMax 
    ? `$${(job.salaryMin/1000).toFixed(0)}k - $${(job.salaryMax/1000).toFixed(0)}k`
    : job.salaryMin ? `$${(job.salaryMin/1000).toFixed(0)}k+` : 'Negotiable';

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Navbar Placeholder space */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link href={backPath} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to {backLabel}
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">

        {/* ── Main Column ── */}
        <div className="lg:col-span-8 space-y-4">

          {/* Header Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 rounded border border-gray-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={typeof job.company === 'string' ? job.company : job.company?.name || 'Company'} className="w-full h-full object-contain p-2" />
                ) : (
                  <Building className="w-12 h-12 text-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <div>
                      <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">{job.title}</h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-base font-medium">
                        <Link href={`/company/${job.companyId}`} className="text-gray-900 hover:text-[#0a66c2] hover:underline">
                          {typeof job.company === 'string' ? job.company : job.company?.name || 'Company'}
                        </Link>
                        <span className="text-gray-400 font-normal">•</span>
                        <span className="text-gray-600 font-normal">{job.location}</span>
                      </div>
                   </div>
                   <div className="hidden md:flex items-center gap-2">
                      <button onClick={handleShare} className="p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200" aria-label="Share">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handleSave} 
                        disabled={loadingSave}
                        className={`p-2.5 rounded-full border transition-colors flex items-center gap-2 font-bold px-5 ${saved 
                          ? 'bg-gray-900 text-white border-gray-900' 
                          : 'bg-white text-[#0a66c2] border-[#0a66c2] hover:bg-blue-50'}`}
                      >
                         {saved ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                         {saved ? 'Saved' : 'Save'}
                      </button>
                   </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {job.type} • {job.experienceLevel}</span>
                  <span className="flex items-center gap-2 font-bold text-green-700"><DollarSign className="w-4 h-4" /> {formattedSalary}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Posted {timeAgo(job.createdAt)}</span>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleApply}
                    disabled={applied || loadingApply}
                    className={`w-full md:w-auto px-10 py-2.5 rounded-full font-bold transition-all text-base tracking-wide ${applied
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-[#0a66c2] text-white hover:bg-[#004182] shadow-sm'}`}
                  >
                    {applied ? '✓ Applied' : loadingApply ? 'Processing...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">About the job</h2>
            <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed font-normal text-base whitespace-pre-wrap">
              {job.description}
            </div>

            {/* Qualifications */}
            {formatList(job.requirements).length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Qualification</h3>
                <ul className="space-y-4">
                  {formatList(job.requirements).map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-700 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {formatList(job.responsibilities).length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Responsibility</h3>
                <ul className="space-y-4">
                  {formatList(job.responsibilities).map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-700 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(job.skills || []).map((skill: any, i: number) => (
                  <span key={i} className="px-4 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded text-sm font-semibold hover:bg-gray-100 transition-colors cursor-default">
                    {typeof skill === 'string' ? skill : skill.skill?.name || skill.name}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Benefits */}
            {formatList(job.benefits).length > 0 && (
               <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {formatList(job.benefits).map((b, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                           <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                           <span className="text-sm font-medium text-gray-700">{b}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
          </div>

        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Company Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">About the company</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded border border-gray-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                  {job.company?.logo ? <img src={job.company.logo} alt="" className="w-full h-full object-contain p-1" /> : <Building className="w-7 h-7 text-gray-200" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">{job.company?.name || 'Company'}</h4>
                  <p className="text-xs text-gray-500 mt-1">{job.category?.name || job.category} Company</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-4 font-normal">
                {job.company?.description || 'No company description available.'}
              </p>
              <Link href={`/company/${job.companyId}`} className="flex items-center gap-1.5 text-sm font-bold text-[#0a66c2] hover:underline">
                View Company Profile <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {job.company?.website && (
               <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900">
                     <Globe className="w-4 h-4" /> Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
               </div>
            )}
          </div>

          {/* Similar Jobs */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Similar jobs</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {similarJobs.length > 0 ? (
                similarJobs.map(sj => <JobSidebarCard key={sj.id} job={sj} basePath="/jobs" />)
              ) : (
                <p className="p-6 text-sm text-gray-500 italic">No similar jobs found</p>
              )}
            </div>
          </div>

          {/* More from company */}
          {companyJobs.length > 0 && (
             <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900">More from {job.company?.name}</h3>
               </div>
               <div className="divide-y divide-gray-100">
                  {companyJobs.map(cj => <JobSidebarCard key={cj.id} job={cj} basePath="/jobs" />)}
               </div>
             </div>
          )}

        </div>

      </div>
    </div>
  );
}
