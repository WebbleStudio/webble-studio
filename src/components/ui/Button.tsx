import React from 'react';

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
      <div className="relative w-[14px] h-[14px] overflow-hidden flex items-center justify-center">
        <img
          src="/icons/diagonal-arrow.svg"
          alt=""
          width={12}
          height={12}
          className="arrow-main absolute icon-filter-white"
        />
        <img
          src="/icons/diagonal-arrow.svg"
          alt=""
          width={12}
          height={12}
          className="arrow-secondary absolute icon-filter-white"
        />
      </div>
    </button>
  );
}
