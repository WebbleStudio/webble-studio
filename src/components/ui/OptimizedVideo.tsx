import React, { useRef, useEffect, useState } from 'react';
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization';

interface OptimizedVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  poster?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

export default function OptimizedVideo({
  src,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  playsInline = true,
  poster,
  style,
  lazy = true,
  preload = 'metadata',
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(!lazy);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [fallbackToOriginal, setFallbackToOriginal] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // Ottimizzazioni basate sulla connessione di rete
  const networkOptimization = useNetworkOptimization();

  // Determina le impostazioni finali basate su props e rete
  const finalAutoPlay = autoPlay && networkOptimization.shouldAutoPlay;
  const finalLoop = loop && networkOptimization.shouldLoop;
  const finalPreload = networkOptimization.preloadStrategy;

  useEffect(() => {
    if (!lazy || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Inizia a caricare 100px prima che sia visibile
      }
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [lazy, hasLoaded]);

  const shouldLoad = !lazy || isIntersecting;

  // Crea URL con fallback
  const getVideoSrc = () => {
    if (!shouldLoad) return undefined;

    if (fallbackToOriginal) {
      // Fallback al URL pubblico Supabase diretto
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const filename = src.split('/').pop(); // Estrae il filename dall'URL API
      return `${supabaseUrl}/storage/v1/object/public/videos/${filename}`;
    }

    return src;
  };

  const handleVideoError = async (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    // Non loggare l'errore iniziale per evitare confusione - il fallback gestirà il problema
    setHasError(true);

    // Se non è già in fallback, prova con l'URL originale Supabase
    if (!fallbackToOriginal) {
      setFallbackToOriginal(true);
      setHasError(false); // Reset error state per retry
    } else {
      // Se anche il fallback fallisce, mostra il placeholder
      setShowPlaceholder(true);
    }
  };

  // Se deve mostrare il placeholder, non renderizzare il video
  if (showPlaceholder) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-[#F20352]/10 to-[#D91848]/10 border-2 border-dashed border-[#F20352]/30 text-gray-600 dark:text-gray-300`} style={style}>
        <div className="text-center p-6">
          <div className="relative mb-4">
            <svg
              className="w-16 h-16 mx-auto opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
          </div>
          <h3 className="font-medium text-sm mb-2">Video non disponibile</h3>
          <p className="text-xs opacity-75 max-w-xs mx-auto">
            Il video <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">1080p.mp4</code> non è stato trovato nel bucket Supabase
          </p>
          <div className="mt-3 text-xs opacity-60">
            <div className="flex items-center justify-center gap-1">
              <span>📁</span>
              <span>Storage → videos → 1080p.mp4</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={getVideoSrc()}
      className={className}
      autoPlay={shouldLoad ? finalAutoPlay : false}
      loop={finalLoop}
      muted={muted}
      controls={controls}
      playsInline={playsInline}
      poster={poster}
      style={style}
      preload={shouldLoad ? finalPreload : 'none'}
      // Performance hints
      onLoadStart={() => {
        // Video ha iniziato a caricarsi
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      }}
      onCanPlay={() => {
        // Video è pronto per essere riprodotto
        setHasError(false); // Reset error state on successful load
        if (finalAutoPlay && shouldLoad && videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      }}
      // Gestione errori migliorata con fallback
      onError={handleVideoError}
      onLoadedData={() => {
        // Video completamente caricato
        setHasError(false); // Reset error state
        if (videoRef.current && networkOptimization.shouldOptimize) {
          // Riduci la qualità del rendering se necessario
          videoRef.current.style.imageRendering = 'optimizeSpeed';
        }
      }}
    >
      Il tuo browser non supporta il tag video.
    </video>
  );
}
