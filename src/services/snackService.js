/**
 * Service for snack business logic
 */

import snackRepository from "../repositories/snackRepository.js";
import embeddingService from "./embeddingService.js";
import descriptionService from "./descriptionService.js";
import logger from "../utils/logger.js";
import { extractOrDefaultEmoji } from "../utils/validation.js";
import { validateSnackData, validateSnackName } from "../utils/snackValidator.js";
import { DEFAULT_CATEGORY, DEFAULT_DESCRIPTION } from "../constants/index.js";

class SnackService {
  /**
   * Get all snacks with optional projection
   * @param {object} projection - MongoDB projection
   * @returns {Promise<object[]>}
   */
  async getAllSnacks(projection = { name: 1, emoji: 1, category: 1, _id: 0 }) {
    try {
      return await snackRepository.findAll(projection);
    } catch (error) {
      logger.error("Error getting all snacks", error);
      throw error;
    }
  }

  /**
   * Get description options for a snack (AI-generated and default)
   * Used for user validation before final submission
   * @param {string} name - Snack name
   * @param {string} category - Category (optional)
   * @returns {Promise<object>} Description options
   */
  async getDescriptionOptions(name, category = DEFAULT_CATEGORY) {
    // Validate snack name and check if it exists
    await validateSnackName(name);

    try {
      logger.info(`Getting description options for: ${name}`);

      // Generate AI description
      let aiDescription = null;
      try {
        const generated = await descriptionService.generateDescription(name);
        // Only use if it's a valid non-empty string
        if (generated && typeof generated === "string" && generated.trim().length > 0) {
          aiDescription = generated;
        }
      } catch (error) {
        logger.warn(`Failed to generate AI description for ${name}`, error);
        aiDescription = null;
      }

      const defaultDescription = DEFAULT_DESCRIPTION(name);

      return {
        name: name.trim(),
        category: category || DEFAULT_CATEGORY,
        aiDescription, // Will be null if generation failed
        defaultDescription,
      };
    } catch (error) {
      logger.error(`Error getting description options for ${name}`, error);
      throw error;
    }
  }

  /**
   * Add a new snack with final description
   * @param {object} snackData - Snack data
   * @param {string} snackData.name - Snack name (required)
   * @param {string} snackData.category - Category (optional)
   * @param {string} snackData.description - Description (required)
   * @param {string} snackData.emoji - Emoji (optional, will be extracted or defaulted)
   * @returns {Promise<object>} Created snack
   */
  async addSnack(snackData) {
    const { name, category, description, emoji } = snackData;

    // Validate all snack data (including description requirement)
    await validateSnackData(snackData, true);

    try {
      logger.info(`Adding new snack: ${name}`);

      // Set defaults
      const finalCategory = category || DEFAULT_CATEGORY;
      const finalDescription = description.trim();

      // Extract or default emoji
      const finalEmoji =
        emoji || extractOrDefaultEmoji(finalDescription, finalCategory);

      // Generate embedding
      logger.debug(`Generating embedding for ${name}`);
      const vector = await embeddingService.generateEmbedding(finalDescription);

      // Create snack document
      const snack = {
        name: name.trim(),
        category: finalCategory,
        description: finalDescription,
        emoji: finalEmoji,
        vector,
      };

      // Save to database
      await snackRepository.insertOne(snack);

      logger.info(`Successfully added snack: ${name}`);

      return {
        snack: {
          name: snack.name,
          description: snack.description,
          category: snack.category,
          emoji: snack.emoji,
        },
        message: "Snack added successfully!",
      };
    } catch (error) {
      logger.error(`Error adding snack: ${name}`, error);
      throw error;
    }
  }
}

export default new SnackService();
