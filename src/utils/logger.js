/**
 * Logger utility with different log levels
 * Provides structured logging with timestamps and log levels
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const LOG_LEVEL_NAMES = {
  0: "ERROR",
  1: "WARN",
  2: "INFO",
  3: "DEBUG",
};

class Logger {
  constructor(level = LOG_LEVELS.INFO) {
    this.level = level;
  }

  _log(level, message, ...args) {
    if (level <= this.level) {
      const timestamp = new Date().toISOString();
      const levelName = LOG_LEVEL_NAMES[level];
      const prefix = `[${timestamp}] [${levelName}]`;
      
      if (level === LOG_LEVELS.ERROR) {
        console.error(prefix, message, ...args);
      } else if (level === LOG_LEVELS.WARN) {
        console.warn(prefix, message, ...args);
      } else {
        console.log(prefix, message, ...args);
      }
    }
  }

  error(message, ...args) {
    this._log(LOG_LEVELS.ERROR, message, ...args);
  }

  warn(message, ...args) {
    this._log(LOG_LEVELS.WARN, message, ...args);
  }

  info(message, ...args) {
    this._log(LOG_LEVELS.INFO, message, ...args);
  }

  debug(message, ...args) {
    this._log(LOG_LEVELS.DEBUG, message, ...args);
  }
}

// Create singleton instance
const logger = new Logger(
  process.env.LOG_LEVEL === "DEBUG" 
    ? LOG_LEVELS.DEBUG 
    : process.env.LOG_LEVEL === "WARN"
    ? LOG_LEVELS.WARN
    : LOG_LEVELS.INFO
);

export default logger;

