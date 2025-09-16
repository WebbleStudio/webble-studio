'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  // Varianti per ogni lettera
  const letterVariants = {
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
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ 
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.04 
      }}
      style={{
        willChange: 'transform, opacity, filter',
        transformOrigin: 'left',
      }}
    >
      {/* Dividi il testo in lettere per l'animazione */}
      {text.split('').map((letter, letterIndex) => (
        <motion.span
          key={letterIndex}
          variants={letterVariants}
          className="inline-block"
          style={{
            willChange: 'transform, opacity, filter',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
