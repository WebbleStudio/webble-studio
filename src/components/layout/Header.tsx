'use client';

import React, { useState } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/css/Header.css';
import Button from '@/components/ui/Button';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import AnimatedText from '@/components/ui/AnimatedText';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeaderAnimation } from '../animations/useHeaderAnimation';
import { useMenuOverlayAnimation } from '../animations/useMenuOverlayAnimation';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const { t } = useTranslation();
  const { desktopWrapperClassName, isScrolled } = useHeaderAnimation();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { overlayStyle, overlayClassName, isVisible, animationState } = useMenuOverlayAnimation(
    isScrolled,
    menuOpen
  );

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Funzione per determinare se una voce è attiva
  const isActivePage = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Animazioni per i contenuti del menu overlay
  const menuContentVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
  };

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
    },
    exit: {
      opacity: 0,
      y: -15,
      filter: 'blur(4px)',
    },
  };

  const separatorVariants = {
    hidden: {
      opacity: 0,
      scaleX: 0,
    },
    visible: {
      opacity: 1,
      scaleX: 1,
    },
    exit: {
      opacity: 0,
      scaleX: 0,
    },
  };

  return (
    <>
      {/* HEADER */}
      <div className={`fixed top-0 left-0 w-full z-[100] h-[90px] flex items-center px-4 md:px-[30px] xl:px-20 transition-all duration-300 ${
        isScrolled ? 'bg-[#0b0b0b]/70 backdrop-blur-sm md:bg-transparent' : ''
      }`}>
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
        <div className={`${desktopWrapperClassName} desktop-wrapper`}>
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
            className={`block w-[45px] h-[2px] rounded transition-all duration-500 ease-in-out ${
              menuOpen
                ? 'transform rotate-45 translate-y-[6.5px] scale-x-75 bg-[#d9d9d9] dark:bg-[#020202]'
                : 'bg-[#d9d9d9]'
            }`}
          ></span>
          <span
            className={`block w-[45px] h-[2px] rounded transition-all duration-500 ease-in-out ${
              menuOpen
                ? 'transform -rotate-45 -translate-y-[6.5px] scale-x-75 bg-[#d9d9d9] dark:bg-[#020202]'
                : 'bg-[#d9d9d9]'
            }`}
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
          <div className="w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {animationState === 'open' && (
                <motion.div
                  key="menu-content"
                  className="flex flex-col items-center space-y-8"
                  variants={menuContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  }}
                >
                <motion.div 
                  variants={menuItemVariants}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <AnimatedText
                    as="h1"
                    className={`text-4xl md:text-5xl font-figtree text-auto-inverse cursor-pointer hover:text-[#F20352] transition-all duration-200 ${
                      isActivePage('/') ? 'font-medium' : 'font-light'
                    }`}
                  >
                    {t('menu.home')}
                  </AnimatedText>
                </motion.div>
                
                <motion.div 
                  variants={separatorVariants}
                  className="w-24 h-[2px] bg-[#fafafa] dark:bg-[#0b0b0b] opacity-40 origin-left"
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                ></motion.div>
                
                <motion.div 
                  variants={menuItemVariants}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <AnimatedText
                    as="h1"
                    className={`text-4xl md:text-5xl font-figtree text-auto-inverse cursor-pointer hover:text-[#F20352] transition-all duration-200 ${
                      isActivePage('/about') ? 'font-medium' : 'font-light'
                    }`}
                  >
                    {t('menu.about')}
                  </AnimatedText>
                </motion.div>
                
                <motion.div 
                  variants={separatorVariants}
                  className="w-24 h-[2px] bg-[#fafafa] dark:bg-[#0b0b0b] opacity-40 origin-left"
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                ></motion.div>
                
                <motion.div 
                  variants={menuItemVariants}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <AnimatedText
                    as="h1"
                    className={`text-4xl md:text-5xl font-figtree text-auto-inverse cursor-pointer hover:text-[#F20352] transition-all duration-200 ${
                      isActivePage('/portfolio') ? 'font-medium' : 'font-light'
                    }`}
                  >
                    {t('menu.portfolio')}
                  </AnimatedText>
                </motion.div>
                
                <motion.div 
                  variants={separatorVariants}
                  className="w-24 h-[2px] bg-[#fafafa] dark:bg-[#0b0b0b] opacity-40 origin-left"
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                ></motion.div>
                
                <motion.div 
                  variants={menuItemVariants}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <AnimatedText
                    as="h1"
                    className={`text-4xl md:text-5xl font-figtree text-auto-inverse cursor-pointer hover:text-[#F20352] transition-all duration-200 ${
                      isActivePage('/contact') ? 'font-medium' : 'font-light'
                    }`}
                  >
                    {t('menu.contact')}
                  </AnimatedText>
                </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
