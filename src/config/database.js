/**
 * Database configuration and connection management
 */

import { MongoClient } from "mongodb";
import logger from "../utils/logger.js";
import { DB_CONFIG } from "../constants/index.js";

let client = null;
let db = null;
let collection = null;

/**
 * Initialize database connection
 * @param {string} connectionString - MongoDB connection string
 * @returns {Promise<void>}
 */
export async function connectDatabase(connectionString) {
  try {
    logger.info("Connecting to MongoDB...");
    client = new MongoClient(connectionString);
    await client.connect();
    
    db = client.db(DB_CONFIG.DB_NAME);
    collection = db.collection(DB_CONFIG.COLLECTION_NAME);
    
    logger.info("Successfully connected to MongoDB");
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

/**
 * Get the database instance
 * @returns {object} MongoDB database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDatabase() first.");
  }
  return db;
}

/**
 * Get the snacks collection
 * @returns {object} MongoDB collection instance
 */
export function getCollection() {
  if (!collection) {
    throw new Error("Collection not initialized. Call connectDatabase() first.");
  }
  return collection;
}

/**
 * Close database connection
 * @returns {Promise<void>}
 */
export async function closeDatabase() {
  if (client) {
    try {
      await client.close();
      logger.info("Database connection closed");
    } catch (error) {
      logger.error("Error closing database connection", error);
      throw error;
    }
  }
}

/**
 * Check if database is connected
 * @returns {boolean}
 */
export function isConnected() {
  return client !== null && client.topology?.isConnected();
}

