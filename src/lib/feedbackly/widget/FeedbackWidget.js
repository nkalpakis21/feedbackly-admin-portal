import { createElement, addEventListeners, removeEventListeners } from '../utils/dom';

/**
 * Feedback Widget Component
 */
class FeedbackWidget {
  constructor(config, apiClient) {
    this.config = config;
    this.apiClient = apiClient;
    this.isVisible = false;
    this.isMinimized = false;
    this.widgetElement = null;
    this.triggerButton = null;
    this.feedbackForm = null;
    this.rating = 0;
    this.feedbackText = '';
    this.eventListeners = null;
    
    this.init();
  }

  /**
   * Initialize the widget
   */
  init() {
    this.createWidget();
    this.createTriggerButton();
    this.attachEventListeners();
    this.loadWidgetConfig();
  }

  /**
   * Create the main widget element
   */
  createWidget() {
    this.widgetElement = createElement('div', {
      id: 'feedbackly-widget',
      className: 'feedbackly-widget',
      style: {
        position: 'fixed',
        bottom: this.config.position?.bottom || '20px',
        right: this.config.position?.right || '20px',
        width: this.config.size?.width || '350px',
        height: this.config.size?.height || '500px',
        backgroundColor: this.config.theme?.backgroundColor || '#ffffff',
        border: `1px solid ${this.config.theme?.borderColor || '#e1e5e9'}`,
        borderRadius: this.config.theme?.borderRadius || '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: this.config.zIndex || 9999,
        display: 'none',
        fontFamily: this.config.theme?.fontFamily || 'system-ui, -apple-system, sans-serif',
        fontSize: this.config.theme?.fontSize || '14px',
        color: this.config.theme?.textColor || '#333333',
      },
    });

    this.createWidgetHeader();
    this.createFeedbackForm();
    this.createWidgetFooter();

    document.body.appendChild(this.widgetElement);
  }

  /**
   * Create widget header
   */
  createWidgetHeader() {
    const header = createElement('div', {
      className: 'feedbackly-header',
      style: {
        padding: '16px',
        borderBottom: `1px solid ${this.config.theme?.borderColor || '#e1e5e9'}`,
        backgroundColor: this.config.theme?.headerBackgroundColor || '#f8f9fa',
        borderRadius: `${this.config.theme?.borderRadius || '8px'} ${this.config.theme?.borderRadius || '8px'} 0 0`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    });

    const title = createElement('h3', {
      textContent: this.config.text?.title || 'Share Your Feedback',
      style: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
        color: this.config.theme?.textColor || '#333333',
      },
    });

    const closeButton = createElement('button', {
      className: 'feedbackly-close',
      innerHTML: '×',
      style: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: this.config.theme?.textColor || '#333333',
        padding: '0',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    this.widgetElement.appendChild(header);

    // Add close button event listener
    addEventListeners(closeButton, {
      click: () => this.hide(),
    });
  }

  /**
   * Create feedback form
   */
  createFeedbackForm() {
    const formContainer = createElement('div', {
      className: 'feedbackly-form-container',
      style: {
        padding: '16px',
        flex: 1,
        overflow: 'auto',
      },
    });

    // Rating section
    const ratingSection = this.createRatingSection();
    formContainer.appendChild(ratingSection);

    // Feedback text section
    const textSection = this.createTextSection();
    formContainer.appendChild(textSection);

    // Category section (if enabled)
    if (this.config.categories && this.config.categories.length > 0) {
      const categorySection = this.createCategorySection();
      formContainer.appendChild(categorySection);
    }

    this.widgetElement.appendChild(formContainer);
  }

  /**
   * Create rating section
   */
  createRatingSection() {
    const ratingContainer = createElement('div', {
      className: 'feedbackly-rating',
      style: {
        marginBottom: '16px',
      },
    });

    const ratingLabel = createElement('label', {
      textContent: this.config.text?.ratingLabel || 'How would you rate your experience?',
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
      },
    });

    const starsContainer = createElement('div', {
      className: 'feedbackly-stars',
      style: {
        display: 'flex',
        gap: '4px',
      },
    });

    // Create 5 stars
    for (let i = 1; i <= 5; i++) {
      const star = createElement('button', {
        className: 'feedbackly-star',
        'data-rating': i,
        innerHTML: '★',
        style: {
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#ddd',
          padding: '0',
          transition: 'color 0.2s ease',
        },
      });

      addEventListeners(star, {
        click: () => this.setRating(i),
        mouseenter: () => this.highlightStars(i),
        mouseleave: () => this.resetStarHighlight(),
      });

      starsContainer.appendChild(star);
    }

    ratingContainer.appendChild(ratingLabel);
    ratingContainer.appendChild(starsContainer);

    return ratingContainer;
  }

  /**
   * Create text feedback section
   */
  createTextSection() {
    const textContainer = createElement('div', {
      className: 'feedbackly-text',
      style: {
        marginBottom: '16px',
      },
    });

    const textLabel = createElement('label', {
      textContent: this.config.text?.feedbackLabel || 'Tell us more (optional)',
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
      },
    });

    this.feedbackTextarea = createElement('textarea', {
      className: 'feedbackly-textarea',
      placeholder: this.config.text?.feedbackPlaceholder || 'Share your thoughts, suggestions, or report any issues...',
      style: {
        width: '100%',
        minHeight: '80px',
        padding: '8px',
        border: `1px solid ${this.config.theme?.borderColor || '#e1e5e9'}`,
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'vertical',
        boxSizing: 'border-box',
      },
    });

    // Auto-resize textarea
    addEventListeners(this.feedbackTextarea, {
      input: () => {
        this.feedbackText = this.feedbackTextarea.value;
        this.autoResizeTextarea();
      },
    });

    textContainer.appendChild(textLabel);
    textContainer.appendChild(this.feedbackTextarea);

    return textContainer;
  }

