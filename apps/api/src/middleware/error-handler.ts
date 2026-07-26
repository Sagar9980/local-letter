import type { NextFunction, Request, Response } from "express";
import { ApiError, isUniqueConstraintError } from "../lib/errors";

// Mounted last, after all routes. Controllers/services throw ApiError
// subclasses (or let Prisma errors bubble up) instead of formatting
// responses inline — this is the single place that turns them into JSON.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (isUniqueConstraintError(err)) {
    res.status(409).json({ error: "Resource already exists" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
