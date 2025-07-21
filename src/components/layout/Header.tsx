'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '@/css/Header.css';
import Button from '@/components/ui/Button';
import { useHeaderAnimation } from '../animations/useHeaderAnimation';

export default function Header() {
  const { desktopWrapperClassName } = useHeaderAnimation();

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-[90px] flex items-center px-5 md:px-[30px]">
      {/* Mobile layout: logo e burger menu senza wrapper */}
      <div className="flex w-full items-center justify-between md:hidden">
        <div className="h-[30px] flex items-center">
          <Link href="/" className="logo-compact">
            <Image
              src="/img/webble-white-logo.svg"
              alt="Webble Logo"
              width={59}
              height={30}
              priority
              style={{ width: 'auto' }}
            />
          </Link>
          <Link href="/" className="logo-extended">
            <Image
              src="/img/webble-white-logo-extended.svg"
              alt="Webble Logo"
              width={192}
              height={30}
              priority
              style={{ width: 'auto' }}
            />
          </Link>
        </div>
        <div className="flex flex-col items-end justify-center gap-[11px] cursor-pointer">
          <span className="block w-[45px] md:w-[40px] h-[2px] bg-main rounded"></span>
          <span className="block w-[45px] md:w-[40px] h-[2px] bg-main rounded"></span>
        </div>
      </div>

      {/* Desktop layout: wrapper con bordo visibile solo quando scrollato */}
      <div className={desktopWrapperClassName}>
        {/* Logo a sinistra */}
        <div className="h-[30px] flex items-center">
          <Link href="/" className="logo-compact">
            <Image
              src="/img/webble-white-logo.svg"
              alt="Webble Logo"
              width={59}
              height={30}
              priority
              style={{ width: 'auto' }}
            />
          </Link>
          <Link href="/" className="logo-extended">
            <Image
              src="/img/webble-white-logo-extended.svg"
              alt="Webble Logo"
              width={140}
              height={22}
              priority
              style={{ width: 'auto' }}
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
        {/* Button a destra */}
        <Button className="hidden md:inline-flex">Contattaci</Button>
      </div>
    </div>
  );
}
