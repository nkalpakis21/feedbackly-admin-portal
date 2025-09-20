import React from 'react';

interface ShiplyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function ShiplyLogo({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: ShiplyLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Ship Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-blue-600"
          fill="currentColor"
        >
          {/* Ship Hull */}
          <path d="M20 60 L80 60 L75 70 L25 70 Z" />
          
          {/* Ship Cabin */}
          <path d="M30 50 L70 50 L70 60 L30 60 Z" />
          
          {/* Windows */}
          <rect x="35" y="52" width="8" height="6" fill="white" opacity="0.8" />
          <rect x="57" y="52" width="8" height="6" fill="white" opacity="0.8" />
          
          {/* Mast */}
          <rect x="48" y="40" width="4" height="20" />
          
          {/* Flag */}
          <path d="M52 40 L60 40 L58 45 L52 45 Z" />
          
          {/* Water Waves */}
          <path d="M15 70 Q20 65 25 70 T35 70 T45 70 T55 70 T65 70 T75 70 T85 70" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" />
          <path d="M10 75 Q15 70 20 75 T30 75 T40 75 T50 75 T60 75 T70 75 T80 75 T90 75" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" />
          <path d="M5 80 Q10 75 15 80 T25 80 T35 80 T45 80 T55 80 T65 80 T75 80 T85 80 T95 80" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" />
        </svg>
      </div>
      
      {/* Company Name */}
      {showText && (
        <span className={`font-bold text-white ${textSizeClasses[size]}`}>
          Shiply
        </span>
      )}
    </div>
  );
}
