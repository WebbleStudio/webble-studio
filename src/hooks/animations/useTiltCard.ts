import React, { useState, useCallback, useRef } from 'react';

interface UseTiltCardOptions {
  tiltFactor?: number;
  transitionDuration?: number;
  glareEffect?: boolean;
  glareIntensity?: number;
  glareSize?: number;
}

export const useTiltCard = (options: UseTiltCardOptions = {}) => {
  const {
    tiltFactor = 9, // Ridotto da 15 a 9 (40% di riduzione)
    transitionDuration = 0.2,
    glareEffect = true,
    glareIntensity = 0.5, // Mantenuto come prima
    glareSize = 48, // Ridotto da 80 a 48 (40% di riduzione delle dimensioni)
  } = options;

  const [isHovered, setIsHovered] = useState(false);
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !isHovered) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;

      setMousePosition({ x, y });

      const tiltX = -(y / 50) * tiltFactor;
      const tiltY = (x / 50) * tiltFactor;

      setTiltValues({ x: tiltX, y: tiltY });
    },
    [isHovered, tiltFactor]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTiltValues({ x: 0, y: 0 });
  }, []);

  const glareX = mousePosition.x / 2 + 50;
  const glareY = mousePosition.y / 2 + 50;

  // Update glare position when mouse moves
  React.useEffect(() => {
    if (cardRef.current && glareEffect) {
      const glareOverlay = cardRef.current.querySelector('.keypoint-glare-overlay') as HTMLElement;
      if (glareOverlay) {
        glareOverlay.style.background = `radial-gradient(
          circle at ${glareX}% ${glareY}%,
          rgba(255, 255, 255, ${glareIntensity}) 0%,
          rgba(255, 255, 255, 0) ${glareSize}%
        )`;
      }
    }
  }, [glareX, glareY, glareEffect, glareIntensity, glareSize]);

  return {
    cardRef,
    isHovered,
    tiltValues,
    glareX,
    glareY,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    transitionDuration,
    glareEffect,
    glareIntensity,
    glareSize,
  };
};
