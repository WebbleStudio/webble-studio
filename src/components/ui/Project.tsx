'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectAnimationVariants } from '../animations/projectAnimations';

interface ProjectProps {
  title: string;
  image: string;
  backgroundImage: string;
  labels: string[];
  currentProjectId: string;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
}

const Project: React.FC<ProjectProps> = ({
  title,
  image,
  backgroundImage,
  labels,
  currentProjectId,
  onLeftArrowClick,
  onRightArrowClick,
}) => {
  const animations = projectAnimationVariants;

  return (
    <div className="h-screen w-full bg-second flex items-center justify-center px-5 md:px-[30px] relative overflow-hidden">
      {/* Animated Background */}
      <AnimatePresence>
        <motion.div
          key={`bg-${currentProjectId}`}
          className="absolute inset-0 w-full h-full bg-cover bg-left bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          {...animations.background}
        />
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProjectId}
          className="text-center flex flex-col relative z-10"
          variants={animations.container}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <AnimatePresence mode="wait">
            <motion.h1 
              key={`title-${currentProjectId}`}
              className="text-[32px] font-figtree font-medium mb-12 text-left" 
              variants={animations.title}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {title}
            </motion.h1>
          </AnimatePresence>

          <motion.div
            className="w-[275px] h-[175px] xs:w-[305px] xs:h-[205px] bg-main rounded-[17px] bg-cover bg-center bg-no-repeat mb-14"
            style={{ backgroundImage: `url(${image})` }}
            variants={animations.image}
          />

          <motion.div className="flex gap-2 justify-start mb-8" variants={animations.labels}>
            {labels.map((label, index) => (
              <motion.span
                key={`${label}-${index}`}
                className="px-[17px] py-[11px] bg-transparent text-main border-[1px] border-main rounded-full text-sm font-medium whitespace-nowrap"
                style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                variants={animations.label}
              >
                {label}
              </motion.span>
            ))}
          </motion.div>

          {/* Fixed Navigation Arrows - Outside animation */}
          <div className="flex items-center justify-between w-[275px] xs:w-[305px]">
            {/* Left Arrow */}
            <div
              className="cursor-pointer transition-opacity hover:opacity-70"
              onClick={onLeftArrowClick}
            >
              <svg 
                width="80" 
                height="20" 
                viewBox="0 0 80 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M10 2L2 10L10 18M2 10H78" 
                  stroke="rgba(255, 255, 255, 0.8)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Right Arrow */}
            <div
              className="cursor-pointer transition-opacity hover:opacity-70"
              onClick={onRightArrowClick}
            >
              <svg 
                width="80" 
                height="20" 
                viewBox="0 0 80 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M70 18L78 10L70 2M78 10H2" 
                  stroke="rgba(255, 255, 255, 0.8)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Project;
