'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface SectionScrollOptions {
  /** Selettore per le sezioni (default: tutte le sezioni con .section-scroll) */
  sectionSelector?: string;
  /** Durata dell'animazione tra sezioni in millisecondi */
  duration?: number;
  /** Easing function per l'animazione */
  easing?: (t: number) => number;
  /** Soglia minima di scroll per attivare il cambio sezione */
  threshold?: number;
  /** Ritardo minimo tra scroll consecutivi */
  scrollDelay?: number;
}

export const useSectionScroll = (options: SectionScrollOptions = {}) => {
  const {
    sectionSelector = '.section-scroll',
    duration = 1200,
    easing = (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    threshold = 10, // Pixel minimi per attivare scroll
    scrollDelay = 800, // ms di ritardo tra scroll
  } = options;

  const isScrollingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const sectionsRef = useRef<Element[]>([]);
  const lastScrollTimeRef = useRef(0);
  const [currentSection, setCurrentSection] = useState(0);

  // Trova e memorizza tutte le sezioni
  const updateSections = useCallback(() => {
    const sections = Array.from(document.querySelectorAll(sectionSelector));
    sectionsRef.current = sections;

    // Determina sezione corrente in base alla posizione scroll
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    let closestSection = 0;
    let minDistance = Infinity;

    sections.forEach((section, index) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const distance = Math.abs(scrollTop - sectionTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestSection = index;
      }
    });

    currentSectionRef.current = closestSection;
    setCurrentSection(closestSection);

    console.log(
      `📍 [SectionScroll] Trovate ${sections.length} sezioni, sezione corrente: ${closestSection}`
    );
  }, [sectionSelector]);

  // Aggiorna sezioni quando il DOM cambia
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(updateSections, 100);
    return () => clearTimeout(timer);
  }, [updateSections]);

  // Naviga a una sezione specifica
  const goToSection = useCallback(
    (sectionIndex: number, force = false) => {
      if (!force && isScrollingRef.current) return;

      const sections = sectionsRef.current;
      if (sectionIndex < 0 || sectionIndex >= sections.length) return;

      const targetSection = sections[sectionIndex] as HTMLElement;
      if (!targetSection) return;

      isScrollingRef.current = true;
      currentSectionRef.current = sectionIndex;
      setCurrentSection(sectionIndex);

      console.log(`🎯 [SectionScroll] Navigating to section ${sectionIndex}`);

      // Scroll fluido alla sezione usando scroll nativo
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth',
      });

      // Reset dello stato di scrolling dopo l'animazione
      setTimeout(() => {
        isScrollingRef.current = false;
        console.log(`✅ [SectionScroll] Arrived at section ${sectionIndex}`);
      }, duration);
    },
    [duration]
  );

  // Naviga alla sezione successiva
  const goToNextSection = useCallback(() => {
    const nextIndex = Math.min(currentSectionRef.current + 1, sectionsRef.current.length - 1);
    if (nextIndex !== currentSectionRef.current) {
      goToSection(nextIndex);
    }
  }, [goToSection]);

  // Naviga alla sezione precedente
  const goToPreviousSection = useCallback(() => {
    const prevIndex = Math.max(currentSectionRef.current - 1, 0);
    if (prevIndex !== currentSectionRef.current) {
      goToSection(prevIndex);
    }
  }, [goToSection]);

  // Gestisce eventi di scroll (wheel, touch)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWheel = (event: WheelEvent) => {
      // Previeni scroll durante animazione
      if (isScrollingRef.current) {
        event.preventDefault();
        return;
      }

      // Throttling: previeni scroll troppo frequenti
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) {
        event.preventDefault();
        return;
      }

      // Verifica soglia minima
      if (Math.abs(event.deltaY) < threshold) return;

      event.preventDefault();
      lastScrollTimeRef.current = now;

      // Determina direzione e naviga
      if (event.deltaY > 0) {
        // Scroll verso il basso
        goToNextSection();
      } else {
        // Scroll verso l'alto
        goToPreviousSection();
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (isScrollingRef.current) return;

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Spacebar
          event.preventDefault();
          goToNextSection();
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          goToPreviousSection();
          break;
        case 'Home':
          event.preventDefault();
          goToSection(0);
          break;
        case 'End':
          event.preventDefault();
          goToSection(sectionsRef.current.length - 1);
          break;
      }
    };

    // Touch handling per mobile
    let touchStartY = 0;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (isScrollingRef.current) {
        event.preventDefault();
        return;
      }

      const touchEndY = event.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) < threshold) return;

      event.preventDefault();

      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) return;
      lastScrollTimeRef.current = now;

      if (deltaY > 0) {
        goToNextSection();
      } else {
        goToPreviousSection();
      }
    };

    // Aggiungi listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNextSection, goToPreviousSection, goToSection, threshold, scrollDelay]);

  // Gestisce resize window
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      // Ricalcola posizioni dopo resize
      setTimeout(updateSections, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateSections]);

  return {
    currentSection,
    totalSections: sectionsRef.current.length,
    isScrolling: isScrollingRef.current,
    goToSection,
    goToNextSection,
    goToPreviousSection,
    updateSections,
  };
};
