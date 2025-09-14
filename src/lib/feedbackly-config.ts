/**
 * Feedbackly SDK Configuration for Admin Portal
 * Supports both NPM package and local development modes
 */

// Environment-based SDK source configuration
export interface FeedbacklySourceConfig {
    useLocalSDK: boolean;
    localSDKPath?: string;
    npmPackageVersion?: string;
}

// Environment configuration for SDK source
const getFeedbacklySourceConfig = (): FeedbacklySourceConfig => {
    // Only use environment variable for configuration
    const useLocalSDK = process.env.NEXT_PUBLIC_USE_LOCAL_FEEDBACKLY_SDK === 'true';

    return {
        useLocalSDK,
        localSDKPath: process.env.NEXT_PUBLIC_LOCAL_FEEDBACKLY_PATH || '../feedbackly-sdk',
        npmPackageVersion: process.env.NEXT_PUBLIC_FEEDBACKLY_VERSION || '^1.0.0'
    };
};

export const feedbacklySourceConfig = getFeedbacklySourceConfig();

// Log current configuration in development
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Feedbackly SDK Configuration:', {
        useLocalSDK: feedbacklySourceConfig.useLocalSDK,
        source: feedbacklySourceConfig.useLocalSDK ? 'Local Development' : 'NPM Package',
        version: feedbacklySourceConfig.useLocalSDK ? 'Local' : feedbacklySourceConfig.npmPackageVersion
    });
}

// Widget Configuration
export const FEEDBACKLY_CONFIG = {
    // API Configuration
    apiKey: process.env.NEXT_PUBLIC_FEEDBACKLY_API_KEY || '',
    websiteId: process.env.NEXT_PUBLIC_FEEDBACKLY_WEBSITE_ID || 'admin-portal',

    // Widget Theme - Admin Portal specific
    theme: {
        primaryColor: '#007bff',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        borderColor: '#e1e5e9',
        borderRadius: '8px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        headerBackgroundColor: '#f8f9fa',
        footerBackgroundColor: '#f8f9fa',
    },

    // Widget Position
    position: {
        bottom: '20px',
        right: '20px',
    },

    // Widget Size
    size: {
        width: '350px',
        height: '500px',
    },

    // Text Content
    text: {
        title: 'Admin Portal Feedback',
        ratingLabel: 'How would you rate your experience with the admin portal?',
        feedbackLabel: 'Tell us more about your experience (optional)',
        feedbackPlaceholder: 'Share your thoughts about the admin portal, report bugs, or suggest improvements...',
        categoryLabel: 'Feedback Category',
        submitButton: 'Submit Feedback',
        cancelButton: 'Cancel',
    },

    // Feedback Categories specific to admin portal
    categories: [
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'ui', label: 'UI/UX Issue' },
        { value: 'performance', label: 'Performance Issue' },
        { value: 'navigation', label: 'Navigation Issue' },
        { value: 'data', label: 'Data Display Issue' },
        { value: 'authentication', label: 'Authentication Issue' },
        { value: 'general', label: 'General Feedback' },
    ],

    // Auto-show settings
    autoShow: false,
    autoShowDelay: 5000,

    // Z-index to ensure it appears above other elements
    zIndex: 9999,
};

export const FEEDBACKLY_EVENTS = {
    ADMIN_PORTAL_OPENED: 'admin_portal_opened',
    DASHBOARD_VIEWED: 'dashboard_viewed',
    USERS_PAGE_VIEWED: 'users_page_viewed',
    FEEDBACK_PAGE_VIEWED: 'feedback_page_viewed',
    USER_MANAGEMENT_ACTION: 'user_management_action',
    FEEDBACK_ACTION: 'feedback_action',
    NAVIGATION: 'navigation',
    ERROR_OCCURRED: 'error_occurred',
    FEEDBACK_BUTTON_CLICKED: 'feedback_button_clicked',
} as const;

export type FeedbacklyEvent = typeof FEEDBACKLY_EVENTS[keyof typeof FEEDBACKLY_EVENTS];

// Export both configurations for backward compatibility
export const feedbacklyConfig = feedbacklySourceConfig;
export default feedbacklySourceConfig;