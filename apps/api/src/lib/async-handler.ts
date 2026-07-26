import type { NextFunction, Request, RequestHandler, Response } from "express";

// Wraps an async controller so rejected promises reach Express's error
// middleware instead of crashing the process or hanging the request.
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
