import React from 'react';
import Image from 'next/image';

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
      className={`px-[24px] py-2.5 rounded-[12px] font-medium bg-second text-main flex items-center gap-2 sm:px-[32px] sm:py-3 sm:text-[17px] ${className}`}
      {...props}
    >
      <span className="text-[15px] sm:text-[17px]">{children}</span>
      <Image
        src="/icons/diagonal-arrow.svg"
        alt="Arrow"
        width={12}
        height={12}
        className="arrow translate-y-[1px]"
      />
    </button>
  );
}
