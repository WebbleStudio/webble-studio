"use client";

import type { Dictionary } from "@/lib/getDictionary";
import BookingButton from "@/components/ui/BookingButton";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface HeroProps {
  hero: Dictionary["home"]["hero"];
  /**
   * Anchor target for the ghost / secondary CTA. Defaults to "#services" to
   * keep the home-page behaviour intact; pages that reuse the Hero (e.g. the
   * About page) can point it to their own in-page section.
   */
  secondaryCtaHref?: string;
}

/**
 * Hero composition — Webble Studio home:
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  / WEB DESIGN                                                 │
 *   │  / WEB DEVELOPMENT                                            │
 *   │  / BRANDING                                                   │
 *   │                                                               │
 *   │                       [ atmospheric BG ]                      │
 *   │                                                               │
 *   │  ▌ WE HAVE BUILT 100+ DIGITAL PRODUCTS                        │
 *   │  Design that converts.            We design digital …         │
 *   │  Code that performs.              experiences that bring …    │
 *   └──────────────────────────────────────────────────────────────┘
 *
 *  Typography per design system:
 *  - Services list:    Geist Mono / 12px / 0.08em / uppercase
 *  - Subheadline:      Geist Regular / 18px / lh 1.4 / -0.04em
 *  - Chip:             Geist Mono Medium / 12px / 0.08em / uppercase
 *  - Headline (H1):    Geist Regular / 56px / lh 1.0 / -0.05em
 */
export default function Hero({ hero, secondaryCtaHref = "#services" }: HeroProps) {
  const headlineLines = hero.headline
    .split(". ")
    .map((s, i, arr) => (i < arr.length - 1 ? `${s}.` : s))
    .filter(Boolean);

  return (
    <section
      aria-label="Hero"
      className="relative h-[100svh] min-h-[700px] w-full overflow-hidden md:min-h-[820px]"
    >
      {/* Background video */}
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
      >
        <source
          src="/img/homepage/Video%20hero/videohero.mp4"
          type="video/mp4"
        />
      </video>

      <div
        aria-hidden="true"
        className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/4"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,3,3,0) 0%, rgba(2,3,3,1) 60%, rgba(2,3,3,1) 100%)",
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1140px] flex-col px-6 pt-28 pb-10 md:px-8 md:pt-32 md:pb-16 2xl:max-w-[1340px] 2xl:pt-40 2xl:pb-20">
        {/* Top row — services list, fades in on page load. */}
        <RevealGroup
          immediate
          initialDelay={0.2}
          staggerDelay={0.06}
          className="flex flex-col gap-1.5 md:gap-2"
        >
          {hero.services.map((service) => (
            <RevealItem key={service.label} y={12}>
              <span className="text-fig-eyebrow text-white">
                / {service.label}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Spacer fills middle */}
        <div className="flex-1" />

        {/* Bottom row — chip + display headline (left), subheadline (right). */}
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex max-w-[760px] flex-col gap-4 md:gap-5">
            <Reveal immediate delay={0.55} y={16}>
              <span className="relative inline-flex w-fit items-center bg-white/10 px-[10px] py-[6px] backdrop-blur-[2px]">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-fire" />
                <span className="text-fig-chip text-white">{hero.chipLabel}</span>
              </span>
            </Reveal>

            <Reveal immediate delay={0.7}>
              <h1 className="text-fig-h1 text-white">
                {headlineLines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>

            {/* CTA buttons — Webble Studio "brutalist" style: square edges,
                bold padding, accent fill on the primary, outlined ghost on
                the secondary. Primary opens the booking modal, secondary
                scrolls to the in-page Services section. */}
            <Reveal immediate delay={0.95} y={16}>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <BookingButton
                  label={hero.primaryCta}
                  iconSrc="/icons/facetime-icon-white.svg"
                  iconSize={18}
                  className="bg-accent text-foreground inline-flex items-center gap-2.5 px-8 py-[18px] font-sans text-sm font-medium leading-none transition-opacity hover:opacity-90 2xl:text-base"
                />
                <a
                  href={secondaryCtaHref}
                  className="border-foreground/20 text-foreground hover:bg-accent hover:border-accent hover:text-background group/services inline-flex items-center gap-2.5 border px-8 py-[18px] font-sans text-sm font-medium leading-none transition-colors 2xl:text-base"
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="4 0 19 19"
                    fill="none"
                    className="text-foreground group-hover/services:text-background transition-colors"
                  >
                    <path
                      d="M4.5 14L13.5 18.5L22.5 14M4.5 9.5L13.5 14L22.5 9.5M13.5 0.5L4.5 5L13.5 9.5L22.5 5L13.5 0.5Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {hero.secondaryCta}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal immediate delay={0.85} y={20}>
            <p className="text-fig-subtitle w-full max-w-[360px] text-left text-white md:text-right 2xl:max-w-[400px]">
              {hero.subheadline}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
