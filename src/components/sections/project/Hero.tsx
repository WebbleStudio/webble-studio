import Image from "next/image";
import AnimatedWordsReveal from "@/components/animations/text/AnimatedWordsReveal";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface HeroProps {
  name: string;
  subtitle: string;
  tags: string[];
  heroImage?: string;
}

export default function Hero({ name, subtitle, tags, heroImage }: HeroProps) {
  return (
    <section
      aria-label="Project Hero"
      className="bg-background flex h-screen min-h-[760px] flex-col pt-36 pb-16 md:pt-48 md:pb-24"
    >
      <div className="mx-auto flex h-full w-full max-w-[1300px] flex-col px-6 md:px-8 2xl:max-w-[1650px]">

        {/* Testo centrato in alto */}
        <div className="flex shrink-0 flex-col items-center text-center">
          <h1 className="text-fig-h1 text-foreground">
            <AnimatedWordsReveal text={name} immediate />
          </h1>
          <RevealGroup initialDelay={0.3}>
            <RevealItem>
              <p className="text-fig-subtitle text-foreground/60 mt-3 md:mt-4">
                {subtitle}
              </p>
            </RevealItem>
            <RevealItem>
              <div className="mt-5 flex flex-wrap justify-center gap-2 md:mt-7">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-fig-chip border-foreground/20 text-foreground/60 rounded-full border px-4 py-1.5 transition-colors duration-300 hover:bg-foreground hover:text-background"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </RevealItem>
          </RevealGroup>
        </div>

        {/* Hero image filling remaining space */}
        <RevealGroup initialDelay={0.45} className="mt-8 flex min-h-0 flex-1 md:mt-12">
          <RevealItem className="flex flex-1">
            <div className="relative h-full w-full flex-1 overflow-hidden rounded-[4px] bg-foreground/10">
              {heroImage && (
                <Image
                  src={heroImage}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1300px) 90vw, 1300px"
                  quality={90}
                  className="scale-[1.01] object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              )}
            </div>
          </RevealItem>
        </RevealGroup>

      </div>
    </section>
  );
}
