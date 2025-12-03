/**
 * API client for making HTTP requests
 * Centralized API communication with error handling
 */

/**
 * Make an API request with error handling
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Response data
 * @throws {Error} If request fails
 */
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    // Try to parse JSON, fallback to text
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json().catch(() => null);
    } else {
      const text = await response.text();
      data = text ? { error: text } : null;
    }

    if (!response.ok) {
      const errorMessage = data?.error || response.statusText || "Request failed";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Re-throw if it's already an Error with message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.message || "Network request failed");
  }
}

/**
 * Get all snacks
 * @returns {Promise<Array>} List of snacks
 */
export async function getSnacks() {
  return apiRequest("/snacks");
}

/**
 * Get recommendations for a snack
 * @param {string} snackName - Name of the snack
 * @returns {Promise<object>} Recommendations object
 */
export async function getRecommendations(snackName) {
  const encodedName = encodeURIComponent(snackName);
  return apiRequest(`/recommend/${encodedName}`);
}

/**
 * Get description options for a snack
 * @param {string} name - Snack name
 * @param {string} category - Snack category (optional)
 * @returns {Promise<object>} Description options
 */
export async function getDescriptionOptions(name, category) {
  return apiRequest("/get-description-options", {
    method: "POST",
    body: JSON.stringify({ name, category }),
  });
}

/**
 * Add a new snack
 * @param {object} snackData - Snack data
 * @param {string} snackData.name - Snack name
 * @param {string} snackData.category - Category
 * @param {string} snackData.description - Description
 * @param {string} snackData.emoji - Emoji (optional)
 * @returns {Promise<object>} Created snack
 */
export async function addSnack(snackData) {
  return apiRequest("/add-snack", {
    method: "POST",
    body: JSON.stringify(snackData),
  });
}

