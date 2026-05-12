"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface CaseStudiesProps {
  dict: Dictionary["caseStudies"];
}

type CaseStudyItem = Dictionary["caseStudies"]["items"][number];

/**
 * "Our works" — wide horizontal cards (1240×800 design spec).
 *
 *   ┌──────────────┬───────────────────────────────────────┐
 *   │              │  YEAR · CATEGORY ─────────────────────│
 *   │              │  BRAND                                │
 *   │   image      │                                       │
 *   │   (~47%)     │  Title (Heading 3, 38px)              │
 *   │              │  Description (silver body)            │
 *   │              │  [ View case study ↗ ]                │
 *   │              │  ──────────────────────               │
 *   │              │  22+              2.4x                │
 *   │              │  HOURS SAVED      REPEAT BUYS         │
 *   └──────────────┴───────────────────────────────────────┘
 *
 * Mobile / tablet keeps the original vertical stacked layout.
 *
 * Desktop (lg+) is a stacking deck:
 *   1. The section title scrolls naturally and exits the viewport.
 *   2. The first card pins centered in the viewport.
 *   3. Each subsequent card slides in from below, pins centered, and lands
 *      ON TOP of the previous one — which simultaneously scales down with
 *      `transform-origin: top`, so its top edge peeks out as a "ledge".
 *
 * Implementation: each card lives in its own `sticky top-0 h-screen` slot.
 * A single `useScroll` on the stack container drives the per-card scale
 * animations, so the cards keep visual continuity as the user scrolls
 * through the stack.
 */
