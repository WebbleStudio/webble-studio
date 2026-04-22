"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { ProcessStep } from "@/lib/getDictionary";

const MD = 768;
const DESKTOP_H = 420;
const MOBILE_H = 516;
const GROW_ACTIVE = 3;
const GROW_CLOSED = 1;

interface AnimatedProcessProps {
  steps: ProcessStep[];
}

export default function AnimatedProcess({ steps }: AnimatedProcessProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveIndex = useRef(0);

  // ─── Detect mobile/desktop ────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MD);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ─── Snap layout when breakpoint changes ─────────────────────────────────
  // Uses activeIndex via closure (intentionally excluded from deps).
  // Does NOT touch prevActiveIndex so the next click animates correctly.
  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.killTweensOf(card);
      gsap.set(card, { flexGrow: i === activeIndex ? GROW_ACTIVE : GROW_CLOSED });
    });
    contentRefs.current.forEach((content, i) => {
      if (!content) return;
      gsap.killTweensOf(content);
      gsap.set(content, { opacity: i === activeIndex ? 1 : 0 });
    });
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Unmount cleanup ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      [...cardRefs.current, ...contentRefs.current].forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  // ─── Animate on activeIndex change ────────────────────────────────────────
  // Guard `prev === next` handles the mount case (both start at 0)
  // without needing a separate isFirstRun flag — which was the bug:
  // isMobile's effect was resetting isFirstRun to true after the
  // activeIndex effect had already cleared it, so the first real click
  // was silently swallowed.
  useEffect(() => {
    const prev = prevActiveIndex.current;
    const next = activeIndex;

    if (prev === next) return;

    prevActiveIndex.current = next;

    cardRefs.current.forEach((card) => {
      if (card) gsap.killTweensOf(card);
    });
    contentRefs.current.forEach((content) => {
      if (content) gsap.killTweensOf(content);
    });

    const prevContent = contentRefs.current[prev];
    const nextContent = contentRefs.current[next];

    const MORPH_DUR = 0.7;
    const FADE_OUT = 0.2;
    const FADE_IN = 0.3;

    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    tl.to(prevContent, { opacity: 0, duration: FADE_OUT, ease: "power2.in" }, 0);

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      tl.to(
        card,
        {
          flexGrow: i === next ? GROW_ACTIVE : GROW_CLOSED,
          duration: MORPH_DUR,
          ease: "expo.inOut",
        },
        0
      );
    });

    tl.to(
      nextContent,
      { opacity: 1, duration: FADE_IN, ease: "power2.out" },
      MORPH_DUR - FADE_IN + 0.05
    );
  }, [activeIndex]);

  return (
    <div
      className="flex w-full gap-3"
      style={{
        flexDirection: isMobile ? "column" : "row",
        height: isMobile ? MOBILE_H : DESKTOP_H,
      }}
    >
      {steps.map((step, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onClick={() => setActiveIndex(i)}
          className="relative flex cursor-pointer flex-col overflow-hidden bg-[#121212] px-6"
          style={{
            flexGrow: i === 0 ? GROW_ACTIVE : GROW_CLOSED,
            flexShrink: 1,
            flexBasis: 0,
            minWidth: isMobile ? undefined : 70,
          }}
        >
          <div className="flex h-20 flex-none items-center">
            <div className="border-foreground/10 flex aspect-square h-8 w-8 items-center justify-center border p-1.5">
              <img
                src="/img/layout/logo/webble-white-logo.svg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div
            ref={(el) => {
              contentRefs.current[i] = el;
            }}
            className="flex flex-col gap-3 overflow-hidden pb-6"
            style={{
              opacity: i === 0 ? 1 : 0,
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: 0,
              minHeight: 0,
            }}
          >
            <h3 className="font-sans text-[22px] leading-tight font-bold">
              {step.title}
            </h3>
            <p className="max-w-[340px]">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
