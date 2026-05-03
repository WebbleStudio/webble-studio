"use client";

import { useState, useEffect } from "react";

interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
}

/**
 * Tracks window scroll position and returns a boolean flag
 * when the user has scrolled past a given threshold.
 */
export function useScroll(threshold = 10): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    isScrolled: false,
  });

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setScrollState({ scrollY: y, isScrolled: y > threshold });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrollState;
}
