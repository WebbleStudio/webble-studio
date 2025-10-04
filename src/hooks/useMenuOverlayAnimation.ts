import { useState, useEffect, useRef, useCallback } from 'react';
import {
  menuOverlayVariants,
  menuContentVariants,
  menuItemVariants,
  menuSeparatorVariants,
  getMenuTransitions,
} from './menuAnimations';

type AnimationState = 'closed' | 'open' | 'closing';

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
  // Memoize per evitare re-calcoli durante le animazioni
  useEffect(() => {
    if (!isMounted) return;

    function calcHeaderDimensions() {
      const windowWidth = window.innerWidth;
      let headerWidth: number;
      let headerLeft: string;

      // Misura direttamente l'elemento del header se disponibile
      const headerElement = document.querySelector('.desktop-wrapper') as HTMLElement;

      if (headerElement && windowWidth >= 768) {
        // Usa le dimensioni reali del header
        const headerRect = headerElement.getBoundingClientRect();
        headerWidth = headerRect.width;
        headerLeft = `${headerRect.left}px`;
      } else {
        // Fallback per mobile o se l'elemento non è trovato
        if (windowWidth >= 1920) {
          headerWidth = isScrolled ? 1590 : 1840;
        } else if (windowWidth >= 1300) {
          if (isScrolled) {
            headerWidth = 1240;
          } else {
            headerWidth = windowWidth - 60;
          }
        } else if (windowWidth >= 768) {
          const containerWidth = Math.min(1240, windowWidth - 60);
          headerWidth = containerWidth;
        } else {
          headerWidth = windowWidth - 40;
        }

        // Calcola la posizione left per centrare l'elemento
        headerLeft = `${(windowWidth - headerWidth) / 2}px`;

        if (windowWidth < 768) {
          headerLeft = '20px';
        }
      }

      // Assicurati che la larghezza non superi mai quella dello schermo
      const maxWidth = Math.min(headerWidth, windowWidth - 40);

      setHeaderDimensions({
        width: `${maxWidth}px`,
        height: '65px',
        left: headerLeft,
        top: '12.5px',
      });
    }

    // Avoid recalculating during menu animation
    if (animationState === 'closed') {
      calcHeaderDimensions();
      window.addEventListener('resize', calcHeaderDimensions);
      return () => window.removeEventListener('resize', calcHeaderDimensions);
    }
  }, [isMounted, isScrolled, animationState]);

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

  // Simplified animation state machine (client only)
  useEffect(() => {
    if (!isMounted) return;
    const wasOpen = previousMenuOpenRef.current;
    previousMenuOpenRef.current = menuOpen;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (menuOpen && !wasOpen) {
      // Directly go to open state - no more "opening" flicker
      setAnimationState('open');
    } else if (!menuOpen && wasOpen) {
      setAnimationState('closing');
      timeoutRef.current = window.setTimeout(() => {
        setAnimationState('closed');
        timeoutRef.current = null;
      }, 250); // Reduced from 400ms to 250ms for faster response
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

  // Overlay style now returns only position/size, no transitions (Framer Motion will handle everything)
  const getOverlayStyle = useCallback(() => {
    if (!isMounted || animationState === 'closed') {
      return { display: 'none' };
    }

    // Always return the initial position for Framer Motion to animate from
    return {
      ...headerDimensions,
      // Remove all CSS transitions - let Framer Motion handle everything
    };
  }, [headerDimensions, isMounted, animationState]);

  const overlayClassName = `fixed z-[101] text-text-secondary bg-[#0b0b0b]/70 dark:bg-[#f4f4f4]/70 backdrop-blur-lg rounded-[23px] flex flex-col items-center justify-center border-[0.5px] menu-overlay`;

  // Get animation variants and transitions
  const transitions = getMenuTransitions(animationState);

  return {
    overlayStyle: getOverlayStyle(),
    overlayClassName,
    isVisible: isMounted ? animationState !== 'closed' : false,
    animationState,
    headerDimensions, // Export for use in Framer Motion
    // Animation variants
    overlayVariants: menuOverlayVariants,
    contentVariants: menuContentVariants,
    itemVariants: menuItemVariants,
    separatorVariants: menuSeparatorVariants,
    // Dynamic transitions
    transitions,
  };
}
