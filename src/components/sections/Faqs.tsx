import type { Dictionary } from "@/lib/getDictionary";
import AnimatedFaqItem from "@/components/animations/AnimatedFaqItem";

interface FaqsProps {
  dict: Dictionary["faqs"];
}

export default function Faqs({ dict }: FaqsProps) {
  return (
    <section aria-label="FAQ" className="mx-auto w-full max-w-[1300px] 2xl:max-w-[1650px]">
      <p className="text-accent text-[14px] font-medium uppercase">{dict.eyebrow}</p>
      <h2 className="font-hero text-foreground mt-2 text-[20px] tracking-[-2px] uppercase sm:text-[52px] md:text-[40px]">
        {dict.headline}
      </h2>
      <p className="mt-3">
        {dict.moreQuestions}{" "}
        <a href="#contact" className="text-accent underline-offset-2 hover:underline">
          {dict.contactLabel}
        </a>
      </p>

      <div className="mt-10 flex flex-col gap-2">
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
