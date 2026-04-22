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
        <p className="font-medium uppercase">{dict.eyebrow}</p>
        <h2 className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase sm:text-[52px] md:text-[40px]">
          {dict.headline}
        </h2>
        <p className="max-w-[400px]">{dict.subheadline}</p>
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
