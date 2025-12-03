/**
 * Utility for running Python scripts with proper error handling
 */

import { spawn, spawnSync } from "child_process";
import logger from "./logger.js";

/**
 * Execute a Python script and return the parsed JSON output
 * @param {string} scriptPath - Path to the Python script
 * @param {string[]} args - Arguments to pass to the script
 * @returns {Promise<any>} Parsed JSON output from the script
 * @throws {Error} If the script fails or returns invalid JSON
 */
export function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    logger.debug(`Running Python script: ${scriptPath} with args:`, args);

    const py = spawn("python3", [scriptPath, ...args], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      logger.warn(`Python stderr: ${chunk.toString()}`);
    });

    py.on("close", (code) => {
      if (code !== 0) {
        const error = new Error(
          `Python script exited with code ${code}. ${stderr || "No error message"}`
        );
        logger.error(`Python script failed: ${scriptPath}`, error);
        reject(error);
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        logger.debug(`Python script succeeded: ${scriptPath}`);
        resolve(result);
      } catch (parseError) {
        logger.error(
          `Failed to parse Python output as JSON: ${stdout}`,
          parseError
        );
        reject(
          new Error(
            `Invalid JSON output from Python script: ${parseError.message}`
          )
        );
      }
    });

    py.on("error", (error) => {
      logger.error(`Failed to spawn Python process: ${scriptPath}`, error);
      reject(new Error(`Failed to execute Python script: ${error.message}`));
    });
  });
}

/**
 * Execute a Python script synchronously (for initialization)
 * @param {string} scriptPath - Path to the Python script
 * @param {string[]} args - Arguments to pass to the script
 * @returns {void}
 * @throws {Error} If the script fails
 */
export function runPythonScriptSync(scriptPath, args = []) {
  logger.debug(`Running Python script synchronously: ${scriptPath} with args:`, args);

  const result = spawnSync("python3", [scriptPath, ...args], {
    stdio: "inherit",
  });

  if (result.error) {
    logger.error(`Python script spawn error: ${scriptPath}`, result.error);
    throw result.error;
  }

  if (result.status !== 0) {
    const error = new Error(
      `Python script exited with code ${result.status}`
    );
    logger.error(`Python script failed: ${scriptPath}`, error);
    throw error;
  }

  logger.debug(`Python script succeeded: ${scriptPath}`);
}

