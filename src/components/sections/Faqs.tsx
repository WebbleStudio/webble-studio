"use client";

import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";
import HomeFaqItem from "@/components/animations/HomeFaqItem";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface FaqsProps {
  dict: Dictionary["faqs"];
}

/**
 * FAQs — split layout:
 *  - left column (md+): H2 / eyebrow
 *  - right column: stack of accordion items (HomeFaqItem)
 *  - mobile: stacked single column
 */
export default function Faqs({ dict }: FaqsProps) {
  return (
    <section
      aria-label="FAQ"
      className="mx-auto w-full max-w-[1140px] px-6 md:px-8 2xl:max-w-[1340px]"
    >
      <div className="grid gap-10 md:grid-cols-[300px_1fr] md:items-start md:gap-12 lg:grid-cols-[360px_1fr] lg:gap-16 2xl:grid-cols-[420px_1fr]">
        <RevealGroup
          staggerDelay={0.1}
          className="flex flex-col gap-4 md:sticky md:top-32 md:self-start"
        >
          <RevealItem>
            <Eyebrow>{dict.eyebrow}</Eyebrow>
          </RevealItem>
          <RevealItem>
            <h2 className="text-fig-h2 whitespace-pre-line text-white">
              {dict.headline}
            </h2>
          </RevealItem>
        </RevealGroup>

        <RevealGroup
          staggerDelay={0.07}
          amount={0.1}
          className="flex flex-col gap-3"
        >
          {dict.items.map((item, i) => (
            <RevealItem key={item.question} y={16}>
              <HomeFaqItem
                question={item.question}
                answer={item.answer}
                defaultOpen={i === 0}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
