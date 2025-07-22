'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useServiceCategoryAnimation } from '../animations/useServiceCategoryAnimation';

interface ServiceCategoryProps {
  number: string;
  title: string;
  labels: string[];
  paragraph: string;
  className?: string;
}

export default function ServiceCategory({
  number,
  title,
  labels,
  paragraph,
  className = '',
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

  return (
    <div className={`flex flex-col items-start ${className}`}>
      {/* Header section - always visible */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full h-[1px] bg-second dark:bg-[#fafafa]/50"></div>
        <h4 className="text-[100%] text-second dark:text-[#fafafa] font-poppins font-medium md:mb-[25px] xl:text-[19px]">
          {number}
        </h4>
      </div>

      {/* Content wrapper */}
      <div className="w-full flex flex-col md:mb-[15px]">
        {/* Clickable h2 */}
        <motion.h2
          className="text-second dark:text-[#fafafa]/60 dark:data-[expanded=true]:text-[#fafafa] text-[53px] sm:text-[63px] md:text-[68px] xl:text-[78px] 2xl:text-[93px] cursor-pointer w-full leading-tight hover:dark:text-[#fafafa]/80"
          style={{ transformOrigin: 'left' }}
          onClick={toggleExpansion}
          data-expanded={isExpanded}
          {...titleAnimationProps}
        >
          {title}
        </motion.h2>

        {/* Expandable content - always in DOM */}
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
                        className="px-[17px] py-[11px] bg-transparent text-black border border-black dark:text-[#fafafa] dark:border-[#fafafa] rounded-full text-sm xl:text-base font-medium whitespace-nowrap"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                {showLeftFade && (
                  <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#fafafa] to-transparent pointer-events-none transition-opacity duration-200"></div>
                )}
                {showRightFade && (
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#fafafa] to-transparent pointer-events-none transition-opacity duration-200"></div>
                )}
              </motion.div>

              {/* Paragraph */}
              <motion.p
                className="text-second dark:text-[#fafafa] text-[14px] sm:text-[16px] xl:text-[18px] sm:w-[430px] opacity-60"
                {...paragraphAnimationProps}
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            </div>

            {/* Right column - rectangles */}
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
                  <div className="w-[200px] h-[130px] sm:w-[230px] sm:h-[160px] md:w-[185px] md:h-[115px] xl:w-[200px] xl:h-[130px] bg-black dark:bg-[#fafafa] rounded-2xl flex-shrink-0"></div>
                  <div className="w-[200px] h-[130px] sm:w-[230px] sm:h-[160px] md:w-[185px] md:h-[115px] xl:w-[200px] xl:h-[130px] bg-black dark:bg-[#fafafa] rounded-2xl flex-shrink-0"></div>
                  <div className="w-[200px] h-[130px] sm:w-[230px] sm:h-[160px] md:w-[185px] md:h-[115px] xl:w-[200px] xl:h-[130px] bg-black dark:bg-[#fafafa] rounded-2xl flex-shrink-0"></div>
                </div>
              </div>
              {showLeftFadeRectangles && (
                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#fafafa] to-transparent pointer-events-none transition-opacity duration-200"></div>
              )}
              {showRightFadeRectangles && (
                <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#fafafa] to-transparent pointer-events-none transition-opacity duration-200"></div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
