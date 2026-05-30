'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Briefcase, Users, Zap, Shield, Globe, Award, X, Rocket } from 'lucide-react';
import Link from 'next/link';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [comingSoonModal, setComingSoonModal] = useState<string | null>(null);

  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: HelpCircle,
      color: 'from-blue-500 to-blue-600',
      questions: [
        {
          question: 'What is JobSpark?',
          answer: 'JobSpark is a modern job platform that connects talented professionals with top companies worldwide. We use AI-powered matching to help job seekers find their perfect roles and help companies hire the best talent efficiently.'
        },
        {
          question: 'How is JobSpark different from other job platforms?',
          answer: 'Unlike traditional job boards, JobSpark offers direct connections to hiring managers, AI-powered matching, verified job listings, and transparent salary information. We eliminate middlemen and focus on quality over quantity.'
        },
        {
          question: 'Is JobSpark free to use?',
          answer: 'JobSpark is free for job seekers. For companies, we offer various pricing plans including a free tier with basic features and premium plans with advanced tools and unlimited job postings.'
        }
      ]
    },
    {
      id: 'jobseekers',
      title: 'For Job Seekers',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      questions: [
        {
          question: 'How do I create a profile?',
          answer: 'Creating a profile is simple! Click "Sign Up" and fill in your professional information, upload your resume, and add your skills. Our AI will then start matching you with relevant opportunities.'
        },
        {
          question: 'How does the matching algorithm work?',
          answer: 'Our AI analyzes your skills, experience, preferences, and career goals to match you with jobs that fit your profile. The more complete your profile, the better your matches will be.'
        },
        {
          question: 'Can I apply to multiple jobs at once?',
          answer: 'Yes! With JobSpark\'s one-click apply feature, you can apply to multiple relevant jobs simultaneously using your profile information. No more filling out the same forms repeatedly.'
        },
        {
          question: 'How do I know if a job is legitimate?',
          answer: 'All job postings on JobSpark are verified by our team. We check company credentials and require detailed job information. If you encounter any suspicious activity, report it immediately.'
        }
      ]
    },
    {
      id: 'recruiters',
      title: 'For Recruiters',
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      questions: [
        {
          question: 'How do I post a job?',
          answer: 'Simply create a company profile, click "Post a Job," and fill in the job details. Our system will help you optimize your posting to attract the right candidates.'
        },
        {
          question: 'How does candidate screening work?',
          answer: 'Our AI-powered screening analyzes candidates based on your requirements, skills, experience, and cultural fit. You receive a ranked list of the most suitable candidates.'
        },
        {
          question: 'Can I search for candidates directly?',
          answer: 'Yes! Premium plans include access to our candidate database where you can search and filter professionals based on skills, experience, location, and availability.'
        },
        {
          question: 'What are the pricing plans?',
          answer: 'We offer flexible plans: Free (1 job posting), Professional ($299/month for 5 postings), and Enterprise (custom pricing with unlimited postings and advanced features).'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features & Tools',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      questions: [
        {
          question: 'What is the AI matching system?',
          answer: 'Our AI matching system uses machine learning to analyze profiles and job requirements, providing highly accurate matches for both job seekers and recruiters. It learns and improves over time.'
        },
        {
          question: 'Do you offer remote work opportunities?',
          answer: 'Yes! JobSpark specializes in remote, hybrid, and on-site opportunities. You can filter jobs by work type and location preferences.'
        },
        {
          question: 'Is salary information transparent?',
          answer: 'Absolutely. We require companies to provide salary ranges for all positions, helping you make informed decisions about opportunities.'
        },
        {
          question: 'Can I track my application status?',
          answer: 'Yes, your dashboard shows real-time status updates for all your applications, from submitted to interview stages and final decisions.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const questionId = categoryIndex * 100 + questionIndex;
    console.log('Toggling question:', questionId, 'Current open:', openQuestion);
    setOpenQuestion(prev => prev === questionId ? null : questionId);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions? We&apos;ve got answers. Browse our comprehensive FAQ section.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">
                      {category.title}
                    </h3>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-6 space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const questionId = categoryIndex * 100 + questionIndex;
                    const isOpen = openQuestion === questionId;

                    return (
                      <div
                        key={questionIndex}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Help Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
            <p className="text-gray-600 mb-4">
              Get help whenever you need it from our dedicated support team
            </p>
            <button onClick={() => setComingSoonModal('24/7 Support')} className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
              Contact Support →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Resource Center</h4>
            <p className="text-gray-600 mb-4">
              Access guides, tutorials, and best practices for job seeking and hiring
            </p>
            <button onClick={() => setComingSoonModal('Resource Center')} className="text-purple-600 font-medium hover:text-purple-700 cursor-pointer">
              Browse Resources →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Live Chat</h4>
            <p className="text-gray-600 mb-4">
              Chat with our team instantly for quick answers to your questions
            </p>
            <button onClick={() => setComingSoonModal('Live Chat')} className="text-green-600 font-medium hover:text-green-700 cursor-pointer">
              Start Chat →
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Still have questions?
            </h3>
            <p className="text-lg mb-8 text-blue-100">
              Our support team is here to help you succeed. Reach out anytime!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Coming Soon Modal */}
      {comingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setComingSoonModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative text-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setComingSoonModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-blue-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold text-gray-800">{comingSoonModal}</span> is currently under development. We&apos;re working hard to bring this feature to you soon!
            </p>

            <button
              onClick={() => setComingSoonModal(null)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FAQ;
