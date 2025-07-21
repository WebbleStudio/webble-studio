import React from 'react';
import SecondButton from '@/components/ui/SecondButton';

export default function Payoff() {
  return (
    <section className="h-[700px] md:h-[1000px] lg:h-[1500px] xl:h-[1700px] 2xl:h-[1700px] w-full bg-center bg-no-repeat bg-[length:500px_auto] sm:bg-[length:700px_auto] md:bg-[length:1100px_auto] lg:bg-[length:1300px_auto] xl:bg-[length:1500px_auto] 2xl:bg-[length:1600px_auto] flex items-center justify-center" style={{ backgroundImage: 'url(/img/bubble-background.webp)' }}>
      <div className="w-full max-w-[1300px] xl:max-w-[1650px] 2xl:max-w-[1650px] mx-auto flex flex-col items-center justify-center gap-4 px-5 md:px-[30px] lg:gap-6">
        <h1 className="text-center text-[25px] sm:text-[32px] md:text-[45px] lg:text-[55px] font-figtree font-medium text-second leading-[1.1]">
          <span className="font-semibold">Progettiamo</span> esperienze<br />che <span className="font-semibold">lasciano il segno</span>
        </h1>
        <p className="text-center text-[14px] sm:text-[16px] md:text-[20px] font-figtree font-regular text-second max-w-xl mx-auto">
          Interfacce su misura, pensate per distinguerti,<br />coinvolgere l'utente e generare valore.
        </p>
        <div className="flex justify-center">
          <SecondButton>Prenota una call</SecondButton>
        </div>
      </div>
    </section>
  );
}
