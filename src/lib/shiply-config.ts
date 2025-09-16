/**
 * Shiply SDK Configuration for Admin Portal
 * Supports both NPM package and local development modes
 */

// Environment-based SDK source configuration
export interface ShiplySourceConfig {
    useLocalSDK: boolean;
    localSDKPath?: string;
    npmPackageVersion?: string;
}

// Environment configuration for SDK source
const getShiplySourceConfig = (): ShiplySourceConfig => {
    // Only use environment variable for configuration
    const useLocalSDK = process.env.NEXT_PUBLIC_USE_LOCAL_SHIPLY_SDK === 'true';

    return {
        useLocalSDK,
        localSDKPath: process.env.NEXT_PUBLIC_LOCAL_SHIPLY_PATH || '../shiply-sdk',
        npmPackageVersion: process.env.NEXT_PUBLIC_SHIPLY_VERSION || '^1.2.0'
    };
};

export const shiplySourceConfig = getShiplySourceConfig();

// Log current configuration in development
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Shiply SDK Configuration:', {
        useLocalSDK: shiplySourceConfig.useLocalSDK,
        source: shiplySourceConfig.useLocalSDK ? 'Local Development' : 'NPM Package',
        version: shiplySourceConfig.useLocalSDK ? 'Local' : shiplySourceConfig.npmPackageVersion
    });
}

// Widget Configuration
export const SHIPLY_CONFIG = {
    // API Configuration
    apiKey: process.env.NEXT_PUBLIC_SHIPLY_API_KEY || '',
    websiteId: process.env.NEXT_PUBLIC_SHIPLY_WEBSITE_ID || 'admin-portal',

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

export const SHIPLY_EVENTS = {
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

export type ShiplyEvent = typeof SHIPLY_EVENTS[keyof typeof SHIPLY_EVENTS];

// Export both configurations for backward compatibility
export const shiplyConfig = shiplySourceConfig;
export default shiplySourceConfig;