'use client';

import React from 'react';
import AnimatedText from '@/components/ui/AnimatedText';

export default function PortfolioHero() {
  return (
    <section className="min-h-[60vh] bg-bg-primary text-text-primary flex items-center">
      <div className="w-full max-w-[1300px] mx-auto px-5 md:px-[30px] py-16">
        <div className="text-center">
          <AnimatedText
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-figtree font-medium mb-6"
          >
            Portfolio
          </AnimatedText>
          <AnimatedText
            as="p"
            className="text-text-primary-60 text-lg md:text-xl max-w-2xl mx-auto"
          >
            I nostri progetti e realizzazioni, organizzati in un layout responsivo che si adatta
            perfettamente a ogni dispositivo.
          </AnimatedText>
        </div>
      </div>
    </section>
  );
}
