'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useServiceTitleScrollAnimation } from '@/hooks';

interface AnimatedServiceTitleProps {
  title: string;
  index: number;
  className?: string;
  onClick?: () => void;
  isExpanded?: boolean;
}

export default function AnimatedServiceTitle({
  title,
  index,
  className = '',
  onClick,
  isExpanded = false,
}: AnimatedServiceTitleProps) {
  const { ref, isVisible } = useServiceTitleScrollAnimation(index);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
      if (ref.current) {
        ref.current.style.filter = 'none';
        ref.current.style.willChange = 'auto';
        setIsAnimationComplete(true);
      }
    }, 500); // 400ms animation + 100ms buffer
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, isVisible, ref]);

  // Varianti per l'animazione del container - SENZA BLUR per evitare problemi su Chromium/Brave
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: isExpanded ? 1 : 0.3,
      y: 0,
      scale: isExpanded ? 1.02 : 1,
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
    if (ref.current) {
      // Forza cleanup immediato
      ref.current.style.filter = 'none';
      ref.current.style.willChange = 'auto';
    }
  };

  return (
    <motion.h2
      ref={ref}
      className={`text-text-primary-60 data-[expanded=true]:text-text-primary text-[43px] xs:text-[53px] md:text-[68px] xl:text-[78px] 2xl:text-[93px] cursor-pointer w-full leading-tight hover:text-text-primary ${className}`}
      onClick={onClick}
      data-expanded={isExpanded}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.08,
      }}
      onAnimationComplete={handleAnimationComplete}
      whileHover={{
        scale: isExpanded ? 1.02 : 1.03,
        opacity: isExpanded ? 1 : 0.6,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      whileTap={{
        scale: 0.97,
        transition: { duration: 0.1, ease: 'easeInOut' },
      }}
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
      {/* Dividi il titolo in parole per l'animazione */}
      {title.split(' ').map((word, wordIndex) => (
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
    </motion.h2>
  );
}
