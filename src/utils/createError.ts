/**
 * Custom Error class for HTTP errors with status codes
 * Integrates with the existing error handling middleware
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distingue errores operacionales de bugs

    // Mantiene el stack trace correcto
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Factory function para crear errores HTTP personalizados
 * Uso: throw createError('Resource not found', 404);
 */
export const createError = (message: string, statusCode: number = 500): AppError => {
  return new AppError(message, statusCode);
};

/**
 * Error presets comunes para mantener consistencia
 */
export const ErrorTypes = {
  NotFound: (resource: string = 'Resource') => createError(`${resource} not found`, 404),
  BadRequest: (message: string = 'Bad request') => createError(message, 400),
  Unauthorized: (message: string = 'Unauthorized') => createError(message, 401),
  Forbidden: (message: string = 'Forbidden') => createError(message, 403),
  Conflict: (message: string = 'Resource already exists') => createError(message, 409),
  ValidationError: (message: string = 'Validation failed') => createError(message, 422),
  InternalError: (message: string = 'Internal server error') => createError(message, 500)
};