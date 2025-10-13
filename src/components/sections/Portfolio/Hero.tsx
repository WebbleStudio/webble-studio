'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="w-full 2xl:px-[5px]">
      <div className="pt-[90px] bg-[#0b0b0b] w-full 2xl:max-w-[1890px] mx-auto px-[15px] md:px-[30px] pb-[15px] md:pb-[30px] rounded-b-[20px] border border-[#f4f4f4]/10">
        <div className="relative">
          <div
            className="w-full h-auto min-h-[210px] md:min-h-[260px] lg:min-h-[310px] bg-cover bg-left bg-no-repeat rounded-[20px] bg-black flex items-center justify-start px-6 py-8 relative overflow-hidden"
            style={{ backgroundImage: 'url(/img/hero-projects.jpg?v=1)' }}
          >
            {/* Gradient overlay from black to transparent */}
            <div
              className="absolute inset-0 rounded-[20px]"
              style={{
                background:
                  'linear-gradient(to right, rgba(11, 11, 11, 0.6) 0%, rgba(11, 11, 11, 0.4) 30%, rgba(11, 11, 11, 0.2) 60%, transparent 100%)',
              }}
            />
            <div className="flex flex-col items-start justify-center h-full relative z-10">
              <AnimatePresence mode="wait">
                <motion.h4
                  key={`breadcrumb-${t('portfolio.hero.breadcrumb')}`}
                  className="text-sm text-white/70 font-medium mb-2 sm:mb-3"
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
                  {t('portfolio.hero.breadcrumb')}
                </motion.h4>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${t('portfolio.hero.title')}`}
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
                  Dove la <span className="font-medium">creatività</span> <br />
                  incontra la <span className="font-medium">strategia</span>
                </motion.h1>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`description-${t('portfolio.hero.description')}`}
                  className="text-[10px] xs:text-[12px] xs:w-[290px] w-[250px] md:text-[16px] md:w-[390px] text-white/80 font-light mt-3 sm:mt-4 max-w-2xl leading-relaxed"
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
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {t('portfolio.hero.description')}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
