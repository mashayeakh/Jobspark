'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { reviewService, Review } from '@/services/reviewService';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Form state
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await reviewService.getReviews();
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    reviewService.getReviews()
      .then((response) => {
        if (!ignore && response.success && response.data) {
          setReviews(response.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch reviews:', error);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, []);

  const nextTestimonial = () => {
    if (reviews.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevTestimonial = () => {
    if (reviews.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };

  const handleWriteReviewClick = () => {
    if (!authService.isAuthenticated()) {
      toast.error('Please login to write a review');
      return;
    }
    
    const user = authService.getUser();
    if (user?.role === 'JOB_SEEKER') {
      router.push('/jobseeker/reviews');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
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
        type: 'jobseeker' // hardcoded for now or derived from user role
      });

      if (response.success) {
        toast.success('Review submitted successfully!');
        setIsModalOpen(false);
        setContent('');
        setRating(5);
        setCompany('');
        fetchReviews(true); // Refresh list with loading indicator
      } else {
        toast.error(response.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, setStar?: (val: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        onClick={() => interactive && setStar && setStar(i + 1)}
        className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-white flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </section>
    );
  }

  const currentTestimonial = reviews[activeIndex];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from professionals and companies who&apos;ve found their perfect match through JobSpark
          </p>
        </div>

        {reviews.length > 0 ? (
          <>
            {/* Main Testimonial */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 sm:p-12 shadow-xl">
                {/* Quote Icon */}
                <div className="absolute top-8 left-8 text-blue-200">
                  <Quote className="w-12 h-12" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center sm:text-left">
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 mb-8 leading-relaxed font-medium">
                    {currentTestimonial?.content}
                  </p>

                  {/* Author Info */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={currentTestimonial?.author?.image || `https://ui-avatars.com/api/?name=${currentTestimonial?.author?.name || 'User'}`}
                      alt={currentTestimonial?.author?.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="text-center sm:text-left">
                      <div className="font-bold text-gray-900 text-lg">
                        {currentTestimonial?.author?.name}
                      </div>
                      <div className="text-gray-600">
                        {currentTestimonial?.author?.jobSeekerProfile?.headline || currentTestimonial?.author?.role} {currentTestimonial?.company ? `at ${currentTestimonial.company}` : ''}
                      </div>
                      <div className="flex items-center gap-1 mt-1 justify-center sm:justify-start">
                        {renderStars(currentTestimonial?.rating || 5)}
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    {currentTestimonial?.type?.toLowerCase() === 'job_seeker' ? '👤 Job Seeker' : '💼 Professional'}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            {reviews.length > 1 && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <button
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2 flex-wrap justify-center max-w-xs">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                        ? 'bg-blue-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No success stories yet. Be the first to share yours!
          </div>
        )}

        {/* Additional Testimonials Grid */}
        {reviews.length > 1 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {reviews.filter((_, i) => i !== activeIndex).slice(0, 3).map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => goToTestimonial(reviews.indexOf(testimonial))}
              >
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.author?.image || `https://ui-avatars.com/api/?name=${testimonial.author?.name || 'User'}`}
                    alt={testimonial.author?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {testimonial.author?.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {testimonial.author?.jobSeekerProfile?.headline || testimonial.author?.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of professionals who&apos;ve already transformed their careers with JobSpark
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWriteReviewClick}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h3>

            <form onSubmit={handleSubmitReview}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {renderStars(rating, true, setRating)}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Where did you get hired?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Story</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us how JobSpark helped you..."
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
