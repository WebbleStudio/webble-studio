import React from 'react';

interface LabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <div
      className={`px-[20px] py-2 rounded-full font-medium border-[0.5px] border-auto text-auto bg-transparent dark:border-auto-inverse dark:text-auto-inverse flex items-center gap-2 lg:px-[24px] lg:py-2.5 transition-all duration-300 ${className}`}
      {...props}
    >
      <span className="text-[14px] lg:text-[15px] 2xl:text-[17px]">{children}</span>
    </div>
  );
}
