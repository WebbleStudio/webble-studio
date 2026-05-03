import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";

interface CompanyLogosProps {
  dict: Dictionary["companies"];
}

/**
 * "Trusted companies across industries" — eyebrow on top, then a 5-col grid
 * of low-contrast brand logos.
 */
export default function CompanyLogos({ dict }: CompanyLogosProps) {
  return (
    <section
      aria-label="Trusted by"
      className="mx-auto w-full max-w-[1300px] px-6 py-16 md:px-8 md:py-20 2xl:max-w-[1650px] 2xl:py-24"
    >
      <p className="text-fig-eyebrow text-center text-silver">{dict.eyebrow}</p>

      <div className="mt-8 grid grid-cols-2 divide-x divide-y divide-white/[0.06] overflow-hidden border border-white/10 md:grid-cols-3 lg:grid-cols-5 2xl:mt-10">
        {dict.logos.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex h-[110px] items-center justify-center px-6"
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
          </div>
        ))}
      </div>
    </section>
  );
}
