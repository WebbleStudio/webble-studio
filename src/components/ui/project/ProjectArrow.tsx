import React from 'react';
import OptimizedImage from '../OptimizedImage';

interface ProjectArrowProps {
  direction: 'left' | 'right';
  onClick?: () => void;
  size?: 'small' | 'large';
  className?: string;
}

/**
 * Reusable arrow component for project navigation
 * Supports different sizes and directions
 */
export default function ProjectArrow({
  direction,
  onClick,
  size = 'large',
  className = '',
}: ProjectArrowProps) {
  const iconSize = size === 'small' ? 24 : 28;
  const padding = size === 'small' ? 'p-2' : 'p-3';
  const iconPath = direction === 'left' ? '/icons/arrow-left.svg' : '/icons/arrow-right.svg';
  const altText = direction === 'left' ? 'Previous project' : 'Next project';

  return (
    <div
      className={`cursor-pointer transition-opacity hover:opacity-70 bg-black bg-opacity-20 rounded-full ${padding} ${className}`}
      onClick={onClick}
    >
      <OptimizedImage
        src={iconPath}
        alt={altText}
        width={iconSize}
        height={iconSize}
        className={size === 'small' ? 'w-6 h-6' : 'w-7 h-7'}
      />
    </div>
  );
}
