'use client';

import React, { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Label from '@/components/ui/Label';

export default function Hero() {
  useEffect(() => {
    // Carica lo script Spline solo se non è già presente
    if (!document.querySelector('script[src*="spline-viewer.js"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.27/build/spline-viewer.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="relative bg-second h-[750px] md:h-screen w-full overflow-hidden">
      {/* Spline viewer come background */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Mobile/SM: viewer attuale */}
        <div className="block md:hidden w-full h-full pointer-events-none touch-none">
          {React.createElement('spline-viewer', {
            url: 'https://prod.spline.design/VpGusEHksTg0dW5e/scene.splinecode',
            style: { width: '100%', height: '100%' },
          })}
        </div>
        {/* MD+: nuovo viewer */}
        <div className="hidden md:block w-full h-full relative">
          <div className="w-full h-[80%] lg:h-[92%]">
            {React.createElement('spline-viewer', {
              url: 'https://prod.spline.design/cb0H3zl1WQgxYSZP/scene.splinecode',
              style: { width: '100%', height: '100%' },
            })}
          </div>
          {/* Overlay gradiente basso */}
          <div className="pointer-events-none absolute left-0 bottom-0 w-full h-[500px] lg:h-[90%] bg-gradient-to-t from-black/90 to-transparent" />
        </div>
      </div>
      {/* Contenuto hero sopra lo sfondo */}
      <div className="absolute left-0 bottom-0 w-full h-[290px] z-10 flex flex-col md:flex-row items-start md:items-end justify-start md:justify-between px-5 md:px-[30px] md:pb-[75px]">
        <div className="gap-4 sm:gap-6 md:gap-3 flex flex-col items-start">
          <h1 className="w-full text-[25px] sm:text-[32px] md:text-[25px] lg:text-[32px] font-medium font-sans text-main text-left leading-tight">
            Scopri cosa significa
            <br />
            <span className="font-semibold">essere unici</span>
          </h1>
          <p
            className="w-[280px] sm:w-[320px] md:w-[280px] lg:w-[320px] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] font-medium font-sans text-main text-left leading-[1.2] md:leading-[1.5]"
            style={{ opacity: 0.6 }}
          >
            Creiamo interfacce personalizzate, per l’utente e pensate per far crescere il tuo
            business.
          </p>
          <Button className="hero-arrow px-[24px] py-2.5 text-[15px] sm:px-[32px] sm:py-3 sm:text-[17px] md:px-[24px] md:py-2.5 md:text-[15px] lg:px-[32px] lg:py-3 lg:text-[17px]">
            Scopri di più
          </Button>
        </div>
        <div className="gap-4 sm:gap-6 md:gap-3 flex flex-col items-start hidden md:flex">
          <p className="w-[280px] sm:w-[320px] md:w-[320px] lg:w-[390px] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] font-medium font-sans text-main text-left leading-[1.2] md:leading-[1.5]">
            <span className="text-main">Progettiamo esperienze digitali che funzionano.</span>
            <span className="opacity-60">
              {' '}
              Design su misura per brand moderni, siti veloci e comunicazione che converte.
            </span>
          </p>
          <div className="flex flex-row gap-2 mt-2">
            <Label>Creatività</Label>
            <Label>Professionalità</Label>
            <Label>Iniziativa</Label>
          </div>
        </div>
      </div>
      <style global jsx>{`
        .hero-arrow .arrow {
          transform: rotate(90deg) translateY(-2px) !important;
        }
      `}</style>
    </section>
  );
}
