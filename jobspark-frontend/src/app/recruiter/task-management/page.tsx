'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TaskManagementPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">Track and manage recruitment tasks</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>View all pending and completed recruitment tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500">Task management dashboard coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
