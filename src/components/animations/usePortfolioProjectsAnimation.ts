import { useState, useCallback } from 'react';

export function usePortfolioProjectsAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Forza una nuova animazione quando cambiano i filtri
  const triggerFilterAnimation = useCallback(() => {
    setIsAnimating(true);
    setAnimationKey((prev) => prev + 1);

    // Reset animation state dopo un breve delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 100);
  }, []);

  // Animation properties DISABILITATE - nessuna animazione container
  const containerAnimationProps = {
    key: animationKey,
    initial: { opacity: 1 }, // Sempre visibile
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    transition: {
      duration: 0, // Nessuna transizione
    },
  };

  // Animation properties DISABILITATE - nessuna animazione per evitare lag
  const getProjectAnimationProps = (index: number) => ({
    initial: {
      opacity: 1, // Sempre visibile
      y: 0,
      scale: 1,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 1, // Nessuna exit animation
      y: 0,
      scale: 1,
    },
    transition: {
      duration: 0, // Nessuna transizione
      delay: 0, // Nessun delay
    },
    layout: false,
  });

  // Animation properties DISABILITATE - nessuna animazione per evitare lag
  const getXLProjectAnimationProps = (rowIndex: number, positionIndex: number) => {
    return {
      initial: {
        opacity: 1, // Sempre visibile
        y: 0,
        scale: 1,
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
      },
      exit: {
        opacity: 1, // Nessuna exit animation
        y: 0,
        scale: 1,
      },
      transition: {
        duration: 0, // Nessuna transizione
        delay: 0, // Nessun delay
      },
      layout: false,
    };
  };

  // Animation properties per empty state
  const emptyStateAnimationProps = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.2,
    },
  };

  return {
    // State
    isAnimating,
    animationKey,

    // Functions
    triggerFilterAnimation,

    // Animation props
    containerAnimationProps,
    getProjectAnimationProps,
    getXLProjectAnimationProps,
    emptyStateAnimationProps,
  };
}
