import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Section eyebrow used across the homepage. Matches the Figma "End" chip:
 * 12px Geist Mono Medium, 0.08em tracking, white-10% bg, 2px white-25%
 * left divider — no rounded corners, padding 6px / 10px.
 */
export default function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`relative inline-flex items-center bg-white/10 px-[10px] py-[6px] text-white ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-white/25" />
      <span className="text-fig-chip">{children}</span>
    </span>
  );
}
