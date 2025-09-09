'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePerformance } from '@/hooks/usePerformance';

interface UseSplineLazyLoadProps {
  mobileUrl: string;
  desktopUrl: string;
  delay?: number;
}

export const useSplineLazyLoad = ({
  mobileUrl,
  desktopUrl,
  delay = 300, // Ridotto delay per UX migliore
}: UseSplineLazyLoadProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const cleanupTimeoutRef = useRef<number | null>(null);
  const webglContextsRef = useRef<WebGLRenderingContext[]>([]);

  // Performance optimization hook
  const { shouldSkipAnimation } = usePerformance();

  // Enhanced cleanup function per rimozione COMPLETA dal DOM e memoria
  const cleanupSpline = useCallback(() => {
    setIsCleaningUp(true);

    // Clear any pending timeouts
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    // EMERGENCY: Force cleanup ALL WebGL contexts immediately
    console.warn('🚨 [WebGLEmergency] Force cleaning ALL WebGL contexts');

    // Get ALL canvases in the document
    const allCanvases = document.querySelectorAll('canvas');
    console.log(`🧹 [WebGLCleanup] Found ${allCanvases.length} canvases to clean`);

    allCanvases.forEach((canvas, index) => {
      try {
        // Force lose context on ALL canvases
        const gl =
          canvas.getContext('webgl') ||
          canvas.getContext('webgl2') ||
          canvas.getContext('experimental-webgl');
        if (gl) {
          const loseContextExt = gl.getExtension('WEBGL_lose_context');
          if (loseContextExt) {
            loseContextExt.loseContext();
            console.log(`✅ [WebGLCleanup] Lost context for canvas ${index}`);
          }
        }

        // Remove canvas from DOM if it's not critical
        if (
          canvas.parentNode &&
          !canvas.closest('[class*="critical"]') &&
          !canvas.id.includes('critical')
        ) {
          canvas.parentNode.removeChild(canvas);
          console.log(`🗑️ [WebGLCleanup] Removed canvas ${index} from DOM`);
        }
      } catch (e) {
        console.warn(`⚠️ [WebGLCleanup] Error cleaning canvas ${index}:`, e);
      }
    });

    // 1. Rimuovi TUTTI gli elementi spline-viewer dal DOM
    const splineElements = document.querySelectorAll('spline-viewer');
    splineElements.forEach((el) => {
      // Trigger cleanup events se disponibili
      if ('cleanup' in el && typeof el.cleanup === 'function') {
        el.cleanup();
      }

      // Force removal dal DOM
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    // 2. Cleanup WebGL contexts più aggressivo
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((canvas) => {
      // Check canvas dimensions to prevent WebGL errors
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('⚠️ [WebGLCleanup] Removing canvas with zero dimensions');
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        return;
      }

      const gl = (canvas.getContext('webgl') ||
        canvas.getContext('webgl2') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

      if (gl && 'getExtension' in gl) {
        // Store reference per future cleanup se necessario
        webglContextsRef.current.push(gl);

        // Lose WebGL context completamente
        const loseContextExt = gl.getExtension('WEBGL_lose_context');
        if (loseContextExt) {
          loseContextExt.loseContext();
        }

        // Clear all WebGL resources
        try {
          const numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
          for (let unit = 0; unit < numTextureUnits; ++unit) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
          }
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } catch (e) {
          console.warn('WebGL cleanup warning:', e);
        }
      }

      // Remove canvas dal DOM se non necessario
      if (
        canvas.parentNode &&
        !canvas.closest('[class*="critical"]') &&
        !canvas.id.includes('critical')
      ) {
        canvas.parentNode.removeChild(canvas);
      }
    });

    // 3. Force garbage collection hint (se disponibile)
    if (window.gc && typeof window.gc === 'function') {
      try {
        window.gc();
      } catch (e) {
        // Ignore - gc non sempre disponibile
      }
    }

    // 4. Clear memory hints
    if ('memory' in performance && performance.memory) {
      // Memory info available - could be used for logging
      const memInfo = performance.memory as any;
      if (memInfo.usedJSHeapSize) {
        console.log(
          '🧹 [SplineCleanup] Memory after cleanup:',
          Math.round(memInfo.usedJSHeapSize / 1048576),
          'MB'
        );
      }
    }

    // Reset states
    setIsLoaded(false);
    setShouldRender(false);
    setIsCleaningUp(false);

    console.log('🧹 [SplineViewer] Complete cleanup performed');
  }, []);

  // Load Spline script con gestione cache ottimizzata
  const loadSplineScript = useCallback(() => {
    // EMERGENCY: Check WebGL context count before loading
    const canvasCount = document.querySelectorAll('canvas').length;
    const splineViewerCount = document.querySelectorAll('spline-viewer').length;

    console.log(
      `🔍 [WebGLCheck] Canvas count: ${canvasCount}, Spline viewers: ${splineViewerCount}`
    );

    // If too many contexts, skip loading and cleanup first
    if (canvasCount > 5 || splineViewerCount > 2) {
      console.warn('🚨 [WebGLEmergency] Too many WebGL contexts detected, cleaning up first');
      cleanupSpline();

      // Wait a bit then try again
      setTimeout(() => {
        const newCanvasCount = document.querySelectorAll('canvas').length;
        if (newCanvasCount <= 2) {
          console.log('✅ [WebGLRecovery] Contexts cleaned, retrying load');
          loadSplineScript();
        } else {
          console.error('❌ [WebGLFailure] Still too many contexts, skipping Spline load');
          return;
        }
      }, 1000);
      return;
    }

    // Check if script already exists (più robust check)
    const existingScript = document.querySelector('script[src*="spline-viewer.js"]');
    if (scriptRef.current || existingScript) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.57/build/spline-viewer.js';
    script.async = true;
    script.crossOrigin = 'anonymous'; // Security

    script.onload = () => {
      setIsScriptLoaded(true);
      console.log('✅ [SplineViewer] Script loaded successfully');
    };

    script.onerror = () => {
      console.warn('❌ [SplineViewer] Failed to load script');
      setIsScriptLoaded(false);
    };

    document.head.appendChild(script);
    scriptRef.current = script;
  }, []);

  // Enhanced Intersection Observer con hysteresis ottimizzata
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;
        const boundingRect = entry.boundingClientRect;

        // More sophisticated visibility detection
        const isCompletelyVisible = intersectionRatio > 0.5;
        const isPartiallyVisible = intersectionRatio > 0.1;
        const isComingIntoView = boundingRect.top < window.innerHeight && boundingRect.bottom > 0;

        if (isIntersecting && isPartiallyVisible && isComingIntoView) {
          // Entering viewport - START loading process
          console.log('👁️ [SplineViewer] Entering viewport, preparing to load...');
          setIsVisible(true);
          setShouldRender(true);

          // Load script con delay appropriato
          setTimeout(
            () => {
              loadSplineScript();
            },
            shouldSkipAnimation('heavy') ? 100 : delay
          );
        } else if (!isIntersecting || (!isPartiallyVisible && !isComingIntoView)) {
          // COMPLETELY out of viewport - aggressive cleanup
          console.log('👁️ [SplineViewer] Left viewport, scheduling cleanup...');
          setIsVisible(false);

          // EMERGENCY: Immediate cleanup if too many contexts
          const currentCanvasCount = document.querySelectorAll('canvas').length;
          if (currentCanvasCount > 3) {
            console.warn(
              '🚨 [WebGLEmergency] Too many contexts during viewport exit, immediate cleanup'
            );
            cleanupSpline();
            return;
          }

          // Immediate cleanup for performance mode, delayed for normal mode
          const cleanupDelay = shouldSkipAnimation('heavy') ? 500 : 1000; // Ridotto da 2000ms

          cleanupTimeoutRef.current = window.setTimeout(() => {
            // Double check se siamo ancora fuori viewport
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              const isStillOutside =
                rect.top > viewportHeight * 1.2 || rect.bottom < -viewportHeight * 0.2;

              if (isStillOutside) {
                cleanupSpline();
              }
            }
          }, cleanupDelay);
        }
      },
      {
        // Ottimizzato per better performance e detection
        rootMargin: '50px 0px 100px 0px', // Asimmetrico: più aggressivo verso il basso
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0], // Multiple thresholds per controllo fine
      }
    );

    observerRef.current.observe(container);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, [loadSplineScript, delay, cleanupSpline, shouldSkipAnimation]);

  // Set loaded state quando tutto è pronto (con fade-in fluido)
  useEffect(() => {
    if (isScriptLoaded && isVisible && shouldRender && !isCleaningUp) {
      // Check container dimensions before loading to prevent WebGL errors
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const hasValidDimensions = rect.width > 0 && rect.height > 0;

        if (!hasValidDimensions) {
          console.warn('⚠️ [SplineViewer] Container has invalid dimensions, delaying load');
          return;
        }
      }

      // Delay per DOM stabilization + smooth appearance
      const loadTimer = setTimeout(() => {
        setIsLoaded(true);
        console.log('✨ [SplineViewer] Fully loaded and ready');
      }, 100); // Ridotto per UX più responsive

      return () => clearTimeout(loadTimer);
    }
  }, [isScriptLoaded, isVisible, shouldRender, isCleaningUp]);

  // Cleanup completo su unmount del componente
  useEffect(() => {
    return () => {
      cleanupSpline();

      // Remove script se è stato aggiunto da questo hook
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }

      // Clear all timeouts
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, [cleanupSpline]);

  return {
    containerRef,
    isLoaded: isLoaded && shouldRender && !isCleaningUp,
    isVisible,
    isLoading: shouldRender && !isLoaded && !isCleaningUp,
    shouldRender: shouldRender && !isCleaningUp,
    mobileUrl,
    desktopUrl,
    cleanup: cleanupSpline, // Esposto per cleanup manuale se necessario
  };
};
