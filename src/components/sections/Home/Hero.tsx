'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Label from '@/components/ui/Label';
import { useSplineLazyLoad } from '@/components/animations/useSplineLazyLoad';

export default function Hero() {
  const { containerRef, isLoaded, mobileUrl, desktopUrl } = useSplineLazyLoad({
    mobileUrl: 'https://prod.spline.design/VpGusEHksTg0dW5e/scene.splinecode',
    desktopUrl: 'https://prod.spline.design/cb0H3zl1WQgxYSZP/scene.splinecode',
    delay: 500, // Carica dopo 500ms per dare priorità al contenuto
  });

  return (
    <section className="relative bg-second h-[750px] md:h-screen w-full overflow-hidden">
      {/* Spline viewer come background */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="w-full h-full bg-gradient-to-br from-main/5 to-second/10 animate-pulse" />
        )}

        {/* Mobile/SM: viewer attuale */}
        {isLoaded && (
          <div className="block md:hidden w-full h-full min-h-[750px] pointer-events-none touch-none">
            {React.createElement('spline-viewer', {
              url: mobileUrl,
              style: { width: '100%', height: '100%', minHeight: '750px' },
              className: 'spline-dark-mask',
            })}
          </div>
        )}

        {/* MD+: nuovo viewer */}
        {isLoaded && (
          <div className="hidden md:block w-full h-full min-h-screen relative">
            <div className="w-full h-[80%] lg:h-[90%]">
              {React.createElement('spline-viewer', {
                url: desktopUrl,
                style: { width: '100%', height: '100%', minHeight: '600px' },
                className: 'spline-dark-mask',
              })}
            </div>
            {/* Overlay gradiente basso */}
            <div className="pointer-events-none absolute left-0 bottom-0 w-full h-[500px] lg:h-[90%] bg-gradient-to-t from-black/90 to-transparent dark:hidden" />
          </div>
        )}
      </div>
      {/* Contenuto hero sopra lo sfondo */}
      <div className="absolute left-1/2 bottom-0 w-full max-w-[1300px] 2xl:max-w-[1650px] h-[290px] z-10 flex flex-col md:flex-row items-start md:items-end justify-start md:justify-between px-5 md:px-[30px] md:pb-[75px] -translate-x-1/2">
        <div className="gap-4 sm:gap-6 md:gap-3 flex flex-col items-start">
          <h1 className="w-full text-[25px] sm:text-[32px] md:text-[25px] lg:text-[32px] xl:text-[40px] 2xl:text-[50px] font-medium font-sans text-main text-left leading-tight">
            Scopri cosa significa
            <br />
            <span className="font-semibold">essere unici</span>
          </h1>
          <p
            className="w-[280px] sm:w-[320px] md:w-[280px] lg:w-[320px] xl:w-[400px] 2xl:w-[500px] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[22px] font-medium font-sans text-main text-left leading-[1.2] md:leading-[1.5]"
            style={{ opacity: 0.6 }}
          >
            Creiamo interfacce personalizzate, per l’utente e pensate per far crescere il tuo
            business.
          </p>
          <Button className="hero-arrow px-[24px] py-2.5 text-[15px] sm:px-[32px] sm:py-3 sm:text-[17px] md:px-[24px] md:py-2.5 md:text-[15px] lg:px-[32px] lg:py-3 lg:text-[17px] xl:px-[40px] xl:py-4 xl:text-[20px] 2xl:px-[48px] 2xl:py-5 2xl:text-[24px]">
            Scopri di più
          </Button>
        </div>
        <div className="gap-4 sm:gap-6 md:gap-3 flex flex-col items-start hidden md:flex">
          <p className="w-[280px] sm:w-[320px] md:w-[320px] lg:w-[390px] xl:w-[400px] 2xl:w-[500px] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[22px] font-medium font-sans text-main text-left leading-[1.2] md:leading-[1.5]">
            <span className="text-main">Progettiamo esperienze digitali che funzionano.</span>
            <span className="opacity-60">
              {' '}
              Design su misura per brand moderni, siti veloci e comunicazione che converte.
            </span>
          </p>
          <div className="flex flex-row gap-2 mt-2">
            <Label className="xl:px-[32px] xl:py-3 xl:text-[18px] 2xl:px-[40px] 2xl:py-4 2xl:text-[22px]">
              Creatività
            </Label>
            <Label className="xl:px-[32px] xl:py-3 xl:text-[18px] 2xl:px-[40px] 2xl:py-4 2xl:text-[22px]">
              Design
            </Label>
            <Label className="xl:px-[32px] xl:py-3 xl:text-[18px] 2xl:px-[40px] 2xl:py-4 2xl:text-[22px]">
              Strategia
            </Label>
          </div>
        </div>
      </div>
      <style global jsx>{`
        .hero-arrow .arrow {
          transform: rotate(90deg) translateY(-2px) !important;
        }

        .dark .spline-dark-mask {
          -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 90%);
          mask-image: linear-gradient(to bottom, black 60%, transparent 90%);
        }
      `}</style>
    </section>
  );
}
