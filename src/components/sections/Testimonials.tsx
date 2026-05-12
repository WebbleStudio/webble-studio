"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Dictionary, TestimonialReview } from "@/lib/getDictionary";
import BookingButton from "@/components/ui/BookingButton";

interface TestimonialsProps {
  dict: Dictionary["testimonials"];
}

/**
 * Testimonials — full-width pinned section.
 *
 *  - A horizontally looping "Cosa dicono di noi" marquee sits centered
 *    behind the cards. The marquee is contained by the section's
 *    `overflow-hidden`, so its loop never escapes the layout.
 *  - The outer section is taller than the viewport (`h-[220vh]`) and the
 *    inner is `sticky top-0 h-screen`, which means the marquee + cards
 *    "pin" once the section reaches the top of the viewport and stay
 *    pinned while the user scrolls through the section's scroll budget.
 *  - During that pinned period, the cards layer translates upward via a
 *    `useScroll` → `useTransform` chain, so the reviews rise across the
 *    pinned marquee. Once the section's bottom passes the bottom of the
 *    viewport the sticky releases and the page resumes natural scrolling.
 *  - Mobile (< md) falls back to a simple stacked list — the scattered
 *    layout doesn't make sense at narrow widths.
 */

interface CardPosition {
  top: string;
  left?: string;
  right?: string;
}

/**
 * Card positions — these are the resting positions WITHIN the cards layer.
 * Coordinates are relative to the constrained content container (max-width
 * 1300px / 1650px on 2xl), so 0% / 0vh sits flush with the inner padding
 * rather than the viewport edge. The scattered top: values give the deck
 * its "staircase" silhouette when all five cards are simultaneously in
 * view (around the midpoint of the pin).
 */
const CARD_POSITIONS: readonly CardPosition[] = [
  { top: "4vh", left: "0%" },
  { top: "12vh", right: "0%" },
  { top: "38vh", left: "32%" },
  { top: "62vh", left: "4%" },
  { top: "70vh", right: "0%" },
];

export default function Testimonials({ dict }: TestimonialsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // 0 when the sticky inner pins (section.top hits viewport.top),
    // 1 when the sticky inner releases (section.bottom hits viewport.bottom).
    offset: ["start start", "end end"],
  });

  // Cards start fully below the viewport (+110vh) and rise across it during
  // the pin, exiting above (-130vh). At progress 0 (pin engagement) only
  // the marquee is visible; the cards rise into view, form their scattered
  // layout around the midpoint, then exit from the top.
  const cardsY = useTransform(scrollYProgress, [0, 1], ["110vh", "-130vh"]);

  return (
    <section ref={sectionRef} aria-label="Testimonials" className="relative">
      {/* MOBILE — simple stacked layout, no scroll hijacking. */}
      <div className="mx-auto block w-full max-w-[640px] px-6 md:hidden">
        <Marquee text={dict.headline} />
        <div className="mt-6 flex justify-center">
          <BookingCta label={dict.ctaLabel} />
        </div>
        <div className="mt-10 flex flex-col gap-5">
          {dict.reviews.map((review) => (
            <ReviewCard key={review.authorName} review={review} />
          ))}
        </div>
      </div>

      {/* DESKTOP — pinned with scroll-driven cards layer. */}
      <div className="relative hidden h-[220vh] md:block">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Constrained container — same max-width as every other section
              on the page, so the marquee and the cards never touch the
              viewport edges. The relative wrapper inside establishes the
              positioning context for the absolute children. */}
          <div className="mx-auto h-full w-full max-w-[1140px] px-6 md:px-8 2xl:max-w-[1340px]">
            <div className="relative h-full w-full">
              {/* Marquee + CTA — absolute, centered vertically, behind the
                  cards. overflow-hidden on the marquee wrapper keeps the
                  loop clipped at the inner content edges, not the viewport
                  edges. The CTA sits a beat below the marquee so it stays
                  visible together with the looping headline. */}
              <div className="absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 flex-col items-center gap-10">
                <div className="pointer-events-none w-full overflow-hidden">
                  <Marquee text={dict.headline} />
                </div>
                <BookingCta label={dict.ctaLabel} />
              </div>

              {/* Cards layer — absolute, lifts on scroll. pointer-events
                  off on the layer itself (it covers the entire area) so the
                  CTA underneath stays clickable in the gaps between cards. */}
              <motion.div
                style={{ y: cardsY }}
                className="pointer-events-none absolute inset-0 z-10 will-change-transform"
              >
                {dict.reviews.map((review, i) => {
                  const pos = CARD_POSITIONS[i % CARD_POSITIONS.length];
                  const style: React.CSSProperties = { top: pos.top };
                  if (pos.left) style.left = pos.left;
                  if (pos.right) style.right = pos.right;

                  return (
                    <div
                      key={review.authorName}
                      style={style}
                      className="absolute w-[300px] lg:w-[330px] 2xl:w-[360px]"
                    >
                      <ReviewCard review={review} />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Two side-by-side copies of the same long string slid in tandem; when
 * the wrapper has translated exactly half its width the second copy is
 * in the position the first started in, and the loop seamlessly repeats.
 */
function Marquee({ text }: { text: string }) {
  const SEPARATOR = "\u00A0\u00A0\u00A0";
  const REPEATS = 6;
  const segment =
    Array.from({ length: REPEATS }, () => text).join(SEPARATOR) + SEPARATOR;

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="text-bone font-sans flex whitespace-nowrap leading-none font-normal tracking-[-0.05em] uppercase"
        style={{ fontSize: "clamp(24px, 5.2vw, 84px)" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 50, ease: "linear", repeat: Infinity }}
      >
        <span className="shrink-0">{segment}</span>
        <span className="shrink-0" aria-hidden="true">
          {segment}
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Brutalist-style booking CTA — same visual language as the Hero primary
 * button (accent fill, square edges, bold padding). Opens the global
 * booking modal via `BookingButton`.
 */
function BookingCta({ label }: { label: string }) {
  return (
    <BookingButton
      label={label}
      iconSrc="/icons/facetime-icon-white.svg"
      iconSize={18}
      className="bg-accent text-foreground inline-flex items-center gap-2.5 px-8 py-[18px] font-sans text-sm font-medium leading-none transition-opacity hover:opacity-90 2xl:text-base"
    />
  );
}

interface ReviewCardProps {
  review: TestimonialReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex flex-col gap-5 border border-white/10 bg-[#090909]/60 p-5 backdrop-blur-md md:p-6">
      <p className="text-fig-body leading-relaxed text-white/90">
        {review.quote}
      </p>
      <div className="h-px w-full bg-white/10" />
      <div className="flex items-center gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden bg-black/40">
          <Image
            src={review.image}
            alt={review.authorName}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-fig-h5 truncate text-white">
            {review.authorName}
          </p>
          <p className="text-fig-eyebrow text-silver truncate">
            {review.authorRole}
          </p>
        </div>
      </div>
    </article>
  );
}
