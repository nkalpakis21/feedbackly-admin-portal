'use client';

import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { ShiplyInstance } from '@/lib/shiply-loader';

interface ShiplyContextType {
  ShiplyInstance: React.MutableRefObject<ShiplyInstance | null>;
  setShiplyInstance: (instance: ShiplyInstance | null) => void;
}

const ShiplyContext = createContext<ShiplyContextType | null>(null);

export function ShiplyProvider({ children }: { children: ReactNode }) {
  const ShiplyInstance = useRef<ShiplyInstance | null>(null);

  const setShiplyInstance = (instance: ShiplyInstance | null) => {
    ShiplyInstance.current = instance;
  };

  return (
    <ShiplyContext.Provider value={{ ShiplyInstance, setShiplyInstance }}>
      {children}
    </ShiplyContext.Provider>
  );
}

export function useShiplyContext() {
  const context = useContext(ShiplyContext);
  if (!context) {
    throw new Error('useShiplyContext must be used within a ShiplyProvider');
  }
  return context;
}
