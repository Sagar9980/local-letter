import type { Request, Response } from "express";
import { ApiResponse } from "../lib/api-response";
import { buildPaginationMeta, parsePagination } from "../lib/pagination";
import * as apiKeyService from "../services/api-key.service";

export async function listApiKeys(req: Request, res: Response) {
  const pagination = parsePagination(req.query);
  const { items, total } = await apiKeyService.listApiKeys(
    String(req.params.slug),
    req.user!.id,
    pagination,
  );
  ApiResponse.success(res, items, {
    message: "API keys fetched successfully",
    pagination: buildPaginationMeta(pagination.page, pagination.limit, total),
  });
}

export async function createApiKey(req: Request, res: Response) {
  const { name } = req.body ?? {};
  const apiKey = await apiKeyService.createApiKey(String(req.params.slug), req.user!.id, name);
  ApiResponse.success(res, apiKey, { message: "API key created successfully", statusCode: 201 });
}

export async function revokeApiKey(req: Request, res: Response) {
  await apiKeyService.revokeApiKey(String(req.params.slug), req.user!.id, String(req.params.id));
  ApiResponse.success(res, null, { message: "API key revoked successfully" });
}
