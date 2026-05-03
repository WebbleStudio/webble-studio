import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";

interface CaseStudiesProps {
  dict: Dictionary["caseStudies"];
}

/**
 * "Our works" — wide horizontal cards (1240×800 in Figma).
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
 */
export default function CaseStudies({ dict }: CaseStudiesProps) {
  return (
    <section
      aria-label="Case studies"
      className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <header className="mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center">
        <Eyebrow>{dict.eyebrow}</Eyebrow>
        <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
        <p className="text-fig-body text-silver max-w-[520px]">{dict.body}</p>
      </header>

      <div className="mt-14 flex flex-col gap-10 md:mt-20 md:gap-16 2xl:gap-20">
        {dict.items.map((item) => (
          <article
            key={item.index}
            className="bg-shark grid w-full overflow-hidden rounded-[12px] border border-white/10 lg:grid-cols-[588fr_652fr] lg:min-h-[480px] xl:h-[800px]"
          >
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
            <div className="flex flex-col justify-between gap-10 p-6 md:p-8 xl:p-10">
              {/* Top: year · category divider + brand wordmark */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-fig-eyebrow text-silver">{item.year}</span>
                  <span aria-hidden="true" className="bg-silver size-1 rounded-[2px]" />
                  <span className="text-fig-eyebrow text-white">{item.category}</span>
                </div>
                <p className="text-fig-h5 text-white tracking-tight">{item.brand}</p>
              </div>

              {/* Main: title + description + CTA */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-fig-h3 text-white">{item.title}</h3>
                  <p className="text-fig-body text-silver">{item.description}</p>
                </div>

                <a
                  href="#case-studies"
                  className="text-fig-link inline-flex w-fit items-center gap-2.5 rounded-[8px] border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white transition-colors hover:border-white/30 hover:bg-white/[0.1]"
                >
                  {dict.ctaLabel}
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
              <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 md:gap-8">
                {item.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-3">
                    <p className="text-fig-h3 text-white">{stat.value}</p>
                    <p className="text-fig-eyebrow text-silver">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex justify-center md:mt-16">
        <a
          href="#case-studies"
          className="text-fig-link inline-flex items-center gap-2.5 rounded-[8px] border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white transition-colors hover:border-white/30 hover:bg-white/[0.1]"
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
      </div>
    </section>
  );
}
