"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTypes = exports.createError = exports.AppError = void 0;
/**
 * Custom Error class for HTTP errors with status codes
 * Integrates with the existing error handling middleware
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distingue errores operacionales de bugs
        // Mantiene el stack trace correcto
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Factory function para crear errores HTTP personalizados
 * Uso: throw createError('Resource not found', 404);
 */
const createError = (message, statusCode = 500) => {
    return new AppError(message, statusCode);
};
exports.createError = createError;
/**
 * Error presets comunes para mantener consistencia
 */
exports.ErrorTypes = {
    NotFound: (resource = 'Resource') => (0, exports.createError)(`${resource} not found`, 404),
    BadRequest: (message = 'Bad request') => (0, exports.createError)(message, 400),
    Unauthorized: (message = 'Unauthorized') => (0, exports.createError)(message, 401),
    Forbidden: (message = 'Forbidden') => (0, exports.createError)(message, 403),
    Conflict: (message = 'Resource already exists') => (0, exports.createError)(message, 409),
    ValidationError: (message = 'Validation failed') => (0, exports.createError)(message, 422),
    InternalError: (message = 'Internal server error') => (0, exports.createError)(message, 500)
};
//# sourceMappingURL=createError.js.map