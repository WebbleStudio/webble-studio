import React from 'react';

interface ProjectProps {
  title: string;
  description: string;
  imageUrl?: string;
  hasLink?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Project({
  title,
  description,
  imageUrl,
  hasLink = false,
  className = '',
  onClick,
}: ProjectProps) {
  return (
    <div
      className={`group ${hasLink ? 'cursor-pointer' : 'cursor-default'} ${className}`}
      onClick={onClick}
    >
      {/* Immagine del progetto */}
      <div className="relative w-full h-[230px] sm:h-[320px] lg:h-[360px] mb-4 rounded-lg overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-300 ${hasLink ? 'group-hover:scale-105' : ''}`}
          />
        ) : (
          // Placeholder rettangolo rosso
          <div
            className={`w-full h-full bg-red-500 flex items-center justify-center transition-transform duration-300 ${hasLink ? 'group-hover:scale-105' : ''}`}
          >
            <span className="text-white font-medium text-sm opacity-50">IMAGE</span>
          </div>
        )}

        {/* Overlay hover */}
        <div
          className={`absolute inset-0 bg-black/0 transition-all duration-300 ${hasLink ? 'group-hover:bg-black/20' : ''}`}
        />

        {/* Icona link esterno per progetti cliccabili */}
        {hasLink && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="w-4 h-4 text-black dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Informazioni progetto */}
      <div className="flex flex-col mb-2">
        <h3
          className={`font-medium text-[20px] lg:text-[18px] 2xl:text-[20px] transition-colors duration-300 ${
            hasLink
              ? 'text-black dark:text-white group-hover:text-[#F20352] dark:group-hover:text-[#F20352]'
              : 'text-black dark:text-white'
          }`}
        >
          {title}
        </h3>
        <p className="text-black/60 dark:text-white/60 text-[14px] lg:text-[15px] 2xl:text-[16px] transition-colors duration-300 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
