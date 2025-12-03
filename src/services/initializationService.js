/**
 * Service for initializing the database with snack data
 */

import fs from "fs";
import snackRepository from "../repositories/snackRepository.js";
import { runPythonScriptSync } from "../utils/pythonRunner.js";
import logger from "../utils/logger.js";

class InitializationService {
  /**
   * Initialize database with snacks from JSON file
   * Generates the file if it doesn't exist
   * @returns {Promise<void>}
   */
  async initializeDatabase() {
    try {
      const snackCount = await snackRepository.count();

      if (snackCount > 0) {
        logger.info(`Database already contains ${snackCount} snacks. Skipping initialization.`);
        return;
      }

      logger.info("Database is empty. Starting initialization...");

      // Check if snack_embeddings.json exists
      if (!fs.existsSync("snack_embeddings.json")) {
        logger.info("snack_embeddings.json not found. Generating using Python...");
        try {
          runPythonScriptSync("generate_embeddings.py", []);
          logger.info("Successfully generated snack_embeddings.json");
        } catch (error) {
          logger.error("Failed to generate snack_embeddings.json", error);
          throw new Error(
            "Failed to generate initial embeddings. Server cannot start without initial data."
          );
        }
      }

      // Load and insert snacks
      await this.loadSnacksFromFile();
    } catch (error) {
      logger.error("Error during database initialization", error);
      throw error;
    }
  }

  /**
   * Load snacks from JSON file and insert into database
   * @private
   * @returns {Promise<void>}
   */
  async loadSnacksFromFile() {
    try {
      logger.info("Loading snacks from snack_embeddings.json...");

      const fileContent = fs.readFileSync("snack_embeddings.json", "utf-8");
      const snacksObj = JSON.parse(fileContent);

      // Convert object to array of documents, adding the name field
      const snacksArray = Object.entries(snacksObj).map(([name, data]) => ({
        ...data,
        name,
      }));

      if (snacksArray.length === 0) {
        logger.warn("No snacks found in snack_embeddings.json");
        return;
      }

      await snackRepository.insertMany(snacksArray);
      logger.info(
        `Successfully loaded ${snacksArray.length} snacks into MongoDB!`
      );
    } catch (error) {
      logger.error("Failed to load snack_embeddings.json into MongoDB", error);
      throw new Error(
        `Failed to load initial snacks: ${error.message}`
      );
    }
  }
}

export default new InitializationService();

