'use client';

import React from 'react';

export const RecruiterLoading = ({ fullScreen = true }: { fullScreen?: boolean }) => {
  return (
    <div className={`${fullScreen ? 'min-h-screen' : 'py-12'} flex items-center justify-center bg-transparent`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 border-4 border-[#4880FF]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#4880FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse text-sm">Preparing your workspace...</p>
      </div>
    </div>
  );
};

export default RecruiterLoading;
