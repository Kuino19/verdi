/**
 * Structured Logging Utility
 */

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(level: string, message: string, context?: LogContext) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      environment: process.env.NODE_ENV,
    });
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatLog('INFO', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatLog('WARN', message, context));
  }

  error(message: string, context?: LogContext) {
    console.error(this.formatLog('ERROR', message, context));
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatLog('DEBUG', message, context));
    }
  }

  trace(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.trace(this.formatLog('TRACE', message, context));
    }
  }
}

export const logger = new Logger();
