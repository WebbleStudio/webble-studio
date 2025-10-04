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
      className="fixed bottom-6 right-6 z-[9998] w-10 h-10 bg-white hover:bg-gray-50 border border-black border-opacity-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex items-center justify-center group"
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
        className="text-black"
        animate={{ rotate: isHovered ? 15 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Cookie base nero */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Buchi bianchi del cookie */}
        <circle cx="8" cy="8" r="1.5" fill="white" />
        <circle cx="16" cy="8" r="1.5" fill="white" />
        <circle cx="12" cy="12" r="1.5" fill="white" />
        <circle cx="8" cy="16" r="1.5" fill="white" />
        <circle cx="16" cy="16" r="1.5" fill="white" />
        <circle cx="6" cy="12" r="1" fill="white" />
        <circle cx="18" cy="12" r="1" fill="white" />
      </motion.svg>
    </motion.button>
  );
}

