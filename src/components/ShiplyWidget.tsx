'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useShiplyContext } from '@/contexts/ShiplyContext';
import { shiplyLoader, ShiplyInstance } from '@/lib/shiply-loader';
import { shiplyConfig } from '@/lib/shiply-config';

interface ShiplyWidgetProps {
  apiKey: string;
  websiteId: string;
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
  apiKey,
  websiteId,
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
  const [isLoading, setIsLoading] = useState(false);

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

    // Initialize Shiply SDK
    const initializeShiply = async () => {
      try {
        setIsLoading(true);
        
        // Load the appropriate SDK (npm package or local)
        const Shiply = await shiplyLoader.loadSDK();
        
        // Initialize with configuration
        Shiply.init({
          apiKey,
          websiteId,
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
      } finally {
        setIsLoading(false);
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
  }, [currentUser, apiKey, websiteId, theme, position, size, text, categories, autoShow, autoShowDelay, setShiplyInstance]);

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

  // Don't render anything if user is not logged in or there's an error
  if (!currentUser || error) {
    return null;
  }

  // The widget is rendered by the SDK itself, so we don't need to return JSX
  // But we can return a hidden div to satisfy React's requirements
  return (
    <div style={{ display: 'none' }}>
      {/* Shiply widget is rendered by the SDK */}
    </div>
  );
}
