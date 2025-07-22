'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSplineLazyLoadProps {
  mobileUrl: string;
  desktopUrl: string;
  delay?: number;
}

export const useSplineLazyLoad = ({
  mobileUrl,
  desktopUrl,
  delay = 1000,
}: UseSplineLazyLoadProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Spline script
  const loadSplineScript = useCallback(() => {
    if (!document.querySelector('script[src*="spline-viewer.js"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js';
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Load script after a delay to prioritize other content
          setTimeout(() => {
            loadSplineScript();
          }, delay);
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );

    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [loadSplineScript, delay]);

  // Set loaded state when script is ready
  useEffect(() => {
    if (isScriptLoaded && isVisible) {
      setIsLoaded(true);
    }
  }, [isScriptLoaded, isVisible]);

  return {
    containerRef,
    isLoaded,
    isVisible,
    mobileUrl,
    desktopUrl,
  };
};