export default function CaseStudies({ dict }: CaseStudiesProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  // 0 when the first card pins (start of stack reaches viewport top),
  // 1 when the last card unpins (end of stack reaches viewport bottom).
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  const total = dict.items.length;

  return (
    <section
      aria-label="Case studies"
      className="mx-auto w-full max-w-[1140px] px-6 md:px-8 2xl:max-w-[1340px]"
    >
      {/* Title — scrolls with the page on every breakpoint. By the time
          the stack starts pinning, the title has already exited above. */}
      <RevealGroup
        staggerDelay={0.1}
        className="mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center"
      >
        <RevealItem>
          <Eyebrow>{dict.eyebrow}</Eyebrow>
        </RevealItem>
        <RevealItem>
          <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
        </RevealItem>
        <RevealItem>
          <p className="text-fig-body text-silver max-w-[520px]">{dict.body}</p>
        </RevealItem>
      </RevealGroup>

      {/* MOBILE / TABLET — simple vertical layout, no scroll hijacking. */}
      <RevealGroup
        staggerDelay={0.15}
        amount={0.1}
        className="mt-14 flex flex-col gap-10 md:mt-20 md:gap-16 lg:hidden"
      >
        {dict.items.map((item) => (
          <RevealItem key={item.index} y={32}>
            <CaseStudyCard item={item} ctaLabel={dict.ctaLabel} />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* DESKTOP — stacking deck. Each child is its own sticky slot. */}
      <div ref={stackRef} className="mt-12 hidden lg:block">
        {dict.items.map((item, i) => (
          <StackingSlot
            key={item.index}
            item={item}
            ctaLabel={dict.ctaLabel}
            i={i}
            total={total}
            progress={scrollYProgress}
          />
        ))}
        {/* Tail spacer — sits inside the same scroll container so the last
            card actually has scroll budget to stay pinned (without it, with
            an h-screen slot in an h-screen budget, the last card has 0 pin
            time). It also pulls the CTA below so it rises into view
            together with the unsticking deck instead of appearing detached
            after a wide gap. */}
        <div aria-hidden="true" className="h-[100vh]" />
      </div>

      <Reveal className="mt-12 flex justify-center md:mt-16 lg:mt-0">
        <a
          href="#case-studies"
          className="text-fig-link inline-flex items-center gap-2.5 border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white transition-colors hover:border-white/30 hover:bg-white/[0.1]"
        >
          {dict.allCtaLabel}
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            className="text-silver"
          >
            <path
              d="M3 9L9 3M9 3H4M9 3V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </Reveal>
    </section>
  );
}

interface StackingSlotProps {
  item: CaseStudyItem;
  ctaLabel: string;
  i: number;
  total: number;
  progress: MotionValue<number>;
}

/**
 * One sticky slot in the stacking deck.
 *
 *  - The OUTER `sticky top-0 h-screen` container pins the slot to the
 *    top of the viewport while its slice of scroll passes by, and uses
 *    `items-center` so the card sits at the vertical center.
 *
 *  - The INNER `motion.div` is the card. It's offset by `i * 24px` so
 *    that subsequent cards rest a touch lower than the previous ones,
 *    revealing a consistent ~24px ledge of every prior card at the top.
 *
 *  - Its `scale` is driven by the stack's `scrollYProgress`: each card
 *    starts shrinking ONCE the next card starts arriving (from progress
 *    `(i + 1) / total` onwards), so when the user reaches the end of the
 *    stack the earliest cards have shrunk the most and the latest one is
 *    full size on top.
 */
function StackingSlot({
  item,
  ctaLabel,
  i,
  total,
  progress,
}: StackingSlotProps) {
  // Each card's "shrink phase" begins exactly when the next card starts
  // arriving on top of it — i.e. at progress (i + 1) / total — and ends
  // at progress 1. The very last card never shrinks (no card lands on
  // top of it), so its target scale is 1.
  const isLast = i === total - 1;
  const targetScale = isLast ? 1 : 1 - (total - i - 1) * 0.04;
  const shrinkStart = (i + 1) / total;
  const scale = useTransform(progress, [shrinkStart, 1], [1, targetScale]);

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center">
      <motion.div
        style={{
          scale,
          top: `${i * 24}px`,
        }}
        className="relative w-full origin-top will-change-transform"
      >
        <CaseStudyCard item={item} ctaLabel={ctaLabel} />
      </motion.div>
    </div>
  );
}

interface CaseStudyCardProps {
  item: CaseStudyItem;
  ctaLabel: string;
}

function CaseStudyCard({ item, ctaLabel }: CaseStudyCardProps) {
  return (
    <article className="bg-shark grid w-full overflow-hidden border border-white/10 lg:grid-cols-[588fr_652fr] lg:min-h-[480px] xl:h-[60vh] xl:max-h-[60vh]">
      {/* Image */}
      <div className="relative h-[260px] w-full overflow-hidden bg-black/40 sm:h-[340px] md:h-[420px] lg:h-full">
        <Image
          src={item.image}
          alt={item.brand}
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 md:p-8 xl:p-10">
        {/* Top: year · category divider + brand wordmark */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-fig-eyebrow text-silver">{item.year}</span>
            <span aria-hidden="true" className="bg-silver size-1" />
            <span className="text-fig-eyebrow text-white">{item.category}</span>
          </div>
          <p className="text-fig-h5 text-white tracking-tight">{item.brand}</p>
        </div>

        {/* Main: title + description + CTA — pinned to bottom, just above stats */}
        <div className="mt-auto flex flex-col gap-6 pt-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-fig-h3 max-w-[470px] text-white">
              {item.title}
            </h3>
            <p className="text-fig-body text-silver max-w-[480px]">
              {item.description}
            </p>
          </div>

          <a
            href="#case-studies"
            className="text-fig-link inline-flex w-fit items-center gap-2.5 border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white transition-colors hover:border-white/30 hover:bg-white/[0.1]"
          >
            {ctaLabel}
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
              className="text-silver"
            >
              <path
                d="M3 9L9 3M9 3H4M9 3V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Stats: 2 columns separated by top border */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 md:gap-8">
          {item.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-3">
              <p className="text-fig-h3 text-white">{stat.value}</p>
              <p className="text-fig-eyebrow text-silver">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
