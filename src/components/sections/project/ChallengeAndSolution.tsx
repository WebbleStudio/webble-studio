import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import AnimatedStaggerChildren from "@/components/animations/AnimatedStaggerChildren";

interface ChallengeAndSolutionProps {
  sectionLabel: string;
  challengeLabel: string;
  challengeBody: string;
  solutionLabel: string;
  solutionBody: string;
}

export default function ChallengeAndSolution({
  sectionLabel,
  challengeLabel,
  challengeBody,
  solutionLabel,
  solutionBody,
}: ChallengeAndSolutionProps) {
  return (
    <section aria-label="Challenge & Solution" className="bg-background py-12 md:py-20">
      <div className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-0">

          {/* Section label */}
          <RevealGroup>
            <RevealItem>
              <p className="text-fig-eyebrow text-foreground/40 shrink-0 md:w-[38%] md:pt-7">
                {sectionLabel}
              </p>
            </RevealItem>
          </RevealGroup>

          {/* Two cards */}
          <AnimatedStaggerChildren
            className="flex flex-1 flex-col gap-3 md:gap-4"
            stagger={0.14}
          >
            {/* Challenge */}
            <div className="border border-foreground/12 rounded-[4px] p-6 md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:gap-10">
                <h3 className="text-fig-h5 text-foreground shrink-0 md:w-[110px]">
                  {challengeLabel}
                </h3>
                <p className="text-fig-body text-foreground/70">
                  {challengeBody}
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-foreground rounded-[4px] p-6 md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:gap-10">
                <h3 className="text-fig-h5 text-background shrink-0 md:w-[110px]">
                  {solutionLabel}
                </h3>
                <p className="text-fig-body text-background/70">
                  {solutionBody}
                </p>
              </div>
            </div>
          </AnimatedStaggerChildren>

        </div>
      </div>
    </section>
  );
}
