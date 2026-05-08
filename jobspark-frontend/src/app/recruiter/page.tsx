'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, TrendingUp, Zap, Shield, Globe, BarChart, Clock, Award, ArrowRight, Search, Target, CheckCircle } from 'lucide-react';

const RecruiterPage = () => {
    const features = [
        {
            icon: Search,
            title: 'Smart Candidate Search',
            description: 'Find the perfect candidates with our AI-powered search and advanced filtering',
            features: ['Skill-based matching', 'Experience filters', 'Location search', 'Cultural fit scoring'],
            cta: 'Start Searching',
            href: '/hire/search'
        },
        {
            icon: Users,
            title: 'Talent Pool',
            description: 'Access our database of pre-vetted professionals ready to join your team',
            features: ['1M+ candidates', 'Pre-screened talent', 'Verified skills', 'Instant availability'],
            cta: 'Browse Talent',
            href: '/hire/candidates'
        },
        {
            icon: Briefcase,
            title: 'Job Posting Tools',
            description: 'Create compelling job postings that attract top talent',
            features: ['AI-powered descriptions', 'Salary benchmarks', 'Multi-channel posting', 'Performance analytics'],
            cta: 'Post a Job',
            href: '/hire/post'
        },
        {
            icon: Target,
            title: 'Applicant Tracking',
            description: 'Streamline your hiring process with our comprehensive ATS',
            features: ['Custom workflows', 'Collaborative hiring', 'Automated screening', 'Interview scheduling'],
            cta: 'Manage Hiring',
            href: '/hire/ats'
        }
    ];

    const stats = [
        { value: '1M+', label: 'Active Candidates' },
        { value: '50K+', label: 'Partner Companies' },
        { value: '60%', label: 'Faster Hiring' },
        { value: '92%', label: 'Match Quality' }
    ];

    const pricing = [
        {
            name: 'Starter',
            price: 'Free',
            description: 'Perfect for small teams getting started',
            features: ['1 job posting', 'Basic search', 'Email support'],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Professional',
            price: '$299',
            period: '/month',
            description: 'Ideal for growing companies',
            features: ['10 job postings', 'Advanced search', 'ATS integration', 'Priority support'],
            cta: 'Start Free Trial',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'Tailored solutions for large organizations',
            features: ['Unlimited postings', 'Custom workflows', 'Dedicated support', 'API access'],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            Recruiter Dashboard
                        </h1>
                        <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                            Powerful tools to find, evaluate, and hire top talent efficiently
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/post-job"
                                className="px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Post a Job
                                <Briefcase className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/signup"
                                className="px-8 py-4 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-all duration-300 border-2 border-green-500"
                            >
                                Start Free Trial
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
                                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
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

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Hire Better
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Comprehensive tools designed to streamline your recruitment process
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    {/* Icon */}
                                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                                        <Icon className="w-8 h-8 text-green-600" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Features List */}
                                    <div className="space-y-2 mb-8">
                                        {feature.features.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href={feature.href}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300"
                                    >
                                        {feature.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Choose the plan that fits your hiring needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricing.map((plan, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl p-8 border-2 ${plan.popular
                                    ? 'border-green-500 shadow-xl relative'
                                    : 'border-gray-200 hover:border-gray-300'
                                    } transition-all duration-300`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}

                                <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        {plan.price}
                                        {plan.period && <span className="text-lg text-gray-600">{plan.period}</span>}
                                    </div>
                                    <div className="text-gray-600 mb-6">
                                        {plan.description}
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                                        className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors duration-300 ${plan.popular
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-blue-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to Transform Your Hiring?
                    </h2>
                    <p className="text-xl text-green-100 mb-8">
                        Join thousands of companies who&apos;ve reduced time-to-hire by 60%
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/demo"
                            className="px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        >
                            Schedule Demo
                        </Link>
                        <Link
                            href="/hire/post"
                            className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-300"
                        >
                            Post Your First Job
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RecruiterPage;
