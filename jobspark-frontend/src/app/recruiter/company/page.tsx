'use client';

import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Edit,
  Save,
  X,
  Upload,
  Link
} from 'lucide-react';

export default function CompanyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const router = useRouter();

  const [companyData, setCompanyData] = useState({
    name: 'TechCorp Solutions',
    tagline: 'Building the future of digital innovation',
    description: 'We are a leading technology company specializing in cloud infrastructure, AI-powered analytics, and enterprise software solutions. Founded in 2015, we have grown to a team of 500+ professionals across 12 countries.',
    industry: 'Information Technology',
    companySize: '500-1000',
    foundedYear: '2015',
    website: 'www.techcorpsolutions.com',
    email: 'careers@techcorpsolutions.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA, United States',
    headquarters: 'San Francisco, CA',
    employees: '500+',
    type: 'Technology',
    revenue: '$50M+',
    mission: 'To empower businesses with innovative technology solutions that drive growth and transformation.',
    values: 'Innovation, Integrity, Collaboration, Excellence',
    benefits: 'Health Insurance, Remote Work, Stock Options, Flexible Hours, Learning Budget',
    socialLinks: {
      linkedin: 'linkedin.com/company/techcorp',
      twitter: '@techcorp',
      facebook: 'facebook.com/techcorp'
    },
    profileImage: null as string | null,
    backgroundImage: null as string | null
  });

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData || userData.role !== 'RECRUITER') {
      router.push('/login');
      return;
    }
    setUser(userData);
    setLoading(false);
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData(prev => ({
          ...prev,
          backgroundImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setCompanyData(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  const removeBackgroundImage = () => {
    setCompanyData(prev => ({
      ...prev,
      backgroundImage: null
    }));
  };

  const handleSave = () => {
    // Simulate save operation
    setShowSuccessAlert(true);
    setEditing(false);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading company profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-right duration-300">
          <div className="bg-white/95 backdrop-blur-xl border border-emerald-200 rounded-2xl shadow-2xl p-5 flex items-center gap-4 min-w-[360px]">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900">Profile Updated!</p>
              <p className="text-sm text-gray-600">Your company profile has been successfully updated</p>
            </div>
            <button
              onClick={() => setShowSuccessAlert(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-all hover:rotate-90 duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modern Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/recruiter" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Recruiter</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 font-semibold">Company Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex gap-3">
              {editing && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  size="lg"
                  className="h-12 px-6 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-200 font-semibold"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button
                onClick={editing ? handleSave : () => setEditing(true)}
                size="lg"
                className={`h-12 px-7 font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${editing
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  }`}
              >
                {editing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          <div className="relative h-64">
            {companyData.backgroundImage ? (
              <img
                src={companyData.backgroundImage}
                alt="Background"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-64 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
            {editing && (
              <div className="absolute top-6 right-6 z-10">
                <input
                  type="file"
                  id="background-upload"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="background-upload"
                  className="bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 shadow-2xl transition-all duration-200 hover:scale-105"
                >
                  <Upload className="h-4 w-4" />
                  Change Background
                </label>
                {companyData.backgroundImage && (
                  <button
                    onClick={removeBackgroundImage}
                    className="ml-3 bg-red-500/95 hover:bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-105"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="px-10 pb-10 -mt-20">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                {companyData.profileImage ? (
                  <img
                    src={companyData.profileImage}
                    alt="Profile"
                    className="relative h-40 w-40 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="relative h-40 w-40 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl border-4 border-white text-5xl font-bold text-white">
                    {companyData.name.charAt(0)}
                  </div>
                )}
                {editing && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110">
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3 rounded-full cursor-pointer flex items-center justify-center shadow-2xl transition-all duration-200"
                    >
                      <Upload className="h-5 w-5" />
                    </label>
                    {companyData.profileImage && (
                      <button
                        onClick={removeProfileImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-6 mt-4 lg:mt-8">
                {editing ? (
                  <div className="space-y-4">
                    <Input
                      value={companyData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-4xl font-bold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-gray-900 placeholder-gray-400"
                      placeholder="Company Name"
                    />
                    <Input
                      value={companyData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      className="text-xl text-gray-600 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto placeholder-gray-400"
                      placeholder="Company tagline"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{companyData.name}</h1>
                    <p className="text-xl text-gray-600 font-medium">{companyData.tagline}</p>
                  </>
                )}
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0 px-4 py-2 text-sm font-bold">
                    <Building className="h-4 w-4 mr-2" />
                    {companyData.industry}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-0 px-4 py-2 text-sm font-bold">
                    <Users className="h-4 w-4 mr-2" />
                    {companyData.companySize} employees
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-0 px-4 py-2 text-sm font-bold">
                    <Calendar className="h-4 w-4 mr-2" />
                    Founded {companyData.foundedYear}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
                <p className="text-gray-600">Basic information about your company</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Industry</Label>
                    {editing ? (
                      <Input
                        value={companyData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg font-medium bg-gray-50 p-3 rounded-xl">{companyData.industry}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Company Size</Label>
                    {editing ? (
                      <Input
                        value={companyData.companySize}
                        onChange={(e) => handleInputChange('companySize', e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg font-medium bg-gray-50 p-3 rounded-xl">{companyData.companySize} employees</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Founded Year</Label>
                    {editing ? (
                      <Input
                        value={companyData.foundedYear}
                        onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg font-medium bg-gray-50 p-3 rounded-xl">{companyData.foundedYear}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Headquarters</Label>
                    {editing ? (
                      <Input
                        value={companyData.headquarters}
                        onChange={(e) => handleInputChange('headquarters', e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg font-medium bg-gray-50 p-3 rounded-xl">{companyData.headquarters}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Company Description</Label>
                  {editing ? (
                    <textarea
                      value={companyData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full min-h-[160px] rounded-xl border-2 border-gray-200 focus:border-blue-500 p-5 text-base resize-none"
                      placeholder="Describe your company..."
                    />
                  ) : (
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <p className="text-gray-700 leading-relaxed text-lg">{companyData.description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mission Statement</Label>
                  {editing ? (
                    <textarea
                      value={companyData.mission}
                      onChange={(e) => handleInputChange('mission', e.target.value)}
                      className="w-full min-h-[120px] rounded-xl border-2 border-gray-200 focus:border-blue-500 p-5 text-base resize-none"
                      placeholder="What is your company's mission?"
                    />
                  ) : (
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <p className="text-gray-700 leading-relaxed text-lg">{companyData.mission}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Company Values</Label>
                  {editing ? (
                    <Input
                      value={companyData.values}
                      onChange={(e) => handleInputChange('values', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      placeholder="e.g., Innovation, Integrity, Collaboration"
                    />
                  ) : (
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <p className="text-gray-700 text-lg">{companyData.values}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Benefits & Perks</Label>
                  {editing ? (
                    <Input
                      value={companyData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      placeholder="e.g., Health Insurance, Remote Work, Stock Options"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {companyData.benefits.split(',').map((benefit, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0 px-4 py-2 font-bold">
                          {benefit.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                <p className="text-gray-600">How candidates can reach you</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Website</Label>
                  {editing ? (
                    <Input
                      value={companyData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      placeholder="www.example.com"
                    />
                  ) : (
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-900 text-lg font-medium">{companyData.website}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email</Label>
                  {editing ? (
                    <Input
                      value={companyData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      placeholder="careers@company.com"
                    />
                  ) : (
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-900 text-lg font-medium">{companyData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone</Label>
                  {editing ? (
                    <Input
                      value={companyData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-900 text-lg font-medium">{companyData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Location</Label>
                  {editing ? (
                    <Input
                      value={companyData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      placeholder="City, State, Country"
                    />
                  ) : (
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-900 text-lg font-medium">{companyData.location}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Social Links</Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                        <Link className="h-5 w-5 text-white" />
                      </div>
                      {editing ? (
                        <Input
                          value={companyData.socialLinks.linkedin}
                          onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                          placeholder="LinkedIn URL"
                          className="flex-1 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                        />
                      ) : (
                        <span className="text-gray-900 text-lg font-medium">{companyData.socialLinks.linkedin}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                        <Link className="h-5 w-5 text-white" />
                      </div>
                      {editing ? (
                        <Input
                          value={companyData.socialLinks.twitter}
                          onChange={(e) => handleSocialChange('twitter', e.target.value)}
                          placeholder="Twitter handle"
                          className="flex-1 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                        />
                      ) : (
                        <span className="text-gray-900 text-lg font-medium">{companyData.socialLinks.twitter}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                        <Link className="h-5 w-5 text-white" />
                      </div>
                      {editing ? (
                        <Input
                          value={companyData.socialLinks.facebook}
                          onChange={(e) => handleSocialChange('facebook', e.target.value)}
                          placeholder="Facebook URL"
                          className="flex-1 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                        />
                      ) : (
                        <span className="text-gray-900 text-lg font-medium">{companyData.socialLinks.facebook}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
