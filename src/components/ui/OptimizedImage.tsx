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
  quality = 85,
  loading,
}: OptimizedImageProps) {
  // Determina loading strategy: se priority=true, non usare loading='lazy'
  const loadingStrategy = priority ? undefined : (loading || 'lazy');

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
          WebkitBackfaceVisibility: 'hidden',
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
          WebkitPerspective: '1000px',
          perspective: '1000px',
          opacity: 1
        }}
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
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translate3d(0, 0, 0)',
        transform: 'translate3d(0, 0, 0)',
        WebkitPerspective: '1000px',
        perspective: '1000px',
        opacity: 1
      }}
    />
  );
}
