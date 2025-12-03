/**
 * Main server file
 * Initializes the application and starts the Express server
 */

import express from "express";
import { config } from "./config/index.js";
import { connectDatabase, closeDatabase } from "./config/database.js";
import initializationService from "./services/initializationService.js";
import snackRoutes from "./routes/snackRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/", snackRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

/**
 * Start the server
 */
async function startServer() {
  try {
    // Connect to database
    await connectDatabase(config.mongodbUri);

    // Initialize database with snacks if empty
    await initializationService.initializeDatabase();

    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await closeDatabase();
          logger.info("Database connection closed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during shutdown", error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

// Start the server
startServer();
