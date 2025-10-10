import React from 'react';

interface StaticImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Component per immagini statiche che bypassano Vercel Image Optimization
 * Usa per immagini critiche che non cambiano mai
 */
export default function StaticImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: StaticImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      style={{
        willChange: 'auto',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
      }}
    />
  );
}
