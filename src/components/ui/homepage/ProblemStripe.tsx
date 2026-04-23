"use client";

import { useEffect, useRef, useState } from "react";

const CYCLE_MS = 4000; // tempo per un giro completo del glow attorno al bordo
const HOVER_FADE_MS = 300;

/**
 * Le transizioni CSS sui `radial-gradient` non interpolano davvero i valori
 * numerici (la maggior parte dei browser fa snap). Framer Motion nell'esempio
 * originale animava la string del gradient frame-by-frame; qui replichiamo
 * la stessa idea con un loop `requestAnimationFrame`, calcolando posizione
 * X/Y lungo il perimetro con sin/cos.
 *
 * Sui diversi stati sovrapponiamo due layer e facciamo crossfade via opacity
 * (questa sì animata in modo nativo dal browser):
 *   - rotating: glow accent che scorre attorno al bordo (sempre attivo)
 *   - highlight: glow accent centrato e ampio (visibile solo in hover)
 */

interface ProblemStripeProps {
  label: string;
  className?: string;
  cycleMs?: number;
  clockwise?: boolean;
}

export default function ProblemStripe({
  label,
  className = "",
  cycleMs = CYCLE_MS,
  clockwise = true,
}: ProblemStripeProps) {
  const [hovered, setHovered] = useState(false);
  const rotatingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let progress = 0; // 0..1 continuo lungo il perimetro

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!hovered) {
        const step = dt / cycleMs;
        progress = (progress + (clockwise ? step : -step) + 1) % 1;
      }

      const el = rotatingRef.current;
      if (el) {
        const theta = progress * Math.PI * 2;
        // θ=0 → BOTTOM (50,100). Ruota in senso orario:
        // θ=π/2 → LEFT, θ=π → TOP, θ=3π/2 → RIGHT.
        const x = 50 - 50 * Math.sin(theta);
        const y = 50 + 50 * Math.cos(theta);
        el.style.background = `radial-gradient(20% 45% at ${x}% ${y}%, var(--foreground) 0%, rgba(255, 255, 255, 0) 100%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hovered, cycleMs, clockwise]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex w-fit border border-foreground/20 p-px ${className}`}
    >
      {/* Glow layers: stesso contenitore con blur, due sub-layer crossfaded */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ filter: "blur(2px)" }}
      >
        <div
          ref={rotatingRef}
          className="absolute inset-0"
          style={{
            opacity: hovered ? 0 : 1,
            transition: `opacity ${HOVER_FADE_MS}ms linear`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 181.16% at 50% 50%, var(--foreground) 0%, rgba(255, 255, 255, 0) 100%)",
            opacity: hovered ? 1 : 0,
            transition: `opacity ${HOVER_FADE_MS}ms linear`,
          }}
        />
      </div>

      {/* Contenuto della stripe — invariato */}
      <div className="text-foreground relative z-10 inline-flex items-center gap-3 bg-[#121212] px-10 py-4 font-sans text-sm font-medium">
        <img
          src="/img/homepage/problems/layers-icon.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
        />
        <span>{label}</span>
      </div>
    </div>
  );
}
