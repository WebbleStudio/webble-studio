import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px] ${className}`}>{children}</div>
  );
}
