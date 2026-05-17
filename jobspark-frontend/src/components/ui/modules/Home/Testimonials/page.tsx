'use client';

import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Frontend Developer',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108750-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      content: 'JobSpark completely changed my career trajectory. I found my dream job at a company I never would have discovered on my own. The matching algorithm is incredibly accurate, and the application process was seamless.',
      type: 'jobseeker'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Engineering Manager',
      company: 'StartupXYZ',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      content: 'As a hiring manager, JobSpark has been a game-changer. The quality of candidates is outstanding, and we reduced our time-to-hire by 60%. The platform saves us countless hours in screening.',
      type: 'recruiter'
    },
    {
      id: 3,
      name: 'Emily Thompson',
      role: 'UX Designer',
      company: 'DesignHub',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      content: 'I was skeptical at first, but JobSpark delivered beyond my expectations. I landed a remote position with a 40% salary increase. The platform really understands what candidates and companies need.',
      type: 'jobseeker'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'HR Director',
      company: 'GlobalTech',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      content: 'We\'ve been using JobSpark for 2 years now, and it\'s transformed our recruitment process. The AI-powered matching helps us find candidates that are not just qualified, but also culturally fit.',
      type: 'recruiter'
    },
    {
      id: 5,
      name: 'Jessica Martinez',
      role: 'Product Manager',
      company: 'InnovateCo',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      content: 'The best job platform I\'ve ever used. The direct connection to hiring managers eliminates the middleman, and the transparency in salary and company culture is unmatched.',
      type: 'jobseeker'
    }
  ];

  const nextTestimonial = () => {
    console.log('Next testimonial clicked, current index:', activeIndex);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    console.log('Previous testimonial clicked, current index:', activeIndex);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const currentTestimonial = testimonials[activeIndex];

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
                {currentTestimonial.content}
              </p>

              {/* Author Info */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="text-center sm:text-left">
                  <div className="font-bold text-gray-900 text-lg">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-gray-600">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(currentTestimonial.rating)}
                  </div>
                </div>
              </div>

              {/* Type Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {currentTestimonial.type === 'jobseeker' ? '👤 Job Seeker' : '🏢 Recruiter'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={prevTestimonial}
            className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
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

        {/* Additional Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(1, 4).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => goToTestimonial(testimonials.indexOf(testimonial))}
            >
              <div className="flex items-center gap-1 mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
              <a
                href="/signup"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </a>
              <a
                href="/success-stories"
                className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 border-2 border-blue-500"
              >
                Read More Stories
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
