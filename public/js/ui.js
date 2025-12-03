/**
 * UI utility functions
 * Centralized DOM manipulation and UI state management
 */

/**
 * Show message in results div
 * @param {string} message - Message to display
 * @param {string} className - CSS class name
 */
export function showMessage(message, className = "loading-message") {
  const resultsDiv = document.getElementById("results");
  if (resultsDiv) {
    resultsDiv.innerHTML = `<div class="${className}">${message}</div>`;
  }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
export function showError(message) {
  showMessage(`${message} 😢`, "error-message");
}

/**
 * Show loading state
 * @param {string} message - Loading message
 */
export function showLoading(message = "Loading...") {
  showMessage(`${message} 🍪`, "loading-message");
}

/**
 * Show empty state
 */
export function showEmptyState() {
  showMessage("No recommendations found. Try another snack! 🍴", "empty-message");
}

/**
 * Clear results div
 */
export function clearResults() {
  const resultsDiv = document.getElementById("results");
  if (resultsDiv) {
    resultsDiv.innerHTML = "";
  }
}

/**
 * Set button loading state
 * @param {HTMLElement} button - Button element
 * @param {boolean} isLoading - Loading state
 * @param {string} loadingText - Text to show when loading
 */
export function setButtonLoading(button, isLoading, loadingText = "Loading...") {
  if (!button) return;
  
  const originalText = button.textContent;
  button.disabled = isLoading;
  
  if (isLoading) {
    button.dataset.originalText = originalText;
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.originalText || originalText;
    delete button.dataset.originalText;
  }
}

/**
 * Show status message for adding snack
 * @param {HTMLElement} statusElement - Status element
 * @param {string} message - Status message
 * @param {string} type - Message type: 'info', 'success', 'error'
 */
export function showStatus(statusElement, message, type = "info") {
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.className = `status-message status-${type}`;
  statusElement.style.display = "block";
}

/**
 * Hide status message
 * @param {HTMLElement} statusElement - Status element
 */
export function hideStatus(statusElement) {
  if (statusElement) {
    statusElement.style.display = "none";
  }
}

