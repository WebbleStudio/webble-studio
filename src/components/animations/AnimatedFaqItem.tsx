"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedFaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

/**
 * Animated FAQ accordion item.
 *
 * - Answer visibility is controlled by React state; height is tweened by GSAP
 *   so the opening/closing is silky smooth regardless of answer length.
 * - Initial render honours `defaultOpen` through an inline style, so there is
 *   no flash of the wrong state before the effect runs.
 * - On open we freeze the measured natural height in pixels, animate to it,
 *   then restore `height: auto` so responsive reflow still works.
 * - On close we first freeze the current auto height to pixels, then animate
 *   to 0 (you cannot tween from `auto` directly).
 */
export default function AnimatedFaqItem({
  question,
  answer,
  defaultOpen = false,
}: AnimatedFaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    gsap.killTweensOf(el);

    if (isOpen) {
      const prev = el.style.height;
      el.style.height = "auto";
      const targetHeight = el.offsetHeight;
      el.style.height = prev || "0px";

      gsap.to(el, {
        height: targetHeight,
        duration: 0.4,
        ease: "expo.out",
        onComplete: () => {
          el.style.height = "auto";
        },
      });
    } else {
      el.style.height = `${el.offsetHeight}px`;

      requestAnimationFrame(() => {
        gsap.to(el, {
          height: 0,
          duration: 0.35,
          ease: "expo.inOut",
        });
      });
    }
  }, [isOpen]);

  return (
    <div className="bg-[#121212]">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left"
      >
        <span className="text-foreground text-[14px] font-medium">{question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`text-accent shrink-0 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: defaultOpen ? "auto" : 0 }}
      >
        <p className="px-6 pb-6 text-[14px]">{answer}</p>
      </div>
    </div>
  );
}
