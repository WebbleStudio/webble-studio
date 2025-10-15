'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface LenisScrollProps {
  disabled?: boolean;
}

export default function LenisScroll({ disabled = false }: LenisScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Se disabilitato esplicitamente, non inizializzare
    if (disabled) {
      console.log('🚫 Lenis: Disabled by prop');
      return;
    }

    // Rileva se è un dispositivo touch
    const isTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };

    // Rileva se è mobile (larghezza schermo)
    const isMobile = () => {
      return window.innerWidth < 768; // breakpoint MD di Tailwind
    };

    // Rileva se siamo in admin o portfolio
    const isAdminOrPortfolio = () => {
      const path = window.location.pathname;
      return path.startsWith('/admin') || path.startsWith('/portfolio');
    };

    // Non inizializzare Lenis su mobile, touch devices, admin o portfolio
    if (isTouchDevice() || isMobile() || isAdminOrPortfolio()) {
      console.log('🚫 Lenis: Disabled on mobile/touch/admin/portfolio');
      return;
    }

    console.log('✅ Lenis: Initializing smooth scroll');

    // Aggiungi classe lenis all'html per gli stili CSS
    document.documentElement.classList.add('lenis');

    // Inizializza Lenis con configurazione ottimizzata
    const lenis = new Lenis({
      duration: 1.2, // Durata dello smooth scroll (più alto = più lento)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function smooth
      orientation: 'vertical', // Direzione dello scroll
      gestureOrientation: 'vertical', // Direzione dei gesti
      smoothWheel: true, // Smooth scroll con la rotella del mouse
      wheelMultiplier: 1, // Moltiplicatore della velocità della rotella
      infinite: false, // Scroll infinito disabilitato
    });

    lenisRef.current = lenis;

    // Funzione RAF per aggiornare Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Gestione resize per disabilitare Lenis se si passa a mobile/admin/portfolio
    const handleResize = () => {
      if ((isMobile() || isAdminOrPortfolio()) && lenisRef.current) {
        console.log('🚫 Lenis: Destroying on resize to mobile/admin/portfolio');
        lenisRef.current.destroy();
        lenisRef.current = null;
      } else if (!isMobile() && !isAdminOrPortfolio() && !lenisRef.current && !isTouchDevice()) {
        console.log('✅ Lenis: Re-initializing on resize to desktop');
        // Re-inizializza Lenis se si torna a desktop
        window.location.reload(); // Reload per semplicità
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (lenisRef.current) {
        console.log('🧹 Lenis: Cleaning up');
        lenisRef.current.destroy();
        document.documentElement.classList.remove('lenis');
      }
    };
  }, [disabled]);

  return null; // Questo componente non renderizza nulla
}
