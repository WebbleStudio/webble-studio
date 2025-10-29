'use client';

import React, { useState, useEffect } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function Contatti() {
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth >= 550);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="pt-14">
      <div>
        <div className="text-left">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Vadim */}
            <a
              href="tel:+393534248308"
              className="flex items-center gap-5 p-3 lg:p-4 lg:min-h-[100px] rounded-3xl bg-[#0b0b0b]/5 dark:bg-[#f4f4f4]/5 border border-[#0b0b0b]/10 dark:border-[#f4f4f4]/10 group hover:shadow-md transition-all duration-300 md:w-1/2"
            >
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-xl overflow-hidden">
                <OptimizedImage
                  src="/img/vadim.png"
                  alt="Vadim"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-[16px] md:text-[17px] lg:text-[19px] font-figtree font-bold text-[#0b0b0b] dark:text-[#f4f4f4]">
                  Vadim <span className="text-[15px] md:text-[16px] lg:text-[18px] font-medium">* Founder</span>
                </h3>
                <p className="text-[16px] md:text-[17px] lg:text-[19px] font-figtree font-light text-[#0b0b0b] dark:text-[#f4f4f4]">
                  +39 353 424 8308
                </p>
              </div>
            </a>

            {/* Gabriele */}
            <a
              href="tel:+393290015646"
              className="flex items-center gap-5 p-3 lg:p-4 lg:min-h-[100px] rounded-3xl bg-[#0b0b0b]/5 dark:bg-[#f4f4f4]/5 border border-[#0b0b0b]/10 dark:border-[#f4f4f4]/10 group hover:shadow-md transition-all duration-300 md:w-1/2"
            >
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-xl overflow-hidden">
                <OptimizedImage
                  src="/img/gabriele.jpg"
                  alt="Gabriele"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-[16px] md:text-[17px] lg:text-[19px] font-figtree font-bold text-[#0b0b0b] dark:text-[#f4f4f4]">
                  Gabriele <span className="text-[15px] md:text-[16px] lg:text-[18px] font-medium">* Founder</span>
                </h3>
                <p className="text-[16px] md:text-[17px] lg:text-[19px] font-figtree font-light text-[#0b0b0b] dark:text-[#f4f4f4]">
                  +39 329 001 5646
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-3">
          <div className="p-4 lg:p-5 lg:min-h-[130px] rounded-3xl bg-[#0b0b0b]/5 dark:bg-[#f4f4f4]/5 border border-[#0b0b0b]/10 dark:border-[#f4f4f4]/10 lg:flex lg:flex-col lg:justify-between">
            <h3 className="text-[20px] md:text-[21px] lg:text-[22px] font-figtree font-semibold text-[#0b0b0b] dark:text-[#f4f4f4] mb-4">
              Email
            </h3>
            <a
              href="mailto:webblestudio.com@gmail.com"
              className="text-[18px] md:text-[19px] lg:text-[22px] font-figtree font-light text-[#0b0b0b] dark:text-[#f4f4f4] hover:opacity-80 transition-opacity"
            >
              webblestudio.com@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-3">
          <div className="p-4 lg:p-5 lg:min-h-[130px] rounded-3xl bg-[#0b0b0b]/5 dark:bg-[#f4f4f4]/5 border border-[#0b0b0b]/10 dark:border-[#f4f4f4]/10 lg:flex lg:flex-col lg:justify-between">
            <h3 className="text-[20px] md:text-[21px] lg:text-[22px] font-figtree font-semibold text-[#0b0b0b] dark:text-[#f4f4f4] mb-6">
              Social Network
            </h3>
            <div className={`flex gap-6 ${isWideScreen ? 'flex-nowrap' : 'flex-wrap gap-y-3'}`}>
            <a
              href="https://instagram.com/studiowebble"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/instagram-black.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/instagram-white.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/webblestudio/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/linkedin-black.svg"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/linkedin-white.svg"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            <a
              href="https://www.tiktok.com/@webblestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/tiktok-black.svg"
                alt="TikTok"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/tiktok-white.svg"
                alt="TikTok"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            <a
              href="https://www.youtube.com/@webblestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/youtube-black.svg"
                alt="YouTube"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/youtube-white.svg"
                alt="YouTube"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            <a
              href="https://www.facebook.com/p/Webble-Studio-61566664251140/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/facebook-black.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/facebook-white.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            {/* Forza il wrap dopo Facebook su schermi piccoli */}
            {!isWideScreen && <div className="w-full"></div>}
            <a
              href="https://x.com/webblestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/x-black.svg"
                alt="X (Twitter)"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/x-white.svg"
                alt="X (Twitter)"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            <a
              href="https://www.threads.com/@studiowebble"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/threads-black.svg"
                alt="Threads"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/threads-white.svg"
                alt="Threads"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            <a
              href="https://www.behance.net/Webble?tracking_source=search_projects%7CWebble+Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/behance-black.svg"
                alt="Behance"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/behance-white.svg"
                alt="Behance"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/dribble-black.svg"
                alt="Dribbble"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/dribble-whte.svg"
                alt="Dribbble"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            <a
              href="https://it.pinterest.com/webblestudio/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <OptimizedImage
                src="/icons/pinterest-black.svg"
                alt="Pinterest"
                width={24}
                height={24}
                className="w-6 h-6 dark:hidden"
              />
              <OptimizedImage
                src="/icons/pinterest-white.svg"
                alt="Pinterest"
                width={24}
                height={24}
                className="w-6 h-6 hidden dark:block"
              />
            </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
