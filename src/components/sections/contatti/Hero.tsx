'use client';

import React from 'react';
import { useTranslation } from '@/hooks';
import HeroWithButton from '@/components/ui/HeroWithButton';

export default function Hero() {
  const { t, currentLanguage } = useTranslation();

  const titleContent = currentLanguage === 'en' ? (
    <>
      Contact now
      <br />
      <span className="font-semibold">Webble Studio</span>
    </>
  ) : (
    <>
      Contatta ora
      <br />
      <span className="font-semibold">Webble Studio</span>
    </>
  );

  return (
    <HeroWithButton
      breadcrumb={t('contact.hero.breadcrumb')}
      title={titleContent}
      buttonText={t('contact.hero.cta_button')}
      backgroundImage="/img/hero-projects.jpg"
      showButton={true}
      language={currentLanguage}
    />
  );
}
