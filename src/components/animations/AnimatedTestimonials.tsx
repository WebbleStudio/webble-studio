"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReviewCard from "@/components/ui/homepage/ReviewCard";

gsap.registerPlugin(ScrollTrigger);

const MD = 768;
const TWO_XL = 1536;

interface CardConfig {
  top: string;
  left: string;
  parallaxAmount: number;
  className: string;
}

/** Desktop-only scattered layout + scroll parallax (see plan). */
const CARDS: CardConfig[] = [
  // Positioning strategy: each card's visual CENTER is anchored to a fixed
  // percentage of the container width, ensuring the whole composition stays
  // symmetrical around 50% at every viewport size.
  //
  //  left pair  → centers at 23 % and 27 %   (avg 25 %)
  //  right pair → centers at 73 % and 77 %   (avg 75 %)
  //  overall center of mass: (25 + 75) / 2 = 50 % ✓
  //
  // max(32px, …) / min(…, calc(100% - w - 32px)) enforce the 32 px edge guard.
  { top: "14%", left: "max(32px, calc(23% - 150px))",                        parallaxAmount: -200, className: "!max-w-[300px] md:p-6" },
  { top: "4%",  left: "min(calc(73% - 155px), calc(100% - 310px - 32px))",   parallaxAmount:  +50, className: "!max-w-[310px] md:p-6" },
  { top: "40%", left: "calc(50% - 160px)",                                    parallaxAmount:  -35, className: "!max-w-[320px] md:p-6" },
  { top: "70%", left: "max(32px, calc(27% - 150px))",                        parallaxAmount: -155, className: "!max-w-[300px] md:p-6" },
  { top: "60%", left: "min(calc(77% - 158px), calc(100% - 315px - 32px))",   parallaxAmount:  +40, className: "!max-w-[315px] md:p-6" },
];

interface Review {
  quote: string;
  authorName: string;
  authorRole: string;
  href?: string;
}

interface AnimatedTestimonialsProps {
  reviews: Review[];
}

export default function AnimatedTestimonials({ reviews }: AnimatedTestimonialsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ctx: gsap.Context | null = null;

    const mountParallax = () => {
      if (typeof window === "undefined" || window.innerWidth < MD) return;

      const parallaxEls = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (parallaxEls.length === 0) return;

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const multiplier = window.innerWidth >= TWO_XL ? 1.8 : 1;
            parallaxEls.forEach((el, i) => {
              const amount = (CARDS[i]?.parallaxAmount ?? 0) * multiplier;
              gsap.set(el, { y: self.progress * amount });
            });
          },
        });
      }, container);
    };

    const teardown = () => {
      ctx?.revert();
      ctx = null;
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        teardown();
        mountParallax();
        ScrollTrigger.refresh();
      }, 120);
    };

    mountParallax();

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      teardown();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {CARDS.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className={`absolute z-10 will-change-transform${i === 2 ? " hidden xl:block" : ""}`}
          style={{ top: cfg.top, left: cfg.left }}
        >
          <ReviewCard
            className={cfg.className}
            {...(reviews[i % reviews.length] ?? {})}
          />
        </div>
      ))}
    </div>
  );
}
