import {
  createElement,
  addEventListeners,
  removeEventListeners,
} from '../utils/dom';

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
    this.eventListeners = null; // Store event listeners for cleanup

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
        width: this.config.size?.width || '400px',
        maxWidth: '90vw',
        backgroundColor: this.config.theme?.backgroundColor || '#ffffff',
        border: `1px solid ${this.config.theme?.borderColor || '#e5e7eb'}`,
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        zIndex: this.config.zIndex || 9999,
        display: 'none',
        fontFamily:
          this.config.theme?.fontFamily ||
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: this.config.theme?.fontSize || '14px',
        color: this.config.theme?.textColor || '#374151',
        overflow: 'hidden',
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
        padding: '24px 24px 16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    });

    const title = createElement('h2', {
      textContent: 'Quick Feedback',
      style: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '600',
        color: this.config.theme?.textColor || '#111827',
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
        color: this.config.theme?.textColor || '#6b7280',
        padding: '8px',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        transition: 'background-color 0.2s ease',
      },
    });

    // Add hover effect for close button
    addEventListeners(closeButton, {
      mouseenter: () => {
        closeButton.style.backgroundColor = '#f3f4f6';
      },
      mouseleave: () => {
        closeButton.style.backgroundColor = 'transparent';
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
        padding: '0 24px',
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
   * Create rating section with emoji-based rating
   */
  createRatingSection() {
    const ratingContainer = createElement('div', {
      className: 'feedbackly-rating',
      style: {
        marginBottom: '20px',
      },
    });

    const ratingLabel = createElement('p', {
      textContent: 'Rate your experience',
      style: {
        fontSize: '14px',
        fontWeight: '500',
        color: this.config.theme?.textColor || '#374151',
        marginBottom: '12px',
        margin: '0 0 12px 0',
      },
    });

    const emojiContainer = createElement('div', {
      className: 'feedbackly-emoji-rating',
      style: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
      },
    });

    // Create emoji rating options
    const ratingOptions = [
      { value: 1, emoji: '😞', label: 'Poor' },
      { value: 2, emoji: '😐', label: 'Okay' },
      { value: 3, emoji: '😍', label: 'Great' },
    ];

    ratingOptions.forEach((option) => {
      const emojiButton = createElement('button', {
        className: 'feedbackly-emoji-option',
        'data-rating': option.value,
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '12px',
          borderRadius: '12px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '60px',
        },
      });

      const emoji = createElement('span', {
        textContent: option.emoji,
        style: {
          fontSize: '24px',
          lineHeight: '1',
        },
      });

      const label = createElement('span', {
        textContent: option.label,
        style: {
          fontSize: '12px',
          fontWeight: '500',
          color: this.config.theme?.textColor || '#6b7280',
        },
      });

      emojiButton.appendChild(emoji);
      emojiButton.appendChild(label);

      addEventListeners(emojiButton, {
        click: () => this.setRating(option.value),
        mouseenter: () => this.highlightEmojiOption(option.value),
        mouseleave: () => this.updateEmojiDisplay(),
      });

      emojiContainer.appendChild(emojiButton);
    });

    ratingContainer.appendChild(ratingLabel);
    ratingContainer.appendChild(emojiContainer);

    return ratingContainer;
  }

  /**
   * Create text feedback section
   */
  createTextSection() {
    const textContainer = createElement('div', {
      className: 'feedbackly-text',
      style: {
        marginBottom: '20px',
      },
    });

    const textLabel = createElement('label', {
      textContent: 'Comments (optional)',
      style: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: this.config.theme?.textColor || '#374151',
        marginBottom: '8px',
      },
    });

    this.feedbackTextarea = createElement('textarea', {
      className: 'feedbackly-textarea',
      placeholder: 'Share your thoughts...',
      style: {
        width: '100%',
        minHeight: '80px',
        padding: '12px',
        border: `1px solid ${this.config.theme?.borderColor || '#d1d5db'}`,
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'none',
        boxSizing: 'border-box',
        backgroundColor: this.config.theme?.backgroundColor || '#ffffff',
        color: this.config.theme?.textColor || '#374151',
        outline: 'none',
        transition: 'border-color 0.2s ease',
      },
    });

    // Auto-resize textarea
    addEventListeners(this.feedbackTextarea, {
      input: () => {
        this.feedbackText = this.feedbackTextarea.value;
        this.autoResizeTextarea();
      },
      focus: () => {
        this.feedbackTextarea.style.borderColor = '#3b82f6';
      },
      blur: () => {
        this.feedbackTextarea.style.borderColor = this.config.theme?.borderColor || '#d1d5db';
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
        marginBottom: '20px',
      },
    });

    const categoryLabel = createElement('label', {
      textContent: 'Category (optional)',
      style: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: this.config.theme?.textColor || '#374151',
        marginBottom: '8px',
      },
    });

    this.categorySelect = createElement('select', {
      className: 'feedbackly-select',
      style: {
        width: '100%',
        padding: '12px',
        border: `1px solid ${this.config.theme?.borderColor || '#d1d5db'}`,
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'inherit',
        backgroundColor: this.config.theme?.backgroundColor || '#ffffff',
        color: this.config.theme?.textColor || '#374151',
        outline: 'none',
        transition: 'border-color 0.2s ease',
        cursor: 'pointer',
      },
    });

    // Add default option
    const defaultOption = createElement('option', {
      value: '',
      textContent: 'Select category',
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

    // Add focus/blur event listeners
    addEventListeners(this.categorySelect, {
      focus: () => {
        this.categorySelect.style.borderColor = '#3b82f6';
      },
      blur: () => {
        this.categorySelect.style.borderColor = this.config.theme?.borderColor || '#d1d5db';
      },
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
        padding: '24px 24px 24px 24px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'space-between',
      },
    });

    const cancelButton = createElement('button', {
      className: 'feedbackly-cancel',
      textContent: 'Cancel',
      style: {
        flex: '1',
        padding: '12px 16px',
        border: `1px solid ${this.config.theme?.borderColor || '#d1d5db'}`,
        borderRadius: '8px',
        backgroundColor: 'transparent',
        color: this.config.theme?.textColor || '#374151',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: '500',
        transition: 'all 0.2s ease',
      },
    });

    const submitButton = createElement('button', {
      className: 'feedbackly-submit',
      textContent: 'Submit',
      disabled: true,
      style: {
        flex: '1',
        padding: '12px 16px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#3b82f6',
        color: 'white',
        cursor: 'not-allowed',
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        opacity: '0.5',
      },
    });

    // Add hover effects
    addEventListeners(cancelButton, {
      mouseenter: () => {
        cancelButton.style.backgroundColor = '#f9fafb';
      },
      mouseleave: () => {
        cancelButton.style.backgroundColor = 'transparent';
      },
    });

    addEventListeners(submitButton, {
      mouseenter: () => {
        if (this.rating > 0) {
          submitButton.style.backgroundColor = '#2563eb';
        }
      },
      mouseleave: () => {
        if (this.rating > 0) {
          submitButton.style.backgroundColor = '#3b82f6';
        }
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
    // Store event listeners for cleanup
    this.eventListeners = {
      click: event => {
        if (
          this.isVisible &&
          this.widgetElement &&
          this.triggerButton &&
          !this.widgetElement.contains(event.target) &&
          !this.triggerButton.contains(event.target)
        ) {
          this.hide();
        }
      },
      keydown: event => {
        if (event.key === 'Escape' && this.isVisible) {
          this.hide();
        }
      },
    };

    // Add event listeners to document
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
    this.updateEmojiDisplay();
    this.updateSubmitButton();
  }

  /**
   * Update emoji display
   */
  updateEmojiDisplay() {
    const emojiOptions = this.widgetElement.querySelectorAll('.feedbackly-emoji-option');
    emojiOptions.forEach(option => {
      const optionRating = parseInt(option.dataset.rating);
      if (optionRating === this.rating) {
        option.style.backgroundColor = '#dbeafe';
        option.style.borderColor = '#3b82f6';
        option.style.transform = 'scale(1.05)';
      } else {
        option.style.backgroundColor = 'transparent';
        option.style.borderColor = 'transparent';
        option.style.transform = 'scale(1)';
      }
    });
  }

  /**
   * Highlight emoji option on hover
   */
  highlightEmojiOption(rating) {
    const emojiOptions = this.widgetElement.querySelectorAll('.feedbackly-emoji-option');
    emojiOptions.forEach(option => {
      const optionRating = parseInt(option.dataset.rating);
      if (optionRating === rating) {
        option.style.backgroundColor = '#f3f4f6';
        option.style.transform = 'scale(1.05)';
      } else {
        option.style.backgroundColor = 'transparent';
        option.style.transform = 'scale(1)';
      }
    });
  }

  /**
   * Update submit button state
   */
  updateSubmitButton() {
    const submitButton = this.widgetElement.querySelector('.feedbackly-submit');
    if (submitButton) {
      if (this.rating > 0) {
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        submitButton.disabled = false;
      } else {
        submitButton.style.opacity = '0.5';
        submitButton.style.cursor = 'not-allowed';
        submitButton.disabled = true;
      }
    }
  }

  /**
   * Auto-resize textarea
   */
  autoResizeTextarea() {
    this.feedbackTextarea.style.height = 'auto';
    this.feedbackTextarea.style.height = `${this.feedbackTextarea.scrollHeight}px`;
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
      const firstInput = this.widgetElement.querySelector(
        'input, textarea, select'
      );
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
    // Remove event listeners first
    if (this.eventListeners) {
      removeEventListeners(document, this.eventListeners);
      this.eventListeners = null;
    }

    // Remove DOM elements
    if (this.widgetElement) {
      this.widgetElement.remove();
      this.widgetElement = null;
    }
    if (this.triggerButton) {
      this.triggerButton.remove();
      this.triggerButton = null;
    }

    // Reset state
    this.isVisible = false;
    this.isMinimized = false;
    this.feedbackForm = null;
    this.rating = 0;
    this.feedbackText = '';
  }
}

export default FeedbackWidget;
