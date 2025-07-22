'use client';

import React from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Link from 'next/link';
import '@/css/Header.css';
import Button from '@/components/ui/Button';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { useHeaderAnimation } from '../animations/useHeaderAnimation';

export default function Header() {
  const { desktopWrapperClassName } = useHeaderAnimation();

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-[90px] flex items-center px-5 md:px-[30px]">
      {/* Mobile layout: logo e burger menu senza wrapper */}
      <div className="flex w-full items-center justify-between md:hidden">
        <div className="h-[40px] flex items-center">
          <Link href="/" className="logo-compact">
            <OptimizedImage
              src="/img/webble-white-logo.svg"
              alt="Webble Logo"
              width={80}
              height={40}
              priority
              className="w-[80px] h-[40px]"
            />
          </Link>
          <Link href="/" className="logo-extended">
            <OptimizedImage
              src="/img/webble-white-logo-extended.svg"
              alt="Webble Logo"
              width={192}
              height={30}
              priority
              className="w-[192px] h-[30px]"
            />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <div className="flex flex-col items-end justify-center gap-[11px] cursor-pointer">
            <span className="block w-[45px] md:w-[40px] h-[2px] bg-main dark:bg-auto-inverse rounded transition-colors duration-300"></span>
            <span className="block w-[45px] md:w-[40px] h-[2px] bg-main dark:bg-auto-inverse rounded transition-colors duration-300"></span>
          </div>
        </div>
      </div>

      {/* Desktop layout: wrapper con bordo visibile solo quando scrollato */}
      <div className={desktopWrapperClassName}>
        {/* Logo a sinistra */}
        <div className="h-[30px] flex items-center">
          <Link href="/" className="logo-compact">
            <OptimizedImage
              src="/img/webble-white-logo.svg"
              alt="Webble Logo"
              width={59}
              height={30}
              priority
              className="w-[59px] h-[30px]"
            />
          </Link>
          <Link href="/" className="logo-extended">
            <OptimizedImage
              src="/img/webble-white-logo-extended.svg"
              alt="Webble Logo"
              width={140}
              height={22}
              priority
              className="w-[140px] h-[22px]"
            />
          </Link>
        </div>
        {/* Burger menu centrato con testo "Menu" accanto */}
        <div className="flex items-center gap-3 mx-auto">
          <div className="flex flex-col items-center justify-center gap-[11px] md:gap-[9px] cursor-pointer">
            <span className="block w-[45px] md:w-[40px] h-[2px] bg-[#d9d9d9] rounded"></span>
            <span className="block w-[45px] md:w-[40px] h-[2px] bg-[#d9d9d9] rounded"></span>
          </div>
          <span className="font-poppins text-[#d9d9d9] text-base">Menu</span>
        </div>
        {/* Button e toggle a destra */}
        <div className="flex items-center gap-3">
          <DarkModeToggle className="hidden md:block" />
          <Button className="hidden md:inline-flex">Contattaci</Button>
        </div>
      </div>
    </div>
  );
}
