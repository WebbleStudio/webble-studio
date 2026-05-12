"use client";

import { type ReactNode } from "react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface AnimatedCopyStackProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}

/**
 * Wraps children and stagger-reveals them on scroll.
 * Children must be direct elements (not fragments).
 * Uses existing framer-motion RevealGroup/RevealItem primitives.
 */
export default function AnimatedCopyStack({
  children,
  stagger = 0.1,
  delay = 0,
  className,
}: AnimatedCopyStackProps) {
  return (
    <RevealGroup staggerDelay={stagger} initialDelay={delay} className={className ?? "contents"}>
      {children}
    </RevealGroup>
  );
}
