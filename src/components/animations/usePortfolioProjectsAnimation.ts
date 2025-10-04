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

  // Animation properties per il container dei progetti
  const containerAnimationProps = {
    key: animationKey,
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  };

  // Animation properties per i singoli progetti con stagger effect ottimizzato
  const getProjectAnimationProps = (index: number) => ({
    initial: {
      opacity: 0,
      y: 15,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.98,
    },
    transition: {
      duration: 0.3,
      delay: index * 0.05, // Stagger delay ridotto
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
    layout: false, // Disabilitato per performance
  });

  // Animation properties per layout XL semplificato
  const getXLProjectAnimationProps = (rowIndex: number, positionIndex: number) => {
    // Calcola delay basato sulla posizione nella griglia semplificata
    const baseDelay = rowIndex * 0.1; // Delay per riga ridotto
    const positionDelay = positionIndex * 0.03; // Delay per posizione ridotto
    const totalDelay = baseDelay + positionDelay;

    return {
      initial: {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
      },
      exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
      },
      transition: {
        duration: 0.3,
        delay: totalDelay,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // Easing semplificato
      },
      layout: false, // Disabilitato per performance
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
