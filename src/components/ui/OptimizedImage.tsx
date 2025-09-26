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
}: OptimizedImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes || '100vw'}
        quality={quality}
        style={{ 
          objectFit: 'cover',
          willChange: 'auto',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
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
      quality={quality}
      sizes={sizes}
      style={{
        willChange: 'auto',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      }}
    />
  );
}
