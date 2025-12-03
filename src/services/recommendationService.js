/**
 * Service for generating snack recommendations
 */

import snackRepository from "../repositories/snackRepository.js";
import { cosineSimilarity } from "../utils/math.js";
import logger from "../utils/logger.js";
import {
  RECOMMENDATION_CONFIG,
  DEFAULT_CATEGORY,
} from "../constants/index.js";

class RecommendationService {
  /**
   * Get recommendations for a snack
   * @param {string} snackName - Name of the snack to get recommendations for
   * @returns {Promise<object>} Recommendations with scores
   */
  async getRecommendations(snackName) {
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

      // Get all other snacks
      const allSnacks = await snackRepository.findAllExcept(snackName);

      if (allSnacks.length === 0) {
        logger.warn("No other snacks found for recommendations");
        return { recommendations: [] };
      }

      // Calculate similarity scores
      const recommendations = allSnacks
        .map((s) => {
          if (!s.vector || !Array.isArray(s.vector)) {
            logger.warn(`Snack ${s.name} has invalid vector, skipping`);
            return null;
          }

          try {
            let score = cosineSimilarity(snack.vector, s.vector);

            // Apply category boost
            if (s.category === snack.category) {
              score += RECOMMENDATION_CONFIG.CATEGORY_BOOST;
            }

            return {
              name: s.name,
              emoji: s.emoji || "🍴",
              category: s.category || DEFAULT_CATEGORY,
              score: Math.min(score, 1.0), // Cap at 1.0
            };
          } catch (error) {
            logger.error(`Error calculating similarity for ${s.name}`, error);
            return null;
          }
        })
        .filter((rec) => rec !== null) // Remove invalid recommendations
        .filter(
          (rec) => rec.score >= RECOMMENDATION_CONFIG.SIMILARITY_THRESHOLD
        ) // Filter by threshold
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, RECOMMENDATION_CONFIG.MAX_RECOMMENDATIONS); // Limit results

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

