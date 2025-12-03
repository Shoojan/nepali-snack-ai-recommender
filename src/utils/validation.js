/**
 * Validation utilities
 */

import { VALID_CATEGORIES } from "../constants/index.js";

/**
 * Validate snack name
 * @param {string} name - Snack name to validate
 * @returns {boolean} True if valid
 */
export function isValidSnackName(name) {
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    name.trim().length <= 100
  );
}

/**
 * Validate snack category
 * @param {string} category - Category to validate
 * @returns {boolean} True if valid
 */
export function isValidCategory(category) {
  return !category || VALID_CATEGORIES.includes(category);
}

/**
 * Validate embedding vector
 * @param {any} vector - Vector to validate
 * @returns {boolean} True if valid
 */
export function isValidVector(vector) {
  return (
    Array.isArray(vector) &&
    vector.length > 0 &&
    vector.every((v) => typeof v === "number" && !isNaN(v))
  );
}

/**
 * Extract emoji from text or return default based on category
 * @param {string} text - Text to extract emoji from
 * @param {string} category - Category for default emoji
 * @returns {string} Emoji string
 */
export function extractOrDefaultEmoji(text, category = "Street Food") {
  if (typeof text === "string") {
    const emojiMatch = text.match(/[\u{1F300}-\u{1FAFF}]/u);
    if (emojiMatch) {
      return emojiMatch[0];
    }
  }

  // Default emojis by category
  const defaultEmojis = {
    Dessert: "🍬",
    "Street Food": "🥟",
    "Traditional Meal": "🍲",
    Other: "🍴",
  };

  return defaultEmojis[category] || defaultEmojis.Other;
}

