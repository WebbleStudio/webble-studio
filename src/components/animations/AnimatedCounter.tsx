"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  /** The numeric target value parsed from dict.count (e.g. 100). */
  target: number;
  /** Text rendered before the animated number (e.g. "+"). */
  prefix?: string;
  /** Text rendered after the animated number. */
  suffix?: string;
  className?: string;
}

const START = 12;
const COUNT_DURATION = 3.5; // seconds — slow, premium feel
const POP_DURATION = 0.6;

/**
 * Counter with two decoupled animations:
 *
 *   1. Number tween: 12 → target with a smooth `expo.out` ease (no overshoot,
 *      no rounding-induced flicker). Drives a JS object and writes the
 *      formatted text to the DOM via ref.
 *
 *   2. Pop on land: a small scale bounce (1 → 1.06 → 1) with `back.out(3)` on
 *      the whole element, fired exactly when the number lands on the target.
 *      This keeps the "bouncy luxury" feel that elastic.out gave us without
 *      letting the number itself overshoot/rebound.
 *
 * Both fire once via ScrollTrigger when the element enters the viewport.
 */
export default function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const format = (n: number) => `${prefix}${Math.round(n)}${suffix}`;

    el.textContent = format(START);

    const counter = { value: START };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(counter, {
        value: target,
        duration: COUNT_DURATION,
        ease: "expo.out",
        onUpdate: () => {
          el.textContent = format(counter.value);
        },
        onComplete: () => {
          el.textContent = format(target);
        },
      });

      tl.fromTo(
        el,
        { scale: 1 },
        { scale: 1.06, duration: POP_DURATION * 0.4, ease: "power2.out" },
        `>-${POP_DURATION * 0.4}`,
      );
      tl.to(el, {
        scale: 1,
        duration: POP_DURATION * 0.6,
        ease: "back.out(3)",
      });
    });

    return () => ctx.revert();
  }, [target, prefix, suffix]);

  return (
    /*
     * Outer wrapper always has the final value rendered invisibly — this
     * reserves the exact final width from the very first paint, preventing
     * any layout shift as digit count grows (e.g. 12 → 100).
     * The animated span is absolute-positioned on top of it.
     */
    <span
      className={className}
      style={{ display: "inline-block", position: "relative" }}
    >
      {/* Screen-reader value (always the real final number) */}
      <span className="sr-only">{prefix}{target}{suffix}</span>

      {/* Invisible size anchor — keeps the final width reserved from paint 0 */}
      <span aria-hidden="true" style={{ visibility: "hidden", whiteSpace: "nowrap" }}>
        {prefix}{target}{suffix}
      </span>

      {/* Animated value — overlaid on top, hidden from a11y tree */}
      <span
        ref={spanRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, textAlign: "center" }}
      >
        {prefix}{START}{suffix}
      </span>
    </span>
  );
}
