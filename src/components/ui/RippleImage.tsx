'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface RippleImageProps {
  imageSrc: string;
  className?: string;
}

export default function RippleImage({ imageSrc, className = '' }: RippleImageProps) {
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
    targetMouse: THREE.Vector2;
    time: number;
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

    // Fragment Shader con effetto ripple displacement
    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHover;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        
        // Calcola distanza dal mouse
        float dist = distance(uv, uMouse);
        
        // Crea effetto ripple (onde concentriche)
        float ripple = sin(dist * 30.0 - uTime * 3.0) * 0.5 + 0.5;
        ripple *= exp(-dist * 8.0); // Decay esponenziale
        ripple *= uHover; // Intensity basata su hover
        
        // Displacement
        vec2 displacement = vec2(
          cos(uTime * 2.0 + dist * 20.0),
          sin(uTime * 2.0 + dist * 20.0)
        ) * ripple * 0.02;
        
        // Chromatic aberration effect
        float r = texture2D(uTexture, uv + displacement * 1.0).r;
        float g = texture2D(uTexture, uv + displacement * 0.5).g;
        float b = texture2D(uTexture, uv + displacement * 0.0).b;
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    // Create material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uHover: { value: 0 },
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
    const targetMouse = new THREE.Vector2(0.5, 0.5);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps

      // Smooth mouse following
      mouse.x += (targetMouse.x - mouse.x) * 0.1;
      mouse.y += (targetMouse.y - mouse.y) * 0.1;

      // Update uniforms
      material.uniforms.uMouse.value = mouse;
      material.uniforms.uTime.value = time;
      material.uniforms.uHover.value += (isHovered ? 1 : 0 - material.uniforms.uHover.value) * 0.1;

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
      targetMouse,
      time,
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

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}

