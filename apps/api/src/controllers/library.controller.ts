import type { Request, Response } from "express";
import { ApiResponse } from "../lib/api-response";
import * as libraryService from "../services/library.service";

export function listPacks(_req: Request, res: Response) {
  ApiResponse.success(res, libraryService.listPacks(), {
    message: "Template packs fetched successfully",
  });
}

export function getPack(req: Request, res: Response) {
  const pack = libraryService.getPackDetail(String(req.params.packId));
  ApiResponse.success(res, pack, { message: "Template pack fetched successfully" });
}

export function getPackTemplate(req: Request, res: Response) {
  const template = libraryService.getPackTemplateDetail(
    String(req.params.packId),
    String(req.params.templateKey),
  );
  ApiResponse.success(res, template, { message: "Template fetched successfully" });
}

export async function importPack(req: Request, res: Response) {
  const { packId, templateKeys, prefix } = req.body ?? {};
  const result = await libraryService.importPack(
    String(req.params.slug),
    req.user!.id,
    packId,
    { templateKeys, prefix },
  );

  ApiResponse.success(res, result, {
    message: `Imported ${result.imported.length} template${result.imported.length === 1 ? "" : "s"}`,
    statusCode: 201,
  });
}
