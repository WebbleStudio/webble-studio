'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectAnimationVariants, ANIMATION_CONFIG } from '../../animations/projectAnimations';
import ProjectDescription from '../../ui/ProjectDescription';
import OptimizedImage from '../../ui/OptimizedImage';
import { usePerformance } from '@/hooks/usePerformance';
import { useSlideSwitch, SingleProjectData } from '../../animations/useProjectSwitch';

interface ProjectsProps {
  projectData: SingleProjectData;
}

export default function Projects({ projectData }: ProjectsProps) {
  const {
    currentSlide,
    projectData: project,
    goToNext,
    goToPrevious,
  } = useSlideSwitch(projectData);

  const animations = projectAnimationVariants;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  // Performance optimization hook
  const {
    shouldReduceAnimations,
    shouldDisableBlur,
    shouldUseGPUAcceleration,
    getAnimationDuration,
    shouldSkipAnimation,
  } = usePerformance();

  // Refs per ottimizzazione performance
  const rafRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastUpdateRef = useRef(0);

  // Throttled mouse update con RAF per performance ottimali
  const updateMousePosition = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };

    // Throttle usando RAF per sync con browser refresh rate
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      const now = performance.now();
      // Limita aggiornamenti a max 30fps per performance migliori (invece di 60)
      if (now - lastUpdateRef.current >= 33.33) {
        // ~30fps
        setMousePosition(mousePositionRef.current);
        lastUpdateRef.current = now;
      }
      rafRef.current = null;
    });
  }, []);

  // Gestione hover ottimizzata con media query check e performance awareness
  const handleMouseEnter = useCallback(() => {
    if (
      window.matchMedia('(hover: hover)').matches &&
      !shouldReduceAnimations &&
      !shouldSkipAnimation('medium')
    ) {
      setIsHoveringImage(true);
    }
  }, [shouldReduceAnimations, shouldSkipAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (window.matchMedia('(hover: hover)').matches) {
      setIsHoveringImage(false);
    }
  }, []);

  // Enhanced effect con performance optimizations
  useEffect(() => {
    // Aggiungi listener solo quando necessario e performance permette
    if (isHoveringImage && !shouldReduceAnimations && !shouldSkipAnimation('medium')) {
      window.addEventListener('mousemove', updateMousePosition, {
        passive: true,
        capture: false, // Non catturare eventi in fase di capture per performance
      });
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isHoveringImage, shouldReduceAnimations, shouldSkipAnimation, updateMousePosition]);

  // Configurazioni dinamiche per performance con memoria
  const cursorStyles = useMemo(
    () => ({
      left: mousePosition.x,
      top: mousePosition.y,
      transform: 'translate(-50%, -50%)',
      willChange: shouldUseGPUAcceleration ? 'transform, opacity' : 'auto',
      contain: 'layout style paint', // Performance isolation
    }),
    [mousePosition.x, mousePosition.y, shouldUseGPUAcceleration]
  );

  // Image animation configs ottimizzati con caching
  const imageAnimationConfig = useMemo(() => {
    if (shouldDisableBlur) {
      return {
        initial: { y: 15, opacity: 0, scale: 1.02 }, // Ridotto movimento e scale
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
      };
    }
    return animations.imageFadeUp;
  }, [shouldDisableBlur, animations.imageFadeUp]);

  // Animation duration ottimizzata
  const animationDuration = useMemo(() => getAnimationDuration(400), [getAnimationDuration]);

  // Cursor animation configuration
  const cursorAnimationConfig = useMemo(
    () => ({
      initial: { scale: 0 },
      animate: {
        scale: isHoveringImage ? 1 : 0,
      },
      transition: shouldReduceAnimations
        ? {
            type: 'tween' as const,
            duration: animationDuration / 1000,
            ease: 'easeOut' as const,
          }
        : {
            type: 'spring' as const,
            stiffness: 300,
            damping: 20,
            duration: animationDuration / 1000,
          },
    }),
    [isHoveringImage, shouldReduceAnimations, animationDuration]
  );

  return (
    <section className="section-scroll h-screen w-full flex items-center justify-center mt-0 mb-0">
      <div
        className="h-screen w-full bg-second flex items-center justify-center relative overflow-hidden"
        style={{ contain: 'layout style' }}
      >
        {/* Fixed Background - no animation needed */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-[1]"
          style={{
            backgroundImage: `url(${project.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Enhanced Custom Cursor - performance optimized */}
        {!shouldSkipAnimation('medium') && (
          <motion.div
            className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
              isHoveringImage ? 'opacity-100' : 'opacity-0'
            }`}
            style={cursorStyles}
            initial={cursorAnimationConfig.initial}
            animate={cursorAnimationConfig.animate}
            transition={cursorAnimationConfig.transition}
          >
            <div
              className="w-10 h-10 rounded-full shadow-xl border-2 border-line-fixed bg-cover bg-center"
              style={{
                backgroundImage: `url(${project.backgroundImage})`,
                willChange: shouldUseGPUAcceleration ? 'transform' : 'auto',
                contain: 'layout style paint',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />
          </motion.div>
        )}

        {/* Content Wrapper */}
        <div
          className="w-full max-w-[1300px] 2xl:max-w-[1650px] mx-auto px-5 md:px-[30px] relative z-10"
          style={{ contain: 'layout style' }}
        >
          {/* XL: 3 Column Layout */}
          <div className="hidden xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-8 xl:w-full">
            {/* Left Column: Fixed H3 + Line + Arrow */}
            <div className="flex flex-col" style={{ contain: 'layout style' }}>
              <h3 className="text-white/30 text-lg font-light mb-2 text-left font-poppins">
                {project.date}
              </h3>
              <div className="w-full h-px bg-white opacity-30 mb-5"></div>
              <div className="flex justify-start">
                <div
                  className="cursor-pointer transition-opacity hover:opacity-70 bg-bg-overlay rounded-full p-3"
                  onClick={goToPrevious}
                >
                  <OptimizedImage
                    src="/icons/arrow-left.svg"
                    alt="Previous slide"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
              </div>
            </div>

            {/* Center Column: Fixed Title + Animated Description & Image */}
            <div className="flex flex-col items-center" style={{ contain: 'layout style' }}>
              {/* Fixed Title */}
              <h1 className="text-white text-[48px] 2xl:text-[56px] font-figtree font-medium text-left relative w-[600px] 2xl:w-[750px]">
                {project.title}
              </h1>

              {/* Animated Project Description */}
              <div className="w-[600px] 2xl:w-[750px]">
                <ProjectDescription
                  description={currentSlide.description}
                  currentProjectId={project.id}
                />
              </div>

              {/* Animated Image */}
              <div
                className="relative w-[600px] h-[360px] 2xl:w-[750px] 2xl:h-[450px] bg-main rounded-[17px] overflow-hidden cursor-none mb-14 md:mb-20"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  willChange: shouldUseGPUAcceleration ? 'transform' : 'auto',
                  contain: 'layout style paint',
                }}
              >
                <AnimatePresence>
                  <motion.div
                    key={`image-${project.id}-${currentSlide.image}`}
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${currentSlide.image})`,
                      contain: 'layout style paint',
                    }}
                    variants={imageAnimationConfig}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      duration: animationDuration,
                      ease: 'easeOut',
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Fixed Labels */}
              <div className="flex flex-wrap gap-2 mb-8 w-[600px] 2xl:w-[750px] justify-center">
                {project.labels.map((label, index) => (
                  <span
                    key={`${label}-${index}`}
                    className="text-center py-[11px] px-[17px] bg-transparent text-[#fafafa] border-[1px] border-label-project rounded-full text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Fixed H3 + Line + Arrow */}
            <div className="flex flex-col" style={{ contain: 'layout style' }}>
              <h3 className="text-white/30 text-lg font-light mb-2 text-right font-poppins">
                {project.title}
              </h3>
              <div className="w-full h-px bg-white opacity-30 mb-5"></div>
              <div className="flex justify-end">
                <div
                  className="cursor-pointer transition-opacity hover:opacity-70 bg-bg-overlay rounded-full p-3"
                  onClick={goToNext}
                >
                  <OptimizedImage
                    src="/icons/arrow-right.svg"
                    alt="Next slide"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Below XL: Standard Layout */}
          <div
            className="xl:hidden text-center flex flex-col relative z-10"
            style={{ contain: 'layout style' }}
          >
            {/* Fixed Title */}
            <h1 className="text-white text-[32px] xs:text-[36px] sm:text-[40px] md:text-[44px] lg:text-[48px] font-figtree font-medium text-left relative w-[300px] xs:w-[340px] sm:w-[380px] md:w-[500px] lg:w-[600px] mx-auto">
              {project.title}
            </h1>

            {/* Animated Project Description */}
            <div className="w-[300px] xs:w-[340px] sm:w-[380px] md:w-[500px] lg:w-[600px] mx-auto">
              <ProjectDescription
                description={currentSlide.description}
                currentProjectId={project.id}
              />
            </div>

            {/* Wrapper per immagine e bottoni esterni */}
            <div
              className="flex flex-col items-center sm:flex-row sm:justify-center sm:items-center relative mb-14 sm:mb-10 md:mb-20"
              style={{ contain: 'layout style' }}
            >
              {/* Left Arrow - esterno (da 555px in su) */}
              <div className="hidden button-outside sm:flex sm:items-center mr-8">
                <div
                  className="cursor-pointer transition-opacity hover:opacity-70 bg-bg-overlay rounded-full p-3"
                  onClick={goToPrevious}
                >
                  <OptimizedImage
                    src="/icons/arrow-left.svg"
                    alt="Previous slide"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
              </div>

              {/* Animated Image Container */}
              <div
                className="relative w-[300px] h-[185px] xs:w-[340px] xs:h-[210px] sm:w-[380px] sm:h-[235px] md:w-[500px] md:h-[300px] lg:w-[600px] lg:h-[360px] bg-main rounded-[17px] overflow-hidden cursor-none"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  willChange: shouldUseGPUAcceleration ? 'transform' : 'auto',
                  contain: 'layout style paint',
                }}
              >
                {/* Animated Image Background */}
                <AnimatePresence>
                  <motion.div
                    key={`image-mobile-${project.id}-${currentSlide.image}`}
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${currentSlide.image})`,
                      contain: 'layout style paint',
                    }}
                    variants={imageAnimationConfig}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      duration: animationDuration,
                      ease: 'easeOut',
                    }}
                  />
                </AnimatePresence>

                {/* Arrows dentro l'immagine (fino a 554px) */}
                <div className="absolute inset-0 flex items-center justify-between p-4 button-inside">
                  <div className="flex items-center gap-4">
                    {/* Left Arrow */}
                    <div
                      className="cursor-pointer transition-opacity hover:opacity-70 bg-bg-overlay rounded-full p-2"
                      onClick={goToPrevious}
                    >
                      <OptimizedImage
                        src="/icons/arrow-left.svg"
                        alt="Previous slide"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </div>

                    {/* Right Arrow */}
                    <div
                      className="cursor-pointer transition-opacity hover:opacity-70 bg-bg-overlay rounded-full p-2"
                      onClick={goToNext}
                    >
                      <OptimizedImage
                        src="/icons/arrow-right.svg"
                        alt="Next slide"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Arrow - esterno (da 555px in su) */}
              <div className="hidden button-outside sm:flex sm:items-center ml-8">
                <div
                  className="cursor-pointer transition-opacity hover:opacity-70 bg-bg-overlay rounded-full p-3"
                  onClick={goToNext}
                >
                  <OptimizedImage
                    src="/icons/arrow-right.svg"
                    alt="Next slide"
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

            {/* Fixed Labels */}
            <div className="flex flex-wrap md:flex-nowrap gap-2 mb-8 w-[300px] xs:w-[340px] sm:w-[380px] md:w-[500px] lg:w-[600px] mx-auto justify-center">
              {project.labels.map((label, index) => {
                const getWidthForSmall = (labelText: string, currentIndex: number) => {
                  // Raggruppiamo le label a coppie per riga (solo per schermi piccoli)
                  const pairIndex = Math.floor(currentIndex / 2);
                  const positionInPair = currentIndex % 2;

                  // Calcoliamo la lunghezza delle label nella coppia corrente
                  const currentPairLabels = [
                    project.labels[pairIndex * 2],
                    project.labels[pairIndex * 2 + 1],
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
                  <span
                    key={`${label}-${index}`}
                    className="text-center py-[11px] md:px-[17px] bg-transparent text-[#fafafa] border-[1px] border-label-project rounded-full text-sm font-medium md:whitespace-nowrap md-auto-width"
                    style={{
                      width: getWidthForSmall(label, index),
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
