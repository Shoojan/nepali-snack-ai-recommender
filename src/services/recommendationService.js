/**
 * Service for generating snack recommendations
 */

import snackRepository from "../repositories/snackRepository.js";
import { cosineSimilarity } from "../utils/math.js";
import logger from "../utils/logger.js";
import { RECOMMENDATION_CONFIG, DEFAULT_CATEGORY } from "../constants/index.js";

/**
 * Calculate weighted score for a recommendation
 * @param {boolean} isSameCategory - Whether snack is in same category
 * @param {number} similarityScore - Cosine similarity score (0-1)
 * @param {boolean} isLiked - Whether user has liked this snack before
 * @returns {number} Weighted score (0-1)
 */
function calculateWeightedScore(
  isSameCategory,
  similarityScore,
  isLiked = false
) {
  const categoryScore = isSameCategory ? 1.0 : 0.0;

  // Weighted combination: 70% category, 30% similarity
  let weightedScore =
    RECOMMENDATION_CONFIG.CATEGORY_WEIGHT * categoryScore +
    RECOMMENDATION_CONFIG.SIMILARITY_WEIGHT * similarityScore;

  // Add boost for liked snacks
  if (isLiked) {
    weightedScore = Math.min(
      1.0,
      weightedScore + RECOMMENDATION_CONFIG.LIKED_BOOST
    );
  }

  return weightedScore;
}

class RecommendationService {
  /**
   * Get recommendations for a snack
   * @param {string} snackName - Name of the snack to get recommendations for
   * @param {Set<string>} likedSnacks - Set of snack names user has liked (optional)
   * @returns {Promise<object>} Recommendations with scores
   */
  async getRecommendations(snackName, likedSnacks = new Set()) {
    if (!snackName || typeof snackName !== "string") {
      throw new Error("Snack name must be a non-empty string");
    }

    try {
      logger.info(`Getting recommendations for: ${snackName}`);

      // Get the target snack
      const snack = await snackRepository.findByName(snackName);
      if (!snack) {
        logger.warn(`Snack not found: ${snackName}`);
        throw new Error(`Snack '${snackName}' not found`);
      }

      if (!snack.vector || !Array.isArray(snack.vector)) {
        logger.error(`Snack ${snackName} has invalid vector`);
        throw new Error(`Snack '${snackName}' has invalid embedding vector`);
      }

      const category = snack.category;

      // Get all snacks except the current one
      const allSnacks = await snackRepository.findAllExcept(snackName);
      if (allSnacks.length === 0) {
        logger.warn("No other snacks found for recommendations");
        return { recommendations: [] };
      }

      // Calculate weighted scores for all snacks
      const recommendations = allSnacks
        .map((s) => {
          if (!s.vector || !Array.isArray(s.vector)) {
            logger.warn(`Snack ${s.name} has invalid vector, skipping`);
            return null;
          }

          try {
            const similarityScore = cosineSimilarity(snack.vector, s.vector);
            const isSameCategory = s.category === category;
            const isLiked = likedSnacks.has(s.name);

            // Calculate weighted score: 70% category, 30% similarity, + boost for liked
            const weightedScore = calculateWeightedScore(
              isSameCategory,
              similarityScore,
              isLiked
            );

            return {
              snack: s,
              similarityScore, // Keep original similarity for display
              weightedScore, // Use weighted score for ranking
              isSameCategory,
              isLiked,
            };
          } catch (error) {
            logger.error(`Error calculating similarity for ${s.name}`, error);
            return null;
          }
        })
        .filter((rec) => rec !== null) // Remove invalid recommendations
        .filter(
          (rec) =>
            rec.similarityScore >= RECOMMENDATION_CONFIG.SIMILARITY_THRESHOLD
        ) // Filter by similarity threshold
        .sort((a, b) => b.weightedScore - a.weightedScore) // Sort by weighted score
        .slice(0, RECOMMENDATION_CONFIG.MAX_RECOMMENDATIONS)
        .map((rec) => ({
          name: rec.snack.name,
          emoji: rec.snack.emoji,
          category: rec.snack.category,
          score: rec.weightedScore, // Use weighted score for display
          similarityScore: rec.similarityScore, // Keep for reference
          isSameCategory: rec.isSameCategory,
          isLiked: rec.isLiked,
        }));

      logger.info(
        `Generated ${recommendations.length} recommendations for ${snackName}`
      );

      return { recommendations };
    } catch (error) {
      logger.error(`Error getting recommendations for ${snackName}`, error);
      throw error;
    }
  }
}

export default new RecommendationService();
