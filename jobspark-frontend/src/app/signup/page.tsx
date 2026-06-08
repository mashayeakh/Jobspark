/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Mail, Lock, Eye, EyeOff, User, Building, Briefcase, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';


interface AnimatedCircle {
  id: number;
  size: number;
  color: string;
  delay: number;
  initialAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  icon: string;
  image?: string;
}

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'jobseeker' as 'jobseeker' | 'recruiter',
    companyName: '',
    industry: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const circles: AnimatedCircle[] = [
    {
      id: 1,
      size: 60,
      color: 'bg-blue-500',
      delay: 0,
      initialAngle: 0,
      orbitRadius: 120,
      orbitSpeed: 20,
      icon: '👤',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face'
    },
    {
      id: 2,
      size: 40,
      color: 'bg-purple-500',
      delay: 0.5,
      initialAngle: 45,
      orbitRadius: 80,
      orbitSpeed: 25,
      icon: '💼',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      size: 35,
      color: 'bg-pink-500',
      delay: 1,
      initialAngle: 90,
      orbitRadius: 160,
      orbitSpeed: 15,
      icon: '🎯',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=35&h=35&fit=crop&crop=face'
    },
    {
      id: 4,
      size: 25,
      color: 'bg-yellow-500',
      delay: 1.5,
      initialAngle: 180,
      orbitRadius: 100,
      orbitSpeed: 30,
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=25&h=25&fit=crop&crop=face'
    },
    {
      id: 5,
      size: 30,
      color: 'bg-green-500',
      delay: 2,
      initialAngle: 270,
      orbitRadius: 140,
      orbitSpeed: 18,
      icon: '🚀',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=30&h=30&fit=crop&crop=face'
    }
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountTypeChange = (type: 'jobseeker' | 'recruiter') => {
    setFormData(prev => ({ ...prev, accountType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.password) {
      toast.error('Please enter a password');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.accountType === 'recruiter') {
      if (!formData.companyName) {
        toast.error('Please enter your company name');
        return;
      }
      if (!formData.industry) {
        toast.error('Please enter your industry');
        return;
      }
    }

    const termsCheckbox = (e.target as any).elements.terms;
    if (termsCheckbox && !termsCheckbox.checked) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post<any>('/auth/register', {
        ...formData,
        role: formData.accountType === 'recruiter' ? 'RECRUITER' : 'JOB_SEEKER',
      });
      
      if (response.success) {
        // Redirect to login on success
        window.location.href = '/login';
      } else {
        toast.error(response.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Animated Background */}
      <div className="relative hidden w-1/2 lg:flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-800 text-white overflow-hidden">
        {/* Logo */}
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">JS</span>
            </div>
            <span className="text-white font-semibold text-lg">JobSpark</span>
          </div>
        </div>

        {/* Grow your business text */}
        <div className="absolute bottom-12 left-8 z-20">
          <h1 className="text-4xl font-bold mb-2">Start your journey</h1>
          <p className="text-purple-200 text-lg">Join thousands of professionals finding their perfect match</p>
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
                  className="absolute inset-0 rounded-full border border-purple-300/20"
                  style={{
                    width: `${circle.orbitRadius * 2}px`,
                    height: `${circle.orbitRadius * 2}px`,
                  }}
                />

                {/* Moving Circle */}
                <div
                  className={`absolute rounded-full ${circle.color} shadow-lg flex items-center justify-center text-white font-semibold text-sm overflow-hidden`}
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
                  {circle.image ? (
                    <img
                      src={circle.image}
                      alt={`User ${circle.id}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{circle.icon}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex w-full items-center justify-center bg-white lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          {/* Close Button for Mobile */}
          <div className="lg:hidden flex justify-end mb-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600 mb-8">Join JobSpark and start your journey</p>
          </div>

          {/* Account Type Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleAccountTypeChange('jobseeker')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 group ${formData.accountType === 'jobseeker'
                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${formData.accountType === 'jobseeker' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100'}`}>
                  <User className="w-6 h-6" />
                </div>
                <span className={`block text-sm font-semibold ${formData.accountType === 'jobseeker' ? 'text-blue-700' : 'text-gray-600'}`}>Job Seeker</span>
                <p className="text-[10px] text-gray-400 mt-1">I want to find a job</p>
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeChange('recruiter')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 group ${formData.accountType === 'recruiter'
                  ? 'border-purple-500 bg-purple-50 shadow-md transform scale-[1.02]'
                  : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${formData.accountType === 'recruiter' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100'}`}>
                  <Building className="w-6 h-6" />
                </div>
                <span className={`block text-sm font-semibold ${formData.accountType === 'recruiter' ? 'text-purple-700' : 'text-gray-600'}`}>Recruiter</span>
                <p className="text-[10px] text-gray-400 mt-1">I want to hire talent</p>
              </button>
            </div>

          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Recruiter Specific Fields */}
            {formData.accountType === 'recruiter' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="industry"
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g. Software, Healthcare"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              </>
            )}


            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r ${formData.accountType === 'recruiter' ? 'from-purple-600 to-indigo-600' : 'from-blue-600 to-cyan-600'} text-white py-4 px-4 rounded-xl font-bold hover:shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 group`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Get Started Now</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

          {/* Sign In Section */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Sign in
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
};

export default SignupPage;
