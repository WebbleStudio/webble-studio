'use client';

import React from 'react';
import Label from '@/components/ui/Label';
import OptimizedImage from '@/components/ui/OptimizedImage';
import AnimatedText from '@/components/ui/AnimatedText';
import AnimatedHeroTitle from '@/components/ui/AnimatedHeroTitle';
import { useSplineLazyLoad } from '@/components/animations/useSplineLazyLoad';
import { useTranslation } from '@/hooks/useTranslation';
import { usePerformance } from '@/hooks/usePerformance';

export default function Hero() {
  const { t } = useTranslation();
  const { shouldReduceAnimations, shouldSkipAnimation } = usePerformance();

  const { containerRef, isLoaded, isLoading, shouldRender, mobileUrl, desktopUrl } =
    useSplineLazyLoad({
      mobileUrl: 'https://prod.spline.design/VpGusEHksTg0dW5e/scene.splinecode',
      desktopUrl: 'https://prod.spline.design/cb0H3zl1WQgxYSZP/scene.splinecode',
      delay: shouldReduceAnimations ? 100 : 300,
    });

  // Funzione di scroll smooth
  const scrollToPayoff = () => {
    const payoffTitle = document.getElementById('payoff-title');
    if (!payoffTitle) return;

    payoffTitle.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-second h-[750px] md:h-screen w-full overflow-hidden">
      {/* Enhanced Spline viewer container con transizioni fluide */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{
          contain: 'layout style paint', // Performance optimization
          minWidth: '1px', // Prevents zero-width WebGL context
          minHeight: '1px', // Prevents zero-height WebGL context
        }}
      >
        {/* Enhanced Loading placeholder con skeleton più realistico */}
        {(isLoading || (shouldRender && !isLoaded)) && (
          <div
            className={`w-full h-full bg-gradient-to-br from-main/5 to-second/10 transition-opacity duration-500 ${
              isLoading ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              willChange: 'opacity',
            }}
          >
            {/* Skeleton loader ottimizzato e più performante */}
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-br from-second/20 to-main/10" />

              {/* Loading indicator centrale */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className={`w-32 h-32 bg-main/20 rounded-full ${
                    !shouldSkipAnimation('light') ? 'animate-pulse' : ''
                  }`}
                />
                {/* Subtle loading dots se le animazioni sono abilitate */}
                {!shouldSkipAnimation('light') && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1">
                    <div
                      className="w-2 h-2 bg-main/40 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-main/40 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-main/40 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                )}
              </div>

              {/* Gradient overlays per better integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-second via-transparent to-transparent opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-b from-second/20 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* Mobile Spline Viewer con transizione fluida */}
        {isLoaded && shouldRender && (
          <div
            className={`block md:hidden w-full h-full min-h-[750px] pointer-events-none touch-none transition-opacity duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              willChange: 'opacity',
            }}
          >
            {React.createElement('spline-viewer', {
              url: mobileUrl,
              style: {
                width: '100%',
                height: '100%',
                minHeight: '750px',
                // Ottimizzazioni performance avanzate
                willChange: 'transform',
                transform: 'translateZ(0)', // Force hardware acceleration
                backfaceVisibility: 'hidden', // Prevent flickering
                WebkitBackfaceVisibility: 'hidden',
              },
              className: 'spline-dark-mask',
              loading: 'lazy',
              // Performance attributes
              'data-performance': shouldReduceAnimations ? 'reduced' : 'full',
            })}
          </div>
        )}

        {/* Desktop Spline Viewer con transizione fluida */}
        {isLoaded && shouldRender && (
          <div
            className={`hidden md:block w-full h-full min-h-screen transition-opacity duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              willChange: 'opacity',
            }}
          >
            {React.createElement('spline-viewer', {
              url: desktopUrl,
              style: {
                width: '100%',
                height: '100%',
                // Ottimizzazioni performance avanzate
                willChange: 'transform',
                transform: 'translateZ(0)', // Force hardware acceleration
                backfaceVisibility: 'hidden', // Prevent flickering
                WebkitBackfaceVisibility: 'hidden',
              },
              className: 'spline-dark-mask',
              loading: 'lazy',
              // Performance attributes
              'data-performance': shouldReduceAnimations ? 'reduced' : 'full',
            })}
          </div>
        )}
      </div>

      {/* Content wrapper con ottimizzazioni GPU */}
      <div
        className="absolute left-1/2 bottom-0 w-full max-w-[1300px] xl:max-w-none 2xl:max-w-[2000px] h-[290px] z-10 flex flex-col md:flex-row items-start md:items-end justify-start md:justify-between px-5 md:px-[30px] xl:px-20 md:pb-[75px] 2xl:pb-[150px] -translate-x-1/2"
        style={{
          willChange: 'transform',
          contain: 'layout style', // Performance isolation
        }}
      >
        {/* Left content section */}
        <div className="gap-4 sm:gap-6 md:gap-3 flex flex-col items-start">
          <h1 className="w-full text-[25px] xs:text-[30px] sm:text-[32px] md:text-[25px] lg:text-[32px] xl:text-[40px] 2xl:text-[50px] font-figtree text-main text-left leading-tight">
            <AnimatedHeroTitle text={t('hero.title_start')} className="font-light" delay={500} />
            <br />
            <AnimatedHeroTitle text={t('hero.title_bold')} className="font-semibold" delay={800} />
          </h1>
          <AnimatedText
            as="p"
            className="w-[280px] xs:w-[300px] sm:w-[320px] md:w-[280px] lg:w-[320px] xl:w-[400px] 2xl:w-[500px] text-[14px] xs:text-[17px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[22px] font-medium font-figtree text-left leading-[1.2] md:leading-[1.5] mb-[5px]"
            style={{ color: '#989898' }}
          >
            {t('hero.subtitle_left')}
          </AnimatedText>
          <button
            onClick={scrollToPayoff}
            className="hero-arrow rounded-[12px] font-medium border-[0.5px] text-main btn-glass flex items-center gap-2 transition-all duration-300 px-[24px] py-2.5 text-[15px] sm:px-[32px] sm:py-3 sm:text-[17px] md:px-[24px] md:py-2.5 md:text-[15px] lg:px-[32px] lg:py-3 lg:text-[17px] xl:px-[32px] xl:py-3 xl:text-[17px] 2xl:px-[36px] 2xl:py-3.5 2xl:text-[18px] 2xl:rounded-[14px]"
            style={{
              willChange: 'transform, opacity',
            }}
          >
            <AnimatedText>{t('hero.cta')}</AnimatedText>
            <div className="relative w-4 h-4 overflow-hidden">
              <OptimizedImage
                src="/icons/diagonal-arrow.svg"
                alt="Arrow"
                width={12}
                height={12}
                className="hero-arrow-main absolute icon-filter-white"
              />
              <OptimizedImage
                src="/icons/diagonal-arrow.svg"
                alt="Arrow"
                width={12}
                height={12}
                className="hero-arrow-secondary absolute icon-filter-white"
              />
            </div>
          </button>
        </div>

        {/* Right content section */}
        <div className="gap-4 sm:gap-6 md:gap-3 flex flex-col items-start hidden md:flex">
          <div className="w-[280px] sm:w-[320px] md:w-[320px] lg:w-[390px] xl:w-[400px] 2xl:w-[500px] text-[14px] sm:text-[16px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[22px] font-medium font-figtree text-left leading-[1.2] md:leading-[1.5] flex flex-col">
            <AnimatedText as="p" className="font-semibold text-main">
              {t('hero.subtitle_right_bold')}
            </AnimatedText>
            <AnimatedText as="p" style={{ color: '#989898' }}>
              {t('hero.subtitle_right_normal')}
            </AnimatedText>
          </div>
          <div className="flex flex-row gap-2 mt-2">
            <Label className="xl:px-[32px] xl:py-3 xl:text-[18px] 2xl:px-[40px] 2xl:py-4 2xl:text-[22px]">
              <AnimatedText>{t('hero.labels.creativity')}</AnimatedText>
            </Label>
            <Label className="xl:px-[32px] xl:py-3 xl:text-[18px] 2xl:px-[40px] 2xl:py-4 2xl:text-[22px]">
              <AnimatedText>{t('hero.labels.design')}</AnimatedText>
            </Label>
            <Label className="xl:px-[32px] xl:py-3 xl:text-[18px] 2xl:px-[40px] 2xl:py-4 2xl:text-[22px]">
              <AnimatedText>{t('hero.labels.strategy')}</AnimatedText>
            </Label>
          </div>
        </div>
      </div>

      {/* Enhanced styles con focus su performance */}
      <style global jsx>{`
        .spline-dark-mask {
          -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 90%);
          mask-image: linear-gradient(to bottom, black 60%, transparent 90%);
        }

        /* Performance optimizations per Spline viewer */
        spline-viewer {
          image-rendering: optimizeSpeed;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: optimize-contrast;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          spline-viewer {
            animation: none !important;
          }

          .hero-arrow {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
