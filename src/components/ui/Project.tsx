'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectAnimationVariants } from '../animations/projectAnimations';
import ProjectDescription from './ProjectDescription';
import OptimizedImage from './OptimizedImage';

interface ProjectProps {
  title: string;
  description: string;
  image: string;
  backgroundImage: string;
  labels: string[];
  currentProjectId: string;
  date?: string;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
}

const Project: React.FC<ProjectProps> = ({
  title,
  description,
  image,
  backgroundImage,
  labels,
  currentProjectId,
  date = 'Maggio 2025',
  onLeftArrowClick,
  onRightArrowClick,
}) => {
  const animations = projectAnimationVariants;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className="h-screen w-full bg-second flex items-center justify-center relative overflow-hidden">
      {/* Custom Cursor */}
      <motion.div
        className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
          isHoveringImage ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0 }}
        animate={{
          scale: isHoveringImage ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: 0.4,
        }}
      >
        <div
          className="w-10 h-10 rounded-full shadow-xl border-2 border-white bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </motion.div>

      {/* Animated Background */}
      <AnimatePresence>
        <motion.div
          key={`bg-${currentProjectId}`}
          className="absolute inset-0 w-full h-full bg-cover bg-left bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          {...animations.background}
        />
      </AnimatePresence>

      {/* Content Wrapper */}
      <div className="w-full max-w-[1300px] 2xl:max-w-[1650px] mx-auto px-5 md:px-[30px] relative z-10">
        {/* XL: 3 Column Layout */}
        <div className="hidden xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-8 xl:w-full">
          {/* Left Column: H3 + Line + Arrow */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.h3
                key={`date-${currentProjectId}`}
                className="text-white/30 text-lg font-light mb-2 text-left font-poppins"
                variants={animations.h3}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {date}
              </motion.h3>
            </AnimatePresence>
            <div className="w-full h-px bg-white opacity-30 mb-5"></div>
            <div className="flex justify-start">
              <div
                className="cursor-pointer transition-opacity hover:opacity-70 bg-black bg-opacity-20 rounded-full p-3"
                onClick={onLeftArrowClick}
              >
                <OptimizedImage
                  src="/icons/arrow-left.svg"
                  alt="Previous project"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
              </div>
            </div>
          </div>

          {/* Center Column: Fixed Content */}
          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentProjectId}`}
                className="text-[48px] 2xl:text-[56px] font-figtree font-medium text-left relative w-[600px] 2xl:w-[750px]"
                variants={animations.titleTypewriter}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {title.split('').map((char, index) => (
                  <motion.span
                    key={`${char}-${index}-${currentProjectId}`}
                    className="inline-block"
                    variants={animations.titleChar}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h1>
            </AnimatePresence>

            {/* Project Description */}
            <div className="w-[600px] 2xl:w-[750px]">
              <ProjectDescription description={description} currentProjectId={currentProjectId} />
            </div>

            {/* Image */}
            <div
              className="relative w-[600px] h-[360px] 2xl:w-[750px] 2xl:h-[450px] bg-main rounded-[17px] overflow-hidden cursor-none mb-14 md:mb-20"
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              <AnimatePresence>
                <motion.div
                  key={`image-${currentProjectId}`}
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${image})` }}
                  variants={animations.imageFadeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                />
              </AnimatePresence>
            </div>

            {/* Labels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProjectId}
                variants={animations.container}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div
                  className="flex flex-wrap gap-2 mb-8 w-[600px] 2xl:w-[750px] justify-center"
                  variants={animations.labels}
                >
                  {labels.map((label, index) => (
                    <motion.span
                      key={`${label}-${index}`}
                      className="text-center py-[11px] px-[17px] bg-transparent text-main border-[1px] border-main rounded-full text-sm font-medium whitespace-nowrap"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                      variants={animations.label}
                    >
                      {label}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: H3 + Line + Arrow */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.h3
                key={`title-h3-${currentProjectId}`}
                className="text-white/30 text-lg font-light mb-2 text-right font-poppins"
                variants={animations.h3}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {title}
              </motion.h3>
            </AnimatePresence>
            <div className="w-full h-px bg-white opacity-30 mb-5"></div>
            <div className="flex justify-end">
              <div
                className="cursor-pointer transition-opacity hover:opacity-70 bg-black bg-opacity-20 rounded-full p-3"
                onClick={onRightArrowClick}
              >
                <OptimizedImage
                  src="/icons/arrow-right.svg"
                  alt="Next project"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Below XL: Standard Layout */}
        <div className="xl:hidden text-center flex flex-col relative z-10">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentProjectId}`}
              className="text-[32px] xs:text-[36px] sm:text-[40px] md:text-[44px] lg:text-[48px] font-figtree font-medium text-left relative w-[300px] xs:w-[340px] sm:w-[380px] md:w-[500px] lg:w-[600px] mx-auto"
              variants={animations.titleTypewriter}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {title.split('').map((char, index) => (
                <motion.span
                  key={`${char}-${index}-${currentProjectId}`}
                  className="inline-block"
                  variants={animations.titleChar}
                  style={{
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>

          {/* Project Description */}
          <div className="w-[300px] xs:w-[340px] sm:w-[380px] md:w-[500px] lg:w-[600px] mx-auto">
            <ProjectDescription description={description} currentProjectId={currentProjectId} />
          </div>

          {/* Wrapper per immagine e bottoni esterni */}
          <div className="flex flex-col items-center sm:flex-row sm:justify-center sm:items-center relative mb-14 sm:mb-10 md:mb-20">
            {/* Left Arrow - esterno (da 555px in su) */}
            <div className="hidden button-outside sm:flex sm:items-center mr-8">
              <div
                className="cursor-pointer transition-opacity hover:opacity-70 bg-black bg-opacity-20 rounded-full p-3"
                onClick={onLeftArrowClick}
              >
                <OptimizedImage
                  src="/icons/arrow-left.svg"
                  alt="Previous project"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
              </div>
            </div>

            {/* Fixed Image Container - Outside animations */}
            <div
              className="relative w-[300px] h-[185px] xs:w-[340px] xs:h-[210px] sm:w-[380px] sm:h-[235px] md:w-[500px] md:h-[300px] lg:w-[600px] lg:h-[360px] bg-main rounded-[17px] overflow-hidden cursor-none"
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              {/* Animated Image Background with Overlay Effect */}
              <AnimatePresence>
                <motion.div
                  key={`image-${currentProjectId}`}
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${image})` }}
                  variants={animations.imageFadeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                />
              </AnimatePresence>

              {/* Navigation Arrows Overlay - solo mobile */}
              <div className="absolute inset-0 flex items-center justify-between px-1 z-10 button-inside sm:hidden">
                {/* Left Arrow */}
                <div
                  className="cursor-pointer transition-opacity hover:opacity-70 bg-black bg-opacity-20 rounded-full p-2"
                  onClick={onLeftArrowClick}
                >
                  <OptimizedImage
                    src="/icons/arrow-left.svg"
                    alt="Previous project"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                {/* Right Arrow */}
                <div
                  className="cursor-pointer transition-opacity hover:opacity-70 bg-black bg-opacity-20 rounded-full p-2"
                  onClick={onRightArrowClick}
                >
                  <OptimizedImage
                    src="/icons/arrow-right.svg"
                    alt="Next project"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>

            {/* Right Arrow - esterno (da 555px in su) */}
            <div className="hidden button-outside sm:flex sm:items-center ml-8">
              <div
                className="cursor-pointer transition-opacity hover:opacity-70 bg-black bg-opacity-20 rounded-full p-3"
                onClick={onRightArrowClick}
              >
                <OptimizedImage
                  src="/icons/arrow-right.svg"
                  alt="Next project"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
              </div>
            </div>
          </div>

          <style jsx>{`
            @media (min-width: 555px) {
              .button-outside {
                display: flex !important;
              }
              .button-inside {
                display: none !important;
              }
            }
            @media (max-width: 554px) {
              .button-outside {
                display: none !important;
              }
              .button-inside {
                display: flex !important;
              }
            }
            @media (min-width: 768px) {
              .md-auto-width {
                width: auto !important;
              }
            }
          `}</style>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentProjectId}
              variants={animations.container}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                className="flex flex-wrap md:flex-nowrap gap-2 mb-8 w-[300px] xs:w-[340px] sm:w-[380px] md:w-[500px] lg:w-[600px] mx-auto justify-center"
                variants={animations.labels}
              >
                {labels.map((label, index) => {
                  const getWidthForSmall = (labelText: string, currentIndex: number) => {
                    // Raggruppiamo le label a coppie per riga (solo per schermi piccoli)
                    const pairIndex = Math.floor(currentIndex / 2);
                    const positionInPair = currentIndex % 2;

                    // Calcoliamo la lunghezza delle label nella coppia corrente
                    const currentPairLabels = [
                      labels[pairIndex * 2],
                      labels[pairIndex * 2 + 1],
                    ].filter(Boolean);

                    if (currentPairLabels.length === 2) {
                      const [first, second] = currentPairLabels;
                      const firstLength = first.length;
                      const secondLength = second.length;
                      const totalLength = firstLength + secondLength;

                      // Calcoliamo le percentuali proporzionali, con un minimo del 35% e massimo del 65%
                      const firstPercent = Math.max(
                        35,
                        Math.min(65, (firstLength / totalLength) * 100)
                      );
                      const secondPercent = 100 - firstPercent;

                      if (positionInPair === 0) {
                        return `calc(${firstPercent}% - 4px)`;
                      } else {
                        return `calc(${secondPercent}% - 4px)`;
                      }
                    }

                    // Fallback per label singole
                    return 'calc(100% - 4px)';
                  };

                  return (
                    <motion.span
                      key={`${label}-${index}`}
                      className="text-center py-[11px] md:px-[17px] bg-transparent text-main border-[1px] border-main rounded-full text-sm font-medium md:whitespace-nowrap md-auto-width"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        width: getWidthForSmall(label, index),
                      }}
                      variants={animations.label}
                    >
                      {label}
                    </motion.span>
                  );
                })}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Project;
