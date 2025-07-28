import { useState, useCallback } from 'react';

export function usePortfolioFiltersAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Animation properties per il container principale
  const containerAnimationProps = {
    animate: {
      height: isExpanded ? 'auto' : '0px',
      opacity: isExpanded ? 1 : 0,
      y: isExpanded ? 0 : -10,
    },
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      opacity: { duration: 0.3 },
    },
    style: {
      willChange: 'height, opacity, transform',
    },
  };

  // Animation properties per i singoli filtri con stagger effect
  const getFilterAnimationProps = (index: number) => ({
    animate: {
      y: isExpanded ? 0 : 20,
      opacity: isExpanded ? 1 : 0,
      scale: isExpanded ? 1 : 0.95,
      filter: isExpanded ? 'blur(0px)' : 'blur(4px)',
    },
    transition: {
      delay: isExpanded ? index * 0.08 : 0, // Stagger delay crescente
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as const, // Elastic easing
      scale: { duration: 0.4 },
      filter: { duration: 0.3 },
    },
    whileHover: {
      scale: 1.02,
      y: -2,
      transition: { 
        duration: 0.2, 
        ease: 'easeOut' as const,
      },
    },
    whileTap: {
      scale: 0.98,
      transition: { 
        duration: 0.1, 
        ease: 'easeInOut' as const,
      },
    },
    style: {
      willChange: 'transform, opacity, filter',
    },
  });

  // Animation properties per il button con rotazione dell'icona
  const buttonAnimationProps = {
    animate: {
      rotate: isExpanded ? 180 : 0,
    },
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    whileTap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    style: {
      willChange: 'transform',
    },
  };

  return {
    // State
    isExpanded,
    
    // Functions  
    toggleExpansion,
    
    // Animation props
    containerAnimationProps,
    getFilterAnimationProps,
    buttonAnimationProps,
  };
} 