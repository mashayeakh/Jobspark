'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface LenisProviderProps {
  children: React.ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    direction?: 'vertical' | 'horizontal';
    gestureDirection?: 'vertical' | 'horizontal' | 'both';
    smooth?: boolean;
    mouseMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
  };
}

const LenisProvider: React.FC<LenisProviderProps> = ({
  children,
  options = {}
}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const defaultOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical' as const,
      gestureDirection: 'vertical' as const,
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    lenisRef.current = new Lenis(mergedOptions);

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle resize
    const handleResize = () => {
      lenisRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      lenisRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [options]);

  // Connect Lenis to Next.js router
  useEffect(() => {
    const handleRouteChange = () => {
      lenisRef.current?.scrollTo(0, { immediate: true });
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
