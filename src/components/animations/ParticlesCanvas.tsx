"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number; // gentle horizontal sway per frame
}

const COUNT = 40;
const MIN_SIZE = 0.5;
const MAX_SIZE = 2;
const MIN_SPEED = 0.02;
const MAX_SPEED = 0.1;
const MIN_OPACITY = 0.06;
const MAX_OPACITY = 0.22;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticle(w: number, h: number): Particle {
  return {
    x: rand(0, w),
    y: rand(0, h),
    size: rand(MIN_SIZE, MAX_SIZE),
    speed: rand(MIN_SPEED, MAX_SPEED),
    opacity: rand(MIN_OPACITY, MAX_OPACITY),
    drift: rand(-0.08, 0.08),
  };
}

/**
 * Full-bleed canvas that renders lightweight upward-drifting particles.
 * Particles are drawn as soft white circles (CSS `--foreground` ≈ white in
 * dark mode). The canvas is `position: absolute` and sits below all other
 * Hero children via `z-0`.
 *
 * The animation loop uses `requestAnimationFrame` and is fully cancelled on
 * unmount to avoid memory leaks. The canvas is resized via a `ResizeObserver`
 * so particles always fill the section correctly on any viewport.
 */
export default function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let rafId: number;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w;
      canvas.height = h;

      // Re-seed so particles stay within new bounds
      particles = Array.from({ length: COUNT }, () => createParticle(w, h));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        p.y -= p.speed;
        p.x += p.drift;

        // Wrap: when a particle exits the top or sides, respawn at the bottom
        if (p.y + p.size < 0) {
          p.x = rand(0, w);
          p.y = h + p.size;
          p.opacity = rand(MIN_OPACITY, MAX_OPACITY);
        }
        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;
      }

      rafId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
