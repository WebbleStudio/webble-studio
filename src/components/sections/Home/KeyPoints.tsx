'use client';

import React from 'react';
import AnimatedText from '@/components/ui/AnimatedText';
import OptimizedImage from '@/components/ui/OptimizedImage';
import OptimizedVideo from '@/components/ui/OptimizedVideo';
import { useLazyLoad } from '@/hooks/useLazyLoad';
import { usePerformance } from '@/hooks/usePerformance';
import { useTranslation } from '@/hooks/useTranslation';
import { useTiltCard } from '@/hooks/useTiltCard';
import '@/css/KeyPointsResponsive.css';
import '@/css/KeyPoints3D.css';

export default function KeyPoints() {
  const { t } = useTranslation();

  // Performance optimization - meno aggressiva
  const { shouldSkipAnimation } = usePerformance();

  // Tilt Card effects for each card - configurazioni ottimizzate per forma e dimensione
  const card1Effect = useTiltCard({ tiltFactor: 4, glareIntensity: 0.1 });
  const card2Effect = useTiltCard({ tiltFactor: 4, glareIntensity: 0.1 });
  const card3Effect = useTiltCard({ tiltFactor: 5, glareIntensity: 0.1 }); // Aumentato per card quadrata
  const card4Effect = useTiltCard({ tiltFactor: 5, glareIntensity: 0.1 }); // Aumentato per card quadrata

  // Lazy loading ottimizzato per garantire il caricamento
  const {
    ref: sectionRef,
    shouldRender,
    isLoaded,
  } = useLazyLoad({
    rootMargin: '200px 0px', // Aumentato per caricamento anticipato
    threshold: 0.05, // Ridotto per trigger più facile
    delay: shouldSkipAnimation('medium') ? 50 : 100, // Delay ridotto
    eager: false, // Mantiene lazy loading ma meno aggressivo
  });

  // Fallback per dispositivi con problemi di caricamento
  const [forceRender, setForceRender] = React.useState(false);

  // Force render dopo un timeout per garantire la visualizzazione
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!shouldRender) {
        setForceRender(true);
      }
    }, 2000); // 2 secondi di timeout

    return () => clearTimeout(timer);
  }, [shouldRender]);

  // Rendering placeholder ottimizzato che rispetta il layout originale
  if (!shouldRender && !forceRender) {
    return (
      <section
        ref={sectionRef}
        className="h-auto md:h-screen w-full flex flex-col md:flex-row items-center justify-center gap-3"
      >
        <div className="w-full md:w-1/2 h-[290px] sm:h-[340px] md:h-[450px] xl:h-[510px] 2xl:h-[610px] bg-bg-card/50 animate-pulse rounded-[20px]" />
        <div className="w-full md:w-1/2 flex flex-col gap-3 md:h-[450px] xl:h-[510px] 2xl:h-[610px] md:justify-between">
          <div className="w-full h-[190px] sm:h-[240px] md:h-[calc(50%-6px)] bg-bg-card/50 animate-pulse rounded-[20px]" />
          <div className="w-full flex gap-3 md:h-[calc(50%-6px)]">
            <div className="w-1/2 h-[190px] sm:h-[220px] md:h-full bg-bg-card/50 animate-pulse rounded-[20px]" />
            <div className="w-1/2 h-[190px] sm:h-[220px] md:h-full bg-bg-card/50 animate-pulse rounded-[20px]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        className={`h-auto md:h-screen w-full flex flex-col md:flex-row items-center justify-center gap-3 transition-opacity duration-300 ${
          isLoaded || forceRender ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Box 01 - Colonna sinistra su MD+ */}
        <div
          ref={card1Effect.cardRef}
          onMouseMove={card1Effect.handleMouseMove}
          onMouseEnter={card1Effect.handleMouseEnter}
          onMouseLeave={card1Effect.handleMouseLeave}
          className="w-full md:w-1/2 h-[290px] sm:h-[340px] md:h-[450px] xl:h-[510px] 2xl:h-[610px] bg-bg-card keypoint-border border-[0.5px] rounded-[20px] relative overflow-hidden p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between keypoint-tilt-card"
          style={{
            willChange: 'transform',
            transform: `perspective(1000px) rotateX(${card1Effect.tiltValues.x}deg) rotateY(${card1Effect.tiltValues.y}deg)`,
            transition: `transform ${card1Effect.transitionDuration}s ease-out`,
          }}
        >
          {/* Effetto glare */}
          <div className={`keypoint-glare-overlay ${card1Effect.isHovered ? 'active' : ''}`} />
          {/* Video per tutti i breakpoint - caricamento garantito */}
          <div className="absolute inset-0 overflow-hidden">
            <OptimizedVideo
              src="https://lvgdhhfbvbvpuxjgasbk.supabase.co/storage/v1/object/public/videos//01-BG-Video-720p.mp4"
              className="w-full h-full object-contain pointer-events-none mix-blend-lighten"
              lazy={false} // Disabilitato lazy loading per garantire il caricamento
              preload="auto" // Preload completo per garantire la riproduzione
              style={{
                transform: 'translateY(-10%) scale(0.9)',
                objectPosition: 'center center',
                willChange: 'transform',
              }}
              autoPlay
              loop
              muted
              controls={false}
              playsInline
            />
          </div>

          <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
            <AnimatedText>{t('keypoints.box01.number')}</AnimatedText>
          </h4>
          <div className="relative z-10 flex flex-col sm:gap-2">
            <h2 className="text-main font-figtree font-medium text-[20px] sm:text-[25px] xl:text-[30px] leading-[1.3]">
              <AnimatedText>{t('keypoints.box01.title')}</AnimatedText>
            </h2>
            <AnimatedText
              as="p"
              className="text-white/60 text-[12px] sm:text-[14px] xl:text-[18px] w-[195px] sm:w-[270px]"
            >
              {t('keypoints.box01.description')}
            </AnimatedText>
          </div>
        </div>

        {/* Colonna destra su MD+ */}
        <div className="w-full md:w-1/2 flex flex-col gap-3 md:h-[450px] xl:h-[510px] 2xl:h-[610px] md:justify-between">
          {/* Box 02 */}
          <div
            ref={card2Effect.cardRef}
            onMouseMove={card2Effect.handleMouseMove}
            onMouseEnter={card2Effect.handleMouseEnter}
            onMouseLeave={card2Effect.handleMouseLeave}
            className="w-full h-[190px] sm:h-[240px] md:h-[calc(50%-6px)] bg-bg-card keypoint-border border-[0.5px] rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between relative overflow-hidden keypoint-tilt-card"
            style={{
              willChange: 'transform',
              transform: `perspective(1000px) rotateX(${card2Effect.tiltValues.x}deg) rotateY(${card2Effect.tiltValues.y}deg)`,
              transition: `transform ${card2Effect.transitionDuration}s ease-out`,
            }}
          >
            {/* Effetto glare */}
            <div className={`keypoint-glare-overlay ${card2Effect.isHovered ? 'active' : ''}`} />
            <div
              className="absolute inset-0 bg-right-top bg-no-repeat top-5 right-5 webble-image xl:top-[70px] xl:right-[90px] xl:scale-125 2xl:scale-[1.40] 2xl:top-[110px] 2xl:right-[190px]"
              style={{ backgroundImage: 'url(/img/webble-3d.webp)' }}
            />
            <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
              <AnimatedText>{t('keypoints.box02.number')}</AnimatedText>
            </h4>
            <div className="relative z-10 flex flex-col sm:gap-2">
              <h2 className="text-main font-figtree font-medium text-[20px] sm:text-[25px] xl:text-[30px] leading-[1.3]">
                <AnimatedText>{t('keypoints.box02.title')}</AnimatedText>
              </h2>
              <AnimatedText
                as="p"
                className="text-white/60 text-[12px] sm:text-[14px] xl:text-[18px] w-[195px] sm:w-[270px]"
              >
                {t('keypoints.box02.description')}
              </AnimatedText>
            </div>
          </div>

          {/* Doppio box sotto */}
          <div className="w-full flex gap-3 md:h-[calc(50%-6px)] xl:h-[calc(50%-6px)] 2xl:h-[calc(50%-6px)]">
            {/* Box 03 */}
            <div
              ref={card3Effect.cardRef}
              onMouseMove={card3Effect.handleMouseMove}
              onMouseEnter={card3Effect.handleMouseEnter}
              onMouseLeave={card3Effect.handleMouseLeave}
              className="w-1/2 h-[190px] sm:h-[220px] md:h-full bg-bg-card keypoint-border border-[0.5px] rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between relative overflow-hidden keypoint-tilt-card"
              style={{
                willChange: 'transform',
                transform: `perspective(1000px) rotateX(${card3Effect.tiltValues.x}deg) rotateY(${card3Effect.tiltValues.y}deg)`,
                transition: `transform ${card3Effect.transitionDuration}s ease-out`,
              }}
            >
              {/* Effetto glare */}
              <div className={`keypoint-glare-overlay ${card3Effect.isHovered ? 'active' : ''}`} />
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/img/sfondo-box3.png)' }}
              />
              <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
                <AnimatedText>{t('keypoints.box03.number')}</AnimatedText>
              </h4>
              <div className="relative z-10">
                <h2 className="text-main font-figtree font-medium text-[20px] sm:text-[25px] xl:text-[30px] leading-[1.3]">
                  <AnimatedText>{t('keypoints.box03.title')}</AnimatedText>
                </h2>
                <AnimatedText
                  as="p"
                  className="text-white/60 text-[12px] sm:text-[14px] xl:text-[18px] xl:w-[250px]"
                >
                  {t('keypoints.box03.description')}
                </AnimatedText>
              </div>
            </div>

            {/* Box 04 */}
            <div
              ref={card4Effect.cardRef}
              onMouseMove={card4Effect.handleMouseMove}
              onMouseEnter={card4Effect.handleMouseEnter}
              onMouseLeave={card4Effect.handleMouseLeave}
              className="w-1/2 h-[190px] sm:h-[220px] md:h-full bg-bg-card keypoint-border border-[0.5px] rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between relative overflow-hidden keypoint-tilt-card"
              style={{
                willChange: 'transform',
                transform: `perspective(1000px) rotateX(${card4Effect.tiltValues.x}deg) rotateY(${card4Effect.tiltValues.y}deg)`,
                transition: `transform ${card4Effect.transitionDuration}s ease-out`,
              }}
            >
              {/* Effetto glare */}
              <div className={`keypoint-glare-overlay ${card4Effect.isHovered ? 'active' : ''}`} />
              <div
                className="absolute inset-0 bg-top bg-no-repeat top-8 figma-image xl:scale-[1.25] xl:top-[40px] 2xl:scale-[1.45] 2xl:top-[75px] 2xl:right-[0px]"
                style={{ backgroundImage: 'url(/img/figma-3d.webp)' }}
              />
              {/* Freccia in alto a destra */}
              <OptimizedImage
                src="/icons/bubble-arrow.svg"
                alt="Arrow"
                width={40}
                height={40}
                className="icon-servizi"
              />
              <div className="relative z-10">
                <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
                  <AnimatedText>{t('keypoints.box04.number')}</AnimatedText>
                </h4>
              </div>
              <div className="relative z-10">
                <h2 className="text-main font-figtree font-medium text-[20px] sm:text-[25px] xl:text-[30px] leading-[1.3] flex items-center gap-4">
                  <AnimatedText>{t('keypoints.box04.title')}</AnimatedText>
                  <OptimizedImage
                    src="/icons/bubble-arrow.svg"
                    alt="Arrow"
                    width={40}
                    height={40}
                    className="icon-servizi-desktop"
                  />
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
