'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Briefcase, Users, TrendingUp, Star, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const JobSeekersPage = () => {
  const resources = [
    {
      icon: Search,
      title: 'Job Search',
      description: 'Browse thousands of job opportunities from top companies worldwide',
      features: ['Advanced filters', 'AI matching', 'Real-time updates', 'Saved searches'],
      cta: 'Browse Jobs',
      href: '/jobs'
    },
    {
      icon: Users,
      title: 'Profile Builder',
      description: 'Create a professional profile that showcases your skills and experience',
      features: ['Resume upload', 'Skills assessment', 'Portfolio integration', 'Profile analytics'],
      cta: 'Build Profile',
      href: '/profile/build'
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Get data-driven insights about salary trends and market demand',
      features: ['Salary calculator', 'Market trends', 'Skill demand', 'Career paths'],
      cta: 'Explore Insights',
      href: '/resources/career'
    },
    {
      icon: Briefcase,
      title: 'Application Tools',
      description: 'Streamline your job application process with smart tools',
      features: ['One-click apply', 'Application tracker', 'Interview prep', 'Follow-up reminders'],
      cta: 'Manage Applications',
      href: '/applications'
    }
  ];

  const stats = [
    { value: '2M+', label: 'Active Jobs' },
    { value: '50K+', label: 'Companies' },
    { value: '85%', label: 'Response Rate' },
    { value: '4.8★', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Resources for Job Seekers
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Everything you need to land your dream job in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Job Search
                <Search className="w-5 h-5" />
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 border-2 border-blue-500"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
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

      {/* Resources Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Career Toolkit
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful tools and resources designed to accelerate your job search and career growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-8">
                    {resource.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-green-500 fill-current" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={resource.href}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    {resource.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How JobSpark Works for Job Seekers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and find your perfect match
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Create Profile', description: 'Sign up and build your professional profile in minutes' },
              { step: 2, title: 'Get Matches', description: 'Our AI matches you with relevant opportunities' },
              { step: 3, title: 'Apply Easily', description: 'One-click applications to multiple jobs' },
              { step: 4, title: 'Land Dream Job', description: 'Connect directly with hiring managers' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers who've found their perfect match
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/jobs"
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobSeekersPage;
