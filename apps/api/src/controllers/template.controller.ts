import type { Request, Response } from "express";
import * as templateService from "../services/template.service";

export async function listTemplates(req: Request, res: Response) {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;

  const templates = await templateService.listTemplates(String(req.params.slug), req.user!.id, {
    q,
    status,
  });
  res.json({ templates });
}

export async function createTemplate(req: Request, res: Response) {
  const { name, key } = req.body ?? {};
  const template = await templateService.createTemplate(
    String(req.params.slug),
    req.user!.id,
    name,
    key,
  );
  res.status(201).json({ template });
}

export async function getTemplate(req: Request, res: Response) {
  const template = await templateService.getTemplate(
    String(req.params.slug),
    req.user!.id,
    String(req.params.key),
  );
  res.json({ template });
}

export async function updateTemplateLocale(req: Request, res: Response) {
  const { subject, htmlBody, designJson } = req.body ?? {};
  const locale = await templateService.updateTemplateLocale(
    String(req.params.slug),
    req.user!.id,
    String(req.params.key),
    subject,
    htmlBody,
    designJson,
  );
  res.json({ locale });
}
