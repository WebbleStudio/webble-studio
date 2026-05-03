import Image from "next/image";
import type { FounderCard as FounderCardData } from "@/lib/getDictionary";
import BookingButton from "@/components/ui/BookingButton";

interface FounderCardProps {
  data: FounderCardData;
  className?: string;
}

/**
 * "Talk with X" card pictured in the hero and FAQ.
 * Matches the Figma spec: 300×136 card with 95×120 avatar, 16px gap, white CTA
 * and 12px rounded corners on the wrapper / 6px on the avatar.
 */
export default function FounderCard({ data, className = "" }: FounderCardProps) {
  return (
    <div
      className={`flex w-[300px] items-center gap-4 rounded-[12px] border border-white/10 bg-shark p-2 backdrop-blur-[2px] ${className}`}
    >
      <div className="relative h-[120px] w-[95px] shrink-0 overflow-hidden rounded-[6px] border border-white/10 bg-white/5">
        <Image
          src={data.image}
          alt={data.name}
          fill
          sizes="95px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex h-[120px] min-w-0 flex-1 flex-col justify-between py-2">
        <div className="flex flex-col gap-1.5">
          <p className="text-fig-h5 text-white">{data.name}</p>
          <p className="text-fig-eyebrow text-silver">{data.role}</p>
        </div>

        <BookingButton
          label={data.ctaLabel}
          iconSrc="/icons/diagonal-arrow.svg"
          iconSize={12}
          iconPosition="trailing"
          className="text-fig-link inline-flex h-9 w-full items-center justify-center gap-2.5 rounded-[8px] border border-white/10 bg-white px-4 text-black transition-colors hover:bg-white/90"
        />
      </div>
    </div>
  );
}
