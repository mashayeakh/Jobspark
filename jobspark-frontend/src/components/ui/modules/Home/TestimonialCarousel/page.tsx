'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote: "This platform completely changed my job search experience. I connected directly with founders and landed my dream role at a startup I'm passionate about.",
      author: "Sarah Chen",
      role: "Software Engineer",
      company: "Tech Startup"
    },
    {
      id: 2,
      quote: "As a recruiter, I've never had such access to high-quality candidates. The AI-powered matching saves me hours of screening time.",
      author: "Michael Rodriguez",
      role: "Head of Talent",
      company: "Growth Stage Company"
    },
    {
      id: 3,
      quote: "The transparency is incredible. I knew the salary, equity, and team structure before even applying. No more wasted time with mismatched opportunities.",
      author: "Emily Johnson",
      role: "Product Manager",
      company: "Series A Startup"
    },
    {
      id: 4,
      quote: "We hired our entire engineering team through this platform in record time. The quality of candidates is unmatched.",
      author: "David Kim",
      role: "CTO",
      company: "B2B SaaS Company"
    },
    {
      id: 5,
      quote: "Finally, a platform that understands what developers want. No recruiters, just direct connections with the people who matter.",
      author: "Alex Thompson",
      role: "Senior Developer",
      company: "FinTech Startup"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Quotes From our users</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 -translate-x-6 border border-gray-100"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-7 h-7 text-gray-700" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 translate-x-6 border border-gray-100"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-7 h-7 text-gray-700" />
          </button>

          {/* Testimonials Container */}
          <div className="overflow-hidden mx-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getVisibleTestimonials().map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`relative transition-all duration-500 transform ${index === 1
                      ? 'scale-105 opacity-100'
                      : 'scale-95 opacity-60'
                    }`}
                >
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-2xl opacity-0 transition-opacity duration-500 ${index === 1 ? 'opacity-20' : ''
                    }`}></div>

                  <div className={`relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full ${index === 1 ? 'ring-4 ring-pink-200 ring-offset-2' : ''
                    }`}>
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6">
                      <Quote className="w-8 h-8 text-pink-200" />
                    </div>

                    {/* Stars Rating */}
                    <div className="flex mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <blockquote className="text-gray-700 leading-relaxed text-lg mb-8 font-medium">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.author}</h4>
                        <p className="text-sm text-gray-600 font-medium">
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-gray-500">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-500'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
