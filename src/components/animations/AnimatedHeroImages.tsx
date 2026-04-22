"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Three independent transform layers per image — no conflicts:
 *
 *   <div mouseRef>      ← mouse parallax: x/y via gsap.quickTo (depth factor)
 *     <div parallaxRef> ← scroll parallax: y via ScrollTrigger scrub
 *       <div floatRef>  ← float loop: y via gsap yoyo repeat
 *         <img />
 *       </div>
 *     </div>
 *   </div>
 *
 * Mouse parallax uses gsap.quickTo for smooth lag-based cursor following.
 * Each image has a unique `mouseDepth` factor: higher = appears closer to viewer.
 * On mouseleave, all images spring back to their resting position.
 *
 * Rendered aria-hidden, md+ only. SEO content in server-rendered Hero.tsx.
 */

interface ImageConfig {
  width: number;
  height: number;
  top: string;
  left: string;
  floatAmount: number;
  floatDuration: number;
  parallaxAmount: number;
  mouseDepth: number;
}

const IMAGES: ImageConfig[] = [
  { width: 220, height: 165, top: "5%",  left: "2%",  floatAmount: 12, floatDuration: 6.2, parallaxAmount: 130, mouseDepth: 28 },
  { width: 148, height: 130, top: "26%", left: "14%", floatAmount: 8,  floatDuration: 4.8, parallaxAmount: 60,  mouseDepth: 12 },
  { width: 185, height: 160, top: "57%", left: "4%",  floatAmount: 14, floatDuration: 7.1, parallaxAmount: 95,  mouseDepth: 22 },
  { width: 142, height: 118, top: "76%", left: "17%", floatAmount: 9,  floatDuration: 5.4, parallaxAmount: 50,  mouseDepth: 16 },
  { width: 162, height: 128, top: "4%",  left: "67%", floatAmount: 11, floatDuration: 5.8, parallaxAmount: 115, mouseDepth: 20 },
  { width: 202, height: 152, top: "17%", left: "79%", floatAmount: 15, floatDuration: 6.7, parallaxAmount: 70,  mouseDepth: 8  },
  { width: 190, height: 158, top: "58%", left: "73%", floatAmount: 10, floatDuration: 4.5, parallaxAmount: 105, mouseDepth: 24 },
  { width: 144, height: 118, top: "78%", left: "83%", floatAmount: 13, floatDuration: 7.4, parallaxAmount: 80,  mouseDepth: 14 },
];

export default function AnimatedHeroImages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Mouse quickTo setup ---
    const quickX = mouseRefs.current.map((el) =>
      el ? gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }) : null,
    );
    const quickY = mouseRefs.current.map((el) =>
      el ? gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }) : null,
    );

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;

      if (!inside) {
        IMAGES.forEach((_, i) => { quickX[i]?.(0); quickY[i]?.(0); });
        return;
      }

      const nx = (e.clientX - rect.left) / rect.width  - 0.5;  // [-0.5, 0.5]
      const ny = (e.clientY - rect.top)  / rect.height - 0.5;

      IMAGES.forEach((img, i) => {
        quickX[i]?.(nx * img.mouseDepth * 2);
        quickY[i]?.(ny * img.mouseDepth);
      });
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // --- Scroll + float via gsap.context ---
    const ctx = gsap.context(() => {
      const parallaxEls = parallaxRefs.current.filter(Boolean) as HTMLDivElement[];
      const floatEls    = floatRefs.current.filter(Boolean)    as HTMLDivElement[];

      gsap.set(parallaxEls, { rotation: 0, rotationX: 0, rotationY: 0 });

      // Entrance
      gsap.from(parallaxEls, {
        opacity: 0, y: 20, scale: 0.96, rotation: 0,
        duration: 1.2, stagger: 0.12, ease: "power2.out", delay: 0.3,
      });

      // Float loops
      floatEls.forEach((el, i) => {
        gsap.to(el, {
          y: `+=${IMAGES[i].floatAmount}`,
          duration: IMAGES[i].floatDuration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.35,
        });
      });

      // Scroll parallax
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          parallaxEls.forEach((el, i) => {
            gsap.set(el, { y: self.progress * -IMAGES[i].parallaxAmount });
          });
        },
      });
    }, container);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {IMAGES.map((img, i) => (
        // Layer 1 — mouse parallax
        <div
          key={i}
          ref={(el) => { mouseRefs.current[i] = el; }}
          className="absolute"
          style={{ top: img.top, left: img.left }}
        >
          {/* Layer 2 — scroll parallax */}
          <div ref={(el) => { parallaxRefs.current[i] = el; }}>
            {/* Layer 3 — float loop */}
            <div ref={(el) => { floatRefs.current[i] = el; }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/homepage/placeholder.png"
                alt=""
                width={img.width}
                height={img.height}
                style={{ width: img.width, height: img.height, objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
