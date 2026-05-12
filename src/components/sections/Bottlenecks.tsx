"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/lib/getDictionary";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BottlenecksProps {
  dict: Dictionary["bottlenecks"];
}

/**
 * Per-pill glitch keyframes. Each row is one discrete frame
 * `{ x, y, skewX, opacity }`. Rapid jumps between frames produce the
 * "teleporting / corrupted" vibe — random feel but deterministic so SSR and
 * client always render the same.
 */
const GLITCH_FRAMES = [
  { x: -12, y: 6, skewX: -3, opacity: 0.85 },
  { x: 9, y: -4, skewX: 2.5, opacity: 0.25 },
  { x: -5, y: 7, skewX: -1.5, opacity: 1 },
  { x: 7, y: -6, skewX: 3, opacity: 0.4 },
  { x: -3, y: 3, skewX: -2.5, opacity: 0.95 },
  { x: 5, y: -2, skewX: 1.5, opacity: 0.55 },
  { x: -2, y: 2, skewX: -1, opacity: 1 },
  { x: 3, y: -1, skewX: 0.8, opacity: 0.7 },
  { x: -1, y: 1, skewX: -0.4, opacity: 1 },
  { x: 0, y: 0, skewX: 0, opacity: 1 },
] as const;

/**
 * Layout — large centered headline pinned in the middle of a tall section,
 * with small "warning pill" tags scattered around it (NW, NE, SW, SE, …).
 * As the user scrolls through the pinned section the pills fade / pop in one
 * by one, giving the impression that the bottlenecks emerge around the title
 * with a subtle drift + opacity ramp.
 */

interface PillPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** When true the wrapper is vertically centered with translateY(-50%). */
  centerY?: boolean;
}

const PILL_POSITIONS: PillPosition[] = [
  // top-left
  { top: "22%", left: "4%" },
  // top-right
  { top: "26%", right: "4%" },
  // bottom-left
  { bottom: "26%", left: "6%" },
  // bottom-right
  { bottom: "22%", right: "6%" },
];

export default function Bottlenecks({ dict }: BottlenecksProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pillsContainer = pillsRef.current;
    const heading = headingRef.current;
    if (!section || !pillsContainer || !heading) return;

    const ctx = gsap.context(() => {
      const pills = pillsContainer.querySelectorAll<HTMLElement>("[data-bottleneck-pill]");
      if (pills.length === 0) return;

      gsap.set(pills, { opacity: 0, x: 0, y: 0, skewX: 0 });
      gsap.set(heading, { opacity: 0, y: 30 });

      // Heading fade-in: scroll-triggered but NOT scrubbed, so once it starts
      // it plays through to completion independently of the scroll position.
      // Fires when the section reaches the top of the viewport (same moment
      // the pin engages), so the user actually sees it animate in.
      gsap.to(heading, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          once: true,
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${(pills.length + 1) * 380}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Reserve the first ~1s of the scrubbed timeline as empty space so the
      // pills start firing at the same scroll position as before (when the
      // heading fade-in lived inside this timeline).
      tl.to({}, { duration: 1 });

      pills.forEach((pill) => {
        // Per-pill stagger — small gap between pills so they fire one after
        // the other rather than all at once.
        const startAt = `>+0.08`;
        GLITCH_FRAMES.forEach((frame, idx) => {
          tl.set(pill, frame, idx === 0 ? startAt : `>+0.035`);
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // React-owned wrapper around the pinned <section>. ScrollTrigger inserts
  // a `.pin-spacer` between this <div> and the <section> when pinning; the
  // wrapper keeps React's view of the DOM consistent so unmounts don't blow
  // up with `removeChild ... not a child of this node` on HMR / route
  // changes (React 19 + GSAP pin interaction).
  return (
    <div className="relative">
    <section
      ref={sectionRef}
      aria-label="Bottlenecks"
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="relative mx-auto flex h-full w-full max-w-[1140px] items-center justify-center px-6 md:px-8 2xl:max-w-[1340px]">
        {/* Scattered warning pills */}
        <div
          ref={pillsRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {dict.items.map((item, i) => {
            const pos = PILL_POSITIONS[i % PILL_POSITIONS.length];
            const wrapperStyle: React.CSSProperties = {};
            if (pos.top) wrapperStyle.top = pos.top;
            if (pos.bottom) wrapperStyle.bottom = pos.bottom;
            if (pos.left) wrapperStyle.left = pos.left;
            if (pos.right) wrapperStyle.right = pos.right;
            if (pos.centerY) wrapperStyle.transform = "translateY(-50%)";

            return (
              <div
                key={item.title}
                style={wrapperStyle}
                className="absolute"
              >
                <div
                  data-bottleneck-pill
                  className="bg-background inline-flex w-[240px] origin-center items-start gap-3 border border-white/10 px-5 py-4 sm:w-[300px] md:w-[340px]"
                >
                  <span
                    aria-hidden="true"
                    className="text-fire mt-[2px] inline-flex h-4 w-4 shrink-0 items-center justify-center"
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full">
                      <path
                        d="M8 1.5L15 14H1L8 1.5Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 6.5V9.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <circle cx="8" cy="11.5" r="0.7" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="text-fig-body text-white leading-tight">
                    {item.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered heading + body */}
        <div
          ref={headingRef}
          className="relative z-10 flex max-w-[760px] flex-col items-center gap-5 text-center"
        >
          <h2 className="text-fig-h1 max-w-[520px] text-white">
            {dict.headline}
          </h2>
          <p className="text-fig-body text-silver max-w-[480px]">
            {dict.body}
          </p>
        </div>
      </div>
    </section>
    </div>
  );
}
