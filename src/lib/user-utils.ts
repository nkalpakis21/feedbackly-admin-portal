import { WidgetConfig } from '@/types';

/**
 * Generates a unique API key for a user
 * Format: sk_live_[32 random characters] (Stripe-style)
 */
export function generateApiKey(): string {
    const prefix = 'sk_live_';
    const randomChars = Array.from({ length: 32 }, () => 
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            .charAt(Math.floor(Math.random() * 62))
    ).join('');
    
    return prefix + randomChars;
}

/**
 * Creates a default widget configuration for new users
 */
export function getDefaultWidgetConfig(): WidgetConfig {
    return {
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
        position: {
            bottom: '20px',
            right: '20px',
        },
        size: {
            width: '350px',
            height: '500px',
        },
        text: {
            title: 'Send us your feedback',
            ratingLabel: 'How would you rate your experience?',
            feedbackLabel: 'Tell us more about your experience (optional)',
            feedbackPlaceholder: 'Share your thoughts, report bugs, or suggest improvements...',
            categoryLabel: 'Feedback Category',
            submitButton: 'Submit Feedback',
            cancelButton: 'Cancel',
        },
        behavior: {
            autoShow: false,
            autoShowDelay: 5000,
            showOnExit: false,
            categories: [
                { value: 'bug', label: 'Bug Report' },
                { value: 'feature', label: 'Feature Request' },
                { value: 'ui', label: 'UI/UX Issue' },
                { value: 'general', label: 'General Feedback' },
            ],
        },
        branding: {
            companyName: '',
            logo: '',
        },
    };
}

/**
 * Validates an API key format
 */
export function isValidApiKey(apiKey: string): boolean {
    return /^sk_live_[a-zA-Z0-9]{32}$/.test(apiKey);
}

/**
 * Gets user by API key from Firestore
 * Note: This function is now implemented in @/lib/firestore.ts
 */
// Removed placeholder function as it's implemented in firestore.ts
