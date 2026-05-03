"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useBooking } from "@/context/BookingContext";
import gsap from "gsap";

interface AnimatedBookingModalProps {
  children: ReactNode;
}

export default function AnimatedBookingModal({ children }: AnimatedBookingModalProps) {
  const { isOpen, closeBooking } = useBooking();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const is2xl = window.matchMedia("(min-width: 1536px)").matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    // Mobile & 2xl → slide from bottom | Desktop md–2xl → slide from right
    const slideFromBottom = !isDesktop || is2xl;

    if (isOpen) {
      gsap.set(panel, { display: "flex" });
      gsap.set(overlay, { display: "block" });
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });

      if (slideFromBottom) {
        gsap.fromTo(
          panel,
          { x: "0%", y: "100%" },
          { x: "0%", y: "0%", duration: 0.5, ease: "power3.out", overwrite: "auto" }
        );
      } else {
        gsap.fromTo(
          panel,
          { x: "100%", y: "0%" },
          { x: "0%", y: "0%", duration: 0.45, ease: "power3.out", overwrite: "auto" }
        );
      }

      document.body.style.overflow = "hidden";
    } else {
      if (slideFromBottom) {
        gsap.to(panel, { x: "0%", y: "100%", duration: 0.4, ease: "power3.in", overwrite: "auto" });
      } else {
        gsap.to(panel, { x: "100%", y: "0%", duration: 0.35, ease: "power3.in", overwrite: "auto" });
      }

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        delay: 0.1,
        ease: "power2.in",
        overwrite: "auto",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          gsap.set(panel, { display: "none" });
          document.body.style.overflow = "";
        },
      });
    }
  }, [isOpen]);

  // Reset transform on breakpoint change while open
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mq2xl = window.matchMedia("(min-width: 1536px)");
    const onBreakpoint = () => {
      if (!isOpen) return;
      gsap.set(panel, { x: "0%", y: "0%" });
    };
    mqMd.addEventListener("change", onBreakpoint);
    mq2xl.addEventListener("change", onBreakpoint);
    return () => {
      mqMd.removeEventListener("change", onBreakpoint);
      mq2xl.removeEventListener("change", onBreakpoint);
    };
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    return () => {
      if (overlay) gsap.killTweensOf(overlay);
      if (panel) gsap.killTweensOf(panel);
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBooking();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeBooking]);

  return (
    <>
      {/* Backdrop — visible on md+ */}
      <div
        ref={overlayRef}
        style={{ display: "none", opacity: 0 }}
        className="fixed inset-0 z-[110] hidden md:block bg-black/50"
        onClick={closeBooking}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{ display: "none" }}
        className={[
          "fixed z-[111] bg-[#121212] flex flex-col",
          // Mobile: fullscreen
          "inset-0 overflow-y-auto",
          // Desktop md–2xl: floating panel from right
          "md:inset-auto md:top-8 md:right-8 md:bottom-8 md:w-[520px]",
          "md:border md:border-foreground/15 md:shadow-2xl md:overflow-hidden",
          // 2xl: centered bar from bottom (no transform — GSAP owns transform)
          "2xl:left-0 2xl:right-0 2xl:top-auto 2xl:mx-auto",
          "2xl:bottom-8 2xl:w-[calc(100%-4rem)] 2xl:max-w-[1300px] 2xl:h-[44vh]",
          "2xl:rounded-[14px] 2xl:shadow-[0_-20px_60px_rgba(0,0,0,0.2)]",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Prenota una call"
      >
        {children}
      </div>
    </>
  );
}
