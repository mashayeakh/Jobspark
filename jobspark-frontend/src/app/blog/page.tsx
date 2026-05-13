'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Calendar, 
  ChevronRight, 
  User, 
  Bookmark,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';

export default function BlogPage() {
  const categories = ["Engineering", "Product", "Culture", "Design", "Growth"];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Navbar Spacer ── */}
      <div className="h-20" />

      {/* ── Hero / Featured Post ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] -z-10 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl flex flex-col lg:flex-row items-stretch transition-all duration-500 hover:shadow-2xl hover:border-blue-100">
            <div className="flex-1 min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt="Featured article"
              />
            </div>
            <div className="flex-1 p-12 md:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">Featured</span>
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 12 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                The Future of AI in Modern Recruitment Pipelines.
              </h1>
              <p className="text-lg text-gray-500 font-medium leading-relaxed mb-10">
                Exploring how large language models are transforming candidate matching and reducing bias in high-volume hiring environments.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=11" alt="Author" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">Sarah Jenkins</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Director of AI</p>
                  </div>
                </div>
                <button className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-200 pb-12">
           <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
              <button className="px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-black transition-all">All Stories</button>
              {categories.map(cat => (
                <button key={cat} className="px-8 py-3 bg-white border border-gray-100 text-gray-500 rounded-full text-sm font-black hover:border-blue-500 hover:text-blue-600 transition-all whitespace-nowrap">
                  {cat}
                </button>
              ))}
           </div>
           <div className="w-full md:w-80 relative flex items-center bg-white rounded-full px-6 py-3 border border-gray-100 shadow-sm focus-within:border-blue-500 transition-all">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input type="text" placeholder="Search articles..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder-gray-400" />
           </div>
        </div>
      </section>

      {/* ── Post Grid ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          {
            title: "Scaling Engineering Teams from 1 to 100",
            cat: "Engineering",
            img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
            read: "8 min"
          },
          {
            title: "Designing for the Next Generation of Job Seekers",
            cat: "Design",
            img: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600",
            read: "5 min"
          },
          {
            title: "Our Roadmap: What's coming to JobsPark in 2024",
            cat: "Product",
            img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
            read: "10 min"
          },
          {
            title: "Building a Global Remote-First Company Culture",
            cat: "Culture",
            img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
            read: "15 min"
          },
          {
            title: "Growth Loops vs Funnels: A Modern Approach",
            cat: "Growth",
            img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
            read: "7 min"
          },
          {
            title: "The Importance of Accessibility in HR Technology",
            cat: "Design",
            img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
            read: "6 min"
          },
        ].map((post, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="h-64 rounded-[2rem] overflow-hidden mb-6 relative">
               <img src={post.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
               <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">{post.cat}</span>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">Read Article</button>
               </div>
            </div>
            <div className="space-y-4 px-2">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Oct 18, 2023</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.read}</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                Discover the latest insights and trends in the industry from our team of experts and researchers...
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Newsletter ── */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4" /> Weekly Newsletter
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Get the latest insights <br /> delivered to your inbox.</h2>
            <p className="text-lg text-blue-100 font-medium">Join 50,000+ professionals staying ahead of the curve with our weekly stories.</p>
            <div className="flex flex-col sm:flex-row gap-4 bg-white/10 p-2 rounded-[1.5rem] border border-white/20 backdrop-blur-md">
              <input 
                type="email" 
                placeholder="Enter your work email" 
                className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-3 text-white placeholder-blue-200 font-bold"
              />
              <button className="px-10 py-4 bg-white text-blue-600 rounded-xl font-black shadow-lg hover:bg-blue-50 transition-all active:scale-95">
                Subscribe Now
              </button>
            </div>
            <p className="text-[10px] text-blue-200 font-black uppercase tracking-widest">No spam. Ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
