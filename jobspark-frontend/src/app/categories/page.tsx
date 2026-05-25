import React from 'react';
import Categories from '@/components/ui/modules/Home/Categories/page';

export const metadata = {
  title: 'All Categories | JobSpark',
  description: 'Browse all job categories available on JobSpark.',
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-10 pb-20 bg-gray-50">
      <Categories />
    </main>
  );
}
