import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";
import { ApiResponse } from "../lib/api-response";

declare global {
  namespace Express {
    interface Request {
      user?: Awaited<ReturnType<typeof auth.api.getSession>> extends infer S
        ? S extends { user: infer U }
          ? U
          : never
        : never;
      apiKeyReferenceId?: string;
      apiKeyProjectId?: string;
    }
  }
}

// Dashboard routes: requires a logged-in user session (cookie-based).
export async function requireSession(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) {
    ApiResponse.error(res, "Unauthorized", 401);
    return;
  }
  req.user = session.user;
  next();
}

// SDK-facing routes: requires `Authorization: Bearer <project api key>`.
export async function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const key = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
  if (!key) {
    ApiResponse.error(res, "Missing API key", 401);
    return;
  }

  const result = await auth.api.verifyApiKey({ body: { key } });
  if (!result.valid || !result.key) {
    ApiResponse.error(res, "Invalid API key", 401);
    return;
  }

  req.apiKeyReferenceId = result.key.referenceId ?? undefined;
  req.apiKeyProjectId =
    (result.key as unknown as { projectId?: string | null }).projectId ?? undefined;
  next();
}
