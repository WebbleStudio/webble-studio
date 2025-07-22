import { useState, useRef, useEffect } from 'react';

export function useServiceCategoryAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [showLeftFadeRectangles, setShowLeftFadeRectangles] = useState(false);
  const [showRightFadeRectangles, setShowRightFadeRectangles] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rectanglesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const rectanglesContainer = rectanglesContainerRef.current;

    const handleScroll = () => {
      if (scrollContainer) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        const isAtStart = scrollLeft <= 0;
        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;

        setShowLeftFade(!isAtStart);
        setShowRightFade(!isAtEnd);
      }
    };

    const handleRectanglesScroll = () => {
      if (rectanglesContainer) {
        const { scrollLeft, scrollWidth, clientWidth } = rectanglesContainer;
        const isAtStart = scrollLeft <= 0;
        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;

        setShowLeftFadeRectangles(!isAtStart);
        setShowRightFadeRectangles(!isAtEnd);
      }
    };

    // Add event listeners when elements are available
    const timer = setTimeout(() => {
      if (scrollContainer && isExpanded) {
        scrollContainer.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state
      }

      if (rectanglesContainer && isExpanded) {
        rectanglesContainer.addEventListener('scroll', handleRectanglesScroll);
        handleRectanglesScroll(); // Check initial state
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (rectanglesContainer) {
        rectanglesContainer.removeEventListener('scroll', handleRectanglesScroll);
      }
    };
  }, [isExpanded]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Animation properties for different elements
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
    style: { overflow: 'hidden' },
  };

  const labelsAnimationProps = {
    animate: {
      y: isExpanded ? 0 : -15,
      opacity: isExpanded ? 1 : 0,
      filter: isExpanded ? 'blur(0px)' : 'blur(8px)',
    },
    transition: {
      delay: isExpanded ? 0.1 : 0,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  };

  const paragraphAnimationProps = {
    animate: {
      y: isExpanded ? 0 : -15,
      opacity: isExpanded ? 0.6 : 0,
      filter: isExpanded ? 'blur(0px)' : 'blur(8px)',
    },
    transition: {
      delay: isExpanded ? 0.2 : 0.1,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  };

  const rectanglesAnimationProps = {
    animate: {
      y: isExpanded ? 0 : -15,
      opacity: isExpanded ? 1 : 0,
      filter: isExpanded ? 'blur(0px)' : 'blur(8px)',
    },
    transition: {
      delay: isExpanded ? 0.3 : 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  };

  const scrollStyles = {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
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

    // Animation props
    titleAnimationProps,
    containerAnimationProps,
    labelsAnimationProps,
    paragraphAnimationProps,
    rectanglesAnimationProps,

    // Styles
    scrollStyles,
  };
}
