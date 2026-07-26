import type { Request, Response } from "express";
import * as renderService from "../services/render.service";

export async function renderTemplate(req: Request, res: Response) {
  const { variables, locale, fallbackLocale } = req.body ?? {};
  const result = await renderService.renderTemplate(req.apiKeyProjectId, String(req.params.key), {
    variables,
    locale,
    fallbackLocale,
  });
  res.json(result);
}
