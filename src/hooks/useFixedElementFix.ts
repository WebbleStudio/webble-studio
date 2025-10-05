import { useEffect } from 'react';

/**
 * Fix per Chrome mobile: forza reflow degli elementi fixed quando la toolbar cambia
 * Chrome non ricalcola automaticamente le posizioni fixed quando la toolbar sparisce
 */
export function useFixedElementFix() {
  useEffect(() => {
    // Solo su mobile
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;

    let lastHeight = window.visualViewport?.height || window.innerHeight;
    let transitionTimer: number | null = null;
    let isTransitioning = false;

    const forceRepaint = () => {
      // Evita di triggerare durante una transizione in corso
      if (isTransitioning) return;
      
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      
      // Se l'altezza è cambiata significativamente (toolbar mostrata/nascosta)
      if (Math.abs(currentHeight - lastHeight) > 15) {
        isTransitioning = true;
        
        // Clear previous timer se esiste
        if (transitionTimer) {
          clearTimeout(transitionTimer);
        }
        
        // Aspetta che la transizione finisca, POI forza un repaint leggero
        transitionTimer = window.setTimeout(() => {
          // METODO OTTIMIZZATO: Solo gli elementi fixed, senza nascondere body
          requestAnimationFrame(() => {
            const fixedElements = document.querySelectorAll('[style*="position: fixed"], .fixed, [class*="fixed"]');
            
            fixedElements.forEach((el) => {
              if (el instanceof HTMLElement) {
                // Micro-nudge per forzare repaint senza bloccare
                const currentTransform = el.style.transform;
                el.style.transform = 'translate3d(0, 0.01px, 0)';
                el.offsetHeight; // Force reflow
                el.style.transform = currentTransform || 'translate3d(0, 0, 0)';
              }
            });
            
            // Trigger resize leggero
            window.dispatchEvent(new Event('resize'));
            
            isTransitioning = false;
          });
          
        }, 400); // Aspetta che la transizione sia completa
        
        lastHeight = currentHeight;
      }
    };

    // Listener SOLO su resize (non scroll per non bloccare)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', forceRepaint);
    }

    // Fallback su window resize
    window.addEventListener('resize', forceRepaint, { passive: true });

    return () => {
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', forceRepaint);
      }
      window.removeEventListener('resize', forceRepaint);
    };
  }, []);
}

