'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUser } from '@/lib/firestore';
import { useShiplyContext } from '@/contexts/ShiplyContext';
import { shiplyLoader, ShiplyInstance } from '@/lib/shiply-loader';
import { WidgetConfig } from '@/types';
// import { shiplyConfig } from '@/lib/shiply-config';

interface ShiplyWidgetProps {
  // apiKey and websiteId are now resolved from the user's profile
  apiKey?: string; // Optional, will be overridden by user's API key
  websiteId?: string; // Optional, will be overridden with 'admin-portal'
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
  text?: {
    title?: string;
    ratingLabel?: string;
    feedbackLabel?: string;
    feedbackPlaceholder?: string;
    categoryLabel?: string;
    submitButton?: string;
    cancelButton?: string;
  };
  categories?: Array<{
    value: string;
    label: string;
  }>;
  autoShow?: boolean;
  autoShowDelay?: number;
}

export default function ShiplyWidget({
  apiKey: _apiKey, // eslint-disable-line @typescript-eslint/no-unused-vars
  websiteId: _websiteId, // eslint-disable-line @typescript-eslint/no-unused-vars
  theme = {},
  position = {},
  size = {},
  text = {},
  categories = [],
  autoShow = false,
  autoShowDelay = 5000,
}: ShiplyWidgetProps) {
  const { currentUser } = useAuth();
  const { setShiplyInstance } = useShiplyContext();
  const ShiplyRef = useRef<ShiplyInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only initialize if user is logged in
    if (!currentUser) {
      // Clean up if user logs out
      if (ShiplyRef.current) {
        ShiplyRef.current.destroy();
        ShiplyRef.current = null;
        setShiplyInstance(null);
      }
      return;
    }

    // Get user's API key and SDK config from their user document
    const getUserData = async (): Promise<{ apiKey: string; sdkConfig: WidgetConfig } | null> => {
      if (!currentUser) return null;
      try {
        const userDoc = await getUser(currentUser.uid);
        if (!userDoc?.apiKey || !userDoc?.sdkConfig) return null;
        return {
          apiKey: userDoc.apiKey,
          sdkConfig: userDoc.sdkConfig
        };
      } catch (error) {
        console.error('Error getting user data:', error);
        return null;
      }
    };

    // Initialize Shiply SDK
    const initializeShiply = async () => {
      try {
        const userData = await getUserData();
        if (!userData) {
          setError('No user data found (API key or SDK config missing)');
          return;
        }

        // Load the appropriate SDK (npm package or local)
        const Shiply = await shiplyLoader.loadSDK();
        
        // Initialize with user's SDK config, merging with any passed props
        Shiply.init({
          apiKey: userData.apiKey,
          websiteId: 'admin-portal', // Keep for SDK compatibility, but not used for config fetching
          theme: {
            ...userData.sdkConfig.theme,
            ...theme,
          },
          position: {
            ...userData.sdkConfig.position,
            ...position,
          },
          size: {
            ...userData.sdkConfig.size,
            ...size,
          },
          text: {
            ...userData.sdkConfig.text,
            ...text,
          },
          categories: [
            ...userData.sdkConfig.behavior.categories,
            ...categories,
          ],
          behavior: {
            ...userData.sdkConfig.behavior,
            autoShow,
            autoShowDelay,
          },
          branding: {
            ...userData.sdkConfig.branding,
          },
          user: {
            id: currentUser.uid,
            email: currentUser.email || '',
            name: currentUser.displayName || '',
            photoURL: currentUser.photoURL || '',
          },
        });

        // Store the instance
        ShiplyRef.current = Shiply;
        setShiplyInstance(Shiply);
        setError(null);

        // Set user information
        Shiply.setUser({
          id: currentUser.uid,
          email: currentUser.email || '',
          name: currentUser.displayName || '',
          photoURL: currentUser.photoURL || '',
        });

        // Auto-show if enabled
        if (autoShow) {
          setTimeout(() => {
            Shiply.show();
          }, autoShowDelay);
        }

        // Track that user opened the admin portal
        try {
          Shiply.track('admin_portal_opened', {
            userId: currentUser.uid,
            email: currentUser.email,
            timestamp: new Date().toISOString(),
          });
        } catch (trackError) {
          console.warn('Failed to track admin portal opened event:', trackError);
        }

      } catch (err) {
        console.error('Failed to initialize Shiply:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize feedback widget');
      }
    };

    initializeShiply();

    // Cleanup function
    return () => {
      if (ShiplyRef.current) {
        ShiplyRef.current.destroy();
        ShiplyRef.current = null;
        setShiplyInstance(null);
      }
    };
  }, [currentUser, theme, position, size, text, categories, autoShow, autoShowDelay, setShiplyInstance]);

  // Update user info when currentUser changes
  useEffect(() => {
    if (ShiplyRef.current && currentUser) {
      ShiplyRef.current.setUser({
        id: currentUser.uid,
        email: currentUser.email || '',
        name: currentUser.displayName || '',
        photoURL: currentUser.photoURL || '',
      });
    }
  }, [currentUser]);

  // Don't render anything if user is not logged in
  if (!currentUser) {
    return null;
  }

  // Show error if there is one (for debugging)
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

  // The widget is rendered by the SDK itself, so we don't need to return JSX
  // But we can return a hidden div to satisfy React's requirements
  return (
    <div style={{ display: 'none' }}>
      {/* Shiply widget is rendered by the SDK */}
    </div>
  );
}
