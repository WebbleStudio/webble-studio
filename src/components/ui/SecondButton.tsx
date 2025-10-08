import React from 'react';
import OptimizedImage from './OptimizedImage';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export default function SecondButton({
  children = 'Contattaci',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`group px-6 py-2.5 xs:px-7 xs:py-3 rounded-xl font-medium bg-bg-secondary text-text-inverse flex items-center gap-2 btn-secondary transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ef2d56] hover:to-[#f4f4f4] ${className}`}
      {...props}
    >
      <span className="text-[15px] xs:text-[16px]">{children}</span>
      <div className="transition-transform duration-300 group-hover:rotate-90">
        <OptimizedImage
          src="/icons/diagonal-arrow.svg"
          alt="Arrow"
          width={12}
          height={12}
          className="arrow translate-y-[1px] icon-filter-dark-black"
        />
      </div>
    </button>
  );
}
