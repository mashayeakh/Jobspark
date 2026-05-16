/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Users, TrendingUp, Briefcase, Star, ArrowRight, Zap, Shield, Globe, CheckCircle, BarChart, Target, Award } from 'lucide-react';

const JobSeekersPage = () => {
  const stats = [
    { value: '2M+', label: 'Active Jobs', icon: Briefcase },
    { value: '50K+', label: 'Companies', icon: Globe },
    { value: '85%', label: 'Success Rate', icon: TrendingUp },
    { value: '4.8★', label: 'User Rating', icon: Star }
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart Job Search',
      description: 'Advanced AI-powered search that matches you with perfect opportunities',
      features: ['Real-time filtering', 'Salary insights', 'Company reviews', 'Skill matching'],
      cta: 'Start Searching',
      href: '/jobs'
    },
    {
      icon: Users,
      title: 'Professional Profile',
      description: 'Create a standout profile that showcases your skills and experience',
      features: ['Resume builder', 'Portfolio showcase', 'Skills assessment', 'Profile analytics'],
      cta: 'Analyze Profile',
      href: '/jobseeker/profile-score'
    },
    {
      icon: BarChart,
      title: 'Career Analytics',
      description: 'Track your job search progress and get data-driven insights',
      features: ['Application tracking', 'Interview analytics', 'Market trends', 'Salary benchmarks'],
      cta: 'View Analytics',
      href: '/analytics'
    },
    {
      icon: Target,
      title: 'Skill Development',
      description: 'Identify skill gaps and access personalized learning resources',
      features: ['Skill assessment', 'Course recommendations', 'Certification tracking', 'Progress monitoring'],
      cta: 'Improve Skills',
      href: '/skills'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108750-851a5d8b0b8?w=64&h=64&fit=crop&crop=face',
      quote: 'HireNova helped me land my dream job in just 3 weeks! The AI matching is incredible.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'InnovateCo',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      quote: 'The profile builder and analytics tools gave me confidence to apply for senior roles.',
      rating: 5
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Create Profile',
      description: 'Build your professional profile with our AI-powered resume builder',
      icon: Users
    },
    {
      step: 2,
      title: 'Get Matches',
      description: 'Receive personalized job recommendations based on your skills',
      icon: Target
    },
    {
      step: 3,
      title: 'Apply Smart',
      description: 'One-click applications with tracking and analytics',
      icon: Briefcase
    },
    {
      step: 4,
      title: 'Land Dream Job',
      description: 'Connect directly with hiring managers and negotiate offers',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Job
              <span className="block text-blue-200 text-3xl sm:text-4xl lg:text-5xl mt-2">
                with HireNova
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join millions of job seekers who&apos;ve found their perfect match through our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse Jobs
                <Search className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all duration-300 border-2 border-blue-500 shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Powerful tools and resources designed to accelerate your career growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature: any, index: number) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {feature.features.map((item: string, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 group-hover:scale-105"
                >
                  {feature.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How HireNova Works
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Get started in minutes and find your perfect match
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item: any, index: number) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              See how HireNova has helped thousands land their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_: any, i: number) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic leading-relaxed">
                  {testimonial.quote}
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of job seekers who&apos;ve found their perfect match
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Get Started Free
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Browse Opportunities
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobSeekersPage;
