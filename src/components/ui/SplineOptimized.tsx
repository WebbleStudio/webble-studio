'use client';

import { useEffect, useRef, useState } from 'react';
import { usePerformance } from '@/hooks/usePerformance';

interface SplineOptimizedProps {
  mobileUrl: string;
  desktopUrl: string;
  fallbackImage?: string;
  className?: string;
}

export default function SplineOptimized({ 
  mobileUrl, 
  desktopUrl, 
  fallbackImage,
  className = '' 
}: SplineOptimizedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  const { shouldReduceAnimations, shouldSkipAnimation } = usePerformance();

  // Determina se caricare Spline o usare fallback
  const shouldUseSpline = !shouldSkipAnimation('heavy') && !hasError;

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Delay ridotto per PageSpeed
          setTimeout(() => setShouldLoad(true), shouldReduceAnimations ? 50 : 200);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shouldReduceAnimations]);

  useEffect(() => {
    if (!shouldLoad || !shouldUseSpline) return;

    // Timeout per evitare caricamenti infiniti
    const timeout = setTimeout(() => {
      setHasError(true);
    }, 10000); // 10 secondi timeout

    // Carica Spline solo se necessario
    const loadSpline = async () => {
      try {
        // Verifica se Spline è già caricato
        if ((window as any).Spline) {
          setIsLoaded(true);
          clearTimeout(timeout);
          return;
        }

        // Carica Spline con priorità bassa
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@splinetool/runtime@0.9.0/build/runtime.js';
        script.async = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => setHasError(true);
        
        document.head.appendChild(script);
      } catch (error) {
        setHasError(true);
      }
    };

    loadSpline();

    return () => clearTimeout(timeout);
  }, [shouldLoad, shouldUseSpline]);

  // Fallback per connessioni lente o errori
  if (hasError || !shouldUseSpline) {
    return (
      <div 
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}
      >
        {fallbackImage ? (
          <img 
            src={fallbackImage} 
            alt="3D Scene Fallback" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-500 text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${className}`}
    >
      {shouldLoad && isLoaded && (
        <div className="w-full h-full">
          {/* Spline component sarà caricato qui */}
          <div id="spline-container" className="w-full h-full" />
        </div>
      )}
      
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="animate-pulse text-gray-500">Loading 3D Scene...</div>
        </div>
      )}
    </div>
  );
}
