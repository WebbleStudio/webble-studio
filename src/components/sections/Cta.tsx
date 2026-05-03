import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";
import BookingButton from "@/components/ui/BookingButton";

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
      className="relative isolate flex w-full flex-col items-center justify-center gap-6 overflow-hidden px-6 py-28 text-center md:gap-8 md:py-40 2xl:py-52"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(120,130,150,0.18) 0%, rgba(10,10,10,0) 60%), linear-gradient(180deg, #0d1014 0%, #060708 60%, #020303 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2"
        style={{
          background: "linear-gradient(180deg, rgba(2,3,3,0) 0%, rgba(2,3,3,0.85) 100%)",
        }}
      />

      <Eyebrow>{dict.eyebrow}</Eyebrow>

      <p className="text-fig-body text-white max-w-[520px]">{dict.body}</p>

      <BookingButton
        label={dict.ctaLabel}
        className="text-fig-link rounded-[8px] bg-white px-6 py-3 text-black transition-colors hover:bg-white/90"
      />
    </section>
  );
}
