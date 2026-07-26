import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../lib/api-response";
import { ApiError, isUniqueConstraintError } from "../lib/errors";

// Mounted last, after all routes. Controllers/services throw ApiError
// subclasses (or let Prisma errors bubble up) instead of formatting
// responses inline — this is the single place that turns them into the
// standard error envelope.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    ApiResponse.error(res, err.message, err.status);
    return;
  }

  if (isUniqueConstraintError(err)) {
    ApiResponse.error(res, "Resource already exists", 409);
    return;
  }

  console.error(err);
  ApiResponse.error(res, "Internal server error", 500);
}
