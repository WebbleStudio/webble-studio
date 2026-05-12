import AnimatedProcess from "@/components/animations/project/AnimatedProcess";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { Locale } from "@/lib/locales";
import type { ProjectProcessStep } from "@/data/projects";

interface ProcessProps {
  label: string;
  steps: ProjectProcessStep[];
  locale: Locale;
}

export default function Process({ label, steps, locale }: ProcessProps) {
  return (
    <section aria-label="Process" className="bg-background py-12 md:py-20">
      <div className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]">
        <RevealGroup>
          <RevealItem>
            <h2 className="text-fig-h2 text-foreground mb-10 md:mb-14">
              {label}
            </h2>
          </RevealItem>
        </RevealGroup>
        <AnimatedProcess steps={steps} locale={locale} />
      </div>
    </section>
  );
}
