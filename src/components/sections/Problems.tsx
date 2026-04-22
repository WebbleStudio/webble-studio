import type { Dictionary } from "@/lib/getDictionary";
import ProblemStripe from "@/components/ui/homepage/ProblemStripe";

interface ProblemsProps {
  dict: Dictionary["problems"];
}

export default function Problems({ dict }: ProblemsProps) {
  const [l1, l2, l3, l4] = dict.labels;

  return (
    <section
      aria-label="Problems"
      className="flex w-full flex-col items-center justify-center gap-10 text-center md:gap-14"
    >
      {/* Stripes above headline */}
      <div className="flex w-full max-w-[560px] flex-col gap-4">
        <ProblemStripe label={l1} className="self-end" />
        <ProblemStripe label={l2} className="self-start" />
      </div>

      <h2 className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase sm:text-[52px] md:text-[40px]">
        {dict.headline}
      </h2>

      {/* Stripes below headline */}
      <div className="flex w-full max-w-[560px] flex-col gap-4">
        <ProblemStripe label={l3} className="self-end" />
        <ProblemStripe label={l4} className="self-start" />
      </div>
    </section>
  );
}
