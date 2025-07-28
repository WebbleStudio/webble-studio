import { useState, useEffect } from 'react';

interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  saveData: boolean;
}

export function useNetworkOptimization() {
  const [shouldOptimize, setShouldOptimize] = useState(false);
  const [preloadStrategy, setPreloadStrategy] = useState<'none' | 'metadata' | 'auto'>('metadata');

  useEffect(() => {
    // Check per supporto Network Information API
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const updateNetworkInfo = () => {
        const effectiveType = connection.effectiveType;
        const saveData = connection.saveData || false;
        const downlink = connection.downlink || 1;

        // Ottimizza per connessioni lente o modalità risparmio dati
        const shouldOpt = 
          effectiveType === '2g' || 
          effectiveType === 'slow-2g' || 
          saveData || 
          downlink < 1.5;

        setShouldOptimize(shouldOpt);

        // Strategia di preload basata sulla connessione
        if (shouldOpt) {
          setPreloadStrategy('none');
        } else if (effectiveType === '3g' || downlink < 4) {
          setPreloadStrategy('metadata');
        } else {
          setPreloadStrategy('auto');
        }
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);

      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    } else {
      // Fallback per browser senza supporto Network API
      // Controlla se c'è preferenza per ridurre movimento/animazioni
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShouldOptimize(prefersReducedMotion);
      setPreloadStrategy(prefersReducedMotion ? 'none' : 'metadata');
    }
  }, []);

  return {
    shouldOptimize,
    preloadStrategy,
    shouldAutoPlay: !shouldOptimize, // Non autoplay se connessione lenta
    shouldLoop: !shouldOptimize, // Non loop se connessione lenta
  };
} 