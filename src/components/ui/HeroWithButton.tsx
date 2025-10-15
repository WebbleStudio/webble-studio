'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks';
import BookingForm from '@/components/ui/BookingForm';

interface HeroWithButtonProps {
  breadcrumb?: string;
  title?: string | React.ReactNode;
  buttonText?: string;
  backgroundImage?: string;
  showButton?: boolean;
  className?: string;
  language?: string;
}

export default function HeroWithButton({
  breadcrumb,
  title,
  buttonText,
  backgroundImage = '/img/hero-projects.jpg',
  showButton = true,
  className = '',
  language = 'it',
}: HeroWithButtonProps) {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="w-full 2xl:px-[5px]">
      <div className="pt-[90px] bg-[#0b0b0b] w-full 2xl:max-w-[1890px] mx-auto px-[15px] md:px-[30px] pb-[15px] md:pb-[30px] rounded-b-[20px] border border-[#f4f4f4]/10">
        <div className="relative">
          <div
            className={`w-full h-auto min-h-[210px] md:min-h-[260px] lg:min-h-[310px] bg-cover bg-left bg-no-repeat rounded-[20px] bg-black flex items-center justify-start px-6 py-8 relative overflow-hidden group ${className}`}
          >
            {/* Background Image statica */}
            <div
              className="absolute inset-0 rounded-[20px] bg-cover bg-left bg-no-repeat"
              style={{ backgroundImage: `url(${backgroundImage}?v=1)` }}
            />

            {/* Gradient overlay from black to transparent */}
            <div
              className="absolute inset-0 rounded-[20px] pointer-events-none z-[1]"
              style={{
                background:
                  'linear-gradient(to right, rgba(11, 11, 11, 0.6) 0%, rgba(11, 11, 11, 0.4) 30%, rgba(11, 11, 11, 0.2) 60%, transparent 100%)',
              }}
            />
            <div className="flex flex-col items-start justify-center h-full relative z-10 w-full max-w-[1300px] 2xl:max-w-[1650px] mx-auto xl:px-[30px] xl:min-h-[350px] 2xl:min-h-[450px] pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.h4
                  key={`breadcrumb-${breadcrumb}`}
                  className="text-sm text-white/70 font-medium mb-2 sm:mb-3 lg:mb-4 2xl:mb-6"
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
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {breadcrumb}
                </motion.h4>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${typeof title === 'string' ? title : 'title'}`}
                  className="text-[27px] xs:text-[30px] sm:text-[32px] md:text-[45px] lg:text-[60px] font-figtree font-light text-white leading-none"
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
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {title}
                </motion.h1>
              </AnimatePresence>
              {showButton && (
                <AnimatePresence mode="wait">
                  <motion.button
                    key={`cta-button-${language}-${buttonText}`}
                    className="
                      relative px-5 py-2.5 pointer-events-auto 
                      text-sm md:text-base font-medium 
                      text-[#181818] 
                      bg-white 
                      border-[2px] border-white 
                      rounded-lg 
                      shadow-[0_0_0_rgba(255,255,255,0.55)] 
                      transition-all duration-300 ease-in-out 
                      cursor-pointer
                      hover:bg-transparent hover:text-white hover:shadow-[0_0_25px_rgba(255,255,255,0.55)]
                      active:scale-95
                      mt-[18px] sm:mt-[22px] lg:mt-[32px] 2xl:mt-[40px]
                    "
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    onClick={handleOpenForm}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                  >
                    <span className="relative z-10">{buttonText}</span>

                    {/* Star 1 */}
                    <div
                      className="
                        absolute w-[25px] 
                        transition-all duration-[1000ms] ease-[cubic-bezier(0.05,0.83,0.43,0.96)]
                      "
                      style={{
                        top: isButtonHovered ? '-80%' : '20%',
                        left: isButtonHovered ? '-30%' : '20%',
                        zIndex: isButtonHovered ? 2 : -5,
                        filter: isButtonHovered
                          ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                          : 'drop-shadow(0 0 0 rgba(255,255,255,0.8))',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 784.11 815.53"
                        className="w-full h-auto fill-white"
                      >
                        <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
                      </svg>
                    </div>

                    {/* Star 2 */}
                    <div
                      className="
                        absolute w-[15px]
                        transition-all duration-[1000ms] ease-[cubic-bezier(0,0.4,0,1.01)]
                      "
                      style={{
                        top: isButtonHovered ? '-25%' : '45%',
                        left: isButtonHovered ? '10%' : '45%',
                        zIndex: isButtonHovered ? 2 : -5,
                        filter: isButtonHovered
                          ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                          : 'drop-shadow(0 0 0 rgba(255,255,255,0.8))',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 784.11 815.53"
                        className="w-full h-auto fill-white"
                      >
                        <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
                      </svg>
                    </div>

                    {/* Star 3 */}
                    <div
                      className="
                        absolute w-[5px]
                        transition-all duration-[1000ms] ease-[cubic-bezier(0,0.4,0,1.01)]
                      "
                      style={{
                        top: isButtonHovered ? '55%' : '40%',
                        left: isButtonHovered ? '25%' : '40%',
                        zIndex: isButtonHovered ? 2 : -5,
                        filter: isButtonHovered
                          ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                          : 'drop-shadow(0 0 0 rgba(255,255,255,0.8))',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 784.11 815.53"
                        className="w-full h-auto fill-white"
                      >
                        <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
                      </svg>
                    </div>

                    {/* Star 4 */}
                    <div
                      className="
                        absolute w-[8px]
                        transition-all duration-[800ms] ease-[cubic-bezier(0,0.4,0,1.01)]
                      "
                      style={{
                        top: isButtonHovered ? '30%' : '20%',
                        left: isButtonHovered ? '80%' : '40%',
                        zIndex: isButtonHovered ? 2 : -5,
                        filter: isButtonHovered
                          ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                          : 'drop-shadow(0 0 0 rgba(255,255,255,0.8))',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 784.11 815.53"
                        className="w-full h-auto fill-white"
                      >
                        <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
                      </svg>
                    </div>

                    {/* Star 5 */}
                    <div
                      className="
                        absolute w-[15px]
                        transition-all duration-[600ms] ease-[cubic-bezier(0,0.4,0,1.01)]
                      "
                      style={{
                        top: isButtonHovered ? '25%' : '25%',
                        left: isButtonHovered ? '115%' : '45%',
                        zIndex: isButtonHovered ? 2 : -5,
                        filter: isButtonHovered
                          ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                          : 'drop-shadow(0 0 0 rgba(255,255,255,0.8))',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 784.11 815.53"
                        className="w-full h-auto fill-white"
                      >
                        <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
                      </svg>
                    </div>

                    {/* Star 6 */}
                    <div
                      className="
                        absolute w-[5px]
                        transition-all duration-[800ms] ease-in-out
                      "
                      style={{
                        top: isButtonHovered ? '5%' : '5%',
                        left: isButtonHovered ? '60%' : '50%',
                        zIndex: isButtonHovered ? 2 : -5,
                        filter: isButtonHovered
                          ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                          : 'drop-shadow(0 0 0 rgba(255,255,255,0.8))',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 784.11 815.53"
                        className="w-full h-auto fill-white"
                      >
                        <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
                      </svg>
                    </div>
                  </motion.button>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      <BookingForm isOpen={isFormOpen} onClose={handleCloseForm} />
    </div>
  );
}
