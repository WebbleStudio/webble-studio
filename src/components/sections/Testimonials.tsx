import type { Dictionary } from "@/lib/getDictionary";
import ReviewCard from "@/components/ui/homepage/ReviewCard";

interface TestimonialsProps {
  dict: Dictionary["testimonials"];
}

/**
 * Infinite horizontal marquee banner.
 *
 * Implementation: two IDENTICAL tracks are placed side-by-side inside a
 * `w-max` container. The container animates translateX from 0 → -50%.
 * At -50% the second track is exactly where the first one started, so when
 * the animation loops back to 0 the visual is unchanged → seamless.
 *
 * CRITICAL constraint: a single track must be at least as wide as the
 * widest possible viewport, otherwise near the end of the cycle the viewport
 * extends past the container and empty space becomes visible. We therefore
 * render enough copies per track to cover 4K screens comfortably.
 */
export default function Testimonials({ dict }: TestimonialsProps) {
  // 16 copies × ~400px ≈ 6400px per track → safely wider than any 4K viewport.
  const COPIES = 16;

  return (
    <section
      aria-label="Testimonials"
      className="flex h-auto flex-col items-center gap-10 overflow-hidden"
    >
      {/* Accessible heading — hidden visually but present for SEO/screen readers */}
      <h2 className="sr-only">{dict.headline}</h2>

      <div className="animate-marquee flex w-max will-change-transform" aria-hidden="true">
        <MarqueeTrack text={dict.headline} copies={COPIES} />
        <MarqueeTrack text={dict.headline} copies={COPIES} />
      </div>

      <div className="mx-auto flex w-full max-w-[1300px] flex-col items-center gap-6 px-6 md:px-8 2xl:max-w-[1650px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <ReviewCard key={i} />
        ))}
      </div>
    </section>
  );
}

function MarqueeTrack({ text, copies }: { text: string; copies: number }) {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: copies }).map((_, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase sm:text-[52px] md:text-[40px]">
            {text}
          </span>
          <span className="bg-foreground mx-8 inline-block h-[0.35em] w-[0.35em] shrink-0 rounded-full align-middle text-[20px] sm:text-[52px] md:text-[40px]" />
        </span>
      ))}
    </div>
  );
}
