"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { blogService, Blog } from '@/services/blogService';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const id = params.id as string;
        if (!id) return;
        
        const res = await blogService.getSingleBlog(id);
        if (res.success && res.data) {
          setBlog(res.data);
        }
      } catch (error) {
        console.error("Failed to load blog:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#4880FF] animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-lg">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="h-20 w-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-500 mb-6">
          <Sparkles className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Article Not Found</h1>
        <p className="text-slate-500 font-medium mb-8">This article might have been removed or doesn't exist.</p>
        <Button onClick={() => router.push('/resources/blog')} className="h-12 px-8 rounded-xl bg-[#4880FF] hover:bg-blue-600 text-white font-bold">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Insights
        </Button>
      </div>
    );
  }

  const authorText = `${blog.author || 'Admin'} - System`;
  const formattedDate = new Date(blog.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const readTime = blog.readTime || "5 min read";
  const image = blog.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/resources/blog')} className="text-slate-500 hover:text-slate-900 font-bold rounded-xl -ml-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <div className="flex items-center gap-4 mb-8 text-sm font-bold tracking-widest text-[#4880FF] uppercase">
          <Badge className="h-8 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">
            {blog.category}
          </Badge>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" />
            {readTime}
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
          {blog.title}
        </h1>

        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-10">
          {blog.excerpt}
        </p>

        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
          <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xl ring-4 ring-white shadow-md">
            {authorText.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg">{authorText}</div>
            <div className="text-slate-400 font-medium text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="w-full h-[400px] md:h-[600px] rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200">
          <img src={image} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 pb-40">
        <div 
          className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-600 font-medium leading-relaxed [&>p]:mb-6 [&>h2]:text-3xl [&>h2]:font-black [&>h2]:text-slate-900 [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-10 [&>h3]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>li]:mb-2"
          dangerouslySetInnerHTML={{ 
            __html: blog.content
              // In case the AI mixes markdown bold with HTML
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              // If the AI didn't use <p> tags but used \n for breaks, convert them to <br> 
              // (but only if it doesn't look like it's already full of HTML)
              .replace(/(?<!>)\n(?!<)/g, '<br/>')
          }}
        />
      </div>
    </div>
  );
}
