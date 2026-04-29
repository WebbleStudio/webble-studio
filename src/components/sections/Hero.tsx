import type { Dictionary } from "@/lib/getDictionary";
import ParticlesCanvas from "@/components/animations/ParticlesCanvas";
import BookingButton from "@/components/ui/BookingButton";

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

      {/* Central text — server rendered, z-10 stays above particles */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center md:gap-8 2xl:gap-10">
        <h1 className="font-hero xs:text-[22px] xs:max-w-[320px] w-full max-w-[270px] text-[18px] tracking-[-2px] uppercase sm:max-w-[400px] sm:text-[26px] md:max-w-[800px] md:text-[34px] lg:text-[38px] 2xl:max-w-[1000px] 2xl:text-[48px]">
          {dict.headline}
        </h1>
        <p className="xs:max-w-[320px] max-w-[250px] md:max-w-full">{dict.subheadline}</p>
        <div className="flex w-full max-w-[390px] flex-col items-stretch gap-3 md:w-auto md:max-w-none md:flex-row md:items-center">
          <BookingButton
            label={dict.ctaSecondary}
            iconSrc="/icons/facetime-icon-white.svg"
            iconSize={16}
            className="text-foreground border-foreground/20 flex w-full items-center justify-center gap-3 border bg-[#121212] px-5 py-4 font-sans text-sm font-medium md:w-auto md:px-10 2xl:text-base"
          />
          <a
            href="#"
            className="text-foreground border-foreground/20 flex w-full items-center justify-center gap-3 border px-5 py-4 font-sans text-sm font-medium md:w-auto md:px-8 2xl:text-base"
          >
            <img
              src="/img/homepage/problems/layers-icon.svg"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="md:hidden">{dict.cta}</span>
            <span className="hidden md:inline">{dict.ctaShort}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
