'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ProjectDescriptionProps {
  description: string;
  currentProjectId: string;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  description,
  currentProjectId,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={`description-${currentProjectId}-${description}`}
        className="text-white/80 text-base xs:text-lg sm:text-xl md:text-xl font-light leading-relaxed mb-12 md:mb-16 text-center max-w-[300px] xs:max-w-[340px] sm:max-w-[380px] md:max-w-[500px] mx-auto transition-colors duration-300"
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: -10,
          scale: 1.02,
        }}
        transition={{
          duration: 0.25, // Super veloce
          ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
        }}
      >
        {description}
      </motion.p>
    </AnimatePresence>
  );
};

export default ProjectDescription;
