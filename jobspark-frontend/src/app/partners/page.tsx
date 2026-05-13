'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Handshake, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  BarChart3, 
  Zap,
  Building2,
  Globe,
  Sparkles,
  Search
} from 'lucide-react';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative py-32 overflow-hidden bg-[#0a0c10] text-white rounded-b-[5rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-900/20 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-black uppercase tracking-[0.3em]">
            <Sparkles className="w-4 h-4" /> Partner Program
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1] max-w-5xl mx-auto">
            Scale your <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">success together.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Join the ecosystem of world-class companies building the future of global work. 
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl shadow-white/5 flex items-center gap-3">
              Apply to Partner <Handshake className="w-5 h-5 text-blue-600" />
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black hover:bg-white/10 transition-all">
              View Directory
            </button>
          </div>
        </div>
      </section>

      {/* ── Logos Strip ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-10 flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-90 backdrop-blur-xl">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-40 hover:opacity-100">
               <Building2 className="w-8 h-8 text-blue-600" />
               <span className="font-black text-xl text-gray-900 tracking-tighter">PARTNER_{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Partner Types ── */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Agency Partners",
              desc: "For recruitment agencies and executive search firms looking to scale their client placements.",
              icon: Search,
              perks: ["Priority Placement", "API Access", "Client Dashboard"]
            },
            {
              title: "Technology Partners",
              desc: "For SaaS platforms looking to integrate their HR tools directly into the JobsPark ecosystem.",
              icon: Zap,
              perks: ["Native Integrations", "Developer Support", "Marketplace Listing"]
            },
            {
              title: "Strategic Partners",
              desc: "For enterprise organizations looking to build custom workforce solutions and co-branded initiatives.",
              icon: ShieldCheck,
              perks: ["Custom SLAs", "Dedicated Manager", "Co-marketing"]
            }
          ].map((item, i) => (
            <div key={i} className="p-12 rounded-[3rem] bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all shadow-sm hover:shadow-2xl group">
              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center mb-10 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">{item.desc}</p>
              <ul className="space-y-4">
                {item.perks.map((perk, pi) => (
                  <li key={pi} className="flex items-center gap-3 text-sm font-black text-gray-700">
                    <CheckCircle className="w-4 h-4 text-blue-600" /> {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROI Section ── */}
      <section className="py-32 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Powerful tools <br />
              <span className="text-blue-600">for your growth.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              We provide the infrastructure and data insights you need to outperform the competition and deliver exceptional value to your clients.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <BarChart3 className="w-10 h-10 text-blue-600" />
                <h4 className="font-black text-lg">Real-time Analytics</h4>
                <p className="text-sm text-gray-400 font-medium">Track your placement performance across multiple regions.</p>
              </div>
              <div className="space-y-3">
                <Globe className="w-10 h-10 text-indigo-600" />
                <h4 className="font-black text-lg">Global Reach</h4>
                <p className="text-sm text-gray-400 font-medium">Access over 120+ markets with localized recruitment tools.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-blue-600 rounded-[3rem] blur-3xl opacity-10 animate-pulse" />
            <div className="relative bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl">
               <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center px-6 gap-4 opacity-${100 - i * 20}`}>
                       <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-black">P</div>
                       <div className="flex-1 h-3 bg-gray-200 rounded-full" />
                       <div className="w-12 h-3 bg-blue-200 rounded-full" />
                    </div>
                  ))}
               </div>
               <div className="mt-10 p-6 rounded-2xl bg-blue-600 text-white flex items-center justify-between">
                  <div className="font-black">Partner Dashboard</div>
                  <ArrowRight className="w-6 h-6" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-8 leading-tight">
          Let&apos;s build something <br /> 
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">extraordinary.</span>
        </h2>
        <p className="text-xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Start your partnership journey today and unlock a world of possibilities for your business.
        </p>
        <button className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 hover:scale-105 transition-all active:scale-95">
          Join the Ecosystem
        </button>
      </section>
    </div>
  );
}
