import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";

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
      className="mx-auto w-full max-w-[1300px] scroll-mt-24 px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <div className="grid gap-10 md:grid-cols-[300px_1fr] md:gap-12 lg:grid-cols-[360px_1fr] 2xl:grid-cols-[420px_1fr] 2xl:gap-16">
        <header className="flex flex-col gap-4 md:sticky md:top-32 md:self-start">
          <Eyebrow>{dict.eyebrow}</Eyebrow>
          <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
          <p className="text-fig-body text-silver max-w-[320px]">{dict.body}</p>
        </header>

        <div className="flex flex-col gap-5 md:gap-6">
          {dict.items.map((service) => (
            <article
              key={service.index}
              className="bg-shark grid overflow-hidden rounded-[8px] border border-white/10 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]"
            >
              <div className="flex flex-col gap-6 p-6 md:p-7 2xl:p-8">
                <p className="text-fig-eyebrow text-silver">/ {service.index}</p>

                <div className="flex flex-col gap-2">
                  <h3 className="text-fig-h4 text-white">{service.title}</h3>
                  <p className="text-fig-body text-silver">{service.description}</p>
                </div>

                <ul className="flex flex-col">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="text-fig-eyebrow text-silver border-b border-white/10 py-3 last:border-b-0"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40 md:aspect-auto md:min-h-[260px]">
                <Image
                  src={service.image}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
