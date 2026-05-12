"use client";

import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface CompanyLogosProps {
  dict: Dictionary["companies"];
}

/**
 * "Trusted companies across industries" — eyebrow on top, then a 5-col grid
 * of low-contrast brand logos. Eyebrow + logos fade in on scroll.
 */
export default function CompanyLogos({ dict }: CompanyLogosProps) {
  return (
    <section
      aria-label="Trusted by"
      className="mx-auto w-full max-w-[1140px] px-6 py-16 md:px-8 md:py-20 2xl:max-w-[1340px] 2xl:py-24"
    >
      <Reveal>
        <p className="text-fig-eyebrow text-center text-silver">{dict.eyebrow}</p>
      </Reveal>

      <RevealGroup
        initialDelay={0.1}
        staggerDelay={0.05}
        className="mx-auto mt-8 grid max-w-[1240px] grid-cols-2 overflow-hidden border border-white/10 sm:grid-cols-3 md:grid-cols-5 2xl:mt-10"
      >
        {dict.logos.map((logo, i) => (
          <RevealItem
            key={`${logo.name}-${i}`}
            y={12}
            className="flex h-[110px] items-center justify-center border-b border-l border-white/10 px-6 first:border-l-0 sm:[&:nth-child(3n+1)]:border-l-0 md:[&:nth-child(3n+1)]:border-l md:[&:nth-child(5n+1)]:border-l-0 [&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-last-child(-n+3)]:border-b-0 md:[&:nth-last-child(-n+5)]:border-b-0"
          >
            <div className="relative h-8 w-[120px] opacity-60 grayscale transition-opacity hover:opacity-90">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="120px"
                className="object-contain"
              />
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
