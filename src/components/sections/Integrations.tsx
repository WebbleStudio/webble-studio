import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";

interface IntegrationsProps {
  dict: Dictionary["integrations"];
}

/**
 * Integration section — a 6×2 grid of soft glass tiles representing the tools
 * we plug into, with the section heading anchored below.
 */
export default function Integrations({ dict }: IntegrationsProps) {
  return (
    <section
      aria-label="Integrations"
      className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <div className="mx-auto grid max-w-[640px] grid-cols-6 gap-3 md:max-w-[720px] md:gap-4">
        {dict.tools.map((tool) => (
          <div
            key={tool.name}
            title={tool.name}
            className="bg-shark relative flex aspect-square items-center justify-center overflow-hidden rounded-[8px] border border-white/10"
          >
            <span className="text-fig-eyebrow text-silver text-[9px] md:text-[10px]">
              {tool.name}
            </span>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)",
              }}
            />
          </div>
        ))}
      </div>

      <header className="mx-auto mt-10 flex max-w-[600px] flex-col items-center gap-4 text-center md:mt-14">
        <Eyebrow>{dict.eyebrow}</Eyebrow>
        <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
        <p className="text-fig-body text-silver">{dict.body}</p>
      </header>
    </section>
  );
}
