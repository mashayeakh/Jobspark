'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function KanbanBoardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600">Track candidates across the hiring pipeline</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Candidates Pipeline</CardTitle>
          <CardDescription>Drag and drop candidates to update their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500">Kanban board feature coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
