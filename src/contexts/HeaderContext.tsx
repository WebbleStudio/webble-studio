'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
  isHeaderVisible: boolean;
  hideHeader: () => void;
  showHeader: () => void;
  refreshHeader: () => void;
  refreshKey: number;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const hideHeader = () => setIsHeaderVisible(false);
  const showHeader = () => {
    // Force a complete re-mount by briefly hiding and then showing
    setIsHeaderVisible(false);
    setTimeout(() => {
      setIsHeaderVisible(true);
      // Additional refresh trigger
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
      }, 50);
    }, 10);
  };
  const refreshHeader = () => setRefreshKey((prev) => prev + 1);

  return (
    <HeaderContext.Provider
      value={{ isHeaderVisible, hideHeader, showHeader, refreshHeader, refreshKey }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}
