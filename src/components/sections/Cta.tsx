import type { Dictionary } from "@/lib/getDictionary";
import BookingButton from "@/components/ui/BookingButton";

interface CtaProps {
  dict: Dictionary["cta"];
}

export default function Cta({ dict }: CtaProps) {
  return (
    <section
      aria-label="Call to action"
      className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden bg-cover bg-center bg-no-repeat px-6 py-24 text-center md:gap-8 md:h-screen md:px-8 md:py-32 2xl:gap-10"
      style={{ backgroundImage: "url('/img/homepage/cta/background.png')" }}
    >
      <p className="text-accent text-[14px] font-medium uppercase md:text-base">{dict.eyebrow}</p>
      <h2 className="font-hero text-foreground text-[20px] tracking-[-2px] uppercase md:text-[26px] lg:text-[34px] 2xl:text-[42px]">
        {dict.headline}
      </h2>
      <p className="xs:max-w-[250px] max-w-[200px] md:max-w-full">{dict.body}</p>
      <BookingButton
        label={dict.buttonLabel}
        iconSrc="/icons/facetime-icon-white.svg"
        iconSize={16}
        className="bg-accent text-foreground inline-flex items-center gap-3 px-8 py-4 font-sans text-sm font-medium"
      />
    </section>
  );
}
