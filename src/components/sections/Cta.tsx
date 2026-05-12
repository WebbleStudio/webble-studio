"use client";

import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";
import BookingButton from "@/components/ui/BookingButton";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface CtaProps {
  dict: Dictionary["cta"];
}

/**
 * Full-bleed CTA — atmospheric dark background, eyebrow chip, body copy and
 * a single white pill button at the center.
 */
export default function Cta({ dict }: CtaProps) {
  return (
    <section
      aria-label="Call to action"
      className="relative isolate flex min-h-[520px] w-full flex-col items-center justify-center gap-6 overflow-hidden px-6 py-32 text-center md:min-h-[640px] md:gap-8 md:py-44 2xl:min-h-[720px] 2xl:py-56"
    >
      {/* Atmospheric sky / horizon */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 50% 35%, rgba(140,150,170,0.22) 0%, rgba(40,46,56,0.08) 50%, rgba(2,3,3,0) 75%), linear-gradient(180deg, #0a0d12 0%, #060709 45%, #020303 80%, #000000 100%)",
        }}
      />

      {/* Mountain silhouettes — left ridge */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] w-full"
        viewBox="0 0 1920 480"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cta-mountain-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c1015" />
            <stop offset="100%" stopColor="#070a0e" />
          </linearGradient>
          <linearGradient id="cta-mountain-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04060a" />
            <stop offset="100%" stopColor="#020303" />
          </linearGradient>
        </defs>
        {/* Far ridge */}
        <path
          d="M0,300 L120,220 L240,260 L360,200 L520,250 L680,180 L820,240 L960,200 L1120,260 L1280,210 L1440,250 L1600,200 L1760,240 L1920,220 L1920,480 L0,480 Z"
          fill="url(#cta-mountain-far)"
          opacity="0.85"
        />
        {/* Near ridge */}
        <path
          d="M0,380 L80,330 L180,360 L260,300 L380,340 L500,290 L620,360 L760,310 L900,360 L1040,320 L1180,370 L1340,320 L1480,360 L1640,310 L1800,360 L1920,330 L1920,480 L0,480 Z"
          fill="url(#cta-mountain-near)"
        />
      </svg>

      <div
        aria-hidden="true"
        className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2"
        style={{
          background: "linear-gradient(180deg, rgba(2,3,3,0) 0%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      <RevealGroup
        staggerDelay={0.12}
        amount={0.3}
        className="flex flex-col items-center gap-6 md:gap-8"
      >
        <RevealItem>
          <Eyebrow>{dict.eyebrow}</Eyebrow>
        </RevealItem>
        <RevealItem>
          <p className="text-fig-body text-white max-w-[520px]">{dict.body}</p>
        </RevealItem>
        <RevealItem y={16}>
          <BookingButton
            label={dict.ctaLabel}
            className="text-fig-link bg-white px-6 py-3 text-black transition-colors hover:bg-white/90"
          />
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
