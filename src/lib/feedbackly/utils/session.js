/**
 * Session and user ID utilities
 */

const STORAGE_KEYS = {
  USER_ID: 'feedbackly_user_id',
  SESSION_ID: 'feedbackly_session_id',
  SESSION_START: 'feedbackly_session_start',
};

/**
 * Generate a unique user ID
 * @returns {string} User ID
 */
export function generateUserId() {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  
  return userId;
}

/**
 * Get or create session ID
 * @returns {string} Session ID
 */
export function getSessionId() {
  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    sessionStorage.setItem(STORAGE_KEYS.SESSION_START, new Date().toISOString());
  }
  
  return sessionId;
}

/**
 * Get session start time
 * @returns {string} Session start time
 */
export function getSessionStart() {
  return sessionStorage.getItem(STORAGE_KEYS.SESSION_START) || new Date().toISOString();
}

/**
 * Clear session data
 */
export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION_START);
}

/**
 * Clear all Feedbackly data
 */
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  clearSession();
}