  /**
   * Create category section
   */
  createCategorySection() {
    const categoryContainer = createElement('div', {
      className: 'feedbackly-category',
      style: {
        marginBottom: '16px',
      },
    });

    const categoryLabel = createElement('label', {
      textContent: this.config.text?.categoryLabel || 'Category',
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
      },
    });

    this.categorySelect = createElement('select', {
      className: 'feedbackly-select',
      style: {
        width: '100%',
        padding: '8px',
        border: `1px solid ${this.config.theme?.borderColor || '#e1e5e9'}`,
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'inherit',
        backgroundColor: 'white',
      },
    });

    // Add default option
    const defaultOption = createElement('option', {
      value: '',
      textContent: 'Select a category (optional)',
    });
    this.categorySelect.appendChild(defaultOption);

    // Add category options
    this.config.categories.forEach(category => {
      const option = createElement('option', {
        value: category.value,
        textContent: category.label,
      });
      this.categorySelect.appendChild(option);
    });

    categoryContainer.appendChild(categoryLabel);
    categoryContainer.appendChild(this.categorySelect);

    return categoryContainer;
  }

  /**
   * Create widget footer
   */
  createWidgetFooter() {
    const footer = createElement('div', {
      className: 'feedbackly-footer',
      style: {
        padding: '16px',
        borderTop: `1px solid ${this.config.theme?.borderColor || '#e1e5e9'}`,
        backgroundColor: this.config.theme?.footerBackgroundColor || '#f8f9fa',
        borderRadius: `0 0 ${this.config.theme?.borderRadius || '8px'} ${this.config.theme?.borderRadius || '8px'}`,
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
      },
    });

    const cancelButton = createElement('button', {
      className: 'feedbackly-cancel',
      textContent: this.config.text?.cancelButton || 'Cancel',
      style: {
        padding: '8px 16px',
        border: `1px solid ${this.config.theme?.borderColor || '#e1e5e9'}`,
        borderRadius: '4px',
        backgroundColor: 'white',
        color: this.config.theme?.textColor || '#333333',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'inherit',
      },
    });

    const submitButton = createElement('button', {
      className: 'feedbackly-submit',
      textContent: this.config.text?.submitButton || 'Submit',
      style: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: this.config.theme?.primaryColor || '#007bff',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: '500',
      },
    });

    footer.appendChild(cancelButton);
    footer.appendChild(submitButton);

    // Add event listeners
    addEventListeners(cancelButton, {
      click: () => this.hide(),
    });

    addEventListeners(submitButton, {
      click: () => this.submitFeedback(),
    });

    this.widgetElement.appendChild(footer);
  }

  /**
   * Create trigger button
   */
  createTriggerButton() {
    this.triggerButton = createElement('button', {
      id: 'feedbackly-trigger',
      className: 'feedbackly-trigger',
      innerHTML: this.config.trigger?.icon || '💬',
      style: {
        position: 'fixed',
        bottom: this.config.position?.bottom || '20px',
        right: this.config.position?.right || '20px',
        width: this.config.trigger?.size || '60px',
        height: this.config.trigger?.size || '60px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: this.config.theme?.primaryColor || '#007bff',
        color: 'white',
        fontSize: this.config.trigger?.iconSize || '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: this.config.zIndex || 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      },
    });

    document.body.appendChild(this.triggerButton);

    // Add hover effects
    addEventListeners(this.triggerButton, {
      mouseenter: () => {
        this.triggerButton.style.transform = 'scale(1.1)';
      },
      mouseleave: () => {
        this.triggerButton.style.transform = 'scale(1)';
      },
      click: () => this.toggle(),
    });
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Store event listeners for proper cleanup
    this.eventListeners = {
      click: (event) => {
        if (this.isVisible && 
            !this.widgetElement.contains(event.target) && 
            !this.triggerButton.contains(event.target)) {
          this.hide();
        }
      },
      keydown: (event) => {
        if (event.key === 'Escape' && this.isVisible) {
          this.hide();
        }
      },
    };

    // Attach the event listeners
    addEventListeners(document, this.eventListeners);
  }

  /**
   * Load widget configuration from server
   */
  async loadWidgetConfig() {
    try {
      const serverConfig = await this.apiClient.getWidgetConfig();
      if (serverConfig) {
        this.updateConfig(serverConfig);
      }
    } catch (error) {
      console.error('Failed to load widget config:', error);
    }
  }

  /**
   * Set rating
   */
  setRating(rating) {
    this.rating = rating;
    this.updateStarDisplay();
  }

  /**
   * Update star display
   */
  updateStarDisplay() {
    const stars = this.widgetElement.querySelectorAll('.feedbackly-star');
    stars.forEach((star) => {
      const starRating = parseInt(star.dataset.rating);
      star.style.color = starRating <= this.rating ? '#ffc107' : '#ddd';
    });
  }

  /**
   * Highlight stars on hover
   */
  highlightStars(rating) {
    const stars = this.widgetElement.querySelectorAll('.feedbackly-star');
    stars.forEach((star) => {
      const starRating = parseInt(star.dataset.rating);
      star.style.color = starRating <= rating ? '#ffc107' : '#ddd';
    });
  }

  /**
   * Reset star highlight
   */
  resetStarHighlight() {
    this.updateStarDisplay();
  }

  /**
   * Auto-resize textarea
   */
  autoResizeTextarea() {
    this.feedbackTextarea.style.height = 'auto';
    this.feedbackTextarea.style.height = this.feedbackTextarea.scrollHeight + 'px';
  }

  /**
   * Submit feedback
   */
  async submitFeedback() {
    try {
      const feedbackData = {
        rating: this.rating,
        text: this.feedbackText,
        category: this.categorySelect ? this.categorySelect.value : null,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };

      await this.apiClient.submitFeedbackWithRetry(feedbackData);
      
      this.showThankYouMessage();
      this.resetForm();
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      this.showErrorMessage();
    }
  }

  /**
   * Show thank you message
   */
  showThankYouMessage() {
    const message = createElement('div', {
      className: 'feedbackly-message',
      innerHTML: `
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
          <h3 style="margin: 0 0 8px 0; color: #28a745;">Thank you!</h3>
          <p style="margin: 0; color: #666;">Your feedback has been submitted successfully.</p>
        </div>
      `,
    });

    this.widgetElement.innerHTML = '';
    this.widgetElement.appendChild(message);

    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  /**
   * Show error message
   */
  showErrorMessage() {
    const message = createElement('div', {
      className: 'feedbackly-message',
      innerHTML: `
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
          <h3 style="margin: 0 0 8px 0; color: #dc3545;">Oops!</h3>
          <p style="margin: 0; color: #666;">Something went wrong. Please try again.</p>
        </div>
      `,
    });

    this.widgetElement.innerHTML = '';
    this.widgetElement.appendChild(message);

    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  /**
   * Reset form
   */
  resetForm() {
    this.rating = 0;
    this.feedbackText = '';
    this.feedbackTextarea.value = '';
    if (this.categorySelect) {
      this.categorySelect.value = '';
    }
    this.updateStarDisplay();
  }

  /**
   * Show widget
   */
  show() {
    this.widgetElement.style.display = 'block';
    this.triggerButton.style.display = 'none';
    this.isVisible = true;
    
    // Focus on first input
    setTimeout(() => {
      const firstInput = this.widgetElement.querySelector('input, textarea, select');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  /**
   * Hide widget
   */
  hide() {
    this.widgetElement.style.display = 'none';
    this.triggerButton.style.display = 'flex';
    this.isVisible = false;
    this.resetForm();
  }

  /**
   * Toggle widget visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    // Re-render widget with new config
    this.destroy();
    this.init();
  }

  /**
   * Destroy widget
   */
  destroy() {
    if (this.widgetElement) {
      this.widgetElement.remove();
    }
    if (this.triggerButton) {
      this.triggerButton.remove();
    }
    // Only remove event listeners if they were properly attached
    if (this.eventListeners) {
      removeEventListeners(document, this.eventListeners);
    }
  }
}

export default FeedbackWidget;
