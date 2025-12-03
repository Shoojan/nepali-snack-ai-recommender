/**
 * Service for generating snack descriptions using AI
 */

import { runPythonScript } from "../utils/pythonRunner.js";
import logger from "../utils/logger.js";

class DescriptionService {
  /**
   * Generate AI description for a snack
   * @param {string} name - Snack name
   * @returns {Promise<string>} Generated description
   */
  async generateDescription(name) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      logger.warn("Invalid snack name provided!");
      return null;
    }

    try {
      logger.info(`Generating AI description for: ${name}`);
      const description = await runPythonScript("generate_description.py", [
        name,
      ]);

      if (!description || typeof description !== "string") {
        logger.warn(
          description
            ? `Invalid description returned for ${name}: ${description}`
            : `No description returned for ${name}`
        );
        return null;
      }

      logger.debug(
        `Generated description for ${name}: ${description.substring(0, 50)}...`
      );
      return description;
    } catch (error) {
      logger.error(`Error generating description for ${name}`, error);
      return null;
    }
  }
}

export default new DescriptionService();
