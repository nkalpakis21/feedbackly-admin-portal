'use client';

import React, { createContext, useContext, useRef, ReactNode } from 'react';
import Feedbackly from '@/lib/feedbackly/core/Feedbackly';

interface FeedbacklyContextType {
  feedbacklyInstance: React.MutableRefObject<Feedbackly | null>;
  setFeedbacklyInstance: (instance: Feedbackly | null) => void;
}

const FeedbacklyContext = createContext<FeedbacklyContextType | null>(null);

export function FeedbacklyProvider({ children }: { children: ReactNode }) {
  const feedbacklyInstance = useRef<Feedbackly | null>(null);

  const setFeedbacklyInstance = (instance: Feedbackly | null) => {
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
