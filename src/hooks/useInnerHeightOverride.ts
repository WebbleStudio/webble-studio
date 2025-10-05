import { useEffect } from 'react';

/**
 * HACK: Override window.innerHeight per forzarlo a essere sempre uguale a visualViewport.height
 * Questo risolve il bug di Chrome dove innerHeight diventa 773px invece di 695px quando la toolbar sparisce
 */
export function useInnerHeightOverride() {
  useEffect(() => {
    // Solo su mobile
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;

    // Solo se visualViewport è disponibile
    if (!window.visualViewport) return;

    // Salva il getter originale di innerHeight
    const originalInnerHeight = Object.getOwnPropertyDescriptor(
      Window.prototype,
      'innerHeight'
    );

    try {
      // Override window.innerHeight per restituire SEMPRE visualViewport.height
      Object.defineProperty(window, 'innerHeight', {
        get() {
          // Usa visualViewport.height invece del valore nativo (bugato)
          const correctHeight = window.visualViewport?.height || (originalInnerHeight?.get?.call(window) ?? 0);
          return correctHeight;
        },
        configurable: true,
        enumerable: true,
      });

      // Trigger resize event per forzare tutti i listener a usare il nuovo valore
      window.dispatchEvent(new Event('resize'));

      // Cleanup: ripristina il getter originale quando il componente viene smontato
      return () => {
        if (originalInnerHeight) {
          Object.defineProperty(window, 'innerHeight', originalInnerHeight);
        }
      };
    } catch (error) {
      // Silently fail - non bloccare l'app se l'override non funziona
      return undefined;
    }
  }, []);
}

