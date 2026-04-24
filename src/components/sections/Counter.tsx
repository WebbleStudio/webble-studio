import type { Dictionary } from "@/lib/getDictionary";

interface CounterProps {
  dict: Dictionary["counter"];
}

export default function Counter({ dict }: CounterProps) {
  return (
    <section
      aria-label="Counter"
      className="flex w-full flex-col items-center justify-center gap-4 text-center"
    >
      <h2 className="font-hero text-foreground/60 text-[20px] tracking-[-2px] uppercase sm:text-[52px] md:text-[40px]">
        <span className="text-foreground">{dict.count}</span> {dict.label}
      </h2>
      <p className="xs:max-w-[230px] max-w-[160px]">{dict.body}</p>
    </section>
  );
}
