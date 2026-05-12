"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Dictionary, ProcessStep } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface HowItWorksProps {
  dict: Dictionary["process"];
}

/**
 * Staircase scroll choreography for the steps grid.
 *
 *   start of range ───────────────► end of range
 *   ┌───────┐ ┌───────┐ ┌───────┐
 *   │       │ │       │ │       │   y: 140  (initial / off-screen)
 *   │   3   │ │   3   │ │       │
 *   │       │ │       │ │       │
 *   ├───────┤ │       │ │       │
 *   │   2   │ ├───────┤ │       │
 *   │       │ │   2   │ ├───────┤
 *   ├───────┤ │       │ │   2   │
 *   │   1   │ ├───────┤ ├───────┤
 *   └───────┘ │   1   │ │   1   │
 *             └───────┘ └───────┘   y: 0    (final / settled)
 *
 * Each card has its own slice of the parent's scroll progress, with
 * deliberate overlap so you always see *some* cards mid-flight while
 * others have already landed — that's the "staircase" the user asked for.
 * The motion is bidirectional: scrolling back up reverses the motion
 * values automatically because they are bound to scroll position.
 */

/** y offset (px) — how far below the final resting line each card starts. */
const RISE_DISTANCE = 230;

/** Each card has its own slice of the parent's scroll progress. Starts are
 *  staggered so the initial silhouette has the staircase the user likes,
 *  but every range ends at the SAME point — combined with the eased curve
 *  this means the cards progressively converge toward the alignment line
 *  instead of locking into place one-by-one as each range completes. */
const STEP_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0.0, 0.85],
  [0.15, 0.85],
  [0.3, 0.85],
];

interface StepCardProps {
  step: ProcessStep;
  index: number;
  progress: MotionValue<number>;
  inputRange: readonly [number, number];
}

function StepCard({ step, index, progress, inputRange }: StepCardProps) {
  // useTransform clamps by default — outside the range the card sits at
  // the boundary value (RISE_DISTANCE before, 0 after). The card is
  // always fully opaque; it just sits below its final line until its
  // slice of the scroll progress catches up with it.
  const y = useTransform(
    progress,
    inputRange as [number, number],
    [RISE_DISTANCE, 0],
  );

  return (
    <motion.article
      style={{ y }}
      className="flex flex-col gap-5 will-change-transform"
    >
      <div className="relative aspect-square w-full overflow-hidden border border-white/10 bg-black/40">
        <Image
          src={step.image}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-fig-h4 text-white">
          {index + 1}. {step.title}
        </h3>
        <p className="text-fig-body text-silver">{step.description}</p>
      </div>
    </motion.article>
  );
}

export default function HowItWorks({ dict }: HowItWorksProps) {
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    // Wider window than before — the user wanted the staircase to play
    // out over more scroll distance:
    //   start: grid top hits viewport bottom (cards still well below the
    //          aligned line, staircase clearly visible)
    //   end:   grid bottom hits viewport center (cards fully settled,
    //          matching the aligned state in the second screenshot)
    offset: ["start end", "end center"],
  });

  return (
    <section
      aria-label="How it works"
      className="mx-auto w-full max-w-[1140px] px-6 md:px-8 2xl:max-w-[1340px]"
    >
      <RevealGroup
        staggerDelay={0.1}
        className="mx-auto flex max-w-[600px] flex-col items-center gap-4 text-center"
      >
        <RevealItem>
          <Eyebrow>{dict.eyebrow}</Eyebrow>
        </RevealItem>
        <RevealItem>
          <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
        </RevealItem>
        <RevealItem>
          <p className="text-fig-body text-silver">{dict.body}</p>
        </RevealItem>
      </RevealGroup>

      <div
        ref={stepsRef}
        className="relative mt-12 grid gap-6 md:mt-16 md:grid-cols-3 2xl:mt-20"
      >
        {dict.steps.map((step, i) => (
          <StepCard
            key={step.step}
            step={step}
            index={i}
            progress={scrollYProgress}
            inputRange={STEP_RANGES[Math.min(i, STEP_RANGES.length - 1)]}
          />
        ))}
      </div>
    </section>
  );
}
