'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks';

export default function Title() {
  const { t } = useTranslation();
  const [isWideEnough, setIsWideEnough] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideEnough(window.innerWidth >= 429);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="pt-14">
      <div className="text-left">
        <AnimatePresence mode="wait">
          <motion.h4
            key={`subtitle-${t('contact.section.subtitle')}`}
            className="text-sm text-[#0b0b0b] dark:text-[#f4f4f4] mb-4 font-medium text-[14px] lg:text-[16px]"
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
            className="text-[28px] sm:text-[33px] md:text-[38px] lg:text-[43px] font-figtree font-light text-[#0b0b0b] dark:text-[#f4f4f4] leading-tight"
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
            {t('contact.section.title').includes('sempre pronti')
              ? isWideEnough
                ? // Da 429px in su: break dopo "pronti a"
                  t('contact.section.title')
                    .split('pronti a')
                    .map((part, index) =>
                      index === 0 ? (
                        <React.Fragment key={index}>
                          {part}pronti a
                          <br />
                        </React.Fragment>
                      ) : (
                        part
                      )
                    )
                : // Sotto 429px: break dopo "sempre pronti"
                  t('contact.section.title')
                    .split('sempre pronti')
                    .map((part, index) =>
                      index === 0 ? (
                        <React.Fragment key={index}>
                          {part}sempre pronti
                          <br />
                        </React.Fragment>
                      ) : (
                        part
                      )
                    )
              : t('contact.section.title').includes('ready to')
                ? // Inglese: sempre dopo "ready to"
                  t('contact.section.title')
                    .split('ready to')
                    .map((part, index) =>
                      index === 0 ? (
                        <React.Fragment key={index}>
                          {part}ready to
                          <br />
                        </React.Fragment>
                      ) : (
                        part
                      )
                    )
                : t('contact.section.title')}
          </motion.h2>
        </AnimatePresence>
      </div>
    </div>
  );
}
