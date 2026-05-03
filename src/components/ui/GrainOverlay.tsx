"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle grain overlay — fine static-ish noise that adds analog texture.
 *
 * Inspired by: Rama, Basement Studio, Linear — where grain reads as
 * "material quality" rather than "film flicker".
 *
 * Technical choices:
 *   - Canvas renders at full devicePixelRatio → 1-pixel sharp grain (fine)
 *   - Low alpha (9/255 ≈ 3.5%) so it's a texture, not a veil
 *   - 10 fps — slow enough to feel almost static, fast enough to stay alive
 *   - CSS `mix-blend-mode: overlay` amplifies the texture on both dark and
 *     light elements proportionally without globally brightening the canvas
 */

const TARGET_FPS = 10;
const FRAME_MS = 1000 / TARGET_FPS;
const GRAIN_ALPHA = 12; // 0–255 — color-dodge amplifica, 14 è già ben visibile

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let lastTime = 0;

    const setSize = () => {
      // Read the exact CSS pixel dimensions the browser assigned to the element,
      // then multiply by dpr. This avoids fractional-dpr scaling artifacts
      // (e.g. dpr=1.25 on Windows) that produce horizontal banding.
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.offsetWidth * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
    };

    const paint = (now: number) => {
      rafId = requestAnimationFrame(paint);
      if (now - lastTime < FRAME_MS) return;
      lastTime = now;

      const { width, height } = canvas;
      const img = ctx.createImageData(width, height);
      const d = img.data;

      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i]     = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = GRAIN_ALPHA;
      }

      ctx.putImageData(img, 0, 0);
    };

    setSize();
    window.addEventListener("resize", setSize, { passive: true });
    rafId = requestAnimationFrame(paint);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
      style={{ mixBlendMode: "color-dodge" }}
    />
  );
}
