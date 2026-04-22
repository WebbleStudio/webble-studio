"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { ProcessStep } from "@/lib/getDictionary";

const MD = 768; // matches --breakpoint-md

interface AnimatedProcessProps {
  steps: ProcessStep[];
}

/**
 * Accordion responsive:
 *  - Desktop (≥768px): horizontal, cards expand via flexGrow
 *  - Mobile  (<768px): vertical column, cards expand via maxHeight
 *
 * Stability pattern: gsap.killTweensOf() before every new tween,
 * isFirstRun ref skips animation on mount (state already correct
 * via inline styles). isMobile changes reset initial state via gsap.set.
 */
export default function AnimatedProcess({ steps }: AnimatedProcessProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstRun = useRef(true);
  const prevActiveIndex = useRef(0);

  // Detect mobile/desktop
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MD);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Reset layout when breakpoint changes
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const contents = contentRefs.current.filter(Boolean) as HTMLDivElement[];

    cards.forEach((card, i) => {
      gsap.killTweensOf(card);
      if (isMobile) {
        gsap.set(card, {
          maxHeight: i === activeIndex ? 280 : 80,
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: "auto",
        });
      } else {
        gsap.set(card, {
          maxHeight: "none",
          flexGrow: i === activeIndex ? 4 : 1,
          flexShrink: 1,
          flexBasis: 0,
        });
      }
    });

    contents.forEach((content, i) => {
      gsap.killTweensOf(content);
      gsap.set(content, { opacity: i === activeIndex ? 1 : 0, y: 0 });
    });

    // Let the next activeIndex change animate normally
    isFirstRun.current = true;
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Unmount cleanup
  useEffect(() => {
    return () => {
      [...cardRefs.current, ...contentRefs.current].forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  // Animate on activeIndex change
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      prevActiveIndex.current = activeIndex;
      return;
    }

    const prev = prevActiveIndex.current;
    const next = activeIndex;

    cardRefs.current.forEach((card) => {
      if (card) gsap.killTweensOf(card);
    });
    contentRefs.current.forEach((content) => {
      if (content) gsap.killTweensOf(content);
    });

    const prevContent = contentRefs.current[prev];
    const nextContent = contentRefs.current[next];

    // Smooth simultaneous morph.
    //  - All cards morph together with a single matched curve, so the total
    //    stack height stays constant (no deflate/inflate jumps between phases).
    //  - expo.inOut gives a silky ease: long plateau at both ends, fast middle.
    //  - Content cross-fades with slight overlap so the transition feels fluid.
    const MORPH_DUR = 0.7;
    const FADE_OUT = 0.2;
    const FADE_IN = 0.3;

    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    if (prev !== next && prevContent) {
      tl.to(prevContent, { opacity: 0, duration: FADE_OUT, ease: "power2.in" }, 0);
    }

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      tl.to(
        card,
        isMobile
          ? { maxHeight: i === next ? 280 : 80, duration: MORPH_DUR, ease: "expo.inOut" }
          : { flexGrow: i === next ? 4 : 1, duration: MORPH_DUR, ease: "expo.inOut" },
        0
      );
    });

    if (nextContent) {
      tl.to(
        nextContent,
        { opacity: 1, duration: FADE_IN, ease: "power2.out" },
        MORPH_DUR - FADE_IN + 0.05
      );
    }

    prevActiveIndex.current = next;
  }, [activeIndex, isMobile]);

  return (
    <div
      className="flex w-full gap-3"
      style={isMobile ? { flexDirection: "column" } : { flexDirection: "row", height: 420 }}
    >
      {steps.map((step, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onClick={() => setActiveIndex(i)}
          className="relative flex cursor-pointer flex-col overflow-hidden bg-[#121212] p-6"
          style={
            isMobile
              ? { maxHeight: i === 0 ? 280 : 80, flexShrink: 0 }
              : { flexGrow: i === 0 ? 4 : 1, flexShrink: 1, flexBasis: 0, minWidth: 70 }
          }
        >
          {/* Step badge — perfect square, vertically centered when card is closed on mobile */}
          <div className="border-foreground/10 flex aspect-square h-8 w-8 items-center justify-center border p-1.5">
            <img
              src="/img/layout/logo/webble-white-logo.svg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Content — fades in on active */}
          <div
            ref={(el) => {
              contentRefs.current[i] = el;
            }}
            className="mt-4 flex flex-col gap-3 md:mt-6"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <h3 className="font-sans text-[22px] leading-tight font-bold">{step.title}</h3>
            <p className="max-w-[340px]">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
