'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks';

interface HeroProps {
  breadcrumb?: string;
  title?: string;
  backgroundImage?: string;
  className?: string;
}

// Esempio di utilizzo:
// <Hero
//   breadcrumb="Home / Servizi"
//   title="I Nostri Servizi"
//   backgroundImage="/img/services-hero.jpg"
//   className="custom-class"
// />

export default function Hero({
  breadcrumb,
  title,
  backgroundImage = '/img/contact-background.jpg',
  className = '',
}: HeroProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full 2xl:px-[55px]">
      <div className="pt-[90px] bg-[#0b0b0b] w-full 2xl:max-w-[1890px] mx-auto px-5 md:px-[30px] pb-[20px] md:pb-[30px] rounded-b-[20px]">
        <div className="relative">
          <div
            className={`w-full h-[210px] md:h-[260px] lg:h-[310px] bg-cover bg-left bg-no-repeat rounded-[20px] bg-black flex items-center justify-start px-6 relative overflow-hidden ${className}`}
            style={{ backgroundImage: `url(${backgroundImage})` }}
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
                  key={`breadcrumb-${breadcrumb || t('contact.hero.breadcrumb')}`}
                  className="text-sm text-white/70 font-medium"
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
                  {breadcrumb || t('contact.hero.breadcrumb')}
                </motion.h4>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${title || t('contact.hero.title')}`}
                  className="text-[35px] md:text-[50px] lg:text-[60px] font-figtree font-light text-white"
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
                  {title || t('contact.hero.title')}
                </motion.h1>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
