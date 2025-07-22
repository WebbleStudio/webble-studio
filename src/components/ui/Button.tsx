import React from 'react';
import OptimizedImage from './OptimizedImage';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export default function Button({ children = 'Contattaci', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-[24px] py-2.5 rounded-[12px] font-medium border-[0.5px] text-main bg-[rgba(250,250,250,0.05)] border-[#fafafa]/40 flex items-center gap-2 ${className}`}
      {...props}
    >
      <span className="text-[15px]">{children}</span>
      <OptimizedImage
        src="/icons/diagonal-arrow.svg"
        alt="Arrow"
        width={12}
        height={12}
        className="arrow translate-y-[1px]"
      />
    </button>
  );
}
