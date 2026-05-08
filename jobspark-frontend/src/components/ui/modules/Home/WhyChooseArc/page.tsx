import React from 'react';
import { CheckCircle, Zap, DollarSign, Users } from 'lucide-react';

const WhyChooseArc = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Access vetted talent",
      description: "Meet ready to interview candidates who are fully vetted for domain expertise and English fluency."
    },
    {
      icon: Zap,
      title: "View matches in seconds",
      description: "Stop reviewing 100s of resumes. View candidates instantly with HireAI."
    },
    {
      icon: DollarSign,
      title: "Save with global hires",
      description: "Get access to 450,000 talent in 190 countries, saving up to 58% vs traditional hiring."
    },
    {
      icon: Users,
      title: "Get real human support",
      description: "Feel confident hiring remote talent with hands-on help from our team of expert global recruiters."
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why choose Arc
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Icon */}
                <div className="mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseArc;
