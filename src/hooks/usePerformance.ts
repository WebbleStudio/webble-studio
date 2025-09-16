import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceConfig {
  // Rilevamento dispositivo
  isLowEndDevice: boolean;
  isSlowConnection: boolean;
  prefersReducedMotion: boolean;

  // Configurazioni dinamiche
  shouldReduceAnimations: boolean;
  shouldDisableBlur: boolean;
  shouldUseGPUAcceleration: boolean;
  maxConcurrentAnimations: number;

  // Metodi di controllo
  forcePerformanceMode: (enabled: boolean) => void;
  getAnimationDuration: (baseMs: number) => number;
  shouldSkipAnimation: (animationType: 'heavy' | 'medium' | 'light') => boolean;
}

interface DeviceCapabilities {
  cores: number;
  memory: number; // GB
  gpu: 'high' | 'medium' | 'low' | 'unknown';
  touchDevice: boolean;
}

export const usePerformance = (): PerformanceConfig => {
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    cores: 4,
    memory: 4,
    gpu: 'unknown',
    touchDevice: false,
  });

  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forcePerformanceMode, setForcePerformanceMode] = useState<boolean | null>(null);

  // Cache per evitare multiple creazioni di contesti WebGL
  const webglContextCache = useRef<{
    canvas: HTMLCanvasElement | null;
    gl: WebGLRenderingContext | null;
    gpu: DeviceCapabilities['gpu'];
    detected: boolean;
  }>({
    canvas: null,
    gl: null,
    gpu: 'unknown',
    detected: false,
  });

  // Rileva capacità dispositivo
  const detectDeviceCapabilities = useCallback(async () => {
    try {
      // CPU cores
      const cores = navigator.hardwareConcurrency || 4;

      // Memory (se disponibile)
      const memory = (navigator as any).deviceMemory || 4;

      // Touch device
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // GPU detection tramite WebGL - con cache per evitare multiple creazioni
      let gpu: DeviceCapabilities['gpu'] = 'unknown';

      if (!webglContextCache.current.detected) {
        try {
          // Usa un canvas esistente se disponibile, altrimenti creane uno
          if (!webglContextCache.current.canvas) {
            webglContextCache.current.canvas = document.createElement('canvas');
          }

          if (!webglContextCache.current.gl) {
            webglContextCache.current.gl =
              webglContextCache.current.canvas.getContext('webgl') ||
              webglContextCache.current.canvas.getContext('experimental-webgl');
          }

          const gl = webglContextCache.current.gl;
          if (gl && 'getExtension' in gl) {
            const webglContext = gl as WebGLRenderingContext;
            const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
              // Classificazione GPU basilare
              if (renderer.includes('Intel') && renderer.includes('HD')) {
                gpu = 'low';
              } else if (renderer.includes('NVIDIA') || renderer.includes('AMD')) {
                gpu = 'high';
              } else {
                gpu = 'medium';
              }
            }
          }

          // Marca come rilevato e salva il risultato
          webglContextCache.current.gpu = gpu;
          webglContextCache.current.detected = true;

          // Cleanup del contesto dopo il rilevamento per liberare risorse
          if (webglContextCache.current.gl) {
            const ext = webglContextCache.current.gl.getExtension('WEBGL_lose_context');
            if (ext) {
              ext.loseContext();
            }
            webglContextCache.current.gl = null;
          }
          if (webglContextCache.current.canvas) {
            webglContextCache.current.canvas = null;
          }
        } catch (e) {
          console.warn('GPU detection failed:', e);
        }
      } else {
        // Usa il risultato cached
        gpu = webglContextCache.current.gpu;
      }

      setDeviceCapabilities({ cores, memory, gpu, touchDevice });

      // Determina se è low-end
      const isLowEnd =
        cores <= 2 ||
        memory <= 2 ||
        gpu === 'low' ||
        /Android.*4\.|iPhone.*OS [6-9]_/.test(navigator.userAgent);
      setIsLowEndDevice(isLowEnd);
    } catch (error) {
      console.warn('Device capabilities detection failed:', error);
      // Fallback conservativo
      setIsLowEndDevice(true);
    }
  }, []);

  // Rileva connessione lenta
  const detectConnection = useCallback(() => {
    try {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      if (connection) {
        const slowTypes = ['slow-2g', '2g', '3g'];
        const isSlow = slowTypes.includes(connection.effectiveType) || connection.downlink < 1.5;
        setIsSlowConnection(isSlow);
      }
    } catch (error) {
      console.warn('Connection detection failed:', error);
    }
  }, []);

  // Rileva preferenze reduced motion
  const detectReducedMotion = useCallback(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      // Listener per cambiamenti
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (error) {
      console.warn('Reduced motion detection failed:', error);
    }
  }, []);

  // Inizializzazione
  useEffect(() => {
    detectDeviceCapabilities();
    detectConnection();
    const cleanupReducedMotion = detectReducedMotion();

    return () => {
      // Cleanup del contesto WebGL quando il componente viene smontato
      if (webglContextCache.current.gl) {
        const ext = webglContextCache.current.gl.getExtension('WEBGL_lose_context');
        if (ext) {
          ext.loseContext();
        }
        webglContextCache.current.gl = null;
      }
      if (webglContextCache.current.canvas) {
        webglContextCache.current.canvas = null;
      }
      webglContextCache.current.detected = false;

      cleanupReducedMotion?.();
    };
  }, [detectDeviceCapabilities, detectConnection, detectReducedMotion]);

  // Configurazioni derivate
  const shouldReduceAnimations =
    forcePerformanceMode ?? (isLowEndDevice || isSlowConnection || prefersReducedMotion);

  const shouldDisableBlur = isLowEndDevice || deviceCapabilities.gpu === 'low';

  const shouldUseGPUAcceleration = !isLowEndDevice && deviceCapabilities.gpu !== 'low';

  const maxConcurrentAnimations = isLowEndDevice ? 3 : deviceCapabilities.cores >= 6 ? 12 : 8;

  // Utility functions
  const getAnimationDuration = useCallback(
    (baseMs: number): number => {
      if (prefersReducedMotion) return 0;
      if (shouldReduceAnimations) return baseMs * 0.5;
      return baseMs;
    },
    [prefersReducedMotion, shouldReduceAnimations]
  );

  const shouldSkipAnimation = useCallback(
    (animationType: 'heavy' | 'medium' | 'light'): boolean => {
      if (prefersReducedMotion) return true;

      switch (animationType) {
        case 'heavy':
          return isLowEndDevice || forcePerformanceMode === true;
        case 'medium':
          return (isLowEndDevice && isSlowConnection) || forcePerformanceMode === true;
        case 'light':
          return forcePerformanceMode === true;
        default:
          return false;
      }
    },
    [isLowEndDevice, isSlowConnection, prefersReducedMotion, forcePerformanceMode]
  );

  const forcePerformanceModeToggle = useCallback((enabled: boolean) => {
    setForcePerformanceMode(enabled);

    // Salva preferenza in localStorage
    try {
      localStorage.setItem('webble-performance-mode', JSON.stringify(enabled));
    } catch (e) {
      console.warn('Failed to save performance preference:', e);
    }
  }, []);

  // Carica preferenza salvata
  useEffect(() => {
    try {
      const saved = localStorage.getItem('webble-performance-mode');
      if (saved !== null) {
        setForcePerformanceMode(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load performance preference:', e);
    }
  }, []);

  return {
    // Stato dispositivo
    isLowEndDevice,
    isSlowConnection,
    prefersReducedMotion,

    // Configurazioni
    shouldReduceAnimations,
    shouldDisableBlur,
    shouldUseGPUAcceleration,
    maxConcurrentAnimations,

    // Controlli
    forcePerformanceMode: forcePerformanceModeToggle,
    getAnimationDuration,
    shouldSkipAnimation,
  };
};
