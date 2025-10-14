'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface LiquidWaveImageProps {
  imageSrc: string;
  className?: string;
}

export default function LiquidWaveImage({ imageSrc, className = '' }: LiquidWaveImageProps) {
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

    // Fragment Shader con effetto liquid wave
    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform vec2 uPrevMouse;
      uniform float uTime;
      uniform float uHover;
      varying vec2 vUv;

      // Noise function per effetto organico
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        
        // Calcola velocità del mouse
        vec2 mouseVelocity = uMouse - uPrevMouse;
        float velocityMag = length(mouseVelocity);
        
        // Distanza dal mouse
        float dist = distance(uv, uMouse);
        
        // Crea onde multiple con frequenze diverse
        float wave1 = sin(dist * 15.0 - uTime * 2.0) * 0.5 + 0.5;
        float wave2 = sin(dist * 25.0 - uTime * 3.0 + 1.0) * 0.5 + 0.5;
        float wave3 = cos(dist * 20.0 - uTime * 2.5) * 0.5 + 0.5;
        
        // Combina onde
        float waves = (wave1 + wave2 * 0.5 + wave3 * 0.3) / 1.8;
        
        // Decay basato su distanza
        float decay = exp(-dist * 5.0);
        waves *= decay;
        
        // Aggiungi noise per effetto organico
        float noiseValue = noise(uv * 10.0 + uTime * 0.5);
        waves += noiseValue * 0.1 * decay;
        
        // Intensity basata su hover e velocità mouse (RIDOTTA)
        float intensity = uHover * (0.3 + velocityMag * 5.0);
        waves *= intensity;
        
        // Displacement con pattern rotazionale (effetto vortex) - RIDOTTO
        float angle = atan(uv.y - uMouse.y, uv.x - uMouse.x);
        vec2 displacement = vec2(
          cos(angle + uTime + waves * 3.0),
          sin(angle + uTime + waves * 3.0)
        ) * waves * 0.015;
        
        // Aggiungi displacement radiale - RIDOTTO
        vec2 radialDisp = normalize(uv - uMouse) * waves * 0.01;
        displacement += radialDisp;
        
        // Sample texture con displacement
        vec2 distortedUV = uv + displacement;
        
        // Effetto di "stiramento" del colore - RIDOTTO
        float r = texture2D(uTexture, distortedUV + displacement * 0.3).r;
        float g = texture2D(uTexture, distortedUV).g;
        float b = texture2D(uTexture, distortedUV - displacement * 0.3).b;
        
        // Aggiungi leggero glow nelle aree con distorsione - RIDOTTO
        float glow = waves * 0.1;
        vec3 color = vec3(r, g, b) + glow;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
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
    const prevMouse = new THREE.Vector2(0.5, 0.5);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const newX = (e.clientX - rect.left) / rect.width;
      const newY = 1.0 - (e.clientY - rect.top) / rect.height;
      
      prevMouse.copy(mouse);
      mouse.set(newX, newY);
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps

      // Update uniforms
      material.uniforms.uMouse.value = mouse;
      material.uniforms.uPrevMouse.value = prevMouse;
      material.uniforms.uTime.value = time;
      material.uniforms.uHover.value += (isHovered ? 1 : 0 - material.uniforms.uHover.value) * 0.05;

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

