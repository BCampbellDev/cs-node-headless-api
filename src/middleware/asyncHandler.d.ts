import type { RequestHandler } from "express";
/**
 * Wrap async route handlers so thrown/rejected errors go to Express error middleware.
 */
export default function asyncHandler(fn: RequestHandler): RequestHandler;
//# sourceMappingURL=asyncHandler.d.ts.map