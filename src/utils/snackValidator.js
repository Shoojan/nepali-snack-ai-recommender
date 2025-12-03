/**
 * Snack validation utilities
 * Centralized validation logic for snack operations
 */

import snackRepository from "../repositories/snackRepository.js";
import { isValidSnackName, isValidCategory } from "./validation.js";
import { VALID_CATEGORIES } from "../constants/index.js";

/**
 * Validate snack name and check if it already exists
 * @param {string} name - Snack name to validate
 * @throws {Error} If validation fails
 */
export async function validateSnackName(name) {
  if (!isValidSnackName(name)) {
    throw new Error("Snack name is required and must be a valid string");
  }

  const exists = await snackRepository.exists(name);
  if (exists) {
    throw new Error(`Snack '${name}' already exists`);
  }
}

/**
 * Validate snack category
 * @param {string} category - Category to validate
 * @throws {Error} If validation fails
 */
export function validateCategory(category) {
  if (category && !isValidCategory(category)) {
    throw new Error(
      `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`
    );
  }
}

/**
 * Validate snack data for adding a snack
 * @param {object} snackData - Snack data to validate
 * @param {string} snackData.name - Snack name
 * @param {string} snackData.category - Category (optional)
 * @param {string} snackData.description - Description (required for addSnack)
 * @throws {Error} If validation fails
 */
export async function validateSnackData(snackData, requireDescription = false) {
  const { name, category, description } = snackData;

  await validateSnackName(name);
  validateCategory(category);

  if (requireDescription) {
    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      throw new Error("Description is required");
    }
  }
}

