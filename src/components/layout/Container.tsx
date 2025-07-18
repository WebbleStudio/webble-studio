import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div
      className={`w-full max-w-[1300px] 2xl:max-w-[1650px] px-5 md:px-[30px] ${className}`.trim()}
    >
      {children}
    </div>
  );
}
