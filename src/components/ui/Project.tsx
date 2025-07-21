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
    <div className="h-[600px] w-full bg-second flex items-center justify-center px-5 md:px-[30px] relative overflow-hidden">
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
          <div className="w-[275px] flex items-center justify-between mb-12">
            <motion.img
              src="/icons/arrow-left.svg"
              alt="Arrow left"
              className="w-8 h-8 cursor-pointer"
              onClick={onLeftArrowClick}
              variants={animations.arrow}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            />
            <motion.h1 className="text-[32px] font-figtree font-medium" variants={animations.title}>
              {title}
            </motion.h1>
            <motion.img
              src="/icons/arrow-right.svg"
              alt="Arrow right"
              className="w-8 h-8 cursor-pointer"
              onClick={onRightArrowClick}
              variants={animations.arrow}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            />
          </div>

          <motion.div
            className="w-[275px] h-[175px] bg-main rounded-[17px] bg-cover bg-center bg-no-repeat mb-14"
            style={{ backgroundImage: `url(${image})` }}
            variants={animations.image}
          />

          <motion.div className="flex gap-2 justify-center" variants={animations.labels}>
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Project;
