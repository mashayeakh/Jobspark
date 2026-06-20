/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Company, companyService } from '@/services/companyService';
import { Loader2, MapPin, Users, Globe, Building2, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
export default function CompanyDetailsClient({ id }: { id: string }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [suggestedCompanies, setSuggestedCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [currentJobPage, setCurrentJobPage] = useState(1);

  const jobs = useMemo(() => company?.jobs ?? [], [company?.jobs]);
  const jobsPerPage = 5;
  const totalJobPages = Math.ceil(jobs.length / jobsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentJobPage - 1) * jobsPerPage;
    return jobs.slice(start, start + jobsPerPage);
  }, [jobs, currentJobPage]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await companyService.getCompanyById(id);
        setCompany(data);

        // Fetch others for "People Also View"
        const allCompanies = await companyService.getAllCompanies();
        setSuggestedCompanies(allCompanies.filter(c => c.id !== id).slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-blue-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-medium text-gray-500">Loading company profile...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
      </div>
    );
  }

  const names = company.name.split(' ');
  const logoText = names.length > 1
    ? `${names[0][0]}${names[1][0]}`.toUpperCase()
    : company.name.substring(0, 2).toUpperCase();

  const coverImage = company.coverImage || `https://source.unsplash.com/1600x400/?${encodeURIComponent(company.industry || 'office')}`;

  const rawAboutText = company.description || `Welcome to ${company.name}. We are a leading force in the ${company.industry} industry, driven by innovation and excellence. Our dedicated team works tirelessly to create solutions that meet the evolving needs of our customers. Join us as we continue to shape the future of ${company.industry}.`;
  const trimmedAboutText = rawAboutText.length > 360 ? `${rawAboutText.slice(0, 360).trim()}...` : rawAboutText;
  const aboutText = showFullAbout ? rawAboutText : trimmedAboutText;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Cover Image Banner */}
      <div
        className="h-64 md:h-80 w-full bg-cover bg-center"
        style={{ backgroundImage: `url("${coverImage}")`, backgroundColor: '#e2e8f0' }}
      >
        <div className="w-full h-full bg-black/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start justify-between border border-gray-100">
          <div className="flex gap-6 items-center w-full md:w-auto">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-900 rounded-2xl shrink-0 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white overflow-hidden relative">
              {company.logo ? (
                <Image src={company.logo} alt={company.name} fill className="object-cover" unoptimized />
              ) : logoText}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{company.tagline || `Innovating ${company.industry}`}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Website</span>
                  <Link href={company.website || '#'} className="text-blue-600 hover:underline flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {company.website?.replace(/^https?:\/\//, '') || 'Website Unavailable'}
                  </Link>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Location</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {company.location || 'Remote'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Company Size</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {company.size || 'Not Specified'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Industry</span>
                  <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {company.industry}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all hover:shadow-md">
              + Follow
            </button>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* About Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">About {company.name}</h2>
                  <p className="text-gray-500 mt-2">A polished company profile designed for professionals and talent.</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">{company._count?.jobs ?? jobs.length} open roles</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>{company.industry || 'Industry not specified'}</span>
                </div>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-4 mt-6">
                <p>{aboutText}</p>
                {rawAboutText.length > 360 && (
                  <button
                    onClick={() => setShowFullAbout(!showFullAbout)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {showFullAbout ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            </section>



            {/* Jobs Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Jobs From {company.name}</h2>
                <Link href="/jobs" className="text-blue-600 font-semibold hover:underline text-sm">
                  View All Jobs
                </Link>
              </div>

              <div className="space-y-4">
                {paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job: any) => (
                    <div key={job.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow group flex items-start gap-4 cursor-pointer">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg font-bold shrink-0">
                        {logoText}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Link href={`/jobs/${job.id}`} className="block">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                            </Link>
                            <p className="text-sm text-gray-500 mb-3">{company.name} • {job.location || 'Remote'}</p>
                          </div>
                          <button 
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!authService.isAuthenticated()) {
                                toast.error('Please log in to save jobs.');
                                return;
                              }
                            }}
                          >
                            <Bookmark className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
                          <span className="bg-gray-100 px-3 py-1 rounded-full">{job.jobType || 'Full Time'}</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full">{job.experienceLevel || 'Mid Level'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No open positions at this time. Check back later!
                  </div>
                )}
              </div>

              {totalJobPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentJobPage(p => Math.max(1, p - 1))}
                    disabled={currentJobPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 font-medium">
                    Page {currentJobPage} of {totalJobPages}
                  </span>
                  <button
                    onClick={() => setCurrentJobPage(p => Math.min(totalJobPages, p + 1))}
                    disabled={currentJobPage === totalJobPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">

            {/* People Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">People at {company.name}</h2>
              <div className="space-y-5">
                {company.recruiters && company.recruiters.length > 0 ? (
                  company.recruiters.slice(0, 4).map((recruiter: any) => (
                    <div key={recruiter.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden relative">
                        {recruiter.user?.image ? (
                          <Image src={recruiter.user.image} alt={recruiter.user.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-700 font-bold">
                            {recruiter.user?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{recruiter.user?.name || 'Recruiter'}</h4>
                        <p className="text-xs text-gray-500 truncate">{recruiter.position || 'Talent Acquisition'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No team members listed yet.
                  </div>
                )}
              </div>
              {company.recruiters && company.recruiters.length > 4 && (
                <button className="w-full mt-6 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Show All
                </button>
              )}
            </section>

            {/* People Also View Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">People Also View</h2>
              <div className="space-y-5">
                {suggestedCompanies.map((sc) => {
                  const scNames = sc.name.split(' ');
                  const scLogo = scNames.length > 1
                    ? `${scNames[0][0]}${scNames[1][0]}`.toUpperCase()
                    : sc.name.substring(0, 2).toUpperCase();

                  return (
                    <Link href={`/companies/${sc.id}`} key={sc.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{sc.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{sc.location || 'Remote'}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {scLogo}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
