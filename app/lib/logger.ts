/**
 * Logger utility that respects environment modes
 * - Development: logs all messages
 * - Production: only logs errors (sanitized)
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Logs informational messages only in development
   */
  log: (...args: any[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Logs errors in all environments
   * In production, sanitizes sensitive information
   */
  error: (...args: any[]): void => {
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, log errors but sanitize sensitive data
      const sanitized = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          return '[Object]';
        }
        return arg;
      });
      console.error(...sanitized);
    }
  },

  /**
   * Logs warnings only in development
   */
  warn: (...args: any[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Logs success messages only in development
   */
  success: (...args: any[]): void => {
    if (isDevelopment) {
      console.log('✓', ...args);
    }
  },
};
