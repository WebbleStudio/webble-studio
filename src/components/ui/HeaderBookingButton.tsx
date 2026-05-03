"use client";

import { useBooking } from "@/context/BookingContext";

interface HeaderBookingButtonProps {
  label: string;
}

export default function HeaderBookingButton({ label }: HeaderBookingButtonProps) {
  const { openBooking } = useBooking();

  return (
    <button
      type="button"
      onClick={openBooking}
      className="inline-flex items-center border border-foreground/20 px-4 py-2 font-sans text-[14px] font-medium text-foreground transition-colors hover:bg-accent hover:border-accent hover:text-background 2xl:text-base"
    >
      {label}
    </button>
  );
}
