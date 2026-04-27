import type { Dictionary } from "@/lib/getDictionary";
import AnimatedFaqItem from "@/components/animations/AnimatedFaqItem";

interface FaqsProps {
  dict: Dictionary["faqs"];
}

export default function Faqs({ dict }: FaqsProps) {
  return (
    <section
      aria-label="FAQ"
      className="mx-auto w-full max-w-[1300px] xl:flex xl:flex-col xl:items-center xl:text-center 2xl:max-w-[1650px]"
    >
      <p className="text-accent text-[14px] font-medium uppercase md:text-base">{dict.eyebrow}</p>
      <h2 className="font-hero text-foreground mt-2 text-[20px] tracking-[-2px] uppercase md:text-[26px] lg:text-[34px] 2xl:text-[42px]">
        {dict.headline}
      </h2>
      <p className="mt-3">
        {dict.moreQuestions}{" "}
        <a href="#contact" className="text-accent underline-offset-2 hover:underline">
          {dict.contactLabel}
        </a>
      </p>

      <div className="mt-10 flex w-full flex-col gap-2 xl:max-w-[1000px] 2xl:max-w-[1300px]">
        {dict.items.map((item, i) => (
          <AnimatedFaqItem
            key={i}
            question={item.question}
            answer={item.answer}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
