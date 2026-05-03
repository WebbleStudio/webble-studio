import type { Dictionary } from "@/lib/getDictionary";
import BookingButton from "@/components/ui/BookingButton";

interface HeroProps {
  hero: Dictionary["home"]["hero"];
}

/**
 * Hero composition mirrors the Sanjaya / "Mountain studio" Figma:
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
 *  Typography per Figma:
 *  - Services list:    Geist Mono / 12px / 0.08em / uppercase
 *  - Subheadline:      Geist Regular / 18px / lh 1.4 / -0.04em
 *  - Chip:             Geist Mono Medium / 12px / 0.08em / uppercase
 *  - Headline (H1):    Geist Regular / 56px / lh 1.0 / -0.05em
 */
export default function Hero({ hero }: HeroProps) {
  const headlineLines = hero.headline
    .split(". ")
    .map((s, i, arr) => (i < arr.length - 1 ? `${s}.` : s))
    .filter(Boolean);

  return (
    <section
      aria-label="Hero"
      className="relative h-[100svh] min-h-[700px] w-full overflow-hidden md:min-h-[820px]"
    >
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(120,130,150,0.18) 0%, rgba(10,10,10,0) 60%), linear-gradient(180deg, #1a1c20 0%, #0a0a0a 55%, #020303 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2"
        style={{
          background: "linear-gradient(180deg, rgba(2,3,3,0) 0%, rgba(2,3,3,0.85) 100%)",
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1300px] flex-col px-6 pt-28 pb-10 md:px-8 md:pt-32 md:pb-16 2xl:max-w-[1650px] 2xl:pt-40 2xl:pb-20">
        {/* Top row — services list only */}
        <ul className="flex flex-col gap-1.5 md:gap-2">
          {hero.services.map((service) => (
            <li key={service.label} className="text-fig-eyebrow text-white">
              / {service.label}
            </li>
          ))}
        </ul>

        {/* Spacer fills middle */}
        <div className="flex-1" />

        {/* Bottom row — chip + display headline (left), subheadline (right). */}
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex max-w-[760px] flex-col gap-4 md:gap-5">
            <span className="relative inline-flex w-fit items-center bg-white/10 px-[10px] py-[6px] backdrop-blur-[2px]">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-white/25" />
              <span className="text-fig-chip text-white">{hero.chipLabel}</span>
            </span>

            <h1 className="text-fig-h1 text-white">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            {/* CTA buttons — Webble Studio "brutalist" style: square edges,
                bold padding, accent fill on the primary, outlined ghost on
                the secondary. Primary opens the booking modal, secondary
                scrolls to the in-page Services section. */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <BookingButton
                label={hero.primaryCta}
                iconSrc="/icons/facetime-icon-white.svg"
                iconSize={18}
                className="bg-accent text-foreground inline-flex items-center gap-2.5 px-8 py-[18px] font-sans text-sm font-medium leading-none transition-opacity hover:opacity-90 2xl:text-base"
              />
              <a
                href="#services"
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
          </div>

          <p className="text-fig-subtitle w-full max-w-[360px] text-left text-white md:text-right 2xl:max-w-[400px]">
            {hero.subheadline}
          </p>
        </div>
      </div>
    </section>
  );
}
