"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface HomeFaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

/**
 * Rounded "pill" FAQ row used in the home FAQs section.
 * Matches the Figma: 8px rounded card on Shark bg, +/− icon (Silver) that
 * morphs on open/close. Question = H5, answer = body.
 */
export default function HomeFaqItem({ question, answer, defaultOpen = false }: HomeFaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLParagraphElement>(null);
  const verticalBarRef = useRef<HTMLSpanElement>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const el = contentRef.current;
    const answer = answerRef.current;
    const bar = verticalBarRef.current;
    if (!el) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (bar) gsap.set(bar, { scaleY: defaultOpen ? 0 : 1 });
      return;
    }

    gsap.killTweensOf([el, answer, bar]);

    if (isOpen) {
      const prev = el.style.height;
      el.style.height = "auto";
      const targetHeight = el.offsetHeight;
      el.style.height = prev || "0px";

      if (answer) gsap.set(answer, { opacity: 0, y: 8 });

      const tl = gsap.timeline();
      tl.to(bar, { scaleY: 0, duration: 0.35, ease: "expo.out" }, 0);
      tl.to(
        el,
        {
          height: targetHeight,
          duration: 0.45,
          ease: "expo.out",
          onComplete: () => {
            el.style.height = "auto";
          },
        },
        0
      );
      tl.to(answer, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0.12);
    } else {
      el.style.height = `${el.offsetHeight}px`;

      const tl = gsap.timeline();
      tl.to(bar, { scaleY: 1, duration: 0.35, ease: "expo.inOut" }, 0);
      tl.to(answer, { opacity: 0, y: 6, duration: 0.16, ease: "power2.in" }, 0);
      tl.to(el, { height: 0, duration: 0.4, ease: "expo.inOut" }, 0.08);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-shark overflow-hidden rounded-[8px] border border-white/10">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left"
      >
        <span className="text-fig-h5 text-white">{question}</span>

        {/* +/− icon: horizontal bar always visible, vertical bar scales out when open */}
        <span className="text-silver relative flex h-6 w-6 shrink-0 items-center justify-center">
          <span aria-hidden="true" className="absolute inset-x-1 mx-auto block h-[2px] rounded-[3px] bg-current" />
          <span
            ref={verticalBarRef}
            aria-hidden="true"
            className="absolute inset-y-1 my-auto block h-4 w-[2px] origin-center rounded-[3px] bg-current"
            style={{ transform: defaultOpen ? "scaleY(0)" : "scaleY(1)" }}
          />
        </span>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: defaultOpen ? "auto" : 0 }}
      >
        <p ref={answerRef} className="text-fig-body text-silver px-4 pb-4">
          {answer}
        </p>
      </div>
    </div>
  );
}
