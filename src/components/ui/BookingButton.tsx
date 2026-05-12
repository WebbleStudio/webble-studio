"use client";

import { useBooking } from "@/context/BookingContext";

interface BookingButtonProps {
  label: string;
  className?: string;
  iconSrc?: string;
  iconSize?: number;
  iconPosition?: "leading" | "trailing";
}

export default function BookingButton({
  label,
  className = "",
  iconSrc,
  iconSize = 15,
  iconPosition = "leading",
}: BookingButtonProps) {
  const { openBooking } = useBooking();
  const icon = iconSrc ? (
    <img src={iconSrc} alt="" aria-hidden="true" width={iconSize} height={iconSize} />
  ) : null;

  return (
    <button type="button" onClick={openBooking} className={className}>
      {iconPosition === "leading" && icon}
      {label}
      {iconPosition === "trailing" && icon}
    </button>
  );
}
