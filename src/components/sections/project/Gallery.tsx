import Image from "next/image";
import AnimatedSectionReveal from "@/components/animations/AnimatedSectionReveal";
import AnimatedStaggerChildren from "@/components/animations/AnimatedStaggerChildren";
import { altFromImagePath } from "@/lib/altFromImage";

interface GalleryProps {
  layout: "full" | "grid" | "bento";
  className?: string;
  images?: string[];
  alt?: string;
}

function Placeholder({ className }: { className: string }) {
  return <div className={`bg-foreground/8 border border-foreground/10 ${className}`} />;
}

function GalleryImage({
  src,
  className,
  alt,
  sizes,
}: {
  src: string;
  className: string;
  alt: string;
  sizes: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[4px] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={90}
        className="scale-[1.01] object-cover transition-transform duration-700 ease-out hover:scale-105"
      />
    </div>
  );
}

function Cell({
  src,
  className,
  alt,
  sizes,
}: {
  src?: string;
  className: string;
  alt: string;
  sizes: string;
}) {
  return src ? (
    <GalleryImage src={src} className={className} alt={alt} sizes={sizes} />
  ) : (
    <Placeholder className={className} />
  );
}

function buildAlt(alt: string | undefined, src: string | undefined, index: number): string {
  if (!src) return "";
  if (alt) return `${alt} — immagine ${index + 1}`;
  return altFromImagePath(src);
}

const SIZES_FULL = "(max-width: 768px) 100vw, (max-width: 1300px) 90vw, 1300px";
const SIZES_HALF = "(max-width: 640px) 100vw, (max-width: 1300px) 45vw, 620px";

export default function Gallery({ layout, className = "", images, alt }: GalleryProps) {
  if (layout === "full") {
    return (
      <AnimatedSectionReveal
        className={`mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px] ${className}`}
      >
        <Cell
          src={images?.[0]}
          alt={buildAlt(alt, images?.[0], 0)}
          sizes={SIZES_FULL}
          className="h-[240px] w-full sm:h-[320px] md:h-[440px] xl:h-[540px]"
        />
      </AnimatedSectionReveal>
    );
  }

  if (layout === "bento") {
    return (
      <div className={`mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px] ${className}`}>
        <AnimatedStaggerChildren
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4"
          stagger={0.12}
        >
          <Cell
            src={images?.[0]}
            alt={buildAlt(alt, images?.[0], 0)}
            sizes={SIZES_HALF}
            className="h-[200px] sm:h-[260px] md:h-[340px] xl:h-[500px] 2xl:h-[660px]"
          />
          <Cell
            src={images?.[1]}
            alt={buildAlt(alt, images?.[1], 1)}
            sizes={SIZES_HALF}
            className="h-[200px] sm:h-[260px] md:h-[340px] xl:h-[500px] 2xl:h-[660px]"
          />
        </AnimatedStaggerChildren>
        <AnimatedSectionReveal className="mt-3 md:mt-4">
          <Cell
            src={images?.[2]}
            alt={buildAlt(alt, images?.[2], 2)}
            sizes={SIZES_FULL}
            className="h-[240px] w-full sm:h-[320px] md:h-[440px] xl:h-[480px]"
          />
        </AnimatedSectionReveal>
      </div>
    );
  }

  // layout === "grid"
  return (
    <div className={`mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px] ${className}`}>
      <AnimatedStaggerChildren
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4"
        stagger={0.12}
      >
        <Cell
          src={images?.[0]}
          alt={buildAlt(alt, images?.[0], 0)}
          sizes={SIZES_HALF}
          className="h-[200px] sm:h-[260px] md:h-[340px] xl:h-[500px] 2xl:h-[660px]"
        />
        <Cell
          src={images?.[1]}
          alt={buildAlt(alt, images?.[1], 1)}
          sizes={SIZES_HALF}
          className="h-[200px] sm:h-[260px] md:h-[340px] xl:h-[500px] 2xl:h-[660px]"
        />
      </AnimatedStaggerChildren>
    </div>
  );
}
