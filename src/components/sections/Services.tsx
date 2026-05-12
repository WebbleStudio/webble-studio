"use client";

import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface ServicesProps {
  dict: Dictionary["homeServices"];
}

/**
 * "Services" — sticky H2 on the left (md+), vertical stack of service cards
 * on the right. Each card splits text + bullet list / image.
 */
export default function Services({ dict }: ServicesProps) {
  return (
    <section
      id="services"
      aria-label="Services"
      className="mx-auto w-full max-w-[1140px] scroll-mt-24 px-6 md:px-8 2xl:max-w-[1340px]"
    >
      <div className="grid gap-10 md:grid-cols-[300px_1fr] md:gap-12 lg:grid-cols-[360px_1fr] 2xl:grid-cols-[420px_1fr] 2xl:gap-16">
        <RevealGroup
          staggerDelay={0.1}
          className="flex flex-col gap-4 md:sticky md:top-32 md:self-start"
        >
          <RevealItem>
            <Eyebrow>{dict.eyebrow}</Eyebrow>
          </RevealItem>
          <RevealItem>
            <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
          </RevealItem>
          <RevealItem>
            <p className="text-fig-body text-silver max-w-[320px]">
              {dict.body}
            </p>
          </RevealItem>
        </RevealGroup>

        <RevealGroup
          staggerDelay={0.15}
          amount={0.1}
          className="flex flex-col gap-5 md:gap-6"
        >
          {dict.items.map((service) => (
            <RevealItem key={service.index} y={28}>
            <article
              className="bg-shark grid overflow-hidden border border-white/10 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_330px] 2xl:grid-cols-[1fr_380px]"
            >
              <div className="flex flex-col gap-6 p-6 pb-3 md:p-7 md:pb-4 2xl:p-8 2xl:pb-4">
                <p className="text-fig-eyebrow text-silver">/ #{service.index}</p>

                <div className="flex flex-col gap-2">
                  <h3 className="text-fig-h3 text-white">{service.title}</h3>
                  <p className="text-fig-body text-silver">{service.description}</p>
                </div>

                <ul className="mt-auto flex flex-col border-t border-white/10">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="text-fig-eyebrow text-silver border-b border-white/10 py-4 last:border-b-0"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 md:p-4 md:h-full">
                <div className="relative aspect-[16/10] h-full w-full overflow-hidden bg-black/40 md:aspect-auto md:min-h-[388px]">
                  <Image
                    src={service.image}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 768px) 100vw, 330px"
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
