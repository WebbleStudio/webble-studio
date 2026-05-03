import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";

interface TestimonialsProps {
  dict: Dictionary["testimonials"];
}

/**
 * Testimonials — header with prev/next arrows, then a horizontally scrolling
 * row of review cards (CSS snap), and a 4-column counter strip below.
 */
export default function Testimonials({ dict }: TestimonialsProps) {
  return (
    <section
      aria-label="Testimonials"
      className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-4">
          <Eyebrow>{dict.eyebrow}</Eyebrow>
          <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M9 3L5 7L9 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M5 3L9 7L5 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Horizontal scroll list */}
      <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:-mx-8 md:mt-10 md:gap-6 md:px-8">
        {dict.reviews.map((review) => (
          <article
            key={review.authorName}
            className="bg-shark grid w-[88%] shrink-0 snap-start grid-cols-[1fr_140px] overflow-hidden rounded-[8px] border border-white/10 sm:w-[460px] md:w-[520px] md:grid-cols-[1fr_180px] 2xl:w-[600px]"
          >
            <div className="flex flex-col justify-between gap-6 p-6 md:p-7">
              <p className="text-fig-h4 text-white/40">{review.brand}</p>

              <p className="text-fig-body text-white">{review.quote}</p>

              <div className="flex flex-col gap-1">
                <p className="text-fig-h5 text-white">{review.authorName}</p>
                <p className="text-fig-eyebrow text-silver">{review.authorRole}</p>
              </div>
            </div>

            <div className="relative h-full min-h-[260px] overflow-hidden bg-black/40">
              <Image
                src={review.image}
                alt={review.authorName}
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>
          </article>
        ))}
      </div>

      {/* Counter strip */}
      <div className="bg-shark mt-10 grid grid-cols-2 overflow-hidden rounded-[8px] border border-white/10 md:mt-12 md:grid-cols-4">
        {dict.metrics.map((metric, i) => (
          <div
            key={metric.label}
            className={`flex flex-col gap-2 p-5 md:p-7 ${
              i > 0 ? "border-t border-white/10 md:border-t-0 md:border-l" : ""
            } ${i === 1 ? "border-l border-white/10 md:border-l" : ""} ${i === 3 ? "border-l border-white/10 md:border-l" : ""}`}
          >
            <p className="text-fig-h2 text-white">
              <span>{metric.value}</span>
              <span className="text-silver ml-1 text-[60%]">{metric.suffix}</span>
            </p>
            <p className="text-fig-eyebrow text-silver">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
