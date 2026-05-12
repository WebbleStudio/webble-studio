"use client";

import { type ReactNode, Children } from "react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface AnimatedStaggerChildrenProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

/**
 * Wraps each direct child in a RevealItem for staggered fade-up on scroll.
 */
export default function AnimatedStaggerChildren({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: AnimatedStaggerChildrenProps) {
  return (
    <RevealGroup staggerDelay={stagger} initialDelay={delay} className={className}>
      {Children.map(children, (child, i) => (
        <RevealItem key={i}>{child}</RevealItem>
      ))}
    </RevealGroup>
  );
}
