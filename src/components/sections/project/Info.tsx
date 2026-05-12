import Image from "next/image";
import AnimatedStaggerChildren from "@/components/animations/AnimatedStaggerChildren";

interface InfoItem {
  label: string;
  value: string;
  icon?: string;
}

interface InfoProps {
  items: InfoItem[];
}

export default function Info({ items }: InfoProps) {
  return (
    <section aria-label="Project Info" className="bg-background px-6 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1300px] 2xl:max-w-[1650px]">
        <AnimatedStaggerChildren
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          stagger={0.08}
        >
          {items.map((item) => (
            <div
              key={item.label}
              className="relative flex min-h-[130px] flex-col justify-end border border-foreground/10 p-4 md:min-h-[150px] md:p-5"
            >
              {item.icon && (
                <Image
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                  width={20}
                  height={20}
                  className="absolute top-4 right-4 h-4 w-4 opacity-40 md:top-5 md:right-5 md:h-5 md:w-5"
                />
              )}
              <p className="text-fig-eyebrow text-foreground/40">
                {item.label}
              </p>
              <p className="text-fig-h5 text-foreground mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </AnimatedStaggerChildren>
      </div>
    </section>
  );
}
