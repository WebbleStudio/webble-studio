import { useEffect } from 'react';

/**
 * Hook per gestire il viewport height su mobile browser
 * Risolve il problema della toolbar di Chrome che cambia l'altezza del viewport
 */
export function useViewportHeight() {
  useEffect(() => {
    let isInitialized = false;
    
    // Funzione per aggiornare la CSS custom property con l'altezza corretta
    const updateViewportHeight = () => {
      // CRITICAL: Always use visualViewport on mobile to avoid Chrome innerHeight bug
      // Chrome has a bug where innerHeight changes incorrectly during scroll (773px vs 695px)
      // visualViewport.height is the ONLY reliable value
      const vh = window.visualViewport 
        ? window.visualViewport.height * 0.01 
        : window.innerHeight * 0.01;
      
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      if (!isInitialized) {
        isInitialized = true;
      }
    };

    const isMobile = window.innerWidth < 768;
    
    // Strategia multi-livello per catturare il momento giusto
    // 1. Aspetta che il documento sia completamente caricato
    if (document.readyState === 'complete') {
      // Documento già caricato, aspetta solo la toolbar
      setTimeout(updateViewportHeight, isMobile ? 500 : 100);
    } else {
      // Aspetta il load completo
      const handleLoad = () => {
        setTimeout(updateViewportHeight, isMobile ? 500 : 100);
      };
      window.addEventListener('load', handleLoad);
    }
    
    // 2. Update immediato dopo un breve delay (fallback)
    const quickTimer = setTimeout(updateViewportHeight, isMobile ? 100 : 0);
    
    // 3. Update dopo che la pagina è "settled" (più lungo)
    const settledTimer = setTimeout(updateViewportHeight, isMobile ? 1000 : 300);

    // 4. Update su resize
    window.addEventListener('resize', updateViewportHeight, { passive: true });
    
    // 5. Update su visualViewport changes (più accurato per toolbar mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      // Anche su scroll per catturare hide/show toolbar
      window.visualViewport.addEventListener('scroll', updateViewportHeight);
    }

    // 6. Update su orientationchange
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewportHeight, isMobile ? 500 : 100);
    });
    
    // 7. Update su scroll (per catturare toolbar collapse/expand)
    let scrollTimer: number | null = null;
    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(updateViewportHeight, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 8. Force repaint/reflow dopo caricamento (mobile only)
    if (isMobile) {
      const forceRepaint = () => {
        // Force a reflow by reading offsetHeight
        document.body.offsetHeight;
        // Update again after reflow
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            updateViewportHeight();
          });
        });
      };
      
      setTimeout(forceRepaint, 800);
      setTimeout(forceRepaint, 1500);
    }

    return () => {
      clearTimeout(quickTimer);
      clearTimeout(settledTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      window.removeEventListener('scroll', handleScroll);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
        window.visualViewport.removeEventListener('scroll', updateViewportHeight);
      }
    };
  }, []);
}

