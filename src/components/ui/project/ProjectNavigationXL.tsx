import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectArrow from './ProjectArrow';
import { Variants } from 'framer-motion';

interface ProjectNavigationXLProps {
  date: string;
  title: string;
  currentProjectId: string;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
  h3Animation: Variants;
}

/**
 * Navigation component for XL layout with animated headers and lines
 * Displays date on left, title on right, with full-width lines and arrows
 */
export default function ProjectNavigationXL({
  date,
  title,
  currentProjectId,
  onLeftArrowClick,
  onRightArrowClick,
  h3Animation,
}: ProjectNavigationXLProps) {
  return (
    <>
      {/* Left Column: H3 + Line + Arrow */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.h3
            key={`date-${currentProjectId}`}
            className="text-white/30 text-lg font-light mb-2 text-left font-poppins"
            variants={h3Animation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {date}
          </motion.h3>
        </AnimatePresence>
        <div className="w-full h-px bg-white opacity-30 mb-5"></div>
        <div className="flex justify-start">
          <ProjectArrow direction="left" onClick={onLeftArrowClick} />
        </div>
      </div>

      {/* Right Column: H3 + Line + Arrow */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.h3
            key={`title-h3-${currentProjectId}`}
            className="text-white/30 text-lg font-light mb-2 text-right font-poppins"
            variants={h3Animation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {title}
          </motion.h3>
        </AnimatePresence>
        <div className="w-full h-px bg-white opacity-30 mb-5"></div>
        <div className="flex justify-end">
          <ProjectArrow direction="right" onClick={onRightArrowClick} />
        </div>
      </div>
    </>
  );
}
