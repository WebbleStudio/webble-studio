import { useState, useEffect } from 'react';

export function useHeaderAnimation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    // Check initial scroll position
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic className for desktop wrapper based on scroll state
  const desktopWrapperClassName = `w-full max-w-[1240px] 2xl:max-w-[1590px] mx-auto h-[65px] rounded-[23px] hidden md:flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
    isScrolled ? 'border border-[rgba(250,250,250,0.1)] pl-[17px] pr-[11px]' : ''
  }`;

  return {
    isScrolled,
    desktopWrapperClassName
  };
} 