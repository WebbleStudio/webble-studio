'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    // LENIS DISABILITATO TEMPORANEAMENTE PER TEST CURSORE
    return;
    
    // Non inizializzare Lenis se siamo in una pagina admin
    if (isAdminRoute) {
      return;
    }

    // Inizializza Lenis con configurazione ottimizzata per performance
    const lenis = new Lenis({
      duration: 0.8, // Aumentato per smoothness
      easing: (t) => t * (2 - t), // easeOutQuad - più performante
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Espone l'istanza di Lenis globalmente per accesso da altri componenti
    (window as any).lenis = lenis;

    // Funzione di animazione ottimizzata
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, [isAdminRoute]);

  return <>{children}</>;
}
