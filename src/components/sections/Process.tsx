import type { Dictionary } from "@/lib/getDictionary";
import AnimatedProcess from "@/components/animations/AnimatedProcess";

interface ProcessProps {
  dict: Dictionary["process"];
}

export default function Process({ dict }: ProcessProps) {
  return (
    <section aria-label="Process" className="flex w-full flex-col items-center gap-12">
      {/* Header — server rendered for SEO */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-[14px] font-medium uppercase md:text-base">{dict.eyebrow}</p>
        <h2 className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase md:text-[26px] lg:text-[34px] 2xl:text-[42px]">
          {dict.headline}
        </h2>
        <p className="xs:max-w-[280px] max-w-[230px] sm:max-w-[330px] md:max-w-full">
          {dict.subheadline}
        </p>
      </div>

      {/* Hidden SEO content — all step text is in the DOM regardless of active state */}
      <div className="sr-only">
        {dict.steps.map((step) => (
          <div key={step.step}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      {/* Interactive accordion — client component */}
      <AnimatedProcess steps={dict.steps} />
    </section>
  );
}
