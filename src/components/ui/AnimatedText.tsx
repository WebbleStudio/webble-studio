import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from '@/hooks/usePerformance';

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

  // Performance optimization hook
  const { shouldDisableBlur, shouldUseGPUAcceleration, shouldSkipAnimation, getAnimationDuration } =
    usePerformance();

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

    if (shouldDisableBlur) {
      // Versione senza blur per dispositivi low-end
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
    } else {
      // Versione con blur per dispositivi performanti
      return {
        initial: {
          opacity: 0,
          filter: 'blur(4px)',
          y: baseY,
        },
        animate: {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
        },
        exit: {
          opacity: 0,
          filter: 'blur(4px)',
          y: -baseY,
        },
      };
    }
  };

  const variants = getAnimationVariants();

  // Enhanced transition configuration
  const transitionConfig = {
    duration: optimizedDuration,
    ease: shouldDisableBlur ? 'easeOut' : [0.25, 0.1, 0.25, 1],
    // Separare le transizioni per performance migliori
    opacity: {
      duration: optimizedDuration * 0.8,
      ease: 'easeOut',
    },
    ...(shouldDisableBlur
      ? {
          scale: {
            duration: optimizedDuration,
            ease: 'easeOut',
          },
        }
      : {
          filter: {
            duration: optimizedDuration * 0.9,
            ease: 'easeOut',
          },
        }),
  };

  // Enhanced style with performance optimizations
  const enhancedStyle = {
    ...style,
    ...(shouldUseGPUAcceleration && {
      willChange: shouldDisableBlur ? 'transform, opacity' : 'transform, opacity, filter',
      backfaceVisibility: 'hidden' as const,
      WebkitBackfaceVisibility: 'hidden' as const,
    }),
  };

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        key={generateChildrenKey(children)} // Key importante: cambia quando il contenuto cambia
        className={className}
        style={enhancedStyle}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={transitionConfig}
        {...props}
      >
        {children}
      </MotionComponent>
    </AnimatePresence>
  );
}
