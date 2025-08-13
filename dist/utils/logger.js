"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const LOG_LEVELS = {
    INFO: 'INFO',
    ERROR: 'ERROR',
    WARN: 'WARN',
    DEBUG: 'DEBUG'
};
class Logger {
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] ${level}: ${message}`;
    }
    info(message) {
        console.log(this.formatMessage(LOG_LEVELS.INFO, message));
    }
    error(message, error) {
        console.error(this.formatMessage(LOG_LEVELS.ERROR, message));
        if (error) {
            console.error(error.stack);
        }
    }
    warn(message) {
        console.warn(this.formatMessage(LOG_LEVELS.WARN, message));
    }
    debug(message) {
        if (process.env.NODE_ENV === 'development') {
            console.log(this.formatMessage(LOG_LEVELS.DEBUG, message));
        }
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map