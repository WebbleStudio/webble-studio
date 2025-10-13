'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function LenisScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
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

    // Non inizializzare Lenis su mobile o touch devices
    if (isTouchDevice() || isMobile()) {
      console.log('🚫 Lenis: Disabled on mobile/touch devices');
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

    // Gestione resize per disabilitare Lenis se si passa a mobile
    const handleResize = () => {
      if (isMobile() && lenisRef.current) {
        console.log('🚫 Lenis: Destroying on resize to mobile');
        lenisRef.current.destroy();
        lenisRef.current = null;
      } else if (!isMobile() && !lenisRef.current && !isTouchDevice()) {
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
  }, []);

  return null; // Questo componente non renderizza nulla
}

