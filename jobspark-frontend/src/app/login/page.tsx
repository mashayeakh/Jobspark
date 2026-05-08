'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AnimatedCircle {
  id: number;
  size: number;
  color: string;
  delay: number;
  initialAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate login process
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Redirect to dashboard on success
        window.location.href = '/dashboard';
      } else {
        // Handle error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
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

        {/* Grow your business text */ }
  <div className="absolute bottom-12 left-8 z-20">
    <h1 className="text-4xl font-bold mb-2">Grow your business</h1>
    <p className="text-blue-200 text-lg">Connect with top talent worldwide</p>
  </div>

  {/* Animated Circles Container */ }
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
      </div >

  {/* Right Side - Login Form */ }
  < div className = "flex w-full items-center justify-center bg-white lg:w-1/2 p-8" >
    <div className="w-full max-w-md">
      {/* Close Button for Mobile */}
      <div className="lg:hidden flex justify-end mb-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5 text-gray-600" />
        </Link>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to JobSpark</h2>
        <p className="text-gray-600 mb-8">Welcome back! Please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Forgot your password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <div className="w-5 h-5 border-l-2 border-white transform rotate-90"></div>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Logo with decorative elements */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">JS</span>
          </div>
          {/* Decorative lines */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-300 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-300 rounded-full"></div>
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          New here?
          <Link
            href="/signup"
            className="underline ml-2"
          >
            Create an account
          </Link>
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
        >
          Request a demo credential
        </Link>
      </div>
    </div>
      </div >

  {/* CSS Animations */ }
  < style jsx > {`
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
      `}</style >
    </div >
  );
};

export default LoginPage;
