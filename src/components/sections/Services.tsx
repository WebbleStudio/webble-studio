import type { Dictionary } from "@/lib/getDictionary";
import AnimatedServicesList from "@/components/animations/AnimatedServicesList";

interface ServicesProps {
  dict: Dictionary["homeServices"];
}

/**
 * Home "services" list. The section is a thin server wrapper around
 * AnimatedServicesList — the scroll-driven "lit item" animation and the
 * sliding preview image live in the client component.
 */
export default function Services({ dict }: ServicesProps) {
  return (
    <section aria-label="Services" className="w-full">
      <AnimatedServicesList items={dict.items} image={dict.image} />
    </section>
  );
}
