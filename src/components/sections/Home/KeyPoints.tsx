'use client';

import React, { useState, useEffect } from 'react';
import AnimatedText from '@/components/ui/AnimatedText';
import OptimizedImage from '@/components/ui/OptimizedImage';
import OptimizedVideo from '@/components/ui/OptimizedVideo';
import { useLazyLoad } from '@/hooks/useLazyLoad';
import { usePerformance } from '@/hooks/usePerformance';
import { useTranslation } from '@/hooks/useTranslation';

// Helper function to get public video URL
const getPublicVideoUrl = (filename: string) => `/videos/${filename}`;

export default function KeyPoints() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Performance optimization
  const { shouldSkipAnimation } = usePerformance();

  // Lazy loading per questa sezione
  const {
    ref: sectionRef,
    shouldRender,
    isLoaded,
  } = useLazyLoad({
    rootMargin: '100px 0px',
    threshold: 0.1,
    delay: shouldSkipAnimation('medium') ? 0 : 200,
  });

  useEffect(() => {
    setIsMounted(true);

    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Rendering placeholder ottimizzato che rispetta il layout originale
  if (!shouldRender) {
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
        className={`h-auto md:h-screen w-full flex flex-col md:flex-row items-center justify-center gap-3 transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Box 01 - Colonna sinistra su MD+ */}
        <div
          className="w-full md:w-1/2 h-[290px] sm:h-[340px] md:h-[450px] xl:h-[510px] 2xl:h-[610px] bg-bg-card keypoint-border border-[0.5px] rounded-[20px] relative overflow-hidden p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between"
          style={{ willChange: 'transform' }}
        >
          {/* Conditional rendering based on mounted state and breakpoint */}
          {isMounted ? (
            isDesktop ? (
              // Desktop: Video
              <div className="absolute inset-0 overflow-hidden">
                <OptimizedVideo
                  src={getPublicVideoUrl('1080p.mp4')}
                  className="w-full h-full object-contain pointer-events-none mix-blend-screen"
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
                  poster="/img/evolvi-immagine.webp"
                />
              </div>
            ) : (
              // Mobile: Static image
              <div
                className="absolute inset-0 bg-top bg-no-repeat top-11 evolvi-image"
                style={{ backgroundImage: 'url(/img/evolvi-immagine.webp)' }}
              />
            )
          ) : (
            // SSR/Initial: Show mobile version to prevent hydration mismatch
            <div
              className="absolute inset-0 bg-top bg-no-repeat top-11 evolvi-image"
              style={{ backgroundImage: 'url(/img/evolvi-immagine.webp)' }}
            />
          )}

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
            className="w-full h-[190px] sm:h-[240px] md:h-[calc(50%-6px)] bg-bg-card keypoint-border border-[0.5px] rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between relative overflow-hidden"
            style={{ willChange: 'transform' }}
          >
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
              className="w-1/2 h-[190px] sm:h-[220px] md:h-full bg-bg-card keypoint-border border-[0.5px] rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between relative overflow-hidden"
              style={{ willChange: 'transform' }}
            >
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
              className="w-1/2 h-[190px] sm:h-[220px] md:h-full bg-bg-card keypoint-border border-[0.5px] rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between relative overflow-hidden"
              style={{ willChange: 'transform' }}
            >
              <div
                className="absolute inset-0 bg-top bg-no-repeat top-8 figma-image xl:scale-[1.25] xl:top-[40px] 2xl:scale-[1.45] 2xl:top-[75px] 2xl:right-[0px]"
                style={{ backgroundImage: 'url(/img/figma-3d.webp)' }}
              />
              <div className="flex justify-between items-start relative z-10">
                <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
                  <AnimatedText>{t('keypoints.box04.number')}</AnimatedText>
                </h4>
              </div>
              <OptimizedImage
                src="/icons/bubble-arrow.svg"
                alt="Arrow"
                width={40}
                height={40}
                className="icon-servizi"
              />
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

      <style jsx>{`
        .keypoint-border {
          border-color: rgba(250, 250, 250, 0.2);
        }

        :global(.dark) .keypoint-border {
          border-color: #434343;
        }

        .evolvi-image {
          background-size: 270px;
        }

        .webble-image {
          background-size: 170px;
        }

        .figma-image {
          background-size: 90px;
        }

        @media (min-width: 480px) {
          .evolvi-image {
            background-size: 350px;
          }

          .webble-image {
            background-size: 220px;
          }

          .figma-image {
            background-size: 120px;
          }
        }

        .icon-servizi {
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .icon-servizi-desktop {
          display: none;
        }

        @media (min-width: 547px) {
          .icon-servizi {
            display: none;
          }

          .icon-servizi-desktop {
            display: block;
          }
        }

        @media (min-width: 768px) {
          .icon-servizi {
            display: block;
            position: absolute;
            top: 20px;
            right: 20px;
          }

          .icon-servizi-desktop {
            display: none;
          }
        }

        @media (min-width: 1086px) {
          .icon-servizi {
            display: none;
          }

          .icon-servizi-desktop {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
