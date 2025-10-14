'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface SubtleLiquidEffectProps {
  imageSrc: string;
  className?: string;
}

export default function SubtleLiquidEffect({ imageSrc, className = '' }: SubtleLiquidEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animationId: number | null;
    mouse: THREE.Vector2;
    prevMouse: THREE.Vector2;
    time: number;
    lastMoveTime: number;
    hoverTimeout: NodeJS.Timeout | null;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Setup Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageSrc);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Vertex Shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment Shader ottimizzato con cap sull'intensità
    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHover;
      uniform float uActivity; // Nuovo: tiene traccia dell'attività recente
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        
        // Distanza dal mouse
        float dist = distance(uv, uMouse);
        
        // Onde con frequenze basse per effetto più morbido
        float wave1 = sin(dist * 12.0 - uTime * 1.5) * 0.5 + 0.5;
        float wave2 = sin(dist * 18.0 - uTime * 2.0 + 1.0) * 0.5 + 0.5;
        
        // Combina onde
        float waves = (wave1 + wave2 * 0.6) / 1.6;
        
        // Decay più rapido per limitare l'area di effetto
        float decay = exp(-dist * 7.0);
        waves *= decay;
        
        // Intensity CAP - si riduce nel tempo se il mouse è fermo
        // uActivity va da 1.0 (appena mosso) a 0.3 (fermo da tempo)
        float maxIntensity = 0.4; // Cap massimo molto più basso
        float intensity = uHover * uActivity * maxIntensity;
        waves *= intensity;
        
        // Displacement ridotto e più morbido
        float angle = atan(uv.y - uMouse.y, uv.x - uMouse.x);
        vec2 displacement = vec2(
          cos(angle + uTime * 0.8),
          sin(angle + uTime * 0.8)
        ) * waves * 0.008; // Molto ridotto
        
        // Sample texture con displacement minimo
        vec2 distortedUV = uv + displacement;
        
        // Chromatic aberration molto sottile
        float r = texture2D(uTexture, distortedUV + displacement * 0.2).r;
        float g = texture2D(uTexture, distortedUV).g;
        float b = texture2D(uTexture, distortedUV - displacement * 0.2).b;
        
        vec3 color = vec3(r, g, b);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uActivity: { value: 1.0 }, // Nuovo uniform
      },
      vertexShader,
      fragmentShader,
    });

    // Create plane
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const mouse = new THREE.Vector2(0.5, 0.5);
    const prevMouse = new THREE.Vector2(0.5, 0.5);
    let lastMoveTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const newX = (e.clientX - rect.left) / rect.width;
      const newY = 1.0 - (e.clientY - rect.top) / rect.height;
      
      prevMouse.copy(mouse);
      mouse.set(newX, newY);
      lastMoveTime = Date.now(); // Reset timer quando il mouse si muove
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps

      // Calcola quanto tempo è passato dall'ultimo movimento
      const timeSinceMove = (Date.now() - lastMoveTime) / 1000; // in secondi
      
      // Activity decay: 1.0 quando appena mosso, 0.3 dopo 2 secondi di inattività
      const targetActivity = Math.max(0.3, 1.0 - timeSinceMove * 0.35);
      const currentActivity = material.uniforms.uActivity.value;
      material.uniforms.uActivity.value += (targetActivity - currentActivity) * 0.05; // Smooth transition

      // Update uniforms
      material.uniforms.uMouse.value = mouse;
      material.uniforms.uTime.value = time;
      // Smooth hover transition - MOLTO più lenta in uscita per evitare flicker
      const hoverSpeed = isHovered ? 0.08 : 0.02; // Veloce in entrata, lento in uscita
      material.uniforms.uHover.value += (isHovered ? 1 : 0 - material.uniforms.uHover.value) * hoverSpeed;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      material,
      animationId,
      mouse,
      prevMouse,
      time,
      lastMoveTime,
      hoverTimeout: null,
    };

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      texture.dispose();
    };
  }, [imageSrc, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Immediato, il fade-out graduale è gestito dall'animazione
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}

