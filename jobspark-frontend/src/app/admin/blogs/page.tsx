/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { Label } from "@/components/ui/label";
import { blogService, Blog } from '@/services/blogService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AdminBlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    setIsLoading(true);
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

  React.useEffect(() => {
    fetchBlogs();
  }, []);

  const [formData, setFormData] = useState<Blog>({
    title: '',
    category: 'AI & Tech',
    excerpt: '',
    content: '',
    author: 'Admin',
    status: 'Draft'
  });

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      toast.error("Please enter a topic for AI to write about");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("JobsPark AI is writing your article...");
    
    try {
      const res = await blogService.generateWithAI(aiTopic);
      if (res.success && res.data) {
        setFormData({
          ...formData,
          title: res.data.title,
          category: res.data.category,
          excerpt: res.data.excerpt,
          content: res.data.content
        });
        toast.success("AI Generation complete! You can now refine the content.", { id: toastId });
      } else {
        toast.error(res.error || "AI failed to generate content", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred during AI generation", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    if (!formData.title || !formData.content) {
      toast.error("Title and Content are required");
      return;
    }

    setIsSaving(true);
    try {
      const res = await blogService.createBlog({ ...formData, status });
      if (res.success) {
        toast.success(`Article ${status === 'Published' ? 'published' : 'saved as draft'} successfully!`);
        setIsModalOpen(false);
        fetchBlogs();
        setFormData({ title: '', category: 'AI & Tech', excerpt: '', content: '', author: 'Admin', status: 'Draft' });
      }
    } catch (err) {
      toast.error("Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminShell title="Blog Management">
      <div className="p-8 space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Library</h1>
            <p className="text-slate-500 font-medium mt-1">Manage and publish industry insights for your users.</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4880FF] hover:bg-blue-600 h-12 px-6 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95">
                <Plus className="h-5 w-5 mr-2" />
                Create New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border-none shadow-2xl p-0">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                  Create Professional <span className="text-[#4880FF]">Article</span>
                </DialogTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full">
                    <X className="h-5 w-5 text-slate-400" />
                  </Button>
                </div>
              </div>

              <div className="p-8 space-y-10">
                {/* AI MAGIC SECTION */}
                <div className="p-8 rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-blue-400">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight">Write with JobsPark AI</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Input 
                          placeholder="What should this article be about? (e.g. Tips for remote interviews)" 
                          className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500/20 px-6"
                          value={aiTopic}
                          onChange={(e) => setAiTopic(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className="h-14 px-8 rounded-2xl bg-[#4880FF] hover:bg-blue-600 text-white font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/50 shrink-0 disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6 mr-2" />}
                        {isGenerating ? 'AI is Writing...' : 'Generate with AI'}
                      </Button>
                    </div>
                    <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest pl-2">
                      Our AI will generate the title, category, excerpt, and full content.
                    </p>
                  </div>
                </div>

                {/* FORM SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Article Title</Label>
                    <Input 
                      placeholder="Enter a catchy title" 
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-900"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Category</Label>
                    <select 
                      className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                      value={formData.category || 'AI & Tech'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>AI & Tech</option>
                      <option>Career Advice</option>
                      <option>Remote Work</option>
                      <option>Leadership</option>
                      <option>Industry Trends</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Short Excerpt</Label>
                  <textarea 
                    placeholder="Briefly describe what this article is about..." 
                    className="w-full min-h-[100px] rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white p-6 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  />
                </div>

                <div className="space-y-3 pb-8">
                  <Label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Full Content</Label>
                  <textarea 
                    placeholder="Write your article content here..." 
                    className="w-full min-h-[400px] rounded-[32px] border border-slate-100 bg-slate-50/50 focus:bg-white p-8 text-lg leading-relaxed font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    value={formData.content || ''}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-slate-50/90 backdrop-blur-md px-8 py-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleSave('Draft')}
                  disabled={isSaving}
                  className="h-14 px-8 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
                  Save as Draft
                </Button>
                <Button 
                  onClick={() => handleSave('Published')}
                  disabled={isSaving}
                  className="h-14 flex-1 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200"
                >
                  {isSaving ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <CheckCircle2 className="h-6 w-6 mr-2 text-emerald-400" />}
                  Publish Article Now
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Articles', value: '24', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Published', value: '18', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Drafts', value: '6', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Total Views', value: '12.4k', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by title, author, or category..." 
              className="pl-11 h-12 bg-white border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-100 bg-white font-bold text-slate-600 hover:bg-slate-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Blog Table */}
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Article Details</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Author</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium">
                        Loading blogs...
                      </td>
                    </tr>
                  ) : blogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium">
                        No articles found. Start creating one!
                      </td>
                    </tr>
                  ) : blogs.map((blog: any) => (
                    <tr key={blog.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-[#4880FF] transition-colors">{blog.title}</span>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              <Calendar className="h-3 w-3" />
                              {new Date(blog.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              <Eye className="h-3 w-3" />
                              {blog.views || 0} views
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-100/50 font-bold text-[10px] uppercase px-3 py-1">
                          {blog.category}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold border-2 border-white shadow-sm">
                            {blog.author.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-600">{blog.author}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={blog.status === 'Published' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}>
                          {blog.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm">
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-100 shadow-xl font-sans">
                            <DropdownMenuItem className="flex items-center gap-2 py-2.5 cursor-pointer focus:bg-blue-50 focus:text-blue-600">
                              <Eye className="h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 py-2.5 cursor-pointer focus:bg-blue-50 focus:text-blue-600">
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 py-2.5 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
