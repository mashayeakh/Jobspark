'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Clock,
  FileText,
  Image as ImageIcon,
  Video,
  File
} from 'lucide-react';
import { useLoadingBar } from '@/components/providers/LoadingBarProvider';

interface FormData {
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  category: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export default function PostJobPage() {
  const { startLoading, stopLoading } = useLoadingBar();
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    company: '',
    location: '',
    jobType: 'full-time',
    experience: 'Mid',
    salary: '',
    description: '',
    requirements: [''],
    benefits: [''],
    category: 'Engineering'
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const addRequirement = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  }, []);

  const updateRequirement = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  }, []);

  const removeRequirement = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  }, []);

  const addBenefit = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  }, []);

  const updateBenefit = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((ben, i) => i === index ? value : ben)
    }));
  }, []);

  const removeBenefit = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    startLoading();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    stopLoading();

    // Reset form
    setFormData({
      jobTitle: '',
      company: '',
      location: '',
      jobType: 'full-time',
      experience: 'Mid',
      salary: '',
      description: '',
      requirements: [''],
      benefits: [''],
      category: 'Engineering'
    });
    setUploadedFiles([]);
  }, [startLoading, stopLoading]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-fade-in">Post a Job</h1>
          <p className="text-lg text-gray-600 animate-fade-in-delayed">Find the perfect candidate for your team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Job Details */}
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 animate-slide-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-blue-600" />
              Job Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Company *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                  placeholder="e.g. TechCorp"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-12 pr-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full pl-12 pr-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                    placeholder="e.g. $80,000 - $120,000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Job Type</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value }))}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Experience Level</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                >
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                  <option value="Lead">Lead Level</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Data">Data</option>
                  <option value="Product">Product</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 animate-slide-up-delayed">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Job Description
            </h2>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Description *</label>
              <textarea
                required
                rows={8}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none hover:border-gray-400"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 animate-slide-up-delayed-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Requirements
            </h2>

            <div className="space-y-6">
              {formData.requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1 px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                    placeholder={`Requirement ${index + 1}`}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-4 text-red-500 hover:text-red-700 transition-all hover:bg-red-50 rounded-xl"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addRequirement}
                className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Requirement
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 animate-slide-up-delayed-3">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              Benefits & Perks
            </h2>

            <div className="space-y-6">
              {formData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    className="flex-1 px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                    placeholder={`Benefit ${index + 1}`}
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="p-4 text-red-500 hover:text-red-700 transition-all hover:bg-red-50 rounded-xl"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addBenefit}
                className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Benefit
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center animate-slide-up-delayed-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-16 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting Job...
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Briefcase className="w-6 h-6" />
                  Post Job
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.2s;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.6s ease-out 0.1s;
        }

        .animate-slide-up-delayed-2 {
          animation: slide-up 0.6s ease-out 0.2s;
        }

        .animate-slide-up-delayed-3 {
          animation: slide-up 0.6s ease-out 0.3s;
        }

        .animate-slide-up-delayed-4 {
          animation: slide-up 0.6s ease-out 0.4s;
        }
      `}</style>
    </div>
  );
}
