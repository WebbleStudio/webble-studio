"use client";

import { useBooking } from "@/context/BookingContext";

interface BookingButtonProps {
  label: string;
  className?: string;
  iconSrc?: string;
  iconSize?: number;
}

export default function BookingButton({
  label,
  className = "",
  iconSrc,
  iconSize = 15,
}: BookingButtonProps) {
  const { openBooking } = useBooking();

  return (
    <button type="button" onClick={openBooking} className={className}>
      {iconSrc && (
        <img src={iconSrc} alt="" aria-hidden="true" width={iconSize} height={iconSize} />
      )}
      {label}
    </button>
  );
}
