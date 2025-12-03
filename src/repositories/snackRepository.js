/**
 * Repository pattern for snack database operations
 * Encapsulates all database queries related to snacks
 */

import { getCollection } from "../config/database.js";
import logger from "../utils/logger.js";

class SnackRepository {
  /**
   * Get collection instance
   * @private
   */
  get collection() {
    return getCollection();
  }

  /**
   * Count total snacks in database
   * @returns {Promise<number>}
   */
  async count() {
    try {
      const count = await this.collection.countDocuments({});
      logger.debug(`Total snacks in database: ${count}`);
      return count;
    } catch (error) {
      logger.error("Error counting snacks", error);
      throw error;
    }
  }

  /**
   * Find snack by name
   * @param {string} name - Snack name
   * @returns {Promise<object|null>}
   */
  async findByName(name) {
    try {
      const snack = await this.collection.findOne({ name });
      logger.debug(`Found snack by name: ${name}`, snack ? "exists" : "not found");
      return snack;
    } catch (error) {
      logger.error(`Error finding snack by name: ${name}`, error);
      throw error;
    }
  }

  /**
   * Find all snacks
   * @param {object} projection - MongoDB projection object
   * @returns {Promise<object[]>}
   */
  async findAll(projection = {}) {
    try {
      const snacks = await this.collection.find({}, { projection }).toArray();
      logger.debug(`Retrieved ${snacks.length} snacks from database`);
      return snacks;
    } catch (error) {
      logger.error("Error finding all snacks", error);
      throw error;
    }
  }

  /**
   * Find all snacks except the specified one
   * @param {string} excludeName - Name to exclude
   * @returns {Promise<object[]>}
   */
  async findAllExcept(excludeName) {
    try {
      const snacks = await this.collection
        .find({ name: { $ne: excludeName } })
        .toArray();
      logger.debug(
        `Retrieved ${snacks.length} snacks excluding: ${excludeName}`
      );
      return snacks;
    } catch (error) {
      logger.error(`Error finding snacks excluding: ${excludeName}`, error);
      throw error;
    }
  }

  /**
   * Insert a single snack
   * @param {object} snack - Snack document
   * @returns {Promise<object>}
   */
  async insertOne(snack) {
    try {
      const result = await this.collection.insertOne(snack);
      logger.info(`Inserted snack: ${snack.name}`, result.insertedId);
      return result;
    } catch (error) {
      logger.error(`Error inserting snack: ${snack.name}`, error);
      throw error;
    }
  }

  /**
   * Insert multiple snacks
   * @param {object[]} snacks - Array of snack documents
   * @returns {Promise<object>}
   */
  async insertMany(snacks) {
    try {
      const result = await this.collection.insertMany(snacks);
      logger.info(`Inserted ${snacks.length} snacks into database`);
      return result;
    } catch (error) {
      logger.error(`Error inserting ${snacks.length} snacks`, error);
      throw error;
    }
  }

  /**
   * Check if snack exists
   * @param {string} name - Snack name
   * @returns {Promise<boolean>}
   */
  async exists(name) {
    try {
      const count = await this.collection.countDocuments({ name }, { limit: 1 });
      return count > 0;
    } catch (error) {
      logger.error(`Error checking if snack exists: ${name}`, error);
      throw error;
    }
  }
}

export default new SnackRepository();

