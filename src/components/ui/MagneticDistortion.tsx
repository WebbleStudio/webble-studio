'use client';

import React, { useRef, useState, useEffect } from 'react';

interface MagneticDistortionProps {
  imageSrc: string;
  className?: string;
}

export default function MagneticDistortion({ imageSrc, className = '' }: MagneticDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Normalizza coordinate (da -1 a 1)
      const normalizedX = (x / rect.width) * 2 - 1;
      const normalizedY = (y / rect.height) * 2 - 1;

      // Cancella animazione precedente
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Applica transform smooth
      animationFrameId = requestAnimationFrame(() => {
        if (!image) return;

        // Effetto magnetico: l'immagine si "piega" verso il mouse
        const intensity = 15; // Intensità dell'effetto
        const rotateY = normalizedX * intensity;
        const rotateX = -normalizedY * intensity;
        
        // Calcola distanza dal centro per effetto zoom
        const distanceFromCenter = Math.sqrt(normalizedX ** 2 + normalizedY ** 2);
        const scale = 1 + (1 - distanceFromCenter) * 0.05; // Leggero zoom nelle aree vicine al mouse

        // Effetto skew per distorsione magnetica
        const skewX = normalizedX * 2;
        const skewY = normalizedY * 2;

        image.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(${scale})
          skewX(${skewX}deg)
          skewY(${skewY}deg)
        `;
      });
    };

    const handleMouseLeave = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (image) {
        // Reset smooth transform
        image.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        image.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) skewX(0deg) skewY(0deg)';
        
        // Rimuovi transition dopo l'animazione
        setTimeout(() => {
          if (image) {
            image.style.transition = '';
          }
        }, 600);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full bg-cover bg-left bg-no-repeat"
        style={{
          backgroundImage: `url(${imageSrc})`,
          willChange: isHovered ? 'transform' : 'auto',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}

