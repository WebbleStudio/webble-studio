import React from 'react';
import Image from 'next/image';
import '@/css/KeyPointsResponsive.css';

export default function KeyPoints() {
  return (
    <section className="h-auto md:h-screen w-full flex flex-col md:flex-row items-center justify-center gap-3">
      {/* Box 01 - Colonna sinistra su MD+ */}
      <div className="w-full md:w-1/2 h-[290px] sm:h-[340px] md:h-[450px] xl:h-[510px] 2xl:h-[610px] bg-second rounded-[20px] relative overflow-hidden p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between">
        <div 
          className="absolute inset-0 bg-top bg-no-repeat top-11 evolvi-image md:hidden" 
          style={{ backgroundImage: 'url(/img/evolvi-immagine.webp)' }}
        />
        <div className="absolute inset-0 hidden md:block">
          <iframe 
            src="https://player.vimeo.com/video/1103282949?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;loop=1&amp;muted=1&amp;controls=0&amp;title=0&amp;byline=0&amp;portrait=0" 
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            className="w-full h-full object-cover pointer-events-none"
            style={{ transform: 'translateY(-10%) scale(0.9)' }}
            title="1080p"
          />
        </div>
        <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
          01
        </h4>
        <div className="mt-4 relative z-10 flex flex-col sm:gap-2">
          <h2 className="text-main font-figtree font-medium text-[20px] sm:text-[25px] xl:text-[30px] leading-[1.3]">
            Un team. <br /> Risultati incredibili.
          </h2>
          <p className="text-[12px] sm:text-[14px] xl:text-[18px] sm:w-[300px] lg:w-[300px] xl:w-[400px]">
            <span className="text-white/60">No freelancers. No agenzie secondarie.</span>
            <br />
            <span className="text-white/60">Ci occupiamo di elaborare design perfetti dediti agli obbiettivi dei nostri clienti.</span>
          </p>
        </div>
        {/* Contenuto sopra l'immagine */}
      </div>
      
      {/* Box 02, 03, 04 - Colonna destra su MD+ */}
      <div className="w-full md:w-1/2 flex flex-col gap-3 md:h-[450px] xl:h-[510px] 2xl:h-[610px] md:justify-between">
        <div className="w-full h-[190px] sm:h-[240px] md:h-[calc(50%-6px)] bg-second rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-right-top bg-no-repeat top-5 right-5 webble-image xl:top-[70px] xl:right-[90px] xl:scale-125 2xl:scale-[1.40] 2xl:top-[110px] 2xl:right-[190px]" 
            style={{ backgroundImage: 'url(/img/webble-3d.webp)' }}
          />
          <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
            02
          </h4>
          <div className="relative z-10 flex flex-col sm:gap-2">
            <h2 className="text-main font-figtree font-medium text-[20px] sm:text-[25px] xl:text-[30px] leading-[1.3]">
            Il tuo Brand è Unico.
            </h2>
            <p className="text-white/60 text-[12px] sm:text-[14px] xl:text-[18px] w-[195px] sm:w-[270px]">
            Lo valorizziamo con una comunicazione visiva e coerente, potente e riconoscibile.
            Inizia ora!
            </p>
          </div>
        </div>
        <div className="w-full flex gap-3 md:h-[calc(50%-6px)] xl:h-[calc(50%-6px)] 2xl:h-[calc(50%-6px)]">
          <div className="w-1/2 h-[190px] sm:h-[220px] md:h-full bg-second rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between">
            <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
              03
            </h4>
            <div className="relative z-10 flex flex-col sm:gap-2">
              <h2 className="text-main font-figtree font-medium text-[20px] sm:text-[25px] xl:text-[30px] leading-[1.3]">
                Identità visiva
              </h2>
              <p className="text-white/60 text-[12px] sm:text-[14px] xl:text-[18px] xl:w-[250px]">
                Dal logo ai colori, ogni dettaglio comunica chi sei.
              </p>
            </div>
          </div>
          <div className="w-1/2 h-[190px] sm:h-[220px] md:h-full bg-second rounded-[20px] p-[20px] xl:p-[25px] 2xl:p-[30px] flex flex-col justify-between relative overflow-hidden">
                          <div 
                className="absolute inset-0 bg-top bg-no-repeat top-8 figma-image xl:scale-[1.25] xl:top-[40px] 2xl:scale-[1.45] 2xl:top-[75px] 2xl:right-[0px]" 
                style={{ backgroundImage: 'url(/img/figma-3d.webp)' }}
              />
            <div className="flex justify-between items-start relative z-10">
              <h4 className="text-[14px] sm:text-[16px] xl:text-[19px] 2xl:text-[21px] text-[#EF2D56] relative z-10 font-poppins font-medium">
                04
              </h4>
            </div>
            <Image src="/icons/bubble-arrow.svg" alt="Arrow" width={40} height={40} className="icon-servizi" />
            <div className="relative z-10">
              <h2 className="text-main font-figtree font-medium text-[20px] sm:text-[25px] xl:text-[30px] leading-[1.3] flex items-center gap-4">
                I nostri servizi
                <Image src="/icons/bubble-arrow.svg" alt="Arrow" width={40} height={40} className="icon-servizi-desktop" />
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 