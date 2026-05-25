'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Building2, MapPin, Users, Globe, Search, Filter, Briefcase, SlidersHorizontal, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { companyService, Company } from '@/services/companyService';

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-green-500 to-emerald-600',
  'from-purple-500 to-fuchsia-600',
  'from-orange-500 to-red-600',
  'from-blue-600 to-blue-800',
  'from-teal-400 to-emerald-500',
];

interface UICompany extends Company {
  color: string;
  logoText: string;
  type: string;
  openJobs: number;
}

export default function CompaniesClient() {
  // Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sizeFilter, setSizeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('most_jobs');
  const [showFilters, setShowFilters] = useState(false);

  const [companies, setCompanies] = useState<UICompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companyService.getAllCompanies();
        const mapped: UICompany[] = data.map((company, index) => {
          const names = company.name.split(' ');
          const logoText = names.length > 1 
            ? `${names[0][0]}${names[1][0]}`.toUpperCase()
            : company.name.substring(0, 2).toUpperCase();
            
          return {
            ...company,
            color: gradients[index % gradients.length],
            logoText,
            type: 'Enterprise', // Default type
            openJobs: company._count?.jobs || 0
          };
        });
        setCompanies(mapped);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Derived distinct options for dropdowns
  const industries = ['All', ...Array.from(new Set(companies.map(c => c.industry).filter((x): x is string => !!x)))];
  const locations = ['All', ...Array.from(new Set(companies.map(c => c.location).filter((x): x is string => !!x)))];
  const sizes = ['All', ...Array.from(new Set(companies.map(c => c.size).filter((x): x is string => !!x)))];
  const types = ['All', ...Array.from(new Set(companies.map(c => c.type).filter((x): x is string => !!x)))];

  // Filtering Logic
  const filteredCompanies = useMemo(() => {
    let result = companies;

    // 1. Search filter
    if (searchTerm) {
      result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // 2. Industry filter
    if (industryFilter !== 'All') {
      result = result.filter(c => c.industry === industryFilter);
    }
    // 3. Location filter
    if (locationFilter !== 'All') {
      result = result.filter(c => c.location === locationFilter);
    }
    // 4. Size filter
    if (sizeFilter !== 'All') {
      result = result.filter(c => c.size === sizeFilter);
    }
    // 5. Type filter
    if (typeFilter !== 'All') {
      result = result.filter(c => c.type === typeFilter);
    }

    // 6. Sorting
    if (sortBy === 'most_jobs') {
      result = [...result].sort((a, b) => b.openJobs - a.openJobs);
    } else if (sortBy === 'least_jobs') {
      result = [...result].sort((a, b) => a.openJobs - b.openJobs);
    } else if (sortBy === 'name_asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [companies, searchTerm, industryFilter, locationFilter, sizeFilter, typeFilter, sortBy]);

  return (
    <main className="min-h-screen pt-16 pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Explore Top Companies
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover great places to work, explore company cultures, and find your next career opportunity with industry leaders.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium">Loading companies...</p>
          </div>
        ) : (
          <>
            {/* 6 Professional Filtering Options */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-12 transition-all duration-300">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center gap-3 cursor-pointer group text-left focus:outline-none"
          >
            <div className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Advanced Filters</h2>
              {!showFilters && (
                <p className="text-xs text-gray-500 font-medium mt-0.5">Click to expand filtering options</p>
              )}
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                {filteredCompanies.length} Results
              </span>
              <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {showFilters && (
            <div className="pt-6 mt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Search Filter */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by company name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* 2. Industry Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Industry</label>
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>

                {/* 3. Location Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>

                {/* 4. Company Size Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Company Size</label>
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    {sizes.map(sz => <option key={sz} value={sz}>{sz}</option>)}
                  </select>
                </div>

                {/* 5. Company Type Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Company Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    {types.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                {/* 6. Sort By Option */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    <option value="most_jobs">Most Open Jobs</option>
                    <option value="least_jobs">Least Open Jobs</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setIndustryFilter('All');
                    setLocationFilter('All');
                    setSizeFilter('All');
                    setTypeFilter('All');
                    setSortBy('most_jobs');
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn&apos;t find any companies matching your current filters. Try adjusting your search criteria or clearing filters.
            </p>
          </div>
        )}

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompanies.map((company) => (
            <Link
              href={`/companies/${company.id}`}
              key={company.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group block"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${company.color} flex items-center justify-center text-white text-xl font-bold shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    {company.logoText}
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-blue-100 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {company.openJobs} Jobs
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {company.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600">
                    {company.type}
                  </span>
                </div>

                <div className="space-y-2.5 mt-4 text-gray-600">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{company.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{company.size}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-2 flex justify-end">
                <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:text-blue-700 group-hover:gap-2 transition-all">
                  View Openings <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        </>
        )}

        {/* CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-90 relative z-10" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">Are you hiring?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg relative z-10">
            Join thousands of companies using JobSpark to find top talent and build amazing teams.
          </p>
          <Link
            href="/hire"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 hover:scale-105 hover:shadow-lg transition-all duration-300 relative z-10"
          >
            Post a Job Today
          </Link>
        </div>

      </div>
    </main>
  );
}
