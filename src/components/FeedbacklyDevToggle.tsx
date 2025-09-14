'use client';

import { useState, useEffect } from 'react';
import { feedbacklyConfig } from '@/lib/feedbackly-config';

export default function FeedbacklyDevToggle() {
  const [isLocalSDK, setIsLocalSDK] = useState(feedbacklyConfig.useLocalSDK);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  const toggleSDKSource = () => {
    const newValue = !isLocalSDK;
    setIsLocalSDK(newValue);
    
    // Update URL parameter for easy testing
    const url = new URL(window.location.href);
    if (newValue) {
      url.searchParams.set('use-local-sdk', 'true');
    } else {
      url.searchParams.delete('use-local-sdk');
    }
    window.history.replaceState({}, '', url.toString());
    
    // Show reload message
    alert(`SDK source changed to ${newValue ? 'Local Development' : 'NPM Package'}. Please reload the page to apply changes.`);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-gray-700">🔧 Feedbackly SDK</span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-600">Source:</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isLocalSDK 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {isLocalSDK ? 'Local Dev' : 'NPM Package'}
        </span>
      </div>
      
      <button
        onClick={toggleSDKSource}
        className="w-full px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
      >
        Switch to {isLocalSDK ? 'NPM Package' : 'Local Dev'}
      </button>
      
      <div className="mt-2 text-xs text-gray-500">
        {isLocalSDK ? 'Using local SDK files' : 'Using npm package v1.0.0'}
      </div>
    </div>
  );
}
