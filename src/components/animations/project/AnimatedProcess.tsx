"use client";

import { type Locale } from "@/lib/locales";
import type { ProjectProcessStep } from "@/data/projects";
import AnimatedStaggerChildren from "@/components/animations/AnimatedStaggerChildren";

interface AnimatedProcessProps {
  steps: ProjectProcessStep[];
  locale: Locale;
}

export default function AnimatedProcess({ steps, locale }: AnimatedProcessProps) {
  return (
    <AnimatedStaggerChildren
      className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
      stagger={0.1}
    >
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex min-h-[160px] flex-col justify-between border border-foreground/10 bg-[#111] p-4 md:min-h-[200px] md:p-5"
        >
          <h3 className="text-fig-h5 text-foreground">
            {step.title[locale]}
          </h3>
          <p className="text-fig-eyebrow text-foreground/40 mt-auto">
            {step.items.map((item) => item[locale]).join(" · ")}
          </p>
        </div>
      ))}
    </AnimatedStaggerChildren>
  );
}
