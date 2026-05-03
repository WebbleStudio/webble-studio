"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface AnimatedLogoProps {
  locale: string;
  siteName: string;
}

type LogoState = "idle" | "hovered" | "leaving";

/**
 * Animated logo for desktop (md+).
 *
 * Hover enter:
 *   - default logo disappears instantly
 *   - no-eyes + eyes appear instantly
 *   - after 200ms: eyes slide to translate(-5px, 5px) with ease
 *
 * Hover leave:
 *   - eyes animate back to translate(0, 0) with ease (300ms)
 *   - after animation: default logo reappears, split layers hide
 */
export default function AnimatedLogo({ locale, siteName }: AnimatedLogoProps) {
  const [state, setState] = useState<LogoState>("idle");
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setState("hovered");
  }

  function handleMouseLeave() {
    setState("leaving");
    leaveTimer.current = setTimeout(() => setState("idle"), 350);
  }

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const showSplit = state === "hovered" || state === "leaving";

  const eyesStyle: React.CSSProperties =
    state === "hovered"
      ? { transform: "translate(-8px, 8px)", transition: "transform 0.3s ease 0.2s" }
      : state === "leaving"
        ? { transform: "translate(0px, 0px)", transition: "transform 0.3s ease" }
        : { transform: "translate(0px, 0px)", transition: "none" };

  return (
    <a
      href={`/${locale}`}
      className="relative block h-[47px] w-[65px] md:h-[40px] md:w-[55px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Default logo — visible when idle */}
      <Image
        src="/img/layout/logo/webble-white-logo.svg"
        alt={siteName}
        width={65}
        height={47}
        priority
        className={`absolute inset-0 h-full w-full transition-none ${
          showSplit ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* No-eyes layer */}
      <Image
        src="/img/layout/logo/webble-white-logo-no-eyes.svg"
        alt=""
        width={65}
        height={47}
        className={`absolute inset-0 h-full w-full transition-none ${
          showSplit ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Eyes layer — animated translate */}
      <Image
        src="/img/layout/logo/webble-white-logo-eyes.svg"
        alt=""
        width={65}
        height={47}
        className={`absolute inset-0 h-full w-full ${showSplit ? "opacity-100" : "opacity-0"}`}
        style={eyesStyle}
      />
    </a>
  );
}
