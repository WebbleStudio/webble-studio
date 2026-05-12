"use client";

import { motion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveal — small framer-motion primitives that produce the "agency-style"
 * fade-and-rise reveals on scroll used across the home page sections.
 *
 *   <Reveal>            single block, fades in once it enters the viewport
 *   <RevealGroup>       parent that staggers its <RevealItem> children
 *   <RevealItem>        child of <RevealGroup>; one staggered fade-in unit
 *
 * All three accept `immediate` so the same primitives can be used for the
 * page-load hero (animate on mount) and for in-view triggered reveals
 * lower down the page.
 */

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];

interface RevealProps {
  children: ReactNode;
  /** Delay before the animation starts (s). */
  delay?: number;
  /** Duration of the fade-rise (s). */
  duration?: number;
  /** Initial vertical offset in px — element rises by this amount. */
  y?: number;
  /** Viewport intersection ratio that triggers the reveal. */
  amount?: number;
  /** Animate on mount instead of waiting for viewport intersection. */
  immediate?: boolean;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 24,
  amount = 0.25,
  immediate = false,
  className,
}: RevealProps) {
  const motionProps = immediate
    ? ({ initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 } } as const)
    : ({
        initial: { opacity: 0, y },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount },
      } as const);

  return (
    <motion.div
      {...motionProps}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  /** Time between successive children entering. */
  staggerDelay?: number;
  /** Delay before the first child starts. */
  initialDelay?: number;
  amount?: number;
  immediate?: boolean;
  className?: string;
}

export function RevealGroup({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  amount = 0.15,
  immediate = false,
  className,
}: RevealGroupProps) {
  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };
  const motionProps = immediate
    ? ({ initial: "hidden", animate: "visible" } as const)
    : ({
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount },
      } as const);

  return (
    <motion.div {...motionProps} variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

interface RevealItemProps {
  children: ReactNode;
  duration?: number;
  y?: number;
  className?: string;
}

export function RevealItem({
  children,
  duration = 0.6,
  y = 24,
  className,
}: RevealItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
