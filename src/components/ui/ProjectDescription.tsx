'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

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
        key={`description-${currentProjectId}`}
        className="text-main/80 text-base xs:text-lg sm:text-xl md:text-xl font-light leading-relaxed mb-12 md:mb-16 text-left max-w-[300px] xs:max-w-[340px] sm:max-w-[380px] md:max-w-[500px]"
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.3,
          },
        }}
        exit={{
          opacity: 0,
          y: -10,
          transition: {
            duration: 0.3,
            ease: 'easeIn',
          },
        }}
      >
        {description}
      </motion.p>
    </AnimatePresence>
  );
};

export default ProjectDescription;
