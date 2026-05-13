'use client';

import React from 'react';
import { 
  Newspaper, 
  Download, 
  ExternalLink, 
  Share2, 
  Calendar,
  Zap,
  Camera,
  Mail,
  ArrowRight
} from 'lucide-react';

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-8">
              <Newspaper className="w-4 h-4" /> Press & Media
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
              Sharing our <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Story with the world.</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
              Everything you need to know about JobsPark—latest news, media assets, and company updates.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-gray-200">
                <Mail className="w-5 h-5 text-blue-400" /> Contact Press Team
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black hover:border-blue-200 transition-all">
                Download Media Kit
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* ── Main Content: News ── */}
        <div className="lg:col-span-8 space-y-12">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            Latest Updates
            <div className="flex-1 h-px bg-gray-100" />
          </h2>

          {[
            {
              title: "JobsPark Secures $45M in Series B Funding to Scale Global Talent Platform",
              date: "Oct 24, 2023",
              source: "TechCrunch",
              category: "Funding",
              image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=600"
            },
            {
              title: "How AI is Revolutionizing the Way Companies Find Culture-Fit Candidates",
              date: "Sept 12, 2023",
              source: "Forbes",
              category: "Innovation",
              image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
            },
            {
              title: "JobsPark Named One of the Top 10 Fastest Growing Startups of 2023",
              date: "Aug 05, 2023",
              source: "Inc. Magazine",
              category: "Award",
              image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600"
            },
          ].map((news, i) => (
            <div key={i} className="group flex flex-col md:flex-row gap-8 items-center bg-white border border-gray-50 rounded-[2.5rem] p-6 hover:shadow-xl hover:border-blue-100 transition-all">
              <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100/50">{news.category}</span>
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {news.date}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {news.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-gray-500 italic">— {news.source}</span>
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:gap-4 transition-all">
                    Read More <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full py-6 rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 font-black hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-3">
            Load More News <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Sidebar: Assets ── */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-200">
            <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-400 fill-current" /> Media Assets
            </h3>
            <div className="space-y-4">
              {[
                { label: "Company Logo Kit", size: "2.4 MB", icon: Download },
                { label: "Executive Headshots", size: "15.8 MB", icon: Camera },
                { label: "Product Screenshots", size: "8.2 MB", icon: Share2 },
                { label: "Brand Guidelines", size: "1.1 MB", icon: Newspaper },
              ].map((asset, i) => (
                <button key={i} className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group text-left">
                  <div>
                    <p className="font-black text-sm mb-1">{asset.label}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{asset.size}</p>
                  </div>
                  <asset.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="text-xl font-black mb-4 relative z-10">Press Inquiry?</h3>
            <p className="text-blue-100 text-sm font-medium mb-8 relative z-10 leading-relaxed">
              For interviews or specific data requests, please reach out directly to our communications team.
            </p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-xl font-black shadow-lg hover:shadow-xl transition-all active:scale-95 relative z-10">
              Email Press Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
