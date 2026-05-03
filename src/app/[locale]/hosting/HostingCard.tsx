"use client";

import { useState } from "react";

const MONTHLY_PRICE = "€20";
const YEARLY_PRICE = "€199,90";

const MONTHLY_LINK = "https://buy.stripe.com/bJeaEXdz3gWI4HU1uMfYY02";
const YEARLY_LINK = "https://buy.stripe.com/8x2cN58eJcGs1vIb5mfYY03";

export interface HostingCardTranslations {
  monthly: string;
  yearly: string;
  monthlyBadge: string;
  yearlyBadge: string;
  perMonth: string;
  perYear: string;
  monthlyDesc: string;
  yearlyDesc: string;
  featuresLabel: string;
  features: readonly string[];
  cta: string;
  questions: string;
  contact: string;
}

function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M1.5 6.5L5 10L11.5 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HostingCard({ translations: tr }: { translations: HostingCardTranslations }) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8">
      <style>{`
        @keyframes priceIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .price-in {
          animation: priceIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      {/* ── Billing switch ──────────────────────────────────────────── */}
      <div className="flex items-center border border-foreground/20 bg-[#0d0d0d] p-1">
        <button
          type="button"
          onClick={() => setIsYearly(false)}
          className={`relative px-6 py-2.5 font-sans text-sm font-medium transition-colors duration-200 ${
            !isYearly ? "bg-accent text-foreground" : "text-foreground/40 hover:text-foreground/70"
          }`}
        >
          {tr.monthly}
        </button>
        <button
          type="button"
          onClick={() => setIsYearly(true)}
          className={`relative flex items-center gap-2 px-6 py-2.5 font-sans text-sm font-medium transition-colors duration-200 ${
            isYearly ? "bg-accent text-foreground" : "text-foreground/40 hover:text-foreground/70"
          }`}
        >
          {tr.yearly}
          <span
            className={`font-sans text-[10px] font-semibold uppercase tracking-wide transition-colors duration-200 ${
              isYearly ? "text-foreground" : "text-accent"
            }`}
          >
            −17%
          </span>
        </button>
      </div>

      {/* ── Payment card ────────────────────────────────────────────── */}
      <div className="w-full max-w-[440px] lg:max-w-[360px] xl:max-w-[440px] border border-foreground/20 bg-[#0d0d0d]">
        {/* Card header — animated block remounts on switch for smooth fade+slide */}
        <div className="border-b border-foreground/20 px-8 py-8">
          <div key={isYearly ? "yearly" : "monthly"} className="price-in">
            <span className="inline-flex items-center bg-accent px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-wide text-foreground">
              {isYearly ? tr.yearlyBadge : tr.monthlyBadge}
            </span>

            <div className="mt-5 flex items-end gap-2">
              <span className="font-sans text-[38px] sm:text-[52px] font-semibold leading-none tracking-tight text-foreground">
                {isYearly ? YEARLY_PRICE : MONTHLY_PRICE}
              </span>
              <span className="mb-1 font-sans text-sm text-foreground/50">
                {isYearly ? tr.perYear : tr.perMonth}
              </span>
            </div>

            <p className="mt-2 font-sans text-[13px] text-foreground/50">
              {isYearly ? tr.yearlyDesc : tr.monthlyDesc}
            </p>
          </div>
        </div>

        {/* Features list */}
        <div className="px-8 py-7">
          <p className="mb-4 font-sans text-[11px] font-medium uppercase tracking-widest text-foreground/40">
            {tr.featuresLabel}
          </p>
          <ul className="flex flex-col gap-3">
            {tr.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 font-sans text-sm text-foreground/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-accent text-accent">
                  <IconCheck />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="border-t border-foreground/20 px-8 py-6">
          <a
            href={isYearly ? YEARLY_LINK : MONTHLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center bg-accent px-6 py-4 font-sans text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            {tr.cta}
          </a>
          <p className="mt-4 text-center font-sans text-[12px] text-foreground/30">
            {tr.questions}{" "}
            <a
              href="mailto:webblestudio.com@gmail.com"
              className="text-foreground/50 underline underline-offset-2 transition-colors hover:text-foreground"
            >
              {tr.contact}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
