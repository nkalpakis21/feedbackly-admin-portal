import ShipWidget from '../widget/ShipWidget';
import ApiClient from '../api/ApiClient';
import { validateConfig, mergeConfig } from '../utils/config';
import { generateUserId, getSessionId } from '../utils/session';

/**
 * Main Shiply SDK class
 */
class Shiply {
  constructor(config = {}) {
    this.config = mergeConfig(config);
    this.widget = null;
    this.apiClient = null;
    this.isInitialized = false;
    this.sessionId = getSessionId();
    this.userId = generateUserId();
  }

  /**
   * Initialize the Shiply SDK
   * @param {Object} config - Configuration object
   */
  init(config = {}) {
    try {
      // Merge with existing config
      this.config = mergeConfig({ ...this.config, ...config });

      // Validate configuration
      validateConfig(this.config);

      // Initialize API client
      this.apiClient = new ApiClient(this.config);

      // Create feedback widget
      this.widget = new ShipWidget(this.config, this.apiClient);

      this.isInitialized = true;

      console.log('Shiply SDK initialized successfully');

      return this;
    } catch (error) {
      console.error('Failed to initialize Shiply SDK:', error);
      throw error;
    }
  }

  /**
   * Show the feedback widget
   */
  show() {
    if (!this.isInitialized) {
      throw new Error('Shiply SDK not initialized. Call init() first.');
    }

    this.widget.show();
  }

  /**
   * Hide the feedback widget
   */
  hide() {
    if (!this.isInitialized) {
      throw new Error('Shiply SDK not initialized. Call init() first.');
    }

    this.widget.hide();
  }

  /**
   * Toggle the feedback widget visibility
   */
  toggle() {
    if (!this.isInitialized) {
      throw new Error('Shiply SDK not initialized. Call init() first.');
    }

    this.widget.toggle();
  }

  /**
   * Set user information
   * @param {Object} userInfo - User information object
   */
  setUser(userInfo) {
    if (!this.isInitialized) {
      throw new Error('Shiply SDK not initialized. Call init() first.');
    }

    this.config.user = { ...this.config.user, ...userInfo };
    this.userId = userInfo.id || this.userId;
  }

  /**
   * Track a custom event
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Event data
   */
  track(eventName, eventData = {}) {
    if (!this.isInitialized) {
      throw new Error('Shiply SDK not initialized. Call init() first.');
    }

    this.apiClient.trackEvent(eventName, {
      ...eventData,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Submit feedback programmatically
   * @param {Object} feedbackData - Feedback data
   */
  submitFeedback(feedbackData) {
    if (!this.isInitialized) {
      throw new Error('Shiply SDK not initialized. Call init() first.');
    }

    return this.apiClient.submitFeedback({
      ...feedbackData,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    this.config = mergeConfig({ ...this.config, ...newConfig });

    if (this.widget) {
      this.widget.updateConfig(this.config);
    }
  }

  /**
   * Destroy the SDK instance
   */
  destroy() {
    if (this.widget) {
      this.widget.destroy();
      this.widget = null;
    }

    this.apiClient = null;
    this.isInitialized = false;
  }
}

export default Shiply;
