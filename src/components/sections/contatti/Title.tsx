'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

export default function Title() {
  const { t } = useTranslation();

  return (
    <div className="pt-14">
      <div className="text-left">
        <AnimatePresence mode="wait">
          <motion.h4
            key={`subtitle-${t('contact.section.subtitle')}`}
            className="text-sm text-[#0b0b0b] dark:text-[#f4f4f4] mb-4 font-medium text-[14px]"
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
            {t('contact.section.subtitle')}
          </motion.h4>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.h2
            key={`title-${t('contact.section.title')}`}
            className="text-[28px] font-figtree font-light text-[#0b0b0b] dark:text-[#f4f4f4] leading-tight w-[350px]"
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
            {t('contact.section.title')}
          </motion.h2>
        </AnimatePresence>
      </div>
    </div>
  );
}
