import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-[1140px] px-6 md:px-8 2xl:max-w-[1340px] ${className}`}>{children}</div>
  );
}
