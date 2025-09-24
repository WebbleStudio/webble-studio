'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePerformance } from './usePerformance';

interface AnimationInstance {
  id: string;
  priority: 'low' | 'medium' | 'high';
  type: 'light' | 'medium' | 'heavy';
  isActive: boolean;
  startTime: number;
}

interface UseAnimationManagerReturn {
  /** Registra una nuova animazione */
  registerAnimation: (
    id: string,
    priority: 'low' | 'medium' | 'high',
    type: 'light' | 'medium' | 'heavy'
  ) => boolean;
  /** Rimuove un'animazione */
  unregisterAnimation: (id: string) => void;
  /** Controlla se un'animazione può essere eseguita */
  canAnimate: (id: string) => boolean;
  /** Numero di animazioni attive */
  activeAnimationsCount: number;
  /** Se il sistema è in stato di overload */
  isOverloaded: boolean;
}

export const useAnimationManager = (): UseAnimationManagerReturn => {
  const [animations, setAnimations] = useState<Map<string, AnimationInstance>>(new Map());
  const [isOverloaded, setIsOverloaded] = useState(false);

  const cleanupIntervalRef = useRef<number | null>(null);
  const performanceCheckRef = useRef<number | null>(null);

  // Performance configuration
  const { maxConcurrentAnimations, shouldReduceAnimations, isLowEndDevice } = usePerformance();

  // Dynamic limits based on device capabilities
  const getAnimationLimits = useCallback(() => {
    const baseLimits = {
      heavy: isLowEndDevice ? 1 : 3,
      medium: isLowEndDevice ? 2 : 5,
      light: isLowEndDevice ? 3 : 8,
      total: Math.min(maxConcurrentAnimations, isLowEndDevice ? 4 : 10),
    };

    if (shouldReduceAnimations) {
      return {
        heavy: Math.max(1, Math.floor(baseLimits.heavy * 0.5)),
        medium: Math.max(1, Math.floor(baseLimits.medium * 0.6)),
        light: Math.max(2, Math.floor(baseLimits.light * 0.7)),
        total: Math.max(3, Math.floor(baseLimits.total * 0.6)),
      };
    }

    return baseLimits;
  }, [maxConcurrentAnimations, shouldReduceAnimations, isLowEndDevice]);

  // Performance monitoring
  const checkPerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check frame rate if available
    if ('performance' in window && 'now' in window.performance) {
      const now = performance.now();

      // Simple frame rate estimation
      if (performanceCheckRef.current !== null) {
        const timeDelta = now - performanceCheckRef.current;
        const estimatedFPS = 1000 / timeDelta;

        // If FPS drops below 30, consider overloaded
        const isCurrentlyOverloaded = estimatedFPS < 30;
        setIsOverloaded(isCurrentlyOverloaded);

        // Auto-reduce animations if overloaded
        if (isCurrentlyOverloaded) {
          console.warn('🐌 [AnimationManager] Performance drop detected, reducing animations');
          // Automatically pause low-priority animations
          setAnimations((prev) => {
            const updated = new Map(prev);
            for (const [id, anim] of updated) {
              if (anim.priority === 'low' && anim.isActive) {
                updated.set(id, { ...anim, isActive: false });
              }
            }
            return updated;
          });
        }
      }

      performanceCheckRef.current = now;
    }
  }, []);

  // Animation cleanup - remove expired animations
  const cleanupAnimations = useCallback(() => {
    const now = performance.now();
    const maxAge = 30000; // 30 seconds max age for animations

    setAnimations((prev) => {
      const updated = new Map(prev);
      let hasChanges = false;

      for (const [id, anim] of updated) {
        if (now - anim.startTime > maxAge) {
          updated.delete(id);
          hasChanges = true;
          console.log(`🧹 [AnimationManager] Cleaned up expired animation: ${id}`);
        }
      }

      return hasChanges ? updated : prev;
    });
  }, []);

  // Register new animation
  const registerAnimation = useCallback(
    (
      id: string,
      priority: 'low' | 'medium' | 'high',
      type: 'light' | 'medium' | 'heavy'
    ): boolean => {
      const limits = getAnimationLimits();
      const currentAnimations = Array.from(animations.values()).filter((a) => a.isActive);

      // Check total limit
      if (currentAnimations.length >= limits.total) {
        console.warn(`🚫 [AnimationManager] Total animation limit reached (${limits.total})`);
        return false;
      }

      // Check type-specific limits
      const typeCount = currentAnimations.filter((a) => a.type === type).length;
      if (typeCount >= limits[type]) {
        console.warn(`🚫 [AnimationManager] ${type} animation limit reached (${limits[type]})`);
        return false;
      }

      // If overloaded, only allow high priority animations
      if (isOverloaded && priority !== 'high') {
        console.warn(
          `🚫 [AnimationManager] System overloaded, only high priority animations allowed`
        );
        return false;
      }

      // Register the animation
      const newAnimation: AnimationInstance = {
        id,
        priority,
        type,
        isActive: true,
        startTime: performance.now(),
      };

      setAnimations((prev) => new Map(prev).set(id, newAnimation));
      console.log(`✅ [AnimationManager] Registered animation: ${id} (${type}, ${priority})`);
      return true;
    },
    [animations, getAnimationLimits, isOverloaded]
  );

  // Unregister animation
  const unregisterAnimation = useCallback((id: string) => {
    setAnimations((prev) => {
      const updated = new Map(prev);
      if (updated.delete(id)) {
        console.log(`🗑️ [AnimationManager] Unregistered animation: ${id}`);
      }
      return updated;
    });
  }, []);

  // Check if animation can run
  const canAnimate = useCallback(
    (id: string): boolean => {
      const animation = animations.get(id);
      return animation ? animation.isActive : false;
    },
    [animations]
  );

  // Setup cleanup intervals
  useEffect(() => {
    cleanupIntervalRef.current = window.setInterval(cleanupAnimations, 5000); // Every 5s

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [cleanupAnimations]);

  // Setup performance monitoring ridotto per performance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const monitoringInterval = setInterval(checkPerformance, 3000); // Ridotto da 1s a 3s

    return () => {
      clearInterval(monitoringInterval);
    };
  }, [checkPerformance]);

  const activeAnimationsCount = Array.from(animations.values()).filter((a) => a.isActive).length;

  return {
    registerAnimation,
    unregisterAnimation,
    canAnimate,
    activeAnimationsCount,
    isOverloaded,
  };
};
