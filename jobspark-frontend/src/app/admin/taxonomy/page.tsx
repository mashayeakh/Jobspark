'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Folder,
  Tag,
  Layers,
  Loader2,
  Search,
  X
} from 'lucide-react';
import { adminService, Category, Skill } from '@/services/adminService';

export default function TaxonomyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTaxonomyData();
  }, []);

  const fetchTaxonomyData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, skillsResponse] = await Promise.all([
        adminService.getCategories(),
        adminService.getSkills()
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

      if (skillsResponse.success && skillsResponse.data) {
        setSkills(skillsResponse.data);
      }

      if (!categoriesResponse.success && !skillsResponse.success) {
        setError('Failed to fetch taxonomy data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Taxonomy fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setActionLoading('category');
      const response = await adminService.createCategory(newCategoryName);
      if (response.success) {
        alert('Category added successfully');
        setNewCategoryName('');
        setShowAddCategory(false);
        await fetchTaxonomyData();
      } else {
        alert(response.error || 'Failed to add category');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;

    try {
      setActionLoading('skill');
      const response = await adminService.createSkill(newSkillName);
      if (response.success) {
        alert('Skill added successfully');
        setNewSkillName('');
        setShowAddSkill(false);
        await fetchTaxonomyData();
      } else {
        alert(response.error || 'Failed to add skill');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setActionLoading(categoryId);
      const response = await adminService.deleteCategory(categoryId);
      if (response.success) {
        alert('Category deleted successfully');
        await fetchTaxonomyData();
      } else {
        alert(response.error || 'Failed to delete category');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      setActionLoading(skillId);
      const response = await adminService.deleteSkill(skillId);
      if (response.success) {
        alert('Skill deleted successfully');
        await fetchTaxonomyData();
      } else {
        alert(response.error || 'Failed to delete skill');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCategories = (categories || []).filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkills = (skills || []).filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminShell title="Content Taxonomy">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell title="Content Taxonomy">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Content Taxonomy">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Content Taxonomy</h2>
            <p className="text-gray-500 font-medium">Manage job categories, skills, and data mapping</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowAddSkill(true)}
              className="rounded-xl bg-purple-600 font-bold shadow-lg"
            >
              <Tag className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
            <Button
              onClick={() => setShowAddCategory(true)}
              className="rounded-xl bg-blue-600 font-bold shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Folder className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Categories</p>
                <h3 className="text-2xl font-bold text-[#202224]">{categories.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 bg-purple-50 rounded-2xl">
                <Tag className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Total Skills</p>
                <h3 className="text-2xl font-bold text-[#202224]">{skills.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 bg-orange-50 rounded-2xl">
                <Layers className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Sub-categories</p>
                <h3 className="text-2xl font-bold text-[#202224]">{categories.filter(c => c.parentId).length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Category Modal */}
        {showAddCategory && (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="p-6 bg-blue-50">
              <CardTitle className="text-lg font-bold text-blue-600">Add New Category</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddCategory}
                  disabled={actionLoading === 'category' || !newCategoryName.trim()}
                  className="bg-blue-600"
                >
                  {actionLoading === 'category' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Skill Modal */}
        {showAddSkill && (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="p-6 bg-purple-50">
              <CardTitle className="text-lg font-bold text-purple-600">Add New Skill</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter skill name..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddSkill}
                  disabled={actionLoading === 'skill' || !newSkillName.trim()}
                  className="bg-purple-600"
                >
                  {actionLoading === 'skill' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddSkill(false);
                    setNewSkillName('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories and skills..."
            className="pl-10 rounded-xl border-gray-100 bg-gray-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories Section */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-8 bg-white border-b border-gray-100">
            <CardTitle className="text-xl font-bold">Categories ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#202224]">{cat.name}</h4>
                      {cat.description && (
                        <p className="text-sm text-gray-500 font-bold">{cat.description}</p>
                      )}
                      {cat.parentId && (
                        <Badge className="bg-gray-50 text-gray-600 border-0 px-2 py-1 rounded text-xs font-bold mt-1">
                          Sub-category
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={actionLoading === cat.id}
                      >
                        {actionLoading === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No categories found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-8 bg-white border-b border-gray-100">
            <CardTitle className="text-xl font-bold">Skills ({filteredSkills.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {filteredSkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-purple-50 text-purple-600">
                      <Tag className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#202224]">{skill.name}</h4>
                      {skill.categoryId && (
                        <p className="text-sm text-gray-500">Category ID: {skill.categoryId}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        onClick={() => handleDeleteSkill(skill.id)}
                        disabled={actionLoading === skill.id}
                      >
                        {actionLoading === skill.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredSkills.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No skills found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
