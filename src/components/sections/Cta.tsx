import type { Dictionary } from "@/lib/getDictionary";

interface CtaProps {
  dict: Dictionary["cta"];
}

export default function Cta({ dict }: CtaProps) {
  return (
    <section
      aria-label="Call to action"
      className="relative flex w-full max-w-[1300px] flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-6 py-24 text-center md:px-8 md:py-32 2xl:max-w-[1650px]"
      style={{ backgroundImage: "url('/img/homepage/cta/background.png')" }}
    >
      <p className="text-accent font-medium uppercase">{dict.eyebrow}</p>
      <h2 className="font-hero text-foreground mt-2 text-[20px] tracking-[-2px] uppercase sm:text-[52px] md:text-[40px]">
        {dict.headline}
      </h2>
      <p className="mt-3 max-w-[480px]">{dict.body}</p>
      <a
        href="#contact"
        className="bg-accent text-foreground mt-6 inline-flex items-center gap-3 px-8 py-4 font-sans text-sm font-medium"
      >
        <img
          src="/icons/facetime-icon-white.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
        />
        {dict.buttonLabel}
      </a>
    </section>
  );
}
