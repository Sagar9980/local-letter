import type { Request, Response } from "express";

export function health(_req: Request, res: Response) {
  res.json({ status: "ok" });
}

export function me(req: Request, res: Response) {
  res.json({ user: req.user });
}

export function whoami(req: Request, res: Response) {
  res.json({ referenceId: req.apiKeyReferenceId });
}
