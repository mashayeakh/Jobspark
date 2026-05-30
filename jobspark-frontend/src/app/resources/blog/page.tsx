/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  Newspaper,
  Bookmark,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { blogService, Blog } from '@/services/blogService';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of AI in Recruitment: Trends for 2024",
    excerpt: "Discover how generative AI is transforming the hiring landscape, from automated screening to predictive talent analytics.",
    category: "AI & Tech",
    author: "Sarah Chen",
    date: "May 15, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "How to Beat the ATS: A Comprehensive Guide for Job Seekers",
    excerpt: "Learn the secrets of Applicant Tracking Systems and how to optimize your resume for maximum visibility with recruiters.",
    category: "Career Advice",
    author: "Marcus Thorne",
    date: "May 12, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: 3,
    title: "Mastering the Remote Interview: Top Tips from Industry Experts",
    excerpt: "Professional strategies to help you shine through the screen and land your dream remote role in a competitive market.",
    category: "Remote Work",
    author: "Elena Rodriguez",
    date: "May 10, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&q=80&w=800",
    gradient: "from-emerald-500 to-teal-600"
  }
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogService.getAllBlogs();
        if (res.success && res.data) {
          setBlogs(res.data);
        }
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Use real blogs if available, otherwise fall back to empty state or mock data if desired
  const displayBlogs = blogs.length > 0 ? blogs : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border-blue-100 text-blue-600 font-bold uppercase tracking-widest text-[10px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="h-3 w-3 mr-2" />
            JobsPark Intelligence
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Career <span className="text-[#4880FF]">Insights</span> & <br />
            Industry Intel
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Expert advice, technical guides, and market trends to help you navigate the modern professional landscape.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-12 relative animate-in fade-in zoom-in duration-1000">
            <div className="relative group">
              <Input 
                placeholder="Search articles, guides, or authors..." 
                className="h-16 pl-14 pr-6 rounded-2xl bg-white border-slate-100 shadow-xl shadow-blue-100/50 focus:ring-4 focus:ring-blue-100 transition-all text-lg font-medium"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-[#4880FF] transition-colors" />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['All', 'Engineering', 'Product', 'Design', 'Hiring'].map((tag) => (
                <button key={tag} className="px-4 py-1.5 rounded-full bg-white border border-slate-100 text-sm font-bold text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#4880FF] flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Articles</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white">
              <Bookmark className="h-5 w-5 text-slate-400" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white">
              <Share2 className="h-5 w-5 text-slate-400" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-[#4880FF] animate-spin mb-4" />
              <p className="text-slate-500 font-bold">Loading insights...</p>
            </div>
          ) : displayBlogs.length === 0 ? (
             <div className="col-span-full text-center py-20">
                <p className="text-slate-500 font-medium text-lg">No articles have been published yet. Check back soon!</p>
             </div>
          ) : (
            displayBlogs.map((post: any, idx) => {
              // Generate a stable gradient and image based on the post ID if none exist
              const gradients = ["from-blue-500 to-indigo-600", "from-purple-500 to-pink-600", "from-emerald-500 to-teal-600"];
              const defaultImages = [
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&q=80&w=800"
              ];
              
              const gradient = post.gradient || gradients[idx % gradients.length];
              const image = post.image || defaultImages[idx % defaultImages.length];
              const authorText = `${post.author || 'Admin'} - System`;
              const formattedDate = new Date(post.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <Card 
                  key={post.id} 
                  onClick={() => window.location.href = `/resources/blog/${post.id}`}
                  className="group rounded-[32px] border-none bg-white shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-in fade-in slide-in-from-bottom-8" 
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Badge className={`absolute top-4 left-4 h-8 px-4 rounded-xl bg-gradient-to-r ${gradient} text-white border-none font-bold text-[10px] uppercase tracking-widest shadow-lg`}>
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {post.readTime || "5 min read"}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-[#4880FF] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs ring-2 ring-white shadow-sm">
                          {authorText.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{authorText}</span>
                      </div>
                      <Button variant="ghost" className="h-10 w-10 rounded-full p-0 text-slate-400 hover:text-[#4880FF] hover:bg-blue-50 transition-all">
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Newsletter Section */}
        <div className="mt-32 rounded-[48px] bg-slate-900 p-12 md:p-20 relative overflow-hidden text-center animate-in fade-in zoom-in duration-1000">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -ml-48 -mb-48" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/10">
              <Newspaper className="h-8 w-8 text-[#4880FF]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
              Subscribe to <span className="text-[#4880FF]">Industry Weekly</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium mb-10">
              Join 50,000+ professionals getting weekly career strategies and exclusive job market insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Enter your professional email" 
                className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500/20 px-6"
              />
              <Button className="h-14 px-10 rounded-2xl bg-[#4880FF] hover:bg-blue-600 text-white font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/50 shrink-0">
                Join Now
              </Button>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-6">
              NO SPAM. JUST PURE INTELLIGENCE. CANCEL ANYTIME.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-2">JobsPark Intelligence</h4>
            <p className="text-sm text-slate-500 font-medium">Empowering the next generation of global talent.</p>
          </div>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                <Link key={social} href="#" className="text-sm font-bold text-slate-400 hover:text-[#4880FF] transition-colors">{social}</Link>
              ))}
            </div>
        </div>
      </footer>
    </div>
  );
}
