/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code, Palette, Megaphone, BarChart, Heart, Wrench, Camera, Music, 
  Briefcase, GraduationCap, Cpu, Search, ArrowRight,
  Terminal, CircleDollarSign, PenTool, HeartPulse, Truck, 
  BrainCircuit, TrendingUp, Headset, Landmark, Users 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { categoryService, Category } from '@/services/categoryService';
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categoriesData, loading, error } = useApi(() => categoryService.getActiveCategories());

  // Icon mapping for backend icons
  const iconMap: { [key: string]: any } = {
    'cpu': Cpu,
    'palette': Palette,
    'megaphone': Megaphone,
    'bar-chart': BarChart,
    'heart': Heart,
    'wrench': Wrench,
    'camera': Camera,
    'music': Music,
    'briefcase': Briefcase,
    'graduation-cap': GraduationCap,
    'code': Code,
  };

  // Color mapping from hex to Tailwind gradients (matching hardcoded version)
  const colorMap: { [key: string]: string } = {
    '#3b82f6': 'from-blue-500 to-blue-600',  // Technology
    '#ec4899': 'from-purple-500 to-purple-600',  // Design
    '#10b981': 'from-green-500 to-green-600',   // Sales/Healthcare
    '#f59e0b': 'from-orange-500 to-orange-600', // Skilled Trades
    '#6366f1': 'from-indigo-500 to-indigo-600', // Media
    '#eab308': 'from-yellow-500 to-yellow-600', // Entertainment
    '#6b7280': 'from-gray-600 to-gray-700',     // Business
    '#14b8a6': 'from-teal-500 to-teal-600',     // Education
    '#ef4444': 'from-red-500 to-red-600',       // Healthcare
    // '#ec4899': 'from-pink-500 to-pink-600',     // Marketing
  };

  // Fallback mapping by category name since backend icons might be generic
  const titleIconMap: { [key: string]: any } = {
    'Software & Engineering': Terminal,
    'Development': Code,
    'Design & Creative': Palette,
    'Finance & Accounting': CircleDollarSign,
    'Design': PenTool,
    'Healthcare': HeartPulse,
    'Marketing': Megaphone,
    'Business': Briefcase,
    'Education': GraduationCap,
    'Operations & Logistics': Truck,
    'Data & AI': BrainCircuit,
    'Marketing & Sales': TrendingUp,
    'Customer Support': Headset,
    'Finance': Landmark,
    'Human Resources': Users,
  };

  const titleColorMap: { [key: string]: string } = {
    'Software & Engineering': 'from-indigo-500 to-indigo-600',
    'Development': 'from-cyan-500 to-cyan-600',
    'Design & Creative': 'from-pink-500 to-pink-600',
    'Finance & Accounting': 'from-emerald-500 to-emerald-600',
    'Design': 'from-purple-500 to-purple-600',
    'Healthcare': 'from-rose-500 to-rose-600',
    'Marketing': 'from-orange-500 to-orange-600',
    'Business': 'from-green-500 to-green-600',
    'Education': 'from-yellow-500 to-yellow-600',
    'Operations & Logistics': 'from-teal-500 to-teal-600',
    'Data & AI': 'from-sky-500 to-sky-600',
    'Marketing & Sales': 'from-red-500 to-red-600',
    'Customer Support': 'from-blue-500 to-blue-600',
    'Finance': 'from-lime-500 to-lime-600',
    'Human Resources': 'from-fuchsia-500 to-fuchsia-600',
  };

  const fallbackColors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-rose-500 to-rose-600',
    'from-pink-500 to-pink-600',
    'from-yellow-500 to-yellow-600',
    'from-cyan-500 to-cyan-600',
  ];

  const getColorForCategory = (name: string, backendColorHex?: string) => {
    if (titleColorMap[name]) return titleColorMap[name];
    if (backendColorHex && colorMap[backendColorHex]) return colorMap[backendColorHex];
    
    // Deterministic fallback color based on category name length & char codes
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return fallbackColors[Math.abs(hash) % fallbackColors.length];
  };

  // Transform API data to component format
  const categories = categoriesData?.map(category => ({
    id: category.slug,
    icon: titleIconMap[category.name] || iconMap[category.icon] || Code,
    title: category.name,
    count: category._count.jobs.toString(),
    color: getColorForCategory(category.name, category.color),
    jobs: category.subcategories.map((sub: any) => sub.name)
  })) || [];

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-6 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          {/* <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Find opportunities in your field of expertise. We have jobs across all industries and experience levels.
          </p> */}
        </div>

        {/* Search Bar */}
        {/* <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search for any category or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent shadow-sm rounded-2xl text-gray-900 text-lg focus:ring-0 focus:border-blue-500 hover:shadow-md focus:shadow-lg focus:outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>
        </div> */}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">❌ Failed to load categories</div>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                  className="group relative flex flex-col w-full aspect-[5/4] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Top area */}
                  <div className={`flex-1 flex items-center justify-center w-full relative bg-gradient-to-br ${category.color}`}>
                    <Icon className="w-16 h-16 text-black/20 group-hover:opacity-0 transition-opacity duration-300" />
                    
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-bold tracking-[0.2em] text-sm uppercase">
                        {category.count} {parseInt(category.count) === 1 ? 'JOB' : 'JOBS'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom area */}
                  <div className="h-12 bg-[#e2e4e6] flex items-center justify-center w-full">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide px-2 text-center truncate w-full">
                      {category.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Category Dialog */}
        <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
          {selectedCategoryData && (
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
              <div className="p-8 pb-6">
                <DialogHeader className="mb-8">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 bg-gradient-to-br ${selectedCategoryData.color} rounded-2xl flex items-center justify-center shadow-md`}>
                      <selectedCategoryData.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <DialogTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {selectedCategoryData.title}
                      </DialogTitle>
                      <DialogDescription className="text-base text-gray-500 mt-1 font-medium">
                        {selectedCategoryData.count} open positions available
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Popular Specializations</h4>
                  <div className="flex flex-wrap gap-2.5 max-h-[250px] overflow-y-auto pb-2">
                    {selectedCategoryData.jobs.map((job, index) => (
                      <Link
                        href={`/jobs?category=${selectedCategoryData.id}`}
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-50 text-gray-700 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-200"
                      >
                        {job}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Explore all opportunities</span>
                <Link
                  href={`/jobs?category=${selectedCategoryData.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  View All Jobs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Categories;
