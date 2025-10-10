import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
}

/**
 * Optimized image component that wraps next/image with sensible defaults
 * Provides automatic optimization, lazy loading, and proper sizing
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 75, // Ridotto per risparmiare bandwidth Vercel
  loading,
}: OptimizedImageProps) {
  // Determina loading strategy: se priority=true, non usare loading='lazy'
  const loadingStrategy = priority ? undefined : (loading || 'lazy');
  
  // Ottimizzazione cache: determina se l'immagine è statica (non cambia mai)
  const isStaticImage = src.startsWith('/img/') || src.startsWith('/icons/') || src.startsWith('/public/');
  
  // Cache headers ottimizzati per immagini statiche
  const imageProps = {
    src,
    alt,
    className,
    priority,
    loading: loadingStrategy,
    quality,
    sizes,
    // Aggiungi cache headers per immagini statiche
    ...(isStaticImage && {
      unoptimized: false, // Mantieni ottimizzazione Next.js
    }),
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes || '100vw'}
        style={{ 
          objectFit: 'cover',
          willChange: 'auto',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          WebkitTransform: 'translateZ(0)',
          opacity: 1
        }}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
      style={{
        willChange: 'auto',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        opacity: 0.99
      }}
    />
  );
}
