'use client';

import React from 'react';

interface FilterButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function FilterButton({ className = '', ...props }: FilterButtonProps) {
  return (
    <button
      className={`p-3 lg:p-3.5 rounded-full font-medium border-[0.5px] border-black dark:border-white text-black dark:text-white bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 ${className}`}
      {...props}
    >
      {/* Icona filter semplice con SVG inline */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="lg:w-5 lg:h-5"
      >
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
      </svg>
    </button>
  );
} 