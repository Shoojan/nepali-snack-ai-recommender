/**
 * User preferences utilities
 * Handles tracking user likes and preferences
 */

/**
 * Get liked snacks from localStorage
 * @returns {Set<string>} Set of liked snack names
 */
export function getLikedSnacks() {
  try {
    const liked = localStorage.getItem("likedSnacks");
    if (liked) {
      return new Set(JSON.parse(liked));
    }
  } catch (error) {
    console.error("Error reading liked snacks from localStorage", error);
  }
  return new Set();
}

/**
 * Add a snack to liked snacks
 * @param {string} snackName - Name of the snack to like
 */
export function likeSnack(snackName) {
  try {
    const liked = getLikedSnacks();
    liked.add(snackName);
    localStorage.setItem("likedSnacks", JSON.stringify(Array.from(liked)));
  } catch (error) {
    console.error("Error saving liked snack to localStorage", error);
  }
}

/**
 * Remove a snack from liked snacks
 * @param {string} snackName - Name of the snack to unlike
 */
export function unlikeSnack(snackName) {
  try {
    const liked = getLikedSnacks();
    liked.delete(snackName);
    localStorage.setItem("likedSnacks", JSON.stringify(Array.from(liked)));
  } catch (error) {
    console.error("Error removing liked snack from localStorage", error);
  }
}

/**
 * Check if a snack is liked
 * @param {string} snackName - Name of the snack to check
 * @returns {boolean} True if liked
 */
export function isLiked(snackName) {
  return getLikedSnacks().has(snackName);
}

