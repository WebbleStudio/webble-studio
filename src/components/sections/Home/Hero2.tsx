'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedText from '@/components/ui/AnimatedText';
import OptimizedImage from '@/components/ui/OptimizedImage';
import BookingForm from '@/components/ui/BookingForm';

export default function Hero2() {
  const { t, currentLanguage } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-auto md:h-screen w-full bg-black flex items-center md:items-start justify-center px-5 md:px-[30px] xl:px-20 pt-[150px] md:pt-[100px] overflow-hidden">
      {/* Background Image - Mobile & SM */}
      <div 
        className="absolute top-[245px] sm:top-[265px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-auto sm:w-[600px] opacity-20 pointer-events-none md:hidden"
        style={{
          backgroundImage: 'url(/img/radial.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          aspectRatio: '16/9'
        }}
      />
      
      <div className="flex flex-col items-center text-center relative z-10 md:justify-between md:h-full">
        {/* Wrapper per h1, p e button */}
        <div className="flex flex-col items-center text-center md:h-[500px] md:justify-center relative">
          {/* Background Image - MD and above */}
          <div 
            className="hidden md:block absolute left-1/2 w-[780px] lg:w-[1100px] h-auto opacity-20 pointer-events-none top-[calc(50%-25px)] lg:top-[calc(50%-10px)]"
            style={{
              backgroundImage: 'url(/img/radial2.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              aspectRatio: '16/9',
              transform: 'translate(-50%, -50%)'
            }}
          />
          <h1 className="text-[#f4f4f4] text-[33px] md:text-[48px] lg:text-[56px] font-semibold leading-tight mb-4 md:mb-6 w-[320px] sm:w-[400px] md:w-[700px]">
            {currentLanguage === 'en' ? (
              <AnimatedText>
                <span className="md:block">We Bring to Life Brands</span>
                <span className="md:block"> that Grow and Inspire</span>
              </AnimatedText>
            ) : (
              <AnimatedText>{t('hero2.title')}</AnimatedText>
            )}
          </h1>
          <p className="text-[#989898] text-[14px] sm:text-[16px] md:text-[17px] lg:text-[19px] xl:text-[20px] 2xl:text-[22px] font-medium font-figtree leading-[1.2] md:leading-[1.5] max-w-[240px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[500px] mb-6 md:mb-8">
            {currentLanguage === 'en' ? (
              <AnimatedText as="span">
                <span className="md:block">We create custom identities, optimized for the</span>
                <span className="md:block"> user and designed to grow your business.</span>
              </AnimatedText>
            ) : (
              <AnimatedText as="span">
                <span className="md:block">Creiamo identità personalizzate, ottimizzate per</span>
                <span className="md:block"> l'utente e pensate per far crescere il tuo business.</span>
              </AnimatedText>
            )}
          </p>
          
          <div className="flex flex-row gap-3 items-center">
          {/* Prenota Call Button - Mobile */}
          <button 
            onClick={handleOpenForm}
            className="md:hidden bg-white text-black rounded-xl px-6 py-2.5 xs:px-7 xs:py-3 hover:bg-gray-100 transition-all duration-300 font-medium text-[15px] xs:text-[16px]"
          >
            <AnimatedText>{t('hero2.button_contact')}</AnimatedText>
          </button>
          
          {/* Prenota Call Button - Desktop with arrow */}
          <button 
            onClick={handleOpenForm}
            className="group hidden md:flex items-center gap-4 bg-white text-black rounded-xl pl-5 pr-[6px] py-[6px] font-medium text-[15px] xs:text-[16px] relative overflow-hidden"
          >
            {/* Gradient overlay con fade-in */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ef2d56]/40 to-[#f4f4f4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-xl" />
            
            {/* Content */}
            <span className="relative z-10">
              <AnimatedText>{t('hero2.button_contact')}</AnimatedText>
            </span>
            <div className="bg-black rounded-lg w-[34px] h-[34px] flex items-center justify-center relative z-10">
              <img src="/icons/diagonal-arrow.svg" alt="" className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
            </div>
          </button>
          
          <button 
            onClick={scrollToPayoff}
            className="bg-transparent border border-white text-white rounded-xl px-6 py-2.5 xs:px-7 xs:py-3 md:px-[45px] md:py-[11px] hover:bg-white/10 transition-all duration-300 font-medium text-[15px] xs:text-[16px]"
          >
            <AnimatedText>{t('hero2.button_services')}</AnimatedText>
          </button>
          </div>
        </div>
        
        {/* Hero Images Wrapper */}
        <div className="w-full mt-[50px] md:mt-0">
          {/* Mobile & SM Image */}
          <div className="md:hidden">
            <OptimizedImage
              src="/img/hero-mobile-proj.png"
              alt="Hero Mobile Projects"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Desktop Image - MD and above */}
          <div className="hidden md:block xl:max-w-[1400px] xl:mx-auto">
            <OptimizedImage
              src="/img/hero-desktop-proj.png"
              alt="Hero Desktop Projects"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {isFormOpen && (
        <BookingForm isOpen={isFormOpen} onClose={handleCloseForm} />
      )}
    </section>
  );
}