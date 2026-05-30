'use client';

import React, { useState } from 'react';
import { Search, Users, Briefcase, Shield, Zap, Globe, Award, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const Features = () => {
  const [activeTab, setActiveTab] = useState('jobseekers');

  const jobSeekerFeatures = [
    {
      icon: Search,
      title: "Smart Job Matching",
      description: "Our AI-powered algorithm matches you with jobs that fit your skills, experience, and preferences perfectly."
    },
    {
      icon: Users,
      title: "Direct Company Access",
      description: "Connect directly with hiring managers and recruiters. No third-party agencies standing in your way."
    },
    {
      icon: Shield,
      title: "Verified Opportunities",
      description: "Every job listing is verified for authenticity. No scams, no fake postings, just real opportunities."
    },
    {
      icon: Zap,
      title: "Instant Applications",
      description: "Apply to multiple jobs with a single profile. No more filling out the same information repeatedly."
    }
  ];

  const recruiterFeatures = [
    {
      icon: Globe,
      title: "Global Talent Pool",
      description: "Access 1M+ qualified candidates from 190+ countries. Find the perfect match for your team."
    },
    {
      icon: Award,
      title: "Quality Candidates",
      description: "Pre-vetted professionals with verified skills and experience. Save time on screening."
    },
    {
      icon: Clock,
      title: "Hire 50% Faster",
      description: "Reduce your time-to-hire from weeks to days with our streamlined recruitment process."
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Hiring",
      description: "Get insights on market trends, salary benchmarks, and candidate availability."
    }
  ];

  const currentFeatures = activeTab === 'jobseekers' ? jobSeekerFeatures : recruiterFeatures;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Everyone
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you&apos;re looking for your next opportunity or seeking top talent, we&apos;ve got you covered
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
            <button
              onClick={() => setActiveTab('jobseekers')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${activeTab === 'jobseekers'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveTab('recruiters')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${activeTab === 'recruiters'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              For Recruiters
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {currentFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who&apos;ve already found their perfect match through JobSpark
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              {/* <a
                href="/demo"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Request Demo
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
