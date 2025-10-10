'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface CookieManagerButtonProps {
  onOpenManager: () => void;
}

export default function CookieManagerButton({ onOpenManager }: CookieManagerButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  return (
    <motion.button
      onClick={onOpenManager}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-[9998] w-10 h-10 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border border-black dark:border-[#fafafa] border-opacity-50 dark:border-opacity-30 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex items-center justify-center group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={t('cookies.banner.manage')}
    >
      {/* Icona cookie SVG */}
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="text-black dark:text-[#fafafa]"
        animate={{ rotate: isHovered ? 15 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Cookie base */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Buchi del cookie */}
        <circle cx="8" cy="8" r="1.5" fill="white" className="dark:fill-[#0b0b0b]" />
        <circle cx="16" cy="8" r="1.5" fill="white" className="dark:fill-[#0b0b0b]" />
        <circle cx="12" cy="12" r="1.5" fill="white" className="dark:fill-[#0b0b0b]" />
        <circle cx="8" cy="16" r="1.5" fill="white" className="dark:fill-[#0b0b0b]" />
        <circle cx="16" cy="16" r="1.5" fill="white" className="dark:fill-[#0b0b0b]" />
        <circle cx="6" cy="12" r="1" fill="white" className="dark:fill-[#0b0b0b]" />
        <circle cx="18" cy="12" r="1" fill="white" className="dark:fill-[#0b0b0b]" />
      </motion.svg>
    </motion.button>
  );
}

