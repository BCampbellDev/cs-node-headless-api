import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrap async route handlers so thrown/rejected errors go to Express error middleware.
 */
export default function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
