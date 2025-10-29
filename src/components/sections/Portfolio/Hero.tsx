'use client';

import React from 'react';
import HeroWithButton from '@/components/ui/HeroWithButton';
import AnimatedText from '@/components/ui/AnimatedText';
import { useTranslation } from '@/hooks';

/**
 * Portfolio Hero - Client Component
 * Mantiene le animazioni mentre garantisce il contenuto statico per SEO
 * Il contenuto HTML è presente nel DOM prima dell'idratazione
 */
export default function Hero() {
  const { t, currentLanguage } = useTranslation();

  const getStyledTitle = () => {
    return (
      <AnimatedText>
        <span className="block">
          Dove la <span className="font-medium">creatività</span>
        </span>
        <span className="block">
          incontra la <span className="font-medium">strategia</span>
        </span>
      </AnimatedText>
    );
  };

  const getButtonText = () => {
    return currentLanguage === 'en' ? 'Book a call' : 'Prenota una call';
  };

  return (
    <HeroWithButton
      breadcrumb="Portfolio"
      title={getStyledTitle()}
      buttonText={getButtonText()}
      backgroundImage="/img/hero-projects.jpg"
      showButton={true}
      language={currentLanguage}
    />
  );
}
