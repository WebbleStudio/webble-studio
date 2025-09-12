'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Cerca l'istanza di Lenis esistente nel DOM
    const lenisInstance = (window as any).lenis;
    if (lenisInstance) {
      lenisRef.current = lenisInstance;
    }
  }, []);

  const scrollTo = (target: string | number | HTMLElement, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    }
  };

  return { scrollTo, lenis: lenisRef.current };
}
