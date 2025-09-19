'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUser } from '@/lib/firestore';
import { useShiplyContext } from '@/contexts/ShiplyContext';
import { shiplyLoader, ShiplyInstance } from '@/lib/shiply-loader';
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
  apiKey: _apiKey, // Not used - API key is resolved from user document
  websiteId: _websiteId, // Not used - websiteId is set to 'admin-portal'
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

    // Get user's API key from their user document
    const getUserApiKey = async (): Promise<string | null> => {
      if (!currentUser) return null;
      try {
        const userDoc = await getUser(currentUser.uid);
        return userDoc?.apiKey || null;
      } catch (error) {
        console.error('Error getting user API key:', error);
        return null;
      }
    };

    // Initialize Shiply SDK
    const initializeShiply = async () => {
      try {
        const effectiveApiKey = await getUserApiKey();
        if (!effectiveApiKey) {
          setError('No API key found for this user');
          return;
        }

        // Load the appropriate SDK (npm package or local)
        const Shiply = await shiplyLoader.loadSDK();
        
        // Initialize with configuration
        Shiply.init({
          apiKey: effectiveApiKey,
          websiteId: 'admin-portal', // Use a fixed identifier for the admin portal
          theme: {
            primaryColor: '#007bff',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            borderColor: '#e1e5e9',
            borderRadius: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            headerBackgroundColor: '#f8f9fa',
            footerBackgroundColor: '#f8f9fa',
            ...theme,
          },
          position: {
            bottom: '20px',
            right: '20px',
            ...position,
          },
          size: {
            width: '350px',
            height: '500px',
            ...size,
          },
          text: {
            title: 'Share Your Feedback',
            ratingLabel: 'How would you rate your experience?',
            feedbackLabel: 'Tell us more (optional)',
            feedbackPlaceholder: 'Share your thoughts, suggestions, or report any issues...',
            categoryLabel: 'Category',
            submitButton: 'Submit',
            cancelButton: 'Cancel',
            ...text,
          },
          categories: [
            { value: 'bug', label: 'Bug Report' },
            { value: 'feature', label: 'Feature Request' },
            { value: 'ui', label: 'UI/UX Issue' },
            { value: 'performance', label: 'Performance Issue' },
            { value: 'general', label: 'General Feedback' },
            ...categories,
          ],
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
