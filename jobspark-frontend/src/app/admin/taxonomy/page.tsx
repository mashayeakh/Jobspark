'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Edit2, Trash2, Folder, Tag, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 1, name: 'Technology', sub: 24, status: 'Active', color: 'bg-blue-50 text-blue-600' },
  { id: 2, name: 'Design', sub: 18, status: 'Active', color: 'bg-purple-50 text-purple-600' },
  { id: 3, name: 'Marketing', sub: 12, status: 'Active', color: 'bg-orange-50 text-orange-600' },
  { id: 4, name: 'Management', sub: 8, status: 'Draft', color: 'bg-gray-50 text-gray-600' },
];

export default function TaxonomyPage() {
  return (
    <AdminShell title="Content Taxonomy">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">Content Taxonomy</h2>
            <p className="text-gray-500 font-medium">Manage job categories, skills, and data mapping</p>
          </div>
          <Button className="rounded-xl bg-blue-600 font-bold shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add New Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Folder className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Categories</p>
                <h3 className="text-2xl font-bold text-[#202224]">42</h3>
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
                <h3 className="text-2xl font-bold text-[#202224]">1,280</h3>
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
                <h3 className="text-2xl font-bold text-[#202224]">356</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-8 bg-white border-b border-gray-100">
            <CardTitle className="text-xl font-bold">Category Architecture</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${cat.color}`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#202224]">{cat.name}</h4>
                      <p className="text-sm text-gray-500 font-bold">{cat.sub} Sub-categories</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`${cat.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'} border-0 px-4 py-1.5 rounded-lg font-bold`}>
                      {cat.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
