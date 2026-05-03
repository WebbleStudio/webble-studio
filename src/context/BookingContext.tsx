"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface BookingContextValue {
  isOpen: boolean;
  locale: string;
  openBooking: () => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue>({
  isOpen: false,
  locale: "it",
  openBooking: () => {},
  closeBooking: () => {},
});

export function BookingProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openBooking = useCallback(() => setIsOpen(true), []);
  const closeBooking = useCallback(() => setIsOpen(false), []);

  return (
    <BookingContext.Provider value={{ isOpen, locale, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
