'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedText from '@/components/ui/AnimatedText';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function Hero2() {
  const { t } = useTranslation();

  return (
    <section className="h-auto md:h-screen w-full bg-black flex items-center justify-center px-4 md:px-[30px] xl:px-20 pt-[150px]">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[#f4f4f4] text-[33px] font-semibold leading-tight mb-4 w-[320px] sm:w-[400px]">
          <AnimatedText>{t('hero2.title')}</AnimatedText>
        </h1>
        <p className="text-[#989898] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[22px] font-medium font-figtree leading-[1.2] md:leading-[1.5] max-w-[240px] xs:max-w-[320px] sm:max-w-[400px] mb-6">
          <AnimatedText as="span">{t('hero2.description')}</AnimatedText>
        </p>
        
        <div className="flex flex-row gap-3 items-center">
          <button className="bg-white text-black rounded-xl px-6 py-2.5 hover:bg-gray-100 transition-all duration-300 font-medium text-[15px]">
            Scopri di più
          </button>
          
          <button className="bg-transparent border border-white text-white rounded-xl px-6 py-2.5 hover:bg-white/10 transition-all duration-300 font-medium text-[15px]">
            Servizi
          </button>
        </div>
        
        <div className="w-full mt-[50px]">
          <OptimizedImage
            src="/img/hero-mobile-proj.png"
            alt="Hero Mobile Projects"
            width={800}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}