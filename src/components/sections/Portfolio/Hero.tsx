'use client';

import React from 'react';
import { useTranslation } from '@/hooks';
import HeroWithButton from '@/components/ui/HeroWithButton';
import AnimatedText from '@/components/ui/AnimatedText';

export default function Hero() {
  const { t, currentLanguage } = useTranslation();

  // Rendering dinamico del titolo con AnimatedText e styling basato sulla lingua
  const getStyledTitle = () => {
    if (currentLanguage === 'it') {
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
    } else {
      // Inglese: "Where creativity meets strategy"
      return (
        <AnimatedText>
          <span className="block">
            Where <span className="font-medium">creativity</span>
          </span>
          <span className="block">
            meets <span className="font-medium">strategy</span>
          </span>
        </AnimatedText>
      );
    }
  };

  return (
    <HeroWithButton
      breadcrumb={t('portfolio.hero.breadcrumb')}
      title={getStyledTitle()}
      buttonText={t('portfolio.hero.cta_button')}
      backgroundImage="/img/hero-projects.jpg"
      showButton={true}
      language={currentLanguage}
    />
  );
}
