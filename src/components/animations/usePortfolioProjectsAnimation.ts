import { useState, useCallback } from 'react';

export function usePortfolioProjectsAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Forza una nuova animazione quando cambiano i filtri
  const triggerFilterAnimation = useCallback(() => {
    setIsAnimating(true);
    setAnimationKey(prev => prev + 1);
    
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

  // Animation properties per i singoli progetti con stagger effect
  const getProjectAnimationProps = (index: number) => ({
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
      duration: 0.4,
      delay: index * 0.1, // Stagger delay
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
    layout: true, // Layout animation per smooth repositioning
  });

  // Animation properties per layout XL personalizzato
  const getXLProjectAnimationProps = (rowIndex: number, positionIndex: number) => {
    // Calcola delay basato sulla posizione nella griglia personalizzata
    const baseDelay = rowIndex * 0.2; // Delay per riga
    const positionDelay = positionIndex * 0.08; // Delay per posizione nella riga
    const totalDelay = baseDelay + positionDelay;

    return {
      initial: { 
        opacity: 0, 
        y: 30,
        scale: 0.92,
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
      },
      exit: { 
        opacity: 0, 
        y: -15,
        scale: 0.92,
      },
      transition: {
        duration: 0.5,
        delay: totalDelay,
        ease: [0.34, 1.56, 0.64, 1] as const, // Elastic easing per effetto bounce
      },
      layout: true,
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