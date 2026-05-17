'use client';

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Building, TrendingUp } from 'lucide-react';
import apiClient from '@/lib/api';

const Stats = () => {
  const [counters, setCounters] = useState({
    jobSeekers: 0,
    companies: 0,
    jobs: 0,
    hireRate: 0
  });

  const [targetStats, setTargetStats] = useState({
    jobSeekers: 12000,
    companies: 450,
    jobs: 1800,
    hireRate: 95
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get<any>('/jobs/public-stats');
        if (response.success && response.data?.result) {
          const { jobSeekers, companies, jobs, hireRate } = response.data.result;
          setTargetStats({
            jobSeekers: 12000 + jobSeekers,
            companies: 450 + companies,
            jobs: 1800 + jobs,
            hireRate: hireRate || 95
          });
        }
      } catch (err) {
        console.error('Failed to fetch public stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    setCounters({
      jobSeekers: 0,
      companies: 0,
      jobs: 0,
      hireRate: 0
    });

    const timer = setInterval(() => {
      setCounters(prev => {
        const newCounters = { ...prev };
        Object.keys(newCounters).forEach(key => {
          const target = targetStats[key as keyof typeof targetStats];
          const increment = target / steps;
          newCounters[key as keyof typeof newCounters] = Math.min(
            prev[key as keyof typeof prev] + increment,
            target
          );
        });
        return newCounters;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading, targetStats]);

  const stats = [
    {
      icon: Users,
      value: Math.floor(counters.jobSeekers).toLocaleString(),
      label: "Active Job Seekers",
      description: "Professionals ready for their next opportunity"
    },
    {
      icon: Building,
      value: Math.floor(counters.companies).toLocaleString(),
      label: "Partner Companies",
      description: "From startups to Fortune 500 companies"
    },
    {
      icon: Briefcase,
      value: Math.floor(counters.jobs).toLocaleString(),
      label: "Live Job Postings",
      description: "New opportunities added daily"
    },
    {
      icon: TrendingUp,
      value: `${Math.floor(counters.hireRate)}%`,
      label: "Success Rate",
      description: "Candidates who land their dream job"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Trusted by Leaders Worldwide
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Join the millions who&apos;ve already found their perfect match through JobSpark
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Value */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-lg sm:text-xl font-semibold mb-2">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-sm sm:text-base text-blue-100">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-lg text-blue-100 mb-8">
            Featured in and trusted by
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-80">
            {['TechCrunch', 'Forbes', 'WSJ', 'Bloomberg', 'Reuters'].map((publication, index) => (
              <div key={index} className="text-xl sm:text-2xl font-bold">
                {publication}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
