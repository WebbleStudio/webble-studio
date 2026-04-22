"use client";

import type { ReactNode } from "react";
import { useScroll } from "@/hooks/useScroll";

interface AnimatedHeaderProps {
  children: ReactNode;
}

/**
 * Client-only wrapper for the header.
 * Applies backdrop blur and a subtle background when the user scrolls.
 * All SEO-critical content lives in the server-rendered children.
 */
export default function AnimatedHeader({ children }: AnimatedHeaderProps) {
  const { isScrolled } = useScroll(10);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/60 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      {children}
    </header>
  );
}
