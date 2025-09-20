'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUser } from '@/lib/firestore';
import { WidgetConfig } from '@/types';
import ShiplyFeedback from 'shiply-sdk';

interface ShiplyWidgetProps {
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    fontFamily?: string;
    fontSize?: string;
    headerBackgroundColor?: string;
    footerBackgroundColor?: string;
  };
  position?: {
    bottom?: string;
    right?: string;
  };
  size?: {
    width?: string;
    height?: string;
  };
  autoShow?: boolean;
  autoShowDelay?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ShiplyWidget({
  theme = {},
  position = {},
  size = {},
  autoShow = false,
  autoShowDelay = 5000,
  children,
  className,
  style,
}: ShiplyWidgetProps) {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<{ apiKey: string; sdkConfig: WidgetConfig } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch user data if user is logged in
    if (!currentUser) {
      setUserData(null);
      setError(null);
      return;
    }

    // Get user's API key and SDK config from their user document
    const fetchUserData = async () => {
      try {
        const userDoc = await getUser(currentUser.uid);
        console.log('🔍 Debug: User document:', userDoc);
        
        if (!userDoc?.apiKey || !userDoc?.sdkConfig) {
          setError('No user data found (API key or SDK config missing)');
          return;
        }

        setUserData({
          apiKey: userDoc.apiKey,
          sdkConfig: userDoc.sdkConfig
        });
        setError(null);
      } catch (error) {
        console.error('Error getting user data:', error);
        setError('Failed to load user configuration');
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Don't render anything if user is not logged in
  if (!currentUser) {
    return null;
  }

  // Show error if there is one
  if (error) {
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        background: '#ff4444', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        zIndex: 10000,
        fontSize: '12px',
        maxWidth: '300px'
      }}>
        <strong>Widget Error:</strong> {error}
      </div>
    );
  }

  // Don't render if we don't have user data yet
  if (!userData) {
    return null;
  }

  // Merge user's SDK config with any passed props
  const mergedTheme = {
    ...userData.sdkConfig.theme,
    ...theme,
  };

  const mergedPosition = {
    ...userData.sdkConfig.position,
    ...position,
  };

  const mergedSize = {
    ...userData.sdkConfig.size,
    ...size,
  };

  return (
    <ShiplyFeedback
      apiKey={userData.apiKey}
      websiteId="admin-portal"
      theme={mergedTheme}
      position={mergedPosition}
      size={mergedSize}
      autoShow={autoShow}
      autoShowDelay={autoShowDelay}
      onFeedbackSubmit={(feedbackData) => {
        console.log('Feedback submitted:', feedbackData);
        // You can add additional handling here if needed
      }}
      onError={(err) => {
        console.error('ShiplyFeedback error:', err);
        setError(err.message);
      }}
      className={className}
      style={style}
    >
      {children}
    </ShiplyFeedback>
  );
}
