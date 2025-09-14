'use client';

import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { FeedbacklyInstance } from '@/lib/feedbackly-loader';

interface FeedbacklyContextType {
  feedbacklyInstance: React.MutableRefObject<FeedbacklyInstance | null>;
  setFeedbacklyInstance: (instance: FeedbacklyInstance | null) => void;
}

const FeedbacklyContext = createContext<FeedbacklyContextType | null>(null);

export function FeedbacklyProvider({ children }: { children: ReactNode }) {
  const feedbacklyInstance = useRef<FeedbacklyInstance | null>(null);

  const setFeedbacklyInstance = (instance: FeedbacklyInstance | null) => {
    feedbacklyInstance.current = instance;
  };

  return (
    <FeedbacklyContext.Provider value={{ feedbacklyInstance, setFeedbacklyInstance }}>
      {children}
    </FeedbacklyContext.Provider>
  );
}

export function useFeedbacklyContext() {
  const context = useContext(FeedbacklyContext);
  if (!context) {
    throw new Error('useFeedbacklyContext must be used within a FeedbacklyProvider');
  }
  return context;
}
