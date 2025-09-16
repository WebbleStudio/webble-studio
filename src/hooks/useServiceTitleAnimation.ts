import { useState, useEffect, useRef } from 'react';

// Hook per l'intersection observer
function useInView(ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: '-150px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isInView;
}

// Hook principale per l'animazione completa dei titoli delle service categories
export function useServiceTitleScrollAnimation(index: number = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    threshold: 0.2,
    rootMargin: '-150px 0px',
  });

  const [isVisible, setIsVisible] = useState(false);

  // Calcola il delay basato sull'indice per l'effetto stagger
  const staggerDelay = index * 0.3; // 300ms tra ogni titolo (più veloce)

  // Trigger dell'animazione quando entra in vista
  useEffect(() => {
    if (isInView && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, staggerDelay);
      return () => clearTimeout(timer);
    }
  }, [isInView, isVisible, staggerDelay]);

  return {
    ref,
    isVisible,
    staggerDelay,
  };
}
