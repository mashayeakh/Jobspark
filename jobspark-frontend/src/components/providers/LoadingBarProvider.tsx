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
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 100);
    } else {
      setProgress(100);
      timeout = setTimeout(() => setProgress(0), 300);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {/* Loading Bar */}
      <div className={`fixed top-0 left-0 w-full h-1 z-[9999] transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'
        }`}>
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
          }}
        >
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
