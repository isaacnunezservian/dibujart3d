import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => Promise<any>;

/**
 * Wrapper para controllers async que elimina la necesidad de try-catch
 * Automáticamente captura errores y los pasa al error handler middleware
 */
export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};