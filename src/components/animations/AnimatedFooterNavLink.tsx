"use client";

import { useRef } from "react";

interface AnimatedFooterNavLinkProps {
  href: string;
  label: string;
}

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const ENTER_MS = 600;
const EXIT_MS = 450;

/**
 * Liquid hover: an accent-colored layer expands as a circle from the exact
 * point where the cursor enters, fills the link, then contracts back toward
 * the exit point on mouseleave.
 *
 * Implementation:
 *   - The fill `<span>` sits absolutely behind the content, with a `clip-path:
 *     circle()` whose center is the cursor position (in %) and whose radius
 *     transitions from 0% to ~150% (large enough to cover the rect's diagonal).
 *   - We toggle `transition` to 0ms when we want to instantly seed the start
 *     position before animating, avoiding the "fly-in" from the previous
 *     center.
 *   - Touch devices never fire `mouseenter`, so the effect is naturally
 *     hover-only and disappears on mobile.
 */
export default function AnimatedFooterNavLink({
  href,
  label,
}: AnimatedFooterNavLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const setClip = (xPct: number, yPct: number, radius: number, ms: number) => {
    const el = fillRef.current;
    if (!el) return;
    el.style.transition = `clip-path ${ms}ms ${EASE}`;
    el.style.clipPath = `circle(${radius}% at ${xPct}% ${yPct}%)`;
  };

  const cursorPct = (e: React.MouseEvent) => {
    const rect = linkRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const handleEnter = (e: React.MouseEvent) => {
    const { x, y } = cursorPct(e);
    const el = fillRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.clipPath = `circle(0% at ${x}% ${y}%)`;
    void el.offsetHeight; // force reflow so the seed value is committed
    setClip(x, y, 150, ENTER_MS);
  };

  const handleLeave = (e: React.MouseEvent) => {
    const { x, y } = cursorPct(e);
    setClip(x, y, 0, EXIT_MS);
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative flex items-center justify-between gap-4 overflow-hidden px-4 py-4 font-sans text-sm font-medium md:px-6"
    >
      {/* Liquid fill layer */}
      <span
        ref={fillRef}
        aria-hidden="true"
        className="bg-accent pointer-events-none absolute inset-0"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />

      {/* Content above the fill — flips to background color when fill takes over */}
      <span className="text-foreground relative z-10">
        {label}
      </span>
      <img
        src="/icons/diagonal-arrow.svg"
        alt=""
        aria-hidden="true"
        width={18}
        height={18}
        className="relative z-10 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
