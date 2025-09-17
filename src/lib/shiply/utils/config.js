/**
 * Configuration utilities
 */

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  apiKey: '',
  websiteId: '',
  apiUrl: 'https://www.shiplyai.com',
  timeout: 10000,
  
  // Widget appearance
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
  },
  
  // Widget position and size
  position: {
    bottom: '20px',
    right: '20px',
  },
  size: {
    width: '350px',
    height: '500px',
  },
  zIndex: 9999,
  
  // Trigger button
  trigger: {
    icon: '💬',
    size: '60px',
    iconSize: '24px',
  },
  
  // Text content
  text: {
    title: 'Share Your Feedback',
    ratingLabel: 'How would you rate your experience?',
    feedbackLabel: 'Tell us more (optional)',
    feedbackPlaceholder: 'Share your thoughts, suggestions, or report any issues...',
    categoryLabel: 'Category',
    submitButton: 'Submit',
    cancelButton: 'Cancel',
  },
  
  // Features
  categories: [],
  autoShow: false,
  autoShowDelay: 5000,
  showOnExit: false,
  
  // User info
  user: {},
};

/**
 * Validate configuration
 * @param {Object} config - Configuration to validate
 * @throws {Error} If configuration is invalid
 */
export function validateConfig(config) {
  if (!config.apiKey) {
    throw new Error('API key is required');
  }
  
  if (!config.websiteId) {
    throw new Error('Website ID is required');
  }
  
  if (config.categories && !Array.isArray(config.categories)) {
    throw new Error('Categories must be an array');
  }
  
  if (config.zIndex && (typeof config.zIndex !== 'number' || config.zIndex < 0)) {
    throw new Error('zIndex must be a positive number');
  }
}

/**
 * Merge configuration with defaults
 * @param {Object} userConfig - User configuration
 * @returns {Object} Merged configuration
 */
export function mergeConfig(userConfig) {
  const config = { ...DEFAULT_CONFIG };
  
  // Deep merge nested objects
  Object.keys(userConfig).forEach(key => {
    if (userConfig[key] && typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
      config[key] = { ...config[key], ...userConfig[key] };
    } else {
      config[key] = userConfig[key];
    }
  });
  
  return config;
}
