import type { Dictionary } from "@/lib/getDictionary";
import AnimatedProblemsStripes from "@/components/animations/AnimatedProblemsStripes";

interface ProblemsProps {
  dict: Dictionary["problems"];
}

export default function Problems({ dict }: ProblemsProps) {
  return (
    <section
      aria-label="Problems"
      className="flex w-full flex-col items-center justify-center text-center"
    >
      <AnimatedProblemsStripes labels={dict.labels}>
        <h2 className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase md:text-[26px] lg:text-[34px] 2xl:text-[42px]">
          {dict.headline}
        </h2>
      </AnimatedProblemsStripes>
    </section>
  );
}
