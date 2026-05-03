import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";

interface HowItWorksProps {
  dict: Dictionary["process"];
}

/**
 * "How it works" — eyebrow chip, headline (H2), supporting body, then a 3-up
 * grid of step cards with rounded image and step title (H4) + description.
 */
export default function HowItWorks({ dict }: HowItWorksProps) {
  return (
    <section
      aria-label="How it works"
      className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <header className="mx-auto flex max-w-[600px] flex-col items-center gap-4 text-center">
        <Eyebrow>{dict.eyebrow}</Eyebrow>
        <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
        <p className="text-fig-body text-silver">{dict.body}</p>
      </header>

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 2xl:mt-20">
        {dict.steps.map((step, i) => (
          <article key={step.step} className="flex flex-col gap-5">
            {/* Visual */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-white/10 bg-black/40">
              <Image
                src={step.image}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(2,3,3,0.0) 40%, rgba(2,3,3,0.7) 100%)",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-fig-h4 text-white">
                {i + 1}. {step.title}
              </h3>
              <p className="text-fig-body text-silver">{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
