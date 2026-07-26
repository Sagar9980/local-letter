import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";

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
    res.status(401).json({ error: "Unauthorized" });
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
    res.status(401).json({ error: "Missing API key" });
    return;
  }

  const result = await auth.api.verifyApiKey({ body: { key } });
  if (!result.valid || !result.key) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  req.apiKeyReferenceId = result.key.referenceId ?? undefined;
  req.apiKeyProjectId =
    (result.key as unknown as { projectId?: string | null }).projectId ?? undefined;
  next();
}
