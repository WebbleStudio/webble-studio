import React from 'react';
import OptimizedImage from './OptimizedImage';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export default function Button({ children = 'Contattaci', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-[24px] py-2.5 rounded-[12px] font-medium border-[0.5px] text-main btn-glass flex items-center gap-2 transition-all duration-200 ease-out ${className}`}
      {...props}
    >
      <span className="text-[15px]">{children}</span>
      <div className="relative w-3 h-3 overflow-hidden">
        <OptimizedImage
          src="/icons/diagonal-arrow.svg"
          alt="Arrow"
          width={12}
          height={12}
          className="arrow-main absolute icon-filter"
        />
        <OptimizedImage
          src="/icons/diagonal-arrow.svg"
          alt="Arrow"
          width={12}
          height={12}
          className="arrow-secondary absolute icon-filter"
        />
      </div>
    </button>
  );
}
