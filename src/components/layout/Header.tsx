'use client';

import React, { useState } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Link from 'next/link';
import '@/css/Header.css';
import Button from '@/components/ui/Button';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useHeaderAnimation } from '../animations/useHeaderAnimation';
import { useMenuOverlayAnimation } from '../animations/useMenuOverlayAnimation';

export default function Header() {
  const { desktopWrapperClassName, isScrolled } = useHeaderAnimation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { overlayStyle, overlayClassName, isVisible } = useMenuOverlayAnimation(
    isScrolled,
    menuOpen
  );

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full z-[100] h-[90px] flex items-center px-5 md:px-[30px] xl:px-20">
        {/* Mobile layout: solo logo */}
        <div className="flex w-full items-center justify-start md:hidden">
          <div className="h-[40px] flex items-center">
            <Link href="/" className="logo-compact">
              <OptimizedImage
                src="/img/webble-white-logo.svg"
                alt="Webble Logo"
                width={80}
                height={40}
                priority
                className="w-[70px] h-[40px]"
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
        </div>

        {/* Desktop layout: wrapper con bordo visibile solo quando scrollato */}
        <div className={desktopWrapperClassName}>
          {/* Logo a sinistra */}
          <div className="h-[40px] flex items-center">
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
                width={192}
                height={30}
                priority
                className="w-[192px] h-[30px]"
              />
            </Link>
          </div>
          {/* Spazio centrale - il burger menu è ora posizionato separatamente */}
          <div className="flex-1"></div>
          {/* Button e toggle a destra */}
          <div className="flex items-center gap-3">
            <LanguageToggle className="hidden md:block" />
            <DarkModeToggle className="hidden md:block" />
            <Button className="hidden md:inline-flex">Contattaci</Button>
          </div>
        </div>
      </div>

      {/* BURGER MENU MOBILE - fixed separato */}
      <div className="fixed top-5 right-5 md:hidden z-[102] flex items-center gap-3">
        <LanguageToggle />
        <DarkModeToggle />
        <div
          className="flex flex-col items-end justify-center gap-[11px] cursor-pointer w-[45px] h-[45px] relative"
          onClick={toggleMenu}
        >
          <span
            className={`block w-[45px] h-[2px] bg-text-inverse rounded transition-all duration-500 ease-in-out ${menuOpen ? 'transform rotate-45 translate-y-[6.5px] scale-x-75' : ''}`}
          ></span>
          <span
            className={`block w-[45px] h-[2px] bg-text-inverse rounded transition-all duration-500 ease-in-out ${menuOpen ? 'transform -rotate-45 -translate-y-[6.5px] scale-x-75' : ''}`}
          ></span>
        </div>
      </div>

      {/* BURGER MENU DESKTOP - fixed separato */}
      <div className="fixed top-[45px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 xl:top-[45px] hidden md:flex z-[102] items-center gap-3">
        <div
          className="flex flex-col items-center justify-center gap-[9px] cursor-pointer w-[40px] h-[40px] relative"
          onClick={toggleMenu}
        >
          <span
            className={`block w-[40px] h-[2px] rounded transition-all duration-500 ease-in-out ${
              menuOpen
                ? 'transform rotate-45 translate-y-[5.5px] scale-x-75 bg-[#d9d9d9] dark:bg-[#020202]'
                : 'bg-[#d9d9d9]'
            }`}
          ></span>
          <span
            className={`block w-[40px] h-[2px] rounded transition-all duration-500 ease-in-out ${
              menuOpen
                ? 'transform -rotate-45 -translate-y-[5.5px] scale-x-75 bg-[#d9d9d9] dark:bg-[#020202]'
                : 'bg-[#d9d9d9]'
            }`}
          ></span>
        </div>
        <span
          className={`font-poppins text-base cursor-pointer transition-colors duration-500 ${
            menuOpen ? 'text-[#d9d9d9] dark:text-[#020202]' : 'text-[#d9d9d9]'
          }`}
          onClick={toggleMenu}
        >
          Menu
        </span>
      </div>

      {/* MENU OVERLAY */}
      {isVisible && (
        <div className={overlayClassName} style={overlayStyle}>
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-figtree font-medium text-text-primary">
                Menu
              </h2>
              <nav className="flex flex-col space-y-6">
                <Link
                  href="/"
                  className="text-xl font-medium text-text-primary hover:text-main transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-xl font-medium text-text-primary hover:text-main transition-colors"
                >
                  Chi Siamo
                </Link>
                <Link
                  href="/services"
                  className="text-xl font-medium text-text-primary hover:text-main transition-colors"
                >
                  Servizi
                </Link>
                <Link
                  href="/projects"
                  className="text-xl font-medium text-text-primary hover:text-main transition-colors"
                >
                  Progetti
                </Link>
                <Link
                  href="/contact"
                  className="text-xl font-medium text-text-primary hover:text-main transition-colors"
                >
                  Contatti
                </Link>
              </nav>

              {/* Debug info - rimuovi in produzione */}
              <div className="mt-8 text-sm text-text-secondary opacity-50">
                <div>State: {menuOpen ? 'OPEN' : 'CLOSED'}</div>
                <div>Visible: {isVisible ? 'YES' : 'NO'}</div>
                <div>Style: {JSON.stringify(overlayStyle, null, 2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
