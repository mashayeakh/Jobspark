'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api';

const FinalCTA = () => {
  const [counters, setCounters] = useState({
    jobSeekers: 0,
    jobs: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await apiClient.get<any>('/jobs/public-stats');
        if (response.success && response.data?.result) {
          const { jobSeekers, jobs } = response.data.result;
          setCounters({
            jobSeekers: jobSeekers || 0,
            jobs: jobs || 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: Users, value: isLoading ? '...' : `${counters.jobSeekers}`, label: 'Active Users' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
    { icon: Shield, value: isLoading ? '...' : `${counters.jobs}`, label: 'Verified Jobs' },
    { icon: Zap, value: '50%', label: 'Faster Hiring' }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of professionals and companies who&apos;ve already found their perfect match through JobSpark
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main CTA */}


        {/* Alternative CTAs */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-xl font-bold mb-3">
              I&apos;m Looking for a Job
            </h4>
            <p className="text-gray-300 mb-6">
              Create your profile and get matched with top companies worldwide
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-300"
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-xl font-bold mb-3">
              I&apos;m Looking to Hire
            </h4>
            <p className="text-gray-300 mb-6">
              Post jobs and connect with pre-vetted, qualified candidates
            </p>
            <a
              href="/hire"
              className="inline-flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 transition-colors duration-300"
            >
              Start Hiring
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Final Message */}
        <div className="text-center mt-16 pb-8">
          <p className="text-gray-400 text-lg">
            Join the future of recruitment. Your dream job or perfect candidate is just a click away.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
