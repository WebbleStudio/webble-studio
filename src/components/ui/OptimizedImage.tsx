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
 * Provides automatic optimization and proper sizing
 * Loading eager di default per evitare lag nel portfolio
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
  quality = 85,
  loading = 'eager', // Default eager per evitare lag
}: OptimizedImageProps) {
  // Determina loading strategy: se priority=true o loading=eager, carica immediatamente
  const loadingStrategy = priority ? undefined : loading;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        loading={loadingStrategy}
        sizes={sizes || '100vw'}
        quality={quality}
        style={{
          objectFit: 'cover',
          willChange: 'auto',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          WebkitTransform: 'translateZ(0)',
          opacity: 1,
          // transition: 'none', // Rimosso per permettere hover effects
          animation: 'none', // FORCE: nessuna animazione
        }}
        // Force immediate rendering
        decoding="sync"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loadingStrategy}
      quality={quality}
      sizes={sizes}
      style={{
        willChange: 'auto',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        opacity: 1,
        // transition: 'none', // Rimosso per permettere hover effects
        animation: 'none', // FORCE: nessuna animazione
      }}
      // Force immediate rendering
      decoding="sync"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}
