'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useShiplyContext } from '@/contexts/ShiplyContext';
import { SHIPLY_EVENTS, ShiplyEvent } from '@/lib/shiply-config';

/**
 * Custom hook for Shiply functionality
 * Provides easy access to feedback tracking and widget control
 */
export const useShiply = () => {
    const { currentUser } = useAuth();
    const { ShiplyInstance } = useShiplyContext();

    /**
     * Track a custom event
     */
    const trackEvent = useCallback((eventName: ShiplyEvent, eventData: Record<string, unknown> = {}) => {
        if (!currentUser || !ShiplyInstance.current) return;

        try {
            ShiplyInstance.current.track(eventName, {
                ...eventData,
                userId: currentUser.uid,
                email: currentUser.email,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.warn('Failed to track event:', error);
        }
    }, [currentUser, ShiplyInstance]);

    /**
     * Show the feedback widget
     */
    const showWidget = useCallback(() => {
        if (!currentUser || !ShiplyInstance.current) return;

        try {
            ShiplyInstance.current.show();
        } catch (error) {
            console.warn('Failed to show widget:', error);
        }
    }, [currentUser, ShiplyInstance]);

    /**
     * Hide the feedback widget
     */
    const hideWidget = useCallback(() => {
        if (!currentUser || !ShiplyInstance.current) return;

        try {
            ShiplyInstance.current.hide();
        } catch (error) {
            console.warn('Failed to hide widget:', error);
        }
    }, [currentUser, ShiplyInstance]);

    /**
     * Toggle the feedback widget
     */
    const toggleWidget = useCallback(() => {
        if (!currentUser || !ShiplyInstance.current) return;

        try {
            console.log('Toggling feedback widget');
            ShiplyInstance.current.toggle();
        } catch (error) {
            console.warn('Failed to toggle widget:', error);
        }
    }, [currentUser, ShiplyInstance]);

    /**
     * Submit feedback programmatically
     */
    const submitFeedback = useCallback(async (feedbackData: {
        rating: number;
        text?: string;
        category?: string;
    }) => {
        if (!currentUser || !ShiplyInstance.current) return;

        try {
            return await ShiplyInstance.current.submitFeedback({
                ...feedbackData,
                userId: currentUser.uid,
                email: currentUser.email,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.warn('Failed to submit feedback:', error);
        }
    }, [currentUser, ShiplyInstance]);

    /**
     * Track page views
     */
    const trackPageView = useCallback((page: string) => {
        trackEvent(SHIPLY_EVENTS.NAVIGATION, {
            page,
            action: 'page_view',
        });
    }, [trackEvent]);

    /**
     * Track user actions
     */
    const trackUserAction = useCallback((action: string, details: Record<string, unknown> = {}) => {
        trackEvent(SHIPLY_EVENTS.USER_MANAGEMENT_ACTION, {
            action,
            ...details,
        });
    }, [trackEvent]);

    /**
     * Track feedback actions
     */
    const trackFeedbackAction = useCallback((action: string, details: Record<string, unknown> = {}) => {
        trackEvent(SHIPLY_EVENTS.FEEDBACK_ACTION, {
            action,
            ...details,
        });
    }, [trackEvent]);

    /**
     * Track errors
     */
    const trackError = useCallback((error: Error, context: Record<string, unknown> = {}) => {
        trackEvent(SHIPLY_EVENTS.ERROR_OCCURRED, {
            error: error.message,
            stack: error.stack,
            ...context,
        });
    }, [trackEvent]);

    return {
        // Widget control
        showWidget,
        hideWidget,
        toggleWidget,
        submitFeedback,

        // Event tracking
        trackEvent,
        trackPageView,
        trackUserAction,
        trackFeedbackAction,
        trackError,

        // Status
        isAvailable: !!currentUser && !!ShiplyInstance.current,
        currentUser,
    };
};
