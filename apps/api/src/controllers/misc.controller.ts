import type { Request, Response } from "express";
import { ApiResponse } from "../lib/api-response";

export function health(_req: Request, res: Response) {
  ApiResponse.success(res, { status: "ok" }, { message: "Service is healthy" });
}

export function me(req: Request, res: Response) {
  ApiResponse.success(res, req.user, { message: "Current user fetched successfully" });
}

export function whoami(req: Request, res: Response) {
  ApiResponse.success(
    res,
    { referenceId: req.apiKeyReferenceId },
    { message: "API key verified successfully" },
  );
}
