import AnimatedWordsReveal from "@/components/animations/text/AnimatedWordsReveal";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";

interface HeroProps {
  eyebrow: string;
  headline: string;
}

export default function Hero({ eyebrow, headline }: HeroProps) {
  return (
    <section
      aria-label="Portfolio Hero"
      className="bg-background flex flex-col justify-center px-6 pt-40 pb-24 md:min-h-[50vh] md:pt-[75px] md:pb-0 2xl:pt-[90px]"
    >
      <div className="mx-auto w-full max-w-[1300px] 2xl:max-w-[1650px]">
        <div className="flex flex-col items-center text-center">
          <RevealGroup>
            <RevealItem>
              <p className="text-fig-eyebrow text-foreground/40 mb-4 md:mb-5">
                {eyebrow}
              </p>
            </RevealItem>
          </RevealGroup>
          <h1 className="text-fig-h1 text-foreground">
            <AnimatedWordsReveal text={headline} />
          </h1>
        </div>
      </div>
    </section>
  );
}
