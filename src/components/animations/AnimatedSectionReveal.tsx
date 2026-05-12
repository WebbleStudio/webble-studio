"use client";

import { type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

interface AnimatedSectionRevealProps {
  children: ReactNode;
  className?: string;
  blur?: boolean;
}

/**
 * Fade-in reveal for block-level sections (images, large containers).
 * blur prop is accepted for API compatibility but ignored — framer-motion
 * handles the opacity/y transition consistently.
 */
export default function AnimatedSectionReveal({
  children,
  className,
}: AnimatedSectionRevealProps) {
  return (
    <Reveal className={className} y={16} duration={0.8}>
      {children}
    </Reveal>
  );
}
