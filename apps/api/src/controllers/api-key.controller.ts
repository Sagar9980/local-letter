import type { Request, Response } from "express";
import * as apiKeyService from "../services/api-key.service";

export async function listApiKeys(req: Request, res: Response) {
  const apiKeys = await apiKeyService.listApiKeys(String(req.params.slug), req.user!.id);
  res.json({ apiKeys });
}

export async function createApiKey(req: Request, res: Response) {
  const { name } = req.body ?? {};
  const apiKey = await apiKeyService.createApiKey(String(req.params.slug), req.user!.id, name);
  res.status(201).json({ apiKey });
}

export async function revokeApiKey(req: Request, res: Response) {
  await apiKeyService.revokeApiKey(String(req.params.slug), req.user!.id, String(req.params.id));
  res.status(204).end();
}
