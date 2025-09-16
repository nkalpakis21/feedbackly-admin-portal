/**
 * API Client for communicating with Shiply backend
 */
class ApiClient {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.apiUrl || 'https://api.Shiply.com';
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 10000;
  }

  /**
   * Submit feedback to the API
   * @param {Object} feedbackData - Feedback data
   */
  async submitFeedback(feedbackData) {
    try {
      // TODO: Uncomment when API server is ready
      // In development mode, simulate successful submission
      console.log('Development mode: Simulating feedback submission', feedbackData);
      return { success: true, message: 'Feedback submitted successfully (development mode)' };

      // const response = await this.makeRequest('/api/feedback', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     ...feedbackData,
      //     websiteId: this.config.websiteId,
      //     apiKey: this.apiKey,
      //   }),
      // });

      // return response;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  }

  /**
   * Track a custom event
   * @param {string} eventName - Event name
   * @param {Object} eventData - Event data
   */
  async trackEvent(eventName, eventData) {
    try {
      // TODO: Uncomment when API server is ready
      // In development mode, just log the event
      console.log('Development mode: Event tracked', { eventName, eventData });
      return;

      // const response = await this.makeRequest('/api/events', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     eventName,
      //     eventData,
      //     websiteId: this.config.websiteId,
      //     apiKey: this.apiKey,
      //   }),
      // });

      // return response;
    } catch (error) {
      console.error('Failed to track event:', error);
      // Don't throw for tracking events to avoid breaking user experience
    }
  }

  /**
   * Get widget configuration from server
   */
  async getWidgetConfig() {
    try {
      // TODO: Uncomment when API server is ready
      // Skip API call in development mode
      console.log('Skipping widget config API call in development mode');
      return null;

      // const response = await this.makeRequest(`/api/widget/config/${this.config.websiteId}`, {
      //   method: 'GET',
      // });

      // return response;
    } catch (error) {
      console.error('Failed to get widget config:', error);
      return null;
    }
  }

  /**
   * Make HTTP request with timeout and error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: this.timeout,
    };

    const requestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  /**
   * Send feedback with retry logic
   * @param {Object} feedbackData - Feedback data
   * @param {number} _retries - Number of retries (unused in development mode)
   */
  async submitFeedbackWithRetry(feedbackData, _retries = 3) {
    // TODO: Uncomment when API server is ready
    // For now, just call submitFeedback directly (which simulates success)
    return await this.submitFeedback(feedbackData);

    // for (let i = 0; i < retries; i++) {
    //   try {
    //     return await this.submitFeedback(feedbackData);
    //   } catch (error) {
    //     if (i === retries - 1) {
    //       throw error;
    //     }
        
    //     // Wait before retry (exponential backoff)
    //     await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    //   }
    // }
  }
}

export default ApiClient;
