import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { currentLanguage, toggleLanguage, mounted } = useTranslation();

  // Non renderizzare nulla finché non è montato (evita hydration mismatch)
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`p-2 rounded-lg transition-colors duration-200 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-[#fafafa] flex items-center justify-center focus:outline-none ${className}`}
      aria-label={`Switch to ${currentLanguage === 'it' ? 'English' : 'Italian'}`}
    >
      <span className="font-semibold text-xs leading-none w-4 h-4 flex items-center justify-center">
        {currentLanguage === 'it' ? 'IT' : 'EN'}
      </span>
    </button>
  );
}
