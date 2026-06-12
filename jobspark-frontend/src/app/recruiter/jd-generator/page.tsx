'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export default function JDGeneratorPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Job Description Generator <Badge className="bg-blue-100 text-blue-800">AI</Badge>
          </h1>
          <p className="text-gray-600">Generate high-quality job descriptions with AI</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI JD Generator</CardTitle>
          <CardDescription>Enter a few details and let AI write the perfect job description for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-gray-500">AI Job Description Generator coming soon...</p>
            <Button variant="outline">Try Beta Version</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
