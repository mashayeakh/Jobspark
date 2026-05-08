'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingBarProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {/* Loading Bar */}
      <div className={`fixed top-0 left-0 w-full h-1 z-50 transition-all duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
             style={{ width: `${progress}%` }}>
        </div>
      </div>
    </LoadingContext.Provider>
  );
}

export function useLoadingBar() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoadingBar must be used within LoadingBarProvider');
  }
  return context;
}
