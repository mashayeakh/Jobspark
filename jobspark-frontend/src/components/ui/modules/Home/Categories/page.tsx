'use client';

import React, { useState } from 'react';
import { Code, Palette, Megaphone, BarChart, Heart, Wrench, Camera, Music, Briefcase, GraduationCap } from 'lucide-react';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'engineering',
      icon: Code,
      title: 'Engineering',
      count: '15,234',
      color: 'from-blue-500 to-blue-600',
      jobs: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Mobile Developer']
    },
    {
      id: 'design',
      icon: Palette,
      title: 'Design',
      count: '8,456',
      color: 'from-purple-500 to-purple-600',
      jobs: ['UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Motion Designer', 'Design Lead']
    },
    {
      id: 'marketing',
      icon: Megaphone,
      title: 'Marketing',
      count: '12,789',
      color: 'from-pink-500 to-pink-600',
      jobs: ['Digital Marketing', 'Content Marketing', 'Growth Marketing', 'Brand Manager', 'Marketing Director']
    },
    {
      id: 'sales',
      icon: BarChart,
      title: 'Sales',
      count: '9,123',
      color: 'from-green-500 to-green-600',
      jobs: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development', 'Sales Director']
    },
    {
      id: 'healthcare',
      icon: Heart,
      title: 'Healthcare',
      count: '6,789',
      color: 'from-red-500 to-red-600',
      jobs: ['Registered Nurse', 'Medical Assistant', 'Healthcare Administrator', 'Doctor', 'Therapist']
    },
    {
      id: 'skilled-trades',
      icon: Wrench,
      title: 'Skilled Trades',
      count: '4,567',
      color: 'from-orange-500 to-orange-600',
      jobs: ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'HVAC Technician']
    },
    {
      id: 'media',
      icon: Camera,
      title: 'Media',
      count: '3,456',
      color: 'from-indigo-500 to-indigo-600',
      jobs: ['Video Editor', 'Photographer', 'Content Creator', 'Journalist', 'Social Media Manager']
    },
    {
      id: 'entertainment',
      icon: Music,
      title: 'Entertainment',
      count: '2,234',
      color: 'from-yellow-500 to-yellow-600',
      jobs: ['Music Producer', 'Game Developer', 'Animator', 'Voice Actor', 'Event Coordinator']
    },
    {
      id: 'business',
      icon: Briefcase,
      title: 'Business',
      count: '18,901',
      color: 'from-gray-600 to-gray-700',
      jobs: ['Project Manager', 'Business Analyst', 'Consultant', 'Operations Manager', 'Executive Assistant']
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: 'Education',
      count: '7,890',
      color: 'from-teal-500 to-teal-600',
      jobs: ['Teacher', 'Professor', 'Curriculum Developer', 'Education Consultant', 'Academic Advisor']
    }
  ];

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Find opportunities in your field of expertise. We have jobs across all industries and experience levels.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <div className="font-semibold text-gray-900 mb-1">
                  {category.title}
                </div>

                {/* Count */}
                <div className="text-sm text-gray-500">
                  {category.count} jobs
                </div>

                {/* Selected Indicator */}
                {selectedCategory === category.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Category Details */}
        {selectedCategoryData && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${selectedCategoryData.color} rounded-2xl flex items-center justify-center`}>
                <selectedCategoryData.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCategoryData.title}
                </h3>
                <p className="text-gray-600">
                  {selectedCategoryData.count} open positions
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategoryData.jobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
                >
                  <span className="font-medium text-gray-900 group-hover:text-blue-600">
                    {job}
                  </span>
                  <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    →
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <a
                href={`/jobs?category=${selectedCategoryData.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300"
              >
                View All {selectedCategoryData.title} Jobs
                <span>→</span>
              </a>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Don't see your category?
            </h3>
            <p className="text-lg mb-8 text-blue-100">
              We're constantly adding new job categories. Sign up to get notified when new opportunities in your field become available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Get Notified
              </a>
              <a
                href="/categories"
                className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 border-2 border-blue-500"
              >
                Browse All Categories
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Categories;
