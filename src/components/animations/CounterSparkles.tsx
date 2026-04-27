"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  life: number;      // 0–1: proportion of lifetime elapsed
  maxLife: number;   // total frames this particle lives
}

const COUNT = 55;
const MIN_SIZE = 0.6;
const MAX_SIZE = 2.2;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Creates a particle that spawns anywhere in the canvas and drifts upward
 * with slight horizontal drift. Opacity fades in and out over its lifetime
 * so particles twinkle rather than pop in/out abruptly.
 */
function createParticle(w: number, h: number): Particle {
  const maxLife = rand(80, 200);
  return {
    x: rand(0, w),
    y: rand(0, h),
    size: rand(MIN_SIZE, MAX_SIZE),
    speedY: rand(0.15, 0.55),
    speedX: rand(-0.12, 0.12),
    opacity: 0,
    life: rand(0, 1), // stagger so they don't all start at birth
    maxLife,
  };
}

/**
 * Canvas-based sparkles localised to the counter area.
 * Particles rise upward and twinkle (fade in → peak → fade out over lifetime).
 * Rendered as `pointer-events-none absolute inset-0` — drop into any
 * `relative overflow-hidden` container.
 */
export default function CounterSparkles() {
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
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w;
      canvas.height = h;
      particles = Array.from({ length: COUNT }, () => createParticle(w, h));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.life += 1 / p.maxLife;

        // Twinkle: fade in for first 30%, full at 50%, fade out last 50%
        const t = p.life % 1;
        let alpha: number;
        if (t < 0.3) {
          alpha = t / 0.3;
        } else if (t < 0.5) {
          alpha = 1;
        } else {
          alpha = 1 - (t - 0.5) / 0.5;
        }
        p.opacity = alpha * rand(0.5, 1); // shimmer via slight random flicker

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.7})`;
        ctx.fill();

        // Move
        p.y -= p.speedY;
        p.x += p.speedX;

        // Respawn at bottom when exiting top
        if (p.life >= 1 || p.y + p.size < 0) {
          Object.assign(p, createParticle(w, h));
          p.y = h + p.size;
          p.life = 0;
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
