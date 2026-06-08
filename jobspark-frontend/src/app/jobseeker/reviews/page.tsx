'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2,
  Clock,
  Loader2,
  X,
  Star,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { reviewService, Review } from '@/services/reviewService';
import { authService } from '@/services/authService';

export default function JobseekerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [company, setCompany] = useState('');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await reviewService.getReviews();
      if (response.success && response.data) {
        const user = authService.getUser();
        // Filter reviews to show only the logged-in user's reviews
        const myReviews = response.data.filter((r) => r.authorId === user?.id);
        setReviews(myReviews);
      }
    } catch (error) {
      toast.error("Failed to load your reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Review content is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await reviewService.createReview({
        rating,
        content,
        company: company.trim() || undefined,
        type: 'jobseeker'
      });

      if (response.success) {
        toast.success('Review published successfully!');
        setIsModalOpen(false);
        setContent('');
        setRating(5);
        setCompany('');
        fetchReviews();
      } else {
        toast.error(response.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive = false, setStar?: (val: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        onClick={() => interactive && setStar && setStar(i + 1)}
        className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${
          i < currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Success Stories</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your reviews and share your success with the JobsPark community.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4880FF] hover:bg-blue-600 h-12 px-6 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95">
              <Plus className="h-5 w-5 mr-2" />
              Write New Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] border-none shadow-2xl p-0">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                Share Your <span className="text-[#4880FF]">Experience</span>
              </DialogTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full">
                  <X className="h-5 w-5 text-slate-400" />
                </Button>
              </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Rating</Label>
                <div className="flex items-center gap-2">
                  {renderStars(rating, true, setRating)}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Company (Optional)</Label>
                <Input 
                  placeholder="Where did you get hired?" 
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all font-bold text-slate-900 px-4 focus:ring-2 focus:ring-blue-100"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="space-y-3 pb-4">
                <Label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Your Story</Label>
                <textarea 
                  placeholder="Tell us how JobsPark helped you..." 
                  className="w-full min-h-[200px] rounded-[24px] border border-slate-200 bg-slate-50 focus:bg-white p-6 text-base font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  value={content}
                  required
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="h-14 px-8 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-white transition-all shadow-sm"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <CheckCircle2 className="h-6 w-6 mr-2 text-emerald-400" />}
                  Publish Review
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Review Content</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Company</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Rating</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium">
                      <div className="flex justify-center items-center">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" /> Loading your reviews...
                      </div>
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium">
                      You haven't written any success stories yet. Click the button above to share your experience!
                    </td>
                  </tr>
                ) : reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6 max-w-sm">
                      <div className="flex items-start gap-3">
                        <Quote className="h-4 w-4 text-blue-400 shrink-0 mt-1" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 line-clamp-2">{review.content}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {review.company ? (
                        <span className="text-sm font-semibold text-slate-700">{review.company}</span>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Not specified</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        Published
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
                            <Eye className="h-4 w-4" /> View
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
  );
}
