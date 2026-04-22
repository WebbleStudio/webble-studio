import type { Dictionary } from "@/lib/getDictionary";
import AnimatedPayoffHeadline from "@/components/animations/AnimatedPayoffHeadline";

interface PayoffProps {
  dict: Dictionary["payoff"];
}

export default function Payoff({ dict }: PayoffProps) {
  const headlineLines = dict.headline.split("\n");
  const bodyLines = dict.body.split("\n");

  return (
    <section
      aria-label="Payoff"
      className="flex h-auto flex-col items-center justify-center text-center md:h-screen"
    >
      <div className="flex flex-col gap-6">
        <p className="font-medium uppercase">{dict.eyebrow}</p>
        <AnimatedPayoffHeadline
          lines={headlineLines}
          className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase sm:text-[52px] md:text-[40px]"
        />
        <p className="mx-auto max-w-[200px]">
          {bodyLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < bodyLines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
