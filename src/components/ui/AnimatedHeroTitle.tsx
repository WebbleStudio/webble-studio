'use client';

import React, { useState, useEffect } from 'react';
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

  // Attiva l'animazione al caricamento con un delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Varianti per l'animazione del container
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
  };

  // Varianti per ogni parola
  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.span
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
        style={{
          willChange: 'transform, opacity, filter',
          transformOrigin: 'left',
        }}
      >
        {/* Dividi il testo in parole per l'animazione */}
        {text.split(' ').map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            variants={wordVariants}
            className="inline-block mr-2 last:mr-0"
            style={{
              willChange: 'transform, opacity, filter',
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}
