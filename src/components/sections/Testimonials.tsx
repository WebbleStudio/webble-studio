import type { Dictionary } from "@/lib/getDictionary";
import AnimatedTestimonials from "@/components/animations/AnimatedTestimonials";
import ReviewCard from "@/components/ui/homepage/ReviewCard";

interface TestimonialsProps {
  dict: Dictionary["testimonials"];
}

/**
 * Infinite horizontal marquee banner.
 *
 * md+: marquee vertically centered; up to 5 ReviewCards in absolute positions
 * with scroll parallax (see AnimatedTestimonials).
 */
export default function Testimonials({ dict }: TestimonialsProps) {
  const COPIES = 16;
  const reviews = dict.reviews ?? [];

  return (
    <section
      aria-label="Testimonials"
      className="relative flex h-auto flex-col items-center gap-10 overflow-hidden md:h-screen md:min-h-[1000px] md:justify-center"
    >
      <h2 className="sr-only">{dict.headline}</h2>

      <div
        className="animate-marquee z-0 flex w-max will-change-transform md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2"
        aria-hidden="true"
      >
        <MarqueeTrack text={dict.headline} copies={COPIES} />
        <MarqueeTrack text={dict.headline} copies={COPIES} />
      </div>

      {/* Mobile / tablet: stacked cards below marquee */}
      <div className="mx-auto mt-10 flex w-full max-w-[1300px] flex-col items-center gap-6 px-6 md:hidden 2xl:max-w-[1650px]">
        {(reviews.length > 0 ? reviews : Array.from({ length: 5 })).map((review, i) => (
          <ReviewCard
            key={i}
            {...(reviews[i] ?? {})}
          />
        ))}
      </div>

      {/* Desktop: floating cards + parallax over the centered marquee */}
      <div className="hidden md:absolute md:inset-0 md:z-10 md:block">
        <AnimatedTestimonials reviews={reviews} />
      </div>
    </section>
  );
}

function MarqueeTrack({ text, copies }: { text: string; copies: number }) {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: copies }).map((_, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase md:text-[26px] lg:text-[34px] 2xl:text-[42px]">
            {text}
          </span>
          <span className="bg-foreground mx-8 inline-block h-[0.35em] w-[0.35em] shrink-0 rounded-full align-middle text-[20px]" />
        </span>
      ))}
    </div>
  );
}
