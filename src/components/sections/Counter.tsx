import type { Dictionary } from "@/lib/getDictionary";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import CounterSparkles from "@/components/animations/CounterSparkles";

interface CounterProps {
  dict: Dictionary["counter"];
}

export default function Counter({ dict }: CounterProps) {
  const match = dict.count.match(/^(\d+)(\D*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  return (
    <section
      aria-label="Counter"
      className="flex w-full flex-col items-center justify-center gap-4 text-center md:h-screen md:min-h-[1000px] md:justify-center"
    >
      {/* Sparkles + glow container */}
      <div className="relative flex w-full flex-col items-center gap-4 overflow-hidden py-16">
        {/* Canvas sparkles — fills the relative container */}
        <CounterSparkles />

        {/* Radial glow behind the number */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 60%, rgba(255,255,255,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Counter text — above glow & particles */}
        <div className="relative z-10 xs:max-w-[380px] sm:max-w-[480px] md:max-w-full">
          <h2 className="font-hero text-foreground/60 text-[20px] tracking-[-2px] uppercase md:text-[26px] lg:text-[34px] 2xl:text-[42px]">
            <AnimatedCounter
              target={target}
              prefix="+"
              suffix={suffix}
              className="text-foreground"
            />{" "}
            {dict.label}
          </h2>
        </div>

        <p className="relative z-10 xs:max-w-[230px] max-w-[160px] sm:max-w-full">
          {dict.body}
        </p>
      </div>
    </section>
  );
}
