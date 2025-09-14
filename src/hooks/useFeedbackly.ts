'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedbacklyContext } from '@/contexts/FeedbacklyContext';
import { FEEDBACKLY_EVENTS, FeedbacklyEvent } from '@/lib/feedbackly-config';

/**
 * Custom hook for Feedbackly functionality
 * Provides easy access to feedback tracking and widget control
 */
export const useFeedbackly = () => {
    const { currentUser } = useAuth();
    const { feedbacklyInstance } = useFeedbacklyContext();

    /**
     * Track a custom event
     */
    const trackEvent = useCallback((eventName: FeedbacklyEvent, eventData: Record<string, unknown> = {}) => {
        if (!currentUser || !feedbacklyInstance.current) return;

        try {
            feedbacklyInstance.current.track(eventName, {
                ...eventData,
                userId: currentUser.uid,
                email: currentUser.email,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.warn('Failed to track event:', error);
        }
    }, [currentUser, feedbacklyInstance]);

    /**
     * Show the feedback widget
     */
    const showWidget = useCallback(() => {
        if (!currentUser || !feedbacklyInstance.current) return;

        try {
            feedbacklyInstance.current.show();
        } catch (error) {
            console.warn('Failed to show widget:', error);
        }
    }, [currentUser, feedbacklyInstance]);

    /**
     * Hide the feedback widget
     */
    const hideWidget = useCallback(() => {
        if (!currentUser || !feedbacklyInstance.current) return;

        try {
            feedbacklyInstance.current.hide();
        } catch (error) {
            console.warn('Failed to hide widget:', error);
        }
    }, [currentUser, feedbacklyInstance]);

    /**
     * Toggle the feedback widget
     */
    const toggleWidget = useCallback(() => {
        if (!currentUser || !feedbacklyInstance.current) return;

        try {
            console.log('Toggling feedback widget');
            feedbacklyInstance.current.toggle();
        } catch (error) {
            console.warn('Failed to toggle widget:', error);
        }
    }, [currentUser, feedbacklyInstance]);

    /**
     * Submit feedback programmatically
     */
    const submitFeedback = useCallback(async (feedbackData: {
        rating: number;
        text?: string;
        category?: string;
    }) => {
        if (!currentUser || !feedbacklyInstance.current) return;

        try {
            return await feedbacklyInstance.current.submitFeedback({
                ...feedbackData,
                userId: currentUser.uid,
                email: currentUser.email,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.warn('Failed to submit feedback:', error);
        }
    }, [currentUser, feedbacklyInstance]);

    /**
     * Track page views
     */
    const trackPageView = useCallback((page: string) => {
        trackEvent(FEEDBACKLY_EVENTS.NAVIGATION, {
            page,
            action: 'page_view',
        });
    }, [trackEvent]);

    /**
     * Track user actions
     */
    const trackUserAction = useCallback((action: string, details: Record<string, unknown> = {}) => {
        trackEvent(FEEDBACKLY_EVENTS.USER_MANAGEMENT_ACTION, {
            action,
            ...details,
        });
    }, [trackEvent]);

    /**
     * Track feedback actions
     */
    const trackFeedbackAction = useCallback((action: string, details: Record<string, unknown> = {}) => {
        trackEvent(FEEDBACKLY_EVENTS.FEEDBACK_ACTION, {
            action,
            ...details,
        });
    }, [trackEvent]);

    /**
     * Track errors
     */
    const trackError = useCallback((error: Error, context: Record<string, unknown> = {}) => {
        trackEvent(FEEDBACKLY_EVENTS.ERROR_OCCURRED, {
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
        isAvailable: !!currentUser && !!feedbacklyInstance.current,
        currentUser,
    };
};
