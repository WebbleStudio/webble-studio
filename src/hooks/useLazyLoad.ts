'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePerformance } from './usePerformance';

interface UseLazyLoadOptions {
  /** Margine dal viewport prima di triggerare il caricamento */
  rootMargin?: string;
  /** Soglia di intersezione per triggerare il caricamento */
  threshold?: number | number[];
  /** Delay prima del caricamento dopo l'intersezione */
  delay?: number;
  /** Se deve caricare solo una volta o re-caricare ad ogni intersezione */
  once?: boolean;
  /** Se deve pre-caricare anche quando non visibile (per componenti critici) */
  eager?: boolean;
}

interface UseLazyLoadReturn {
  /** Ref da attachare all'elemento da osservare */
  ref: React.RefObject<HTMLElement | null>;
  /** Se l'elemento è attualmente visibile */
  isVisible: boolean;
  /** Se l'elemento è stato caricato */
  isLoaded: boolean;
  /** Se dovrebbe renderizzare il contenuto */
  shouldRender: boolean;
  /** Funzione per forzare il caricamento */
  forceLoad: () => void;
  /** Funzione per resettare lo stato */
  reset: () => void;
}

export const useLazyLoad = (options: UseLazyLoadOptions = {}): UseLazyLoadReturn => {
  const {
    rootMargin = '200px 0px 200px 0px',
    threshold = 0.1,
    delay = 0,
    once = true,
    eager = false,
  } = options;

  const [isVisible, setIsVisible] = useState(eager);
  const [isLoaded, setIsLoaded] = useState(eager);
  const [shouldRender, setShouldRender] = useState(eager);

  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(eager);

  // Performance hook per adaptive loading
  const { shouldReduceAnimations, isLowEndDevice } = usePerformance();

  // Cleanup timeout
  const clearLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Force load function
  const forceLoad = useCallback(() => {
    setIsVisible(true);
    setShouldRender(true);

    const effectiveDelay = isLowEndDevice ? Math.max(delay, 100) : delay;

    if (effectiveDelay > 0) {
      clearLoadingTimeout();
      timeoutRef.current = window.setTimeout(() => {
        setIsLoaded(true);
        hasTriggeredRef.current = true;
      }, effectiveDelay);
    } else {
      setIsLoaded(true);
      hasTriggeredRef.current = true;
    }
  }, [delay, isLowEndDevice, clearLoadingTimeout]);

  // Reset function
  const reset = useCallback(() => {
    setIsVisible(false);
    setIsLoaded(false);
    setShouldRender(false);
    hasTriggeredRef.current = false;
    clearLoadingTimeout();
  }, [clearLoadingTimeout]);

  // Enhanced intersection observer
  useEffect(() => {
    const element = elementRef.current;
    if (!element || eager) return;

    // Adaptive threshold per dispositivi low-end
    const adaptiveThreshold = isLowEndDevice
      ? Array.isArray(threshold)
        ? [threshold[0]]
        : threshold
      : threshold;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;
        const boundingRect = entry.boundingClientRect;

        // Simplified visibility detection to reduce flicker
        const isVisible = isIntersecting && intersectionRatio > 0.05;

        if (isVisible) {
          console.log(`👁️ [LazyLoad] Element entering viewport`);

          // Se already triggered e once=true, non ri-triggerare
          if (hasTriggeredRef.current && once) return;

          setIsVisible(true);
          setShouldRender(true);

          // Adaptive delay based on performance
          const effectiveDelay = shouldReduceAnimations
            ? Math.min(delay, 50) // Ridotto delay per modalità performance
            : delay;

          if (effectiveDelay > 0) {
            clearLoadingTimeout();
            timeoutRef.current = window.setTimeout(() => {
              setIsLoaded(true);
              hasTriggeredRef.current = true;
            }, effectiveDelay);
          } else {
            setIsLoaded(true);
            hasTriggeredRef.current = true;
          }
        }
      },
      {
        rootMargin,
        threshold: adaptiveThreshold,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearLoadingTimeout();
    };
  }, [
    rootMargin,
    threshold,
    delay,
    once,
    eager,
    isLowEndDevice,
    shouldReduceAnimations,
    clearLoadingTimeout,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLoadingTimeout();
    };
  }, [clearLoadingTimeout]);

  return {
    ref: elementRef,
    isVisible,
    isLoaded,
    shouldRender,
    forceLoad,
    reset,
  };
};
