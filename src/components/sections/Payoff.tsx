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
        <p className="text-[14px] font-medium uppercase md:text-base">{dict.eyebrow}</p>
        <AnimatedPayoffHeadline
          lines={headlineLines}
          className="font-hero text-foreground xs:max-w-[380px] max-w-[270px] text-[20px] tracking-[-2px] uppercase sm:max-w-[480px] md:max-w-none md:text-[26px] lg:text-[34px] 2xl:text-[42px]"
        />
        <p className="xs:max-w-[250px] mx-auto max-w-[200px] sm:max-w-[330px] md:max-w-full">
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
