'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useServiceTitleScrollAnimation } from '@/hooks/useServiceTitleAnimation';

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

  // Varianti per l'animazione del container
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: isExpanded ? 1 : 0.3,
      y: 0,
      scale: isExpanded ? 1.02 : 1,
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
    <motion.h2
      ref={ref}
      className={`text-text-primary-60 data-[expanded=true]:text-text-primary text-[53px] sm:text-[63px] md:text-[68px] xl:text-[78px] 2xl:text-[93px] cursor-pointer w-full leading-tight hover:text-text-primary ${className}`}
      onClick={onClick}
      data-expanded={isExpanded}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ 
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.03 
      }}
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
        willChange: 'transform, opacity, filter',
        transformOrigin: 'left',
      }}
    >
      {/* Dividi il titolo in lettere per l'animazione */}
      {title.split('').map((letter, letterIndex) => (
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
    </motion.h2>
  );
}
