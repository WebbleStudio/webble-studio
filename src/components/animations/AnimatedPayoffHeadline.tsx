"use client";

import { Fragment, useEffect, useRef, useState } from "react";

interface AnimatedPayoffHeadlineProps {
  lines: string[];
  className?: string;
}

/**
 * Animates the Payoff H1 with a per-character mask slide-up.
 * Each character slides up from behind an overflow:hidden mask with a
 * staggered delay, triggered once when the element enters the viewport.
 *
 * Characters are grouped into word-level inline-block spans so that when
 * a line wraps, the wrap happens at word boundaries instead of splitting
 * a word across lines.
 *
 * SEO: text content is server-rendered, only the visual transition is
 * client-side — Google crawls the full text regardless.
 */
export default function AnimatedPayoffHeadline({
  lines,
  className,
}: AnimatedPayoffHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let charIndex = 0;

  return (
    <h1 ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} className="block overflow-hidden">
            {words.map((word, wi) => {
              const wordSpan = (
                <span className="inline-block">
                  {word.split("").map((char, ci) => {
                    const delay = charIndex * 18;
                    charIndex++;
                    return (
                      <span
                        key={ci}
                        className="inline-block"
                        style={{
                          transform: triggered ? "translateY(0)" : "translateY(115%)",
                          transition: triggered
                            ? `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
                            : "none",
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              );

              if (wi < words.length - 1) {
                charIndex++;
                return (
                  <Fragment key={wi}>
                    {wordSpan}{" "}
                  </Fragment>
                );
              }
              return <Fragment key={wi}>{wordSpan}</Fragment>;
            })}
          </span>
        );
      })}
    </h1>
  );
}
