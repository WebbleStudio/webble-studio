import React, { useState, useEffect } from 'react';

interface FilterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export default function Filter({
  children,
  className = '',
  active = false,
  onClick,
  ...props
}: FilterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    // Rileva se il dispositivo supporta hover (ha un mouse)
    setSupportsHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  const baseClasses =
    'px-[20px] py-2 rounded-full font-medium border-[0.5px] flex items-center transition-all duration-300 touch-manipulation select-none';

  const getClasses = () => {
    if (active) {
      return 'bg-[#0b0b0b] text-[#f4f4f4] border-[#0b0b0b] dark:bg-[#f4f4f4] dark:text-[#0b0b0b] dark:border-[#f4f4f4]';
    }

    if (supportsHover && isHovered) {
      return 'border-black dark:border-white text-black dark:text-white bg-black/5 dark:bg-white/5';
    }

    return 'border-black dark:border-white text-black dark:text-white bg-transparent';
  };

  // Gestione migliorata dei click per mobile
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Rimuove immediatamente hover su dispositivi touch
    if (!supportsHover) {
      setIsHovered(false);
    }
    // Rimuove il focus dopo il click
    setTimeout(() => {
      if (e.currentTarget) {
        (e.currentTarget as HTMLElement).blur();
      }
    }, 0);
    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (supportsHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (supportsHover) {
      setIsHovered(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Previene problemi di touch su iOS e forza nessun hover
    (e.currentTarget.style as any).webkitTapHighlightColor = 'transparent';
    setIsHovered(false);
  };

  const handleTouchEnd = () => {
    // Assicura che hover sia disabilitato dopo touch
    setIsHovered(false);
  };

  return (
    <div
      className={`${baseClasses} ${getClasses()} cursor-pointer focus:outline-none ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      {...props}
    >
      <span className="text-[14px] lg:text-[15px] 2xl:text-[17px] pointer-events-none">
        {children}
      </span>
    </div>
  );
}
