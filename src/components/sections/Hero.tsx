import type { Dictionary } from "@/lib/getDictionary";
import AnimatedHeroImages from "@/components/animations/AnimatedHeroImages";
import ParticlesCanvas from "@/components/animations/ParticlesCanvas";

interface HeroProps {
  dict: Dictionary["home"];
}

export default function Hero({ dict }: HeroProps) {
  return (
    <section
      aria-label="Hero"
      className="relative flex h-[700px] items-center justify-center overflow-hidden md:h-screen"
    >
      {/* Upward-floating particles */}
      <ParticlesCanvas />

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07]"
        aria-hidden="true"
      />

      {/* Floating project images — client only, purely decorative */}
      <AnimatedHeroImages />

      {/* Central text — server rendered, z-10 stays above images */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <h1 className="font-hero xs:text-[22px] xs:max-w-[320px] w-full max-w-[270px] text-[18px] tracking-[-2px] uppercase sm:text-[52px] md:max-w-[800px] md:text-[40px]">
          {dict.headline}
        </h1>
        <p className="xs:max-w-[320px] max-w-[250px]">{dict.subheadline}</p>
        <div className="flex w-full max-w-[390px] flex-col items-stretch gap-3">
          <a
            href="#"
            className="text-foreground flex w-full items-center justify-center gap-2 bg-[#121212] px-5 py-4 font-sans text-sm font-medium"
          >
            <img
              src="/icons/facetime-icon-white.svg"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
            />
            {dict.ctaSecondary}
          </a>
          <a
            href="#"
            className="text-foreground flex w-full items-center justify-center gap-2 border border-[#121212] px-5 py-4 font-sans text-sm font-medium"
          >
            <img
              src="/img/homepage/problems/layers-icon.svg"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              style={{ filter: "brightness(0) invert(1)" }}
            />
            {dict.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
