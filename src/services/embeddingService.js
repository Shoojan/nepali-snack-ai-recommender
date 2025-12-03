/**
 * Service for handling embedding generation
 */

import { runPythonScript } from "../utils/pythonRunner.js";
import logger from "../utils/logger.js";
import { isValidVector } from "../utils/validation.js";

class EmbeddingService {
  /**
   * Generate embedding for a single text using Python script
   * @param {string} text - Text to generate embedding for
   * @returns {Promise<number[]>} Embedding vector
   */
  async generateEmbedding(text) {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Text must be a non-empty string");
    }

    try {
      logger.info(`Generating embedding for text: ${text.substring(0, 50)}...`);
      const vector = await runPythonScript("generate_single_embedding.py", [
        text,
      ]);

      if (!isValidVector(vector)) {
        throw new Error("Invalid vector returned from embedding service");
      }

      logger.debug(`Generated embedding vector of length: ${vector.length}`);
      return vector;
    } catch (error) {
      logger.error("Error generating embedding", error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }
}

export default new EmbeddingService();

