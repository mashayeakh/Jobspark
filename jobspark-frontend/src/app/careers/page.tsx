'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Coffee,
  Monitor,
  MapPin,
  ArrowRight,
  Users,
  Zap,
  Globe,
  Award,
  Star
} from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative py-24 bg-gray-900 text-white overflow-hidden rounded-b-[4rem]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-l from-blue-600/20 to-transparent rounded-full -mr-96 -mt-96 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-[0.2em]">
                <Star className="w-4 h-4 fill-current" /> We are hiring
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Do the best work <br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">of your life.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
                Join a world-class team building the future of recruitment. We&apos;re on a mission to empower everyone to find their perfect career.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all active:scale-95">
                  View Openings
                </button>
                <div className="flex -space-x-4 items-center pl-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" />
                    </div>
                  ))}
                  <div className="pl-6 text-sm font-black text-gray-400">Join 150+ team members</div>
                </div>
              </div>
            </div>
            <div className="flex-1 hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-20" />
                <div className="relative bg-gray-800 rounded-[3rem] p-4 border border-white/10 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                    className="rounded-[2.5rem] w-full"
                    alt="Team collaboration"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Perks & Benefits</h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">We take care of our people so they can take care of our mission.</p>
          </div>
          <Link href="/about" className="text-blue-600 font-black flex items-center gap-2 hover:gap-4 transition-all">
            Our Culture <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Remote First', desc: 'Work from anywhere in the world. We provide a global home-office stipend.', icon: Globe },
            { title: 'Full Health', desc: 'Comprehensive medical, dental, and vision coverage for you and your family.', icon: Award },
            { title: 'Growth Budget', desc: 'Annual learning stipend for courses, books, and professional conferences.', icon: Zap },
            { title: 'Equipment', desc: 'Get the latest MacBook and any other gear you need to be productive.', icon: Monitor },
          ].map((perk, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all group shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <perk.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3">{perk.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Openings ── */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">Open Roles</h2>
          <div className="space-y-4">
            {[
              { title: 'Senior Product Designer', team: 'Design', loc: 'Remote', type: 'Full-time' },
              { title: 'Backend Engineer (Node.js)', team: 'Engineering', loc: 'Remote', type: 'Full-time' },
              { title: 'Growth Marketing Manager', team: 'Marketing', loc: 'Remote', type: 'Full-time' },
              { title: 'Customer Success Specialist', team: 'Success', loc: 'Global Remote', type: 'Full-time' },
            ].map((role, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:border-blue-100 transition-all group">
                <div>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{role.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {role.team}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {role.loc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">{role.type}</span>
                  <button className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group/btn">
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-gray-400 font-bold mb-6 italic">Don&t see a role that fits?</p>
            <button className="text-blue-600 font-black text-sm uppercase tracking-widest border-b-2 border-blue-600 pb-1 hover:text-blue-700 hover:border-blue-700 transition-all">
              General Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
