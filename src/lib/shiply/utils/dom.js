/**
 * DOM utility functions
 */

/**
 * Create a DOM element with attributes and styles
 * @param {string} tagName - HTML tag name
 * @param {Object} options - Element options
 * @returns {HTMLElement} Created element
 */
export function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  // Set attributes
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  // Set properties
  Object.keys(options).forEach(key => {
    if (key === 'attributes' || key === 'style' || key === 'events') {
      return;
    }

    if (key === 'className') {
      element.className = options[key];
    } else if (key === 'textContent') {
      element.textContent = options[key];
    } else if (key === 'innerHTML') {
      element.innerHTML = options[key];
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, options[key]);
    } else {
      element[key] = options[key];
    }
  });

  // Set styles
  if (options.style) {
    Object.assign(element.style, options.style);
  }

  return element;
}

/**
 * Add event listeners to an element
 * @param {HTMLElement} element - Target element
 * @param {Object} events - Event listeners object
 */
export function addEventListeners(element, events) {
  // Validate inputs
  if (!element || !events || typeof events !== 'object') {
    console.warn('addEventListeners: Invalid element or events object');
    return;
  }

  try {
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        element.addEventListener(event, handler);
      } else {
        console.warn(
          `addEventListeners: Handler for event '${event}' is not a function`
        );
      }
    });
  } catch (error) {
    console.error('Error adding event listeners:', error);
  }
}

/**
 * Remove event listeners from an element
 * @param {HTMLElement} element - Target element
 * @param {Object} events - Event listeners object
 */
export function removeEventListeners(element, events) {
  // Validate inputs
  if (!element || !events || typeof events !== 'object') {
    console.warn('removeEventListeners: Invalid element or events object');
    return;
  }

  try {
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        element.removeEventListener(event, handler);
      }
    });
  } catch (error) {
    console.error('Error removing event listeners:', error);
  }
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get element position relative to viewport
 * @param {HTMLElement} element - Element to get position for
 * @returns {Object} Position object with top, left, bottom, right
 */
export function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Scroll element into view
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
export function scrollIntoView(element, options = {}) {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  };

  element.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * Add CSS class to element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name to add
 */
export function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ` ${className}`;
  }
}

/**
 * Remove CSS class from element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name to remove
 */
export function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(
      new RegExp(`(^|\\s)${className}(\\s|$)`, 'g'),
      ' '
    );
  }
}

/**
 * Toggle CSS class on element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name to toggle
 * @returns {boolean} True if class was added, false if removed
 */
export function toggleClass(element, className) {
  if (element.classList) {
    return element.classList.toggle(className);
  } else {
    const hasClass = element.className.indexOf(className) > -1;
    if (hasClass) {
      removeClass(element, className);
    } else {
      addClass(element, className);
    }
    return !hasClass;
  }
}

/**
 * Check if element has CSS class
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name to check
 * @returns {boolean} True if element has class
 */
export function hasClass(element, className) {
  if (element.classList) {
    return element.classList.contains(className);
  } else {
    return element.className.indexOf(className) > -1;
  }
}

/**
 * Get computed style of element
 * @param {HTMLElement} element - Target element
 * @param {string} property - CSS property name
 * @returns {string} Computed style value
 */
export function getComputedStyle(element, property) {
  return window.getComputedStyle(element)[property];
}

/**
 * Set multiple styles on element
 * @param {HTMLElement} element - Target element
 * @param {Object} styles - Styles object
 */
export function setStyles(element, styles) {
  Object.assign(element.style, styles);
}

/**
 * Get element dimensions
 * @param {HTMLElement} element - Target element
 * @returns {Object} Dimensions object with width and height
 */
export function getDimensions(element) {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Wait for element to be available in DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<HTMLElement>} Promise that resolves with element
 */
export function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}
