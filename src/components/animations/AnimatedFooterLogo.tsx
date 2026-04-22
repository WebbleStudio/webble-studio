"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven version of the header logo animation.
 *
 * Visual behavior is identical to AnimatedLogo (no-eyes base layer + eyes
 * layer that translates), but the control signal is the page scroll position
 * instead of a hover state:
 *
 *   progress 0 → eyes at translate(0, 0)
 *   progress 1 → eyes at translate(-8px, 8px)   (same offset as header hover)
 *
 * Progress is a linear mapping from the logo's vertical position in the
 * viewport:
 *   - 0 when the logo's top edge is at the bottom of the viewport (just about
 *     to enter).
 *   - 1 when the logo has travelled ~60% of the viewport height upward.
 *
 * This makes the eyes progressively shift as the user scrolls the footer
 * into view, reading as the logo "looking down" while the user looks down.
 *
 * Implementation notes:
 *   - Transform updates are written directly to the DOM via ref inside a
 *     rAF-throttled scroll handler. No React state is involved in the hot
 *     path, so there are no re-renders while the user scrolls.
 *   - The logo is rendered as a stack of two absolutely-positioned SVGs;
 *     `brightness(0)` turns the white source assets into black on the
 *     orange footer cell without needing a dedicated dark variant.
 */
export default function AnimatedFooterLogo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const eyes = eyesRef.current;
    if (!wrapper || !eyes) return;

    // Anchor the scroll progress on the whole <footer>, not on the logo itself.
    // This way the trigger point is the top of the footer (i.e. the "INIZIA
    // UN PROGETTO" title) crossing the viewport center, independently of how
    // far the logo sits below the title.
    const anchor = wrapper.closest("footer") ?? wrapper;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const rect = anchor.getBoundingClientRect();
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      // progress 0 when anchor.top is at viewport center.
      // progress 1 after anchor.top has travelled another 20% of viewport up.
      const startOffset = viewportH * 0.5;
      const travel = viewportH * 0.2;
      const raw = (viewportH - startOffset - rect.top) / travel;
      const progress = Math.max(0, Math.min(1, raw));
      // Eyes travel from (0, 0) at progress 0
      // to (-13, +13) at progress 1.
      const x = 0 + (-13 - 0) * progress;
      const y = 0 + (13 - 0) * progress;
      eyes.style.transform = `translate(${x}px, ${y}px)`;
    };

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      <img
        src="/img/layout/logo/webble-white-logo-no-eyes.svg"
        alt="Webble Studio"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ filter: "brightness(0)" }}
      />
      <img
        ref={eyesRef}
        src="/img/layout/logo/webble-white-logo-eyes.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ filter: "brightness(0)", willChange: "transform" }}
      />
    </div>
  );
}
