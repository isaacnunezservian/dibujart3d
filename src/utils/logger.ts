interface LogLevel {
  INFO: string;
  ERROR: string;
  WARN: string;
  DEBUG: string;
}

const LOG_LEVELS: LogLevel = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
  DEBUG: 'DEBUG'
};

class Logger {
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level}: ${message}`;
  }

  info(message: string): void {
    console.log(this.formatMessage(LOG_LEVELS.INFO, message));
  }

  error(message: string, error?: Error): void {
    console.error(this.formatMessage(LOG_LEVELS.ERROR, message));
    if (error) {
      console.error(error.stack);
    }
  }

  warn(message: string): void {
    console.warn(this.formatMessage(LOG_LEVELS.WARN, message));
  }

  debug(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage(LOG_LEVELS.DEBUG, message));
    }
  }
}

export const logger = new Logger();
