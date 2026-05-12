'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Briefcase, Clock, DollarSign,
  CheckCircle, Bookmark, BookmarkCheck, Share2, Building, Users, TrendingUp
} from 'lucide-react';
import { Job } from './types';
import { jobService } from '@/services/jobService';

interface JobDetailTemplateProps {
  job: Job;
  backPath: string;   // e.g. '/remote-jobs'
  backLabel: string;  // e.g. 'Remote Jobs'
}

export default function JobDetailTemplate({ job, backPath, backLabel }: JobDetailTemplateProps) {
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);

  useEffect(() => {
    checkSaveAndAppliedStatus();
  }, [job.id]);

  const checkSaveAndAppliedStatus = async () => {
    try {
      const [saveResponse, appliedResponse] = await Promise.all([
        jobService.checkIfJobSaved(job.id),
        jobService.checkIfJobApplied(job.id),
      ]);

      if (saveResponse.success && saveResponse.data) {
        setSaved(saveResponse.data.isSaved);
      }

      if (appliedResponse.success && appliedResponse.data) {
        setApplied(appliedResponse.data.isApplied);
      }
    } catch (error) {
      console.error('Error checking save/applied status:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      if (saved) {
        const response = await jobService.unsaveJob(job.id);
        if (response.success) {
          setSaved(false);
        }
      } else {
        const response = await jobService.saveJob(job.id);
        if (response.success) {
          setSaved(true);
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleApply = async () => {
    setLoadingApply(true);
    try {
      const response = await jobService.applyToJob(job.id);
      if (response.success) {
        setApplied(true);
      }
    } catch (error) {
      console.error('Error applying:', error);
    } finally {
      setLoadingApply(false);
    }
  };

  const typeColor: Record<string, string> = {
    remote: 'bg-green-100 text-green-800',
    'full-time': 'bg-blue-100 text-blue-800',
    'part-time': 'bg-yellow-100 text-yellow-800',
    contract: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href={backPath}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {backLabel}
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={loadingSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded transition-colors disabled:opacity-50 ${saved
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                }`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job header card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
                  {job.logo ? (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML =
                          `<span style="font-size:22px;font-weight:700;color:#555">${job.company[0]}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-500">{job.company[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {job.posted}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColor[job.type] ?? 'bg-gray-100 text-gray-800'}`}>
                      {job.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {job.experience}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                      {job.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {job.workStyle}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About the Role</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Apply card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <button
                onClick={handleApply}
                disabled={applied || loadingApply}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors text-sm ${applied
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
                  }`}
              >
                {applied ? '✓ Applied' : 'Apply Now'}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {applied ? 'Your application has been submitted' : 'Apply with your JobsPark profile'}
              </p>
            </div>

            {/* Job info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4 flex-shrink-0" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{job.workStyle} · {job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                  <span>{job.salary}</span>
                </div>
                {job.equity && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4 flex-shrink-0" />
                    <span>{job.equity} equity</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Posted {job.posted}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>{job.vacancy} {job.vacancy === 1 ? 'position available' : 'positions available'}</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* About company */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                About {job.company}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{job.aboutCompany}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{job.category} company</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
