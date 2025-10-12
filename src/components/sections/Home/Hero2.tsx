'use client';

import React, { useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTranslation } from '@/hooks';
import AnimatedText from '@/components/ui/AnimatedText';
import OptimizedImage from '@/components/ui/OptimizedImage';
import BookingForm from '@/components/ui/BookingForm';

export default function Hero2() {
  const { t, currentLanguage } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [particlesInit, setParticlesInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesInit(true);
    });
  }, []);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // Funzione di scroll smooth al payoff (stessa logica della Hero)
  const scrollToPayoff = () => {
    const payoffTitle = document.getElementById('payoff-title');
    if (!payoffTitle) return;

    // Calcola la posizione per centrare verticalmente il titolo
    const titleRect = payoffTitle.getBoundingClientRect();
    const titleCenter = titleRect.top + titleRect.height / 2;
    const viewportHeight = window.innerHeight;
    const targetPosition = window.scrollY + titleCenter - viewportHeight / 2;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="relative h-auto md:h-screen w-full flex items-center md:items-start justify-center px-5 md:px-[30px] xl:px-20 pt-[150px] md:pt-[100px] overflow-hidden"
      style={{ backgroundColor: '#0b0b0b' }}
    >
      {/* Particles Background */}
      {particlesInit && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 pointer-events-none"
          options={{
            fullScreen: false,
            background: {
              color: {
                value: 'transparent',
              },
            },
            fpsLimit: 120,
            particles: {
              color: {
                value: '#ffffff',
              },
              links: {
                enable: false,
              },
              move: {
                enable: true,
                speed: 0.5,
                direction: 'none',
                random: true,
                straight: false,
                outModes: {
                  default: 'out',
                },
              },
              number: {
                density: {
                  enable: true,
                  width: 1920,
                  height: 1080,
                },
                value: 30,
              },
              opacity: {
                value: { min: 0.2, max: 0.5 },
                animation: {
                  enable: true,
                  speed: 1,
                  sync: false,
                },
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: { min: 0.5, max: 1.5 },
              },
            },
            detectRetina: true,
          }}
        />
      )}

      {/* MOBILE LAYOUT - Sotto MD */}
      <div className="md:hidden flex flex-col items-center text-center relative z-10 w-full">
        {/* Background Image - Mobile & SM */}
        <div
          className="absolute top-[100px] sm:top-[100px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-auto sm:w-[600px] opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'url(/img/radial.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            aspectRatio: '16/9',
          }}
        />

        <h1 className="text-[#f4f4f4] text-[33px] font-semibold leading-tight mb-4 w-[320px] sm:w-[400px]">
          {currentLanguage === 'en' ? (
            <AnimatedText>
              <span>We Bring to Life Brands</span>
              <span> that Grow and Inspire</span>
            </AnimatedText>
          ) : (
            <AnimatedText>{t('hero2.title')}</AnimatedText>
          )}
        </h1>
        <p className="text-[#989898] text-[14px] sm:text-[16px] font-medium font-figtree leading-[1.2] max-w-[240px] xs:max-w-[320px] sm:max-w-[400px] mb-6">
          {currentLanguage === 'en' ? (
            <AnimatedText as="span">
              <span>We create custom identities, optimized for the</span>
              <span> user and designed to grow your business.</span>
            </AnimatedText>
          ) : (
            <AnimatedText as="span">
              <span>Creiamo identità personalizzate, ottimizzate per</span>
              <span> l&apos;utente e pensate per far crescere il tuo business.</span>
            </AnimatedText>
          )}
        </p>

        <div className="flex flex-row gap-3 items-center mb-[50px]">
          <button
            onClick={handleOpenForm}
            className="bg-white text-black rounded-xl px-6 py-2.5 xs:px-7 xs:py-3 hover:bg-gray-100 transition-all duration-300 font-medium text-[15px] xs:text-[16px]"
            data-gtm-event="cta_click"
            data-gtm-category="engagement"
            data-gtm-action="prenota_call"
            data-gtm-label="hero_section"
          >
            <AnimatedText>{t('hero2.button_contact')}</AnimatedText>
          </button>

          <button
            onClick={scrollToPayoff}
            className="bg-transparent border border-white text-white rounded-xl px-6 py-2.5 xs:px-7 xs:py-3 hover:bg-white/10 transition-all duration-300 font-medium text-[15px] xs:text-[16px]"
          >
            <AnimatedText>{t('hero2.button_services')}</AnimatedText>
          </button>
        </div>

        {/* Mobile Image */}
        <OptimizedImage
          src="/img/hero-mobile-proj.png"
          alt="Hero Mobile Projects"
          width={800}
          height={600}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* DESKTOP LAYOUT - Da MD in su */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full relative z-10">
        {/* TOP 50% - Content Section */}
        <div className="md:h-1/2 flex items-center justify-center relative px-[30px] xl:px-20">
          {/* Background Image - radial2.png */}
          <div
            className="absolute left-1/2 top-1/2 w-[780px] lg:w-[1100px] h-auto opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url(/img/radial2.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              aspectRatio: '16/9',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Content */}
          <div className="flex flex-col items-center text-center relative z-10">
            <h1 className="text-[#f4f4f4] text-[48px] lg:text-[56px] font-semibold leading-tight mb-6 w-[700px]">
              {currentLanguage === 'en' ? (
                <AnimatedText>
                  <span className="block">We Bring to Life Brands</span>
                  <span className="block">that Grow and Inspire</span>
                </AnimatedText>
              ) : (
                <AnimatedText>{t('hero2.title')}</AnimatedText>
              )}
            </h1>
            <p className="text-[#989898] text-[17px] lg:text-[19px] xl:text-[20px] 2xl:text-[22px] font-medium font-figtree leading-[1.5] max-w-[500px] mb-8">
              {currentLanguage === 'en' ? (
                <AnimatedText as="span">
                  <span className="block">We create custom identities, optimized for the</span>
                  <span className="block">user and designed to grow your business.</span>
                </AnimatedText>
              ) : (
                <AnimatedText as="span">
                  <span className="block">Creiamo identità personalizzate, ottimizzate per</span>
                  <span className="block">
                    l&apos;utente e pensate per far crescere il tuo business.
                  </span>
                </AnimatedText>
              )}
            </p>

            <div className="flex flex-row gap-3 items-center">
              {/* Prenota Call Button - Desktop with arrow */}
              <button
                onClick={handleOpenForm}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenForm();
                  }
                }}
                className="group flex items-center gap-4 bg-white text-black rounded-xl pl-5 pr-[6px] py-[6px] font-medium text-[15px] xs:text-[16px] relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                data-gtm-event="cta_click"
                data-gtm-category="engagement"
                data-gtm-action="prenota_call"
                data-gtm-label="hero_section_desktop"
                aria-label="Prenota una call gratuita"
                aria-describedby="hero-cta-description"
              >
                {/* Gradient overlay con fade-in */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ef2d56]/40 to-[#f4f4f4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-xl" />

                {/* Content */}
                <span className="relative z-10">
                  <AnimatedText>{t('hero2.button_contact')}</AnimatedText>
                </span>
                <div className="bg-black rounded-lg w-[34px] h-[34px] flex items-center justify-center relative z-10">
                  <img
                    src="/icons/diagonal-arrow.svg"
                    alt=""
                    className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:rotate-90"
                  />
                </div>
              </button>

              <button
                onClick={scrollToPayoff}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToPayoff();
                  }
                }}
                className="bg-transparent border border-white text-white rounded-xl px-[45px] py-[11px] hover:bg-white/10 transition-all duration-300 font-medium text-[15px] xs:text-[16px] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Scopri i nostri servizi"
                aria-describedby="hero-services-description"
              >
                <AnimatedText>{t('hero2.button_services')}</AnimatedText>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM 50% - Image Section */}
        <div className="md:h-1/2 flex items-end justify-center">
          <OptimizedImage
            src="/img/hero-desktop-proj.png"
            alt="Hero Desktop Projects"
            width={1920}
            height={1080}
            className="w-full h-full object-contain object-bottom"
          />
        </div>
      </div>

      {/* Booking Form Modal */}
      {isFormOpen && <BookingForm isOpen={isFormOpen} onClose={handleCloseForm} />}
    </section>
  );
}
