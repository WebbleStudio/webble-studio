'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedText from '@/components/ui/AnimatedText';
import Container from '@/components/layout/Container';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="w-full mx-auto mt-[30px]">
      <Container>
        <div className="w-full bg-auto-inverse h-auto rounded-t-[25px] p-[25px] lg:p-[40px] text-auto-inverse flex flex-col md:flex-row gap-[40px] md:h-[340px] lg:h-[470px]">
          <div className="flex flex-col gap-[20px] md:w-1/2 lg:w-2/5">
            <div className="flex flex-col min-[550px]:flex-row min-[550px]:justify-between md:flex-col lg:flex-col gap-[20px] md:h-full">
              <div className="flex flex-col gap-[20px]">
                {/* Logo che cambia in base al tema */}
                <Image
                  src="/img/logo-webble-esteso.svg"
                  alt="Footer Background"
                  width={162}
                  height={100}
                  className="block dark:hidden"
                />
                <Image
                  src="/img/logo-webble-esteso-nero.svg"
                  alt="Footer Background"
                  width={162}
                  height={100}
                  className="hidden dark:block"
                />
                <AnimatedText as="p" className="text-[11px] lg:text-[12px] max-w-[275px]">
                  {t('footer.company_description')}
                </AnimatedText>
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <button className="text-[14px] lg:text-[15px]">
                    <AnimatedText>
                      <span className="text-[#F20352]">{t('footer.cta_highlight')}</span>{' '}
                      {t('footer.cta').replace(t('footer.cta_highlight'), '').trim()}
                    </AnimatedText>
                  </button>
                </div>
              </div>

              <ul className="flex gap-[50px] text-[14px] min-[550px]:flex-col min-[550px]:gap-[10px] min-[550px]:items-end min-[550px]:mt-[42px] md:flex-row md:gap-[50px] md:mt-0 lg:flex-row lg:gap-[50px] lg:mt-0">
                <li>
                  <AnimatedText>{t('footer.privacy_policy')}</AnimatedText>
                </li>
                <li>
                  <AnimatedText>{t('footer.cookie_policy')}</AnimatedText>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-[40px] md:w-1/2 md:h-full lg:w-3/5">
            <div className="text-[14px] lg:text-[16px] md:h-full">
              <div className="flex gap-[75px] xs:gap-[120px] sm:hidden">
                <ul className="flex flex-col gap-[20px]">
                  <li>
                    <AnimatedText>{t('footer.social.behance')}</AnimatedText>
                  </li>
                  <li>
                    <AnimatedText>{t('footer.social.instagram')}</AnimatedText>
                  </li>
                </ul>
                <ul className="flex flex-col gap-[20px]">
                  <li>
                    <AnimatedText>{t('footer.social.dribbble')}</AnimatedText>
                  </li>
                  <li>
                    <AnimatedText>{t('footer.social.linkedin')}</AnimatedText>
                  </li>
                </ul>
              </div>
              <ul className="hidden sm:flex sm:gap-[50px] md:gap-[25px] justify-between">
                <li>
                  <AnimatedText>{t('footer.social.behance')}</AnimatedText>
                </li>
                <li>
                  <AnimatedText>{t('footer.social.dribbble')}</AnimatedText>
                </li>
                <li>
                  <AnimatedText>{t('footer.social.instagram')}</AnimatedText>
                </li>
                <li>
                  <AnimatedText>{t('footer.social.linkedin')}</AnimatedText>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-[25px] md:h-[340px]">
              {/* Mail SVG che cambia in base al tema */}
              <img
                src="/img/mail.svg"
                alt="mail webble studio agency"
                className="w-[230px] xs:w-[280px] sm:w-full block dark:hidden"
              />
              <img
                src="/img/mail-nera.svg"
                alt="mail webble studio agency"
                className="w-[230px] xs:w-[280px] sm:w-full hidden dark:block"
              />
              <div className="w-full h-[1px] bg-gray-600 md:mb-[35px] lg:mb-[85px]"></div>
              <div className="text-[14px] lg:text-[15px]">
                <div className="flex gap-[75px] xs:gap-[120px] sm:hidden md:flex md:justify-between min-[870px]:justify-start min-[870px]:gap-[70px] lg:justify-between lg:gap-0">
                  <ul className="flex flex-col gap-[10px]">
                    <li>
                      <AnimatedText>{t('footer.navigation.home')}</AnimatedText>
                    </li>
                    <li>
                      <AnimatedText>{t('footer.navigation.about')}</AnimatedText>
                    </li>
                    <li>
                      <AnimatedText>{t('footer.navigation.portfolio')}</AnimatedText>
                    </li>
                  </ul>
                  <ul className="flex flex-col gap-[10px]">
                    <li>
                      <AnimatedText>{t('footer.navigation.lawyers')}</AnimatedText>
                    </li>
                    <li>
                      <AnimatedText>{t('footer.navigation.dentists')}</AnimatedText>
                    </li>
                    <li>
                      <AnimatedText>{t('footer.navigation.restaurants')}</AnimatedText>
                    </li>
                  </ul>
                  <ul className="hidden min-[870px]:flex min-[870px]:flex-col gap-[10px]">
                    <li>
                      <AnimatedText>{t('footer.navigation.contacts')}</AnimatedText>
                    </li>
                    <li>
                      <AnimatedText>{t('footer.navigation.blog')}</AnimatedText>
                    </li>
                    <li>
                      <AnimatedText>{t('footer.navigation.services')}</AnimatedText>
                    </li>
                  </ul>
                </div>
                <ul className="hidden sm:grid sm:grid-cols-3 sm:gap-x-[50px] sm:gap-y-[10px] md:hidden">
                  <li>
                    <AnimatedText>{t('footer.navigation.home')}</AnimatedText>
                  </li>
                  <li>
                    <AnimatedText>{t('footer.navigation.about')}</AnimatedText>
                  </li>
                  <li>
                    <AnimatedText>{t('footer.navigation.portfolio')}</AnimatedText>
                  </li>
                  <li>
                    <AnimatedText>{t('footer.navigation.lawyers')}</AnimatedText>
                  </li>
                  <li>
                    <AnimatedText>{t('footer.navigation.dentists')}</AnimatedText>
                  </li>
                  <li>
                    <AnimatedText>{t('footer.navigation.restaurants')}</AnimatedText>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="w-full h-[90px] bg-[#F20352] sm:h-[150px] md:h-[180px] lg:h-[230px] xl:h-[350px] relative bg-[url('/img/webble-text.svg')] bg-[length:100%_100%] bg-[position:0_30px] bg-no-repeat sm:bg-[position:0_50px] md:bg-[position:0_65px] lg:bg-[position:0_80px] xl:bg-[position:0_95px]"></div>
    </footer>
  );
}
