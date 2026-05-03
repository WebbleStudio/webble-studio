"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";
import BookingButton from "@/components/ui/BookingButton";

interface PricingProps {
  dict: Dictionary["pricing"];
}

/**
 * Pricing — eyebrow, headline, monthly/yearly pill toggle, then 3 tier cards.
 * Middle card is the "popular" one (slightly elevated bg + white CTA).
 */
export default function Pricing({ dict }: PricingProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section
      aria-label="Pricing"
      className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <header className="mx-auto flex max-w-[600px] flex-col items-center gap-4 text-center">
        <Eyebrow>{dict.eyebrow}</Eyebrow>
        <h2 className="text-fig-h2 text-white">{dict.headline}</h2>

        <div className="bg-shark mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`text-fig-link rounded-full px-5 py-2 transition-colors ${
              billing === "monthly" ? "bg-white text-black" : "text-silver hover:text-white"
            }`}
          >
            {dict.monthlyLabel}
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`text-fig-link flex items-center gap-2 rounded-full px-5 py-2 transition-colors ${
              billing === "yearly" ? "bg-white text-black" : "text-silver hover:text-white"
            }`}
          >
            {dict.yearlyLabel}
            <span
              className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${
                billing === "yearly" ? "bg-fire text-white" : "bg-white/10 text-silver"
              }`}
            >
              {dict.yearlyDiscount}
            </span>
          </button>
        </div>
      </header>

      <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
        {dict.plans.map((plan) => {
          const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const isPopular = !!plan.popular;
          return (
            <article
              key={plan.name}
              className={`flex flex-col gap-6 rounded-[8px] border p-6 md:p-7 2xl:p-8 ${
                isPopular
                  ? "border-white/15 bg-white/[0.07]"
                  : "border-white/10 bg-shark"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-fig-eyebrow flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.04] text-silver">
                  {plan.name.slice(0, 1)}
                </div>
                {isPopular && (
                  <span className="text-fig-chip rounded-[4px] bg-white/10 px-2 py-1 text-white">
                    {dict.popularLabel}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-fig-h4 text-white">{plan.name}</h3>
                <p className="text-fig-body text-silver">{plan.description}</p>
              </div>

              <div className="flex items-end gap-1">
                <p className="text-fig-h2 text-white">
                  {dict.currency}
                  {price}
                </p>
                <span className="text-fig-body text-silver mb-2">{dict.perMonth}</span>
              </div>

              <BookingButton
                label={plan.ctaLabel}
                className={`text-fig-link rounded-[8px] px-4 py-3 transition-colors ${
                  isPopular
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/10 bg-white/[0.04] text-white hover:border-white/30"
                }`}
              />

              <p className="text-fig-body text-silver inline-flex items-center justify-center gap-2 text-[12px]">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none">
                  <path
                    d="M2.5 6.5L4.5 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {dict.guaranteeLabel}
              </p>

              <ul className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-fig-body text-white flex items-start gap-2"
                  >
                    <svg
                      className="text-silver mt-1 shrink-0"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 6.5L4.5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
