import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import AnimatedOurWork from "@/components/animations/AnimatedOurWork";

interface OurWorkProps {
  dict: Dictionary["ourWork"];
}

const PLACEHOLDER = "/img/homepage/placeholder.png";

export default function OurWork({ dict }: OurWorkProps) {
  return (
    <section aria-label="Our work" className="w-full">
      {/* Mobile — stacked layout (unchanged) */}
      <div className="md:hidden">
        <h2 className="font-hero text-foreground/60 text-[20px] tracking-[-2px] uppercase">
          {dict.headline}
        </h2>

        <div className="mt-8 flex flex-col gap-16">
          {dict.projects.map((project, i) => (
            <article key={i} className="flex flex-col gap-5">
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={PLACEHOLDER}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1300px"
                />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase">
                  {project.name}
                </h3>
                <p className="max-w-[560px]">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Desktop — split sticky text + scroll-driven active project */}
      <div className="hidden md:block">
        <AnimatedOurWork
          eyebrow={dict.headline}
          projects={dict.projects}
          placeholder={PLACEHOLDER}
        />
      </div>
    </section>
  );
}
