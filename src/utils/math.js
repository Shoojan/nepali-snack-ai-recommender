/**
 * Mathematical utility functions
 */

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vecA - First vector
 * @param {number[]} vecB - Second vector
 * @returns {number} Cosine similarity score between 0 and 1
 * @throws {Error} If vectors have different lengths or are invalid
 */
export function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
    throw new Error("Both arguments must be arrays");
  }

  if (vecA.length !== vecB.length) {
    throw new Error(
      `Vectors must have the same length. Got ${vecA.length} and ${vecB.length}`
    );
  }

  if (vecA.length === 0) {
    throw new Error("Vectors cannot be empty");
  }

  // Calculate dot product
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);

  // Calculate magnitudes
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  // Avoid division by zero
  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (magA * magB);
}

