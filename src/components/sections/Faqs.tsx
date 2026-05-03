import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";
import HomeFaqItem from "@/components/animations/HomeFaqItem";
import FounderCard from "@/components/ui/FounderCard";

interface FaqsProps {
  dict: Dictionary["faqs"];
}

/**
 * FAQs — split layout:
 *  - left column (md+): H2 + founder card pinned at the bottom
 *  - right column: stack of accordion items (HomeFaqItem)
 *  - mobile: stacked single column
 */
export default function Faqs({ dict }: FaqsProps) {
  return (
    <section
      aria-label="FAQ"
      className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <div className="grid gap-10 md:grid-cols-2 md:items-stretch md:gap-12 lg:gap-16">
        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <Eyebrow>{dict.eyebrow}</Eyebrow>
            <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
          </div>

          <div className="hidden md:block">
            <FounderCard data={dict.founder} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {dict.items.map((item, i) => (
            <HomeFaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              defaultOpen={i === 0}
            />
          ))}

          <div className="mt-4 md:hidden">
            <FounderCard data={dict.founder} />
          </div>
        </div>
      </div>
    </section>
  );
}
