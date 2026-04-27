"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProblemStripe from "@/components/ui/homepage/ProblemStripe";

gsap.registerPlugin(ScrollTrigger);

const TWO_XL = 1536;

/**
 * Y-axis parallax: each stripe moves at a different vertical speed as the
 * section scrolls through the viewport (same principle as review cards in
 * AnimatedTestimonials). Active on all breakpoints.
 *
 * The four stripe wrappers are exposed via refs so gsap.set can write directly
 * to the DOM without triggering React re-renders on every scroll frame.
 */
const STRIPE_CONFIGS = [
  { alignment: "self-end",   yAmount:  -90 }, // l1 — fast
  { alignment: "self-start", yAmount:  -45 }, // l2 — medium
  { alignment: "self-end",   yAmount:  -70 }, // l3 — medium-fast
  { alignment: "self-start", yAmount:  -30 }, // l4 — slow
] as const;

interface AnimatedProblemsStripesProps {
  labels: string[];
  children: ReactNode;
}

export default function AnimatedProblemsStripes({
  labels,
  children,
}: AnimatedProblemsStripesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [l1, l2, l3, l4] = labels;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const multiplier = window.innerWidth >= TWO_XL ? 1.8 : 1;
          stripeRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, { y: self.progress * STRIPE_CONFIGS[i].yAmount * multiplier });
          });
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col items-center justify-center gap-10 md:gap-14 xl:gap-20 2xl:gap-28"
    >
      {/* Stripes above headline */}
      <div className="flex w-full max-w-[560px] flex-col gap-4 xl:max-w-[760px] xl:gap-7 2xl:max-w-[980px] 2xl:gap-9">
        <div
          ref={(el) => { stripeRefs.current[0] = el; }}
          className="w-fit self-end will-change-transform"
        >
          <ProblemStripe label={l1} />
        </div>
        <div
          ref={(el) => { stripeRefs.current[1] = el; }}
          className="w-fit self-start will-change-transform"
        >
          <ProblemStripe label={l2} />
        </div>
      </div>

      {children}

      {/* Stripes below headline */}
      <div className="flex w-full max-w-[560px] flex-col gap-4 xl:max-w-[760px] xl:gap-7 2xl:max-w-[980px] 2xl:gap-9">
        <div
          ref={(el) => { stripeRefs.current[2] = el; }}
          className="w-fit self-end will-change-transform"
        >
          <ProblemStripe label={l3} />
        </div>
        <div
          ref={(el) => { stripeRefs.current[3] = el; }}
          className="w-fit self-start will-change-transform"
        >
          <ProblemStripe label={l4} />
        </div>
      </div>
    </div>
  );
}
