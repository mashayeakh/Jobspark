'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PipelineStagesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline Stages</h1>
          <p className="text-gray-600">Manage and customize your hiring pipeline stages</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Configuration</CardTitle>
          <CardDescription>Configure the stages candidates go through during the hiring process.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500">Pipeline stages board coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
