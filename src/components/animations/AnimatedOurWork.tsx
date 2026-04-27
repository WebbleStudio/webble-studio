"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Project {
  name: string;
  description: string;
}

interface AnimatedOurWorkProps {
  eyebrow: string;
  projects: Project[];
  placeholder: string;
}

/**
 * Desktop split layout: sticky left column (eyebrow + active project copy)
 * and a vertical stack of project images on the right.
 *
 * Active project detection: on every scroll frame we compare the vertical
 * center of the sticky title block (left) against the vertical center of
 * each project image (right). The image whose center is closest to the
 * title center becomes active — so the title text always reflects the image
 * that is visually aligned with it.
 */
export default function AnimatedOurWork({
  eyebrow,
  projects,
  placeholder,
}: AnimatedOurWorkProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let rafId: number | null = null;
    let lastActive = 0;

    const update = () => {
      rafId = null;
      const titleEl = titleRef.current;
      if (!titleEl) return;

      const titleRect = titleEl.getBoundingClientRect();
      const titleCenterY = titleRect.top + titleRect.height / 2;

      let closest = 0;
      let closestDist = Infinity;

      articleRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const imageCenterY = rect.top + rect.height / 2;
        const dist = Math.abs(imageCenterY - titleCenterY);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      if (closest !== lastActive) {
        lastActive = closest;
        setActiveIndex(closest);
      }
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
  }, [projects.length]);

  const active = projects[activeIndex] ?? projects[0];

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-5">
        <div className="sticky top-1/2 -translate-y-1/2">
          {/*
           * Eyebrow is positioned absolutely above the title so it does NOT
           * push the title down in the natural flow. This keeps the title's
           * top edge aligned with the first image in the right column.
           * Being a child of the `sticky` parent, the eyebrow follows the
           * title as it sticks to viewport center.
           */}
          <p className="text-foreground/60 absolute bottom-full mb-6 text-[14px] font-medium uppercase md:text-base">
            {eyebrow}
          </p>

          <div
            ref={titleRef}
            key={activeIndex}
            className="animate-our-work-fade flex flex-col gap-4"
            aria-live="polite"
          >
            <h2 className="font-hero text-foreground text-[26px] tracking-[-2px] uppercase lg:text-[34px] 2xl:text-[42px]">
              {active.name}
            </h2>
            <p className="max-w-[420px]">{active.description}</p>
          </div>
        </div>
      </div>

      <div className="col-span-7 flex flex-col gap-12">
        {projects.map((project, i) => (
          <article
            key={i}
            ref={(el) => {
              articleRefs.current[i] = el;
            }}
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={placeholder}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </article>
        ))}
      </div>
    </div>
  );
}
