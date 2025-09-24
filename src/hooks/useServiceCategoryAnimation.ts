import { useState, useRef, useEffect, useCallback } from 'react';

export function useServiceCategoryAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [showLeftFadeRectangles, setShowLeftFadeRectangles] = useState(false);
  const [showRightFadeRectangles, setShowRightFadeRectangles] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rectanglesContainerRef = useRef<HTMLDivElement>(null);

  // Refs per throttling ottimizzato
  const scrollRafRef = useRef<number | null>(null);
  const rectanglesRafRef = useRef<number | null>(null);

  // Scroll handler ottimizzato - senza RAF per evitare conflitti con Lenis
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const isAtStart = scrollLeft <= 0;
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;

      setShowLeftFade(!isAtStart);
      setShowRightFade(!isAtEnd);
    }
  }, []);

  // Scroll handler ottimizzato per rectangles
  const handleRectanglesScroll = useCallback(() => {
    const rectanglesContainer = rectanglesContainerRef.current;
    if (rectanglesContainer) {
      const { scrollLeft, scrollWidth, clientWidth } = rectanglesContainer;
      const isAtStart = scrollLeft <= 0;
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;

      setShowLeftFadeRectangles(!isAtStart);
      setShowRightFadeRectangles(!isAtEnd);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const rectanglesContainer = rectanglesContainerRef.current;

    // Setup listeners solo quando expanded per performance
    if (isExpanded) {
      const setupTimer = setTimeout(() => {
        if (scrollContainer) {
          scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
          handleScroll(); // Check initial state
        }

        if (rectanglesContainer) {
          rectanglesContainer.addEventListener('scroll', handleRectanglesScroll, { passive: true });
          handleRectanglesScroll(); // Check initial state
        }
      }, 50); // Ridotto ulteriormente per responsiveness

      return () => {
        clearTimeout(setupTimer);

        // Cleanup listeners
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
        }
        if (rectanglesContainer) {
          rectanglesContainer.removeEventListener('scroll', handleRectanglesScroll);
        }
      };
    }
  }, [isExpanded, handleScroll, handleRectanglesScroll]);

  const toggleExpansion = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Animation properties ottimizzate per GPU - risolto conflitto style
  const titleAnimationProps = {
    animate: {
      opacity: isExpanded ? 1 : 0.3,
      scale: isExpanded ? 1.02 : 1,
    },
    whileHover: {
      scale: isExpanded ? 1.02 : 1.03,
      opacity: isExpanded ? 1 : 0.6,
      transition: { duration: 0.2, ease: 'easeOut' as const },
    },
    whileTap: {
      scale: 0.97,
      transition: { duration: 0.1, ease: 'easeInOut' as const },
    },
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
    style: {
      willChange: 'transform, opacity', // GPU optimization
      transformOrigin: 'left', // Aggiunto per risolvere conflitto
    },
  };

  const containerAnimationProps = {
    animate: {
      height: isExpanded ? 'auto' : '1px',
      opacity: isExpanded ? 1 : 0,
      y: isExpanded ? 0 : -10,
      marginTop: isExpanded ? '32px' : '0px',
    },
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      opacity: { duration: 0.3 },
    },
    style: {
      overflow: 'hidden',
      willChange: 'height, opacity, transform', // GPU optimization
    },
  };

  const labelsAnimationProps = {
    animate: {
      y: isExpanded ? 0 : -10, // Ridotto movimento
      opacity: isExpanded ? 1 : 0,
      // Rimosso blur per performance
    },
    transition: {
      delay: isExpanded ? 0.1 : 0,
      duration: 0.3, // Ridotto da 0.4
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
    style: { willChange: 'transform, opacity' }, // Rimosso filter
  };

  const paragraphAnimationProps = {
    animate: {
      y: isExpanded ? 0 : -10, // Ridotto movimento
      opacity: isExpanded ? 0.6 : 0,
      // Rimosso blur per performance
    },
    transition: {
      delay: isExpanded ? 0.2 : 0.1,
      duration: 0.3, // Ridotto da 0.4
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
    style: { willChange: 'transform, opacity' }, // Rimosso filter
  };

  const rectanglesAnimationProps = {
    animate: {
      y: isExpanded ? 0 : -10, // Ridotto movimento
      opacity: isExpanded ? 1 : 0,
      // Rimosso blur per performance
    },
    transition: {
      delay: isExpanded ? 0.3 : 0.05,
      duration: 0.3, // Ridotto da 0.4
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
    style: { willChange: 'transform, opacity' }, // Rimosso filter
  };

  const scrollStyles = {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    // Aggiunte ottimizzazioni scroll
    overflowX: 'auto' as const,
    WebkitOverflowScrolling: 'touch' as const, // iOS smooth scrolling
  };

  return {
    // State
    isExpanded,
    showLeftFade,
    showRightFade,
    showLeftFadeRectangles,
    showRightFadeRectangles,

    // Refs
    scrollContainerRef,
    rectanglesContainerRef,

    // Functions
    toggleExpansion,

    // Animation props ottimizzate
    titleAnimationProps,
    containerAnimationProps,
    labelsAnimationProps,
    paragraphAnimationProps,
    rectanglesAnimationProps,

    // Styles ottimizzati
    scrollStyles,
  };
}
