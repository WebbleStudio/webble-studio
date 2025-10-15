'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedHeroTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function AnimatedHeroTitle({
  text,
  className = '',
  delay = 0,
}: AnimatedHeroTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Attiva l'animazione al caricamento con un delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Cleanup effect: Forza rimozione blur dopo animazione (FALLBACK per Chromium/Brave)
  useEffect(() => {
    if (!isVisible) {
      setIsAnimationComplete(false);
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Fallback: forza rimozione blur dopo animazione completa + buffer
    timeoutRef.current = setTimeout(() => {
      if (elementRef.current) {
        elementRef.current.style.filter = 'none';
        elementRef.current.style.willChange = 'auto';
        setIsAnimationComplete(true);
      }
    }, 700); // 600ms animation + 100ms buffer

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isVisible]);

  // Varianti per l'animazione del container - SENZA BLUR per evitare problemi su Chromium/Brave
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  // Varianti per ogni parola - SENZA BLUR per evitare problemi su Chromium/Brave
  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
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
      <motion.span
        ref={elementRef}
        key={text} // Key importante: cambia quando il testo cambia per il cambio lingua
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        exit="hidden"
        transition={{
          duration: 0.6,
          ease: 'easeOut',
          staggerChildren: 0.08,
        }}
        onAnimationComplete={handleAnimationComplete}
        style={{
          willChange: isVisible && !isAnimationComplete ? 'transform, opacity' : 'auto',
          transformOrigin: 'left',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          filter: isAnimationComplete ? 'none' : undefined,
        }}
      >
        {/* Dividi il testo in parole per l'animazione */}
        {text.split(' ').map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            variants={wordVariants}
            className="inline-block mr-2 last:mr-0"
            style={{
              willChange: isVisible ? 'auto' : 'transform, opacity',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}
