'use client';

import React, { useState } from 'react';
import SecondButton from '@/components/ui/SecondButton';
import AnimatedText from '@/components/ui/AnimatedText';
import BookingForm from '@/components/ui/BookingForm';
import { useTranslation } from '@/hooks/useTranslation';
import '@/css/Payoff.css';

export default function Payoff() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <section className="payoff-bg-transition relative h-[700px] md:h-[1000px] lg:h-[1500px] xl:h-[1700px] 2xl:h-[1700px] w-full bg-center bg-no-repeat bg-[length:500px_auto] sm:bg-[length:700px_auto] md:bg-[length:1100px_auto] lg:bg-[length:1300px_auto] xl:bg-[length:1500px_auto] 2xl:bg-[length:1600px_auto] flex items-center justify-center">
      <div className="w-full max-w-[1300px] xl:max-w-[1650px] 2xl:max-w-[1650px] mx-auto flex flex-col items-center justify-center gap-4 px-5 md:px-[30px] lg:gap-6 relative z-10">
        <div id="payoff-title">
          <AnimatedText
            as="h1"
            className="text-center text-[25px] sm:text-[32px] md:text-[45px] lg:text-[55px] xl:text-[75px] font-figtree font-medium text-text-primary leading-[1.1]"
          >
            <span className="font-semibold">{t('payoff.title_start')}</span>{' '}
            {t('payoff.title_middle')}
            <br />
            {t('payoff.title_end_normal')}{' '}
            <span className="font-semibold">{t('payoff.title_end_bold')}</span>
          </AnimatedText>
        </div>
        <AnimatedText
          as="p"
          className="text-center text-[14px] sm:text-[16px] md:text-[20px] font-figtree font-light text-text-primary w-[300px] sm:w-[400px] md:w-[500px] mx-auto"
        >
          {t('payoff.subtitle')}
        </AnimatedText>
        <div className="flex justify-center">
          <SecondButton onClick={handleOpenForm}>
            <AnimatedText>{t('payoff.cta')}</AnimatedText>
          </SecondButton>
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingForm isOpen={isFormOpen} onClose={handleCloseForm} />
    </section>
  );
}
