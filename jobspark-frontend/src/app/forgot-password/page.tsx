'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Clapperboard, X } from 'lucide-react';
import Link from 'next/link';

interface AnimatedCircle {
  id: number;
  size: number;
  color: string;
  delay: number;
  initialAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const circles: AnimatedCircle[] = [
    {
      id: 1,
      size: 60,
      color: 'bg-blue-500',
      delay: 0,
      initialAngle: 0,
      orbitRadius: 120,
      orbitSpeed: 20
    },
    {
      id: 2,
      size: 40,
      color: 'bg-purple-500',
      delay: 0.5,
      initialAngle: 45,
      orbitRadius: 80,
      orbitSpeed: 25
    },
    {
      id: 3,
      size: 35,
      color: 'bg-pink-500',
      delay: 1,
      initialAngle: 90,
      orbitRadius: 160,
      orbitSpeed: 15
    },
    {
      id: 4,
      size: 25,
      color: 'bg-yellow-500',
      delay: 1.5,
      initialAngle: 180,
      orbitRadius: 100,
      orbitSpeed: 30
    },
    {
      id: 5,
      size: 30,
      color: 'bg-green-500',
      delay: 2,
      initialAngle: 270,
      orbitRadius: 140,
      orbitSpeed: 18
    }
  ];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Reset password for:', email);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Animated Background */}
      <div className="relative hidden w-1/2 lg:flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
        {/* Logo */}
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">JS</span>
            </div>
            <Link href="/">
              <span className="text-white font-semibold text-lg">JobSpark</span>
            </Link>
          </div>
        </div>

        {/* Grow your business text */}
        <div className="absolute bottom-12 left-8 z-20">
          <h1 className="text-4xl font-bold mb-2">Grow your business</h1>
          <p className="text-blue-200 text-lg">Connect with top talent worldwide</p>
        </div>

        {/* Animated Circles Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl">
            {mounted && circles.map((circle) => (
              <div
                key={circle.id}
                className="absolute animate-orbit"
                style={{
                  width: `${circle.orbitRadius * 2}px`,
                  height: `${circle.orbitRadius * 2}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${circle.delay}s`,
                  animationDuration: `${circle.orbitSpeed}s`
                }}
              >
                {/* Orbit Path */}
                <div
                  className="absolute inset-0 rounded-full border border-blue-300/20"
                  style={{
                    width: `${circle.orbitRadius * 2}px`,
                    height: `${circle.orbitRadius * 2}px`,
                  }}
                />

                {/* Moving Circle */}
                <div
                  className={`absolute rounded-full ${circle.color} shadow-lg flex items-center justify-center text-white font-semibold text-sm`}
                  style={{
                    width: `${circle.size}px`,
                    height: `${circle.size}px`,
                    left: '50%',
                    top: '0',
                    transform: 'translateX(-50%)',
                    animationDelay: `${circle.delay}s`,
                    animationDuration: `${circle.orbitSpeed}s`,
                    animation: `orbit ${circle.orbitSpeed}s linear infinite`
                  }}
                >
                  {circle.id === 1 && '👤'}
                  {circle.id === 2 && '💼'}
                  {circle.id === 3 && '🎯'}
                  {circle.id === 4 && '⚡'}
                  {circle.id === 5 && '🚀'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex w-full items-center justify-center bg-white lg:w-1/2 p-8">
        <div className="w-full max-w-[440px]">
          {/* Close Button for Mobile */}
          <div className="lg:hidden flex justify-end mb-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </Link>
          </div>

        

          {/* Heading */}
          <h1 className="text-[44px] font-bold text-[#0B0F19] mb-4 tracking-tight leading-[1.1]">
            Forgot Password
          </h1>

          {/* Subtitle */}
          <p className="text-[#8B92A5] text-[17px] mb-12 leading-relaxed pr-4">
            Enter your email and we&apos;ll send you a reset otp to recover access to your JobSpark account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Input Group */}
            <div className="relative group">
              <div className="flex items-start gap-3">
                <Mail className="w-[22px] h-[22px] text-[#A0A5B5] group-focus-within:text-[#5551FF] transition-colors mt-0.5" />
                <div className="flex flex-col w-full">
                  <label className="text-[11px] font-bold text-[#A0A5B5] tracking-[0.2em] uppercase mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-transparent text-[#0B0F19] placeholder-[#8B92A5] text-[17px] focus:outline-none py-1"
                  />
                </div>
              </div>
              {/* Bottom Border */}
              <div className="absolute -bottom-3 left-0 right-0 h-[1px] bg-[#E8EAEF] group-focus-within:bg-[#5551FF] transition-colors" />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit px-8 py-3.5 bg-[#5551FF] hover:bg-[#4642EB] text-white rounded-full font-semibold text-[15px] transition-all focus:outline-none focus:ring-2 focus:ring-[#5551FF] focus:ring-offset-2 flex items-center justify-center shadow-[0_12px_28px_-6px_rgba(85,81,255,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Send Reset Otp'
              )}
            </button>
          </form>
          
          <div className="mt-8">
            <Link href="/login" className="text-sm font-medium text-[#5551FF] hover:text-[#4642EB] hover:underline transition-colors">
              &larr; Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(120px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(120px);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-orbit {
          animation: orbit 20s linear infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
