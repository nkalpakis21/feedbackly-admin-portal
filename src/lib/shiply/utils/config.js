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
    feedbackPlaceholder:
      'Share your thoughts, suggestions, or report any issues...',
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
  const errors = [];

  // Required fields
  if (!config.apiKey) {
    errors.push('API key is required');
  } else if (typeof config.apiKey !== 'string') {
    errors.push('API key must be a string');
  }

  if (!config.websiteId) {
    errors.push('Website ID is required');
  } else if (typeof config.websiteId !== 'string') {
    errors.push('Website ID must be a string');
  }

  // Optional field validations
  if (config.categories && !Array.isArray(config.categories)) {
    errors.push('Categories must be an array');
  } else if (config.categories) {
    config.categories.forEach((category, index) => {
      if (!category || typeof category !== 'object') {
        errors.push(`Category at index ${index} must be an object`);
      } else if (!category.value || !category.label) {
        errors.push(
          `Category at index ${index} must have 'value' and 'label' properties`
        );
      }
    });
  }

  if (
    config.zIndex !== undefined &&
    (typeof config.zIndex !== 'number' || config.zIndex < 0)
  ) {
    errors.push('zIndex must be a positive number');
  }

  if (
    config.timeout !== undefined &&
    (typeof config.timeout !== 'number' || config.timeout < 1000)
  ) {
    errors.push('Timeout must be a number greater than 1000ms');
  }

  if (
    config.autoShowDelay !== undefined &&
    (typeof config.autoShowDelay !== 'number' || config.autoShowDelay < 0)
  ) {
    errors.push('autoShowDelay must be a non-negative number');
  }

  // Theme validation
  if (config.theme) {
    const colorFields = [
      'primaryColor',
      'backgroundColor',
      'textColor',
      'borderColor',
      'headerBackgroundColor',
      'footerBackgroundColor',
    ];
    colorFields.forEach(field => {
      if (config.theme[field] && !isValidColor(config.theme[field])) {
        errors.push(`Theme ${field} must be a valid color`);
      }
    });

    if (config.theme.fontSize && !isValidFontSize(config.theme.fontSize)) {
      errors.push('Theme fontSize must be a valid CSS font size');
    }
  }

  // Position validation
  if (config.position) {
    const positionFields = ['top', 'bottom', 'left', 'right'];
    positionFields.forEach(field => {
      if (config.position[field] && !isValidCSSValue(config.position[field])) {
        errors.push(`Position ${field} must be a valid CSS value`);
      }
    });
  }

  // Size validation
  if (config.size) {
    if (config.size.width && !isValidCSSValue(config.size.width)) {
      errors.push('Size width must be a valid CSS value');
    }
    if (config.size.height && !isValidCSSValue(config.size.height)) {
      errors.push('Size height must be a valid CSS value');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Check if a value is a valid CSS color
 * @param {string} color - Color value to validate
 * @returns {boolean} True if valid color
 */
function isValidColor(color) {
  if (typeof color !== 'string') return false;

  // Check for hex colors
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return true;

  // Check for rgb/rgba colors
  if (/^rgba?\(/.test(color)) return true;

  // Check for hsl/hsla colors
  if (/^hsla?\(/.test(color)) return true;

  // Check for named colors (basic set)
  const namedColors = [
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'black',
    'white',
    'gray',
    'grey',
    'transparent',
  ];
  if (namedColors.includes(color.toLowerCase())) return true;

  return false;
}

/**
 * Check if a value is a valid CSS font size
 * @param {string} fontSize - Font size value to validate
 * @returns {boolean} True if valid font size
 */
function isValidFontSize(fontSize) {
  if (typeof fontSize !== 'string') return false;

  // Check for pixel values
  if (/^\d+px$/.test(fontSize)) return true;

  // Check for em values
  if (/^\d+(\.\d+)?em$/.test(fontSize)) return true;

  // Check for rem values
  if (/^\d+(\.\d+)?rem$/.test(fontSize)) return true;

  // Check for percentage values
  if (/^\d+(\.\d+)?%$/.test(fontSize)) return true;

  // Check for relative sizes
  const relativeSizes = [
    'smaller',
    'larger',
    'xx-small',
    'x-small',
    'small',
    'medium',
    'large',
    'x-large',
    'xx-large',
  ];
  if (relativeSizes.includes(fontSize)) return true;

  return false;
}

/**
 * Check if a value is a valid CSS value (for position/size)
 * @param {string} value - CSS value to validate
 * @returns {boolean} True if valid CSS value
 */
function isValidCSSValue(value) {
  if (typeof value !== 'string') return false;

  // Check for pixel values
  if (/^\d+px$/.test(value)) return true;

  // Check for percentage values
  if (/^\d+(\.\d+)?%$/.test(value)) return true;

  // Check for em values
  if (/^\d+(\.\d+)?em$/.test(value)) return true;

  // Check for rem values
  if (/^\d+(\.\d+)?rem$/.test(value)) return true;

  // Check for auto
  if (value === 'auto') return true;

  return false;
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
    if (
      userConfig[key] &&
      typeof userConfig[key] === 'object' &&
      !Array.isArray(userConfig[key])
    ) {
      config[key] = { ...config[key], ...userConfig[key] };
    } else {
      config[key] = userConfig[key];
    }
  });

  return config;
}
