'use client';

import React from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function Contatti() {
  return (
    <div className="pt-14">
      <div>
        <div className="text-left">
          <h3 className="text-[20px] font-figtree font-semibold text-[#0b0b0b] dark:text-[#f4f4f4] mb-4">
            Cellulare
          </h3>
          <div className="flex gap-6">
            <a
              href="tel:+393534248308"
              className="mb-4 pr-6 border-r border-[#0b0b0b]/20 dark:border-[#f4f4f4]/20"
            >
              <h3 className="text-[15px] font-figtree font-bold text-[#0b0b0b] dark:text-[#f4f4f4]">
                Vadim <span className="text-[14px] font-medium">* Founder</span>
              </h3>
              <p className="text-[15px] font-figtree font-regular text-[#0b0b0b] dark:text-[#f4f4f4]">
                +39 353 424 8308
              </p>
            </a>
            <a href="tel:+393290015646" className="mb-4">
              <h3 className="text-[15px] font-figtree font-bold text-[#0b0b0b] dark:text-[#f4f4f4]">
                Gabriele <span className="text-[14px] font-medium">* Founder</span>
              </h3>
              <p className="text-[15px] font-figtree font-regular text-[#0b0b0b] dark:text-[#f4f4f4]">
                +39 329 001 5646
              </p>
            </a>
          </div>
        </div>

        <div className="text-left mt-12">
          <h3 className="text-[20px] font-figtree font-semibold text-[#0b0b0b] dark:text-[#f4f4f4] mb-4">
            Email
          </h3>
          <a
            href="mailto:info@webblestudio.com"
            className="text-[18px] font-figtree font-regular text-[#0b0b0b] dark:text-[#f4f4f4] hover:opacity-80 transition-opacity"
          >
            info@webblestudio.com
          </a>
        </div>

        <div className="text-left mt-12">
          <h3 className="text-[20px] font-figtree font-semibold text-[#0b0b0b] dark:text-[#f4f4f4] mb-4">
            Social Network
          </h3>
          <div className="flex flex-wrap gap-6 gap-y-3">
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
            {/* Forza il wrap dopo Facebook */}
            <div className="w-full"></div>
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
  );
}
