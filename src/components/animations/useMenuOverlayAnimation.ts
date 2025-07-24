import { useState, useEffect, useRef, useCallback } from 'react';

type AnimationState = 'closed' | 'opening' | 'open' | 'closing';

export function useMenuOverlayAnimation(isScrolled: boolean, menuOpen: boolean) {
  // SSR-safe: overlay is always closed until mounted on client
  const [isMounted, setIsMounted] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationState>('closed');
  const timeoutRef = useRef<number | null>(null);
  const previousMenuOpenRef = useRef(menuOpen);
  const [headerDimensions, setHeaderDimensions] = useState({
    width: '100%',
    height: '65px',
    left: '0',
    top: '0',
  });

  // On mount, enable client logic
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update header dimensions on mount, resize, or scroll state change
  useEffect(() => {
    if (!isMounted) return;
    function calcHeaderDimensions() {
      const windowWidth = window.innerWidth;
      let headerWidth: string;
      let headerLeft: string;
      if (windowWidth >= 1920) {
        headerWidth = isScrolled ? '1590px' : '1840px';
      } else if (windowWidth >= 1300) {
        headerWidth = isScrolled ? '1240px' : `${windowWidth - 160}px`;
      } else {
        headerWidth = '1240px';
      }
      const headerWidthNum = parseInt(headerWidth);
      headerLeft = `${(windowWidth - headerWidthNum) / 2}px`;
      if (windowWidth < 768) {
        headerWidth = `${windowWidth - 40}px`;
        headerLeft = '20px';
      }
      setHeaderDimensions({
        width: headerWidth,
        height: '65px',
        left: headerLeft,
        top: '12.5px',
      });
    }
    calcHeaderDimensions();
    window.addEventListener('resize', calcHeaderDimensions);
    return () => window.removeEventListener('resize', calcHeaderDimensions);
  }, [isMounted, isScrolled]);

  // Disable scroll when overlay is open (client only)
  useEffect(() => {
    if (!isMounted) return;
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, isMounted]);

  // Animation state machine (client only)
  useEffect(() => {
    if (!isMounted) return;
    const wasOpen = previousMenuOpenRef.current;
    previousMenuOpenRef.current = menuOpen;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (menuOpen && !wasOpen) {
      setAnimationState('opening');
      timeoutRef.current = window.setTimeout(() => {
        setAnimationState('open');
        timeoutRef.current = null;
      }, 16);
    } else if (!menuOpen && wasOpen) {
      setAnimationState('closing');
      timeoutRef.current = window.setTimeout(() => {
        setAnimationState('closed');
        timeoutRef.current = null;
      }, 400);
    }
  }, [menuOpen, isMounted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Overlay style (SSR-safe)
  const getOverlayStyle = useCallback(() => {
    if (!isMounted) {
      return { display: 'none' };
    }
    const baseTransition = 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
    switch (animationState) {
      case 'closed':
        return { display: 'none' };
      case 'opening':
        return {
          ...headerDimensions,
          opacity: 1,
          transition: baseTransition,
        };
      case 'open':
        return {
          width: 'calc(100% - 25px)',
          height: 'calc(100% - 25px)',
          left: '12.5px',
          top: '12.5px',
          opacity: 1,
          transition: baseTransition,
        };
      case 'closing':
        return {
          ...headerDimensions,
          opacity: 0,
          transition: baseTransition,
        };
      default:
        return { display: 'none' };
    }
  }, [animationState, headerDimensions, isMounted]);

  const overlayClassName = `fixed z-[101] text-text-secondary bg-bg-secondary rounded-[23px] flex flex-col items-center justify-center border-[0.5px] menu-overlay`;

  return {
    overlayStyle: getOverlayStyle(),
    overlayClassName,
    isVisible: isMounted ? animationState !== 'closed' : false,
  };
}
