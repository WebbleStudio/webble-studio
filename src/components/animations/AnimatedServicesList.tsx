"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface AnimatedServicesListProps {
  items: { label: string }[];
  image: string;
}

export default function AnimatedServicesList({
  items,
  image,
}: AnimatedServicesListProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [imgTop, setImgTop] = useState<number | null>(null);

  const computeImgTop = (idx: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return null;
    const lis = wrapper.querySelectorAll<HTMLLIElement>("li");
    const li = lis[idx];
    if (!li) return null;
    return li.offsetTop + li.offsetHeight / 2;
  };

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const lis = wrapper.querySelectorAll<HTMLLIElement>("li");
      if (lis.length === 0) return;

      const vh = window.innerHeight || document.documentElement.clientHeight;
      const rect = wrapper.getBoundingClientRect();

      // Map the section's full viewport travel (from entering at the bottom
      // to exiting at the top) evenly across all items. Each item gets
      // exactly 1/N of the total travel distance — maximising dwell time.
      const travel = rect.height + vh;
      const scrolled = vh - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / travel));
      const idx = Math.min(items.length - 1, Math.floor(progress * items.length));

      setActive(idx);
      const li = lis[idx];
      setImgTop(li.offsetTop + li.offsetHeight / 2);
    };

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <ol className="flex flex-col">
        {items.map((item, i) => {
          const isActive = i === active;
          const litColor = isActive ? "text-foreground" : "text-foreground/60";
          return (
            <li key={i} className="flex items-start gap-3 py-4 md:gap-6 md:py-5">
              <span
                className={`pt-1 font-sans text-xs transition-colors duration-500 md:pt-3 md:text-sm ${litColor}`}
              >
                ({String(i + 1).padStart(2, "0")})
              </span>
              <h3
                className={`font-hero flex-1 text-[20px] font-semibold tracking-[-2px] uppercase transition-colors duration-500 xs:text-[28px] sm:text-[52px] md:text-[40px] ${litColor}`}
                style={{
                  lineHeight: 1.35,
                  marginTop: "-0.175em",
                  marginBottom: "-0.175em",
                }}
              >
                {item.label}
              </h3>
            </li>
          );
        })}
      </ol>

      {imgTop !== null && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 overflow-hidden"
          style={{
            top: `${imgTop}px`,
            transform: "translateY(-50%)",
            transition: "top 500ms cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "top",
          }}
        >
          <img
            src={image}
            alt=""
            className="h-16 w-[110px] object-cover xs:h-20 xs:w-[140px] sm:h-24 sm:w-[165px] md:h-28 md:w-[190px]"
          />
        </div>
      )}
    </div>
  );
}
