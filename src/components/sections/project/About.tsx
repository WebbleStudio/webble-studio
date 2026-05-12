import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface AboutProps {
  label: string;
  body: string;
}

export default function About({ label, body }: AboutProps) {
  return (
    <section aria-label="About the project" className="bg-background py-10 md:py-14">
      <div className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]">
        <RevealGroup>
          <div className="border-foreground/10 flex flex-col gap-4 border-t py-10 md:flex-row md:items-start md:gap-0 md:py-12">
            <RevealItem>
              <p className="text-fig-eyebrow text-foreground/40 shrink-0 md:w-[40%]">
                {label}
              </p>
            </RevealItem>
            <RevealItem>
              <p className="text-fig-body text-foreground md:w-[60%]">
                {body}
              </p>
            </RevealItem>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
