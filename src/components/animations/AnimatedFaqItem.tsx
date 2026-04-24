"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedFaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export default function AnimatedFaqItem({
  question,
  answer,
  defaultOpen = false,
}: AnimatedFaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLParagraphElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const el = contentRef.current;
    const answer = answerRef.current;
    const chevron = chevronRef.current;
    if (!el) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      // Set initial chevron state without animation
      if (chevron) gsap.set(chevron, { rotate: defaultOpen ? 90 : 0 });
      return;
    }

    gsap.killTweensOf([el, answer, chevron]);

    if (isOpen) {
      // Measure natural height
      const prev = el.style.height;
      el.style.height = "auto";
      const targetHeight = el.offsetHeight;
      el.style.height = prev || "0px";

      // Set answer to initial hidden state before animating in
      if (answer) gsap.set(answer, { opacity: 0, y: 12 });

      const tl = gsap.timeline();

      // 1. Chevron rotates simultaneously
      tl.to(chevron, { rotate: 90, duration: 0.45, ease: "expo.out" }, 0);

      // 2. Container height expands
      tl.to(
        el,
        {
          height: targetHeight,
          duration: 0.5,
          ease: "expo.out",
          onComplete: () => {
            el.style.height = "auto";
          },
        },
        0
      );

      // 3. Answer slides up and fades in slightly after height starts
      tl.to(
        answer,
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        0.12
      );
    } else {
      // Freeze height from auto to px before tweening to 0
      el.style.height = `${el.offsetHeight}px`;

      const tl = gsap.timeline();

      // 1. Chevron rotates back
      tl.to(chevron, { rotate: 0, duration: 0.4, ease: "expo.inOut" }, 0);

      // 2. Answer fades out and drifts down slightly
      tl.to(answer, { opacity: 0, y: 8, duration: 0.18, ease: "power2.in" }, 0);

      // 3. Height collapses slightly after answer begins fading
      tl.to(el, { height: 0, duration: 0.45, ease: "expo.inOut" }, 0.08);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-[#121212]">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-8 p-6 text-left"
      >
        <span className="text-foreground text-[14px] font-medium xs:text-[16px]">
          {question}
        </span>
        <svg
          ref={chevronRef}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="text-accent shrink-0"
          style={{ rotate: defaultOpen ? "90deg" : "0deg" }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: defaultOpen ? "auto" : 0 }}
      >
        <p ref={answerRef} className="px-6 pb-6 text-[14px]">
          {answer}
        </p>
      </div>
    </div>
  );
}
