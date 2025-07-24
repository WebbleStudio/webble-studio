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
      className={`px-2 py-1 text-sm font-medium transition-colors duration-200 text-[#fafafa] flex items-center justify-center focus:outline-none ${className}`}
      aria-label={`Switch to ${currentLanguage === 'it' ? 'English' : 'Italian'}`}
      style={{ background: 'none', border: 'none', boxShadow: 'none' }}
    >
      <span className="font-semibold">{currentLanguage === 'it' ? 'IT' : 'EN'}</span>
    </button>
  );
}
