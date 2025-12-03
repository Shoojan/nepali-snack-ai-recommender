/**
 * Application configuration
 */

import dotenv from "dotenv";

dotenv.config();

/**
 * Validate required environment variables
 */
function validateEnv() {
  const required = ["MONGODB_ATLAS_URI"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Validate on import
validateEnv();

export const config = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_ATLAS_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "INFO",
  huggingfaceToken: process.env.HUGGINGFACE_TOKEN,
};

