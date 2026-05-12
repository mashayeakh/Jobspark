'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useApi } from '@/hooks/useApi';
import { jobSeekerService, JobSeekerProfile } from '@/services/jobSeekerService';
import { User, Mail, Bookmark, Briefcase, GraduationCap, FileText, RefreshCw } from 'lucide-react';

function formatSalary(min?: number | null, max?: number | null) {
    if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
    return 'Not specified';
}

export default function JobSeekerProfilePage() {
    const router = useRouter();
    const [userReady, setUserReady] = useState(false);
    const { data: profile, loading, error, refetch } = useApi<JobSeekerProfile>(
        () => jobSeekerService.getProfile(),
        []
    );

    useEffect(() => {
        const userData = authService.getUser();
        if (!userData || userData.role !== 'JOB_SEEKER') {
            router.push('/login');
            return;
        }
        setUserReady(true);
    }, [router]);

    if (!userReady || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-base font-medium text-gray-600">Loading your profile...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Review your profile and keep your career details up to date.</p>
                </div>
                <button
                    type="button"
                    onClick={refetch}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {error ? (
                <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700 shadow-sm">
                    <div className="flex items-center gap-3 text-sm font-semibold">
                        <FileText className="w-5 h-5" />
                        <span>Unable to load profile</span>
                    </div>
                    <p className="mt-3 text-sm text-red-700">{error}</p>
                </div>
            ) : (
                <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Overview</p>
                                    <h2 className="mt-2 text-xl font-semibold text-gray-900">Basic information</h2>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                                    <User className="w-4 h-4" />
                                    {profile?.user?.name ?? profile?.name}
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{profile?.name ?? 'Not available'}</p>
                                </div>
                                <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Email</p>
                                    <p className="text-sm font-semibold text-gray-900">{profile?.user?.email ?? 'Not available'}</p>
                                </div>
                                <div className="space-y-2 rounded-3xl bg-slate-50 p-4 sm:col-span-2">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Headline</p>
                                    <p className="text-sm text-gray-900">{profile?.headline ?? 'No headline set'}</p>
                                </div>
                                <div className="space-y-2 rounded-3xl bg-slate-50 p-4 sm:col-span-2">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Bio</p>
                                    <p className="whitespace-pre-line text-sm text-gray-900">{profile?.bio ?? 'No summary provided yet.'}</p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                <Bookmark className="w-5 h-5 text-[#4880FF]" />
                                <span>Career preferences</span>
                            </div>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Preferred salary</p>
                                    <p className="mt-2 text-sm font-semibold text-gray-900">{formatSalary(profile?.preferredSalaryMin, profile?.preferredSalaryMax)}</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Resume</p>
                                    {profile?.resumeUrl ? (
                                        <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4880FF] hover:underline">
                                            <FileText className="w-4 h-4" />
                                            View resume
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-900">Not provided</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                <Briefcase className="w-5 h-5 text-[#4880FF]" />
                                <span>Work experience</span>
                            </div>
                            <div className="mt-6 space-y-4">
                                {profile?.workExperience?.length ? (
                                    profile.workExperience.map((item) => (
                                        <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                                            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                            <p className="text-sm text-gray-600">{item.companyName}</p>
                                            <p className="text-xs text-gray-500">{new Date(item.startDate).toLocaleDateString()} – {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Present'}</p>
                                            {item.description && <p className="mt-2 text-sm text-gray-700">{item.description}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-600">No work experience added yet.</p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                <GraduationCap className="w-5 h-5 text-[#4880FF]" />
                                <span>Education</span>
                            </div>
                            <div className="mt-6 space-y-4">
                                {profile?.education?.length ? (
                                    profile.education.map((item) => (
                                        <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                                            <p className="text-sm font-semibold text-gray-900">{item.degree}</p>
                                            <p className="text-sm text-gray-600">{item.school}</p>
                                            <p className="text-xs text-gray-500">{item.field} • {new Date(item.startDate).toLocaleDateString()} – {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Present'}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-600">No education history added yet.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-4">
                        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                <Mail className="w-5 h-5 text-[#4880FF]" />
                                <span>Contact</span>
                            </div>
                            <div className="mt-6 space-y-3 text-sm text-gray-700">
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Email</p>
                                    <p className="mt-1 font-semibold text-gray-900">{profile?.user?.email ?? 'Not available'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                <FileText className="w-5 h-5 text-[#4880FF]" />
                                <span>Skills</span>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {profile?.skills?.length ? (
                                    profile.skills.map((skill) => (
                                        <span key={skill.skillId} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {skill.skill?.name ?? 'Unknown'}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-600">No skills added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                <User className="w-5 h-5 text-[#4880FF]" />
                                <span>Profile status</span>
                            </div>
                            <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-gray-700">
                                {profile?.isProfileComplete ? (
                                    <p className="font-semibold text-gray-900">Your profile is complete</p>
                                ) : (
                                    <p className="font-semibold text-gray-900">Profile is incomplete</p>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
