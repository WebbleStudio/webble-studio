import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from '@/hooks';

interface AnimatedTextProps {
  children: React.ReactNode;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  className?: string;
  duration?: number;
  style?: React.CSSProperties;
  animationType?: 'light' | 'medium' | 'heavy'; // Nuovo: tipo di animazione per performance
}

// Helper function to generate a safe key from React children
const generateChildrenKey = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return children.toString();
  }
  if (React.isValidElement(children)) {
    // For React elements, use a combination of type and props
    return `${children.type}-${children.key || 'no-key'}`;
  }
  if (Array.isArray(children)) {
    // For arrays, concatenate keys of all children
    return children.map((child, index) => generateChildrenKey(child) || index.toString()).join('-');
  }
  // Fallback for other types
  return Math.random().toString(36).substr(2, 9);
};

export default function AnimatedText({
  children,
  as = 'span',
  className = '',
  duration = 0.4,
  style = {},
  animationType = 'light',
  ...props
}: AnimatedTextProps) {
  const MotionComponent = motion[as] as any;
  const elementRef = useRef<HTMLElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Performance optimization hook
  const { shouldDisableBlur, shouldUseGPUAcceleration, shouldSkipAnimation, getAnimationDuration } =
    usePerformance();

  // Cleanup effect: Forza rimozione blur dopo animazione (FALLBACK per Chromium/Brave)
  useEffect(() => {
    setIsAnimationComplete(false);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Fallback: forza rimozione blur dopo il completamento dell'animazione + buffer
    const animationDuration = getAnimationDuration(duration * 1000);
    timeoutRef.current = setTimeout(() => {
      if (elementRef.current) {
        // Forza rimozione di tutte le proprietà di animazione
        elementRef.current.style.filter = 'none';
        elementRef.current.style.willChange = 'auto';
        setIsAnimationComplete(true);
      }
    }, animationDuration + 100); // Buffer di 100ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [children, duration, getAnimationDuration]);

  // Skip animation completely se necessario
  if (shouldSkipAnimation(animationType)) {
    const StaticComponent = as;
    return (
      <StaticComponent className={className} style={style} {...props}>
        {children}
      </StaticComponent>
    );
  }

  // Configurazioni animation ottimizzate per performance
  const optimizedDuration = getAnimationDuration(duration * 1000) / 1000; // Convert back to seconds

  // Adaptive animation variants basati sulle performance del dispositivo
  const getAnimationVariants = () => {
    const baseY = shouldDisableBlur ? 3 : 5; // Movimento ridotto per low-end devices

    // SEMPRE senza blur per evitare problemi su Chromium/Brave
    return {
      initial: {
        opacity: 0,
        y: baseY,
        scale: 0.98, // Subtle scale invece di blur
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
      },
      exit: {
        opacity: 0,
        y: -baseY,
        scale: 0.98,
      },
    };
  };

  const variants = getAnimationVariants();

  // Enhanced transition configuration - SEMPRE senza blur
  const transitionConfig = {
    duration: optimizedDuration,
    ease: 'easeOut',
    // Separare le transizioni per performance migliori
    opacity: {
      duration: optimizedDuration * 0.8,
      ease: 'easeOut',
    },
    scale: {
      duration: optimizedDuration,
      ease: 'easeOut',
    },
  };

  // Enhanced style with performance optimizations + cleanup per Chromium/Brave
  const enhancedStyle = {
    ...style,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
    transform: 'translateZ(0)',
    // Dopo animazione completata, rimuovi willChange
    ...(shouldUseGPUAcceleration &&
      !isAnimationComplete && {
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden' as const,
        WebkitBackfaceVisibility: 'hidden' as const,
      }),
    // Forza rimozione blur se animazione completa
    ...(isAnimationComplete && {
      filter: 'none',
      willChange: 'auto',
    }),
  };

  // Handler per completamento animazione
  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
    if (elementRef.current) {
      // Forza cleanup immediato
      elementRef.current.style.filter = 'none';
      elementRef.current.style.willChange = 'auto';
    }
  };

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        ref={elementRef}
        key={generateChildrenKey(children)} // Key importante: cambia quando il contenuto cambia
        className={className}
        style={enhancedStyle}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={transitionConfig}
        onAnimationComplete={handleAnimationComplete}
        {...props}
      >
        {children}
      </MotionComponent>
    </AnimatePresence>
  );
}
