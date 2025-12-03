/**
 * Routes for snack-related endpoints
 */

import express from "express";
import snackService from "../services/snackService.js";
import recommendationService from "../services/recommendationService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * GET /snacks
 * Get all snacks (for dropdown)
 */
router.get(
  "/snacks",
  asyncHandler(async (req, res) => {
    logger.debug("GET /snacks - Fetching all snacks");
    const snacks = await snackService.getAllSnacks();
    res.json(snacks);
  })
);

/**
 * GET /recommend/:snack
 * Get recommendations for a snack
 */
router.get(
  "/recommend/:snack",
  asyncHandler(async (req, res) => {
    const snackName = decodeURIComponent(req.params.snack);
    logger.debug(`GET /recommend/${snackName} - Getting recommendations`);

    const result = await recommendationService.getRecommendations(snackName);
    res.json(result);
  })
);

/**
 * POST /get-description-options
 * Get AI-generated and default description options for user to choose
 */
router.post(
  "/get-description-options",
  asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    logger.debug(`POST /get-description-options - Getting options for: ${name}`);

    const result = await snackService.getDescriptionOptions(name, category);
    res.json(result);
  })
);

/**
 * POST /add-snack
 * Add a new snack with final description (after user confirmation)
 */
router.post(
  "/add-snack",
  asyncHandler(async (req, res) => {
    const { name, category, description, emoji } = req.body;
    logger.debug(`POST /add-snack - Adding snack: ${name}`);

    const result = await snackService.addSnack({
      name,
      category,
      description,
      emoji,
    });

    res.status(201).json(result);
  })
);

export default router;

