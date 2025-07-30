'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/ui/AnimatedText';
import { useServiceCategoryAnimation } from '../animations/useServiceCategoryAnimation';
import { useServiceImages } from '@/hooks/useServiceImages';

interface ServiceCategoryProps {
  number: string;
  title: string;
  labels: string[];
  paragraph: string;
  className?: string;
  categorySlug?: string; // Aggiungiamo il slug per identificare la categoria
}

export default function ServiceCategory({
  number,
  title,
  labels,
  paragraph,
  className = '',
  categorySlug,
}: ServiceCategoryProps) {
  const {
    isExpanded,
    showLeftFade,
    showRightFade,
    showLeftFadeRectangles,
    showRightFadeRectangles,
    scrollContainerRef,
    rectanglesContainerRef,
    toggleExpansion,
    titleAnimationProps,
    containerAnimationProps,
    labelsAnimationProps,
    paragraphAnimationProps,
    rectanglesAnimationProps,
    scrollStyles,
  } = useServiceCategoryAnimation();

  // Ottieni i progetti per questa categoria
  const { getProjectsForCategory } = useServiceImages();
  const categoryProjects = categorySlug ? getProjectsForCategory(categorySlug) : [];

  return (
    <div className={`flex flex-col items-start ${className}`}>
      {/* Header section - always visible */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full h-[1px] bg-line-fixed"></div>
        <h4 className="text-[100%] text-text-primary font-poppins font-medium md:mb-[25px] xl:text-[19px]">
          <AnimatedText>{number}</AnimatedText>
        </h4>
      </div>

      {/* Content wrapper */}
      <div className="w-full flex flex-col md:mb-[15px]">
        {/* Clickable h2 - title principale NON animato come richiesto */}
        <motion.h2
          className="text-text-primary-60 data-[expanded=true]:text-text-primary text-[53px] sm:text-[63px] md:text-[68px] xl:text-[78px] 2xl:text-[93px] cursor-pointer w-full leading-tight hover:text-text-primary"
          onClick={toggleExpansion}
          data-expanded={isExpanded}
          {...titleAnimationProps}
        >
          {title}
        </motion.h2>

        {/* Expandable content - sempre nel DOM ma condizionalmente visibile */}
        <motion.div
          className="w-full flex flex-col gap-4 md:gap-6 mb-[45px]"
          {...containerAnimationProps}
        >
          {/* Content and rectangles wrapper */}
          <div className="flex flex-col md:flex-row md:gap-8 md:justify-between">
            {/* Left column - labels and paragraph */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Labels container */}
              <motion.div className="w-full relative" {...labelsAnimationProps}>
                {/* Extract scroll container from labels content */}
                <div
                  ref={scrollContainerRef}
                  className="w-full overflow-x-auto"
                  style={scrollStyles}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div className="flex gap-2 min-w-auto">
                    {labels.map((label, index) => (
                      <span
                        key={index}
                        className="px-[17px] py-[11px] bg-transparent text-text-primary border border-line-fixed rounded-full text-sm xl:text-base font-medium whitespace-nowrap"
                      >
                        <AnimatedText>{label}</AnimatedText>
                      </span>
                    ))}
                  </div>
                </div>
                {showLeftFade && (
                  <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#fafafa] dark:from-[#0b0b0b] to-transparent pointer-events-none transition-opacity duration-200"></div>
                )}
                {showRightFade && (
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#fafafa] dark:from-[#0b0b0b] to-transparent pointer-events-none transition-opacity duration-200"></div>
                )}
              </motion.div>

              {/* Paragraph */}
              <motion.div
                className="text-text-primary-60 text-[14px] sm:text-[16px] xl:text-[18px] sm:w-[430px]"
                {...paragraphAnimationProps}
              >
                <AnimatedText as="div">{paragraph}</AnimatedText>
              </motion.div>
            </div>

            {/* Right column - rectangles (solo se ci sono progetti) */}
            {categoryProjects.length > 0 && (
              <motion.div
                className="w-full md:w-auto relative overflow-x-auto mt-6 md:mt-0"
                {...rectanglesAnimationProps}
              >
                {/* Extract scroll container from rectangles content */}
                <div
                  ref={rectanglesContainerRef}
                  className="w-full overflow-x-auto"
                  style={scrollStyles}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div className="flex gap-4">
                    {categoryProjects.slice(0, 3).map((project, index) => (
                      <div
                        key={project.id}
                        className="w-[200px] h-[130px] sm:w-[230px] sm:h-[160px] md:w-[185px] md:h-[115px] xl:w-[200px] xl:h-[130px] bg-bg-secondary rounded-2xl flex-shrink-0 overflow-hidden cursor-pointer hover:scale-95 transition-transform duration-200"
                      >
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-full"
                          >
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ) : (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {showLeftFadeRectangles && (
                  <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#fafafa] dark:from-[#0b0b0b] to-transparent pointer-events-none transition-opacity duration-200"></div>
                )}
                {showRightFadeRectangles && (
                  <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#fafafa] dark:from-[#0b0b0b] to-transparent pointer-events-none transition-opacity duration-200"></div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
