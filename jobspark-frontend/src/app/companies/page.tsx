import React from 'react';
import CompaniesClient from './CompaniesClient';

export const metadata = {
  title: 'List of Companies | JobSpark',
  description: 'Explore top companies hiring on JobSpark.',
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}
