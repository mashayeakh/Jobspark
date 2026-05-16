/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useApi } from '@/hooks/useApi';
import { jobSeekerService, JobSeekerProfile } from '@/services/jobSeekerService';
import { User, Mail, Bookmark, Briefcase, GraduationCap, FileText, RefreshCw, Edit, Save, X, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

function formatSalary(min?: number | null, max?: number | null) {
    if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
    return 'Not specified';
}

const PREDEFINED_SKILLS = [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java',
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Next.js', 'Tailwind CSS',
    'PostgreSQL', 'Redux', 'GraphQL', 'UI/UX Design', 'Project Management'
];

export default function JobSeekerProfilePage() {
    const router = useRouter();
    const [userReady, setUserReady] = useState(false);
    const { data: profile, loading, error, refetch } = useApi<JobSeekerProfile>(
        () => jobSeekerService.getProfile(),
        []
    );

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<Partial<JobSeekerProfile>>({});
    const [newSkill, setNewSkill] = useState('');
    const [hasInitialized, setHasInitialized] = useState(false);
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    const [bioOptions, setBioOptions] = useState<string[]>([]);
    const [isUploadingResume, setIsUploadingResume] = useState(false);

    useEffect(() => {
        if (profile && !hasInitialized) {
            // Use timeout to move state update out of synchronous effect execution
            setTimeout(() => {
                setFormData({
                    name: profile.name,
                    headline: profile.headline,
                    bio: profile.bio,
                    preferredSalaryMin: profile.preferredSalaryMin,
                    preferredSalaryMax: profile.preferredSalaryMax,
                    workExperience: profile.workExperience?.map(exp => ({
                        id: exp.id,
                        companyName: exp.companyName,
                        title: exp.title,
                        startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
                        endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
                        description: exp.description || ''
                    })) || [],
                    education: profile.education?.map(edu => ({
                        id: edu.id,
                        school: edu.school,
                        degree: edu.degree,
                        field: edu.field,
                        startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
                        endDate: edu.endDate ? edu.endDate.split('T')[0] : ''
                    })) || [],
                    skills: profile.skills?.map(s => ({
                        name: s.skill?.name || '',
                        level: s.level,
                        yearsExp: s.yearsExp
                    })) || [],
                });
                setHasInitialized(true);
            }, 0);
        }
    }, [profile, hasInitialized]);

    const handleSave = async () => {
        setIsSaving(true);
        const result = await jobSeekerService.updateProfile(formData);
        if (result.success) {
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            refetch();
        } else {
            alert(result.error);
        }
        setIsSaving(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingResume(true);
        const result = await jobSeekerService.uploadResume(file);
        if (result.success && result.data?.resumeUrl) {
            setFormData(prev => ({ ...prev, resumeUrl: result.data!.resumeUrl }));
            refetch(); // fetch fresh data to show updated URL
        } else {
            alert(result.error || 'Failed to upload resume');
        }
        setIsUploadingResume(false);
    };

    const handleGenerateBio = async () => {
        setIsGeneratingBio(true);
        setBioOptions([]);
        const skillsList = formData.skills?.map((s: any) => s.name) || [];
        const result = await jobSeekerService.generateBioOptions(formData.headline || '', formData.bio || '', skillsList);
        if (result.success && result.data) {
            setBioOptions(result.data);
        } else {
            alert(result.error || "Failed to generate bio options.");
        }
        setIsGeneratingBio(false);
    };

    const addWorkExperience = () => {
        setFormData(prev => ({
            ...prev,
            workExperience: [...(prev.workExperience || []), { companyName: '', title: '', startDate: '', endDate: '', description: '' }]
        }));
    };

    const removeWorkExperience = (index: number) => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience?.filter((_, i) => i !== index)
        }));
    };

    const updateWorkExperience = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience?.map((exp, i) => i === index ? { ...exp, [field]: value } : exp)
        }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...(prev.education || []), { school: '', degree: '', field: '', startDate: '', endDate: '' }]
        }));
    };

    const removeEducation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education?.filter((_, i) => i !== index)
        }));
    };

    const updateEducation = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education?.map((edu, i) => i === index ? { ...edu, [field]: value } : edu)
        }));
    };

    const addSkill = (name: string) => {
        if (!name) return;
        if (formData.skills?.some(s => s.name === name)) return;
        setFormData(prev => ({
            ...prev,
            skills: [...(prev.skills || []), { name, level: 1, yearsExp: 0 }]
        }));
    };

    const removeSkill = (name: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills?.filter(s => s.name !== name)
        }));
    };

    useEffect(() => {
        const userData = authService.getUser();
        if (!userData || userData.role !== 'JOB_SEEKER') {
            router.push('/login');
            return;
        }
        // Small timeout to move state update out of initial render cycle
        setTimeout(() => setUserReady(true), 0);
    }, [router]);

    if (!userReady || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-base font-medium text-gray-600">Loading your profile...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-2 relative">
            {showSuccess && (
                <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-right duration-300">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                            <Save className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-bold">Profile Updated!</p>
                            <p className="text-sm opacity-90">Your changes have been saved successfully.</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Review your profile and keep your career details up to date.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={refetch}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        disabled={isSaving}
                        className={isEditing ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" : "bg-[#4880FF] hover:bg-[#3a66cc] text-white"}
                    >
                        {isSaving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : isEditing ? (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        ) : (
                            <>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </>
                        )}
                    </Button>
                    {isEditing && (
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="border-red-100 text-red-600 hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    )}
                </div>
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
                                    {isEditing ? (
                                        <Input
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                            className="bg-white border-gray-200 rounded-xl"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-900">{profile?.name ?? 'Not available'}</p>
                                    )}
                                </div>
                                <div className="space-y-2 rounded-3xl bg-slate-50 p-4 opacity-60">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Email (Read-only)</p>
                                    <p className="text-sm font-semibold text-gray-900">{profile?.user?.email ?? 'Not available'}</p>
                                </div>
                                <div className="space-y-2 rounded-3xl bg-slate-50 p-4 sm:col-span-2">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Headline</p>
                                    {isEditing ? (
                                        <Input
                                            name="headline"
                                            value={formData.headline || ''}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Software Engineer at Google"
                                            className="bg-white border-gray-200 rounded-xl"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{profile?.headline ?? 'No headline set'}</p>
                                    )}
                                </div>
                                <div className="space-y-2 rounded-3xl bg-slate-50 p-4 sm:col-span-2">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Bio</p>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                                    onClick={handleGenerateBio}
                                                    disabled={isGeneratingBio}
                                                >
                                                    {isGeneratingBio ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Zap className="w-3 h-3 mr-1" />}
                                                    Generate with AI
                                                </Button>
                                            </div>
                                            <Textarea
                                                name="bio"
                                                value={formData.bio || ''}
                                                onChange={handleInputChange}
                                                placeholder="Tell us about yourself..."
                                                className="bg-white border-gray-200 rounded-xl min-h-[100px]"
                                            />
                                            {bioOptions.length > 0 && (
                                                <div className="mt-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
                                                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Select an AI Generated Bio:</p>
                                                    {bioOptions.map((opt, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, bio: opt }));
                                                                setBioOptions([]);
                                                            }}
                                                            className="p-3 bg-white border border-blue-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
                                                        >
                                                            <div className="flex gap-2 items-start">
                                                                <div className="mt-0.5 text-blue-400 group-hover:text-blue-600">
                                                                    <Zap className="w-4 h-4" />
                                                                </div>
                                                                <p>{opt}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Bio</p>
                                            <p className="whitespace-pre-line text-sm text-gray-900">{profile?.bio ?? 'No summary provided yet.'}</p>
                                        </>
                                    )}
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
                                    {isEditing ? (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                <Input
                                                    type="number"
                                                    name="preferredSalaryMin"
                                                    value={formData.preferredSalaryMin || ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, preferredSalaryMin: parseInt(e.target.value) || 0 }))}
                                                    placeholder="Min"
                                                    className="bg-white pl-7 border-gray-200 rounded-xl"
                                                />
                                            </div>
                                            <span className="text-gray-400">–</span>
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                <Input
                                                    type="number"
                                                    name="preferredSalaryMax"
                                                    value={formData.preferredSalaryMax || ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, preferredSalaryMax: parseInt(e.target.value) || 0 }))}
                                                    placeholder="Max"
                                                    className="bg-white pl-7 border-gray-200 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm font-semibold text-gray-900">{formatSalary(profile?.preferredSalaryMin, profile?.preferredSalaryMax)}</p>
                                    )}
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-4 relative overflow-hidden group">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Resume</p>

                                    {isEditing ? (
                                        <div className="space-y-3">
                                            {formData.resumeUrl ? (
                                                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-blue-100">
                                                    <a href={formData.resumeUrl}
                                                        download
                                                        target="_blank"
                                                        rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-[#4880FF] hover:underline truncate">
                                                        <FileText className="w-4 h-4 shrink-0" />
                                                        <span className="truncate">Current Resume</span>
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                        onClick={() => setFormData(prev => ({ ...prev, resumeUrl: null }))}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : null}

                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="resume-upload"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleResumeUpload}
                                                    disabled={isUploadingResume}
                                                />
                                                <Label
                                                    htmlFor="resume-upload"
                                                    className={`flex items-center justify-center gap-2 w-full h-10 px-4 text-sm font-bold rounded-xl border-2 border-dashed transition-all cursor-pointer
                                                        ${isUploadingResume
                                                            ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                                                            : 'border-blue-200 text-[#4880FF] bg-blue-50/50 hover:bg-blue-50 hover:border-[#4880FF]'
                                                        }`}
                                                >
                                                    {isUploadingResume ? (
                                                        <span className="flex items-center gap-2 animate-pulse">
                                                            <div className="w-4 h-4 border-2 border-[#4880FF] border-t-transparent rounded-full animate-spin" />
                                                            Uploading...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <FileText className="w-4 h-4" />
                                                            {formData.resumeUrl ? 'Replace File' : 'Upload File'}
                                                        </>
                                                    )}
                                                </Label>
                                            </div>
                                        </div>
                                    ) : (
                                        profile?.resumeUrl ? (
                                            <a href={profile.resumeUrl}
                                                download
                                                target="_blank"
                                                rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4880FF] hover:underline bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm transition-transform hover:scale-105 active:scale-95">
                                                <FileText className="w-4 h-4" />
                                                View Resume
                                            </a>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 inline-flex items-center gap-2">
                                                <X className="w-4 h-4 text-gray-400" />
                                                Not provided
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                    <Briefcase className="w-5 h-5 text-[#4880FF]" />
                                    <span>Work experience</span>
                                </div>
                                {isEditing && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addWorkExperience}
                                        className="h-8 rounded-lg border-blue-100 text-[#4880FF] hover:bg-blue-50"
                                    >
                                        + Add Experience
                                    </Button>
                                )}
                            </div>
                            <div className="mt-6 space-y-4">
                                {isEditing ? (
                                    formData.workExperience?.map((item, index) => (
                                        <div key={index} className="space-y-4 rounded-3xl bg-slate-50 p-6 border border-gray-100 relative group">
                                            <button
                                                onClick={() => removeWorkExperience(index)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Job Title</Label>
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                                                        placeholder="e.g. Senior Developer"
                                                        className="bg-white border-gray-200 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Company Name</Label>
                                                    <Input
                                                        value={item.companyName || ''}
                                                        onChange={(e) => updateWorkExperience(index, 'companyName', e.target.value)}
                                                        placeholder="e.g. Acme Corp"
                                                        className="bg-white border-gray-200 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Start Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={item.startDate || ''}
                                                        onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                                                        className="bg-white border-gray-200 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-gray-500">End Date (Leave blank if present)</Label>
                                                    <Input
                                                        type="date"
                                                        value={item.endDate || ''}
                                                        onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                                                        className="bg-white border-gray-200 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2 sm:col-span-2">
                                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Description</Label>
                                                    <Textarea
                                                        value={item.description || ''}
                                                        onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                                        placeholder="Describe your responsibilities..."
                                                        className="bg-white border-gray-200 rounded-xl min-h-[80px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : profile?.workExperience?.length ? (
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                    <GraduationCap className="w-5 h-5 text-[#4880FF]" />
                                    <span>Education</span>
                                </div>
                                {isEditing && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addEducation}
                                        className="h-8 rounded-lg border-blue-100 text-[#4880FF] hover:bg-blue-50"
                                    >
                                        + Add Education
                                    </Button>
                                )}
                            </div>
                            <div className="mt-6 space-y-4">
                                {isEditing ? (
                                    formData.education?.map((item, index) => (
                                        <div key={index} className="space-y-4 rounded-3xl bg-slate-50 p-6 border border-gray-100 relative group">
                                            <button
                                                onClick={() => removeEducation(index)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Degree</Label>
                                                    <Input
                                                        value={item.degree || ''}
                                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                        placeholder="e.g. Bachelor of Science"
                                                        className="bg-white border-gray-200 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-gray-500">School / University</Label>
                                                    <Input
                                                        value={item.school || ''}
                                                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                                        placeholder="e.g. MIT"
                                                        className="bg-white border-gray-200 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Field of Study</Label>
                                                    <Input
                                                        value={item.field || ''}
                                                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                                        placeholder="e.g. Computer Science"
                                                        className="bg-white border-gray-200 rounded-xl"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs uppercase tracking-wider text-gray-500">Start Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={item.startDate || ''}
                                                            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                                            className="bg-white border-gray-200 rounded-xl"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs uppercase tracking-wider text-gray-500">End Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={item.endDate || ''}
                                                            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                                            className="bg-white border-gray-200 rounded-xl"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : profile?.education?.length ? (
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
                            <div className="mt-6 space-y-4">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Common Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {PREDEFINED_SKILLS.map(skillName => {
                                                    const isSelected = formData.skills?.some(s => s.name === skillName);
                                                    return (
                                                        <button
                                                            key={skillName}
                                                            type="button"
                                                            onClick={() => isSelected ? removeSkill(skillName) : addSkill(skillName)}
                                                            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border ${isSelected
                                                                ? "bg-[#4880FF] text-white border-[#4880FF] shadow-lg shadow-blue-100 transform scale-105"
                                                                : "bg-white text-gray-600 hover:border-gray-300 border-gray-100"
                                                                }`}
                                                        >
                                                            {skillName}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Selection</p>
                                            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-2xl bg-slate-50/50 border border-dashed border-gray-200">
                                                {formData.skills?.map((skill: any, index: number) => (
                                                    <span
                                                        key={`${skill.name}-${index}`}
                                                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 flex items-center gap-2 animate-in zoom-in-95 duration-200"
                                                    >
                                                        {skill.name || 'Unnamed Skill'}
                                                        <button
                                                            onClick={() => removeSkill(skill.name)}
                                                            className="hover:text-red-500 transition-colors p-0.5 hover:bg-blue-100 rounded-full"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                                {!formData.skills?.length && (
                                                    <p className="text-xs text-gray-400 italic py-1">Select skills from above or add custom ones...</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Input
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addSkill(newSkill);
                                                        setNewSkill('');
                                                    }
                                                }}
                                                placeholder="Add custom skill..."
                                                className="bg-white border-gray-200 rounded-xl h-10 text-sm"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    addSkill(newSkill);
                                                    setNewSkill('');
                                                }}
                                                className="bg-[#4880FF] hover:bg-[#3a66cc] text-white h-10 px-4"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {profile?.skills?.length ? (
                                            profile.skills.map((skill: any) => (
                                                <span key={skill.skillId} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {skill.skill?.name ?? 'Unknown'}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-600">No skills added yet.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                <TrendingUp className="w-5 h-5 text-[#4880FF]" />
                                <span>Profile Performance</span>
                            </div>
                            <div className="mt-6 flex items-center justify-between p-5 rounded-3xl bg-blue-50/50 border border-blue-100/30">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold">Total Profile Views</p>
                                    <p className="text-3xl font-black text-gray-900 mt-1">{profile?.views || 0}</p>
                                    <p className="text-[11px] text-blue-500 mt-1 font-medium italic">Increased by 12% this week</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4880FF] border border-blue-100">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                                <TrendingUp className="w-5 h-5 text-[#4880FF]" />
                                <span>Profile status</span>
                            </div>
                            <div className="mt-6 space-y-6">
                                {(() => {
                                    const steps = [
                                        !!profile?.name && !!profile?.headline,
                                        !!profile?.bio,
                                        !!profile?.workExperience?.length,
                                        !!profile?.education?.length,
                                        !!profile?.skills?.length,
                                        !!profile?.resumeUrl,
                                        !!profile?.preferredSalaryMin
                                    ];
                                    const completedCount = steps.filter(Boolean).length;
                                    const completion = Math.round((completedCount / steps.length) * 100);
                                    const radius = 28;
                                    const circumference = 2 * Math.PI * radius;
                                    const offset = circumference - (completion / 100) * circumference;

                                    return (
                                        <div className="flex items-center gap-5">
                                            <div className="relative w-20 h-20 flex-shrink-0">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle
                                                        cx="40"
                                                        cy="40"
                                                        r={radius}
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        fill="transparent"
                                                        className="text-slate-100"
                                                    />
                                                    <circle
                                                        cx="40"
                                                        cy="40"
                                                        r={radius}
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        fill="transparent"
                                                        strokeDasharray={circumference}
                                                        strokeDashoffset={offset}
                                                        strokeLinecap="round"
                                                        className="text-[#4880FF] transition-all duration-1000 ease-out"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-[15px] font-black text-gray-900 leading-none">{completion}%</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold text-gray-900">
                                                    {completion === 100 ? "All set!" : completion > 70 ? "Almost there!" : "Getting started!"}
                                                </h4>
                                                <p className="text-[11px] text-gray-500 leading-tight">
                                                    {completion === 100
                                                        ? "Your profile is fully optimized."
                                                        : `Complete your profile to stand out to recruiters.`}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="space-y-3.5 pt-2 border-t border-gray-50 mt-2">
                                    {[
                                        { label: 'Basic Info', completed: !!profile?.name && !!profile?.headline },
                                        { label: 'Bio / About You', completed: !!profile?.bio },
                                        { label: 'Work Experience', completed: !!profile?.workExperience?.length },
                                        { label: 'Education History', completed: !!profile?.education?.length },
                                        { label: 'Skill Set', completed: !!profile?.skills?.length },
                                        { label: 'Resume Upload', completed: !!profile?.resumeUrl },
                                        { label: 'Career Preferences', completed: !!profile?.preferredSalaryMin },
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-right-1 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${step.completed
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-600 scale-110"
                                                : "bg-white border-gray-100 text-gray-200"
                                                }`}>
                                                {step.completed ? (
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                )}
                                            </div>
                                            <span className={`text-xs transition-colors duration-300 ${step.completed ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {(() => {
                                    const steps = [
                                        !!profile?.name && !!profile?.headline,
                                        !!profile?.bio,
                                        !!profile?.workExperience?.length,
                                        !!profile?.education?.length,
                                        !!profile?.skills?.length,
                                        !!profile?.resumeUrl,
                                        !!profile?.preferredSalaryMin
                                    ];
                                    const isComplete = steps.every(Boolean);
                                    return !isComplete && (
                                        <div className="mt-4 p-4 rounded-2xl bg-blue-50/40 border border-blue-100/50 backdrop-blur-sm">
                                            <p className="text-[11px] text-[#4880FF] leading-relaxed font-medium flex gap-2">
                                                <span className="text-sm">💡</span>
                                                Profiles with 100% completion get 4x more views from top recruiters.
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
