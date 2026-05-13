'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Target, 
  Heart, 
  Rocket, 
  ArrowRight, 
  CheckCircle2,
  Globe,
  Award,
  Zap
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8">
            Connecting Talent with <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Infinite Opportunity.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            We're building the world's most intelligent job platform, designed to help every professional find their perfect career match.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/jobs" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
            >
              Explore Jobs <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/careers" 
              className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black hover:border-blue-200 transition-all shadow-sm"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-y border-gray-50 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Active Users', value: '2M+', icon: Users },
            { label: 'Partner Companies', value: '50k+', icon: Building },
            { label: 'Job Placements', value: '150k+', icon: CheckCircle2 },
            { label: 'Countries', value: '120+', icon: Globe },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Values that drive us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Radical Transparency', 
              desc: 'We believe in honest conversations and clear information for both candidates and employers.',
              icon: Zap,
              color: 'from-blue-500 to-cyan-500'
            },
            { 
              title: 'Talent First', 
              desc: 'Everything we build is designed to empower the professional and elevate their career journey.',
              icon: Target,
              color: 'from-indigo-500 to-purple-500'
            },
            { 
              title: 'Inclusive Growth', 
              desc: 'We are committed to creating a platform that provides equal opportunity for everyone, everywhere.',
              icon: Heart,
              color: 'from-rose-500 to-pink-500'
            },
          ].map((val, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${val.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                <val.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{val.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Ready to build the future?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-xl mx-auto font-medium">Join thousands of companies finding their best talent on our platform.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/recruiter/jobs/create" className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl">
                Post a Job
              </Link>
              <Link href="/partners" className="px-10 py-4 bg-transparent border-2 border-white/20 text-white rounded-2xl font-black hover:bg-white/10 transition-all">
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function Building({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 0V4m-2 4h12" />
    </svg>
  );
}
