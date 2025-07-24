import { useState, useEffect, useRef, useCallback } from 'react';

export function useHeaderAnimation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [shouldDisableBouncy, setShouldDisableBouncy] = useState(false);

  // Refs per throttling ottimizzato
  const scrollTimeoutRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Throttled scroll handler con RAF
  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
      rafRef.current = null;
    });
  }, []);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current !== null) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = window.setTimeout(() => {
      const height = window.innerHeight;
      setWindowHeight(height);

      // Check if we're at XL breakpoint (1280px+) and if conditions disable bouncy animation
      const isXL = window.innerWidth >= 1280;
      const headerSpaceFromTop = 90; // header height + padding
      const availableSpace = height + headerSpaceFromTop;

      setShouldDisableBouncy(isXL && availableSpace <= 1300);
      resizeTimeoutRef.current = null;
    }, 150); // 150ms debounce per resize
  }, []);

  useEffect(() => {
    // Check initial state
    handleScroll();
    handleResize();

    // Add event listeners con passive per performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      // Cleanup
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, handleResize]);

  // Desktop wrapper className originale - ripristinato
  const transitionClass = shouldDisableBouncy
    ? 'transition-all duration-500 ease-out'
    : 'transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]';

  const desktopWrapperClassName = `w-full ${
    isScrolled
      ? 'max-w-[1240px] xl:max-w-[1240px] 2xl:max-w-[1590px]'
      : 'max-w-[1240px] xl:max-w-full 2xl:max-w-[1840px]'
  } mx-auto h-[65px] rounded-[23px] hidden md:flex items-center justify-between ${transitionClass} border border-[rgba(250,250,250,0.1)] dark:border-[rgba(250,250,250,0.2)] pl-[12px] pr-[12px] ${
    isScrolled ? 'bg-[#0b0b0b]/70 backdrop-blur' : ''
  }`;

  return {
    isScrolled,
    windowHeight,
    shouldDisableBouncy,
    desktopWrapperClassName,
  };
}
