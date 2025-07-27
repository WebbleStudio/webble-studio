'use client';

import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';

interface ScrollContextType {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
  activeSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScrollContainer = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContainer must be used within a ScrollProvider');
  }
  return context;
};

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  return (
    <ScrollContext.Provider value={{ scrollContainerRef, activeSectionIndex, setActiveSectionIndex }}>
      {children}
    </ScrollContext.Provider>
  );
}; 