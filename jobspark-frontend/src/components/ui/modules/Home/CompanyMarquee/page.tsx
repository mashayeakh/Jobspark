'use client';

import React from 'react';

const CompanyMarquee = () => {
  const companies = [
    { name: 'Netflix', logo: '🎬' },
    { name: 'PayPal', logo: '💳' },
    { name: 'Microsoft', logo: '🪟' },
    { name: 'Nike', logo: '👟' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Apple', logo: '🍎' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-200 via-orange-100 to-pink-100 py-8 sm:py-12">
      {/* Bottom border strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-200 opacity-50"></div>

      {/* Main content */}
      <div className="relative z-10 text-center mb-6 sm:mb-8 px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Placing people at great companies
        </h2>
      </div>

      {/* Marquee container */}
      <div className="relative overflow-hidden py-2 sm:py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* First set of logos */}
          {companies.map((company, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center justify-center mx-6 sm:mx-8 md:mx-12"
            >
              <div className="flex flex-col items-center">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 opacity-90">
                  {company.logo}
                </div>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                  {company.name}
                </span>
              </div>
            </div>
          ))}

          {/* Duplicate set for seamless loop */}
          {companies.map((company, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center justify-center mx-6 sm:mx-8 md:mx-12"
            >
              <div className="flex flex-col items-center">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 opacity-90">
                  {company.logo}
                </div>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default CompanyMarquee;
