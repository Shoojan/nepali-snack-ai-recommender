/**
 * Application constants
 */

export const RECOMMENDATION_CONFIG = {
  SIMILARITY_THRESHOLD: 0.6,
  CATEGORY_BOOST: 0.1,
  MAX_RECOMMENDATIONS: 5,
  // Weighted scoring: 70% category match, 30% embedding similarity
  CATEGORY_WEIGHT: 0.7,
  SIMILARITY_WEIGHT: 0.3,
  // User personalization boost
  LIKED_BOOST: 0.15, // Additional boost for previously liked snacks
};

export const DEFAULT_CATEGORY = "Street Food";

// List of fun adjectives + emojis
const adjectives = [
  "delicious",
  "tasty",
  "mouth-watering",
  "yummy",
  "flavorful",
];
const emojis = ["🥟", "🍢", "🍲", "🍛", "🍬"];

/**
 * Helper function to randomly select an item from an array
 * @param {Array} array - Array to choose from
 * @returns {*} Random item from array
 */
function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export const DEFAULT_DESCRIPTION = (name) =>
  `${name} is a ${choice(adjectives)} Nepali snack ${choice(
    emojis
  )} loved by everyone!`;

export const VALID_CATEGORIES = [
  "Street Food",
  "Traditional Meal",
  "Dessert",
  "Other",
];

export const DB_CONFIG = {
  COLLECTION_NAME: "snacks",
  DB_NAME: "snacksDB",
};

export const EMBEDDING_CONFIG = {
  MODEL_NAME: "all-MiniLM-L6-v2",
  VECTOR_DIMENSION: 384,
};
