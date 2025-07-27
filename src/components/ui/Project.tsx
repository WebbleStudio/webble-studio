import React from 'react';

interface ProjectProps {
  title: string;
  category: string;
  imageUrl?: string;
  className?: string;
  onClick?: () => void;
}

export default function Project({ 
  title, 
  category, 
  imageUrl, 
  className = '', 
  onClick 
}: ProjectProps) {
  return (
    <div 
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Immagine del progetto */}
      <div className="relative w-full h-[230px] sm:h-[320px] lg:h-[360px] mb-4 rounded-lg overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // Placeholder rettangolo rosso
          <div className="w-full h-full bg-red-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-medium text-sm opacity-50">IMAGE</span>
          </div>
        )}
        
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>
      
      {/* Informazioni progetto */}
      <div className="flex flex-col mb-2">
        <h3 className="text-black dark:text-white font-medium text-[20px] lg:text-[18px] 2xl:text-[20px] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-black/60 dark:text-white/60 text-[14px] lg:text-[15px] 2xl:text-[16px] transition-colors duration-300">
          {category}
        </p>
      </div>
    </div>
  );
} 